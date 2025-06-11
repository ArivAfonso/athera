from datetime import datetime
import os
import json
import requests
from supabase import create_client, Client
from dotenv import load_dotenv
import openai
from pydantic import BaseModel
from sources import source_configs

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
ai_key: str = os.getenv("AI_API_KEY")
google_api_key: str = os.getenv("GOOGLE_API_KEY")

if not url or not key:
    raise ValueError("Supabase URL and key must be set")

if not google_api_key:
    raise ValueError("Google API key must be set in GOOGLE_API_KEY")

supabase: Client = create_client(url, key)

def modify_string(text: str) -> str:
    # Capitalize every word of the string and replace spaces with '-'
    words = text.split(' ')
    capitalized = [word[0].upper() + word[1:] if word else "" for word in words]
    return '-'.join(capitalized)

from typing import Optional

class ArticleResponse(BaseModel):
    summary: str
    location: str
    tags: str   # New field for additional tags

def get_geojson_from_address(address: str):
    """
    Call Google's Geocoding API to get the coordinates for the provided address
    and return a GeoJSON Point.
    """
    geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": address,
        "key": google_api_key
    }
    try:
        r = requests.get(geocode_url, params=params)
        if r.status_code == 200:
            data = r.json()
            if data.get("results"):
                location = data["results"][0]["geometry"]["location"]
                lat, lon = location["lat"], location["lng"]
                print(f"Geocoded address: {address} to coordinates: {lat}, {lon}")
                point = f'point({lon} {lat})'
                return point  # GeoJSON expects [longitude, latitude]
            else:
                print(f"Google Geocoding API returned no results for address: {address}")
        else:
            print(f"Google Geocoding API error: HTTP {r.status_code}")
    except Exception as e:
        print(f"Error calling Google Geocoding API: {e}")
    return None

def generate_summary(article_text: str, generate_tags: bool = False) -> ArticleResponse:
    client = openai.OpenAI(
        api_key=ai_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )
    prompt = (
        f"Please generate a concise summary (at least 80 words) and generate the Precise address of the location "
        f"(leave empty if too general) of the following article:\n\n{article_text}\n\nSummary:\nLocation:"
    )
    if generate_tags:
        prompt += "\nTags: (if the article categories are less than three, provide additional tags separated by commas)"
    try:
        response = client.beta.chat.completions.parse(
            model="gemini-2.0-flash-lite",
            messages=[
                {"role": "system", "content": "You are working on analysing various news articles"},
                {"role": "user", "content": prompt}
            ],
            response_format=ArticleResponse
        )
        content = response.choices[0].message.parsed
        return ArticleResponse(
            summary=content.summary,
            location=content.location,
            tags=content.tags
        )
    except Exception as e:
        print(f"Error generating summary: {e}")
        return ArticleResponse(summary="", location="", tags="")
    
def generate_embeddings(text: str) -> str:
    client = openai.OpenAI(
        api_key=ai_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )
    response = client.embeddings.create(
        input=text,
        model="text-embedding-004"
    )

    return response.data[0].embedding

def upload_post(articles):
    # Build a list of titles from the incoming articles
    articles = [article for article in articles if article.get("title", "").strip()]
    all_titles = [article.get("title", "").strip() for article in articles]
    
    # Call the Supabase RPC to determine which titles are NOT already in the DB.
    result = supabase.rpc('check_titles', {"news_titles": all_titles}).execute()
    # The RPC returns an array of titles that are missing from the DB.
    unused_titles = result.data if result and result.data else []
    
    if not unused_titles:
        print("No new articles to process. All article titles already exist in the database.")
        return

    print(f"Processing {len(unused_titles)} new articles out of {len(all_titles)} total.")

    # Filter articles to only include those with titles in unused_titles.
    new_articles = [article for article in articles if article.get("title", "").strip() in unused_titles]
    
    # Detect sources with repetitive topics
    source_categories = {}
    source_article_count = {}
    
    # Group articles by source and count categories
    for article in new_articles:
        source = article.get("source", "").lower()
        if source not in source_categories:
            source_categories[source] = {}
            source_article_count[source] = 0
        
        source_article_count[source] += 1
        # Count occurrences of each category for this source
        for category in article.get("categories", []):
            if category in source_categories[source]:
                source_categories[source][category] += 1
            else:
                source_categories[source][category] = 1
    
    # Identify repetitive categories (appear in more than 70% of articles from a source)
    repetitive_sources = {}
    for source, counts in source_categories.items():
        article_count = source_article_count[source]
        if article_count >= 3:  # Only consider sources with enough articles
            repetitive_categories = [
                cat for cat, count in counts.items() 
                if count >= (article_count * 0.7)  # Category appears in 70%+ of articles
            ]
            if len(repetitive_categories) >= 3:  # Source has 3+ repetitive categories
                repetitive_sources[source] = repetitive_categories
                print(f"Detected repetitive topics for source '{source}': {repetitive_categories}")
    
    data = []
    # Process each new article and run AI operations only for these filtered articles.
    for article in new_articles:
        source = article.get("source", "").lower()
        categories = article.get("categories", [])
        
        # Remove repetitive categories if this source has them
        if source in repetitive_sources:
            categories = [cat for cat in categories if cat not in repetitive_sources[source]]
            article["categories"] = categories
        
        # Use article text if it exists; otherwise, fallback to description.
        article_text = article.get("text", article.get("description", ""))
        
        # Generate tags for all articles from repetitive sources OR those with <3 categories
        generate_tags_flag = (source in repetitive_sources) or (len(categories) < 3)
        ai = generate_summary(article_text, generate_tags=generate_tags_flag)
        
        # Merge additional tags into categories
        if generate_tags_flag and ai.tags:
            extra_tags = [tag.strip() for tag in ai.tags.split(",") if tag.strip()]
            # Limit the number of extra tags to add, ensuring total tags don't exceed 5.
            num_extra_tags_to_add = min(len(extra_tags), 5 - len(categories))
            extra_tags_to_add = extra_tags[:num_extra_tags_to_add]
            categories = list(set(categories + extra_tags_to_add))
            article["categories"] = categories

        # Get geodata, generate embeddings, and build the data array
        geodata = None
        if ai.location:
            geodata = get_geojson_from_address(ai.location)
            if not geodata:
                print(f"Unable to geocode address: {ai.location}")

        embeddings = generate_embeddings(article.get("title", "") + " " + article.get("description", ""))


        data.append({
            "source": article.get("source", ""),
            "title": article.get("title", ""),
            "added_at": datetime.now().isoformat(),
            "link": article.get("url", ""),
            "description": article.get("description", ""),
            "image": article.get("image", ""),
            "created_at": article.get("created_at", ""),
            "author": article["authors"].split(";")[0],
            "summary": ai.summary,
            "location": geodata,
            "embeddings": embeddings,
            "estimated_reading_time": article.get("estimated_reading_time", 0),
        })

    # Bulk upsert articles into the news table based on unique title.
    news_res = supabase.table("news")\
        .upsert(data, on_conflict="title")\
        .execute()

    # Retrieve all topics from the RPC (each topic is like {'top_id': XXXXX, 'top_name': 'Some-Topic'})
    all_tags = []
    for article in new_articles:
        tags = article.get("categories", [])
        all_tags.extend(tags)
    # Filter out "News" topic, case-insensitive
    all_tags = [tag for tag in all_tags if tag.lower() != "news"]
    all_tags = [modify_string(tag) for tag in all_tags]

    tags_array = []
    if all_tags:
        result = supabase.rpc('manage_topics', {"topics": all_tags}).execute()
        tags_array = result.data if result and result.data else []

    # Cross reference the news articles with topics and insert into the join table "news_topics"
    news_data = news_res.data if news_res and news_res.data else []
    news_topics = []  # List of dicts with keys "news" and "topic"
    
    # For each article in the new articles, find its news record by matching title.
    for article in new_articles:
        title = article.get("title", "")
        matching_news = next((n for n in news_data if n.get("title", "").lower() == title.lower()), None)
        if matching_news:
            news_id = matching_news.get("id")
            topics_added = set()  # track topic IDs added for this article
            topics_count = 0      # count topics added for this article (limit: 5)
            for tag in article.get("categories", []):
                if topics_count >= 5:
                    break  # enforce max 5 topics per post
                mod_tag = modify_string(tag)
                matched_topic = next((t for t in tags_array if t.get("top_name", "").lower() == mod_tag.lower()), None)
                if matched_topic:
                    topic_id = matched_topic.get("top_id")
                    if topic_id not in topics_added:
                        topics_added.add(topic_id)
                        news_topics.append({
                            "news": news_id,
                            "topic": topic_id
                        })
                        topics_count += 1
    
    if news_topics:
        # Remove any potential duplicate entries in news_topics
        unique_news_topics = []
        seen_pairs = set()
        
        for entry in news_topics:
            pair = (entry["news"], entry["topic"])
            if pair not in seen_pairs:
                seen_pairs.add(pair)
                unique_news_topics.append(entry)
        
        # Insert unique entries and execute
        supabase.table("news_topics").insert(unique_news_topics).execute()
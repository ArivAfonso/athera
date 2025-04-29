from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Request, BackgroundTasks
from typing import Optional
from models import MsgPayload
from trafilatura import feeds, fetch_url, bare_extraction
import os
import json
import re
from datetime import datetime, timedelta, timezone
from dateutil.parser import parse as parse_date
from src.utils.homepage import scrape_news_links
from src.utils.upload_post import upload_post, supabase
import requests
import xml.etree.ElementTree as ET
from sources import source_configs

# Load environment variables
load_dotenv()

# Get the secret token from the environment
SECRET_TOKEN = os.getenv("SECRET_TOKEN")

app = FastAPI()
messages_list: dict[int, MsgPayload] = {}

@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Hello"}

@app.get("/messages")
def message_items() -> dict[str, dict[int, MsgPayload]]:
    return {"messages:": messages_list}

@app.get("/scrape/{source}")
def scrape_source(
    source: str,
    request: Request,
    max_articles: Optional[int] = Query(None, description="Maximum number of articles to scrape")
) -> dict[str, str]:
    # auth = request.headers.get("Authorization")
    # if auth != f"Bearer {SECRET_TOKEN}":
    #     raise HTTPException(status_code=403, detail="Unauthorized request")

    try:
        result = perform_scrape(source, max_articles)
        # Convert the nested dictionary to a string if needed
        if isinstance(result, dict):
            details_str = json.dumps(result)
        else:
            details_str = str(result)
        return {"status": "success", "details": details_str}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def perform_scrape(source: str, max_articles: Optional[int]=None) -> dict:
    # Create a flattened dictionary of all sources
    all_sources = {}
    for topic, sources in source_configs.items():
        for source_name, config in sources.items():
            all_sources[source_name] = {"config": config, "topic": topic}
    
    # Check if the source exists
    if source not in all_sources:
        available_sources = sorted(all_sources.keys())
        return {"error": f"Source '{source}' not found. Available sources: {', '.join(available_sources)}"}
    
    # Get source config and topic
    source_info = all_sources[source]
    config = source_info["config"]
    topic = source_info["topic"]
    
    # Delete the existing JSON file if it exists
    # json_file_path = f"extracted_metadata_{source}.json"
    # if os.path.exists(json_file_path):
    #     os.remove(json_file_path)
        
    extracted_metadata = []
    feed_urls = []
    
    try:
        # Generic sitemap handling block
        # Fallback for timezone.utc for older Python versions
        try:
            utc = timezone.utc
        except AttributeError:
            from datetime import tzinfo, timedelta as _td
            class UTC(tzinfo):
                def utcoffset(self, dt):
                    return _td(0)
                def tzname(self, dt):
                    return "UTC"
                def dst(self, dt):
                    return _td(0)
            utc = UTC()
        
        if "sitemap_xml" in config and config["sitemap_xml"]:
            print(f"Using sitemap XML: {config['sitemap_xml']}")
            try:
                response = requests.get(config["sitemap_xml"], headers={'User-Agent': 'Mozilla/5.0'})
                if response.status_code == 200:
                    try:
                        root = ET.fromstring(response.content)
                    except ET.ParseError as e:
                        print(f"Error parsing XML: {str(e)}")
                        root = None
        
                    if root is not None:
                        # If sitemap index, use the first sitemap URL from the index
                        if "sitemapindex" in root.tag:
                            print("Detected sitemap index file")
                            sitemap_urls = []
                            for sitemap in root.findall(".//{*}sitemap"):
                                loc = sitemap.find("{*}loc")
                                if loc is not None and loc.text:
                                    sitemap_urls.append(loc.text)
                            if sitemap_urls:
                                index = config["sitemap_xml_number"] if ("sitemap_xml_number" in config and config["sitemap_xml_number"]) else 0
                                first_sitemap_url = sitemap_urls[index]
                                print(f"Using first sitemap from index: {first_sitemap_url}")
                                sitemap_response = requests.get(first_sitemap_url, headers={'User-Agent': 'Mozilla/5.0'})
                                if sitemap_response.status_code == 200:
                                    try:
                                        sitemap_root = ET.fromstring(sitemap_response.content)
                                    except ET.ParseError as e:
                                        print(f"Error parsing child sitemap: {str(e)}")
                                        sitemap_root = None
                                    if sitemap_root is not None:
                                        feed_entries = []
                                        for url in sitemap_root.findall(".//{*}url"):
                                            loc_elem = url.find("{*}loc")
                                            if loc_elem is not None and loc_elem.text:
                                                lastmod_elem = url.find("{*}lastmod")
                                                lastmod_text = lastmod_elem.text if lastmod_elem is not None else None
                                                feed_entries.append((loc_elem.text, lastmod_text))
        
                                        # Sort feed entries by last modified date (most recent first)
                                        def parse_lastmod(lm):
                                            try:
                                                return parse_date(lm) if lm else datetime.min.replace(tzinfo=utc)
                                            except Exception:
                                                return datetime.min.replace(tzinfo=utc)
        
                                        sorted_entries = sorted(feed_entries, key=lambda x: parse_lastmod(x[1]), reverse=True)
                                        
                                        feed_urls = [entry[0] for entry in sorted_entries]
                                        print(f"Found {len(feed_urls)} article URLs from sitemap (sorted by last modified date)")
                                    else:
                                        feed_urls = feeds.find_feed_urls(url=config["url"], target_lang="en")
                                else:
                                    print(f"Failed to fetch first sitemap: HTTP {sitemap_response.status_code}")
                                    feed_urls = feeds.find_feed_urls(url=config["url"], target_lang="en")
                            else:
                                print("No sitemap URLs found in sitemap index")
                                feed_urls = feeds.find_feed_urls(url=config["url"], target_lang="en")
                        else:
                            # Not a sitemap index: extract <url> tags along with <lastmod> and sort them
                            feed_entries = []
                            for url in root.findall(".//{*}url"):
                                loc_elem = url.find("{*}loc")
                                if loc_elem is not None and loc_elem.text:
                                    lastmod_elem = url.find("{*}lastmod")
                                    lastmod_text = lastmod_elem.text if lastmod_elem is not None else None
                                    feed_entries.append((loc_elem.text, lastmod_text))
        
                            def parse_lastmod(lm):
                                try:
                                    return parse_date(lm) if lm else datetime.min.replace(tzinfo=utc)
                                except Exception:
                                    return datetime.min.replace(tzinfo=utc)
        
                            sorted_entries = sorted(feed_entries, key=lambda x: parse_lastmod(x[1]), reverse=True)
                            
                            feed_urls = [entry[0] for entry in sorted_entries]
                            print(f"Found {len(feed_urls)} article URLs from sitemap (sorted by last modified date)")
                    else:
                        feed_urls = feeds.find_feed_urls(url=config["url"], target_lang="en")
                else:
                    print(f"Failed to fetch sitemap: HTTP {response.status_code}")
                    feed_urls = feeds.find_feed_urls(url=config["url"], target_lang="en")
            except Exception as e:
                print(f"Error processing sitemap: {str(e)}")
                feed_urls = feeds.find_feed_urls(url=config["url"], target_lang="en")
        else:
            feed_urls = feeds.find_feed_urls(url=config["url"], target_lang="en")
        
        # Filter out feed URLs that contain any ignore pattern if defined in the source config.
        if config.get("ignore_url_parts"):
            ignore_url_parts = config["ignore_url_parts"]
            before_count = len(feed_urls)
            feed_urls = [url for url in feed_urls if not any(ignore in url for ignore in ignore_url_parts)]
            print(f"Ignored {before_count - len(feed_urls)} URLs containing any of {ignore_url_parts}")

        # Include only feed URLs that contain any required substring if defined in the source config.
        if config.get("include_url_parts"):
            include_url_parts = config["include_url_parts"]
            before_count = len(feed_urls)
            feed_urls = [url for url in feed_urls if any(include in url for include in include_url_parts)]
            print(f"Filtered to include only URLs containing any of {include_url_parts}. {before_count - len(feed_urls)} URLs removed")

        #Filter out feed URLs that are specific urls if defined in the source config as an array ignore_urls
        if config.get("ignore_urls"):
            ignore_urls = config["ignore_urls"]
            before_count = len(feed_urls)
            feed_urls = [url for url in feed_urls if url not in ignore_urls]
            print(f"Ignored {before_count - len(feed_urls)} URLs in ignore_urls")

        # If feed_urls is empty, try to scrape the homepage for links.
        used_homepage = False
        if not feed_urls:
            print("No feed URLs found. Attempting to scrape homepage for links.")
            homepage_links = scrape_news_links(config["url"], config.get("include_url_parts"), config.get("ignore_url_parts"))
            if homepage_links:
                feed_urls = homepage_links
                used_homepage = True
                print(f"Found {len(feed_urls)} links on the homepage")
            else:
                print("No links found on the homepage.")
                return {"error": "No articles or homepage links could be extracted."}
        else:   
            print(f"Found {len(feed_urls)} feed URLs for {source}")
            # Remove duplicates from feed_urls
            feed_urls = list(set(feed_urls))
        
        # Determine if consecutive outdated check should apply: for sitemap or homepage sources only.
        apply_outdated_check = (("sitemap_xml" in config and config["sitemap_xml"]) or used_homepage)

        print(f"Found {len(feed_urls)} feeds/URLs for {source}")
        
        # Enforce a hard limit of 69 articles (if max_articles is not provided or is higher than 69)
        if max_articles is None or max_articles > 69:
            max_articles = 69
        
        # Process each feed URL with a consecutive out-of-date articles check.
        consecutive_outdated = 0
        articles_count = 0
        rejected_count = 0
        for feed_url in feed_urls:
            if articles_count >= max_articles:
                print(f"Reached maximum number of articles ({max_articles}). Stopping.")
                break
            print(f"Processing URL: {feed_url}")
            downloaded = fetch_url(feed_url)
            metadata = bare_extraction(downloaded, only_with_metadata=True, url=feed_url)

            if not metadata:
                print(f"Rejected: No metadata found for {feed_url}")
                rejected_count += 1
                continue

            if metadata.date:
                try:
                    article_date = parse_date(metadata.date)
                    if article_date < datetime.now(article_date.tzinfo) - timedelta(days=2):
                        print(f"Rejected: Article is too old. Date: {metadata.date}")
                        rejected_count += 1
                        if apply_outdated_check:
                            consecutive_outdated += 1
                            if consecutive_outdated >= 5:
                                print("5 consecutive out-of-date articles encountered. Stopping further processing.")
                                break
                        continue
                    else:
                        if apply_outdated_check:
                            consecutive_outdated = 0
                except Exception as e:
                    print(f"Error parsing date '{metadata.date}' for feed {feed_url}: {str(e)}")
                    rejected_count += 1
                    continue
            else:
                print(f"Warning: No date found for {feed_url}")
            
            # Process categories and clean up title/author
            if not metadata.categories:
                print(f"Warning: No categories found for {feed_url}")
            filtered_categories = []
            if metadata.categories:
                filtered_categories = [cat for cat in metadata.categories if re.match("^[a-zA-Z0-9 ]*$", cat)]
                rejected_categories = [cat for cat in metadata.categories if not re.match("^[a-zA-Z0-9 ]*$", cat)]
                if rejected_categories:
                    print(f"Rejected categories with special chars: {rejected_categories}")
            title = metadata.title if metadata.title else ""
            if not title:
                print(f"Warning: No title found for {feed_url}")
            if config.get("title_suffix") and title.endswith(config["title_suffix"]):
                title = title[:title.rfind(config["title_suffix"])]
            author = metadata.author if metadata.author else ""
            if not author:
                print(f"Warning: No author found for {feed_url}")
            if source == "athletic" and "; " in author:
                original_author = author
                author = author.split("; ")[0]
                print(f"Athletic author filtered from: '{original_author}' to '{author}'")
            
            extracted_metadata.append({
                "title": title,
                "created_at": metadata.date if metadata.date else "",
                "description": metadata.description if metadata.description else "",
                "authors": author,
                "url": feed_url,
                "text": metadata.text if metadata.text else "",
                "image": metadata.image if metadata.image else "",
                "categories": filtered_categories,
                "source": source,
                "topic": topic,
                "estimated_reading_time": len(metadata.text.split()) // 200
            })
            print(f"Extracted article: {title}")
            print(f"Categories: {filtered_categories}")
            
            articles_count += 1
            
        print(f"Summary: {articles_count} articles extracted, {rejected_count} feeds rejected")
    except Exception as e:
        print(f"Error processing source {source}: {str(e)}")
    
    # with open(json_file_path, "w", encoding="utf-8") as json_file:
    #     json.dump(extracted_metadata, json_file, ensure_ascii=False, indent=4)
    
    if extracted_metadata:
        try:
            upload_post(extracted_metadata)
            print(f"Successfully uploaded {len(extracted_metadata)} articles")
        except Exception as e:
            print(f"Error uploading posts: {str(e)}")
    
    return {"message": f"Total articles: {len(extracted_metadata)}"}

@app.get("/sources")
def list_sources() -> dict:
    all_sources = {}
    for topic, sources in source_configs.items():
        all_sources[topic] = list(sources.keys())
    return {"topics": all_sources}

@app.post("/scrapeit")
def scrape(request: Request, background_tasks: BackgroundTasks) -> dict:
    auth = request.headers.get("Authorization")
    if auth != f"Bearer {SECRET_TOKEN}":
        raise HTTPException(status_code=403, detail="Unauthorized request")

    now = datetime.now().time()

    response = supabase.table("sources").select("*").execute()
    sources = response.data

    if not sources:
        raise HTTPException(status_code=404, detail="No sources available")

    # Function to calculate absolute time difference in seconds
    def time_diff(source_time_str):
        try:
            source_time = datetime.strptime(source_time_str, "%H:%M:%S").time()
            return abs(
                datetime.combine(datetime.today(), source_time) -
                datetime.combine(datetime.today(), now)
            ).total_seconds()
        except Exception:
            return float('inf')  # ignore invalid time formats

    # Filter valid sources with a time difference of at most 2 minutes (120 seconds)
    valid_sources = [s for s in sources if s.get("time") and time_diff(s["time"]) <= 120]
    if not valid_sources:
        raise HTTPException(status_code=204, detail="No sources found")

    closest = sorted(valid_sources, key=lambda src: time_diff(src["time"]))[0]

    print(f"Closest source: {closest}")
    background_tasks.add_task(perform_scrape, closest["id"])  # Run scrape in the background
    return {"status": "success", "source": closest["id"]}
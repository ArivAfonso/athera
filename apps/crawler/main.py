from fastapi import FastAPI, Query
from typing import Optional
from models import MsgPayload
from trafilatura import feeds, fetch_url, bare_extraction
import os
import json
import re
from datetime import datetime, timedelta
from dateutil.parser import parse as parse_date
from src.utils.upload_post import upload_post
import requests
import xml.etree.ElementTree as ET

app = FastAPI()
messages_list: dict[int, MsgPayload] = {}

@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Hello"}

@app.get("/messages")
def message_items() -> dict[str, dict[int, MsgPayload]]:
    return {"messages:": messages_list}

# Define topic configurations
topic_configs = {
    "tech": {
        "techcrunch": {
            "url": "https://techcrunch.com/",
            "title_suffix": " | TechCrunch",
        },
        "wired": {
            "url": "https://www.wired.com/",
            "title_suffix": " | WIRED",
            "sitemap_xml": "https://www.wired.com/sitemap.xml"
        },
        "gizmodo": {
            "url": "https://gizmodo.com/",
            "title_suffix": " | Gizmodo",
        },
        "theverge": {
            "url": "https://www.theverge.com/",
            "title_suffix": " - The Verge",
        },
        # "arstechnica": {
        #     "url": "https://arstechnica.com/",
        #     "title_suffix": " | Ars Technica",
        # },
        # "androidauthority": {
        #     "url": "https://www.androidauthority.com/",
        #     "title_suffix": " - Android Authority",
        # },
        "pcworld": {
            "url": "https://www.pcworld.com/",
            "title_suffix": " | PCWorld",
        },
        "engadget": {
            "url": "https://www.engadget.com/",
            "title_suffix": " | Engadget",
            "sitemap_xml": "https://www.engadget.com/sitemap.xml"
        },
        "macworld": {
            "url": "https://www.macworld.com/",
            "title_suffix": " | Macworld",
        },
        "slashdot": {
            "url": "https://slashdot.org/",
            "title_suffix": " - Slashdot",
        },
        "windowscentral": {
            "url": "https://www.windowscentral.com/",
            "title_suffix": " | Windows Central",
        },
        "techradar": {
            "url": "https://www.techradar.com/",
            "title_suffix": " | TechRadar",
        },
    },
    "politics": {
        "politico": {
            "url": "https://www.politico.com/",
            "title_suffix": " - POLITICO",
        },
        "the-hill": {
            "url": "https://thehill.com/",
            "title_suffix": " | The Hill",
        },
        "vox": {
            "url": "https://www.vox.com/",
            "title_suffix": " - Vox",
        }
    },
    "music": {
        "billboard": {
            "url": "https://www.billboard.com/",
            "title_suffix": " | Billboard",
        },
        "pitchfork": {
            "url": "https://pitchfork.com/",
            "title_suffix": " | Pitchfork",
        }
    },
    "sports": {
        # "theathletic": {
        #     "url": "https://theathletic.com/",
        #     "title_suffix": " | The Athletic",
        # },
        "bleacherreport": {
            "url": "https://bleacherreport.com/",
            "title_suffix": " | Bleacher Report",
            "sitemap_xml": "https://bleacherreport.com/sitemaps"
        },
        "sportbible": {
            "url": "https://www.sportbible.com/",
            "title_suffix": " | SPORTbible",
        },
        "talksport": {
            "url": "https://talksport.com/",
            "title_suffix": " | talkSPORT",
        },
        "therace": {
            "url": "https://the-race.com/",
            "title_suffix": " | The Race",
            "sitemap_xml": "https://www.the-race.com/sitemap-posts.xml",
        }
    },
    "cars": {
        # "autoexpress": {
        #     "url": "https://www.autoexpress.co.uk/",
        #     "title_suffix": " | Auto Express",
        # },
        # "motor1": {
        #     "url": "https://www.motor1.com/",
        #     "title_suffix": " | Motor1",
        # },
        # "motortrend": {
        #     "url": "https://www.motortrend.com/",
        #     "title_suffix": " | MotorTrend",
        #     "sitemap_xml": "https://www.motortrend.com/sitemap-article-news-2025.xml",
        #     "disable_outdated_check": True  # Disable the out-of-date check for motortrend
        # }
    },
    # "programming": {
    #     "sitepoint": {
    #         "url": "https://www.sitepoint.com/",
    #         "title_suffix": " - SitePoint",
    #     },
    # },
    "gaming": {
        "polygon": {
            "url": "https://www.polygon.com/",
            "title_suffix": " - Polygon",
        },
        "kotaku": {
            "url": "https://kotaku.com/",
            "title_suffix": " | Kotaku",
        },
        "ign": {
            "url": "https://www.ign.com/",
            "title_suffix": " | IGN",
        }
    },
    "entertainment": {
        "indiewire": {
            "url": "https://www.indiewire.com/",
            "title_suffix": " | IndieWire",
        },
        "variety": {
            "url": "https://variety.com/",
            "title_suffix": " - Variety",
        },
        "empireonline": {
            "url": "https://www.empireonline.com/",
            "title_suffix": " | Empire",
            "sitemap_xml": "https://www.empireonline.com/sitemap_articles.xml?page=1"
        },
    },
    "business": {
        "theentrepreneur": {
            "url": "https://entrepreneur.com/",
            "title_suffix": " | The Entrepreneur",
        },
    },
    "general": {
        "forbes": {
            "url": "https://www.forbes.com/",
            "title_suffix": " - Forbes",
            "sitemap_xml": "https://www.forbes.com/news_sitemap.xml"
        },
    },
    "travel": {
        "atlasobscura": {
            "url": "https://www.atlasobscura.com/",
            "title_suffix": " - Atlas Obscura",
        },
        # "lonelyplanet": {
        #     "url": "https://www.lonelyplanet.com/",
        #     "title_suffix": " - Lonely Planet",
        # },
        # "cntraveller": {
        #     "url": "https://www.cntraveller.com/",
        #     "title_suffix": " | CN Traveller",
        # }
    },
    "fashion": {
        "hypebeast": {
            "url": "https://hypebeast.com/",
            "title_suffix": " | HYPEBEAST",
            "sitemap_xml": "https://hypebeast.com/sitemap.xml"
        },
    },
    # "literature": {
    #     "lithub": {
    #         "url": "https://lithub.com/",
    #         "title_suffix": " | Literary Hub",
    #     },
    # },
    "science": {
        "sciencenews": {
            "url": "https://www.sciencenews.org/",
            "title_suffix": " | Science News",
        },
        "discovermagazine": {
            "url": "https://www.discovermagazine.com/",
            "title_suffix": " | Discover Magazine",
            "sitemap_xml": "https://www.discovermagazine.com/sitemap/article/recent/1.xml"
        },
    },
    # "architecture": {
    #     "elledecor": {
    #         "url": "https://www.elledecor.com/",
    #         "title_suffix": " - ELLE Decor",
    #     },
    # },
    # "international": {
    #     "theriotimes": {
    #         "url": "https://riotimesonline.com/",
    #         "title_suffix": " | The Rio Times",
    #     },
    #     "theportugalnews": {
    #         "url": "https://www.theportugalnews.com/",
    #         "title_suffix": " | The Portugal News",
    #         "sitemap_xml": "https://www.theportugalnews.com/sitemap/en/category-news.xml",
    #         "ignore_prefix": "https://www.theportugalnews.com/news/news/"
    #     },
    # },
}

@app.get("/scrape/{source}")
def scrape_source(source: str, max_articles: Optional[int] = Query(None, description="Maximum number of articles to scrape")) -> dict[str, str]:
    # Create a flattened dictionary of all sources
    all_sources = {}
    for topic, sources in topic_configs.items():
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
    json_file_path = f"extracted_metadata_{source}.json"
    if os.path.exists(json_file_path):
        os.remove(json_file_path)
    
    extracted_metadata = []
    feed_urls = []
    
    try:
        # Generic sitemap handling block
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
                                first_sitemap_url = sitemap_urls[0]
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
                                                return parse_date(lm) if lm else datetime.min
                                            except Exception:
                                                return datetime.min
                                        
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
                                    return parse_date(lm) if lm else datetime.min
                                except Exception:
                                    return datetime.min
                            
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
        
        # Filter out feed URLs that start with an ignore_prefix if defined in the source config.
        if config.get("ignore_prefix"):
            ignore_prefix = config["ignore_prefix"]
            before_count = len(feed_urls)
            feed_urls = [url for url in feed_urls if not url.startswith(ignore_prefix)]
            print(f"Ignored {before_count - len(feed_urls)} URLs starting with '{ignore_prefix}'")
        
        print(f"Found {len(feed_urls)} feeds/URLs for {source}")
        
        # Enforce a hard limit of 70 articles (if max_articles is not provided or is higher than 70)
        if max_articles is None or max_articles > 70:
            max_articles = 70
        
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
                        # Only count consecutive outdated if not disabled in the config.
                        if not config.get("disable_outdated_check", False):
                            consecutive_outdated += 1
                            if consecutive_outdated >= 5:
                                print("5 consecutive out-of-date articles encountered. Stopping further processing.")
                                break
                        continue
                    else:
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
                title = title[:-len(config["title_suffix"])]
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
                "estimatedReadingTime": len(metadata.text.split()) // 200
            })
            print(f"Extracted article: {title}")
            print(f"Categories: {filtered_categories}")
            
            articles_count += 1
            
        print(f"Summary: {articles_count} articles extracted, {rejected_count} feeds rejected")
    except Exception as e:
        print(f"Error processing source {source}: {str(e)}")
    
    with open(json_file_path, "w", encoding="utf-8") as json_file:
        json.dump(extracted_metadata, json_file, ensure_ascii=False, indent=4)
    
    if extracted_metadata:
        try:
            upload_post(extracted_metadata)
            print(f"Successfully uploaded {len(extracted_metadata)} articles")
        except Exception as e:
            print(f"Error uploading posts: {str(e)}")
    
    return {"message": f"Extracted {source} metadata saved to {json_file_path}. Total articles: {len(extracted_metadata)}"}

@app.get("/sources")
def list_sources() -> dict:
    all_sources = {}
    for topic, sources in topic_configs.items():
        all_sources[topic] = list(sources.keys())
    return {"topics": all_sources}
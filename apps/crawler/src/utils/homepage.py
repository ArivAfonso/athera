import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def scrape_news_links(url, include_parts=None, ignore_parts=None):
    print(f"Starting to scrape news links from: {url}")
    # if include_parts is None:
    #     include_parts = ["/news/", "/article/"]  # default filtering criteria
    
    print(f"Using include filters: {include_parts}")
    print(f"Using ignore filters: {ignore_parts}")

    try:
        # Fetch the page content
        print(f"Making request to: {url}")
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        print(f"Response status code: {response.status_code}")
        response.raise_for_status()  # Raise an error for bad responses
        
        print(f"Parsing HTML content ({len(response.text)} bytes)")
        soup = BeautifulSoup(response.text, "html.parser")

        links = set()
        total_links = 0
        filtered_links = 0
        ignored_links = 0
        
        print(f"Scanning all anchor tags...")
        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"]
            total_links += 1
            full_url = urljoin(url, href)  # Handle relative URLs

            # Skip URLs containing any ignore parts if provided.
            if ignore_parts is not None and any(ignore in full_url for ignore in ignore_parts):
                ignored_links += 1
                print(f"Ignoring URL (matched ignore filter): {full_url}")
                continue

            # Only add URLs that contain at least one of the include parts.
            if include_parts and not any(include in full_url for include in include_parts):
                filtered_links += 1
                continue

            links.add(full_url)
            print(f"Added URL: {full_url}")

        print(f"Scraping complete. Found {len(links)} unique links out of {total_links} total links.")
        print(f"Filtered out {filtered_links} links (didn't match include criteria)")
        print(f"Ignored {ignored_links} links (matched ignore criteria)")
        return list(links)

    except requests.RequestException as e:
        print(f"ERROR: Failed to fetch page: {e}")
        return []
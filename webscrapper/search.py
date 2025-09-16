"""
Universal Exam Info Fetcher
 - Query any exam name (e.g., "NEET", "JEE", "CLAT", "CUET", "NTSE", "SSC CGL", "UPSC")
 - Tries Wikipedia first to extract overview, syllabus, exam pattern sections
 - Uses YouTube Data API to fetch video lectures (optional; set YOUTUBE_API_KEY)
 - Uses Google Books API to fetch suggested books

Note: Web pages change, so parsing may need small adjustments per exam.
"""


import re
import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Optional
from dotenv import dotenv_values
# optional: google API client for YouTube (install google-api-python-client)
config = dotenv_values(".env")
try:
    import googleapiclient.discovery
    HAVE_YT = True
except Exception:
    HAVE_YT = False

# Config
YOUTUBE_API_KEY = config.get("YOUTUBE_API_KEY", "")  
GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1/volumes"

WIKIPEDIA_SEARCH_API = "https://en.wikipedia.org/w/api.php"
WIKIPEDIA_REST_PAGE = "https://en.wikipedia.org/api/rest_v1/page/html/{}"  # slug


# ---------------------------
# Helper: Wikipedia search & fetch
# ---------------------------
def wiki_search_title(query: str) -> Optional[str]:
    """
    Use MediaWiki API to search for the best-matching page title.
    Returns a page title (string) or None.
    """
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "format": "json",
        "srlimit": 5,
    }
    try:
        r = requests.get(WIKIPEDIA_SEARCH_API, params=params, timeout=12)
        r.raise_for_status()
        data = r.json()
        results = data.get("query", {}).get("search", [])
        if not results:
            return None
        # choose first result as best match
        return results[0]["title"]
    except Exception:
        return None


def wiki_get_html(title: str) -> Optional[str]:
    """
    Fetch page HTML for a given Wikipedia title (slugify the title).
    Returns HTML string or None.
    """
    slug = title.replace(" ", "_")
    url = WIKIPEDIA_REST_PAGE.format(slug)
    try:
        r = requests.get(url, timeout=12)
        if r.status_code == 200:
            return r.text
        return None
    except Exception:
        return None


def extract_sections_from_wiki_html(html: str) -> Dict[str, str]:
    """
    Parse the Wikipedia HTML and collect headings & their text.
    Returns a dict of heading -> text.
    """
    soup = BeautifulSoup(html, "html.parser")
    # remove tables/infobox to simplify
    for tb in soup.select("table"):
        tb.decompose()
    sections = {}
    # headings in wiki REST HTML often are <h2>, <h3> etc. We traverse and collect text
    for header in soup.find_all(re.compile("^h[1-6]$")):
        # heading text
        head_text = header.get_text(separator=" ").strip()
        # Get following sibling elements until next header of same/higher level
        content_parts = []
        for sib in header.next_siblings:
            if getattr(sib, "name", None) and re.match("^h[1-6]$", sib.name):
                break
            # gather paragraph and list texts
            if getattr(sib, "name", None) in ("p", "ul", "ol", "div"):
                txt = sib.get_text(separator=" ").strip()
                if txt:
                    content_parts.append(txt)
        if content_parts:
            sections[head_text.lower()] = "\n\n".join(content_parts)
    # Also capture lead paragraph (intro) if present
    lead_para = ""
    first_p = soup.find("p")
    if first_p:
        lead_para = first_p.get_text(strip=True)
    sections.setdefault("summary", lead_para)
    return sections


def find_relevant_wiki_info(query: str) -> Dict[str, Optional[str]]:
    """
    Combine search+fetch+parse to return a dict with keys:
    - title
    - summary
    - syllabus (if found)
    - pattern (if found)
    - other_relevant_sections (dict)
    """
    out = {"title": None, "summary": None, "syllabus": None, "pattern": None, "other_sections": {}}
    title = wiki_search_title(query + " exam")
    if title is None:
        # fallback to plain query
        title = wiki_search_title(query)
    if title is None:
        return out
    out["title"] = title
    html = wiki_get_html(title)
    if html is None:
        return out
    sections = extract_sections_from_wiki_html(html)
    out["summary"] = sections.get("summary") or sections.get("introduction") or None

    # heuristics: find keys that likely correspond to syllabus/pattern
    syllabus_keys = ["syllabus", "curriculum", "exam syllabus", "syllabus and exam pattern", "syllabus and structure"]
    pattern_keys = ["exam pattern", "pattern", "format", "structure", "scheme"]
    # try exact match keys
    for k in syllabus_keys:
        if k in sections:
            out["syllabus"] = sections[k]
            break
    for k in pattern_keys:
        if k in sections:
            out["pattern"] = sections[k]
            break
    # if not found, try fuzzy search in section names
    if not out["syllabus"]:
        for secname, content in sections.items():
            if any(word in secname for word in ("syllabus", "curriculum", "subjects", "paper", "exam")):
                out["syllabus"] = content
                break
    if not out["pattern"]:
        for secname, content in sections.items():
            if any(word in secname for word in ("pattern", "structure", "format", "scheme", "paper")):
                out["pattern"] = content
                break
    out["other_sections"] = sections
    return out


# ---------------------------
# YouTube search (optional)
# ---------------------------
def search_youtube_videos(query: str, max_results: int = 5) -> List[Dict]:
    """
    Requires google-api-python-client and a valid YOUTUBE_API_KEY set in env var or variable above.
    Returns list of dicts: {title, videoId, url}
    """
    if not HAVE_YT or not YOUTUBE_API_KEY:
        return []
    try:
        youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
        request = youtube.search().list(
            q=f"{query} preparation",
            part="snippet",
            maxResults=max_results,
            type="video",
            relevanceLanguage="en"
        )
        resp = request.execute()
        videos = []
        for item in resp.get("items", []):
            vid = {
                "title": item["snippet"]["title"],
                "videoId": item["id"]["videoId"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
            }
            videos.append(vid)
        return videos
    except Exception:
        return []


# ---------------------------
# Google Books suggestions
# ---------------------------
def search_google_books(query: str, max_results: int = 6) -> List[Dict]:
    """
    Use Google Books API to search for exam preparation books.
    Returns list of {title, authors, infoLink}
    """
    try:
        params = {"q": f"{query} preparation OR {query} syllabus OR {query} guide", "maxResults": max_results}
        r = requests.get(GOOGLE_BOOKS_BASE, params=params, timeout=12)
        r.raise_for_status()
        data = r.json()
        items = data.get("items", [])[:max_results]
        out = []
        for it in items:
            info = it.get("volumeInfo", {})
            out.append({
                "title": info.get("title"),
                "authors": info.get("authors"),
                "publisher": info.get("publisher"),
                "infoLink": info.get("infoLink")
            })
        return out
    except Exception:
        return []


# ---------------------------
# Putting it all together
# ---------------------------
def fetch_exam_info_universal(exam_query: str, include_videos: bool = True, include_books: bool = True) -> Dict:
    """
    Main function to fetch info for any exam name.
    Returns a structured dict with: title, summary, syllabus, pattern, videos, books, raw_sections
    """
    result = {
        "query": exam_query,
        "wikipedia": {},
        "videos": [],
        "books": []
    }

    # 1) Wikipedia
    wiki_info = find_relevant_wiki_info(exam_query)
    result["wikipedia"] = wiki_info

    # 2) YouTube
    if include_videos:
        videos = search_youtube_videos(exam_query, max_results=6)
        result["videos"] = videos

    # 3) Books
    if include_books:
        books = search_google_books(exam_query, max_results=6)
        result["books"] = books

    return result


# ---------------------------
# CLI demonstration
# ---------------------------
if __name__ == "__main__":
    print("Universal Exam Info Fetcher (Wikipedia + YouTube + Google Books)")
    q = input("Enter exam name (e.g., NEET, JEE Main, CLAT, UPSC, CUET, SSC CGL): ").strip()
    if not q:
        print("No query entered. Exiting.")
        exit(0)

    info = fetch_exam_info_universal(q)
    print("\n=== Result Summary ===\n")
    print("Query:", info["query"])
    w = info["wikipedia"]
    if w.get("title"):
        print("Wikipedia Page Title:", w["title"])
    if w.get("summary"):
        print("\nSummary (lead):\n", w["summary"][:1000], "..." if len(w["summary"]) > 1000 else "")
    if w.get("pattern"):
        print("\nExam Pattern / Format:\n", w["pattern"][:1500])
    if w.get("syllabus"):
        print("\nSyllabus / Curriculum (excerpt):\n", w["syllabus"][:1500])
    # show matched headings if more detail desired
    if w.get("other_sections"):
        print("\nOther sections found on Wikipedia (headings):")
        for k in list(w["other_sections"].keys())[:15]:
            print(" -", k)

    # Videos
    if info["videos"]:
        print("\nSuggested Videos:")
        for v in info["videos"]:
            print(f" - {v['title']}  ({v['url']})")
    else:
        print("\nYouTube results not available (no API key or google client).")

    # Books
    if info["books"]:
        print("\nSuggested Books:")
        for b in info["books"]:
            print(f" - {b.get('title')} | {', '.join(b.get('authors') or [])} - {b.get('infoLink')}")
    else:
        print("\nNo book suggestions found.")

    print("\n--- End ---\n")

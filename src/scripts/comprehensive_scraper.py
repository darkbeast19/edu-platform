"""
AuraPrep - Comprehensive Multi-Category Scraper
Scrapes questions from IndiaBix for all major Indian exam categories
and uploads them to Supabase.

Install dependencies:
    pip install requests beautifulsoup4 supabase python-dotenv

Usage:
    python src/scripts/comprehensive_scraper.py
"""

import requests
from bs4 import BeautifulSoup
import time
import json
import re
import os
from datetime import datetime
from dotenv import load_dotenv

# Load env variables from .env.local
load_dotenv(dotenv_path='.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "https://ftduapttjlpvvbcqcvnd.supabase.co")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

# ─────────────────────────────────────────────────────────────
# MASTER TOPIC MAP - IndiaBix URL slug → (exam_subject, topic_name, pages_to_scrape)
# ─────────────────────────────────────────────────────────────
TOPICS_CONFIG = [
    # ── QUANTITATIVE APTITUDE ─────────────────────────────────
    {"url_slug": "aptitude/percentage",             "subject": "Quantitative Aptitude", "topic": "Percentage",            "pages": 5},
    {"url_slug": "aptitude/profit-and-loss",        "subject": "Quantitative Aptitude", "topic": "Profit & Loss",         "pages": 5},
    {"url_slug": "aptitude/time-and-work",          "subject": "Quantitative Aptitude", "topic": "Time & Work",           "pages": 5},
    {"url_slug": "aptitude/simple-interest",        "subject": "Quantitative Aptitude", "topic": "Simple Interest",       "pages": 4},
    {"url_slug": "aptitude/compound-interest",      "subject": "Quantitative Aptitude", "topic": "Compound Interest",     "pages": 4},
    {"url_slug": "aptitude/ratio-and-proportion",   "subject": "Quantitative Aptitude", "topic": "Ratio & Proportion",    "pages": 5},
    {"url_slug": "aptitude/average",                "subject": "Quantitative Aptitude", "topic": "Average",               "pages": 4},
    {"url_slug": "aptitude/time-and-distance",      "subject": "Quantitative Aptitude", "topic": "Time & Distance",       "pages": 5},
    {"url_slug": "aptitude/problems-on-trains",     "subject": "Quantitative Aptitude", "topic": "Problems On Trains",    "pages": 4},
    {"url_slug": "aptitude/problems-on-ages",       "subject": "Quantitative Aptitude", "topic": "Problems On Ages",      "pages": 3},
    {"url_slug": "aptitude/area",                   "subject": "Quantitative Aptitude", "topic": "Area",                  "pages": 4},
    {"url_slug": "aptitude/volume-and-surface-area","subject": "Quantitative Aptitude", "topic": "Volume & Surface Area", "pages": 4},
    {"url_slug": "aptitude/numbers",                "subject": "Quantitative Aptitude", "topic": "Number System",         "pages": 5},
    {"url_slug": "aptitude/permutation-and-combination", "subject": "Quantitative Aptitude", "topic": "Permutation & Combination", "pages": 4},
    {"url_slug": "aptitude/probability",            "subject": "Quantitative Aptitude", "topic": "Probability",           "pages": 4},
    {"url_slug": "aptitude/partnership",            "subject": "Quantitative Aptitude", "topic": "Partnership",           "pages": 3},
    {"url_slug": "aptitude/pipes-and-cistern",      "subject": "Quantitative Aptitude", "topic": "Pipes & Cistern",       "pages": 3},
    {"url_slug": "aptitude/alligation-or-mixture", "subject": "Quantitative Aptitude", "topic": "Alligation & Mixture",  "pages": 3},

    # ── LOGICAL REASONING ─────────────────────────────────────
    {"url_slug": "logical-reasoning/number-series",     "subject": "Reasoning",  "topic": "Number Series",      "pages": 4},
    {"url_slug": "logical-reasoning/letter-series",     "subject": "Reasoning",  "topic": "Letter Series",      "pages": 3},
    {"url_slug": "logical-reasoning/analogies",         "subject": "Reasoning",  "topic": "Analogies",          "pages": 5},
    {"url_slug": "logical-reasoning/classification",    "subject": "Reasoning",  "topic": "Classification",     "pages": 4},
    {"url_slug": "logical-reasoning/direction-sense-test", "subject": "Reasoning", "topic": "Direction Sense",  "pages": 3},
    {"url_slug": "logical-reasoning/logical-sequence-of-words", "subject": "Reasoning", "topic": "Logical Sequence", "pages": 3},
    {"url_slug": "logical-reasoning/arithmetic-reasoning", "subject": "Reasoning", "topic": "Arithmetic Reasoning", "pages": 4},
    {"url_slug": "logical-reasoning/seating-arrangement", "subject": "Reasoning", "topic": "Seating Arrangement", "pages": 3},
    {"url_slug": "logical-reasoning/blood-relation-test", "subject": "Reasoning", "topic": "Blood Relations",   "pages": 3},
    {"url_slug": "logical-reasoning/coding-decoding",   "subject": "Reasoning",  "topic": "Coding & Decoding",  "pages": 4},

    # ── VERBAL ABILITY (ENGLISH) ──────────────────────────────
    {"url_slug": "verbal-ability/synonyms",         "subject": "English",        "topic": "Synonyms",           "pages": 5},
    {"url_slug": "verbal-ability/antonyms",         "subject": "English",        "topic": "Antonyms",           "pages": 5},
    {"url_slug": "verbal-ability/selecting-words",  "subject": "English",        "topic": "Fill in the Blanks", "pages": 5},
    {"url_slug": "verbal-ability/spotting-errors",  "subject": "English",        "topic": "Spotting Errors",    "pages": 5},
    {"url_slug": "verbal-ability/sentence-correction", "subject": "English",     "topic": "Sentence Correction","pages": 4},
    {"url_slug": "verbal-ability/ordering-of-words", "subject": "English",       "topic": "Word Arrangement",   "pages": 3},

    # ── GENERAL KNOWLEDGE ─────────────────────────────────────
    {"url_slug": "general-knowledge/indian-history","subject": "General Knowledge", "topic": "Indian History",   "pages": 5},
    {"url_slug": "general-knowledge/indian-geography", "subject": "General Knowledge", "topic": "Indian Geography", "pages": 5},
    {"url_slug": "general-knowledge/indian-economy", "subject": "General Knowledge", "topic": "Indian Economy",  "pages": 4},
    {"url_slug": "general-knowledge/indian-politics", "subject": "General Knowledge", "topic": "Indian Polity",  "pages": 4},
    {"url_slug": "general-knowledge/world-geography","subject": "General Knowledge", "topic": "World Geography",  "pages": 4},
    {"url_slug": "general-knowledge/general-science", "subject": "General Knowledge", "topic": "General Science", "pages": 5},
    {"url_slug": "general-knowledge/sports",        "subject": "General Knowledge", "topic": "Sports",           "pages": 3},
    {"url_slug": "general-knowledge/inventions",    "subject": "General Knowledge", "topic": "Inventions",       "pages": 3},
    {"url_slug": "general-knowledge/awards-and-honors", "subject": "General Knowledge", "topic": "Awards & Honours", "pages": 3},
    {"url_slug": "general-knowledge/constitution-of-india", "subject": "General Knowledge", "topic": "Indian Constitution", "pages": 4},
    {"url_slug": "general-knowledge/basic-general-knowledge", "subject": "General Knowledge", "topic": "Basic GK",  "pages": 5},

    # ── COMPUTER KNOWLEDGE ───────────────────────────────────
    {"url_slug": "computer-science/computer-fundamentals", "subject": "Computer Knowledge", "topic": "Computer Fundamentals", "pages": 5},
    {"url_slug": "computer-science/networking",     "subject": "Computer Knowledge", "topic": "Networking",       "pages": 4},
    {"url_slug": "computer-science/operating-systems", "subject": "Computer Knowledge", "topic": "Operating Systems", "pages": 4},
    {"url_slug": "computer-science/microsoft-office", "subject": "Computer Knowledge", "topic": "MS Office",      "pages": 3},
    {"url_slug": "computer-science/internet",       "subject": "Computer Knowledge", "topic": "Internet",         "pages": 3},
]

# ─────────────────────────────────────────────────────────────
# SUPABASE HELPERS
# ─────────────────────────────────────────────────────────────
def supabase_request(method, table, data=None, params=None):
    """Make a request to Supabase REST API."""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    if params:
        headers["Prefer"] = "return=representation"

    try:
        if method == "GET":
            resp = requests.get(url, headers=headers, params=params, timeout=10)
        elif method == "POST":
            resp = requests.post(url, headers=headers, json=data, timeout=10)
        elif method == "PATCH":
            resp = requests.patch(url, headers=headers, json=data, params=params, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"  ⚠️  Supabase error on {table}: {e}")
        return None

def get_or_create_exam(exam_name):
    existing = supabase_request("GET", "exams", params={"name": f"eq.{exam_name}", "select": "id,name"})
    if existing and len(existing) > 0:
        return existing[0]["id"]
    created = supabase_request("POST", "exams", data={"name": exam_name, "slug": exam_name.lower().replace(" ", "-"), "description": f"{exam_name} preparation questions"})
    if created and len(created) > 0:
        print(f"  [OK] Created exam: {exam_name}")
        return created[0]["id"]
    return None

def get_or_create_subject(subject_name, exam_id):
    existing = supabase_request("GET", "subjects", params={"name": f"eq.{subject_name}", "exam_id": f"eq.{exam_id}", "select": "id"})
    if existing and len(existing) > 0:
        return existing[0]["id"]
    created = supabase_request("POST", "subjects", data={"name": subject_name, "exam_id": exam_id, "slug": subject_name.lower().replace(" ", "-").replace("&", "and")})
    if created and len(created) > 0:
        print(f"    [OK] Created subject: {subject_name}")
        return created[0]["id"]
    return None

def get_or_create_topic(topic_name, subject_id):
    existing = supabase_request("GET", "topics", params={"name": f"eq.{topic_name}", "subject_id": f"eq.{subject_id}", "select": "id"})
    if existing and len(existing) > 0:
        return existing[0]["id"]
    created = supabase_request("POST", "topics", data={"name": topic_name, "subject_id": subject_id, "slug": topic_name.lower().replace(" ", "-").replace("&", "and")})
    if created and len(created) > 0:
        print(f"      [OK] Created topic: {topic_name}")
        return created[0]["id"]
    return None

def get_existing_questions(topic_id):
    """Get all existing question texts for a topic to avoid duplicates."""
    existing = supabase_request("GET", "questions", params={"topic_id": f"eq.{topic_id}", "select": "question_text"})
    if existing:
        return {q["question_text"].strip().lower() for q in existing}
    return set()

# ─────────────────────────────────────────────────────────────
# SCRAPING LOGIC
# ─────────────────────────────────────────────────────────────
def scrape_indiabix_page(url_slug, page=1):
    """Scrape one page of IndiaBix questions."""
    if page == 1:
        url = f"https://www.indiabix.com/{url_slug}/"
    else:
        url = f"https://www.indiabix.com/{url_slug}/{page}"

    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 404:
            return [], True  # (questions, is_end)
        resp.raise_for_status()
    except Exception as e:
        print(f"      ⚠️  Network error on {url}: {e}")
        return [], True

    soup = BeautifulSoup(resp.text, "html.parser")
    questions = []

    question_divs = soup.find_all("div", class_="bix-div-container")
    if not question_divs:
        return [], True

    for div in question_divs:
        try:
            # Question text
            q_box = div.find("div", class_="bix-td-qtxt")
            if not q_box:
                continue
            question_text = q_box.get_text(" ", strip=True)
            if not question_text or len(question_text) < 5:
                continue

            # Options
            option_rows = div.find_all("div", class_="bix-td-option")
            options = []
            for opt in option_rows:
                txt = opt.get_text(" ", strip=True)
                # Remove leading A. B. C. D. labels
                txt = re.sub(r"^[A-Da-d][.)]\s*", "", txt).strip()
                if txt:
                    options.append(txt)

            if len(options) < 4:
                continue

            # Correct answer
            ans_inp = div.find("input", {"class": "jq-hdnakq"})
            correct_letter = None
            if ans_inp and ans_inp.get("value"):
                val = ans_inp["value"].strip().upper()
                if val in ["A", "B", "C", "D"]:
                    correct_letter = val

            if not correct_letter:
                continue

            # Explanation
            exp_div = div.find("div", class_="bix-ans-description")
            explanation = ""
            if exp_div:
                explanation = exp_div.get_text(" ", strip=True)
                explanation = re.sub(r"\s+", " ", explanation).strip()

            questions.append({
                "question_text": question_text,
                "option_a": options[0],
                "option_b": options[1],
                "option_c": options[2],
                "option_d": options[3],
                "correct_option": correct_letter,
                "explanation": explanation or None,
                "difficulty": "Intermediate",
                "source": f"https://www.indiabix.com/{url_slug}/",
            })
        except Exception as e:
            continue

    is_end = len(question_divs) == 0
    return questions, is_end

# ─────────────────────────────────────────────────────────────
# MAIN PIPELINE
# ─────────────────────────────────────────────────────────────
def upload_questions_batch(questions_data, topic_id, existing_texts):
    """Upload a batch, skipping duplicates."""
    new_questions = []
    for q in questions_data:
        key = q["question_text"].strip().lower()
        if key not in existing_texts:
            q["topic_id"] = topic_id
            new_questions.append(q)
            existing_texts.add(key)

    if not new_questions:
        return 0

    result = supabase_request("POST", "questions", data=new_questions)
    return len(new_questions) if result else 0

def run_scraper():
    print("=" * 60)
    print("AuraPrep Comprehensive Scraper")
    print(f"   Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    if not SUPABASE_KEY:
        print("[ERROR] SUPABASE_KEY not set! Set NEXT_PUBLIC_SUPABASE_ANON_KEY env var.")
        return

    # Group by exam
    EXAM_NAME = "Indian Competitive Exams"
    exam_id = get_or_create_exam(EXAM_NAME)
    if not exam_id:
        print("❌ Could not create/find exam in Supabase. Check your keys.")
        return

    total_uploaded = 0
    report = []

    for config in TOPICS_CONFIG:
        url_slug = config["url_slug"]
        subject_name = config["subject"]
        topic_name = config["topic"]
        max_pages = config["pages"]

        print(f"\n[SUBJECT] {subject_name} -> {topic_name}")

        subject_id = get_or_create_subject(subject_name, exam_id)
        if not subject_id:
            report.append({"topic": topic_name, "status": "FAILED - subject create error", "uploaded": 0})
            continue

        topic_id = get_or_create_topic(topic_name, subject_id)
        if not topic_id:
            report.append({"topic": topic_name, "status": "FAILED - topic create error", "uploaded": 0})
            continue

        existing_texts = get_existing_questions(topic_id)
        topic_total = 0

        for page in range(1, max_pages + 1):
            questions, is_end = scrape_indiabix_page(url_slug, page)

            if questions:
                uploaded = upload_questions_batch(questions, topic_id, existing_texts)
                topic_total += uploaded
                total_uploaded += uploaded
                print(f"   Page {page}: Scraped {len(questions)}, Uploaded {uploaded} new")
            else:
                print(f"   Page {page}: No questions found (end of data or 404)")

            if is_end:
                break

            time.sleep(1.5)  # be polite to the server

        report.append({"topic": topic_name, "subject": subject_name, "status": "OK", "uploaded": topic_total})
        print(f"   [OK] Total for '{topic_name}': {topic_total} questions")
        time.sleep(2)  # cooldown between topics

    # ── Print Report ──────────────────────────────────────────
    print("\n" + "=" * 60)
    print("📊 SCRAPING REPORT")
    print("=" * 60)

    by_subject = {}
    for r in report:
        subj = r.get("subject", "Unknown")
        if subj not in by_subject:
            by_subject[subj] = []
        by_subject[subj].append(r)

    for subj, items in by_subject.items():
        subj_total = sum(i["uploaded"] for i in items)
        print(f"\n  [SECTION] {subj} ({subj_total} questions total)")
        for item in items:
            status = "[OK]" if item["uploaded"] > 0 else "[WARN]"
            print(f"     {status} {item['topic']}: {item['uploaded']} uploaded")

    print(f"\n[DONE] GRAND TOTAL: {total_uploaded} questions uploaded")
    print(f"   Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # Save report to JSON
    with open("scraping_report.json", "w") as f:
        json.dump({"total": total_uploaded, "topics": report, "timestamp": str(datetime.now())}, f, indent=2)
    print("\n💾 Report saved to scraping_report.json")

if __name__ == "__main__":
    run_scraper()

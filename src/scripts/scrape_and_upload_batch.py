import os
import json
import requests
from bs4 import BeautifulSoup
import time

# --- CONFIGURATION ---
BASE_URL = "https://www.indiabix.com"

# The mapping correctly aligns the Scrape URLs with our DB slugs. 
# This ensures a "human & computer" accurate categorization without mixing subjects.
TOPICS_TO_SCRAPE = [
    # Quantitative Aptitude
    {"url": "/aptitude/percentage/", "exam_slug": "ssc-cgl", "topic_slug": "percentage", "pages": 1},
    {"url": "/aptitude/time-and-work/", "exam_slug": "ssc-cgl", "topic_slug": "time-work", "pages": 1},
    {"url": "/aptitude/profit-and-loss/", "exam_slug": "ssc-cgl", "topic_slug": "profit-loss", "pages": 1},
    {"url": "/aptitude/simple-interest/", "exam_slug": "ssc-cgl", "topic_slug": "simple-interest", "pages": 1},
    
    # Logical Reasoning
    {"url": "/logical-reasoning/blood-relation-test/", "exam_slug": "ssc-cgl", "topic_slug": "blood-relations", "pages": 1},
    {"url": "/logical-reasoning/syllogism/", "exam_slug": "ssc-cgl", "topic_slug": "syllogism", "pages": 1},
]

# Parse .env.local file to get variables
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env.local')
env_vars = {}
try:
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                key, val = line.strip().split('=', 1)
                env_vars[key] = val
except Exception as e:
    print(f"Error reading .env.local: {e}")
    exit(1)

supabase_url = env_vars.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = env_vars.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

headers_db = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

headers_web = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}

def get_record_id(table_name, column, value):
    req_url = f"{supabase_url}/rest/v1/{table_name}?{column}=eq.{value}&select=id"
    res = requests.get(req_url, headers=headers_db)
    if res.status_code == 200 and len(res.json()) > 0:
        return res.json()[0]['id']
    return None

def scrape_topic(url_path, pages=1):
    all_q = []
    target_url = f"{BASE_URL}{url_path}"
    print(f"  -> Scraping: {target_url}")
    
    try:
        response = requests.get(target_url, headers=headers_web)
        if response.status_code != 200:
            print(f"     Failed {response.status_code}")
            return []
            
        soup = BeautifulSoup(response.text, 'html.parser')
        question_blocks = soup.find_all('div', class_='bix-div-container')
        
        for block in question_blocks:
            q_data = {}
            # Extract Question
            q_td = block.find('div', class_='bix-inner-td') or block.find('td', class_='bix-td-qtxt') or block.find('div', class_='bix-td-qtxt')
            if not q_td: continue
            q_data['question'] = q_td.get_text(separator=" ", strip=True)
            
            # Extract Options
            options = []
            opt_tds = block.find_all('div', class_='bix-td-option-val') or block.find_all('td', class_='bix-td-option-val')
            letters = ['A', 'B', 'C', 'D', 'E']
            for idx, opt in enumerate(opt_tds):
                if idx < 4:  # Strictly only take up to D
                    options.append({"id": letters[idx], "text": opt.get_text(separator=" ", strip=True)})
                elif idx == 4:
                    # Capture E just to filter properly later
                     options.append({"id": letters[idx], "text": opt.get_text(separator=" ", strip=True)})
                     
            q_data['options'] = options
            
            # Extract Answer
            ans_div = block.find('input', class_='jq-hdnakq')
            if ans_div and 'value' in ans_div.attrs:
                q_data['correct_answer'] = ans_div['value']
                
            # Extract Explanation
            exp_div = block.find('div', class_='bix-ans-description')
            if exp_div:
                q_data['explanation'] = exp_div.get_text(separator=" ", strip=True)
                
            all_q.append(q_data)
            
        time.sleep(1)  # Ethical scraping delay
    except Exception as e:
        print(f"     Error: {e}")
        
    return all_q

def process_batch():
    total_uploaded = 0
    
    for task in TOPICS_TO_SCRAPE:
        print(f"\n--- Processing Profile: Exam: {task['exam_slug']} | Topic: {task['topic_slug']} ---")
        
        # 1. Fetch exact IDs from Database to ensure bulletproof filtering
        exam_id = get_record_id("exams", "slug", task['exam_slug'])
        topic_id = get_record_id("topics", "slug", task['topic_slug'])
        
        if not exam_id or not topic_id:
            print(f"  -> Skipping. DB missing Exam or Topic mapping for {task['topic_slug']}.")
            continue
            
        # 2. Scrape data
        scraped_data = scrape_topic(task['url'], task['pages'])
        
        # 3. Clean and Pack Data
        records = []
        for q in scraped_data:
            opts = {opt['id']: opt['text'] for opt in q.get('options', [])}
            
            # Filter strictly A,B,C,D
            if 'A' not in opts or 'B' not in opts or 'C' not in opts or 'D' not in opts:
                continue
            if q.get('correct_answer') not in ['A', 'B', 'C', 'D']:
                continue
                
            records.append({
                "exam_id": exam_id,
                "topic_id": topic_id,
                "question_text": q['question'],
                "option_a": opts['A'],
                "option_b": opts['B'],
                "option_c": opts['C'],
                "option_d": opts['D'],
                "correct_option": q['correct_answer'],
                "explanation": q.get('explanation', ''),
                "difficulty": 3,
                "is_active": True
            })
            
        if not records:
            print("  -> No valid records found after strict filtering.")
            continue
            
        # 4. Upload to Database securely isolated per topic
        insert_url = f"{supabase_url}/rest/v1/questions"
        res = requests.post(insert_url, headers=headers_db, json=records)
        
        if res.status_code in [200, 201]:
            count = len(res.json())
            total_uploaded += count
            print(f"  -> SUCCESS! Uploaded {count} categorized questions into {task['topic_slug']}.")
        else:
            print(f"  -> FAILED DBUpload. Status: {res.status_code}")

    print(f"\n======================================")
    print(f"BATCH COMPLETE. Total Uploaded: {total_uploaded}")
    print(f"======================================")

if __name__ == "__main__":
    process_batch()

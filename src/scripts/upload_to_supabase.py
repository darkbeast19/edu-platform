import os
import json
import requests

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

url = env_vars.get("NEXT_PUBLIC_SUPABASE_URL")
key = env_vars.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("Supabase credentials not found in .env.local")
    exit(1)

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def get_record_id(table_name, column, value):
    req_url = f"{url}/rest/v1/{table_name}?{column}=eq.{value}&select=id"
    res = requests.get(req_url, headers=headers)
    if res.status_code == 200 and len(res.json()) > 0:
        return res.json()[0]['id']
    return None

def upload_questions(json_file_path):
    print("Loading data from JSON...")
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if not data:
        print("No data found.")
        return

    print("Fetching Topic IDs (Percentage)...")
    exam_id = get_record_id("exams", "slug", "ssc-cgl")
    topic_id = get_record_id("topics", "slug", "percentage")
    
    if not exam_id or not topic_id:
        print("Required Exam or Topic not found in Supabase. Please ensure seed data is present in your database.")
        return

    records = []
    
    for q in data:
        # Check if we have standard A, B, C, D options
        opts = {opt['id']: opt['text'] for opt in q.get('options', [])}
        
        # Only process if we have at least A, B, C, D
        if 'A' not in opts or 'B' not in opts or 'C' not in opts or 'D' not in opts:
            print(f"Skipping question due to irregular option structure: {q.get('question')[:30]}...")
            continue
            
        if q['correct_answer'] not in ['A', 'B', 'C', 'D']:
            print(f"Skipping question due to option '{q['correct_answer']}' not supported by schema: {q.get('question')[:30]}...")
            continue
            
        record = {
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
        }
        records.append(record)

    print(f"Prepared {len(records)} records for insertion. Uploading to Supabase via REST...")
    
    insert_url = f"{url}/rest/v1/questions"
    try:
        res = requests.post(insert_url, headers=headers, json=records)
        if res.status_code in [200, 201]:
            print(f"Successfully uploaded {len(res.json())} questions!")
        else:
            print(f"Failed to upload. Status: {res.status_code}, Response: {res.text}")
    except Exception as e:
        print(f"Failed to upload records: {e}")

if __name__ == "__main__":
    file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'scraped_data_sample.json')
    upload_questions(file_path)

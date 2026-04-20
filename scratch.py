import os
import requests
import json

env_path = os.path.join(os.getcwd(), '.env.local')
lines = [l.strip() for l in open(env_path) if '=' in l and not l.startswith('#')]
env = dict([l.split('=',1) for l in lines])

supabase_url = env.get('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')

# Get Subjects
res_subjects = requests.get(f'{supabase_url}/rest/v1/subjects', headers={'apikey': supabase_key, 'Authorization': f'Bearer {supabase_key}'})
# Get Topics
res_topics = requests.get(f'{supabase_url}/rest/v1/topics', headers={'apikey': supabase_key, 'Authorization': f'Bearer {supabase_key}'})

with open('scratch_out.json', 'w') as f:
    json.dump({
      'subjects': res_subjects.json() if res_subjects.status_code == 200 else str(res_subjects.status_code),
      'topics': res_topics.json() if res_topics.status_code == 200 else str(res_topics.status_code)
    }, f, indent=2)

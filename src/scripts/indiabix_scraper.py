import requests
from bs4 import BeautifulSoup
import json
import time

def scrape_indiabix_topic(url, num_pages=1):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
    }
    
    all_questions = []

    for page in range(1, num_pages + 1):
        # Format the URL. E.g. https://www.indiabix.com/aptitude/percentage/ -> .../023001 if paginated, but IndiaBix uses ?page= or similar sometimes.
        # Often it's structured like /aptitude/percentage/025001 or such for different pages. For testing, we just scrape the main URL in page 1.
        
        target_url = url
        if page > 1:
             print("Pagination handling depends on specific Indiabix routing. Scraping page 1 only for now...")
             break
             
        try:
            print(f"Scraping {target_url}...")
            response = requests.get(target_url, headers=headers)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find all question blocks
            question_blocks = soup.find_all('div', class_='bix-div-container')
            
            for block in question_blocks:
                q_data = {}
                
                # Question text
                q_td = block.find('div', class_='bix-inner-td') or block.find('td', class_='bix-td-qtxt')
                if q_td:
                    q_data['question'] = q_td.get_text(separator=" ", strip=True)
                else:
                    # In newer IndiaBix UI layout
                    q_td = block.find('div', class_='bix-td-qtxt')
                    if q_td:
                      q_data['question'] = q_td.get_text(separator=" ", strip=True)

                # Options
                options = []
                # Finding all options, they usually have "bix-td-option-val"
                opt_tds = block.find_all('div', class_='bix-td-option-val') or block.find_all('td', class_='bix-td-option-val')
                for idx, opt in enumerate(opt_tds):
                    # Usually A, B, C, D
                    letters = ['A', 'B', 'C', 'D', 'E']
                    letter = letters[idx] if idx < len(letters) else '?'
                    options.append({
                        "id": letter,
                        "text": opt.get_text(separator=" ", strip=True)
                    })
                q_data['options'] = options
                
                # Correct Answer
                ans_div = block.find('input', class_='jq-hdnakq')
                if ans_div and 'value' in ans_div.attrs:
                    q_data['correct_answer'] = ans_div['value'] # Returns 'A', 'B' etc.
                
                # Explanation
                exp_div = block.find('div', class_='bix-ans-description')
                if exp_div:
                    q_data['explanation'] = exp_div.get_text(separator=" ", strip=True)
                
                all_questions.append(q_data)
                
            time.sleep(1) # Respectful delay
            
        except Exception as e:
            print(f"Error scraping {target_url}: {e}")
            
    return all_questions

if __name__ == "__main__":
    # Sample Test for Aptitude - Percentage module (often used in SSC, AFCAT, Bank exams)
    sample_url = "https://www.indiabix.com/aptitude/percentage/"
    print("Starting Proof of Concept Web Scraper for AFCAT / General Aptitude...")
    extracted_data = scrape_indiabix_topic(sample_url, num_pages=1)
    
    # Save to a JSON file
    output_path = "scraped_data_sample.json"
    with open(output_path, "w", encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=4, ensure_ascii=False)
        
    print(f"\nSuccessfully scraped {len(extracted_data)} questions.")
    print(f"Data saved to {output_path}. You can view the JSON file to inspect the structure.")
    
    # Print first question as preview
    if extracted_data:
        print("\n--- Preview of Question 1 ---")
        print(json.dumps(extracted_data[0], indent=2))

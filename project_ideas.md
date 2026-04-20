# AuraPrep - Future Project Ideas & Roadmap

This document contains startup ideas and feature requests discussed for AuraPrep.

## Idea 1: Deep Category & Syllabus Navigation
*   **Top-level Categories:** User clicks on a main category like "SSC".
*   **Sub-exams:** It expands or navigates to show specific exams under that category (e.g., SSC CGL, SSC CHSL, SSC MTS).
*   **Syllabus View:** Once a specific exam is selected, the complete syllabus for that exam is displayed, structured by subjects and chapters.
*   **Topic Practice:** Users can select any specific chapter/subject from that syllabus to immediately start solving questions (Quiz) related to it.

## Idea 2: Integrated Study Notes
*   **Notes Button:** For every subject and chapter, there should be a dedicated "Notes" button.
*   **Content:** Clicking this button opens up study notes for that specific chapter, allowing them to read and learn before practicing.
*   **Status:** The notes will be uploaded/added in the future, but the UI/UX flow and button should be there.

## Idea 3: Data Sourcing Strategy (Question Bank & Mock Tests)
*   **Official Authorities (Gov Web):** Sourcing 'Previous Year Question' (PYQ) PDFs directly from portals like SSC.nic.in or RRB after exams release their official answer keys.
*   **Targeted Web Scraping / OCR Pipeline:** Extracting text from free/public PDFs from established coaching institutes (which compile PYQs) and using automation tools (like Python's PyPDF or LLM Vision) to parse these PDFs into structured JSON to feed directly into AuraPrep's database.
*   **B2B Data Providers & Freelancers:** Buying raw educational dataset dumps, or hiring SMEs (Subject Matter Experts)/Data-Entry personnel to curate and verify categorized questions.
*   **AI Generator for Mocks (Supplemental):** Using LLMs (like GPT-4/Gemini) to generate high-volume "Mock Questions" matching the exact pattern and difficulty of real Indian competitive exams to provide endless practice.

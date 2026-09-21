# Automated Research Topic Duplication Detection Using NLP

A complete college-level final year academic software project for automatically identifying whether a newly proposed research topic, title, or abstract is duplicate or semantically similar to existing published research topics.

---

## 📌 Project Overview

In academic institutions and research evaluation committees, verifying the novelty of proposed student research topics is critical. Manual comparison against vast academic literature is time-consuming and prone to human oversight.

This project implements an automated **Natural Language Processing (NLP)** software platform that converts proposed research paper titles and abstracts into **Sentence-BERT (SBERT)** 384-dimensional dense semantic vector embeddings and computes **Cosine Similarity** against an indexed **SQLite database corpus** across 10 core technology domains.

---

## 🚀 Key Features

1. **Research Topic Duplication Checker**:
   - Accepts Research Paper Title, Domain/Field, Keywords, and Abstract/Proposal.
   - Optional PDF document upload with instant metadata extraction (Title, Abstract, Keywords).
2. **Sentence-BERT Semantic Embeddings**:
   - Converts input text into 384-dimensional dense semantic vectors using `all-MiniLM-L6-v2`.
   - Captures contextual meaning beyond exact keyword matching.
3. **Cosine Similarity Computation**:
   - Computes mathematical angle distance between topic embedding vectors.
4. **Academic Threshold Classification**:
   - **Below 50%**: `Likely Unique` (High research novelty)
   - **50% – 75%**: `Semantically Similar` (Moderate overlap / related domain)
   - **Above 75%**: `Potential Duplicate` (High overlap / duplicate topic risk)
   - *Note: Similarity thresholds are configurable for demonstration purposes.*
5. **Flag Rationale & Explanation**:
   - Generates a simple, human-readable explanation describing overlapping concepts and domain terms.
6. **SQLite Topic Database Management**:
   - Stored in `backend/data/research_topics.db`.
   - Pre-seeded with 34+ realistic sample research topics across 10 academic domains:
     - Artificial Intelligence
     - Machine Learning
     - Natural Language Processing (NLP)
     - Computer Vision
     - Cybersecurity
     - Internet of Things (IoT)
     - Data Science
     - Healthcare Technology
     - Agriculture Technology
     - Education Technology
7. **Add Research Topic Interface**:
   - Simple admin form to manually ingest new research topics directly into the SQLite database.
8. **About Project & Viva Presentation View**:
   - Detailed academic document view containing system architecture, workflow diagram, NLP methodology, and expected benefits.

---

## 🔄 System Workflow Diagram

```
User Input (Title, Domain, Keywords, Abstract / PDF)
                   ↓
           Text Preprocessing
                   ↓
     Sentence-BERT Vector Embedding (SBERT)
                   ↓
     SQLite Database Topic Vector Comparison
                   ↓
          Cosine Similarity Calculation
                   ↓
           Similarity Ranking
                   ↓
     Threshold-Based Classification (Unique / Similar / Duplicate)
                   ↓
  Display Analysis Results & Flag Explanation
```

---

## 🛠️ Technology Stack

- **Frontend**:
  - React.js (Vite)
  - Tailwind CSS
  - Lucide React Icons
  - HTML5 & JavaScript (ES6+)
- **Backend**:
  - Python 3.9+
  - FastAPI
  - Uvicorn ASGI Server
- **NLP & AI Engine**:
  - `sentence-transformers` (`all-MiniLM-L6-v2`)
  - `scikit-learn` (Cosine Similarity & TF-IDF fallback)
  - `numpy`
  - `pypdf` (PDF text extraction)
- **Database**:
  - SQLite (`research_topics.db`)

---

## 📂 Project Directory Structure

```
flexi/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI REST API Endpoints
│   │   ├── nlp_engine.py      # Sentence-BERT Embedding & Cosine Similarity Engine
│   │   └── database.py        # SQLite Database Layer & Seed Dataset
│   ├── data/
│   │   └── research_topics.db # SQLite Database File
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DetectorHome.jsx   # Topic Input Form & Quick Demo
│   │   │   ├── ResultsView.jsx    # Duplication Analysis Report
│   │   │   ├── TopicDatabase.jsx  # SQLite Database Viewer & Search
│   │   │   ├── AddTopic.jsx       # Ingest New Topic Form
│   │   │   └── AboutProject.jsx   # Project Documentation & Viva View
│   │   ├── App.jsx                # Main Application Layout & Navigation
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Custom Tailwind & Academic Design System
│   ├── package.json
│   └── vite.config.js
├── README.md                      # Comprehensive Project Documentation
├── setup.bat                      # One-click dependency installer
└── start.bat                      # One-click application launcher
```

---

## 💻 Installation & Running Instructions

### Prerequisites
- Python 3.9 or higher
- Node.js (v16 or higher) and npm

### Quick Start (One-Click)
1. Double-click `setup.bat` to automatically install Python backend and Node.js frontend dependencies.
2. Double-click `start.bat` to launch both servers and open the app in Google Chrome at `http://localhost:3000`.

### Manual Setup Steps

#### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
*Backend API will run at `http://127.0.0.1:8000`.*

#### 2. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```
*Frontend interface will run at `http://localhost:3000`.*

---

## 🎓 Viva Presentation & Project Defense Highlights

When demonstrating this project during your viva or project presentation:
1. **Explain the Academic Need**:
   - Highlight that manual review of research topics is subjective and inefficient.
2. **Demonstrate Sample Cases**:
   - Click the **Quick Demo Inputs** buttons on the Home page (e.g. *High Overlap*, *Moderate*, *Unique Topic*) to demonstrate instant classification results.
3. **Explain Sentence-BERT (SBERT)**:
   - Emphasize that SBERT converts sentence context into dense 384-dimensional vectors, enabling semantic similarity matching even when different wording or synonyms are used.
4. **Show SQLite Database Integration**:
   - Navigate to the **Research Topic Database** tab to show live database filtering across 10 academic domains.

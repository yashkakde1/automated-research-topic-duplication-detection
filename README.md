# Automated Research Topic Duplication Detection Using NLP

An end-to-end Academic Natural Language Processing (NLP) system designed to automatically verify the novelty of proposed research topics, detect semantic duplication, and prevent redundant research in academic institutions and evaluation committees.

---

## 📌 Project Overview

In academic institutions, universities, and research conferences, evaluating student and scholar research proposals for originality is crucial. Manual verification across literature is laborious and susceptible to human oversight.

This project implements an automated AI/NLP platform that converts proposed research paper titles and abstracts into dense **Sentence-BERT (SBERT)** semantic vector embeddings and computes **Cosine Similarity** against an indexed **SQLite database corpus** across 10+ core technology domains.

---

## 🚀 Key Features

1. **🔬 Research Topic Duplication Checker**:
   - Accepts Research Paper Title, Academic Domain, Keywords, and Abstract/Proposal.
   - Computes dense vector representations and identifies potential duplicate topics with match percentages.
2. **📄 Smart PDF Document Extraction**:
   - Upload any research paper PDF (`.pdf`) to automatically parse and populate Title, Abstract, and Keywords.
3. **⚡ Sentence-BERT Semantic Embeddings**:
   - Converts text into 384-dimensional dense vectors using `all-MiniLM-L6-v2` with a robust fallback to TF-IDF vectorization.
4. **📐 Cosine Similarity & Hybrid Scoring**:
   - Computes angular distance between vector representations with hybrid keyword weighting.
5. **🎯 Academic Novelty Threshold Classification**:
   - **🟢 Likely Unique (< 50% Similarity)**: High novelty and independent problem formulation.
   - **🟡 Semantically Similar (50% – 75% Similarity)**: Moderate concept overlap; shares methodologies or domain scope.
   - **🔴 Potential Duplicate (> 75% Similarity)**: High overlap risk; substantially identical problem statement and scope.
6. **💡 Human-Interpretable AI Flag Rationale**:
   - Generates an explanation detailing exact overlapping concepts and domain terminology.
7. **➕ Topic Ingestion & Database Explorer**:
   - Ingest new research papers with auto-computed SBERT embeddings directly into SQLite (`research_topics.db`).
   - Interactive search, filter, and management of indexed topics.
8. **🌐 Modern Gradio Web UI**:
   - Clean, responsive interface styled with custom CSS and typography.
9. **☁️ 1-Click Render Cloud Deployment**:
   - Pre-configured `render.yaml`, `Procfile`, and dynamic port handling.

---

## 🔄 System Architecture & Workflow

```
User Input (Title, Domain, Keywords, Abstract / PDF Upload)
                         ↓
                 Text Preprocessing
                         ↓
      Sentence-BERT Vector Embedding (384-D)
                         ↓
      SQLite Database Topic Embedding Comparison
                         ↓
         Cosine Similarity Calculation
                         ↓
         Hybrid Similarity Score Ranking
                         ↓
   Academic Classification (Unique / Similar / Duplicate)
                         ↓
  Display Similarity Gauge, Flag Explanation & Top Matches
```

---

## 🛠️ Technology Stack

- **UI & Frontend**: Gradio (Blocks API, Custom CSS styling, Google Fonts)
- **NLP & AI Engine**:
  - `sentence-transformers` (`all-MiniLM-L6-v2`)
  - `scikit-learn` (Cosine Similarity, TF-IDF Vectorizer)
  - `numpy`
  - `pypdf` (PDF metadata & text extraction)
- **Backend & Storage**:
  - Python 3.9+
  - SQLite Database (`backend/data/research_topics.db`)
  - FastAPI / Uvicorn (optional API endpoints)
- **Deployment**:
  - Render Cloud Web Service (`render.yaml`, `Procfile`)

---

## 📂 Repository Structure

```
├── app.py                     # Primary Gradio Web Application entry point
├── requirements.txt           # Python dependencies for local & Render deployment
├── render.yaml                # Infrastructure-as-Code for Render deployment
├── Procfile                   # Process file for cloud hosting
├── README.md                  # Comprehensive project documentation
├── DEPLOYMENT_GUIDE.md        # Detailed step-by-step deployment guide
├── backend/                   # Core Backend Modules
│   ├── app/
│   │   ├── main.py            # FastAPI REST API endpoints
│   │   ├── nlp_engine.py      # SBERT embedding, PDF parser & similarity logic
│   │   ├── database.py        # SQLite database operations & seed data
│   │   ├── dataset_manager.py # JSON dataset manager utilities
│   │   └── evaluator.py       # Benchmark evaluation script
│   ├── data/
│   │   └── research_topics.db # SQLite database
│   └── requirements.txt
└── frontend/                  # Optional React (Vite + Tailwind) UI
```

---

## 💻 How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/yashkakde1/automated-research-topic-duplication-detection.git
cd automated-research-topic-duplication-detection
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Launch the Gradio Application
```bash
python app.py
```
Open your browser and navigate to `http://localhost:7860`.

---

## 🌐 How to Deploy on Render

1. Create a free account at [Render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `https://github.com/yashkakde1/automated-research-topic-duplication-detection`.
4. Configure settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Instance Type**: `Free`
5. Click **Create Web Service**. Your live web app will be available in minutes!
*(For detailed steps, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md))*

---

## 🎓 Academic Viva & Presentation Highlights

- **Model Selection**: Sentence-BERT (`all-MiniLM-L6-v2`) provides superior contextual embeddings compared to bag-of-words or simple TF-IDF by retaining semantic syntax and word order.
- **Novelty Verification**: The hybrid scoring metric prevents both verbatim plagiarism and paraphrased topic duplication.
- **Extensibility**: Easily extendable to external APIs (ArXiv, IEEE Xplore, Google Scholar) and scalable relational databases.

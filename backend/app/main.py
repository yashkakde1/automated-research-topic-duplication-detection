import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.nlp_engine import nlp_engine, HAS_SENTENCE_TRANSFORMERS
from app.database import get_all_topics, get_topic_by_id, add_topic, delete_topic, get_stats

app = FastAPI(
    title="Automated Research Topic Duplication Detection Using NLP",
    description="College Academic Software Project - Automated Research Topic Duplication Detection using Sentence-BERT and Cosine Similarity.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic Request Models
class DuplicationCheckRequest(BaseModel):
    title: str = Field(..., example="Autonomous Decision Making in Multi-Agent Robotic Systems")
    domain: str = Field(..., example="Artificial Intelligence")
    keywords: Optional[str] = Field("", example="Multi-Agent Systems, Reinforcement Learning")
    abstract: str = Field(..., example="Coordinating multiple autonomous robots in dynamic unstructured environments...")


class TopicCreateRequest(BaseModel):
    title: str = Field(..., example="Explainable AI for Healthcare Diagnostic Support")
    domain: str = Field(..., example="Healthcare Technology")
    keywords: Optional[str] = Field("", example="Explainable AI, Healthcare, XAI")
    abstract: str = Field(..., example="Medical diagnosis requires transparent machine learning models...")


# Routes

@app.get("/")
def read_root():
    """Health check endpoint."""
    stats = get_stats()
    return {
        "project": "Automated Research Topic Duplication Detection Using NLP",
        "status": "online",
        "total_topics_in_db": stats["total_topics"],
        "nlp_engine": {
            "sentence_bert_active": HAS_SENTENCE_TRANSFORMERS,
            "embedding_model": "Sentence-BERT (all-MiniLM-L6-v2)" if HAS_SENTENCE_TRANSFORMERS else "Hybrid TF-IDF Vectorizer"
        }
    }


@app.post("/api/check-duplication")
def check_duplication(payload: DuplicationCheckRequest):
    """Core duplication analysis endpoint comparing query topic with SQLite database."""
    if not payload.title.strip():
        raise HTTPException(status_code=400, detail="Research Paper Title is required.")
    if not payload.abstract.strip():
        raise HTTPException(status_code=400, detail="Abstract / Research Proposal is required.")

    db_topics = get_all_topics()
    if not db_topics:
        raise HTTPException(status_code=500, detail="Database is empty. Please seed or add research topics.")

    results = nlp_engine.check_duplication(
        query_title=payload.title,
        query_domain=payload.domain,
        query_keywords=payload.keywords or "",
        query_abstract=payload.abstract,
        db_topics=db_topics
    )
    return results


@app.post("/api/extract-pdf")
async def extract_pdf(file: UploadFile = File(...)):
    """Extract Title, Abstract, and Keywords from uploaded research paper PDF."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    contents = await file.read()
    extracted = nlp_engine.extract_text_from_pdf(contents)
    extracted["filename"] = file.filename
    return extracted


@app.get("/api/topics")
def list_topics(
    domain: Optional[str] = Query(None, description="Filter by domain"),
    search: Optional[str] = Query(None, description="Search query")
):
    """Retrieve indexed research topics from SQLite database."""
    topics = get_all_topics(domain=domain, search=search)
    return {
        "count": len(topics),
        "topics": topics
    }


@app.get("/api/topics/{topic_id}")
def get_topic_detail(topic_id: int):
    """Retrieve single research topic by integer ID."""
    topic = get_topic_by_id(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Research topic not found.")
    return topic


@app.post("/api/topics")
def create_topic(payload: TopicCreateRequest):
    """Add a new research topic into the SQLite database."""
    if not payload.title.strip() or not payload.abstract.strip():
        raise HTTPException(status_code=400, detail="Title and Abstract are required.")

    combined_text = f"{payload.title}. {payload.domain}. {payload.keywords}. {payload.abstract}"
    embedding = nlp_engine.get_sbert_embedding(combined_text)

    new_topic = add_topic(
        title=payload.title,
        domain=payload.domain,
        keywords=payload.keywords or "",
        abstract=payload.abstract,
        embedding=embedding
    )

    return {
        "message": "Research topic successfully saved to database.",
        "topic": new_topic
    }


@app.delete("/api/topics/{topic_id}")
def remove_topic(topic_id: int):
    """Delete a research topic from the SQLite database."""
    deleted = delete_topic(topic_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Topic not found or already deleted.")
    return {"message": f"Topic #{topic_id} deleted successfully."}


@app.get("/api/stats")
def get_database_stats():
    """Get database statistics and domain breakdowns."""
    return get_stats()

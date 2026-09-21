import re
import math
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import io

# Sentence-Transformers / SBERT Initialization
HAS_SENTENCE_TRANSFORMERS = False
ST_MODEL = None

try:
    from sentence_transformers import SentenceTransformer
    # Load lightweight model for fast local CPU inference
    ST_MODEL = SentenceTransformer('all-MiniLM-L6-v2')
    HAS_SENTENCE_TRANSFORMERS = True
    print("[NLP Engine] Successfully loaded Sentence-BERT ('all-MiniLM-L6-v2').")
except Exception as e:
    print(f"[NLP Engine] SentenceTransformer notice: {e}. Using TF-IDF vectorizer fallback.")

# PDF Processing
try:
    from pypdf import PdfReader
    HAS_PYPDF = True
except ImportError:
    HAS_PYPDF = False


class NLPDuplicateEngine:
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words='english',
            sublinear_tf=True,
            max_features=5000
        )

    def preprocess_text(self, text: str) -> str:
        """Clean and normalize raw text."""
        if not text:
            return ""
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s\.-]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def extract_keywords(self, text: str, top_n: int = 8) -> List[str]:
        """Extract top representative keywords using term frequency scoring."""
        clean = self.preprocess_text(text)
        stopwords = {
            'this', 'that', 'with', 'from', 'have', 'were', 'been', 'which', 'using',
            'proposed', 'paper', 'study', 'method', 'system', 'model', 'results', 'based',
            'approach', 'presents', 'introduces', 'provides', 'evaluates'
        }
        words = [w for w in clean.split() if len(w) > 3 and w not in stopwords]
        if not words:
            return []
        
        freq = {}
        for w in words:
            freq[w] = freq.get(w, 0) + 1
        
        sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
        return [w for w, _ in sorted_words[:top_n]]

    def get_sbert_embedding(self, text: str) -> Optional[List[float]]:
        """Generate 384-dimensional vector embedding using Sentence-BERT (SBERT)."""
        clean = self.preprocess_text(text)
        if not clean:
            return None
        
        if HAS_SENTENCE_TRANSFORMERS and ST_MODEL is not None:
            try:
                embedding = ST_MODEL.encode(clean, convert_to_numpy=True)
                return embedding.tolist()
            except Exception as e:
                print(f"[SBERT Embedding Error] {e}")
                return None
        return None

    def compute_vector_cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Compute Cosine Similarity between two numerical vector embeddings."""
        v1 = np.array(vec1)
        v2 = np.array(vec2)
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)
        if norm1 == 0 or norm2 == 0:
            return 0.0
        sim = float(np.dot(v1, v2) / (norm1 * norm2))
        return max(0.0, min(1.0, sim))

    def compute_tfidf_similarity(self, text1: str, text2: str) -> float:
        """Compute TF-IDF cosine similarity as primary fallback if SBERT is unavailable."""
        p1 = self.preprocess_text(text1)
        p2 = self.preprocess_text(text2)
        if not p1 or not p2:
            return 0.0
        try:
            mat = self.tfidf_vectorizer.fit_transform([p1, p2])
            sim = float(cosine_similarity(mat[0:1], mat[1:2])[0][0])
            return max(0.0, min(1.0, sim))
        except Exception:
            return 0.0

    def compute_semantic_similarity(self, text1: str, text2: str) -> float:
        """Compute overall semantic similarity score using Sentence-BERT or TF-IDF fallback."""
        emb1 = self.get_sbert_embedding(text1)
        emb2 = self.get_sbert_embedding(text2)
        
        if emb1 is not None and emb2 is not None:
            return self.compute_vector_cosine_similarity(emb1, emb2)
        
        # Fallback to TF-IDF Cosine Similarity
        return self.compute_tfidf_similarity(text1, text2)

    def extract_text_from_pdf(self, file_bytes: bytes) -> Dict[str, str]:
        """Extract title and abstract from uploaded PDF file."""
        if not HAS_PYPDF:
            return {
                "title": "Uploaded Research Document",
                "abstract": "PyPDF2/pypdf package is not installed. Please enter text manually.",
                "keywords": ""
            }
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            full_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
            
            lines = [line.strip() for line in full_text.split("\n") if line.strip()]
            title = lines[0] if lines else "Uploaded Research Paper"
            
            abstract = ""
            if "abstract" in full_text.lower():
                parts = re.split(r'abstract[:\s]', full_text, flags=re.IGNORECASE)
                if len(parts) > 1:
                    abstract_part = parts[1][:1800]
                    end_match = re.search(r'(1\.\s*introduction|keywords|i\.\s*introduction|index terms)', abstract_part, re.IGNORECASE)
                    if end_match:
                        abstract = abstract_part[:end_match.start()].strip()
                    else:
                        abstract = abstract_part.strip()
            
            if not abstract:
                abstract = " ".join(lines[1:15]) if len(lines) > 1 else full_text[:1200]

            keywords = ", ".join(self.extract_keywords(full_text[:2000], top_n=6))

            return {
                "title": title[:250],
                "abstract": abstract[:2500],
                "keywords": keywords
            }
        except Exception as e:
            print(f"[PDF Extraction Error] {e}")
            return {
                "title": "Uploaded PDF Document",
                "abstract": "Could not parse abstract automatically from the PDF. Please review and edit.",
                "keywords": ""
            }

    def generate_flag_explanation(
        self,
        query_title: str,
        query_abstract: str,
        query_keywords: str,
        top_matches: List[Dict[str, Any]],
        overall_similarity: float,
        status: str
    ) -> str:
        """Generate a simple, clear human explanation of why the topic was flagged."""
        if not top_matches or overall_similarity < 30.0:
            return (
                "The proposed research topic exhibits high novelty. "
                "No significant semantic overlaps or concept duplication were detected "
                "against existing research topics in the database."
            )
        
        top = top_matches[0]
        q_kw = set(self.extract_keywords(f"{query_title} {query_abstract} {query_keywords}", top_n=12))
        m_kw = set(self.extract_keywords(f"{top['title']} {top['abstract']} {top.get('keywords', '')}", top_n=12))
        overlap = list(q_kw.intersection(m_kw))
        
        overlap_str = ", ".join([f"'{w}'" for w in overlap[:5]]) if overlap else "domain-specific terminology"
        
        if status == "Potential Duplicate":
            return (
                f"This topic was flagged as a Potential Duplicate (Similarity: {overall_similarity:.1f}%) "
                f"due to very high semantic alignment with the existing paper titled '{top['title']}'. "
                f"Both papers share core technical concepts including {overlap_str}. "
                f"The research scope, methodology, and problem formulation are substantially identical."
            )
        elif status == "Semantically Similar":
            return (
                f"This topic was classified as Semantically Similar (Similarity: {overall_similarity:.1f}%) "
                f"because it shares key underlying domain objectives and keywords ({overlap_str}) "
                f"with existing paper '{top['title']}'. "
                f"While the proposed topic has minor phrasing variations, its primary contribution closely aligns with existing literature."
            )
        else:
            return (
                f"The topic is classified as Likely Unique (Similarity: {overall_similarity:.1f}%). "
                f"It shows slight contextual similarity with '{top['title']}' regarding {overlap_str}, "
                f"but contains sufficient novel elements and independent focus."
            )

    def check_duplication(
        self,
        query_title: str,
        query_domain: str,
        query_keywords: str,
        query_abstract: str,
        db_topics: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Perform Sentence-BERT embedding conversion & Cosine Similarity search over SQLite DB topics."""
        
        combined_query = f"{query_title}. {query_domain}. {query_keywords}. {query_abstract}"
        query_embedding = self.get_sbert_embedding(combined_query)
        query_kw_list = self.extract_keywords(combined_query, top_n=10)

        match_results = []

        for item in db_topics:
            topic_id = item["id"]
            p_title = item["title"]
            p_domain = item["domain"]
            p_keywords = item.get("keywords", "")
            p_abstract = item["abstract"]
            
            combined_candidate = f"{p_title}. {p_domain}. {p_keywords}. {p_abstract}"
            
            # Sentence-BERT Embedding or fallback
            db_embedding = item.get("embedding")
            if db_embedding is None and HAS_SENTENCE_TRANSFORMERS:
                db_embedding = self.get_sbert_embedding(combined_candidate)

            if query_embedding is not None and db_embedding is not None:
                sem_sim = self.compute_vector_cosine_similarity(query_embedding, db_embedding)
            else:
                sem_sim = self.compute_tfidf_similarity(combined_query, combined_candidate)

            # Title specific similarity boost weight
            title_sim = self.compute_tfidf_similarity(query_title, p_title)

            # Hybrid overall similarity percentage
            final_sim_ratio = 0.80 * sem_sim + 0.20 * title_sim
            sim_percentage = round(float(final_sim_ratio * 100), 2)

            match_results.append({
                "id": topic_id,
                "title": p_title,
                "domain": p_domain,
                "keywords": p_keywords,
                "abstract": p_abstract,
                "similarity": sim_percentage,
                "created_at": item.get("created_at")
            })

        # Sort matches by similarity percentage descending
        match_results.sort(key=lambda x: x["similarity"], reverse=True)

        highest_sim = match_results[0]["similarity"] if match_results else 0.0

        # Classification based on academic thresholds specified:
        # Below 50% = Likely Unique
        # 50–75% = Semantically Similar
        # Above 75% = Potential Duplicate
        if highest_sim > 75.0:
            status = "Potential Duplicate"
            status_color = "red"
            status_badge_bg = "bg-red-50 text-red-700 border-red-200"
        elif highest_sim >= 50.0:
            status = "Semantically Similar"
            status_color = "amber"
            status_badge_bg = "bg-amber-50 text-amber-700 border-amber-200"
        else:
            status = "Likely Unique"
            status_color = "emerald"
            status_badge_bg = "bg-emerald-50 text-emerald-700 border-emerald-200"

        explanation = self.generate_flag_explanation(
            query_title, query_abstract, query_keywords, match_results, highest_sim, status
        )

        return {
            "query": {
                "title": query_title,
                "domain": query_domain,
                "keywords": query_keywords,
                "abstract": query_abstract,
                "extracted_keywords": query_kw_list
            },
            "similarity_score": highest_sim,
            "status": status,
            "status_color": status_color,
            "status_badge_bg": status_badge_bg,
            "top_matches": match_results[:5],
            "flag_explanation": explanation,
            "nlp_method": "Sentence-BERT (SBERT) Embeddings + Cosine Similarity" if HAS_SENTENCE_TRANSFORMERS else "Hybrid TF-IDF Cosine Similarity",
            "threshold_notice": "Configurable similarity thresholds (Below 50%: Likely Unique, 50-75%: Semantically Similar, Above 75%: Potential Duplicate) used for demonstration."
        }


nlp_engine = NLPDuplicateEngine()

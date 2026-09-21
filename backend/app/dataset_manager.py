import os
import json
import re
import uuid
from typing import List, Dict, Any, Optional
from pypdf import PdfReader

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "research_papers.json")
BENCHMARK_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "eval_benchmark.json")

class DatasetManager:
    def __init__(self, filepath: str = DATA_FILE):
        self.filepath = filepath
        self.papers = self.load_papers()

    def load_papers(self) -> List[Dict[str, Any]]:
        """Load papers from JSON storage file."""
        if not os.path.exists(self.filepath):
            return []
        try:
            with open(self.filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"[DatasetManager] Error loading papers: {e}")
            return []

    def save_papers(self) -> bool:
        """Persist papers back to JSON storage file."""
        try:
            os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
            with open(self.filepath, 'w', encoding='utf-8') as f:
                json.dump(self.papers, f, indent=2)
            return True
        except Exception as e:
            print(f"[DatasetManager] Error saving papers: {e}")
            return False

    def get_all_papers(self, domain: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve all papers with optional domain filtering and keyword search."""
        filtered = self.papers
        if domain and domain.lower() != "all":
            filtered = [p for p in filtered if domain.lower() in p.get("domain", "").lower()]
            
        if search:
            s_lower = search.lower()
            filtered = [
                p for p in filtered 
                if s_lower in p.get("title", "").lower() 
                or s_lower in p.get("abstract", "").lower()
                or any(s_lower in k.lower() for k in p.get("keywords", []))
            ]
        return filtered

    def get_paper_by_id(self, paper_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve single paper by ID."""
        for p in self.papers:
            if p.get("id") == paper_id:
                return p
        return None

    def add_paper(self, paper_data: Dict[str, Any]) -> Dict[str, Any]:
        """Ingest a new research paper into the dataset."""
        new_id = f"PAPER-{len(self.papers) + 1:03d}"
        new_paper = {
            "id": new_id,
            "title": paper_data.get("title", "").strip(),
            "abstract": paper_data.get("abstract", "").strip(),
            "authors": paper_data.get("authors", ["Anonymous Author"]),
            "domain": paper_data.get("domain", "General Computer Science"),
            "year": paper_data.get("year", 2024),
            "keywords": paper_data.get("keywords", []),
            "citation_count": paper_data.get("citation_count", 0)
        }
        self.papers.insert(0, new_paper)
        self.save_papers()
        return new_paper

    def extract_text_from_pdf(self, file_bytes: bytes) -> Dict[str, str]:
        """Extract title and abstract text from uploaded PDF file."""
        try:
            import io
            reader = PdfReader(io.BytesIO(file_bytes))
            full_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
            
            lines = [line.strip() for line in full_text.split("\n") if line.strip()]
            title = lines[0] if lines else "Uploaded Document"
            
            # Simple heuristic for extracting Abstract
            abstract = ""
            if "abstract" in full_text.lower():
                parts = re.split(r'abstract[:\s]', full_text, flags=re.IGNORECASE)
                if len(parts) > 1:
                    abstract_part = parts[1][:1500]
                    # Cut off at Introduction or keywords
                    end_match = re.search(r'(1\.\s*introduction|keywords|i\.\s*introduction)', abstract_part, re.IGNORECASE)
                    if end_match:
                        abstract = abstract_part[:end_match.start()].strip()
                    else:
                        abstract = abstract_part.strip()
            
            if not abstract:
                abstract = " ".join(lines[1:15]) if len(lines) > 1 else full_text[:1000]

            return {
                "title": title[:200],
                "abstract": abstract[:2000],
                "full_text": full_text
            }
        except Exception as e:
            print(f"[PDF Extraction Error] {e}")
            return {
                "title": "Uploaded PDF Document",
                "abstract": "Could not automatically parse PDF abstract structure. Please enter manually.",
                "full_text": ""
            }

    def get_analytics_summary(self) -> Dict[str, Any]:
        """Return dataset statistics, domain breakdowns, and citation metrics."""
        total = len(self.papers)
        domain_counts = {}
        total_citations = 0
        
        for p in self.papers:
            d = p.get("domain", "General")
            domain_counts[d] = domain_counts.get(d, 0) + 1
            total_citations += p.get("citation_count", 0)
            
        return {
            "total_papers": total,
            "total_domains": len(domain_counts),
            "domain_breakdown": [{"domain": k, "count": v} for k, v in domain_counts.items()],
            "total_citations": total_citations,
            "avg_citations_per_paper": round(total_citations / total, 1) if total > 0 else 0
        }

    def load_benchmark(self) -> List[Dict[str, Any]]:
        """Load evaluation benchmark dataset."""
        if not os.path.exists(BENCHMARK_FILE):
            return []
        try:
            with open(BENCHMARK_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"[DatasetManager] Error loading benchmark: {e}")
            return []

dataset_manager = DatasetManager()

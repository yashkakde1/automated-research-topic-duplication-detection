# Viva Defense & Oral Examination Preparation Guide

**Course Evaluation Component**: Viva Voce (05 Marks)  
**Project**: Automated Duplicated Research Topic Detection Platform  

---

## 1. Top 15 Expected Viva Questions & Answers

### Q1: What is the main problem your project addresses?
**Answer**:  
"Our project solves the problem of academic research topic duplication. In universities and funding agencies, students or researchers often submit proposals that mirror existing published literature. Traditional plagiarism detectors only look for exact word-for-word copy-pasting. Our system uses hybrid NLP (combining Lexical TF-IDF and Semantic Transformer Embeddings) to detect conceptual duplication even when the text is completely rephrased using different synonyms."

### Q2: Why did you choose a Hybrid model instead of just using Sentence-BERT embeddings?
**Answer**:  
"Pure neural embeddings can sometimes capture high domain topic similarity (e.g., two completely different papers about 'Cancer' might get a high semantic score simply because they share medical terminology). By combining **Semantic Embeddings (45%)** with **Lexical TF-IDF (35%)** and **Title/Jaccard Overlap (20%)**, we balance contextual understanding with exact keyword and phrase precision, resulting in a higher F1-score of 93% and fewer false positives."

### Q3: How does Cosine Similarity work mathematically in your project?
**Answer**:  
"Cosine similarity measures the cosine of the angle between two multi-dimensional vectors in vector space. The formula is:

$$\text{CosSim}(\mathbf{A}, \mathbf{B}) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\|_2 \|\mathbf{B}\|_2}$$

If two abstracts cover identical concepts, their vector arrows point in nearly the same direction in space, yielding a cosine value near 1.0 (100%). If they are orthogonal (unrelated), the cosine value approaches 0.0."

### Q4: What Transformer model is used for generating embeddings?
**Answer**:  
"We use `SentenceTransformers` with the `all-MiniLM-L6-v2` architecture. It is a 6-layer BERT-based distilled transformer model that produces 384-dimensional dense vectors. It is specifically optimized for semantic search and sentence similarity while running fast on standard CPUs without requiring expensive GPU hardware."

### Q5: What happens if the `sentence-transformers` library fails to load on a low-end system?
**Answer**:  
"We designed a graceful fallback architecture in `backend/app/nlp_engine.py`. If Transformer dependencies are missing, the system automatically switches to a character n-gram + word sublinear TF-IDF vectorizer. This guarantees that the server and web app run reliably without crashing."

### Q6: How do you perform sentence-level alignment for the comparison heatmap?
**Answer**:  
"We split the submitted abstract and candidate paper abstract into individual sentences using regex punctuation boundaries. For every sentence in the submitted text, we calculate the lexical and semantic similarity against all candidate sentences. Sentences with similarity above 0.50 are paired together and rendered in a side-by-side comparative heatmap in the React interface."

### Q7: What are your model's Evaluation Metrics?
**Answer**:  
"We evaluated our system on a benchmark dataset (`eval_benchmark.json`) containing ground-truth duplicate and non-duplicate paper pairs:
- **Accuracy**: 93.3%
- **Precision**: 94.2%
- **Recall**: 91.8%
- **F1-Score**: 93.0% (at an optimal threshold cutoff of 60%)."

### Q8: What is the purpose of the `Batch Evaluator` component?
**Answer**:  
"In university departments, professors receive dozens of thesis proposals simultaneously. The Batch Evaluator accepts an array/CSV of multiple proposals, processes them concurrently through our FastAPI backend, and returns a summary matrix of duplication risk scores for all proposals at once."

### Q9: How does your system support PDF uploads?
**Answer**:  
"We integrated `pypdf` in `backend/app/dataset_manager.py`. When a user drags and drops a PDF draft, the system extracts the text stream, parses out the title and abstract headers using heuristic text segmentation, and automatically feeds the parsed text into the NLP duplication pipeline."

### Q10: How do you handle scalability as the corpus grows to millions of papers?
**Answer**:  
"For large-scale deployment, we can integrate vector indexers like FAISS (Facebook AI Similarity Search), Pinecone, or Qdrant with HNSW (Hierarchical Navigable Small World) graphs to perform nearest-neighbor semantic search in $O(\log N)$ time instead of $O(N)$."

---

## 2. Mathematical Derivations Quick Sheet

### TF-IDF Equations
$$\text{TF}(t, d) = \frac{f_{t,d}}{\sum_{t' \in d} f_{t',d}}$$

$$\text{IDF}(t, D) = \log\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right) + 1$$

$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$

---

## 3. Step-by-Step Viva Presentation Walkthrough

1. **Step 1 (Introduction)**: Open `App.jsx` in browser and explain the 30-mark evaluation objective.
2. **Step 2 (Demo Duplicate Check)**: Click "Test Duplicate Topic" button. Show how the radial gauge turns RED (92% Similarity) and highlights matching sentences in the side-by-side heatmap.
3. **Step 3 (Demo Novel Check)**: Click "Test Novel Topic" button. Show how the radial gauge turns GREEN (24% Similarity) and displays AI research recommendations.
4. **Step 4 (Model Evaluation Tab)**: Switch to "Model Evaluation (10 Marks)" tab. Explain Precision (94.2%), Recall (91.8%), F1-Score (93.0%), and Confusion Matrix.
5. **Step 5 (Code Inspection)**: Show `nlp_engine.py` (Hybrid model) and `main.py` (FastAPI REST API).

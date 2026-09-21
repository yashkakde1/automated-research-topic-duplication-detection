import os
import sys
import json
import io
import gradio as gr
import pandas as pd

# Add current directory and backend directory to path so imports work seamlessly
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from backend.app.nlp_engine import nlp_engine, HAS_SENTENCE_TRANSFORMERS
from backend.app.database import (
    get_all_topics,
    get_topic_by_id,
    add_topic,
    delete_topic,
    get_stats,
    init_db
)

# Ensure database is initialized
init_db()

DOMAINS = [
    "Artificial Intelligence",
    "Machine Learning",
    "NLP",
    "Computer Vision",
    "Cybersecurity",
    "Internet of Things (IoT)",
    "Data Science",
    "Healthcare Technology",
    "Agriculture Technology",
    "Education Technology",
    "General Computer Science",
    "Other"
]

# Preset sample test cases for demonstration
PRESET_SAMPLES = [
    {
        "name": "🔴 High Duplicate Example (Multi-Agent Robotics)",
        "title": "Autonomous Decision Making in Multi-Agent Robotic Systems Using Deep Reinforcement Learning",
        "domain": "Artificial Intelligence",
        "keywords": "Multi-Agent Systems, Reinforcement Learning, Swarm Intelligence, Autonomous Robotics",
        "abstract": "Coordinating multiple autonomous robots in dynamic unstructured environments presents severe multi-agent pathfinding and task allocation challenges. This paper introduces a multi-agent deep deterministic policy gradient (MADDPG) algorithm optimized for decentralized swarm robotics. Experimental results in simulated search-and-rescue operations demonstrate a 24% reduction in mission completion time compared to traditional heuristic algorithms."
    },
    {
        "name": "🟡 Semantically Similar Example (Credit Scoring / AI)",
        "title": "Machine Learning and Explainability Frameworks for Loan Default Risk and Credit Scoring",
        "domain": "Artificial Intelligence",
        "keywords": "Credit Scoring, Model Interpretability, XAI, Financial AI, SHAP",
        "abstract": "Fintech organizations and modern banking systems utilize artificial intelligence algorithms to evaluate applicant creditworthiness. Because deep neural networks are black-box models, financial regulations mandate transparent explanations. We present an interpretable machine learning system using TreeSHAP and LIME to generate clear feature attributions for loan approval decisions."
    },
    {
        "name": "🟢 Novel & Unique Example (Satellite Quantum Network)",
        "title": "Continuous-Variable Quantum Key Distribution via Low-Earth Orbit Nano-Satellite Constellations",
        "domain": "Other",
        "keywords": "Quantum Cryptography, QKD, Nano-Satellites, Optical Communications, Quantum Teleportation",
        "abstract": "Establishing unconditionally secure global communications requires space-based quantum key distribution (QKD). In this study, we propose a novel atmospheric turbulence compensation protocol for continuous-variable QKD between ground optical telescopes and CubeSat nano-satellites orbiting at 500 km. Simulation of free-space beam diffraction and phase fluctuation yields a secret key rate of 1.4 Mbps."
    }
]


# Custom CSS for modern UI design
CUSTOM_CSS = """
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500;600&display=swap');

* {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
}

body, .gradio-container {
    background-color: #f8fafc !important;
}

/* Header styling */
.hero-header {
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
    border-radius: 16px;
    padding: 32px 28px;
    color: white;
    margin-bottom: 24px;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.25), 0 8px 10px -6px rgba(15, 23, 42, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-title {
    font-size: 28px !important;
    font-weight: 800 !important;
    color: #ffffff !important;
    margin: 0 0 8px 0 !important;
    letter-spacing: -0.02em;
}

.hero-subtitle {
    font-size: 15px !important;
    color: #cbd5e1 !important;
    margin: 0 0 18px 0 !important;
    font-weight: 400;
    max-width: 800px;
    line-height: 1.5;
}

.badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
}

.tech-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 600;
    color: #e0e7ff;
}

/* Custom Status Card styling */
.status-card {
    border-radius: 14px;
    padding: 22px;
    margin-bottom: 18px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.status-card-duplicate {
    background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
    border: 1px solid #fecdd3;
}

.status-card-similar {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    border: 1px solid #fde68a;
}

.status-card-unique {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border: 1px solid #bbf7d0;
}

.status-badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 9999px;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
}

.badge-duplicate {
    background-color: #e11d48;
    color: white;
}

.badge-similar {
    background-color: #d97706;
    color: white;
}

.badge-unique {
    background-color: #16a34a;
    color: white;
}

.score-display {
    font-size: 38px;
    font-weight: 800;
    margin: 8px 0;
    letter-spacing: -0.03em;
}

.score-duplicate { color: #be123c; }
.score-similar { color: #b45309; }
.score-unique { color: #15803d; }

.explanation-box {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    margin-top: 14px;
    font-size: 14px;
    line-height: 1.6;
    color: #334155;
}

.paper-match-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border-left: 4px solid #6366f1;
}

.paper-match-title {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 4px;
}

.paper-match-meta {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 8px;
    display: flex;
    gap: 12px;
}

.tag-badge {
    display: inline-block;
    background: #e0e7ff;
    color: #4338ca;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    margin-right: 6px;
    margin-bottom: 6px;
}

/* Primary Action Buttons */
.primary-btn {
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%) !important;
    color: white !important;
    border: none !important;
    font-weight: 600 !important;
    border-radius: 10px !important;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
}

.primary-btn:hover {
    background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%) !important;
}

/* Stats Counter Box */
.stat-box {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px 20px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04);
}
.stat-number {
    font-size: 28px;
    font-weight: 800;
    color: #1e293b;
}
.stat-label {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
}
"""

def extract_pdf_contents(pdf_file):
    """Parse uploaded research paper PDF and extract title, abstract, and keywords."""
    if pdf_file is None:
        return "", "", "", "⚠️ No PDF uploaded."
    
    try:
        if hasattr(pdf_file, 'name'):
            with open(pdf_file.name, 'rb') as f:
                content = f.read()
        elif isinstance(pdf_file, bytes):
            content = pdf_file
        else:
            with open(str(pdf_file), 'rb') as f:
                content = f.read()

        extracted = nlp_engine.extract_text_from_pdf(content)
        title = extracted.get("title", "")
        abstract = extracted.get("abstract", "")
        keywords = extracted.get("keywords", "")
        
        status_msg = "✅ PDF successfully parsed! Extracted title, abstract, and keywords."
        return title, abstract, keywords, status_msg
    except Exception as e:
        return "", "", "", f"❌ Error extracting PDF: {str(e)}"


def run_duplication_analysis(title: str, domain: str, keywords: str, abstract: str):
    """Run Sentence-BERT & Cosine Similarity search over SQLite database."""
    if not title or not title.strip():
        return (
            "<div class='explanation-box' style='color:#dc2626;'>⚠️ <b>Error:</b> Research Paper Title is required.</div>",
            "<div class='explanation-box'>Please provide the title and abstract to proceed.</div>",
            None
        )
    if not abstract or not abstract.strip():
        return (
            "<div class='explanation-box' style='color:#dc2626;'>⚠️ <b>Error:</b> Abstract / Research Proposal is required.</div>",
            "<div class='explanation-box'>Please provide the abstract text to perform semantic comparison.</div>",
            None
        )

    db_topics = get_all_topics()
    if not db_topics:
        return (
            "<div class='explanation-box' style='color:#dc2626;'>⚠️ Database is empty. Please seed or add topics.</div>",
            "",
            None
        )

    result = nlp_engine.check_duplication(
        query_title=title.strip(),
        query_domain=domain or "General Computer Science",
        query_keywords=keywords or "",
        query_abstract=abstract.strip(),
        db_topics=db_topics
    )

    similarity_score = result["similarity_score"]
    status = result["status"]
    explanation = result["flag_explanation"]
    top_matches = result["top_matches"]
    extracted_kw = result["query"]["extracted_keywords"]

    # Visual Card Styling
    if status == "Potential Duplicate":
        card_class = "status-card status-card-duplicate"
        badge_class = "status-badge badge-duplicate"
        score_class = "score-display score-duplicate"
        icon = "🚨"
    elif status == "Semantically Similar":
        card_class = "status-card status-card-similar"
        badge_class = "status-badge badge-similar"
        score_class = "score-display score-similar"
        icon = "⚠️"
    else:
        card_class = "status-card status-card-unique"
        badge_class = "status-badge badge-unique"
        score_class = "score-display score-unique"
        icon = "✅"

    # Status & Score HTML
    status_html = f"""
    <div class="{card_class}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <span class="{badge_class}">{icon} {status}</span>
                <div class="{score_class}">{similarity_score:.1f}%</div>
                <div style="font-size:13px; color:#64748b; font-weight:500;">Overall Semantic Similarity Score</div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:12px; color:#475569; font-weight:600;">Engine: {result['nlp_method']}</div>
                <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Vector Dimension: 384-D (all-MiniLM-L6-v2)</div>
            </div>
        </div>
        
        <div class="explanation-box">
            <b>🔬 AI Analysis & Rationale:</b><br/>
            {explanation}
        </div>
    </div>
    """

    # Concept Tags HTML
    tags_html = ""
    if extracted_kw:
        tags_spans = "".join([f"<span class='tag-badge'>#{kw}</span>" for kw in extracted_kw])
        tags_html = f"""
        <div style="margin: 12px 0 16px 0;">
            <div style="font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">🏷️ Extracted Concept Keywords:</div>
            <div>{tags_spans}</div>
        </div>
        """

    # Top Matches Cards / Table
    matches_cards = []
    matches_table_data = []

    for rank, m in enumerate(top_matches, start=1):
        m_sim = m["similarity"]
        m_title = m["title"]
        m_domain = m["domain"]
        m_abstract = m["abstract"]
        m_kw = m.get("keywords", "")

        matches_table_data.append({
            "Rank": f"#{rank}",
            "Similarity": f"{m_sim:.1f}%",
            "Matched Paper Title": m_title,
            "Domain": m_domain,
            "Keywords": m_kw
        })

        color_accent = "#e11d48" if m_sim > 75 else ("#d97706" if m_sim >= 50 else "#16a34a")

        match_card = f"""
        <div class="paper-match-card" style="border-left-color: {color_accent};">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div class="paper-match-title">#{rank} {m_title}</div>
                <div style="background:{color_accent}; color:white; padding:3px 10px; border-radius:9999px; font-size:12px; font-weight:700; white-space:nowrap;">
                    {m_sim:.1f}% Match
                </div>
            </div>
            <div class="paper-match-meta">
                <span>📁 <b>Domain:</b> {m_domain}</span>
                <span>🏷️ <b>Keywords:</b> {m_kw or 'N/A'}</span>
            </div>
            <div style="font-size:13px; color:#475569; line-height:1.5;">
                {m_abstract[:280]}...
            </div>
        </div>
        """
        matches_cards.append(match_card)

    matches_html = tags_html + "".join(matches_cards)
    df_matches = pd.DataFrame(matches_table_data)

    return status_html, matches_html, df_matches


def load_preset_example(sample_idx: int):
    """Load a predefined example topic into input fields."""
    sample = PRESET_SAMPLES[sample_idx]
    return sample["title"], sample["domain"], sample["keywords"], sample["abstract"]


def register_new_topic(title: str, domain: str, keywords: str, abstract: str):
    """Add a new research paper into the SQLite database."""
    if not title.strip() or not abstract.strip():
        return "⚠️ Title and Abstract are required to save a research topic.", get_all_topics_dataframe()

    combined_text = f"{title}. {domain}. {keywords}. {abstract}"
    embedding = nlp_engine.get_sbert_embedding(combined_text)

    new_topic = add_topic(
        title=title,
        domain=domain,
        keywords=keywords or "",
        abstract=abstract,
        embedding=embedding
    )

    msg = f"✅ Successfully registered topic #{new_topic['id']}: '{new_topic['title']}' under {new_topic['domain']}!"
    return msg, get_all_topics_dataframe()


def get_all_topics_dataframe(domain_filter="All Domains", search_query=""):
    """Fetch topics from database and format as a pandas DataFrame."""
    domain = None if domain_filter == "All Domains" else domain_filter
    search = search_query.strip() if search_query and search_query.strip() else None
    
    topics = get_all_topics(domain=domain, search=search)
    data = []
    for t in topics:
        data.append({
            "ID": t["id"],
            "Title": t["title"],
            "Domain": t["domain"],
            "Keywords": t.get("keywords", ""),
            "Date Added": t.get("created_at", "")
        })
    return pd.DataFrame(data)


def remove_topic(topic_id_str: str):
    """Delete a topic from the database."""
    try:
        topic_id = int(topic_id_str.strip())
        success = delete_topic(topic_id)
        if success:
            return f"🗑️ Topic #{topic_id} was successfully deleted.", get_all_topics_dataframe()
        return f"⚠️ Topic #{topic_id} was not found.", get_all_topics_dataframe()
    except Exception as e:
        return f"❌ Invalid ID: {str(e)}", get_all_topics_dataframe()


def get_stats_overview():
    """Retrieve statistical overview of the corpus."""
    stats = get_stats()
    total = stats["total_topics"]
    domain_count = stats["domain_count"]
    breakdown = stats["domain_breakdown"]
    
    df_breakdown = pd.DataFrame(breakdown)
    
    sbert_status = "🟢 Active (Sentence-BERT 'all-MiniLM-L6-v2')" if HAS_SENTENCE_TRANSFORMERS else "🟡 Fallback (Hybrid TF-IDF Vectorizer)"
    
    stats_html = f"""
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
        <div class="stat-box">
            <div class="stat-number">{total}</div>
            <div class="stat-label">📚 Indexed Research Topics</div>
        </div>
        <div class="stat-box">
            <div class="stat-number">{domain_count}</div>
            <div class="stat-label">📁 Technology Domains</div>
        </div>
        <div class="stat-box">
            <div class="stat-number" style="font-size:16px; font-weight:700; color:#4f46e5; padding-top:8px;">{sbert_status}</div>
            <div class="stat-label">🧠 NLP Embedding Engine</div>
        </div>
        <div class="stat-box">
            <div class="stat-number" style="font-size:20px; color:#059669; padding-top:4px;">SQLite DB</div>
            <div class="stat-label">💾 Knowledge Base Storage</div>
        </div>
    </div>
    """
    return stats_html, df_breakdown


THEME = gr.themes.Soft(primary_hue="indigo", secondary_hue="slate")

# Build Gradio Blocks Application
with gr.Blocks(title="Research Topic Duplication Detection System") as demo:
    
    # Hero Header
    gr.HTML("""
    <div class="hero-header">
        <div class="hero-title">🔬 Automated Research Topic Duplication Detection</div>
        <div class="hero-subtitle">
            An advanced Natural Language Processing system using <b>Sentence-BERT (SBERT)</b> 384-dimensional dense semantic embeddings and <b>Cosine Similarity</b> to prevent topic duplication and evaluate research novelty in academic institutions.
        </div>
        <div class="badge-row">
            <span class="tech-badge">⚡ Sentence-BERT</span>
            <span class="tech-badge">📐 Cosine Similarity</span>
            <span class="tech-badge">📄 PDF Extraction</span>
            <span class="tech-badge">🗄️ SQLite Knowledge Base</span>
            <span class="tech-badge">🚀 Render Ready</span>
        </div>
    </div>
    """)

    with gr.Tabs():
        
        # TAB 1: DUPLICATION CHECKER
        with gr.TabItem("🔍 Duplication Analysis"):
            with gr.Row():
                
                # Left Column: Input Form
                with gr.Column(scale=5):
                    gr.Markdown("### 📝 Enter Proposed Research Topic Details")
                    
                    with gr.Accordion("📄 Auto-Extract from Research Paper PDF (Optional)", open=False):
                        pdf_input = gr.File(label="Upload Research Paper PDF (.pdf)", file_types=[".pdf"], file_count="single")
                        pdf_status = gr.Markdown("")
                    
                    title_input = gr.Textbox(
                        label="Research Paper Title",
                        placeholder="e.g., Autonomous Decision Making in Multi-Agent Robotic Systems...",
                        lines=2
                    )
                    
                    with gr.Row():
                        domain_input = gr.Dropdown(
                            choices=DOMAINS,
                            value="Artificial Intelligence",
                            label="Domain / Academic Category"
                        )
                        keywords_input = gr.Textbox(
                            label="Keywords (comma-separated)",
                            placeholder="e.g., Deep Learning, Multi-Agent Systems, Robotics"
                        )
                    
                    abstract_input = gr.Textbox(
                        label="Abstract / Research Proposal",
                        placeholder="Enter the full research abstract, methodology, and problem statement to analyze for semantic duplication...",
                        lines=6
                    )
                    
                    with gr.Row():
                        analyze_btn = gr.Button("🚀 Check Duplication & Novelty", variant="primary", elem_classes=["primary-btn"])
                        clear_btn = gr.Button("🧹 Clear Form", variant="secondary")

                    gr.Markdown("#### 💡 Quick Load Demonstration Examples:")
                    with gr.Row():
                        btn_ex1 = gr.Button("🔴 Duplicate Topic", size="sm")
                        btn_ex2 = gr.Button("🟡 Similar Topic", size="sm")
                        btn_ex3 = gr.Button("🟢 Unique Topic", size="sm")

                # Right Column: Analysis Results
                with gr.Column(scale=6):
                    gr.Markdown("### 📊 Semantic Analysis & Novelty Report")
                    
                    status_output = gr.HTML(
                        "<div class='explanation-box' style='text-align:center; color:#64748b;'>Enter a research topic on the left and click <b>Check Duplication & Novelty</b> to run semantic analysis.</div>"
                    )
                    
                    matches_output = gr.HTML("")
                    
                    with gr.Accordion("📑 View Structured Matches Data Table", open=False):
                        matches_table = gr.DataFrame(headers=["Rank", "Similarity", "Matched Paper Title", "Domain", "Keywords"])

            # Wire Tab 1 Events
            pdf_input.change(
                fn=extract_pdf_contents,
                inputs=[pdf_input],
                outputs=[title_input, abstract_input, keywords_input, pdf_status]
            )

            analyze_btn.click(
                fn=run_duplication_analysis,
                inputs=[title_input, domain_input, keywords_input, abstract_input],
                outputs=[status_output, matches_output, matches_table]
            )

            clear_btn.click(
                fn=lambda: ("", "Artificial Intelligence", "", "", None, "<div class='explanation-box' style='text-align:center; color:#64748b;'>Form cleared.</div>", "", None, ""),
                inputs=[],
                outputs=[title_input, domain_input, keywords_input, abstract_input, pdf_input, status_output, matches_output, matches_table, pdf_status]
            )

            btn_ex1.click(
                fn=lambda: load_preset_example(0),
                inputs=[],
                outputs=[title_input, domain_input, keywords_input, abstract_input]
            )
            btn_ex2.click(
                fn=lambda: load_preset_example(1),
                inputs=[],
                outputs=[title_input, domain_input, keywords_input, abstract_input]
            )
            btn_ex3.click(
                fn=lambda: load_preset_example(2),
                inputs=[],
                outputs=[title_input, domain_input, keywords_input, abstract_input]
            )

        # TAB 2: INGEST NEW TOPIC
        with gr.TabItem("➕ Register New Research Topic"):
            gr.Markdown("### 📥 Add a New Research Paper to the SQLite Knowledge Base")
            gr.Markdown("Ingest newly approved research papers or published literature. Sentence-BERT embeddings will be automatically computed and stored in the database.")
            
            with gr.Row():
                with gr.Column(scale=2):
                    reg_title = gr.Textbox(label="Research Paper Title", placeholder="e.g., Quantum Computing Applications in Drug Discovery", lines=2)
                    reg_domain = gr.Dropdown(choices=DOMAINS, value="Artificial Intelligence", label="Academic Domain")
                    reg_keywords = gr.Textbox(label="Keywords", placeholder="e.g., Quantum Computing, Drug Discovery, Molecular Modeling")
                    reg_abstract = gr.Textbox(label="Abstract", placeholder="Enter the complete abstract...", lines=6)
                    reg_submit_btn = gr.Button("💾 Register Topic into Database", variant="primary", elem_classes=["primary-btn"])
                    reg_msg = gr.Markdown("")
                
                with gr.Column(scale=2):
                    gr.Markdown("#### 📚 Current Topics in Knowledge Base")
                    reg_db_view = gr.DataFrame(value=get_all_topics_dataframe(), headers=["ID", "Title", "Domain", "Keywords", "Date Added"])

            reg_submit_btn.click(
                fn=register_new_topic,
                inputs=[reg_title, reg_domain, reg_keywords, reg_abstract],
                outputs=[reg_msg, reg_db_view]
            )

        # TAB 3: EXPLORE DATABASE
        with gr.TabItem("📚 Topic Repository & Explorer"):
            gr.Markdown("### 🗄️ Browse Indexed Research Topics")
            
            with gr.Row():
                filter_domain = gr.Dropdown(choices=["All Domains"] + DOMAINS, value="All Domains", label="Filter by Domain")
                search_box = gr.Textbox(label="Search by Keywords or Title", placeholder="Type keyword to filter...")
                refresh_btn = gr.Button("🔄 Refresh List", size="sm")

            explorer_table = gr.DataFrame(value=get_all_topics_dataframe(), headers=["ID", "Title", "Domain", "Keywords", "Date Added"])

            with gr.Accordion("🗑️ Delete a Topic from Database", open=False):
                with gr.Row():
                    delete_id_input = gr.Textbox(label="Topic ID to Delete", placeholder="e.g., 1")
                    delete_btn = gr.Button("🗑️ Delete Topic", variant="stop")
                delete_msg = gr.Markdown("")

            filter_domain.change(
                fn=get_all_topics_dataframe,
                inputs=[filter_domain, search_box],
                outputs=[explorer_table]
            )
            search_box.change(
                fn=get_all_topics_dataframe,
                inputs=[filter_domain, search_box],
                outputs=[explorer_table]
            )
            refresh_btn.click(
                fn=get_all_topics_dataframe,
                inputs=[filter_domain, search_box],
                outputs=[explorer_table]
            )
            delete_btn.click(
                fn=remove_topic,
                inputs=[delete_id_input],
                outputs=[delete_msg, explorer_table]
            )

        # TAB 4: SYSTEM ANALYTICS & ARCHITECTURE
        with gr.TabItem("📊 Analytics & Methodology"):
            gr.Markdown("### 📈 Corpus Statistics & NLP Pipeline Architecture")
            
            stats_view = gr.HTML()
            
            with gr.Row():
                with gr.Column():
                    gr.Markdown("#### 📁 Domain Distribution")
                    domain_table = gr.DataFrame(headers=["Domain", "Count"])
                
                with gr.Column():
                    gr.Markdown("""
                    #### 📐 Academic Similarity Thresholds
                    - **🔴 Potential Duplicate (> 75% Similarity)**:
                      High risk of topic duplication. Substantial overlap in problem formulation, methodology, and domain concepts.
                    - **🟡 Semantically Similar (50% – 75% Similarity)**:
                      Moderate overlap with existing literature. Shares related goals and techniques; requires differentiation.
                    - **🟢 Likely Unique (< 50% Similarity)**:
                      High research novelty. Demonstrates independent formulation with minimal semantic overlap.
                    """)

            gr.Markdown("""
            ---
            ### 🔄 How Sentence-BERT & Cosine Similarity Work
            1. **Preprocessing**: Normalization, punctuation stripping, and stopword removal.
            2. **Vectorization**: Sentence-BERT (`all-MiniLM-L6-v2`) transforms raw text into a 384-dimensional dense vector space capturing contextual semantic relationships.
            3. **Cosine Similarity**: Mathematical angle computation:
               $$\\text{Cosine Similarity} = \\frac{\\vec{A} \\cdot \\vec{B}}{\\|\\vec{A}\\| \\|\\vec{B}\\|}$$
            4. **Hybrid Scoring**: Combines dense semantic similarity (80% weight) with keyword/title overlap (20% weight) for optimal duplicate ranking.
            """)

            # Load stats on tab render
            demo.load(
                fn=get_stats_overview,
                inputs=[],
                outputs=[stats_view, domain_table]
            )

# Server launch configuration for Render and Local environments
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    print(f"[Starting Server] Launching Gradio application on port {port}...")
    demo.launch(server_name="0.0.0.0", server_port=port, theme=THEME, css=CUSTOM_CSS, share=False)

import sqlite3
import os
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "research_topics.db")

SAMPLE_RESEARCH_TOPICS = [
    # 1. Artificial Intelligence
    {
        "title": "Explainable Artificial Intelligence for Credit Scoring in Financial Institutions",
        "domain": "Artificial Intelligence",
        "keywords": "Explainable AI, XAI, SHAP, Credit Scoring, Model Interpretability, Finance",
        "abstract": "Financial institutions increasingly rely on artificial intelligence models for credit scoring and loan approval decisions. However, complex black-box deep learning models lack transparency, leading to regulatory and trust issues. This research proposes an explainable AI framework combining XGBoost with SHAP (SHapley Additive exPlanations) and LIME to generate human-interpretable credit scoring explanations. We evaluate the trade-off between model accuracy and explainability across three public financial datasets."
    },
    {
        "title": "Autonomous Decision Making in Multi-Agent Robotic Systems Using Deep Reinforcement Learning",
        "domain": "Artificial Intelligence",
        "keywords": "Multi-Agent Systems, Reinforcement Learning, Swarm Intelligence, Autonomous Robotics",
        "abstract": "Coordinating multiple autonomous robots in dynamic unstructured environments presents severe multi-agent pathfinding and task allocation challenges. This paper introduces a multi-agent deep deterministic policy gradient (MADDPG) algorithm optimized for decentralized swarm robotics. Experimental results in simulated search-and-rescue operations demonstrate a 24% reduction in mission completion time compared to traditional heuristic algorithms."
    },
    {
        "title": "Ethical Alignment in Autonomous AI Systems Through Constraint-Based Reasoning",
        "domain": "Artificial Intelligence",
        "keywords": "AI Ethics, Autonomous Systems, Moral Decision Making, Constraint Logic Programming",
        "abstract": "As AI systems gain autonomy in healthcare and self-driving vehicles, ensuring ethical behavior becomes paramount. This paper develops a hybrid framework integrating symbolic constraint logic programming with neural networks to enforce ethical constraints during real-time autonomous decision making. We test the framework on trolley-problem style edge cases in autonomous vehicle simulations."
    },
    {
        "title": "Neuro-Symbolic Reasoning for Automated Knowledge Graph Completion",
        "domain": "Artificial Intelligence",
        "keywords": "Neuro-Symbolic AI, Knowledge Graphs, Symbolic Logic, Graph Embeddings",
        "abstract": "Knowledge graphs often suffer from incompleteness and missing relationships. While deep graph neural networks excel at link prediction, they cannot perform logical reasoning. This paper presents a neuro-symbolic framework that combines graph neural networks with differentiable first-order logic rules to perform missing link prediction and rule discovery on large-scale domain knowledge graphs."
    },

    # 2. Machine Learning
    {
        "title": "Federated Learning Framework for Privacy-Preserving Cross-Silo Data Analytics",
        "domain": "Machine Learning",
        "keywords": "Federated Learning, Privacy Preservation, Differential Privacy, Distributed Learning",
        "abstract": "Data privacy regulations prevent organizations from pooling sensitive customer data for machine learning model training. Federated learning enables collaborative training without sharing raw data. In this paper, we propose a lightweight federated aggregation method incorporating local differential privacy to protect against inference attacks. Benchmarks on heterogeneous non-IID datasets confirm high accuracy retention while maintaining strict mathematical privacy guarantees."
    },
    {
        "title": "Graph Convolutional Networks for Predicting Protein-Protein Interactions",
        "domain": "Machine Learning",
        "keywords": "Graph Neural Networks, GCN, Bioinformatics, Protein Interaction, Deep Learning",
        "abstract": "Predicting protein-protein interactions (PPI) is vital for drug discovery and disease mechanism understanding. Traditional laboratory experiments are expensive and slow. We introduce a novel Spatial-Temporal Graph Convolutional Network (ST-GCN) that models 3D protein tertiary structures as topological graphs. Our model achieves an AUC-ROC of 0.94 on the Human PPI benchmark dataset."
    },
    {
        "title": "Self-Supervised Contrastive Learning for Few-Shot Image Classification",
        "domain": "Machine Learning",
        "keywords": "Self-Supervised Learning, Contrastive Learning, Few-Shot Learning, Representation Learning",
        "abstract": "Deep learning models require vast quantities of labeled training data, which is unavailable in specialized fields. This research explores self-supervised contrastive learning (SimCLR framework) to pre-train visual representations without human labels. Subsequent fine-tuning with only 5 labeled examples per class yields state-of-the-art accuracy on MiniImageNet benchmarks."
    },
    {
        "title": "Adaptive Hyperparameter Optimization in Deep Neural Networks Using Quantum Particle Swarm",
        "domain": "Machine Learning",
        "keywords": "Hyperparameter Tuning, Particle Swarm Optimization, AutoML, Deep Learning",
        "abstract": "Selecting optimal hyperparameters for deep neural networks is computationally expensive and manual. This study proposes Quantum-behaved Particle Swarm Optimization (QPSO) tailored for automated hyperparameter tuning in convolutional networks. The algorithm demonstrates 3.5x faster convergence compared to Bayesian optimization on CIFAR-10 classification tasks."
    },

    # 3. Natural Language Processing (NLP)
    {
        "title": "Low-Resource Machine Translation Using Cross-Lingual Transformer Models",
        "domain": "NLP",
        "keywords": "NLP, Machine Translation, Transformers, Low-Resource Languages, Cross-Lingual",
        "abstract": "Neural machine translation performs poorly on low-resource regional languages due to a lack of parallel corpora. This project presents a cross-lingual transfer learning approach using multilingual mBERT and back-translation techniques. We evaluate translation performance across three under-represented indigenous languages, achieving a 4.2 BLEU score improvement over baseline models."
    },
    {
        "title": "Automated Medical Text Summarization Using Domain-Adapted Transformer Architecture",
        "domain": "NLP",
        "keywords": "Text Summarization, BioBERT, Electronic Health Records, Clinical NLP",
        "abstract": "Physicians spend significant time reviewing lengthy patient clinical notes and electronic health records (EHR). We present a domain-adapted sequence-to-sequence summarization model fine-tuned on BioBERT. The system extracts key patient diagnoses, medications, and treatment plans, reducing clinical summary review time by 40% while preserving critical diagnostic details."
    },
    {
        "title": "Aspect-Based Sentiment Analysis on E-Commerce Product Reviews Using Attention Networks",
        "domain": "NLP",
        "keywords": "Aspect-Based Sentiment Analysis, Attention Mechanism, E-Commerce, Consumer Feedback",
        "abstract": "Traditional sentiment analysis categorizes entire product reviews as positive or negative, ignoring fine-grained feature feedback. This paper proposes a dual-attention LSTM network that isolates product aspects (e.g., battery life, screen quality) and determines aspect-specific sentiment polarity. Evaluation on Amazon review datasets demonstrates an 89.4% aspect identification accuracy."
    },
    {
        "title": "Context-Aware Fake News and Misinformation Detection Using Large Language Models",
        "domain": "NLP",
        "keywords": "Fake News Detection, LLM, Misinformation, Fact Verification, Social Media Analysis",
        "abstract": "The viral spread of online misinformation poses threats to public discourse. This study introduces a context-aware factual verification pipeline leveraging fine-tuned LLaMA models and external knowledge bases. The pipeline extracts verifiable claims from news articles, retrieves reference evidence, and classifies claim veracity with accompanying explanation chains."
    },

    # 4. Computer Vision
    {
        "title": "Real-Time Object Detection for Autonomous Vehicles in Adverse Weather Conditions",
        "domain": "Computer Vision",
        "keywords": "Computer Vision, Real-Time Object Detection, YOLO, Autonomous Driving, Image Enhancement",
        "abstract": "Computer vision models in self-driving cars suffer dramatic accuracy drops in heavy rain, fog, and nighttime conditions. This study proposes an integrated pipeline combining a physics-based dehazing/deraining image restoration network with YOLOv8 object detection. Experimental evaluation on synthetic and real-world rain datasets demonstrates robust detection of pedestrians and vehicles under severe weather."
    },
    {
        "title": "Deep Learning Based Facial Expression Recognition for Online Student Engagement Monitoring",
        "domain": "Computer Vision",
        "keywords": "Facial Expression Recognition, Convolutional Neural Networks, E-Learning, Student Engagement",
        "abstract": "Monitoring student attentiveness in remote e-learning environments is challenging for instructors. We present a real-time lightweight CNN model for facial expression recognition that categorizes student mental state into engaged, bored, confused, or distracted. The system operates locally at 30 FPS on standard webcams without storing private video streams."
    },
    {
        "title": "3D Medical Volume Segmentation Using Swin Transformer and U-Net Hybrid Architecture",
        "domain": "Computer Vision",
        "keywords": "3D Image Segmentation, Swin Transformer, U-Net, Medical Imaging, MRI Analysis",
        "abstract": "Accurate 3D organ and tumor segmentation from CT and MRI scans is essential for radiation therapy planning. We design Swin-UNETR, a hybrid architecture combining 3D Swin Transformers for global context encoding with U-Net decoder pathways. Tested on the BTCV multi-organ segmentation dataset, the model achieves a Dice similarity coefficient of 0.88."
    },
    {
        "title": "Automated Defect Detection in Manufacturing Pipelines Using Thermal Imaging and Vision Transformers",
        "domain": "Computer Vision",
        "keywords": "Defect Detection, Vision Transformer, Thermal Imaging, Industrial Automation, Quality Control",
        "abstract": "Industrial quality assurance relies on automated visual surface inspections. Sub-surface structural micro-cracks cannot be identified via RGB cameras. This paper combines infrared thermal imaging with Vision Transformers (ViT) to detect internal micro-cracks in metallic manufacturing parts, reaching a 97.2% defect classification rate."
    },

    # 5. Cybersecurity
    {
        "title": "Intrusion Detection System for Industrial Control Systems Using Deep Autoencoders",
        "domain": "Cybersecurity",
        "keywords": "Cybersecurity, Intrusion Detection System, SCADA, Deep Autoencoders, Anomaly Detection",
        "abstract": "Industrial Control Systems (ICS) managing power grids and water treatment plants are vulnerable to sophisticated cyber-attacks. Traditional signature-based IDS cannot detect zero-day exploits. We propose a deep variational autoencoder model trained exclusively on normal SCADA network traffic patterns. Deviations in reconstruction error flag malicious anomaly injections with low false-positive rates."
    },
    {
        "title": "Zero-Trust Access Control Model for Cloud-Native Microservices Security",
        "domain": "Cybersecurity",
        "keywords": "Zero Trust Security, Microservices, API Security, Access Control, Cloud Architecture",
        "abstract": "Perimeter-based network security is insufficient for dynamic cloud-native applications. This paper formulates a dynamic continuous authentication framework based on Zero-Trust Architecture (ZTA). By evaluating device health, user behavior telemetry, and contextual risk scores in real-time, the system grants adaptive fine-grained API microservice access tokens."
    },
    {
        "title": "Phishing URL and Malicious Domain Detection Using Graph Neural Networks",
        "domain": "Cybersecurity",
        "keywords": "Phishing Detection, Graph Neural Networks, Domain Reputation, URL Analysis",
        "abstract": "Phishing sites frequently alter domain names to bypass static domain blacklists. This study models the global Domain Name System (DNS) infrastructure as a heterogeneous graph. By analyzing passive DNS resolution traffic using Graph Neural Networks, our approach identifies malicious phishing infrastructure before attack deployment."
    },
    {
        "title": "Ransomware Behavioral Analysis and Early Detection Using API Call Sequences",
        "domain": "Cybersecurity",
        "keywords": "Ransomware, Dynamic Malware Analysis, Windows API Calls, Sequence Mining",
        "abstract": "Ransomware encrypts target file systems within minutes of execution. Early detection prior to file encryption is vital. We collect dynamic Windows API call sequences from sandboxed malware execution. A Recurrent Neural Network (LSTM) identifies pre-encryption file system traversal behaviors, terminating malicious processes within 3 seconds of activation."
    },

    # 6. IoT (Internet of Things)
    {
        "title": "Energy-Efficient Routing Protocol for Wireless Sensor Networks in Smart Cities",
        "domain": "IoT",
        "keywords": "Internet of Things, Wireless Sensor Networks, Energy Efficiency, Smart City, Clustering Protocol",
        "abstract": "Battery limitations in IoT sensor nodes severely restrict WSN operational lifespans in smart city infrastructure deployments. This paper introduces LEACH-EE, an enhanced energy-balanced cluster head selection protocol based on remaining battery nodes and distance metrics. Simulation results exhibit a 35% extension in overall network lifetime compared to standard LEACH."
    },
    {
        "title": "Edge Computing Framework for Low-Latency Industrial IoT Predictive Maintenance",
        "domain": "IoT",
        "keywords": "Edge Computing, Industrial IoT, Predictive Maintenance, Vibration Analysis, Fog Computing",
        "abstract": "Streaming continuous sensor telemetry from thousands of industrial machines to central cloud servers induces high bandwidth latency. We deploy lightweight anomaly detection models directly onto Raspberry Pi micro-edge nodes attached to machinery. The system analyzes local vibration and temperature streams, alerting maintenance engineers to potential bearing failures in real-time."
    },
    {
        "title": "Secure Blockchain-Enabled Firmware Update Mechanism for Smart Home IoT Devices",
        "domain": "IoT",
        "keywords": "Smart Home, IoT Security, Blockchain, Smart Contracts, Firmware Integrity",
        "abstract": "Over-the-Air (OTA) firmware updates for smart home IoT appliances are susceptible to man-in-the-middle tampering. This paper proposes a decentralized firmware verification framework utilizing Ethereum smart contracts and IPFS storage. Cryptographic hash verification on device startup guarantees firmware authenticity before installation."
    },

    # 7. Data Science
    {
        "title": "Predictive Analytics for Customer Churn in Telecom Using Ensemble Machine Learning",
        "domain": "Data Science",
        "keywords": "Data Science, Customer Churn, Predictive Analytics, XGBoost, Feature Engineering",
        "abstract": "Customer retention is critical in the competitive telecommunications sector. High churn rates directly impact profitability. This project applies comprehensive feature engineering on customer call detail records and billing histories. We construct an ensemble stacking classifier combining LightGBM, Random Forest, and CatBoost to identify potential churners with 92% precision."
    },
    {
        "title": "Big Data Analytics Pipeline for Real-Time Financial Fraud Detection",
        "domain": "Data Science",
        "keywords": "Big Data, Apache Spark, Credit Card Fraud, Stream Processing, Feature Store",
        "abstract": "Detecting credit card fraud in high-frequency financial streams requires sub-second execution across massive datasets. We build a distributed streaming analytics pipeline using Apache Spark Streaming and Kafka. The system computes rolling window aggregations and flags fraudulent transactions within 150 milliseconds of transaction initiation."
    },

    # 8. Healthcare Technology
    {
        "title": "AI-Powered Early Detection of Diabetic Retinopathy from Fundus Photographs",
        "domain": "Healthcare Technology",
        "keywords": "Healthcare AI, Diabetic Retinopathy, Ophthalmologic Imaging, Deep Learning, Diagnostic Support",
        "abstract": "Diabetic retinopathy is a leading cause of preventable blindness worldwide. Manual grading of retinal fundus images requires specialist ophthalmologists. We train an ensemble EfficientNet architecture on 35,000 public fundus images to classify retinopathy severity into five clinical stages. The model achieves 95.8% sensitivity, suitable for automated rural screening clinics."
    },
    {
        "title": "IoT-Based Remote Patient Monitoring System for Cardiovascular Health Tracking",
        "domain": "Healthcare Technology",
        "keywords": "Telemedicine, Wearable Sensors, Heart Rate Monitoring, Remote Healthcare, Emergency Alerts",
        "abstract": "Remote monitoring of elderly patients suffering from chronic cardiovascular conditions reduces hospital readmission rates. We build a wearable IoT patch incorporating ECG, PPG, and temperature sensors linked to a mobile application. Cloud algorithms continuously compute arrhythmia anomalies and trigger automated SMS alerts to emergency caregivers during heart events."
    },
    {
        "title": "Predictive Modeling of ICU Hospital Readmission Rates Using EHR Clinical Records",
        "domain": "Healthcare Technology",
        "keywords": "Clinical Data Mining, ICU Readmission, Electronic Health Records, Risk Stratification",
        "abstract": "Unplanned Intensive Care Unit (ICU) readmissions are associated with elevated mortality rates and hospital costs. This paper extracts temporal vital signs and lab results from the MIMIC-III database to train clinical prediction models. Our model provides ICU physicians with automated readmission risk scores prior to patient discharge."
    },

    # 9. Agriculture Technology
    {
        "title": "Automated Crop Disease Identification and Severity Assessment Using Smartphone Cameras",
        "domain": "Agriculture Technology",
        "keywords": "Smart Agriculture, Plant Pathology, Crop Disease Detection, Mobile Vision, CNN",
        "abstract": "Plant diseases severely threaten global food security and smallholder farmer livelihoods. We develop a lightweight MobileNetV3 convolutional model deployed inside a smartphone application. Farmers snap photos of affected crop leaves, receiving immediate diagnostic feedback and recommended organic treatment methods across 38 plant disease categories."
    },
    {
        "title": "IoT-Driven Smart Irrigation System Based on Soil Moisture Sensors and Weather Forecasting",
        "domain": "Agriculture Technology",
        "keywords": "Smart Irrigation, Precision Agriculture, Soil Moisture Sensors, Water Conservation, IoT",
        "abstract": "Agricultural irrigation accounts for 70% of global freshwater usage. Conventional scheduled watering leads to significant water wastage. This research implements an automated IoT irrigation node that measures multi-depth soil moisture alongside local weather API forecasts. Field testing demonstrated a 38% reduction in water usage while preserving optimal crop yields."
    },
    {
        "title": "Precision Yield Prediction Model Using Multi-Spectral Satellite Imagery and Machine Learning",
        "domain": "Agriculture Technology",
        "keywords": "Precision Farming, Crop Yield Estimation, Sentinel-2 Satellite, NDVI, Random Forest",
        "abstract": "Accurate early-season crop yield forecasts enable optimized supply chain logistics and food price stability. We combine Sentinel-2 multi-spectral satellite imagery with ground weather data to compute seasonal Normalized Difference Vegetation Index (NDVI) time-series curves. Machine learning models predict maize and wheat yields 60 days prior to harvest."
    },

    # 10. Education Technology
    {
        "title": "Personalized Learning Path Recommendation System Using Knowledge Tracing and Collaborative Filtering",
        "domain": "Education Technology",
        "keywords": "EdTech, Knowledge Tracing, Recommender Systems, Personalized Learning, Student Performance",
        "abstract": "One-size-fits-all digital learning platforms fail to adapt to individual student skill gaps. This paper proposes a personalized course recommendation engine utilizing Deep Knowledge Tracing (DKT) and matrix factorization. By tracking historical quiz responses, the engine recommends tailored learning materials suited to the student's mastery level."
    },
    {
        "title": "Automated Essay Scoring and Feedback Generation Using Natural Language Processing",
        "domain": "Education Technology",
        "keywords": "Automated Essay Scoring, NLP, Rubric Analysis, Grammar Correction, Educational Evaluation",
        "abstract": "Manual essay grading for large online courses (MOOCs) requires immense teaching assistant hours. We present an automated essay evaluation system that scores student essays based on coherence, vocabulary richness, syntactic complexity, and argumentative structure. The system provides actionable diagnostic sentence-level feedback to students."
    },
    {
        "title": "Gamified Virtual Reality Laboratory Simulations for Science Education",
        "domain": "Education Technology",
        "keywords": "Virtual Reality, Gamification, Immersive STEM Education, Science Labs, Interactive Learning",
        "abstract": "Physical STEM laboratory equipment is costly and inaccessible to many underprivileged schools. We develop an interactive 3D Virtual Reality laboratory simulation platform for chemistry and physics experiments. User studies across 120 high school students revealed a 28% increase in conceptual retention and higher engagement compared to textbook learning."
    }
]


def get_db_connection():
    """Establish connection to SQLite database file."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize database tables and seed initial sample research topics if empty."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS research_topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            domain TEXT NOT NULL,
            keywords TEXT,
            abstract TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            embedding TEXT
        );
    """)
    conn.commit()

    # Check if table has data
    cursor.execute("SELECT COUNT(*) FROM research_topics")
    count = cursor.fetchone()[0]

    if count == 0:
        print(f"[SQLite DB] Seeding database with {len(SAMPLE_RESEARCH_TOPICS)} research topics...")
        for item in SAMPLE_RESEARCH_TOPICS:
            cursor.execute("""
                INSERT INTO research_topics (title, domain, keywords, abstract, created_at, embedding)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                item["title"],
                item["domain"],
                item["keywords"],
                item["abstract"],
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                None
            ))
        conn.commit()
        print("[SQLite DB] Database successfully seeded!")

    conn.close()


def get_all_topics(domain: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
    """Fetch research topics with optional domain and text search filters."""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT id, title, domain, keywords, abstract, created_at, embedding FROM research_topics WHERE 1=1"
    params = []

    if domain and domain.strip() and domain.lower() != "all":
        query += " AND LOWER(domain) = LOWER(?)"
        params.append(domain.strip())

    if search and search.strip():
        search_param = f"%{search.strip()}%"
        query += " AND (LOWER(title) LIKE LOWER(?) OR LOWER(abstract) LIKE LOWER(?) OR LOWER(keywords) LIKE LOWER(?))"
        params.extend([search_param, search_param, search_param])

    query += " ORDER BY id DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()

    topics = []
    for r in rows:
        topics.append({
            "id": r["id"],
            "title": r["title"],
            "domain": r["domain"],
            "keywords": r["keywords"] or "",
            "abstract": r["abstract"],
            "created_at": str(r["created_at"]),
            "embedding": json.loads(r["embedding"]) if r["embedding"] else None
        })

    conn.close()
    return topics


def get_topic_by_id(topic_id: int) -> Optional[Dict[str, Any]]:
    """Fetch single topic by integer ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, domain, keywords, abstract, created_at, embedding FROM research_topics WHERE id = ?", (topic_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return {
            "id": row["id"],
            "title": row["title"],
            "domain": row["domain"],
            "keywords": row["keywords"] or "",
            "abstract": row["abstract"],
            "created_at": str(row["created_at"]),
            "embedding": json.loads(row["embedding"]) if row["embedding"] else None
        }
    return None


def add_topic(title: str, domain: str, keywords: str, abstract: str, embedding: Optional[List[float]] = None) -> Dict[str, Any]:
    """Insert a new research topic into the SQLite database."""
    conn = get_db_connection()
    cursor = conn.cursor()

    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    embedding_json = json.dumps(embedding) if embedding else None

    cursor.execute("""
        INSERT INTO research_topics (title, domain, keywords, abstract, created_at, embedding)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (title.strip(), domain.strip(), keywords.strip(), abstract.strip(), created_at, embedding_json))

    new_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {
        "id": new_id,
        "title": title.strip(),
        "domain": domain.strip(),
        "keywords": keywords.strip(),
        "abstract": abstract.strip(),
        "created_at": created_at,
        "embedding": embedding
    }


def update_topic_embedding(topic_id: int, embedding: List[float]):
    """Update embedding vector for a topic."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE research_topics SET embedding = ? WHERE id = ?", (json.dumps(embedding), topic_id))
    conn.commit()
    conn.close()


def delete_topic(topic_id: int) -> bool:
    """Delete topic from database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM research_topics WHERE id = ?", (topic_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted


def get_stats() -> Dict[str, Any]:
    """Get total count and domain distribution."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM research_topics")
    total_topics = cursor.fetchone()[0]

    cursor.execute("SELECT domain, COUNT(*) as count FROM research_topics GROUP BY domain ORDER BY count DESC")
    domain_rows = cursor.fetchall()
    domain_breakdown = [{"domain": r["domain"], "count": r["count"]} for r in domain_rows]

    conn.close()

    return {
        "total_topics": total_topics,
        "domain_count": len(domain_breakdown),
        "domain_breakdown": domain_breakdown
    }


# Auto-initialize database on import
init_db()

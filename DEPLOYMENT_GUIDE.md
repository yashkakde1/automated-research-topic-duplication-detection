# 🌐 Deployment Guide: Automated Research Topic Duplication Detection

This guide provides step-by-step instructions for deploying the project to **Render** (as a unified Gradio Python Web Service), as well as alternative hosting options.

---

## 🚀 Option 1: Deploy on Render (Recommended - Free & 1-Click Ready)

Render provides free hosting for Python web applications and handles builds and deployments automatically from GitHub.

### 📋 Prerequisites
- A free account on [Render.com](https://render.com).
- Your GitHub repository: `https://github.com/yashkakde1/automated-research-topic-duplication-detection.git`.

### 🛠️ Step-by-Step Render Setup:

1. **Log into Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com) and sign in using your **GitHub** account.

2. **Create New Web Service**:
   - Click the **New +** button in the top navigation bar.
   - Select **Web Service**.

3. **Connect Your GitHub Repository**:
   - Under *Connect a repository*, choose `automated-research-topic-duplication-detection` (or search for it).
   - If prompted, grant Render access to your GitHub repositories.

4. **Configure the Service Settings**:
   Fill in the following fields in the Render dashboard:
   - **Name**: `research-topic-duplication-detector` *(or your preferred name)*
   - **Region**: `Oregon (US West)` *(or closest to your location)*
   - **Branch**: `main`
   - **Root Directory**: *(Leave empty - uses project root)*
   - **Runtime / Environment**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     python app.py
     ```
   - **Instance Type**: Select **Free** ($0 / month).

5. **Environment Variables (Optional)**:
   - `PORT`: `7860` *(Render sets this automatically, but app.py reads `$PORT` dynamically)*
   - `PYTHON_VERSION`: `3.11.8`

6. **Deploy**:
   - Click **Create Web Service**.
   - Render will clone your repository, install packages from `requirements.txt`, and start the Gradio application.
   - Once the build succeeds, you will see a green **Live** badge and your custom URL:
     `https://research-topic-duplication-detector.onrender.com`

---

## ⚡ Option 2: 1-Click Render Blueprint (Using `render.yaml`)

This repository includes a pre-configured `render.yaml` file:
1. In Render Dashboard, click **New +** → **Blueprint**.
2. Connect your `automated-research-topic-duplication-detection` repository.
3. Render will automatically detect the settings from `render.yaml` and create the Web Service in one click!

---

## 💻 Option 3: Running Locally

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Launch Gradio Web App
```bash
python app.py
```
Open your browser at `http://localhost:7860`.

---

## 🧪 Testing & Verification

1. **Test Duplication Detection**:
   - Open the live URL or local URL.
   - Click one of the quick demo buttons (e.g. **🔴 Duplicate Topic** or **🟢 Unique Topic**).
   - Click **Check Duplication & Novelty** to view the similarity gauge, AI flag explanation, and matched paper cards.
2. **Test PDF Extraction**:
   - Upload any research paper PDF in the PDF section.
   - Watch the Title, Abstract, and Keywords get auto-populated.
3. **Register New Topics**:
   - Navigate to the **➕ Register New Research Topic** tab to add new papers to the SQLite database.

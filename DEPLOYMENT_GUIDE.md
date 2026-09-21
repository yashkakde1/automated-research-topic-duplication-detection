# 🌐 How to Deploy "ResearchGuard" Online for Free

This guide provides step-by-step instructions to host and deploy the **ResearchGuard** project (React Frontend + Python FastAPI Backend + SQLite) online so you can share a live link with professors, evaluators, and friends.

---

## 🎯 Best Free Deployment Option: Vercel + Render

| Component | Platform | Cost | Setup Time |
| :--- | :--- | :--- | :--- |
| **Frontend (React)** | [Vercel](https://vercel.com) | **FREE** | 2 minutes |
| **Backend (FastAPI)** | [Render](https://render.com) | **FREE** | 3 minutes |

---

## 📌 STEP 1: Upload Your Code to GitHub

Before deploying, upload your project code to a free GitHub repository:

1. Go to [GitHub.com](https://github.com) and sign in.
2. Click **New Repository**, name it `ResearchGuard`, and click **Create Repository**.
3. Open PowerShell/Terminal in your project folder (`c:\Users\ADMIN\Desktop\flexi`) and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ResearchGuard project"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ResearchGuard.git
   git push -u origin main
   ```

---

## ⚡ STEP 2: Deploy Frontend on Vercel (Free & Instant)

Vercel is the best platform for hosting React web applications with free SSL (`https://`).

1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** → **Project**.
3. Import your `ResearchGuard` repository from GitHub.
4. Configure Project Settings:
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Framework Preset**: `Vite`
5. Click **Deploy**.
6. 🎉 In 60 seconds, your site will be live at:
   `https://research-guard.vercel.app`

> 💡 **Note**: Because ResearchGuard includes an automatic fallback service (`src/services/api.js`), your Vercel live website will work **100% interactively** out-of-the-box for project presentation even before connecting a backend server!

---

## 🐍 STEP 3: Deploy Backend on Render (Free Python Hosting)

Render provides free hosting for Python FastAPI applications.

1. Go to [Render.com](https://render.com) and sign up using GitHub.
2. Click **New +** → **Web Service**.
3. Connect your `ResearchGuard` GitHub repository.
4. Configure Web Service Settings:
   - **Name**: `researchguard-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
5. Click **Create Web Service**.
6. Render will build and deploy your API. Once finished, copy your live backend URL (e.g. `https://researchguard-backend.onrender.com`).

---

## 🔗 STEP 4: Connect Live Frontend to Live Backend

1. Open `frontend/src/services/api.js` in your project.
2. Update the `BASE_URL` constant at the top:
   ```javascript
   const BASE_URL = 'https://researchguard-backend.onrender.com/api';
   ```
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Connect live backend API URL"
   git push origin main
   ```
4. Vercel will automatically re-deploy your frontend with the live backend connected!

---

## 🏆 Alternative 1-Click Option: Netlify

If you prefer Netlify for the frontend:
1. Go to [Netlify.com](https://netlify.com) and sign in with GitHub.
2. Click **Add new site** → **Import an existing project**.
3. Set Base Directory to `frontend`, Build Command to `npm run dev`, and Publish Directory to `dist`.
4. Click **Deploy**.

# Deployment Guide

## Backend Deployment (Render)

### Step 1: Push Backend to GitHub
```bash
cd backend
git init
git add .
git commit -m "Add Excel export feature"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** expense-tracker-backend
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add:
     - `MONGODB_URI` (from your .env)
     - `JWT_SECRET` (from your .env)
     - `EMAIL_USER` (from your .env)
     - `EMAIL_PASS` (from your .env)
5. Click "Create Web Service"

### Step 3: Get Backend URL
After deployment, note your Render URL (e.g., `https://expense-tracker-backend.onrender.com`)

---

## Frontend Deployment (Netlify)

### Step 1: Update API URL
Edit `frontend/src/api.js` and replace the BASE_URL:
```javascript
const BASE_URL = "https://YOUR-RENDER-APP.onrender.com/api/v2";
```

### Step 2: Push Frontend to GitHub
```bash
cd frontend
git add .
git commit -m "Update API URL for production"
git push
```

### Step 3: Deploy on Netlify
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click "Deploy site"

---

## Alternative: Backend on Vercel

### Step 1: Create vercel.json in backend folder
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your repository (select the backend folder)
4. Add environment variables
5. Click "Deploy"

---

## Verify Deployment
1. Test backend: `https://YOUR-BACKEND.onrender.com/api/v2/expense`
2. Test frontend: `https://YOUR-NETLIFY-SITE.netlify.app`
3. Try the Export button on the dashboard

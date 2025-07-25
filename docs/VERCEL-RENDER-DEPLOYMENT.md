# CancerGuard AI - Vercel + Render Deployment Guide

## 🚀 Deployment Architecture

- **Frontend:** Vercel (Free)
- **Backend:** Render (Free tier)  
- **Database:** Aiven PostgreSQL (Your existing database)
- **Total Cost:** $0/month

## 📋 Prerequisites

1. **GitHub Repository** - Push your code to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Render Account** - Sign up at [render.com](https://render.com)
4. **Aiven Database** - Already configured ✅

---

## 🎯 Step 1: Deploy Backend to Render

### 1.1 Push Code to GitHub
```bash
git add .
git commit -m "Deploy CancerGuard AI - Backend to Render"
git push origin main
```

### 1.2 Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `cancerguard-ai-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `Dockerfile.prod`
   - **Build Command:** (leave empty)
   - **Start Command:** (leave empty - uses Dockerfile CMD)

### 1.3 Environment Variables
You'll need to set these in Render dashboard:
```
DATABASE_URL=<your-aiven-database-url-here>
SECRET_KEY=<auto-generated>
JWT_SECRET_KEY=<auto-generated>
DEBUG=false
MODEL_PATH=/app/models/cnn_rnn_model_1.h5
```

**Important:** Copy the DATABASE_URL exactly as shown above into your Render dashboard.

### 1.4 Deploy
- Click **"Create Web Service"**
- Wait for deployment (5-10 minutes)
- Note your backend URL: `https://cancerguard-ai-backend.onrender.com`

---

## 🎯 Step 2: Deploy Frontend to Vercel

### 2.1 Import Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 2.2 Environment Variables
Add this environment variable in Vercel:
```
VITE_API_URL=https://cancerguard-ai-backend.onrender.com
```

### 2.3 Deploy
- Click **"Deploy"**
- Wait for deployment (2-3 minutes)
- Note your frontend URL: `https://cancerguard-ai-frontend.vercel.app`

---

## 🎯 Step 3: Update CORS Configuration

### 3.1 Update Backend CORS
After getting your Vercel URL, update the CORS configuration:

1. **Edit** `backend/app/main.py`
2. **Replace** the Vercel URL in CORS origins:
```python
allow_origins=[
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    "https://*.vercel.app",
    "https://your-actual-vercel-url.vercel.app"  # Replace with your URL
],
```

3. **Redeploy** backend to Render

---

## ✅ Verification

### Test Your Deployment
1. **Frontend:** Visit your Vercel URL
2. **Backend Health:** `https://cancerguard-ai-backend.onrender.com/health`
3. **API Docs:** `https://cancerguard-ai-backend.onrender.com/docs`
4. **Full App:** Register → Login → Upload Image → Test Prediction

---

## 🔧 Troubleshooting

### Common Issues

#### Frontend Can't Connect to Backend
- ✅ Check `VITE_API_URL` environment variable in Vercel
- ✅ Verify backend URL is correct
- ✅ Check CORS configuration in backend

#### Backend Database Connection Issues
- ✅ Verify Aiven database URL is correct
- ✅ Check database is accessible from Render IPs
- ✅ Ensure SSL mode is required

#### Model Loading Issues
- ✅ Verify model file is in `backend/models/`
- ✅ Check `MODEL_PATH` environment variable
- ✅ Review backend logs in Render dashboard

### Logs Access
- **Render:** Dashboard → Service → Logs tab
- **Vercel:** Dashboard → Project → Functions tab

---

## 💰 Cost Breakdown

| Service | Plan | Cost | Usage |
|---------|------|------|-------|
| Vercel | Hobby | **FREE** | Static site hosting |
| Render | Free | **FREE** | 750 hours/month |
| Aiven | Your plan | Your cost | PostgreSQL database |
| **Total** | | **$0/month** | (Plus your DB cost) |

---

## 🚀 Going to Production

### Performance Optimizations
1. **Enable Vercel Analytics** (free)
2. **Configure Render autoscaling**
3. **Add CDN for static assets**
4. **Enable database connection pooling**

### Security Enhancements
1. **Add rate limiting**
2. **Configure proper CORS origins**
3. **Enable HTTPS everywhere** (automatic)
4. **Add API key authentication**

### Monitoring
1. **Render metrics** (built-in)
2. **Vercel analytics** (built-in)
3. **Database monitoring** (Aiven dashboard)

---

## 🔄 Updates & Maintenance

### Automatic Deployments
- **Vercel:** Auto-deploys on git push to main
- **Render:** Auto-deploys on git push to main

### Manual Deployments
- **Vercel:** Dashboard → Deployments → Redeploy
- **Render:** Dashboard → Manual Deploy

---

## 📞 Support Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Render Docs:** [render.com/docs](https://render.com/docs)
- **Aiven Docs:** [aiven.io/docs](https://aiven.io/docs)

---

## 🎉 Success!

Your **CancerGuard AI** is now deployed across two platforms:
- ⚡ **Lightning-fast frontend** on Vercel
- 🛡️ **Secure backend** on Render  
- 🗄️ **Reliable database** on Aiven

**Total deployment cost: $0/month!** 💚
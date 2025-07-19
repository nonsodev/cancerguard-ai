# CancerGuard AI - Render Deployment Guide

## 🚀 Deploying to Render

This guide walks you through deploying CancerGuard AI to Render using Docker.

### Prerequisites

1. **Render Account** - Sign up at [render.com](https://render.com)
2. **GitHub Repository** - Push your code to GitHub
3. **Model File** - Ensure `cnn_rnn_model_1.h5` is in `backend/models/`

### Deployment Options

#### Option 1: Automatic Deployment (Recommended)
Use the `render.yaml` file for automatic service creation.

#### Option 2: Manual Deployment
Create services manually through Render dashboard.

---

## 🔧 Option 1: Automatic Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy CancerGuard AI to Render"
git push origin main
```

### Step 2: Connect to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically create all services from `render.yaml`

### Step 3: Configure Environment Variables
Render will automatically set most variables, but verify:
- `SECRET_KEY` - Auto-generated
- `JWT_SECRET_KEY` - Auto-generated
- `DATABASE_URL` - Auto-connected to PostgreSQL
- `REDIS_URL` - Auto-connected to Redis

---

## 🔧 Option 2: Manual Deployment

### Step 1: Create PostgreSQL Database
1. Go to Render Dashboard
2. Click "New" → "PostgreSQL"
3. Name: `cancerguard-ai-db`
4. Note the connection string

### Step 2: Create Redis Instance
1. Click "New" → "Redis"
2. Name: `cancerguard-ai-redis`
3. Note the connection string

### Step 3: Deploy Backend
1. Click "New" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name:** `cancerguard-ai-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `Dockerfile.prod`
   - **Build Command:** (leave empty)
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables:**
   ```
   DATABASE_URL=<your-postgres-connection-string>
   REDIS_URL=<your-redis-connection-string>
   SECRET_KEY=<generate-random-key>
   JWT_SECRET_KEY=<generate-random-key>
   DEBUG=false
   MODEL_PATH=/app/models/cnn_rnn_model_1.h5
   ```

### Step 4: Deploy Frontend
1. Click "New" → "Static Site"
2. Connect GitHub repository
3. Configure:
   - **Name:** `cancerguard-ai-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm ci && npm run build`
   - **Publish Directory:** `dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=<your-backend-service-url>
   ```

---

## 🔍 Verification

### Check Services
1. **Backend:** `https://cancerguard-ai-backend.onrender.com/health`
2. **Frontend:** `https://cancerguard-ai-frontend.onrender.com`
3. **API Docs:** `https://cancerguard-ai-backend.onrender.com/docs`

### Test Functionality
1. Register a new account
2. Upload a test image
3. Verify AI prediction works
4. Check analytics dashboard

---

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
- Check environment variables
- Verify DATABASE_URL format
- Check logs in Render dashboard

#### Frontend Can't Connect to Backend
- Verify VITE_API_URL points to backend service
- Check CORS settings in backend

#### Database Connection Issues
- Ensure DATABASE_URL is correctly formatted
- Check PostgreSQL service status

#### Model Loading Issues
- Verify model file is included in Docker image
- Check MODEL_PATH environment variable

### Logs
Access logs in Render dashboard:
1. Go to your service
2. Click "Logs" tab
3. Monitor real-time logs

---

## 💰 Cost Estimation

### Free Tier Limits
- **Web Services:** 750 hours/month
- **PostgreSQL:** 1GB storage
- **Redis:** 25MB storage
- **Static Sites:** Unlimited

### Paid Plans
- **Starter:** $7/month per service
- **Standard:** $25/month per service
- **Pro:** $85/month per service

---

## 🔒 Security Considerations

### Production Settings
- Set `DEBUG=false`
- Use strong `SECRET_KEY` and `JWT_SECRET_KEY`
- Enable HTTPS (automatic on Render)
- Configure proper CORS origins

### Database Security
- Use connection pooling
- Enable SSL connections
- Regular backups (automatic on Render)

---

## 📈 Scaling

### Auto-scaling
Render automatically scales based on traffic.

### Manual Scaling
Upgrade service plans for:
- More CPU/RAM
- Faster response times
- Higher concurrent users

---

## 🔄 Updates

### Automatic Deployments
Connect GitHub for automatic deployments on push to main branch.

### Manual Deployments
Trigger deployments from Render dashboard.

---

## 📞 Support

- **Render Docs:** [render.com/docs](https://render.com/docs)
- **Community:** [community.render.com](https://community.render.com)
- **Status:** [status.render.com](https://status.render.com)
@echo off
echo 🛡️ CancerGuard AI - Vercel + Render Deployment
echo ===============================================

echo 📋 Deployment Plan:
echo   Frontend: Vercel (Free)
echo   Backend:  Render (Free)
echo   Database: Aiven PostgreSQL (Your existing DB)
echo.

REM Check if required files exist
if not exist frontend\vercel.json (
    echo ❌ Vercel configuration missing
    pause
    exit /b 1
)

if not exist render.yaml (
    echo ❌ Render configuration missing
    pause
    exit /b 1
)

if not exist backend\Dockerfile.prod (
    echo ❌ Backend Dockerfile missing
    pause
    exit /b 1
)

echo ✅ All configuration files found
echo.

echo 🚀 Ready for deployment!
echo.
echo 📝 Next Steps:
echo.
echo 1. BACKEND (Render):
echo    - Push to GitHub: git push origin main
echo    - Go to: https://dashboard.render.com
echo    - Create new Web Service
echo    - Connect your GitHub repo
echo    - Use: backend/Dockerfile.prod
echo    - MANUALLY add your Aiven database URL in environment variables
echo.
echo 2. FRONTEND (Vercel):
echo    - Go to: https://vercel.com
echo    - Import your GitHub repository
echo    - Set root directory to: frontend
echo    - Add environment variable:
echo      VITE_API_URL = https://cancerguard-ai-backend.onrender.com
echo.
echo 3. UPDATE CORS (After deployment):
echo    - Update backend CORS to allow your Vercel domain
echo.
echo 💰 Total Cost: $0/month (Both platforms free!)
echo.
pause
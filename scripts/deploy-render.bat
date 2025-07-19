@echo off
echo 🛡️ CancerGuard AI - Render Deployment Script
echo =============================================

REM Check if git is initialized
if not exist .git (
    echo 📝 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - CancerGuard AI"
) else (
    echo ✅ Git repository found
)

REM Check if model file exists
if exist backend\models\cnn_rnn_model_1.h5 (
    echo ✅ ML model file found
) else (
    echo ⚠️  ML model file not found. Deployment will use dummy model.
)

REM Check if Dockerfiles exist
if exist backend\Dockerfile.prod (
    if exist frontend\Dockerfile.prod (
        echo ✅ Production Dockerfiles found
    ) else (
        echo ❌ Production Dockerfiles missing
        pause
        exit /b 1
    )
) else (
    echo ❌ Production Dockerfiles missing
    pause
    exit /b 1
)

REM Check if render.yaml exists
if exist render.yaml (
    echo ✅ Render configuration found
) else (
    echo ❌ render.yaml missing
    pause
    exit /b 1
)

echo.
echo 🚀 Ready for Render deployment!
echo.
echo Next steps:
echo 1. Push to GitHub: git push origin main
echo 2. Go to Render Dashboard: https://dashboard.render.com
echo 3. Create new Blueprint and connect your repository
echo 4. Render will automatically deploy all services
echo.
echo 📖 For detailed instructions, see: docs/DEPLOYMENT.md
echo.
pause
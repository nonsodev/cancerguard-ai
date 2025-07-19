#!/bin/bash

echo "🛡️ CancerGuard AI - Render Deployment Script"
echo "============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - CancerGuard AI"
else
    echo "✅ Git repository found"
fi

# Check if model file exists
if [ -f "backend/models/cnn_rnn_model_1.h5" ]; then
    echo "✅ ML model file found"
else
    echo "⚠️  ML model file not found. Deployment will use dummy model."
fi

# Check if Dockerfiles exist
if [ -f "backend/Dockerfile.prod" ] && [ -f "frontend/Dockerfile.prod" ]; then
    echo "✅ Production Dockerfiles found"
else
    echo "❌ Production Dockerfiles missing"
    exit 1
fi

# Check if render.yaml exists
if [ -f "render.yaml" ]; then
    echo "✅ Render configuration found"
else
    echo "❌ render.yaml missing"
    exit 1
fi

echo ""
echo "🚀 Ready for Render deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Go to Render Dashboard: https://dashboard.render.com"
echo "3. Create new Blueprint and connect your repository"
echo "4. Render will automatically deploy all services"
echo ""
echo "📖 For detailed instructions, see: docs/DEPLOYMENT.md"
#!/bin/bash

# HealthAI Setup Script

echo "🏥 Setting up HealthAI - Breast Cancer Detection Platform"
echo "========================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p backend/models
mkdir -p logs

# Copy model file if it exists
if [ -f "cnn_rnn_model_1.h5" ]; then
    echo "🤖 Copying ML model..."
    cp cnn_rnn_model_1.h5 backend/models/
    echo "✅ ML model copied successfully"
else
    echo "⚠️  ML model file not found. The application will use a dummy model for development."
fi

echo ""
echo "🚀 Setup complete! You can now start the application with:"
echo "   docker-compose up -d"
echo ""
echo "📖 Access the application at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Documentation: http://localhost:8000/docs"
echo ""
echo "🔧 To stop the application:"
echo "   docker-compose down"
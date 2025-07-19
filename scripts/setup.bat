@echo off
echo 🏥 Setting up HealthAI - Breast Cancer Detection Platform
echo =========================================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created. Please update it with your configuration.
) else (
    echo ✅ .env file already exists
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist backend\uploads mkdir backend\uploads
if not exist backend\models mkdir backend\models
if not exist logs mkdir logs

REM Copy model file if it exists
if exist cnn_rnn_model_1.h5 (
    echo 🤖 Copying ML model...
    copy cnn_rnn_model_1.h5 backend\models\
    echo ✅ ML model copied successfully
) else (
    echo ⚠️  ML model file not found. The application will use a dummy model for development.
)

echo.
echo 🚀 Setup complete! You can now start the application with:
echo    docker-compose up -d
echo.
echo 📖 Access the application at:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    API Documentation: http://localhost:8000/docs
echo.
echo 🔧 To stop the application:
echo    docker-compose down
echo.
pause
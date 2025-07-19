#!/usr/bin/env python3
"""
CancerGuard AI Setup Test Script
Tests the basic functionality of the CancerGuard AI platform
"""

import requests
import time
import json
import os
from pathlib import Path

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_backend_health():
    """Test if backend is running and healthy"""
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend health check passed")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend not accessible: {e}")
        return False

def test_frontend_accessibility():
    """Test if frontend is accessible"""
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is accessible")
            return True
        else:
            print(f"❌ Frontend not accessible: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend not accessible: {e}")
        return False

def test_api_docs():
    """Test if API documentation is accessible"""
    try:
        response = requests.get(f"{BACKEND_URL}/docs", timeout=5)
        if response.status_code == 200:
            print("✅ API documentation is accessible")
            return True
        else:
            print(f"❌ API docs not accessible: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ API docs not accessible: {e}")
        return False

def test_user_registration():
    """Test user registration endpoint"""
    try:
        test_user = {
            "email": "test@cancerguard.ai",
            "username": "testuser",
            "password": "testpass123",
            "full_name": "Test User"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/v1/auth/register",
            json=test_user,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ User registration endpoint working")
            return True
        elif response.status_code == 400 and "already registered" in response.text:
            print("✅ User registration endpoint working (user already exists)")
            return True
        else:
            print(f"❌ User registration failed: {response.status_code} - {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ User registration test failed: {e}")
        return False

def check_model_file():
    """Check if ML model file exists"""
    model_path = Path("backend/models/cnn_rnn_model_1.h5")
    if model_path.exists():
        print("✅ ML model file found")
        return True
    else:
        print("⚠️  ML model file not found - using dummy model")
        return False

def check_environment_file():
    """Check if .env file exists"""
    env_path = Path(".env")
    if env_path.exists():
        print("✅ Environment file (.env) found")
        return True
    else:
        print("❌ Environment file (.env) not found")
        return False

def main():
    """Run all tests"""
    print("🛡️ CancerGuard AI Platform Test Suite")
    print("=" * 40)
    
    tests = [
        ("Environment Configuration", check_environment_file),
        ("ML Model File", check_model_file),
        ("Backend Health", test_backend_health),
        ("Frontend Accessibility", test_frontend_accessibility),
        ("API Documentation", test_api_docs),
        ("User Registration", test_user_registration),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🧪 Testing {test_name}...")
        if test_func():
            passed += 1
        time.sleep(1)  # Brief pause between tests
    
    print("\n" + "=" * 40)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! CancerGuard AI is ready to use.")
        print("\n📖 Access the application:")
        print(f"   Frontend: {FRONTEND_URL}")
        print(f"   Backend API: {BACKEND_URL}")
        print(f"   API Docs: {BACKEND_URL}/docs")
    else:
        print("⚠️  Some tests failed. Please check the setup.")
        print("\n🔧 Troubleshooting:")
        print("   1. Make sure Docker containers are running: docker-compose ps")
        print("   2. Check logs: docker-compose logs")
        print("   3. Restart services: docker-compose restart")

if __name__ == "__main__":
    main()
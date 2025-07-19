#!/usr/bin/env python3
"""
Database connection test for CancerGuard AI
Run this to test if the database connection works
"""

import os
import sys
from sqlalchemy import create_engine, text

def test_database_connection():
    """Test database connection"""
    print("🛡️ CancerGuard AI - Database Connection Test")
    print("=" * 50)
    
    # Get database URL from environment
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("❌ DATABASE_URL environment variable not set!")
        print("Please set your Aiven database URL in Render dashboard:")
        print("DATABASE_URL=<your-aiven-database-url-here>")
        return False
    
    print(f"✅ DATABASE_URL found: {database_url[:50]}...")
    
    try:
        # Create engine
        print("🔌 Creating database engine...")
        engine = create_engine(database_url)
        
        # Test connection
        print("🔍 Testing connection...")
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            print(f"✅ Test query result: {result.fetchone()}")
            return True
            
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Check if DATABASE_URL is correctly set in Render")
        print("2. Verify Aiven database is running")
        print("3. Check if Render IP is whitelisted in Aiven")
        return False

if __name__ == "__main__":
    success = test_database_connection()
    sys.exit(0 if success else 1)
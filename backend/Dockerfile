FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (cached layer)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy ONLY requirements.txt first (for maximum caching efficiency)
COPY requirements.txt .

# Install Python dependencies - THIS LAYER WILL BE CACHED!
# Only reinstalls if requirements.txt changes
RUN pip install --no-cache-dir -r requirements.txt

# Create directories
RUN mkdir -p uploads models

# Copy application code LAST (changes frequently, won't affect pip cache)
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
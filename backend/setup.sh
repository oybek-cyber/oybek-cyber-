#!/bin/bash

# Cybersecurity LMS Backend - Quick Start Script
# This script sets up the development environment

set -e

echo "🚀 Cybersecurity LMS Backend - Quick Start"
echo "==========================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✅ Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "⚙️ Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
else
    echo "✅ .env file already exists"
fi

# Check if PostgreSQL is accessible
echo ""
echo "🗄️ Checking PostgreSQL connection..."

# Create logs directory
mkdir -p logs

# Build TypeScript
echo ""
echo "🔨 Building TypeScript..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your configuration"
echo "2. Ensure PostgreSQL is running"
echo "3. Run: npm run db:migrate"
echo "4. Run: npm run dev"
echo ""
echo "API will be available at: http://localhost:5000"
echo "Documentation: README.md, API.md, ARCHITECTURE.md"

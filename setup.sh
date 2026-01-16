#!/bin/bash

echo "🚀 TVI Platform Setup Script"
echo "================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check for .env
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found."
    echo "Creating from template..."
    cp env.template .env
    echo ""
    echo "📝 Please edit .env file with your Supabase and Stripe keys:"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - SUPABASE_ANON_KEY"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - STRIPE_WEBHOOK_SECRET"
    echo "   - STRIPE_PRO_MONTHLY_PRICE_ID"
    echo "   - STRIPE_PRO_YEARLY_PRICE_ID"
    echo ""
    echo "Then run this script again."
    exit 0
fi

echo "✅ .env file found"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo ""
    echo "⚠️  Vercel CLI not found."
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run Supabase migrations in your project dashboard"
echo "  2. Configure Stripe products and webhook"
echo "  3. Test locally: npm run dev"
echo "  4. Deploy: npm run deploy"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
echo "================================"



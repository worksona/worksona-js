#!/bin/bash
#
# Setup Netlify Environment Variables for Railway API Integration
# 
# This script uses Netlify CLI to configure environment variables
# for Railway API server credentials.
#
# Prerequisites:
# - Netlify CLI installed: npm install -g netlify-cli
# - Authenticated: netlify login
# - Linked to site: netlify link
#

set -e

echo "🚀 Railway API - Netlify Environment Variables Setup"
echo "=================================================="
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Error: Netlify CLI is not installed"
    echo ""
    echo "Install it with: npm install -g netlify-cli"
    echo "Then run: netlify login"
    exit 1
fi

# Check if authenticated
echo "Checking Netlify authentication..."
if ! netlify status &> /dev/null; then
    echo "❌ Error: Not authenticated with Netlify"
    echo ""
    echo "Run: netlify login"
    exit 1
fi

echo "✅ Netlify CLI authenticated"
echo ""

# Prompt for Railway API URL
echo "📍 Railway API Configuration"
echo "----------------------------"
echo ""
read -p "Enter your Railway API URL (e.g., https://your-app.railway.app): " RAILWAY_API_URL

if [ -z "$RAILWAY_API_URL" ]; then
    echo "❌ Error: Railway API URL is required"
    exit 1
fi

# Remove trailing slash if present
RAILWAY_API_URL=${RAILWAY_API_URL%/}

echo ""
read -p "Enter your Railway API Key (e.g., wsk_live_...): " RAILWAY_API_KEY

if [ -z "$RAILWAY_API_KEY" ]; then
    echo "❌ Error: Railway API Key is required"
    exit 1
fi

echo ""
echo "🔧 Setting environment variables in Netlify..."
echo ""

# Set RAILWAY_API_URL
echo "Setting RAILWAY_API_URL..."
if netlify env:set RAILWAY_API_URL "$RAILWAY_API_URL" --context production; then
    echo "✅ RAILWAY_API_URL set for production"
else
    echo "❌ Failed to set RAILWAY_API_URL"
    exit 1
fi

# Set RAILWAY_API_KEY
echo ""
echo "Setting RAILWAY_API_KEY (will be marked as secret)..."
if netlify env:set RAILWAY_API_KEY "$RAILWAY_API_KEY" --context production --secret; then
    echo "✅ RAILWAY_API_KEY set for production (secret)"
else
    echo "❌ Failed to set RAILWAY_API_KEY"
    exit 1
fi

# Optional: Set for deploy-preview context
echo ""
read -p "Also set for Deploy Previews (PRs)? [y/N]: " set_preview

if [[ $set_preview =~ ^[Yy]$ ]]; then
    echo ""
    echo "Setting variables for deploy-preview context..."
    netlify env:set RAILWAY_API_URL "$RAILWAY_API_URL" --context deploy-preview
    netlify env:set RAILWAY_API_KEY "$RAILWAY_API_KEY" --context deploy-preview --secret
    echo "✅ Variables set for deploy-preview"
fi

# Optional: Set for branch-deploy context
echo ""
read -p "Also set for Branch Deploys? [y/N]: " set_branch

if [[ $set_branch =~ ^[Yy]$ ]]; then
    echo ""
    echo "Setting variables for branch-deploy context..."
    netlify env:set RAILWAY_API_URL "$RAILWAY_API_URL" --context branch-deploy
    netlify env:set RAILWAY_API_KEY "$RAILWAY_API_KEY" --context branch-deploy --secret
    echo "✅ Variables set for branch-deploy"
fi

echo ""
echo "=================================================="
echo "✅ Environment Variables Configured Successfully!"
echo "=================================================="
echo ""
echo "📋 Summary:"
echo "  API URL: $RAILWAY_API_URL"
echo "  API Key: [CONFIGURED - secret]"
echo ""
echo "🔍 Verify configuration:"
echo "  netlify env:list"
echo ""
echo "🚀 Next Steps:"
echo "  1. Trigger a new deployment: netlify deploy --prod"
echo "  2. Or push to your repository to trigger automatic deployment"
echo "  3. Check build logs for: ✅ Railway environment configuration generated"
echo "  4. Visit your site and verify demos work without manual configuration"
echo ""
echo "📖 Documentation:"
echo "  - NETLIFY_ENV_VARIABLES.md - Quick setup guide"
echo "  - docs/NETLIFY_ENV_SETUP.md - Comprehensive guide"
echo ""
echo "🔧 Update variables:"
echo "  netlify env:set RAILWAY_API_URL \"new-url\""
echo "  netlify env:set RAILWAY_API_KEY \"new-key\" --secret"
echo ""
echo "🗑️  Remove variables:"
echo "  netlify env:unset RAILWAY_API_URL"
echo "  netlify env:unset RAILWAY_API_KEY"
echo ""

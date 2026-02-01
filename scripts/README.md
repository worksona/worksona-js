# Build Scripts

This directory contains build and setup scripts for Netlify deployment.

## setup-netlify-env.sh

Interactive setup script for configuring Railway API environment variables in Netlify using the Netlify CLI.

### Usage

**Via NPM Script (Recommended):**
```bash
npm run netlify:setup
```

**Direct Execution:**
```bash
# Make executable (first time only)
chmod +x scripts/setup-netlify-env.sh

# Run interactive setup
./scripts/setup-netlify-env.sh
```

### Prerequisites

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Authenticate
netlify login

# Link to your site
netlify link
```

### What It Does

1. Prompts for Railway API URL and Key
2. Sets environment variables in Netlify using CLI
3. Optionally configures Deploy Preview and Branch Deploy contexts
4. Provides verification commands

### Options

The script will prompt for:
- Railway API URL (required)
- Railway API Key (required)
- Configure for Deploy Previews (optional)
- Configure for Branch Deploys (optional)

### Manual CLI Alternative

```bash
# Set variables manually
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context production
netlify env:set RAILWAY_API_KEY "wsk_live_..." --context production --secret

# Deploy
netlify deploy --prod
```

## inject-env.js

Generates `www/assets/js/railway-env.js` during Netlify build by injecting environment variables.

### Usage

This script runs automatically during Netlify build (configured in `netlify.toml`):

```bash
node scripts/inject-env.js
```

### Environment Variables

The script reads these environment variables from Netlify:

- `RAILWAY_API_URL` - Railway API server URL
- `RAILWAY_API_KEY` - Railway API authentication key

### Output

Generates `www/assets/js/railway-env.js` with:

```javascript
window.RAILWAY_API_URL = 'https://your-app.railway.app';
window.RAILWAY_API_KEY = 'wsk_live_...';
```

### Local Testing

```bash
# Set environment variables
export RAILWAY_API_URL="https://your-app.railway.app"
export RAILWAY_API_KEY="wsk_live_..."

# Run script
node scripts/inject-env.js

# Verify output
cat www/assets/js/railway-env.js
```

### Notes

- The generated file is committed to git with empty values
- Netlify overwrites it during build with actual values
- Local development uses the empty version (falls back to UI config)

### Configuration

Set environment variables in Netlify:
1. Dashboard → Site Settings → Environment Variables
2. Add `RAILWAY_API_URL` and `RAILWAY_API_KEY`
3. Trigger new deployment

See [NETLIFY_ENV_SETUP.md](../docs/NETLIFY_ENV_SETUP.md) for detailed instructions.

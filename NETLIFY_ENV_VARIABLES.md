# Netlify Environment Variables - Quick Setup

## What This Does

✅ Railway API credentials stored securely in Netlify as environment variables (secrets)
✅ Automatically injected into all demos during build
✅ Users don't need to manually enter API keys
✅ UI still available for manual overrides

## Setup Options

Choose your preferred method:
- **Option A: Automated Script** (Recommended) - Run a setup script
- **Option B: Netlify CLI** - Manual CLI commands
- **Option C: Netlify Dashboard** - Web interface

---

## Option A: Automated Setup Script (Recommended)

### Prerequisites
```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Authenticate
netlify login

# Link to your site (run in project directory)
netlify link
```

### Run Setup Script
```bash
# Make script executable (first time only)
chmod +x scripts/setup-netlify-env.sh

# Run the interactive setup
./scripts/setup-netlify-env.sh
```

The script will:
1. ✅ Prompt for Railway API URL and Key
2. ✅ Set environment variables in Netlify
3. ✅ Optionally configure for Deploy Previews and Branch Deploys
4. ✅ Show verification commands

---

## Option B: Netlify CLI (Manual)

### Prerequisites
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Authenticate
netlify login

# Link to your site
netlify link
```

### Set Environment Variables

```bash
# Set Railway API URL (production)
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context production

# Set Railway API Key (production, marked as secret)
netlify env:set RAILWAY_API_KEY "wsk_live_YOUR_KEY_HERE" --context production --secret
```

### Optional: Configure for Other Contexts

```bash
# Deploy Previews (pull requests)
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context deploy-preview
netlify env:set RAILWAY_API_KEY "wsk_live_..." --context deploy-preview --secret

# Branch Deploys
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context branch-deploy
netlify env:set RAILWAY_API_KEY "wsk_live_..." --context branch-deploy --secret
```

### Verify Configuration

```bash
# List all environment variables
netlify env:list

# Get specific variable
netlify env:get RAILWAY_API_URL
```

### Deploy

```bash
# Deploy to production
netlify deploy --prod

# Or trigger build via git push
git push origin main
```

---

## Option C: Netlify Dashboard (Web Interface)

### Step 1: Add Environment Variables in Netlify

### Step 1: Add Environment Variables in Netlify

1. Go to Netlify Dashboard → Your Site → **Site Settings**
2. Navigate to **Environment variables**
3. Click **Add a variable**

Add these two variables:

#### Variable 1: RAILWAY_API_URL
```
Key:   RAILWAY_API_URL
Value: https://your-app.railway.app
```

#### Variable 2: RAILWAY_API_KEY
```
Key:   RAILWAY_API_KEY
Value: wsk_live_YOUR_KEY_HERE
```
⚠️ **Mark as SECRET** (recommended)

### Step 2: Deploy

Trigger a new build:
- Push to repository, OR
- Click **Trigger deploy** in Netlify, OR
- Use CLI: `netlify deploy --prod`

### Step 3: Verify

After build completes:
1. Visit your site
2. Open browser console (F12)
3. Test: `RailwayConfig.detectApiUrl()`
4. Should return your Railway URL

---

## Managing Environment Variables

### View Current Configuration

**CLI:**
```bash
# List all environment variables
netlify env:list

# Get specific variable value
netlify env:get RAILWAY_API_URL
netlify env:get RAILWAY_API_KEY
```

**Dashboard:**
Site Settings → Environment variables

### Update Variables

**CLI:**
```bash
# Update API URL
netlify env:set RAILWAY_API_URL "https://new-url.railway.app" --context production

# Update API Key
netlify env:set RAILWAY_API_KEY "new_key_here" --context production --secret

# Trigger new deployment
netlify deploy --prod
```

**Dashboard:**
1. Go to Environment variables
2. Click variable name
3. Update value
4. Trigger new deployment

### Remove Variables

**CLI:**
```bash
# Remove specific variable
netlify env:unset RAILWAY_API_URL --context production
netlify env:unset RAILWAY_API_KEY --context production
```

**Dashboard:**
1. Go to Environment variables
2. Click variable name
3. Click "Delete"

### Clone Variables Across Contexts

```bash
# Copy production vars to deploy-preview
netlify env:import production deploy-preview

# Copy production vars to branch-deploy
netlify env:import production branch-deploy
```

---

## Netlify CLI Reference

### Installation & Authentication

```bash
# Install CLI globally
npm install -g netlify-cli

# Or use via npx (no installation)
npx netlify-cli <command>

# Authenticate with Netlify
netlify login

# Check authentication status
netlify status

# Link project to Netlify site
netlify link
```

### Environment Variable Commands

```bash
# Set variable
netlify env:set KEY "value" --context <context>

# Set secret variable (hidden in UI)
netlify env:set KEY "value" --context <context> --secret

# List all variables
netlify env:list

# Get variable value
netlify env:get KEY

# Remove variable
netlify env:unset KEY --context <context>

# Import variables from another context
netlify env:import <source-context> <target-context>
```

### Deployment Commands

```bash
# Deploy to production
netlify deploy --prod

# Deploy draft (for testing)
netlify deploy

# Open site in browser
netlify open:site

# Open admin dashboard
netlify open:admin

# Watch build logs
netlify watch
```

### Context Options

Available contexts for environment variables:
- `production` - Main branch deployments
- `deploy-preview` - Pull request previews
- `branch-deploy` - Branch deployments
- `dev` - Local development (netlify dev)

---

## Complete CLI Workflow

### Initial Setup

```bash
# 1. Install and authenticate
npm install -g netlify-cli
netlify login

# 2. Navigate to project
cd /path/to/worksona-js

# 3. Link to Netlify site
netlify link

# 4. Run automated setup script
./scripts/setup-netlify-env.sh

# Or manually set variables
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context production
netlify env:set RAILWAY_API_KEY "wsk_live_..." --context production --secret

# 5. Verify configuration
netlify env:list

# 6. Deploy
netlify deploy --prod
```

### Verify Deployment

```bash
# Check deployment status
netlify status

# Watch build logs
netlify watch

# Open deployed site
netlify open:site
```

### Test Environment Variables

```bash
# View current values
netlify env:list

# Check specific variable
netlify env:get RAILWAY_API_URL

# Test in browser console after deployment
# Visit site → F12 → Console:
# > RailwayConfig.detectApiUrl()
# > RailwayConfig.getApiKey()
```

---

## How It Works

```
Netlify Build
    ↓
Environment Variables (secrets)
    ↓
scripts/inject-env.js (runs during build)
    ↓
Generates: www/assets/js/railway-env.js
    ↓
Loaded by all demo pages
    ↓
Available to railway-config.js
    ↓
Used in all API calls
```

## Configuration Priority

The system checks in this order:

1. **Netlify Environment Variables** (what you just set up) ← Default for all users
2. **User Manual Override** (via UI) ← Optional per-user customization
3. **Auto-detection** (Railway/Netlify/Vercel domains)
4. **Localhost** (for development)

## Files Changed

### New Files
- ✅ `scripts/inject-env.js` - Build script
- ✅ `www/assets/js/railway-env.js` - Generated env vars file
- ✅ `docs/NETLIFY_ENV_SETUP.md` - Detailed setup guide

### Modified Files
- ✅ `netlify.toml` - Added build command
- ✅ `www/assets/js/railway-config.js` - Checks for env vars first
- ✅ All demo HTML files - Load railway-env.js

## Local Development

For local testing without Netlify:

```bash
# Set environment variables
export RAILWAY_API_URL="https://your-app.railway.app"
export RAILWAY_API_KEY="wsk_live_..."

# Run build script
node scripts/inject-env.js

# Start local server and test
```

## Build Log

When build succeeds, you'll see:

```
✅ Railway environment configuration generated successfully
   Output: www/assets/js/railway-env.js
   API URL: https://your-app.railway.app
   API Key: [CONFIGURED]

💡 Note: Users can still override these values in the UI
```

## User Experience

### Before
- Users see empty API config UI
- Must manually enter Railway URL and API key
- Configuration per-browser/per-device

### After
- Demos work immediately without configuration
- API credentials automatically available
- UI still available for testing different environments

## Security

✅ API keys stored as Netlify secrets (not in code)
✅ Keys never committed to git
✅ Generated file contains actual keys only on Netlify builds
✅ Local development uses empty placeholder

## Testing

Test that environment variables are working:

```javascript
// In browser console on deployed site
console.log('API URL:', window.RAILWAY_API_URL);
console.log('Has Key:', !!window.RAILWAY_API_KEY);

// Should show your Railway URL and true
```

## Documentation

For detailed information, see:
- 📖 [NETLIFY_ENV_SETUP.md](docs/NETLIFY_ENV_SETUP.md) - Complete setup guide
- 📖 [RAILWAY_INTEGRATION_SUMMARY.md](docs/RAILWAY_INTEGRATION_SUMMARY.md) - Implementation details
- 📖 [RAILWAY_API_QUICK_REFERENCE.md](RAILWAY_API_QUICK_REFERENCE.md) - API reference

## Support

If environment variables aren't working:

1. Check Netlify build logs for errors
2. Verify variables are set in Netlify dashboard
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Check browser console for Railway Config messages
5. Verify `railway-env.js` file contains values

## CLI Quick Reference Card

```bash
# ⚡ Quick Setup (One-Liner)
./scripts/setup-netlify-env.sh

# 📋 List All Variables
netlify env:list

# ➕ Add Variable
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context production
netlify env:set RAILWAY_API_KEY "wsk_live_..." --context production --secret

# 🔍 View Variable
netlify env:get RAILWAY_API_URL

# ✏️ Update Variable
netlify env:set RAILWAY_API_KEY "new_key" --context production --secret

# 🗑️ Remove Variable
netlify env:unset RAILWAY_API_URL --context production

# 🚀 Deploy
netlify deploy --prod

# 👀 Watch Logs
netlify watch

# 🌐 Open Site
netlify open:site
```

## Troubleshooting (CLI)

### "netlify: command not found"

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Or use npx
npx netlify-cli status
```

### "Not authorized"

```bash
# Login to Netlify
netlify login

# Check status
netlify status
```

### "No site id found"

```bash
# Link to your Netlify site
netlify link

# Or specify site manually
netlify link --name your-site-name
```

### "Environment variable not updating"

```bash
# Ensure you specified the correct context
netlify env:set KEY "value" --context production

# Trigger new deployment after changing vars
netlify deploy --prod

# Check build logs
netlify watch
```

### Verify Variables Are Set

```bash
# List all vars (should show RAILWAY_API_URL and RAILWAY_API_KEY)
netlify env:list

# Get specific value
netlify env:get RAILWAY_API_URL

# Should return: https://your-app.railway.app
```

### Test Local Build Script

```bash
# Set env vars locally
export RAILWAY_API_URL="https://your-app.railway.app"
export RAILWAY_API_KEY="wsk_live_..."

# Run build script
node scripts/inject-env.js

# Check generated file
cat www/assets/js/railway-env.js

# Should contain your actual values
```

## Advanced CLI Usage

### Environment-Specific Configuration

```bash
# Different URLs for different contexts
netlify env:set RAILWAY_API_URL "https://prod.railway.app" --context production
netlify env:set RAILWAY_API_URL "https://staging.railway.app" --context deploy-preview
netlify env:set RAILWAY_API_URL "https://dev.railway.app" --context branch-deploy

# Different keys for different contexts
netlify env:set RAILWAY_API_KEY "prod_key" --context production --secret
netlify env:set RAILWAY_API_KEY "staging_key" --context deploy-preview --secret
netlify env:set RAILWAY_API_KEY "dev_key" --context branch-deploy --secret
```

### Bulk Operations

```bash
# Export current variables
netlify env:list > env-backup.txt

# Copy all production vars to staging
netlify env:import production deploy-preview

# Set multiple variables via script
netlify env:set VAR1 "value1" --context production
netlify env:set VAR2 "value2" --context production
netlify env:set VAR3 "value3" --context production
```

### Testing Before Deployment

```bash
# Deploy draft (not production)
netlify deploy

# Review draft URL
# If good, promote to production:
netlify deploy --prod
```

## Integration with CI/CD

### GitHub Actions

```yaml
name: Update Netlify Env Vars
on:
  workflow_dispatch:
    inputs:
      api_url:
        description: 'Railway API URL'
        required: true
      api_key:
        description: 'Railway API Key'
        required: true

jobs:
  update-env:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Netlify CLI
        run: npm install -g netlify-cli
      
      - name: Set Environment Variables
        run: |
          netlify env:set RAILWAY_API_URL "${{ github.event.inputs.api_url }}" --context production
          netlify env:set RAILWAY_API_KEY "${{ github.event.inputs.api_key }}" --context production --secret
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      
      - name: Trigger Deployment
        run: netlify deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Shell Script for Rotation

```bash
#!/bin/bash
# rotate-keys.sh - Rotate Railway API keys

NEW_KEY="$1"

if [ -z "$NEW_KEY" ]; then
  echo "Usage: ./rotate-keys.sh <new-api-key>"
  exit 1
fi

echo "Rotating Railway API key..."

# Update all contexts
netlify env:set RAILWAY_API_KEY "$NEW_KEY" --context production --secret
netlify env:set RAILWAY_API_KEY "$NEW_KEY" --context deploy-preview --secret
netlify env:set RAILWAY_API_KEY "$NEW_KEY" --context branch-deploy --secret

echo "✅ Key rotated successfully"
echo "🚀 Deploying to production..."

netlify deploy --prod

echo "✅ Complete! New key is now active."
```

## Next Steps

1. ✅ Choose your setup method (Script, CLI, or Dashboard)
2. ✅ Configure environment variables
3. ✅ Deploy to Netlify
4. ✅ Verify demos work without manual configuration
5. ✅ (Optional) Test manual override functionality
6. ✅ Share demos with users - they work immediately!

---

## 🎯 Recommended Workflow

For the best experience, we recommend using **NPM scripts** (easiest):

### Quick Setup (NPM Scripts)

```bash
# 1. Setup environment variables (interactive)
npm run netlify:setup

# 2. Deploy to production
npm run netlify:deploy

# 3. Open deployed site
npm run netlify:open

# 4. View environment variables
npm run netlify:env

# 5. Watch build logs
npm run netlify:watch
```

### Alternative Methods

1. **Use the automated script** for initial setup:
   ```bash
   ./scripts/setup-netlify-env.sh
   ```

2. **Use CLI for updates**:
   ```bash
   netlify env:set RAILWAY_API_KEY "new_key" --context production --secret
   netlify deploy --prod
   ```

3. **Use Dashboard for viewing** (easier to see all contexts)

## 📦 NPM Scripts Reference

All Netlify operations available as npm scripts:

| Script | Command | Description |
|--------|---------|-------------|
| `npm run netlify:setup` | Run setup wizard | Interactive environment variable setup |
| `npm run netlify:env` | List variables | Show all environment variables |
| `npm run netlify:deploy` | Deploy to prod | Deploy site to production |
| `npm run netlify:open` | Open site | Open deployed site in browser |
| `npm run netlify:watch` | Watch logs | Monitor build logs in real-time |

---

**Ready to deploy!** Choose your preferred method and configure the environment variables. 🚀

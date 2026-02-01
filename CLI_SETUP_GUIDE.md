# CLI Setup Guide - Railway API + Netlify

Complete command-line workflow for deploying Worksona.js demos to Netlify with Railway API integration.

## Prerequisites

- Node.js 14+ installed
- Git repository access
- Railway API server deployed
- Railway API key

## Complete Setup (Copy & Paste)

### 1. Install & Authenticate

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Authenticate with Netlify (opens browser)
netlify login

# Verify authentication
netlify status
```

### 2. Link Project

```bash
# Navigate to your project
cd /path/to/worksona-js

# Link to Netlify site (choose from list or enter site ID)
netlify link

# Verify link
netlify status
```

### 3. Configure Environment Variables

**Option A: Automated Script (Recommended)**

```bash
# Run interactive setup
npm run netlify:setup
```

**Option B: Manual CLI Commands**

```bash
# Set Railway API URL
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context production

# Set Railway API Key (secret)
netlify env:set RAILWAY_API_KEY "wsk_live_YOUR_KEY_HERE" --context production --secret

# Verify configuration
netlify env:list
```

### 4. Deploy

```bash
# Deploy to production
npm run netlify:deploy

# Or use CLI directly
netlify deploy --prod
```

### 5. Verify

```bash
# Open deployed site
npm run netlify:open

# Or use CLI directly
netlify open:site
```

**In browser console (F12):**
```javascript
// Check API URL
RailwayConfig.detectApiUrl()
// Expected: "https://your-app.railway.app"

// Check API key is loaded
!!RailwayConfig.getApiKey()
// Expected: true

// Test server health
await RailwayConfig.checkHealth()
// Expected: true
```

---

## Complete Command Sequence

Copy and paste this entire sequence:

```bash
# Install CLI (skip if already installed)
npm install -g netlify-cli

# Authenticate
netlify login

# Navigate to project
cd /path/to/worksona-js

# Link to site
netlify link

# Setup environment variables
npm run netlify:setup
# Follow prompts:
# - Enter Railway API URL: https://your-app.railway.app
# - Enter Railway API Key: wsk_live_...
# - Configure Deploy Previews? y
# - Configure Branch Deploys? y

# Verify configuration
npm run netlify:env

# Deploy
npm run netlify:deploy

# Open site
npm run netlify:open

# Done! 🎉
```

---

## Daily Commands

### Check Configuration

```bash
# View all environment variables
npm run netlify:env

# View specific variable
netlify env:get RAILWAY_API_URL
netlify env:get RAILWAY_API_KEY
```

### Update Configuration

```bash
# Update API URL
netlify env:set RAILWAY_API_URL "https://new-url.railway.app" --context production

# Update API Key
netlify env:set RAILWAY_API_KEY "new_key" --context production --secret

# Deploy changes
npm run netlify:deploy
```

### Deploy & Monitor

```bash
# Deploy to production
npm run netlify:deploy

# Watch build logs
npm run netlify:watch

# Open site
npm run netlify:open

# Open admin panel
netlify open:admin
```

---

## Environment Contexts

Configure different environments:

### Production (Main Branch)

```bash
netlify env:set RAILWAY_API_URL "https://prod.railway.app" --context production
netlify env:set RAILWAY_API_KEY "prod_key" --context production --secret
```

### Deploy Previews (Pull Requests)

```bash
netlify env:set RAILWAY_API_URL "https://staging.railway.app" --context deploy-preview
netlify env:set RAILWAY_API_KEY "staging_key" --context deploy-preview --secret
```

### Branch Deploys (Feature Branches)

```bash
netlify env:set RAILWAY_API_URL "https://dev.railway.app" --context branch-deploy
netlify env:set RAILWAY_API_KEY "dev_key" --context branch-deploy --secret
```

---

## Troubleshooting

### Command Not Found

```bash
# Reinstall CLI
npm install -g netlify-cli

# Or use npx
npx netlify-cli status
```

### Not Authenticated

```bash
# Login again
netlify login

# Check status
netlify status
```

### No Site Linked

```bash
# Link to site
netlify link

# Or by name
netlify link --name your-site-name
```

### Variables Not Working

```bash
# Verify they're set
netlify env:list

# Redeploy
netlify deploy --prod

# Check build logs
netlify watch

# Hard refresh browser (Ctrl+Shift+R)
```

### Build Fails

```bash
# View full build log
netlify watch

# Test build script locally
export RAILWAY_API_URL="https://your-app.railway.app"
export RAILWAY_API_KEY="wsk_live_..."
node scripts/inject-env.js
cat www/assets/js/railway-env.js
```

---

## Advanced Usage

### Test Before Production

```bash
# Create draft deployment
netlify deploy

# Test at the provided URL
# If good, deploy to production:
netlify deploy --prod
```

### Clone Variables

```bash
# Copy production to staging
netlify env:import production deploy-preview

# Copy production to development
netlify env:import production branch-deploy
```

### Key Rotation

```bash
# Generate new key in Railway dashboard
# Then update Netlify:
netlify env:set RAILWAY_API_KEY "new_key" --context production --secret
netlify env:set RAILWAY_API_KEY "new_key" --context deploy-preview --secret
netlify env:set RAILWAY_API_KEY "new_key" --context branch-deploy --secret

# Deploy
npm run netlify:deploy
```

### Backup Configuration

```bash
# Export current configuration
netlify env:list > env-backup-$(date +%Y%m%d).txt

# View backup
cat env-backup-*.txt
```

---

## Verification Checklist

After setup, verify:

- [ ] `netlify status` shows "Connected"
- [ ] `netlify env:list` shows RAILWAY_API_URL and RAILWAY_API_KEY
- [ ] `netlify deploy --prod` completes successfully
- [ ] Site opens with `netlify open:site`
- [ ] Browser console shows correct API URL
- [ ] Browser console shows API key is loaded
- [ ] Demo API calls succeed (no 401 errors)
- [ ] No CORS errors in console

---

## Resources

| Document | Description |
|----------|-------------|
| [RAILWAY_NETLIFY_SETUP.md](./RAILWAY_NETLIFY_SETUP.md) | 5-minute setup guide |
| [NETLIFY_ENV_VARIABLES.md](./NETLIFY_ENV_VARIABLES.md) | Environment variables reference |
| [NETLIFY_CLI_CHEATSHEET.md](./NETLIFY_CLI_CHEATSHEET.md) | CLI command reference |
| [.github/NETLIFY_DEPLOYMENT.md](./.github/NETLIFY_DEPLOYMENT.md) | Deployment guide |
| [docs/NETLIFY_ENV_SETUP.md](./docs/NETLIFY_ENV_SETUP.md) | Comprehensive documentation |
| [RAILWAY_API_QUICK_REFERENCE.md](./RAILWAY_API_QUICK_REFERENCE.md) | Railway API reference |

---

## Success!

✅ Environment variables configured
✅ Deployed to Netlify
✅ Demos work automatically
✅ No manual configuration needed for users

**Your Railway API is now integrated with all Worksona.js demos!** 🚀

Need help? Check the troubleshooting section or view detailed docs in the resources above.

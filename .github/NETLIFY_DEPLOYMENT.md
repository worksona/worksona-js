# Netlify Deployment Guide

Complete guide for deploying Worksona.js demos to Netlify with Railway API integration.

## Overview

This project deploys to Netlify with Railway API credentials automatically configured via environment variables. Users can access demos without manual configuration.

## Prerequisites

- Node.js 14+ installed
- Netlify account
- Railway API server deployed
- Railway API key

## Quick Setup

### Option 1: Automated Script (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Authenticate
netlify login

# Link to site
netlify link

# Run automated setup
npm run netlify:setup

# Deploy
npm run netlify:deploy
```

### Option 2: Manual CLI

```bash
# Set environment variables
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context production
netlify env:set RAILWAY_API_KEY "wsk_live_..." --context production --secret

# Deploy
npm run netlify:deploy
```

### Option 3: Netlify Dashboard

1. Go to Site Settings → Environment variables
2. Add `RAILWAY_API_URL` and `RAILWAY_API_KEY`
3. Trigger deployment

## NPM Scripts

Convenient npm scripts for Netlify operations:

```bash
# Setup environment variables (runs setup script)
npm run netlify:setup

# List environment variables
npm run netlify:env

# Deploy to production
npm run netlify:deploy

# Open deployed site
npm run netlify:open

# Watch build logs
npm run netlify:watch
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `RAILWAY_API_URL` | Railway API server URL | `https://your-app.railway.app` |
| `RAILWAY_API_KEY` | Railway API authentication key | `wsk_live_...` |

### Setting Variables

**Via NPM Script:**
```bash
npm run netlify:setup
```

**Via CLI:**
```bash
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context production
netlify env:set RAILWAY_API_KEY "wsk_live_..." --context production --secret
```

**Via Dashboard:**
- Navigate to: Site Settings → Environment variables
- Click "Add a variable"
- Enter key and value
- Select contexts (production, deploy-preview, branch-deploy)

## Build Process

### netlify.toml Configuration

```toml
[build]
  publish = "www"
  command = "node scripts/inject-env.js"
```

### Build Script: scripts/inject-env.js

The build script:
1. Reads `RAILWAY_API_URL` and `RAILWAY_API_KEY` from Netlify environment
2. Generates `www/assets/js/railway-env.js`
3. Injects values into JavaScript file
4. Makes variables available as `window.RAILWAY_API_URL` and `window.RAILWAY_API_KEY`

### Build Output

```bash
✅ Railway environment configuration generated successfully
   Output: www/assets/js/railway-env.js
   API URL: https://your-app.railway.app
   API Key: [CONFIGURED]
```

## Deployment

### Deploy to Production

```bash
# Via npm script
npm run netlify:deploy

# Via CLI directly
netlify deploy --prod

# Via git push
git push origin main
```

### Deploy Preview (Draft)

```bash
# Create draft deployment
netlify deploy

# Review at provided URL
# If good, deploy to production:
netlify deploy --prod
```

### Watch Build

```bash
# Watch build logs in real-time
npm run netlify:watch

# Or directly
netlify watch
```

## Verification

### Check Environment Variables

```bash
# List all variables
npm run netlify:env

# Or directly
netlify env:list

# Get specific variable
netlify env:get RAILWAY_API_URL
```

### Test Deployment

1. **Open Site:**
   ```bash
   npm run netlify:open
   ```

2. **Test in Browser Console:**
   ```javascript
   // Should return Railway API URL
   console.log(RailwayConfig.detectApiUrl());
   
   // Should return true if key is set
   console.log(!!RailwayConfig.getApiKey());
   
   // Test API connectivity
   RailwayConfig.checkHealth()
     .then(healthy => console.log('Server healthy:', healthy));
   ```

3. **Test Demos:**
   - Navigate to `/demos/endpoint-api-demo.html`
   - Should work without manual configuration
   - Try making an API call
   - Verify authentication succeeds

## Context Configuration

### Production

Main branch deployments:

```bash
netlify env:set RAILWAY_API_URL "https://prod.railway.app" --context production
netlify env:set RAILWAY_API_KEY "prod_key" --context production --secret
```

### Deploy Previews

Pull request previews:

```bash
netlify env:set RAILWAY_API_URL "https://staging.railway.app" --context deploy-preview
netlify env:set RAILWAY_API_KEY "staging_key" --context deploy-preview --secret
```

### Branch Deploys

Feature branch deployments:

```bash
netlify env:set RAILWAY_API_URL "https://dev.railway.app" --context branch-deploy
netlify env:set RAILWAY_API_KEY "dev_key" --context branch-deploy --secret
```

## Updating Configuration

### Update Environment Variables

```bash
# Update via CLI
netlify env:set RAILWAY_API_KEY "new_key" --context production --secret

# Redeploy
npm run netlify:deploy
```

### Key Rotation

```bash
# Update key in all contexts
netlify env:set RAILWAY_API_KEY "new_key" --context production --secret
netlify env:set RAILWAY_API_KEY "new_key" --context deploy-preview --secret
netlify env:set RAILWAY_API_KEY "new_key" --context branch-deploy --secret

# Deploy
npm run netlify:deploy
```

## Troubleshooting

### Build Fails

**Check build logs:**
```bash
netlify watch
```

**Common issues:**
- Missing environment variables
- Invalid Node.js version
- Script execution permissions

**Solutions:**
```bash
# Verify variables are set
netlify env:list

# Check script permissions
chmod +x scripts/inject-env.js

# Test build locally
export RAILWAY_API_URL="https://your-app.railway.app"
export RAILWAY_API_KEY="wsk_live_..."
node scripts/inject-env.js
```

### Variables Not Working

**Symptoms:**
- Demos ask for manual configuration
- Browser console shows empty values

**Solutions:**
1. Verify variables in Netlify:
   ```bash
   netlify env:list
   ```

2. Check build logs for injection:
   ```bash
   netlify watch
   ```

3. Hard refresh browser:
   - Chrome/Edge: Ctrl+Shift+R
   - Firefox: Ctrl+F5
   - Safari: Cmd+Shift+R

4. Clear browser cache

### API Calls Fail

**Symptoms:**
- 401 Unauthorized errors
- "Invalid API key" messages

**Solutions:**
1. Verify key is valid:
   ```bash
   # Test with curl
   curl -H "x-api-key: YOUR_KEY" https://your-app.railway.app/health
   ```

2. Check Railway server is running

3. Verify CORS is configured on Railway server

4. Check Railway server logs for errors

## CI/CD Integration

### GitHub Actions

Add to `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Netlify CLI
        run: npm install -g netlify-cli
      
      - name: Deploy to Netlify
        run: netlify deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Monitoring

### Check Deployment Status

```bash
# View site status
netlify status

# List recent deploys
netlify api listSiteDeploys --data '{"site_id": "YOUR_SITE_ID"}'

# Open admin panel
netlify open:admin
```

### View Logs

```bash
# Watch build logs
netlify watch

# View function logs (if using functions)
netlify functions:log
```

## Security

### Best Practices

✅ **DO:**
- Mark `RAILWAY_API_KEY` as secret
- Use different keys for different contexts
- Rotate keys regularly
- Monitor API usage

❌ **DON'T:**
- Commit keys to git
- Share keys in plain text
- Use production keys in development
- Log keys to console

### Key Rotation Schedule

Recommended: Rotate API keys every 90 days

```bash
# Quick rotation
./scripts/rotate-key.sh "new_key_here"
```

## Resources

### Documentation

- [NETLIFY_ENV_VARIABLES.md](../NETLIFY_ENV_VARIABLES.md) - Quick setup guide
- [NETLIFY_CLI_CHEATSHEET.md](../NETLIFY_CLI_CHEATSHEET.md) - CLI reference
- [docs/NETLIFY_ENV_SETUP.md](../docs/NETLIFY_ENV_SETUP.md) - Comprehensive guide
- [RAILWAY_API_QUICK_REFERENCE.md](../RAILWAY_API_QUICK_REFERENCE.md) - API reference

### Links

- [Netlify CLI Docs](https://docs.netlify.com/cli/get-started/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Build Configuration](https://docs.netlify.com/configure-builds/overview/)

## Support

### Getting Help

1. Check troubleshooting section above
2. Review Netlify build logs
3. Test build script locally
4. Check Railway server status
5. Review browser console for errors

### Common Commands

```bash
# Status check
netlify status

# List variables
netlify env:list

# Deploy
netlify deploy --prod

# Open site
netlify open:site

# View logs
netlify watch
```

## Quick Reference

| Task | Command |
|------|---------|
| Setup | `npm run netlify:setup` |
| List vars | `npm run netlify:env` |
| Deploy | `npm run netlify:deploy` |
| Open site | `npm run netlify:open` |
| Watch logs | `npm run netlify:watch` |
| Update var | `netlify env:set KEY "value" --context production` |
| Remove var | `netlify env:unset KEY --context production` |

---

**Ready to deploy!** Run `npm run netlify:setup` to get started. 🚀

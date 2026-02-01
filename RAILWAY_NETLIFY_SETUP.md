# Railway + Netlify Setup - Complete Workflow

One-page guide to connect your Worksona.js demos to Railway API via Netlify environment variables.

## 🚀 5-Minute Setup

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Authenticate & Link

```bash
# Login to Netlify
netlify login

# Navigate to project
cd /path/to/worksona-js

# Link to your Netlify site
netlify link
```

### Step 3: Run Setup Script

```bash
# One command to configure everything
npm run netlify:setup
```

**The script will:**
- ✅ Prompt for Railway API URL
- ✅ Prompt for Railway API Key
- ✅ Set environment variables in Netlify (marked as secrets)
- ✅ Optionally configure Deploy Previews and Branch Deploys
- ✅ Show verification commands

### Step 4: Deploy

```bash
npm run netlify:deploy
```

### Step 5: Verify

```bash
# Open your site
npm run netlify:open

# In browser console (F12):
RailwayConfig.detectApiUrl()
// Should return: "https://your-app.railway.app"

RailwayConfig.getApiKey()
// Should return: "wsk_live_..."
```

## ✅ Done!

Your demos now work automatically without users needing to enter API credentials.

---

## Alternative: Manual CLI Setup

```bash
# Set variables manually
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context production
netlify env:set RAILWAY_API_KEY "wsk_live_..." --context production --secret

# Deploy
netlify deploy --prod
```

---

## What Gets Deployed

### Build Process

```
1. Netlify starts build
   ↓
2. Runs: node scripts/inject-env.js
   ↓
3. Reads environment variables (RAILWAY_API_URL, RAILWAY_API_KEY)
   ↓
4. Generates: www/assets/js/railway-env.js
   ↓
5. File contains: window.RAILWAY_API_URL = "..."
   ↓
6. Deploys to Netlify CDN
   ↓
7. Users access demos → API credentials already configured
```

### Generated File

`www/assets/js/railway-env.js` (created during build):

```javascript
window.RAILWAY_API_URL = 'https://your-app.railway.app';
window.RAILWAY_API_KEY = 'wsk_live_YOUR_KEY_HERE';
```

This file is loaded by all demo pages and read by `railway-config.js`.

---

## User Experience

### Before Environment Variables

1. User visits demo
2. Sees "API server not configured"
3. Must manually enter Railway URL
4. Must manually enter API key
5. Configuration per-browser

### After Environment Variables

1. User visits demo
2. Demo works immediately
3. No configuration needed
4. Same experience for all users
5. UI still available for overrides

---

## NPM Scripts

| Command | What It Does |
|---------|-------------|
| `npm run netlify:setup` | Interactive environment variable setup |
| `npm run netlify:env` | List all environment variables |
| `npm run netlify:deploy` | Deploy to production |
| `npm run netlify:open` | Open deployed site in browser |
| `npm run netlify:watch` | Watch build logs in real-time |

---

## Managing Variables

### View Configuration

```bash
# List all variables
npm run netlify:env

# View specific variable
netlify env:get RAILWAY_API_URL
```

### Update Variables

```bash
# Update API key
netlify env:set RAILWAY_API_KEY "new_key" --context production --secret

# Redeploy
npm run netlify:deploy
```

### Remove Variables

```bash
# Remove from production
netlify env:unset RAILWAY_API_URL --context production
netlify env:unset RAILWAY_API_KEY --context production
```

---

## Configuration Priority

The system checks credentials in this order:

1. **Netlify Environment Variables** ← Default for all users
   - `window.RAILWAY_API_URL`
   - `window.RAILWAY_API_KEY`

2. **User Manual Override** ← UI override for testing
   - `localStorage.getItem('worksona_railway_api_url')`
   - `localStorage.getItem('worksona_railway_api_key')`

3. **Auto-detection** ← Domain-based fallback
   - Railway: `*.railway.app`
   - Netlify: `*.netlify.app`
   - Vercel: `*.vercel.app`

4. **Localhost** ← Development default
   - `http://localhost:3000`

---

## Security

### Environment Variables as Secrets

```bash
# Always use --secret flag for API keys
netlify env:set RAILWAY_API_KEY "wsk_live_..." --context production --secret
```

This:
- ✅ Marks variable as secret in Netlify dashboard
- ✅ Hides value in UI (shows ••••••)
- ✅ Prevents accidental exposure in logs
- ✅ Follows security best practices

### What's Committed to Git

```bash
# ✅ Committed (safe)
scripts/inject-env.js           # Build script
www/assets/js/railway-env.js    # Placeholder with empty values
netlify.toml                     # Build configuration

# ❌ NOT committed (secure)
.env                             # Local environment variables (in .gitignore)
Actual API keys                  # Only in Netlify secrets
```

---

## Troubleshooting

### "netlify: command not found"

```bash
npm install -g netlify-cli
```

### "Not authorized"

```bash
netlify login
```

### "No site found"

```bash
netlify link
```

### Variables not updating

```bash
# Check variables are set
netlify env:list

# Force new build
netlify deploy --prod --force

# Clear browser cache
```

---

## Complete Example

Start to finish:

```bash
# 1. Install CLI
npm install -g netlify-cli

# 2. Authenticate
netlify login

# 3. Link site
cd /Users/davidolsson/WORKSONA/worksona-js
netlify link

# 4. Setup environment variables
npm run netlify:setup

# When prompted:
# Enter your Railway API URL: https://my-app.railway.app
# Enter your Railway API Key: wsk_live_YOUR_KEY_HERE
# Also set for Deploy Previews? y
# Also set for Branch Deploys? y

# 5. Deploy
npm run netlify:deploy

# 6. Verify
npm run netlify:open

# 7. Test in browser console:
# RailwayConfig.detectApiUrl()
# RailwayConfig.getApiKey()
```

**Result:** All demos work immediately! 🎉

---

## Next Steps

After setup:

1. ✅ Test all demos on your deployed site
2. ✅ Verify API calls succeed
3. ✅ Check browser console for any errors
4. ✅ Share demo links with users
5. ✅ Monitor Railway API usage

---

## Quick Commands

```bash
# Setup everything
npm run netlify:setup && npm run netlify:deploy

# Check configuration
npm run netlify:env

# Update API key
netlify env:set RAILWAY_API_KEY "new_key" --context production --secret
npm run netlify:deploy

# Open site
npm run netlify:open
```

---

## Documentation

- 📖 [NETLIFY_CLI_CHEATSHEET.md](./NETLIFY_CLI_CHEATSHEET.md) - CLI reference
- 📖 [docs/NETLIFY_ENV_SETUP.md](./docs/NETLIFY_ENV_SETUP.md) - Detailed guide
- 📖 [.github/NETLIFY_DEPLOYMENT.md](./.github/NETLIFY_DEPLOYMENT.md) - Deployment guide
- 📖 [RAILWAY_API_QUICK_REFERENCE.md](./RAILWAY_API_QUICK_REFERENCE.md) - API reference

---

**You're all set!** 🚀 Your Railway API is now integrated with Netlify environment variables.

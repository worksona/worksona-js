# Netlify CLI Cheat Sheet - Railway API Integration

Quick reference for managing Railway API environment variables using Netlify CLI.

## 🚀 Quick Start

```bash
# One-command setup
./scripts/setup-netlify-env.sh
```

## 📦 Installation & Setup

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Authenticate with Netlify
netlify login

# Navigate to project
cd /path/to/worksona-js

# Link to Netlify site
netlify link

# Verify setup
netlify status
```

## 🔐 Environment Variables

### Set Variables

```bash
# Production (required)
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context production
netlify env:set RAILWAY_API_KEY "wsk_live_..." --context production --secret

# Deploy Previews (optional)
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context deploy-preview
netlify env:set RAILWAY_API_KEY "wsk_live_..." --context deploy-preview --secret

# Branch Deploys (optional)
netlify env:set RAILWAY_API_URL "https://your-app.railway.app" --context branch-deploy
netlify env:set RAILWAY_API_KEY "wsk_live_..." --context branch-deploy --secret
```

### View Variables

```bash
# List all variables
netlify env:list

# Get specific variable
netlify env:get RAILWAY_API_URL
netlify env:get RAILWAY_API_KEY

# Show variable in specific context
netlify env:get RAILWAY_API_URL --context production
```

### Update Variables

```bash
# Update API URL
netlify env:set RAILWAY_API_URL "https://new-url.railway.app" --context production

# Update API Key (mark as secret)
netlify env:set RAILWAY_API_KEY "new_key_here" --context production --secret
```

### Remove Variables

```bash
# Remove from specific context
netlify env:unset RAILWAY_API_URL --context production
netlify env:unset RAILWAY_API_KEY --context production

# Remove from all contexts
netlify env:unset RAILWAY_API_URL --context production
netlify env:unset RAILWAY_API_URL --context deploy-preview
netlify env:unset RAILWAY_API_URL --context branch-deploy
```

### Clone Variables

```bash
# Copy production vars to preview
netlify env:import production deploy-preview

# Copy production vars to branch deploys
netlify env:import production branch-deploy
```

## 🚀 Deployment

```bash
# Deploy to production
netlify deploy --prod

# Deploy draft (preview)
netlify deploy

# Open deployed site
netlify open:site

# Open admin dashboard
netlify open:admin

# Watch build logs
netlify watch
```

## 🔍 Verification

### Check Configuration

```bash
# Verify environment variables are set
netlify env:list

# Check specific values
netlify env:get RAILWAY_API_URL
# Expected: https://your-app.railway.app

netlify env:get RAILWAY_API_KEY
# Expected: wsk_live_...
```

### Test Build Locally

```bash
# Set environment variables locally
export RAILWAY_API_URL="https://your-app.railway.app"
export RAILWAY_API_KEY="wsk_live_..."

# Run build script
node scripts/inject-env.js

# Verify generated file
cat www/assets/js/railway-env.js
# Should contain your actual values

# Clean up
unset RAILWAY_API_URL
unset RAILWAY_API_KEY
```

### Test on Deployed Site

After deployment:
1. Visit your deployed site
2. Open browser console (F12)
3. Run:
   ```javascript
   console.log('API URL:', RailwayConfig.detectApiUrl());
   console.log('Has API Key:', !!RailwayConfig.getApiKey());
   ```

## 🎯 Common Tasks

### Initial Setup

```bash
# Complete initial setup
netlify login
cd /path/to/worksona-js
netlify link
./scripts/setup-netlify-env.sh
netlify deploy --prod
```

### Update API Key (Key Rotation)

```bash
# Set new key
netlify env:set RAILWAY_API_KEY "new_key" --context production --secret

# Redeploy
netlify deploy --prod

# Verify
netlify open:site
```

### Change API URL

```bash
# Update URL
netlify env:set RAILWAY_API_URL "https://new-url.railway.app" --context production

# Redeploy
netlify deploy --prod
```

### Setup Multiple Environments

```bash
# Production
netlify env:set RAILWAY_API_URL "https://prod.railway.app" --context production
netlify env:set RAILWAY_API_KEY "prod_key" --context production --secret

# Staging (Deploy Previews)
netlify env:set RAILWAY_API_URL "https://staging.railway.app" --context deploy-preview
netlify env:set RAILWAY_API_KEY "staging_key" --context deploy-preview --secret

# Development (Branch Deploys)
netlify env:set RAILWAY_API_URL "https://dev.railway.app" --context branch-deploy
netlify env:set RAILWAY_API_KEY "dev_key" --context branch-deploy --secret
```

## 🐛 Troubleshooting

### Command Not Found

```bash
# Install globally
npm install -g netlify-cli

# Or use npx
npx netlify-cli status
```

### Not Authenticated

```bash
# Login
netlify login

# Check status
netlify status
```

### No Site Linked

```bash
# Link to site
netlify link

# Or link by name
netlify link --name your-site-name

# Or link by ID
netlify link --id your-site-id
```

### Variables Not Updating

```bash
# Ensure correct context
netlify env:set KEY "value" --context production

# Trigger new build
netlify deploy --prod

# Wait for build to complete
netlify watch

# Hard refresh browser (Ctrl+Shift+R)
```

### Permission Denied

```bash
# Make script executable
chmod +x scripts/setup-netlify-env.sh

# Run with bash explicitly
bash scripts/setup-netlify-env.sh
```

## 📋 Context Reference

| Context | When It Runs | Use Case |
|---------|--------------|----------|
| `production` | Main branch deploys | Live production site |
| `deploy-preview` | Pull requests | Preview PRs before merge |
| `branch-deploy` | Branch deployments | Feature branch testing |
| `dev` | Local development | `netlify dev` command |

## 🔐 Security Best Practices

### DO ✅

```bash
# Always mark API keys as secret
netlify env:set RAILWAY_API_KEY "key" --context production --secret

# Use different keys for different environments
netlify env:set RAILWAY_API_KEY "prod_key" --context production --secret
netlify env:set RAILWAY_API_KEY "staging_key" --context deploy-preview --secret

# Rotate keys regularly
# (use the setup script or manual commands)
```

### DON'T ❌

```bash
# Don't commit keys to git
echo "wsk_live_..." > .env  # ❌ Never commit this

# Don't log keys to console
echo $RAILWAY_API_KEY  # ❌ Avoid this

# Don't share keys in plain text
# (always use secure channels)
```

## 🔄 Key Rotation Script

Create `rotate-key.sh`:

```bash
#!/bin/bash
NEW_KEY="$1"

if [ -z "$NEW_KEY" ]; then
  echo "Usage: ./rotate-key.sh <new-api-key>"
  exit 1
fi

echo "🔄 Rotating Railway API key..."

# Update all contexts
netlify env:set RAILWAY_API_KEY "$NEW_KEY" --context production --secret
netlify env:set RAILWAY_API_KEY "$NEW_KEY" --context deploy-preview --secret
netlify env:set RAILWAY_API_KEY "$NEW_KEY" --context branch-deploy --secret

echo "✅ Key rotated in all contexts"
echo "🚀 Deploying..."

netlify deploy --prod

echo "✅ Complete!"
```

Usage:
```bash
chmod +x rotate-key.sh
./rotate-key.sh "wsk_live_new_key_here"
```

## 📚 Additional Resources

- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started/)
- [Environment Variables Guide](https://docs.netlify.com/environment-variables/overview/)
- [NETLIFY_ENV_VARIABLES.md](./NETLIFY_ENV_VARIABLES.md) - Complete setup guide
- [docs/NETLIFY_ENV_SETUP.md](./docs/NETLIFY_ENV_SETUP.md) - Detailed documentation
- [RAILWAY_API_QUICK_REFERENCE.md](./RAILWAY_API_QUICK_REFERENCE.md) - Railway API reference

## 💡 Pro Tips

### Aliases for Common Commands

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Netlify shortcuts
alias nenv='netlify env:list'
alias nset='netlify env:set'
alias nget='netlify env:get'
alias ndeploy='netlify deploy --prod'
alias nwatch='netlify watch'
alias nopen='netlify open:site'
```

### Quick Status Check

```bash
# One-liner to check everything
netlify status && netlify env:list && echo "✅ Ready to deploy"
```

### Backup Environment Variables

```bash
# Export to file
netlify env:list > env-backup-$(date +%Y%m%d).txt

# View backup
cat env-backup-*.txt
```

## 🎓 Learning Path

1. **Install & Authenticate**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Link Your Site**
   ```bash
   cd /path/to/worksona-js
   netlify link
   ```

3. **Set Environment Variables**
   ```bash
   ./scripts/setup-netlify-env.sh
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

5. **Verify & Test**
   ```bash
   netlify open:site
   # Open console, test RailwayConfig
   ```

## ✨ You're Ready!

With these commands, you can fully manage Railway API integration using Netlify CLI. The automated script (`setup-netlify-env.sh`) handles most tasks, but these manual commands give you full control.

**Quick Start:**
```bash
./scripts/setup-netlify-env.sh && netlify deploy --prod
```

🚀 **That's it!** Your demos will work immediately with Railway API.

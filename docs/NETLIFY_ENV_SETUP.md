# Netlify Environment Variables Setup

## Overview

Worksona.js demos can use Railway API credentials configured as Netlify environment variables (secrets). This provides secure, centralized configuration without requiring users to manually enter API keys.

## Architecture

```
Netlify Build Process
  ↓
Environment Variables (secrets)
  ↓
scripts/inject-env.js
  ↓
www/assets/js/railway-env.js (generated)
  ↓
Loaded by HTML pages
  ↓
Available to railway-config.js
  ↓
Used in all API calls
```

## Priority System

The configuration system checks sources in this order:

1. **Netlify Environment Variables** (highest priority)
   - Set in Netlify dashboard
   - Injected during build
   - Available as `window.RAILWAY_API_URL` and `window.RAILWAY_API_KEY`

2. **User Manual Override** (localStorage)
   - Set via UI inputs
   - Persists across sessions
   - Allows per-user customization

3. **Auto-detection**
   - Railway domain detection
   - Netlify/Vercel detection
   - Localhost fallback

## Setting Up in Netlify

### Step 1: Access Environment Variables

1. Go to your Netlify dashboard
2. Select your site (e.g., `worksonajs.netlify.app`)
3. Navigate to **Site settings** → **Environment variables**
4. Click **Add a variable**

### Step 2: Add Environment Variables

Add the following variables:

#### Variable 1: RAILWAY_API_URL
- **Key:** `RAILWAY_API_URL`
- **Value:** Your Railway API server URL
  - Example: `https://your-app.railway.app`
  - Or: `https://worksona-api.railway.app`
- **Scopes:** 
  - ✅ Production
  - ✅ Deploy Previews (optional)
  - ✅ Branch deploys (optional)

#### Variable 2: RAILWAY_API_KEY
- **Key:** `RAILWAY_API_KEY`
- **Value:** Your Railway API key
  - Format: `wsk_live_...`
  - Get from Railway dashboard or generate new key
- **Scopes:**
  - ✅ Production
  - ✅ Deploy Previews (optional)
  - ✅ Branch deploys (optional)
- **⚠️ Mark as SECRET** (recommended for security)

### Step 3: Trigger Build

After adding environment variables:

1. Click **Save** in Netlify dashboard
2. Trigger a new deployment:
   - Option A: Push to your repository
   - Option B: Click **Trigger deploy** → **Deploy site**
3. Monitor the build log for confirmation:
   ```
   ✅ Railway environment configuration generated successfully
      Output: www/assets/js/railway-env.js
      API URL: https://your-app.railway.app
      API Key: [CONFIGURED]
   ```

### Step 4: Verify Configuration

Visit your deployed site:

1. Open browser developer console (F12)
2. Type: `RailwayConfig.detectApiUrl()`
3. Should return your Railway API URL
4. Type: `RailwayConfig.getApiKey()`
5. Should return your API key
6. Test an API call in any demo

## Build Process Details

### Build Script: `scripts/inject-env.js`

This Node.js script runs during Netlify build:

```javascript
// Reads environment variables
const RAILWAY_API_URL = process.env.RAILWAY_API_URL;
const RAILWAY_API_KEY = process.env.RAILWAY_API_KEY;

// Generates www/assets/js/railway-env.js
window.RAILWAY_API_URL = 'https://your-app.railway.app';
window.RAILWAY_API_KEY = 'wsk_live_...';
```

### Generated File: `www/assets/js/railway-env.js`

- **Generated during:** Netlify build
- **Contains:** Environment variable values
- **Loaded by:** All demo HTML pages
- **Note:** Committed version has empty values for local development

### Netlify Configuration: `netlify.toml`

```toml
[build]
  publish = "www"
  command = "node scripts/inject-env.js"
```

## Local Development

### Without Environment Variables

For local development without Netlify:

1. Environment variables default to empty strings
2. Configuration falls back to localStorage or auto-detection
3. Use UI inputs to configure API URL and key manually
4. Or set values in browser console:
   ```javascript
   window.RAILWAY_API_URL = 'http://localhost:3000';
   window.RAILWAY_API_KEY = 'your-local-key';
   ```

### Testing Build Process Locally

To test the environment variable injection locally:

```bash
# Set environment variables
export RAILWAY_API_URL="https://your-app.railway.app"
export RAILWAY_API_KEY="wsk_live_..."

# Run build script
node scripts/inject-env.js

# Check generated file
cat www/assets/js/railway-env.js
```

## Security Best Practices

### ✅ DO:
- Mark `RAILWAY_API_KEY` as SECRET in Netlify
- Use different keys for production vs. preview deployments
- Rotate API keys periodically
- Monitor API usage in Railway dashboard
- Use rate limiting on Railway server

### ❌ DON'T:
- Commit API keys to git
- Share API keys in public channels
- Use production keys in development
- Hardcode keys in source files
- Log API keys to console (except in build process)

## User Override Capability

### Why Keep the UI?

Even with environment variables configured, the UI allows:

1. **Testing different environments:**
   - Switch between staging and production
   - Test with different Railway deployments
   - Quick environment switching

2. **Per-user customization:**
   - Different users can use their own keys
   - Override default configuration
   - Personal development environments

3. **Debugging:**
   - Test with specific API versions
   - Troubleshoot connectivity issues
   - Validate different configurations

### How Override Works

```javascript
// Priority order in railway-config.js:
1. window.RAILWAY_API_URL (Netlify env var)
2. localStorage.getItem('worksona_railway_api_url') (user override)
3. Auto-detection (hostname-based)

// User can override via UI:
RailwayConfig.setApiUrl('https://my-custom-api.com');
RailwayConfig.setApiKey('my-custom-key');
```

## Troubleshooting

### Environment Variables Not Working

**Symptom:** Demos still ask for manual configuration

**Solutions:**
1. Check Netlify dashboard → Environment variables are set
2. Verify build completed successfully (check logs)
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Check browser console for Railway Config messages
5. Verify `railway-env.js` file is present and contains values

### Build Script Fails

**Symptom:** Build fails with script error

**Solutions:**
1. Check `scripts/inject-env.js` file exists
2. Verify Node.js is available in Netlify build environment
3. Check build logs for specific error messages
4. Ensure file permissions are correct

### API Calls Still Failing

**Symptom:** Environment variables set but API calls return 401

**Solutions:**
1. Verify API key is valid in Railway dashboard
2. Check Railway server is running and accessible
3. Test API key with curl:
   ```bash
   curl -H "x-api-key: YOUR_KEY" https://your-app.railway.app/health
   ```
4. Check Railway server logs for authentication errors
5. Verify CORS is configured correctly on Railway server

### Values Not Updating

**Symptom:** Changed environment variables but demos show old values

**Solutions:**
1. Trigger new deployment after changing variables
2. Wait for deployment to complete
3. Clear browser cache
4. Hard refresh page (Ctrl+Shift+R)
5. Check browser console shows new values

## Environment-Specific Configuration

### Production (main branch)

```toml
[context.production.environment]
  RAILWAY_API_URL = "https://worksona-api.railway.app"
  RAILWAY_API_KEY = "wsk_live_prod_..."
```

### Deploy Previews (PRs)

```toml
[context.deploy-preview.environment]
  RAILWAY_API_URL = "https://worksona-api-staging.railway.app"
  RAILWAY_API_KEY = "wsk_live_staging_..."
```

### Branch Deploys

```toml
[context.branch-deploy.environment]
  RAILWAY_API_URL = "https://worksona-api-dev.railway.app"
  RAILWAY_API_KEY = "wsk_live_dev_..."
```

## Monitoring

### Check Environment Variables Are Loaded

```javascript
// In browser console
console.log('API URL:', window.RAILWAY_API_URL);
console.log('Has API Key:', !!window.RAILWAY_API_KEY);
console.log('Detected URL:', RailwayConfig.detectApiUrl());
console.log('Headers:', RailwayConfig.getHeaders());
```

### Verify API Connectivity

```javascript
// Test health endpoint
RailwayConfig.checkHealth()
  .then(isHealthy => console.log('Server healthy:', isHealthy));
```

## Migration from Manual Configuration

### For Existing Users

If users already have manual configuration:

1. **Their configuration persists:** localStorage values take precedence
2. **Gradual migration:** Users can clear localStorage to use env vars
3. **No breaking changes:** Everything continues to work
4. **Optional adoption:** Users can choose to keep manual config

### Clear Manual Configuration

To switch to environment variables:

```javascript
// In browser console
RailwayConfig.clearConfig();
location.reload();
```

Or via UI:
1. Clear the API URL field
2. Clear the API Key field
3. Reload the page
4. Environment variables will be used automatically

## Related Documentation

- [Railway API Quick Reference](../RAILWAY_API_QUICK_REFERENCE.md)
- [Railway Integration Summary](./RAILWAY_INTEGRATION_SUMMARY.md)
- [Railway Integration Testing](./RAILWAY_INTEGRATION_TESTING.md)
- [API Server README](./API_SERVER_README.md)

## Support

For issues with environment variables:
1. Check Netlify build logs
2. Verify variables in Netlify dashboard
3. Test generated `railway-env.js` file
4. Check browser console for errors
5. Contact support with build logs and error messages

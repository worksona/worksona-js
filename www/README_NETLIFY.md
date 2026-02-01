# Netlify Deployment - Worksona.js

**Live Site:** https://worksonajs.netlify.app/  
**API URL:** https://worksonajs.netlify.app/api

## Overview

This site is deployed to Netlify and serves static files from the `www/` directory. The demos work in two modes:

1. **Library Mode** - Works entirely client-side (no server needed)
   - `/demos/library-internal-demo.html` - Direct library usage
   - Uses `worksona.js` or `worksona.min.js` from CDN

2. **API Mode** - Uses Netlify API endpoints
   - `/demos/endpoint-api-demo.html` - REST API testing
   - `/demos/delegation-demo.html` - Multi-agent workflows
   - API URL: `https://worksonajs.netlify.app/api`
   - Automatically configured when accessed from Netlify domain

## API Server Configuration

The demos automatically use `https://worksonajs.netlify.app/api` when accessed from the Netlify domain. This requires Netlify Functions or a proxy to handle API requests.

### Netlify Functions Setup

To enable API endpoints on Netlify, you'll need to:

1. **Create Netlify Functions** to proxy API requests
2. **Or use Netlify Edge Functions** for better performance
3. **Or proxy to an external API server** via Netlify redirects

See `NETLIFY_API_CONFIG.md` for detailed setup instructions.

### For Users

When visiting the demos on https://worksonajs.netlify.app/, the API URL is automatically set to `https://worksonajs.netlify.app/api`. You can override this in the API URL input field if needed.

## Deployment

The site is automatically deployed from the `main` branch via Netlify's Git integration.

### Manual Deploy

```bash
netlify deploy --dir=www --prod
```

### Configuration

See `netlify.toml` in the repository root for:
- Publish directory: `www`
- Security headers
- Caching rules
- URL redirects

## Environment Variables

Set in Netlify Dashboard → Site settings → Environment variables:

- `API_BASE_URL` - Default API server URL (optional)
- Any other variables needed for the site

## File Structure

```
www/
├── index.html              # Landing page
├── docs/                   # Documentation
├── demos/                  # Interactive demos
├── downloads/              # Library files
├── assets/                 # CSS/JS assets
└── netlify.toml            # Netlify config (for standalone deploy)
```

## Troubleshooting

**Issue: Demos show "Server offline"**
- ✅ This is expected - configure API URL in the demo UI
- Or use Library Mode demos which don't need a server

**Issue: API calls fail**
- Check CORS settings on your API server
- Ensure API server allows requests from `worksonajs.netlify.app`

**Issue: Changes not appearing**
- Clear Netlify cache: Site settings → Build & deploy → Clear cache
- Trigger a new deploy

## Support

- **Documentation:** https://worksonajs.netlify.app/docs/
- **Demos:** https://worksonajs.netlify.app/demos/
- **GitHub:** https://github.com/worksona/worksona-js

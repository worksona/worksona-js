# Vercel Setup for Worksona.js

**Yes, Vercel CAN run your Express.js API server!** This is perfect for Worksona.js.

## Quick Answer

✅ **Vercel supports Express.js natively** - No need for separate hosting  
✅ **Same domain** - API and static site together  
✅ **Serverless** - Automatic scaling  
✅ **Free tier** - Generous limits  

## Setup Steps

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
# From repository root
vercel --prod
```

That's it! Vercel will:
- Deploy your static site from `www/`
- Deploy your API server from `api/index.js`
- Route `/api/*` to your Express server
- Route `/*` to your static files

## Configuration

The `vercel.json` file is already configured:

```json
{
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.js" },
    { "src": "/health", "dest": "/api/index.js" },
    { "src": "/(.*)", "dest": "/www/$1" }
  ]
}
```

## Environment Variables

Set in Vercel Dashboard → Project Settings → Environment Variables:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_API_KEY`
- `API_KEY` (optional)

## API Endpoints

**Live Site:** https://worksona-js.vercel.app/  
**API URL:** https://worksona-js.vercel.app/api

Once deployed, your API will be at:

- `https://worksona-js.vercel.app/api/query`
- `https://worksona-js.vercel.app/api/agents`
- `https://worksona-js.vercel.app/health`

## Demos Auto-Configure

The demos automatically detect Vercel domains and use:

```javascript
const API_BASE = window.location.origin + '/api';
```

Your site at `https://worksona-js.vercel.app` automatically uses `https://worksona-js.vercel.app/api` for all API calls.

## Comparison: Vercel vs Netlify

| Feature | Vercel | Netlify |
|---------|--------|---------|
| **Express.js Support** | ✅ Native | ❌ Requires Functions |
| **Static Site** | ✅ Yes | ✅ Yes |
| **Same Domain** | ✅ Yes | ⚠️ Requires proxy |
| **Setup Complexity** | ⭐ Easy | ⭐⭐ Medium |
| **Free Tier** | ✅ Generous | ✅ Generous |

## Why Vercel is Better for Worksona.js

1. **Native Express Support** - No refactoring needed
2. **One Deployment** - Site + API together
3. **Automatic Routing** - `/api/*` → Express, `/*` → Static
4. **Better DX** - Simpler configuration

## Next Steps

1. ✅ **Deployed**: https://worksona-js.vercel.app/
2. ✅ **Demos**: Auto-detect Vercel and use `/api` automatically
3. **Set Environment Variables** in Vercel dashboard (if not already set):
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `GOOGLE_API_KEY`
4. **Test API**: Visit `https://worksona-js.vercel.app/api/health`

---

**Vercel is the perfect choice for Worksona.js!** 🚀

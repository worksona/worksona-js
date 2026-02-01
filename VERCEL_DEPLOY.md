# Deploying Worksona.js to Vercel

Vercel can host **both** your static site AND your Express.js API server! This is a great option.

## Why Vercel?

✅ **Can run Express.js servers** - Unlike Netlify, Vercel natively supports Express  
✅ **Serverless functions** - Automatic scaling  
✅ **Free tier** - Generous limits  
✅ **Easy deployment** - Git integration  
✅ **Same domain** - API and site on one domain  

## Quick Deploy

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from repository root)
vercel --prod
```

### Option 2: Git Integration

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel auto-detects the configuration
4. Deploy!

## Configuration

The `vercel.json` file configures:

- **API Routes**: `/api/*` → Express server (`worksona-server.js`)
- **Static Files**: `/*` → `www/` directory
- **Health Check**: `/health` → Express server

## Project Structure

```
worksona-js/
├── vercel.json              # Vercel configuration
├── worksona-server.js       # Express API server
├── api/
│   └── index.js            # Vercel serverless entry point
└── www/                     # Static site files
```

## Environment Variables

Set in Vercel Dashboard → Project Settings → Environment Variables:

- `OPENAI_API_KEY` - Your OpenAI API key
- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `GOOGLE_API_KEY` - Your Google API key
- `PORT` - (Optional, Vercel handles this)
- `API_KEY` - (Optional, for API authentication)

## API Endpoints

**Live Site:** https://worksona-js.vercel.app/  
**API URL:** https://worksona-js.vercel.app/api

Once deployed, your API will be available at:

- **Production**: `https://worksona-js.vercel.app/api/*`
- **Preview**: `https://worksona-js-git-branch.vercel.app/api/*`

Examples:
- `https://worksona-js.vercel.app/api/query`
- `https://worksona-js.vercel.app/api/agents`
- `https://worksona-js.vercel.app/health`

## Static Site

Your static files in `www/` are served at the root:

- `https://your-project.vercel.app/` - Landing page
- `https://your-project.vercel.app/demos/` - Demos
- `https://your-project.vercel.app/docs/` - Documentation

## Updating Demos for Vercel

The demos will automatically detect Vercel domains and use the correct API URL:

```javascript
// Auto-detected in demos
const API_BASE = window.location.hostname.includes('vercel.app')
  ? window.location.origin + '/api'
  : 'http://localhost:3000';
```

## Deployment Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview (for testing)
vercel

# View deployments
vercel ls

# View logs
vercel logs
```

## Troubleshooting

**Issue: API routes return 404**
- Check `vercel.json` routes configuration
- Ensure `api/index.js` exists and exports the Express app

**Issue: Environment variables not working**
- Set them in Vercel Dashboard
- Redeploy after adding variables

**Issue: File uploads not working**
- Vercel has a 4.5MB limit for serverless functions
- Consider using Vercel Blob for larger files

**Issue: Timeout errors**
- Vercel free tier: 10s timeout
- Pro tier: 60s timeout
- Consider optimizing long-running operations

## Vercel vs Netlify

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Express.js Support | ✅ Native | ❌ Requires Functions |
| Static Site | ✅ Yes | ✅ Yes |
| Serverless Functions | ✅ Yes | ✅ Yes |
| Free Tier | ✅ Generous | ✅ Generous |
| Same Domain API | ✅ Yes | ⚠️ Requires proxy |

## Next Steps

1. ✅ **Deployed**: https://worksona-js.vercel.app/
2. ✅ **Demos**: Auto-detect Vercel and use `/api` automatically
3. **Set environment variables**: Add API keys in Vercel dashboard (if not already set)
4. **Test API**: Visit `https://worksona-js.vercel.app/api/health`

---

**Vercel is perfect for Worksona.js!** You get both static hosting AND API server on one platform. 🚀

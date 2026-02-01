# Configuring API Server for Netlify Deployment

**Netlify Site:** https://worksonajs.netlify.app/  
**API URL:** https://worksonajs.netlify.app/api

The demos automatically use `https://worksonajs.netlify.app/api` when accessed from the Netlify domain. This requires Netlify Functions or a proxy setup to handle API requests.

## Option 1: Configure via UI (Recommended)

The demos include an API URL configuration input that appears automatically on Netlify:

1. Deploy to Netlify
2. Open any demo page (e.g., `/demos/endpoint-api-demo.html`)
3. You'll see an "API URL" input field in the status bar
4. Enter your hosted API server URL (e.g., `https://your-api.herokuapp.com`)
5. Click "Update"
6. The URL is saved in localStorage and persists across page reloads

## Option 2: Set Environment Variable

Set `API_BASE_URL` as a Netlify environment variable:

1. Go to Netlify Dashboard → Site settings → Environment variables
2. Add variable: `API_BASE_URL` = `https://your-api-server.com`
3. Redeploy site

The demos will automatically use this value.

## Option 3: Host API Server Separately

### Recommended Hosting Options:

**Heroku:**
```bash
# Deploy worksona-server.js to Heroku
git subtree push --prefix . heroku main
# Or use Heroku CLI
heroku create your-api-name
git push heroku main
```

**Railway:**
```bash
railway init
railway up
# Set PORT environment variable
```

**Render:**
- Connect GitHub repository
- Set build command: `npm install`
- Set start command: `node worksona-server.js`
- Set environment variables for API keys

**Fly.io:**
```bash
fly launch
fly deploy
```

**DigitalOcean App Platform:**
- Connect repository
- Set build/run commands
- Configure environment variables

## Option 4: Use Netlify Functions (Advanced)

You can create Netlify Functions to proxy API requests:

1. Create `netlify/functions/api-proxy.js`:
```javascript
exports.handler = async (event, context) => {
  const { path, httpMethod, body, headers } = event;
  
  // Forward to your API server
  const response = await fetch(`https://your-api-server.com${path}`, {
    method: httpMethod,
    headers: {
      ...headers,
      'host': 'your-api-server.com'
    },
    body: body
  });
  
  return {
    statusCode: response.status,
    body: await response.text()
  };
};
```

2. Update `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api-proxy"
  status = 200
```

## Testing Locally

For local development, the demos automatically use `http://localhost:3000` when running on localhost.

## Troubleshooting

**Issue: "Server offline" on Netlify**
- ✅ This is expected - Netlify only serves static files
- Configure your API URL using Option 1 or 2 above

**Issue: CORS errors**
- Ensure your API server has CORS enabled
- Add your Netlify domain to allowed origins in `worksona-server.js`

**Issue: API URL not saving**
- Check browser console for errors
- Ensure localStorage is enabled
- Try clearing browser cache

## Example API Server Setup

```bash
# On your API server
export PORT=3000
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
export GOOGLE_API_KEY=AIza...

node worksona-server.js
```

Then configure the Netlify demo to point to: `https://your-api-server.com`

---

**Note:** The demos work in two modes:
1. **API Mode** - Requires a hosted API server (configured via UI or env var)
2. **Library Mode** - Works entirely client-side (see `/demos/library-internal-demo.html`)

For Netlify static hosting, Library Mode works out of the box without any server!

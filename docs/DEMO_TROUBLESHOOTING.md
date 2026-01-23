# Demo Troubleshooting Guide

If your demos aren't functioning, follow these steps to diagnose and fix the issue.

## Quick Diagnostic

1. **Open the test page**: `http://localhost:3000/demos/test-connection.html`
   - This will test all connections and show you exactly what's wrong

## Common Issues

### 1. Server Not Running

**Symptoms:**
- Demos show "Connection refused" or "Failed to fetch"
- Browser console shows network errors

**Solution:**
```bash
# Make sure server is running
npm start

# Or directly
node worksona-server.js
```

**Verify:**
- Check terminal for: `Status: Running on port 3000`
- Visit: `http://localhost:3000/health` (should return JSON)

---

### 2. API Keys Not Configured

**Symptoms:**
- Server shows `✗` marks for all providers in startup banner
- API calls return 503 errors with "PROVIDER_NOT_CONFIGURED"
- Error messages mention missing API keys

**Solution:**
1. Check your `.env` file exists in project root
2. Add your API keys:
   ```bash
   OPENAI_API_KEY=sk-proj-your-key-here
   ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   GOOGLE_API_KEY=your-google-key-here
   ```
3. **Restart the server** (important - env vars load on startup)

**Verify:**
- Server startup should show `✓` marks for configured providers
- Visit: `http://localhost:3000/api/info` (check `providers` object)

---

### 3. Agents Not Loaded

**Symptoms:**
- Demos return 404 errors for agent endpoints
- Error: "Agent not found"

**Solution:**
Agents are auto-loaded from the `agents/` directory on server startup. Check:

1. **Agents directory exists**: `agents/*.json` files should be present
2. **Server logs show**: `✓ Loaded: [Agent Name] (agent-id)`
3. **Verify agents**: Visit `http://localhost:3000/api/agents`

**Manual Load (if needed):**
```bash
curl -X POST http://localhost:3000/api/agents/load \
  -H "Content-Type: application/json" \
  -d @agents/marketing-agent.json
```

---

### 4. CORS Issues

**Symptoms:**
- Browser console shows CORS errors
- "Access-Control-Allow-Origin" errors

**Solution:**
CORS is enabled by default in `worksona-server.js`. If you see CORS errors:

1. Check server is running (not just static files)
2. Verify requests go to `http://localhost:3000/api/*` (not file://)
3. Check browser console for exact error message

---

### 5. Wrong Port

**Symptoms:**
- Demos can't connect
- Server running on different port

**Solution:**
1. Check `.env` file: `PORT=3000` (or your custom port)
2. Update demo URLs if using custom port
3. Or set `PORT` environment variable:
   ```bash
   PORT=3000 node worksona-server.js
   ```

---

### 6. Response Format Mismatch

**Symptoms:**
- API calls succeed but demos show "Invalid response format"
- Console shows data but UI doesn't update

**Solution:**
Check the API response format. Endpoints return:
```json
{
  "success": true,
  "data": {
    "result": "...",
    "metadata": {...}
  }
}
```

Some demos expect:
- `/api/agents/:id/chat` → `data.result`
- `/api/query` → `answer` (top-level)

---

## Testing Each Demo

### Endpoint API Demo
- **URL**: `http://localhost:3000/demos/endpoint-api-demo.html`
- **Requires**: Server running, API keys configured
- **Tests**: All REST API endpoints

### Library Internal Demo
- **URL**: `http://localhost:3000/demos/library-internal-demo.html`
- **Requires**: API keys entered in browser (no server needed for library mode)
- **Tests**: Direct library usage

### Delegation Demo
- **URL**: `http://localhost:3000/demos/delegation-demo.html`
- **Requires**: Server running, agents loaded, API keys configured
- **Tests**: Multi-agent workflows

---

## Step-by-Step Fix

1. **Start Server**
   ```bash
   npm start
   ```

2. **Check Health**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Check API Info**
   ```bash
   curl http://localhost:3000/api/info
   ```

4. **Check Agents**
   ```bash
   curl http://localhost:3000/api/agents
   ```

5. **Test Simple Query**
   ```bash
   curl "http://localhost:3000/api/query?q=Hello&model=gpt-4o"
   ```

6. **Open Test Page**
   ```
   http://localhost:3000/demos/test-connection.html
   ```

---

## Still Not Working?

1. **Check Browser Console** (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests
   - Verify request URLs are correct

2. **Check Server Logs**
   - Look for error messages in terminal
   - Check if agents loaded successfully
   - Verify API keys are detected

3. **Verify Environment**
   ```bash
   # Check .env file exists and has content
   cat .env
   
   # Check server can read env vars
   node -e "require('dotenv').config(); console.log(process.env.OPENAI_API_KEY ? 'Keys loaded' : 'No keys')"
   ```

4. **Test Direct API Call**
   ```bash
   # Simple test
   curl -X POST http://localhost:3000/api/agents/marketing-agent/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Hello"}'
   ```

---

## Quick Reference

| Issue | Check | Fix |
|-------|-------|-----|
| Can't connect | Server running? | `npm start` |
| 503 errors | API keys set? | Add to `.env` and restart |
| 404 errors | Agents loaded? | Check `agents/` directory |
| CORS errors | Server running? | Use `http://localhost:3000` |
| Wrong port | PORT in .env? | Update or use default 3000 |

---

## Need More Help?

- Check server logs for detailed error messages
- Use the test page: `/demos/test-connection.html`
- Review API documentation: `/docs/api-reference-swagger.html`

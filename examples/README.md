# Worksona.js Examples

This directory contains comprehensive examples demonstrating both usage modes of Worksona.js.

## 📁 Files

### 1. `dual-mode-demo.html`
**Interactive browser demo** showing both Library Mode and API Mode side-by-side.

**Features:**
- Live testing of both modes
- Code examples in JavaScript, Python, cURL, Node.js
- Visual comparison of approaches
- Copy-paste ready snippets

**To use:**
```bash
# Open in browser
open dual-mode-demo.html
# or
python -m http.server 8000
# Then visit: http://localhost:8000/dual-mode-demo.html
```

---

### 2. `dual-mode-demo.js`
**Node.js demo** with comprehensive examples of both modes.

**Features:**
- Library mode examples (direct API)
- API mode examples (REST endpoints)
- Multi-agent system demo
- Batch processing examples
- Metrics and monitoring

**To use:**
```bash
# Set up environment
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."

# For API mode demo, start server in another terminal:
node worksona-server.js

# Run demo
node examples/dual-mode-demo.js
```

**Output:**
```
╔════════════════════════════════════════════════════════════╗
║          WORKSONA.JS DUAL MODE DEMONSTRATION               ║
║                    Version 0.3.0                           ║
╚════════════════════════════════════════════════════════════╝

MODE 1: LIBRARY MODE (Direct JavaScript API)
─────────────────────────────────────────────
✓ Worksona initialized

[Example 1] Simple Chat with GPT-5
...
```

---

### 3. `frontier-models-demo.html`
**Interactive demo** for testing latest frontier models.

**Features:**
- Test GPT-5, GPT-5-mini, GPT-5-nano
- Test Claude Opus 4.5, Claude Sonnet 4.5
- Test o3, o3-mini reasoning models
- Multi-agent system demonstration
- Side-by-side model comparison

**To use:**
```bash
open frontier-models-demo.html
```

---

## 🚀 Quick Start Guide

### Library Mode (Direct JavaScript)

```javascript
// 1. Include library
<script src="../worksona.min.js"></script>

// 2. Initialize
const worksona = new Worksona({
  apiKeys: {
    openai: 'your-api-key'
  }
});

// 3. Load agent
await worksona.loadAgent({
  id: 'assistant',
  config: {
    provider: 'openai',
    model: 'gpt-5'
  }
});

// 4. Chat
const answer = await worksona.chat('assistant', 'Hello!');
```

---

### API Mode (REST API)

```bash
# 1. Start server
node worksona-server.js

# 2. Make requests
curl "http://localhost:3000/api/query?q=Hello&model=gpt-5"

# Or from JavaScript
const response = await fetch(
  'http://localhost:3000/api/query?q=Hello&model=gpt-5'
);
const data = await response.json();
console.log(data.answer);
```

---

## 📊 Mode Comparison

| Feature | Library Mode | API Mode |
|---------|-------------|----------|
| **Language** | JavaScript only | Any language |
| **Integration** | `import/require` | HTTP requests |
| **Latency** | None (direct) | Network latency |
| **File Upload** | Limited | Full multipart support |
| **Webhooks** | Not available | Native support |
| **Setup** | Import file | Run server |
| **Best For** | JS/Node apps | External integrations |

---

## 💡 Use Case Examples

### Use Library Mode When:
✅ Building a JavaScript/TypeScript application
✅ Need direct access to all features
✅ Want zero network overhead
✅ Building browser extensions
✅ Creating Electron apps

### Use API Mode When:
✅ Integrating from Python/Ruby/PHP/Java
✅ Need webhook endpoints
✅ Want simple URL-based queries
✅ Building mobile apps
✅ Connecting external services (Zapier, etc.)

### Use Both When:
🎯 Main app uses Library Mode
🎯 External integrations use API Mode
🎯 Need both flexibility and performance

---

## 🔧 Setup Instructions

### For Library Mode
1. No setup needed - just include `worksona.min.js`
2. Set your API keys
3. Start coding!

### For API Mode
1. Install dependencies:
```bash
npm install express multer cors helmet express-rate-limit
```

2. Set up environment:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Start server:
```bash
node worksona-server.js
```

4. Test it:
```bash
curl http://localhost:3000/health
```

---

## 📚 Code Examples

### JavaScript - Library Mode
```javascript
const worksona = new Worksona({
  apiKeys: { openai: 'sk-...' }
});

await worksona.loadAgent({
  id: 'gpt5',
  config: { model: 'gpt-5' }
});

const answer = await worksona.chat('gpt5', 'Question');
```

### Python - API Mode
```python
import requests

response = requests.get(
    'http://localhost:3000/api/query',
    params={'q': 'Question', 'model': 'gpt-5'}
)
print(response.json()['answer'])
```

### cURL - API Mode
```bash
curl "http://localhost:3000/api/query?q=Question&model=gpt-5"
```

### Node.js - Both Modes
```javascript
// Library Mode
const Worksona = require('./worksona.js');
const worksona = new Worksona({ apiKeys: {...} });

// API Mode
const response = await fetch('http://localhost:3000/api/query?q=...');
```

---

## 🎯 Testing the Examples

### Test Library Mode (Browser)
```bash
# Open the HTML demo
open dual-mode-demo.html

# Enter your API key in the form
# Click "Run Library Mode"
```

### Test API Mode (Terminal)
```bash
# Terminal 1 - Start server
node worksona-server.js

# Terminal 2 - Run demo
node examples/dual-mode-demo.js

# Or test with cURL
curl "http://localhost:3000/api/query?q=Hello"
```

### Test Both Modes (Node.js)
```bash
# Start server in background
node worksona-server.js &

# Run comprehensive demo
export OPENAI_API_KEY="sk-..."
node examples/dual-mode-demo.js
```

---

## 🆘 Troubleshooting

### Library Mode Issues
**Problem:** "Worksona is not defined"
**Solution:** Make sure `worksona.min.js` is loaded before your code

**Problem:** API key errors
**Solution:** Check your API key is valid and has credits

### API Mode Issues
**Problem:** "Connection refused"
**Solution:** Make sure server is running: `node worksona-server.js`

**Problem:** "Agent not found"
**Solution:** Load the agent first with `POST /api/agents/load`

**Problem:** "CORS errors"
**Solution:** CORS is enabled by default, check your request headers

---

## 📖 Additional Resources

- **Full Documentation:** `../README.md`
- **API Design:** `../API_DESIGN.md`
- **Query API:** `../QUERY_API_DESIGN.md`
- **Quick Reference:** `../QUERY_ENDPOINTS_REFERENCE.md`
- **Server Setup:** `../API_SERVER_README.md`
- **LLM Docs:** `../llm.txt`

---

## 🎉 Next Steps

1. **Try the demos** - Start with `dual-mode-demo.html`
2. **Read the code** - Check `dual-mode-demo.js` for detailed examples
3. **Build something** - Use the examples as templates
4. **Share feedback** - Let us know what you build!

---

## 📝 Notes

- **API Server** must be running for API mode examples to work
- **API Keys** are required for both modes
- **All examples** are fully functional and ready to use
- **Error handling** is included in all examples
- **Comments** explain each step clearly

Happy coding! 🚀

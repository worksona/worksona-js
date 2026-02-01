# Railway API Quick Reference

Fast lookup guide for Worksona Studio API on Railway.

## 🔑 Authentication

```bash
x-api-key: wsk_live_YOUR_KEY_HERE
```

## 🌐 Base URL

```
https://your-app.railway.app
```

## 📊 Rate Limit

**300 requests per 15 minutes** per IP address

## 🔓 Public Endpoints (No Auth)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/shared-workflows/:id` | GET | View shared workflow |
| `/api-docs` | GET | API documentation |

## 🔒 Protected Endpoints (Auth Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agents` | GET | List available agents |
| `/api/chat` | POST | Execute workflow |
| `/api/upload` | POST | Upload file |
| `/api/generate-image` | POST | Generate image |
| `/api/mcp-tools/execute` | POST | Execute MCP tool |
| `/api/shared-workflows` | POST | Share workflow |
| `/api/chat/message` | POST | Chat assistant |

## 💬 Common Requests

### Execute Chat
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_KEY" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "model": "gpt-4o"
  }' \
  https://your-app.railway.app/api/chat
```

### Upload File
```bash
curl -X POST \
  -H "x-api-key: YOUR_KEY" \
  -F "file=@document.pdf" \
  -F "type=document" \
  https://your-app.railway.app/api/upload
```

### Generate Image
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_KEY" \
  -d '{
    "prompt": "A sunset over mountains",
    "model": "dall-e-3",
    "size": "1024x1024"
  }' \
  https://your-app.railway.app/api/generate-image
```

## ⚠️ Error Codes

| Code | Error | Solution |
|------|-------|----------|
| 401 | Unauthorized | Check API key |
| 429 | Too Many Requests | Wait 15 minutes or implement backoff |
| 503 | Service Error | Contact admin |

## 🛠️ Quick Setup

### JavaScript
```javascript
const API_KEY = 'wsk_live_YOUR_KEY';
const BASE_URL = 'https://your-app.railway.app';

fetch(`${BASE_URL}/api/chat`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello' }],
    model: 'gpt-4o'
  })
});
```

### Python
```python
import requests

API_KEY = 'wsk_live_YOUR_KEY'
BASE_URL = 'https://your-app.railway.app'

requests.post(
    f'{BASE_URL}/api/chat',
    headers={'x-api-key': API_KEY},
    json={
        'messages': [{'role': 'user', 'content': 'Hello'}],
        'model': 'gpt-4o'
    }
)
```

## 📖 Full Documentation

See [RAILWAY_API_DOCUMENTATION.md](./RAILWAY_API_DOCUMENTATION.md) for complete details.

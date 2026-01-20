# Worksona API Server

REST API wrapper for Worksona.js with file upload support and slash-command style operations.

## Quick Start

### 1. Install Dependencies

```bash
npm install express multer cors helmet express-rate-limit
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Start Server

```bash
node worksona-server.js
```

Server runs on `http://localhost:3000`

## API Overview

### Base URL
```
http://localhost:3000/api
```

### Authentication
Include API key in header:
```bash
curl -H "X-API-Key: your-api-key" http://localhost:3000/api/agents
```

## Endpoints

### 📊 Information

#### `GET /health`
Health check
```bash
curl http://localhost:3000/health
```

#### `GET /api/info`
API information and available endpoints
```bash
curl http://localhost:3000/api/info
```

---

### 🤖 Agent Management

#### `POST /api/agents/load`
Load a new agent
```bash
curl -X POST http://localhost:3000/api/agents/load \
  -H "Content-Type: application/json" \
  -d '{
    "id": "my-agent",
    "name": "My Agent",
    "config": {
      "provider": "openai",
      "model": "gpt-5",
      "temperature": 0.7
    }
  }'
```

#### `GET /api/agents`
List all loaded agents
```bash
curl http://localhost:3000/api/agents
```

#### `POST /api/agents/:agentId/chat`
Chat with an agent
```bash
curl -X POST http://localhost:3000/api/agents/my-agent/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "options": {
      "temperature": 0.7
    }
  }'
```

---

### 🖼️ Image Processing

#### `POST /api/images/analyze`
Analyze an image
```bash
curl -X POST http://localhost:3000/api/images/analyze \
  -F "image=@photo.jpg" \
  -F "prompt=What is in this image?" \
  -F "agentId=vision-agent"
```

#### `POST /api/images/generate`
Generate an image
```bash
curl -X POST http://localhost:3000/api/images/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A sunset over mountains",
    "options": {
      "size": "1024x1024",
      "quality": "hd"
    }
  }'
```

---

### 📄 Document Processing

#### `POST /api/documents/ocr`
Extract text from image (OCR)
```bash
curl -X POST http://localhost:3000/api/documents/ocr \
  -F "file=@document.jpg" \
  -F "language=eng"
```

#### `POST /api/documents/analyze`
Analyze document content
```bash
curl -X POST http://localhost:3000/api/documents/analyze \
  -F "file=@contract.pdf" \
  -F "task=summarize"
```

---

### ⚡ Slash Commands (Quick Operations)

#### `POST /api/slash/ocr`
Quick OCR
```bash
curl -X POST http://localhost:3000/api/slash/ocr \
  -F "file=@image.jpg"
```

#### `POST /api/slash/summarize`
Quick document summarization
```bash
curl -X POST http://localhost:3000/api/slash/summarize \
  -F "file=@document.pdf"
```

#### `POST /api/slash/translate`
Quick translation
```bash
curl -X POST http://localhost:3000/api/slash/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "to": "spanish"
  }'
```

#### `POST /api/slash/extract-data`
Extract structured data from documents
```bash
curl -X POST http://localhost:3000/api/slash/extract-data \
  -F "file=@invoice.pdf" \
  -F "schema=invoice"
```

## Usage Examples

### JavaScript/Node.js

```javascript
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// OCR Example
async function ocrImage(imagePath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(imagePath));

  const response = await fetch('http://localhost:3000/api/slash/ocr', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  console.log(result.data.text);
}

// Chat Example
async function chatWithAgent(message) {
  const response = await fetch('http://localhost:3000/api/agents/my-agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const result = await response.json();
  console.log(result.data.result);
}

// Generate Image Example
async function generateImage(prompt) {
  const response = await fetch('http://localhost:3000/api/images/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  const result = await response.json();
  console.log('Image URL:', result.data.imageUrl);
}
```

### Python

```python
import requests

# OCR Example
def ocr_image(image_path):
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post('http://localhost:3000/api/slash/ocr', files=files)
        result = response.json()
        return result['data']['text']

# Chat Example
def chat_with_agent(message):
    data = {'message': message}
    response = requests.post(
        'http://localhost:3000/api/agents/my-agent/chat',
        json=data
    )
    result = response.json()
    return result['data']['result']

# Analyze Image
def analyze_image(image_path, prompt):
    with open(image_path, 'rb') as f:
        files = {'image': f}
        data = {'prompt': prompt}
        response = requests.post(
            'http://localhost:3000/api/images/analyze',
            files=files,
            data=data
        )
        result = response.json()
        return result['data']['result']
```

### cURL Examples

```bash
# Load an agent
curl -X POST http://localhost:3000/api/agents/load \
  -H "Content-Type: application/json" \
  -d '{
    "id": "analyst",
    "config": {
      "provider": "anthropic",
      "model": "claude-opus-4-5-20251101"
    }
  }'

# OCR an image
curl -X POST http://localhost:3000/api/slash/ocr \
  -F "file=@receipt.jpg"

# Analyze a document
curl -X POST http://localhost:3000/api/documents/analyze \
  -F "file=@contract.pdf" \
  -F "task=summarize" \
  -F "agentId=analyst"

# Extract data from invoice
curl -X POST http://localhost:3000/api/slash/extract-data \
  -F "file=@invoice.pdf" \
  -F "schema=invoice"

# Translate text
curl -X POST http://localhost:3000/api/slash/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "to": "french"}'

# Generate image
curl -X POST http://localhost:3000/api/images/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A serene lake at sunset"}'
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "result": "Response content",
    "metadata": {
      "duration": 1250,
      "timestamp": "2026-01-18T12:00:00Z",
      "model": "gpt-4o"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 3000
CMD ["node", "worksona-server.js"]
```

```bash
docker build -t worksona-api .
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  worksona-api
```

### Cloud Run (Google Cloud)

```bash
gcloud run deploy worksona-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=$OPENAI_API_KEY
```

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## Security

### Production Recommendations

1. **Enable API Key Authentication**
   ```javascript
   // Uncomment in worksona-server.js:
   app.use('/api', authenticateAPIKey);
   ```

2. **Use HTTPS**
   - Deploy behind reverse proxy (nginx, Caddy)
   - Use cloud provider's SSL/TLS

3. **Rate Limiting**
   - Already configured (100 requests per 15 minutes)
   - Adjust in code as needed

4. **File Validation**
   - File type checking enabled
   - Size limits enforced (10MB default)

5. **Environment Variables**
   - Never commit .env to git
   - Use secrets management in production

## Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### Agent Status
```bash
curl http://localhost:3000/api/agents | jq
```

### Logs
Server logs to console. In production, use:
- PM2 for process management
- Winston for structured logging
- Sentry for error tracking

## Troubleshooting

### Server won't start
- Check if port 3000 is available
- Verify API keys in .env
- Check file permissions on uploads directory

### File upload fails
- Check file size (must be < 10MB)
- Verify file type is allowed
- Ensure uploads directory exists and is writable

### API key errors
- Verify API keys are correct
- Check provider account has credits
- Ensure .env file is loaded

## Performance Tips

1. **Use appropriate models**
   - gpt-5-nano for simple tasks
   - gpt-4o for complex analysis
   - Claude Sonnet 4.5 for long-form content

2. **Cache responses**
   - Implement Redis caching for repeated queries
   - Use CDN for generated images

3. **Async processing**
   - For large files, use job queue (Bull, BullMQ)
   - Return job ID, poll for results

4. **Load balancing**
   - Use PM2 cluster mode
   - Deploy multiple instances

## License

MIT - See main Worksona.js LICENSE file

## Support

- Issues: https://github.com/worksona/worksona-js/issues
- Documentation: See API_DESIGN.md
- Main Library: See README.md

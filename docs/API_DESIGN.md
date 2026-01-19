# Worksona.js API Layer Design

**Version:** 0.3.0 (Proposed)
**Date:** 2026-01-18
**Purpose:** Enable REST-like endpoint access with file uploads and parameter handling

## Overview

Transform worksona.js from a JavaScript library into a dual-mode system:
1. **Library Mode** - Current usage (import/require)
2. **API Server Mode** - HTTP endpoints with file handling

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│  (Web Apps, Mobile Apps, CLI Tools, Other Services)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Worksona API Server                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  REST API Layer (Express/Fastify/Hono)              │   │
│  │  • Authentication & Rate Limiting                    │   │
│  │  • File Upload Handling (multipart/form-data)       │   │
│  │  • Request Validation & Sanitization                │   │
│  │  • Response Formatting (JSON)                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Worksona Core (Current Library)                    │   │
│  │  • Agent Management                                  │   │
│  │  • Provider Integration (OpenAI, Anthropic, Google) │   │
│  │  • Image Processing                                  │   │
│  │  • Event System                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  File Processing Layer                               │   │
│  │  • OCR (Tesseract, Cloud Vision API)               │   │
│  │  • Document Parsing (PDF, DOCX, XLSX)              │   │
│  │  • Audio Transcription (Whisper API)               │   │
│  │  • Image Format Conversion                          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              External AI Provider APIs                       │
│       (OpenAI, Anthropic, Google, etc.)                     │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### 1. Core Agent Operations

#### `POST /api/agents/load`
Load an agent from configuration
```json
{
  "id": "ocr-agent",
  "name": "OCR Specialist",
  "config": {
    "provider": "openai",
    "model": "gpt-4o",
    "temperature": 0.3
  }
}
```

#### `POST /api/agents/:agentId/chat`
Send text message to agent
```json
{
  "message": "Explain quantum computing",
  "options": {
    "temperature": 0.7,
    "maxTokens": 500
  }
}
```

#### `GET /api/agents`
List all loaded agents

#### `DELETE /api/agents/:agentId`
Remove an agent

---

### 2. Image Processing Endpoints

#### `POST /api/images/analyze`
Analyze an image with AI
```bash
curl -X POST http://localhost:3000/api/images/analyze \
  -F "image=@photo.jpg" \
  -F "agentId=vision-agent" \
  -F "prompt=What's in this image?"
```

Response:
```json
{
  "success": true,
  "result": "This image shows a sunset over mountains...",
  "metadata": {
    "model": "gpt-4o",
    "duration": 1250,
    "timestamp": "2026-01-18T12:00:00Z"
  }
}
```

#### `POST /api/images/generate`
Generate image from text prompt
```json
{
  "agentId": "image-gen-agent",
  "prompt": "A futuristic cityscape at sunset",
  "options": {
    "size": "1024x1024",
    "quality": "hd"
  }
}
```

#### `POST /api/images/edit`
Edit an existing image
```bash
curl -X POST http://localhost:3000/api/images/edit \
  -F "image=@original.jpg" \
  -F "mask=@mask.png" \
  -F "prompt=Add a rainbow in the sky" \
  -F "agentId=editor-agent"
```

---

### 3. Document Processing Endpoints

#### `POST /api/documents/ocr`
Extract text from images using OCR
```bash
curl -X POST http://localhost:3000/api/documents/ocr \
  -F "file=@document.jpg" \
  -F "language=eng" \
  -F "agentId=ocr-agent"
```

Response:
```json
{
  "success": true,
  "text": "Extracted text content...",
  "confidence": 0.95,
  "metadata": {
    "pages": 1,
    "language": "eng",
    "processingTime": 850
  }
}
```

#### `POST /api/documents/parse`
Parse structured documents (PDF, DOCX, XLSX)
```bash
curl -X POST http://localhost:3000/api/documents/parse \
  -F "file=@report.pdf" \
  -F "agentId=doc-agent" \
  -F "outputFormat=markdown"
```

Response:
```json
{
  "success": true,
  "content": "# Document Title\n\nContent...",
  "format": "markdown",
  "metadata": {
    "pages": 5,
    "wordCount": 1250,
    "fileSize": 245678
  }
}
```

#### `POST /api/documents/analyze`
Analyze document content with AI
```bash
curl -X POST http://localhost:3000/api/documents/analyze \
  -F "file=@contract.docx" \
  -F "agentId=legal-agent" \
  -F "task=summarize"
```

---

### 4. Audio Processing Endpoints

#### `POST /api/audio/transcribe`
Transcribe audio to text
```bash
curl -X POST http://localhost:3000/api/audio/transcribe \
  -F "file=@meeting.mp3" \
  -F "agentId=transcribe-agent" \
  -F "language=en"
```

Response:
```json
{
  "success": true,
  "transcription": "Full transcription text...",
  "duration": 125.5,
  "language": "en",
  "segments": [
    {
      "start": 0.0,
      "end": 5.2,
      "text": "Hello everyone..."
    }
  ]
}
```

#### `POST /api/audio/analyze`
Analyze audio content with AI
```bash
curl -X POST http://localhost:3000/api/audio/analyze \
  -F "file=@call.wav" \
  -F "agentId=sentiment-agent" \
  -F "task=sentiment_analysis"
```

---

### 5. Slash Command Style Endpoints

#### `POST /api/slash/ocr`
Quick OCR operation
```bash
curl -X POST http://localhost:3000/api/slash/ocr \
  -F "file=@image.jpg"
```

#### `POST /api/slash/summarize`
Quick document summarization
```bash
curl -X POST http://localhost:3000/api/slash/summarize \
  -F "file=@article.pdf"
```

#### `POST /api/slash/translate`
Quick translation
```bash
curl -X POST http://localhost:3000/api/slash/translate \
  -F "text=Hello world" \
  -F "to=spanish"
```

#### `POST /api/slash/extract-data`
Extract structured data from documents
```bash
curl -X POST http://localhost:3000/api/slash/extract-data \
  -F "file=@invoice.pdf" \
  -F "schema=invoice"
```

---

## Implementation Options

### Option 1: Node.js + Express (Recommended)

**Pros:**
- Most popular, extensive ecosystem
- Great middleware support
- Easy to deploy

**Stack:**
```javascript
// worksona-server.js
const express = require('express');
const multer = require('multer');
const Worksona = require('./worksona.js');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Initialize Worksona
const worksona = new Worksona({
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.post('/api/images/analyze', upload.single('image'), async (req, res) => {
  try {
    const { agentId, prompt } = req.body;
    const imageBuffer = req.file.buffer;
    const imageUrl = await uploadToStorage(imageBuffer);

    const result = await worksona.processImage(agentId, imageUrl, { prompt });

    res.json({
      success: true,
      result,
      metadata: {
        model: worksona.getAgent(agentId).config.model,
        duration: Date.now() - req.startTime
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => console.log('Worksona API running on port 3000'));
```

### Option 2: Cloudflare Workers + Hono

**Pros:**
- Serverless, auto-scaling
- Edge deployment (low latency)
- Cost-effective

**Stack:**
```javascript
// worker.js
import { Hono } from 'hono';
import Worksona from './worksona.js';

const app = new Hono();

app.post('/api/images/analyze', async (c) => {
  const formData = await c.req.formData();
  const image = formData.get('image');
  const agentId = formData.get('agentId');

  const worksona = new Worksona({
    apiKeys: {
      openai: c.env.OPENAI_API_KEY
    }
  });

  const result = await worksona.processImage(agentId, image);
  return c.json({ success: true, result });
});

export default app;
```

### Option 3: Python FastAPI (Alternative)

**Pros:**
- Easy integration with Python AI/ML tools
- Auto-generated API docs
- Strong typing

**Stack:**
```python
# main.py
from fastapi import FastAPI, UploadFile, File
from worksona_py import Worksona  # Python binding

app = FastAPI()
worksona = Worksona(api_keys={"openai": os.getenv("OPENAI_API_KEY")})

@app.post("/api/images/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    agent_id: str = "vision-agent",
    prompt: str = "Analyze this image"
):
    contents = await file.read()
    result = await worksona.process_image(agent_id, contents, {"prompt": prompt})
    return {"success": True, "result": result}
```

---

## File Processing Integrations

### OCR Integration
```javascript
// ocr-processor.js
const Tesseract = require('tesseract.js');
const { createWorker } = Tesseract;

async function performOCR(imageBuffer, language = 'eng') {
  const worker = await createWorker(language);
  const { data: { text, confidence } } = await worker.recognize(imageBuffer);
  await worker.terminate();

  return {
    text,
    confidence,
    language
  };
}
```

### Document Parsing
```javascript
// document-parser.js
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');

async function parseDocument(fileBuffer, fileType) {
  switch (fileType) {
    case 'pdf':
      const pdfData = await pdf(fileBuffer);
      return { text: pdfData.text, pages: pdfData.numpages };

    case 'docx':
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return { text: result.value };

    case 'xlsx':
      const workbook = xlsx.read(fileBuffer);
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      return { data };
  }
}
```

### Audio Transcription
```javascript
// transcription-service.js
async function transcribeAudio(audioBuffer, options = {}) {
  // Using OpenAI Whisper API
  const formData = new FormData();
  formData.append('file', audioBuffer, 'audio.mp3');
  formData.append('model', 'whisper-1');
  formData.append('language', options.language || 'en');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: formData
  });

  return await response.json();
}
```

---

## Authentication & Security

### API Key Authentication
```javascript
// auth-middleware.js
function authenticateAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || !isValidAPIKey(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  req.userId = getUserFromAPIKey(apiKey);
  next();
}

app.use('/api', authenticateAPIKey);
```

### Rate Limiting
```javascript
// rate-limiter.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api', limiter);
```

### File Size Limits
```javascript
// file-upload-config.js
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

---

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    "result": "Analysis result...",
    "metadata": {
      "model": "gpt-4o",
      "duration": 1250,
      "timestamp": "2026-01-18T12:00:00Z",
      "tokens": 245
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_FORMAT",
    "message": "Unsupported file format",
    "details": {
      "allowedFormats": ["jpg", "png", "pdf"]
    }
  }
}
```

---

## Client SDKs

### JavaScript/TypeScript SDK
```typescript
// worksona-client.ts
import { WorksonaClient } from 'worksona-client';

const client = new WorksonaClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.worksona.com'
});

// OCR
const ocrResult = await client.ocr('path/to/image.jpg');

// Analyze image
const analysis = await client.analyzeImage('image.jpg', {
  prompt: 'What is in this image?'
});

// Generate image
const imageUrl = await client.generateImage('A sunset over mountains');

// Parse document
const document = await client.parseDocument('report.pdf');
```

### Python SDK
```python
# worksona_client.py
from worksona import WorksonaClient

client = WorksonaClient(api_key="your-api-key")

# OCR
result = client.ocr("image.jpg")

# Analyze image
analysis = client.analyze_image("image.jpg", prompt="What is in this image?")

# Generate image
image_url = client.generate_image("A sunset over mountains")
```

### cURL Examples
```bash
# OCR
curl -X POST https://api.worksona.com/api/slash/ocr \
  -H "X-API-Key: your-api-key" \
  -F "file=@document.jpg"

# Analyze document
curl -X POST https://api.worksona.com/api/documents/analyze \
  -H "X-API-Key: your-api-key" \
  -F "file=@contract.pdf" \
  -F "task=summarize"

# Generate image
curl -X POST https://api.worksona.com/api/images/generate \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A futuristic city",
    "size": "1024x1024"
  }'
```

---

## Deployment Options

### 1. Docker Container
```dockerfile
# Dockerfile
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

### 2. Serverless (AWS Lambda + API Gateway)
```javascript
// lambda-handler.js
const serverless = require('serverless-http');
const app = require('./worksona-server');

module.exports.handler = serverless(app);
```

### 3. Cloud Run (Google Cloud)
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/worksona-api', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/worksona-api']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', 'worksona-api',
           '--image', 'gcr.io/$PROJECT_ID/worksona-api',
           '--platform', 'managed',
           '--region', 'us-central1']
```

---

## Usage Examples

### Example 1: OCR + AI Analysis Pipeline
```javascript
// Extract text from image, then analyze with AI
const ocrResult = await fetch('http://localhost:3000/api/documents/ocr', {
  method: 'POST',
  body: formData // contains image file
});

const { text } = await ocrResult.json();

// Analyze extracted text
const analysis = await fetch('http://localhost:3000/api/agents/analyst/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: `Analyze this text: ${text}`
  })
});
```

### Example 2: Multi-Step Document Processing
```javascript
// 1. Parse PDF
const parsed = await client.parseDocument('invoice.pdf');

// 2. Extract structured data
const extracted = await client.chat('data-extractor', {
  message: `Extract invoice data: ${parsed.text}`,
  format: 'json'
});

// 3. Validate and store
const validated = validateInvoiceData(extracted);
await storeInDatabase(validated);
```

### Example 3: Image Analysis + Generation
```javascript
// Analyze user's image
const analysis = await client.analyzeImage('photo.jpg', {
  prompt: 'Describe the style and mood'
});

// Generate similar image
const newImage = await client.generateImage(
  `Create an image with this style: ${analysis}`
);
```

---

## Benefits

### For Developers
✅ Simple REST API - no SDK required
✅ File upload support - handle any file type
✅ Slash commands - quick operations
✅ Language agnostic - use from any platform
✅ Auto-scaling - serverless deployment ready

### For Applications
✅ OCR as a service
✅ Document analysis pipeline
✅ Image generation API
✅ Audio transcription
✅ Multi-modal AI operations

### For Businesses
✅ Rapid prototyping
✅ Easy integration
✅ Cost-effective (pay per use)
✅ Scalable infrastructure
✅ Multi-tenant support

---

## Next Steps

1. **Phase 1: Core API** (Week 1-2)
   - Basic Express server
   - File upload handling
   - Core endpoints (chat, image)

2. **Phase 2: File Processing** (Week 3-4)
   - OCR integration
   - Document parsing
   - Audio transcription

3. **Phase 3: Slash Commands** (Week 5)
   - Quick operation endpoints
   - Pre-configured agents
   - Common use cases

4. **Phase 4: Client SDKs** (Week 6-7)
   - JavaScript/TypeScript SDK
   - Python SDK
   - Documentation

5. **Phase 5: Deployment** (Week 8)
   - Docker images
   - Serverless configs
   - Production hardening

---

## Cost Estimation

### Infrastructure Costs (Monthly)
- **Serverless (AWS Lambda):** ~$20-50 for 1M requests
- **Container (Cloud Run):** ~$50-100 for moderate traffic
- **Traditional VPS:** ~$10-30 for DigitalOcean/Linode

### AI API Costs (Per 1000 Operations)
- **GPT-4o:** ~$5-10
- **Claude Opus 4.5:** ~$15-30
- **OCR (Tesseract):** Free (self-hosted)
- **Whisper API:** ~$0.006/minute

### Total Estimated Cost
- **Small app (10K requests/month):** $50-100/month
- **Medium app (100K requests/month):** $200-500/month
- **Large app (1M requests/month):** $1000-2000/month

---

## Conclusion

This API layer transforms Worksona.js from a library into a full-service AI platform. By adding REST endpoints with file processing capabilities, you enable:

1. **Easy Integration** - Any language, any platform
2. **File Operations** - OCR, document parsing, transcription
3. **Slash Commands** - Quick, common operations
4. **Scalability** - Serverless or containerized
5. **Multi-tenancy** - API key authentication

The architecture is flexible, allowing deployment as:
- Standalone server
- Serverless functions
- Docker containers
- Edge workers

This makes Worksona.js the perfect foundation for building AI-powered applications with minimal complexity.

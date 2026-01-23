# Worksona Server Features and Capabilities

**Version:** 0.3.0-alpha  
**Last Updated:** January 2026

## Overview

Worksona Server is a REST API wrapper for Worksona.js that provides HTTP endpoints for agent management, chat, image processing, document analysis, and more. It includes file upload support, batch processing, webhook integrations, and a comprehensive tool system.

## Key Features

### 🚀 Core Capabilities

- **REST API**: Full RESTful API for all Worksona.js functionality
- **File Upload Support**: Upload and process images, documents, and text files
- **Batch Processing**: Process multiple queries in parallel
- **Agent Auto-Loading**: Automatically loads agents from `agents/` directory on startup
- **Webhook Integration**: Send webhook events for agent actions
- **Tool System**: Built-in tools for DALL-E, web scraping, and text-to-speech
- **Document Processing**: OCR, parsing, and analysis for PDFs, DOCX, XLSX, and more
- **Slash Commands**: Quick operations like `/ocr`, `/summarize`, `/translate`
- **Rate Limiting**: Built-in rate limiting for API protection
- **Security**: Helmet.js security headers and CORS support
- **Static File Serving**: Serves documentation and demo pages

---

## Server Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
PORT=3000
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
API_KEY=your-api-key  # Optional: For API authentication
DEBUG=false
```

### Starting the Server

```bash
node worksona-server.js
```

Server runs on `http://localhost:3000` by default.

---

## API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Response Format

All endpoints return JSON with this structure:

```json
{
  "success": true|false,
  "data": { ... },
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "hint": "Optional hint"
  }
}
```

---

## Information Endpoints

### Health Check

```http
GET /health
```

Returns server health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-19T12:00:00.000Z"
}
```

### API Information

```http
GET /api/info
```

Returns API version, available endpoints, and configured providers.

**Response:**
```json
{
  "name": "Worksona API Server",
  "version": "0.3.0-alpha",
  "endpoints": {
    "agents": [...],
    "images": [...],
    "documents": [...],
    "slash": [...]
  },
  "providers": {
    "openai": true,
    "anthropic": true,
    "google": false
  }
}
```

---

## Agent Management Endpoints

### Load Agent

```http
POST /api/agents/load
Content-Type: application/json

{
  "id": "my-agent",
  "name": "My Agent",
  "config": {
    "provider": "openai",
    "model": "gpt-5",
    "temperature": 0.7
  }
}
```

Loads a new agent into the system.

**Response:**
```json
{
  "success": true,
  "data": {
    "agent": {
      "id": "my-agent",
      "name": "My Agent",
      "config": { ... }
    }
  }
}
```

### List All Agents

```http
GET /api/agents
```

Returns all loaded agents.

**Response:**
```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "id": "agent-1",
        "name": "Agent 1",
        "config": { ... }
      }
    ],
    "count": 1
  }
}
```

### Get Agent Details

```http
GET /api/agents/:agentId
```

Returns details for a specific agent.

**Response:**
```json
{
  "success": true,
  "data": {
    "agent": { ... },
    "metrics": { ... },
    "state": { ... }
  }
}
```

### Delete Agent

```http
DELETE /api/agents/:agentId
```

Removes an agent from the system.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Agent removed"
  }
}
```

---

## Chat Endpoints

### Agent Chat (POST)

```http
POST /api/agents/:agentId/chat
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "options": {
    "temperature": 0.7,
    "maxTokens": 1000
  }
}
```

Chat with a specific agent.

**Response:**
```json
{
  "success": true,
  "data": {
    "result": "I'm doing well, thank you!",
    "metadata": {
      "agentId": "my-agent",
      "duration": 1234,
      "timestamp": "2026-01-19T12:00:00.000Z"
    }
  }
}
```

### Agent Chat (GET)

```http
GET /api/agents/:agentId/chat?q=Hello&context=user-context
```

Chat with query parameters (alternative to POST).

**Query Parameters:**
- `q`, `query`, or `message` - The message to send
- `context` - Optional context string

---

## Query Endpoints

### Generic Query (GET)

```http
GET /api/query?agent=research-analyst&q=What is AI?&model=gpt-5&temperature=0.7
```

Generic query endpoint that auto-creates agents if needed.

**Query Parameters:**
- `agent` - Agent ID (optional, defaults to `default-query-agent`)
- `q` or `query` - Query text (required)
- `model` - Model override (optional)
- `temperature` - Temperature override (optional)
- `max_tokens` - Max tokens override (optional)

### Generic Query (POST)

```http
POST /api/query
Content-Type: application/json

{
  "agent": "research-analyst",
  "query": "What is AI?",
  "context": "Optional context",
  "options": {
    "model": "gpt-5",
    "temperature": 0.7
  }
}
```

### Agent-Specific Query (GET)

```http
GET /api/agents/:agentId/query?q=What is AI?
```

Query a specific agent.

### Agent-Specific Query (POST)

```http
POST /api/agents/:agentId/query
Content-Type: application/json

{
  "query": "What is AI?",
  "document": "Optional document text",
  "text": "Alternative to query",
  "options": { ... }
}
```

### Batch Query

```http
POST /api/query/batch
Content-Type: application/json

{
  "queries": [
    {
      "agent": "research-analyst",
      "query": "What is quantum computing?"
    },
    {
      "agent": "marketing-agent",
      "query": "Create a tagline"
    }
  ]
}
```

Process multiple queries in parallel (max 10).

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "agent": "research-analyst",
        "query": "What is quantum computing?",
        "answer": "...",
        "duration": 1234
      }
    ],
    "totalDuration": 2345
  }
}
```

---

## Image Endpoints

### Generate Image

```http
POST /api/images/generate
Content-Type: application/json

{
  "agentId": "image-gen-agent",
  "prompt": "A futuristic city at sunset",
  "options": {
    "model": "gpt-image-1.5",
    "size": "1024x1024",
    "quality": "high",
    "output_format": "png",
    "background": "transparent",
    "n": 1
  }
}
```

Generates an image using GPT Image models or DALL-E.

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "data:image/png;base64,...",
    "model": "gpt-image-1.5",
    "metadata": {
      "duration": 2345,
      "size": "1024x1024"
    }
  }
}
```

### Analyze Image

```http
POST /api/images/analyze
Content-Type: multipart/form-data

image: [file]
prompt: "What's in this image?"
agentId: "vision-agent"
```

Analyzes an image using vision models.

**Alternative (JSON with URL):**
```http
POST /api/images/analyze
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg",
  "prompt": "What's in this image?",
  "agentId": "vision-agent"
}
```

### Edit Image

```http
POST /api/images/edit
Content-Type: multipart/form-data

image: [file]
mask: [file] (optional)
prompt: "Add a rainbow"
agentId: "image-agent"
options: {"model": "gpt-image-1", "input_fidelity": 0.8}
```

Edits an image using GPT Image models.

---

## Document Endpoints

### OCR (Text Extraction)

```http
POST /api/documents/ocr
Content-Type: multipart/form-data

file: [file]
```

Extracts text from images or PDFs.

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Extracted text...",
    "metadata": {
      "fileType": "application/pdf",
      "fileName": "document.pdf",
      "characterCount": 1234
    }
  }
}
```

### Parse Document

```http
POST /api/documents/parse
Content-Type: multipart/form-data

file: [file]
```

Parses structured data from documents (tables, lists, etc.).

### Analyze Document

```http
POST /api/documents/analyze
Content-Type: multipart/form-data

file: [file]
prompt: "Summarize this document"
```

Analyzes document content with AI.

---

## Agent Action Endpoints

### Flexible Routing Pattern

The server supports flexible routing for agent actions:

```
/api/agents/:agentId/:action/:object?
```

### Upload File

```http
POST /api/agents/:agentId/upload
Content-Type: multipart/form-data

file: [file]
prompt: "Analyze this file"
```

Uploads and processes a file with an agent.

**Supported File Types:**
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, DOCX, XLSX, XLS, DOC
- Text: TXT, MD, CSV

### Analyze Content

```http
POST /api/agents/:agentId/analyze
Content-Type: multipart/form-data

file: [file]
prompt: "Analyze this"
```

```http
POST /api/agents/:agentId/analyze/image
Content-Type: multipart/form-data

file: [file]
prompt: "Describe this image"
```

```http
POST /api/agents/:agentId/analyze/document
Content-Type: multipart/form-data

file: [file]
prompt: "Summarize this document"
```

### Process Content

```http
POST /api/agents/:agentId/process/document
Content-Type: multipart/form-data

file: [file]
task: "summarize" | "extract" | "translate" | "review" | "improve"
```

Processes content with predefined tasks.

---

## Slash Command Endpoints

Quick operations for common tasks.

### OCR

```http
POST /api/slash/ocr
Content-Type: multipart/form-data

file: [file]
```

### Summarize

```http
POST /api/slash/summarize
Content-Type: application/json

{
  "text": "Long text to summarize..."
}
```

### Translate

```http
POST /api/slash/translate
Content-Type: application/json

{
  "text": "Hello",
  "from": "en",
  "to": "es"
}
```

### Extract Data

```http
POST /api/slash/extract-data
Content-Type: application/json

{
  "text": "Text with data to extract...",
  "schema": {
    "name": "string",
    "email": "string"
  }
}
```

---

## Tool Endpoints

### List Tools

```http
GET /api/tools
```

Returns all available tools.

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 3,
    "tools": [
      {
        "id": "dalle",
        "name": "DALL-E",
        "description": "Image generation",
        "category": "image",
        "actions": ["generate", "edit", "variations"],
        "enabled": true
      }
    ],
    "categories": ["image", "web", "audio"]
  }
}
```

### Get Tool Info

```http
GET /api/tools/:toolName
```

Returns information about a specific tool.

### Execute Tool

```http
GET /api/tools/:toolName/:action?param=value
```

```http
POST /api/tools/:toolName/:action
Content-Type: application/json

{
  "param": "value"
}
```

**Available Tools:**

#### DALL-E
- `GET /api/tools/dalle/generate?prompt=...`
- `POST /api/tools/dalle/generate` with JSON body

#### Web Scraper
- `GET /api/tools/scraper/fetch?url=...`
- `GET /api/tools/scraper/extract?url=...`

#### Text-to-Speech
- `GET /api/tools/tts/speak?text=...&voice=alloy`
- `POST /api/tools/tts/generate` with JSON body

### Agent Tool Access

```http
POST /api/agents/:agentId/tools/:toolName/:action
```

Execute tools in the context of an agent.

---

## Webhook Endpoints

### Send Webhook

```http
POST /api/webhook/:agentId
Content-Type: application/json

{
  "text": "Webhook event",
  "trigger": "manual",
  "data": {
    "key": "value"
  }
}
```

Sends a webhook event for an agent.

---

## Translate Endpoint

### Translate Text

```http
GET /api/translate?text=Hello&from=en&to=es
```

```http
POST /api/translate
Content-Type: application/json

{
  "text": "Hello",
  "from": "en",
  "to": "es"
}
```

Translates text between languages.

---

## Static File Serving

The server serves static files from the `www/` directory:

- `/` - Documentation site (index.html)
- `/docs` - Documentation (backward compatibility)
- `/console` - API console (public/)
- `/public` - Public files (backward compatibility)
- `/demos` - Demo pages
- `/downloads` - Downloadable files

---

## Error Handling

### Error Codes

- `AGENT_NOT_FOUND` - Agent doesn't exist
- `PROVIDER_NOT_CONFIGURED` - API key missing
- `MISSING_QUERY` - Query parameter required
- `MISSING_FILE` - File upload required
- `INVALID_FILE_TYPE` - Unsupported file type
- `TOOL_NOT_FOUND` - Tool doesn't exist
- `TOOL_DISABLED` - Tool is disabled
- `RATE_LIMIT_EXCEEDED` - Too many requests

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "hint": "Optional hint for resolution"
  }
}
```

---

## Rate Limiting

Rate limiting is applied to all `/api/*` endpoints:

- **Window:** 15 minutes
- **Max Requests:** 100 per window
- **Response:** 429 status with error message

---

## Security Features

### Helmet.js

Security headers are automatically applied:
- Content Security Policy (CSP)
- XSS Protection
- Frame Options
- HSTS

### CORS

CORS is enabled by default. Configure in code if needed.

### API Key Authentication (Optional)

Uncomment the authentication middleware to enable:

```javascript
// app.use('/api', authenticateAPIKey);
```

---

## Agent Auto-Loading

Agents are automatically loaded from the `agents/` directory on server startup:

1. Server scans `agents/*.json` files
2. Each JSON file should contain an agent configuration
3. Agents are loaded and ready to use immediately

**Example agent file (`agents/my-agent.json`):**
```json
{
  "id": "my-agent",
  "name": "My Agent",
  "config": {
    "provider": "openai",
    "model": "gpt-5",
    "temperature": 0.7
  }
}
```

---

## Usage Examples

### cURL Examples

**Chat with agent:**
```bash
curl -X POST http://localhost:3000/api/agents/research-analyst/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is AI?"}'
```

**Generate image:**
```bash
curl -X POST http://localhost:3000/api/images/generate \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "image-agent",
    "prompt": "A sunset over mountains",
    "options": {
      "model": "gpt-image-1.5",
      "size": "1024x1024"
    }
  }'
```

**Upload and analyze file:**
```bash
curl -X POST http://localhost:3000/api/agents/research-analyst/upload \
  -F "file=@document.pdf" \
  -F "prompt=Summarize this document"
```

**Batch query:**
```bash
curl -X POST http://localhost:3000/api/query/batch \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      {"agent": "research-analyst", "query": "What is AI?"},
      {"agent": "marketing-agent", "query": "Create a tagline"}
    ]
  }'
```

### JavaScript Examples

**Using fetch:**
```javascript
// Chat
const response = await fetch('http://localhost:3000/api/agents/my-agent/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello!',
    options: { temperature: 0.7 }
  })
});

const data = await response.json();
console.log(data.data.result);

// Generate image
const imageResponse = await fetch('http://localhost:3000/api/images/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentId: 'image-agent',
    prompt: 'A futuristic city',
    options: {
      model: 'gpt-image-1.5',
      size: '1024x1024'
    }
  })
});

const imageData = await imageResponse.json();
console.log(imageData.data.imageUrl);
```

---

## Best Practices

1. **Error Handling**: Always check `success` field and handle errors appropriately
2. **Rate Limiting**: Implement client-side rate limiting to avoid 429 errors
3. **File Uploads**: Use multipart/form-data for file uploads, not JSON
4. **Agent Management**: Load agents at startup or use auto-loading from directory
5. **Security**: Never expose API keys in client-side code
6. **Batch Processing**: Use batch endpoints for multiple queries to improve efficiency
7. **Webhooks**: Use webhooks for async processing and notifications

---

## Version History

- **0.3.0-alpha** - Current version with comprehensive API
- **0.2.0** - Initial server release

---

## License

See LICENSE file for details.

# Agent-Scoped URL Routing Guide

## Overview

The Worksona API Server now supports intuitive, command-style URL routing that allows you to scope operations to specific agents using clean, RESTful paths.

## URL Pattern

```
/api/agents/:agentId/:action/:object?
```

- **`:agentId`** - The ID of the agent to use
- **`:action`** - The action to perform (upload, chat, analyze, process)
- **`:object`** - Optional object type (document, image, text)

## Available Actions

### 1. **Upload** - Upload and analyze files
### 2. **Chat** - Send messages to an agent
### 3. **Analyze** - Deep analysis of content
### 4. **Process** - Process content with specific tasks

---

## 1. Upload Action

Upload files to a specific agent for analysis.

**Endpoint:** `POST /api/agents/:agentId/upload`

**Parameters:**
- `prompt` (query/form) - Optional analysis prompt
- `context` (query/form) - Optional context for the analysis
- `task` (query/form) - Optional task type (analyze, summarize, extract)
- `file` (form) - The file to upload

**Example:**
```bash
curl -X POST \
  "http://localhost:3000/api/agents/legal-agent/upload?prompt=Review%20for%20legal%20issues&context=contract" \
  -F "file=@contract.docx"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": "Analysis result...",
    "agent": "legal-agent",
    "extractedText": "Document preview...",
    "metadata": {
      "duration": 2500,
      "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "fileName": "contract.docx",
      "fileSize": 45000,
      "characterCount": 3500,
      "processingMethod": "text-extraction"
    }
  }
}
```

---

## 2. Chat Action

Send text messages to an agent via URL parameters.

**Endpoint:** `GET /api/agents/:agentId/chat`

**Parameters:**
- `q` OR `query` OR `message` (required) - The message to send
- `context` (optional) - Additional context

**Examples:**
```bash
# Simple query
curl "http://localhost:3000/api/agents/marketing-agent/chat?q=What%20is%20brand%20positioning"

# With context
curl "http://localhost:3000/api/agents/legal-agent/chat?q=Explain%20liability&context=small%20business"
```

**Response:**
```json
{
  "success": true,
  "query": "What is brand positioning",
  "answer": "Brand positioning is...",
  "agent": {
    "id": "marketing-agent",
    "name": "Emma",
    "model": "gpt-4o"
  },
  "metadata": {
    "duration": 1500,
    "timestamp": "2026-01-19T07:34:55.874Z"
  }
}
```

---

## 3. Analyze Action

Perform deep analysis on files, text, or URLs.

**Endpoints:**
- `POST /api/agents/:agentId/analyze` - Analyze without specifying object type
- `POST /api/agents/:agentId/analyze/:object` - Analyze specific object (document, image, text)

**Parameters:**
- `prompt` (query/body) - Analysis prompt
- `file` (form) - File to analyze (multipart)
- `text` (body) - Text to analyze (JSON)
- `url` (body/query) - URL to analyze (not yet implemented)

**Examples:**

### Analyze File
```bash
curl -X POST \
  "http://localhost:3000/api/agents/research-analyst/analyze/document?prompt=Extract%20key%20findings" \
  -F "file=@research-paper.pdf"
```

### Analyze Text
```bash
curl -X POST \
  "http://localhost:3000/api/agents/prd-editor-agent/analyze/text?prompt=Review%20this%20spec" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Feature: User authentication\nRequirements: OAuth2, JWT tokens"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": "Detailed analysis...",
    "agent": "research-analyst",
    "metadata": {
      "duration": 3000,
      "object": "document",
      "fileType": "application/pdf",
      "fileName": "research-paper.pdf",
      "characterCount": 5000
    }
  }
}
```

---

## 4. Process Action

Process content with specific predefined tasks.

**Endpoint:** `POST /api/agents/:agentId/process/:object`

**Parameters:**
- `task` (query/body) - The processing task (summarize, extract, translate, review, improve)
- `file` (form) - File to process
- `text` (body) - Text to process

**Available Tasks:**
- `summarize` - Provide a concise summary
- `extract` - Extract key information and structured data
- `translate` - Translate the content
- `review` - Review and critique
- `improve` - Suggest improvements

**Examples:**

### Summarize Document
```bash
curl -X POST \
  "http://localhost:3000/api/agents/research-analyst/process/document?task=summarize" \
  -F "file=@meeting-notes.md"
```

### Extract Data
```bash
curl -X POST \
  "http://localhost:3000/api/agents/marketing-agent/process/data?task=extract" \
  -F "file=@sales-report.xlsx"
```

### Review Text
```bash
curl -X POST \
  "http://localhost:3000/api/agents/prd-editor-agent/process/text?task=review" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Product requirements document content..."
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "result": "Summary: The document discusses...",
    "agent": "research-analyst",
    "task": "summarize",
    "object": "document",
    "extractedText": "Document preview...",
    "metadata": {
      "duration": 2000,
      "fileType": "text/markdown",
      "fileName": "meeting-notes.md",
      "characterCount": 1200
    }
  }
}
```

---

## Supported File Formats

All upload-based endpoints support these formats:

### Documents
- **Word**: `.docx`, `.doc`
- **Excel**: `.xlsx`, `.xls`
- **PDF**: `.pdf`

### Text
- **Plain Text**: `.txt`
- **Markdown**: `.md`
- **CSV**: `.csv`

### Images
- **Formats**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

---

## Agent List

To see available agents:

```bash
curl http://localhost:3000/api/agents
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5,
    "agents": [
      {
        "id": "legal-agent",
        "name": "James",
        "description": "Legal consultant specializing in business law",
        "provider": "openai",
        "model": "gpt-4o"
      },
      {
        "id": "marketing-agent",
        "name": "Emma",
        "description": "Marketing strategist",
        "provider": "openai",
        "model": "gpt-4o"
      }
      // ... more agents
    ]
  }
}
```

---

## Complete Examples

### 1. Legal Document Review
```bash
# Upload contract for legal review with specific context
curl -X POST \
  "http://localhost:3000/api/agents/legal-agent/upload?prompt=Review%20for%20compliance%20issues&context=employment%20contract" \
  -F "file=@employment-agreement.docx"
```

### 2. Marketing Data Analysis
```bash
# Analyze CSV data for marketing insights
curl -X POST \
  "http://localhost:3000/api/agents/marketing-agent/upload?prompt=Analyze%20for%20campaign%20opportunities&context=Q4%20performance" \
  -F "file=@customer-data.csv"
```

### 3. Research Document Summarization
```bash
# Summarize research paper
curl -X POST \
  "http://localhost:3000/api/agents/research-analyst/process/document?task=summarize" \
  -F "file=@research-paper.pdf"
```

### 4. PRD Review
```bash
# Get feedback on product requirements
curl -X POST \
  "http://localhost:3000/api/agents/prd-editor-agent/analyze/text?prompt=Review%20and%20suggest%20improvements" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Product: AI Assistant\nFeatures: Chat, File Upload, Multi-agent Support"
  }'
```

### 5. Quick Chat
```bash
# Ask a quick question
curl "http://localhost:3000/api/agents/legal-agent/chat?q=What%20is%20force%20majeure"
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Agent marketing-agent not found. Available: legal-agent, research-analyst, ..."
  }
}
```

**Common Error Codes:**
- `AGENT_NOT_FOUND` - Specified agent doesn't exist
- `MISSING_FILE` - File required but not provided
- `MISSING_MESSAGE` - Message/query required but not provided
- `MISSING_CONTENT` - No file, text, or URL provided
- `UNSUPPORTED_FORMAT` - File format not supported
- `UPLOAD_ERROR` - Error during file upload/processing
- `CHAT_ERROR` - Error during chat operation
- `ANALYZE_ERROR` - Error during analysis
- `PROCESS_ERROR` - Error during processing

---

## Tips & Best Practices

1. **Use Context**: Add `context` parameter to provide additional background that helps the agent understand the domain
2. **Choose the Right Agent**: Select agents based on their specialization (legal for contracts, marketing for campaigns, etc.)
3. **Specific Prompts**: More specific prompts yield better results
4. **File Formats**: Text-based formats (DOCX, XLSX, MD, TXT, CSV) are extracted and sent as text to the LLM for better accuracy and lower cost
5. **Image Processing**: Images use vision APIs which are more expensive but can analyze visual content

---

## JavaScript/TypeScript Examples

```javascript
// Upload with FormData
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch(
  'http://localhost:3000/api/agents/legal-agent/upload?prompt=Review%20contract&context=SaaS',
  {
    method: 'POST',
    body: formData
  }
);

const data = await response.json();
console.log(data.data.analysis);
```

```javascript
// Chat with agent
const response = await fetch(
  `http://localhost:3000/api/agents/marketing-agent/chat?q=${encodeURIComponent('Brand strategy tips')}`
);

const data = await response.json();
console.log(data.answer);
```

```javascript
// Analyze text
const response = await fetch(
  'http://localhost:3000/api/agents/prd-editor-agent/analyze/text?prompt=Review',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'Product requirements document...'
    })
  }
);

const data = await response.json();
console.log(data.data.analysis);
```

---

## Python Examples

```python
import requests

# Upload file
with open('document.docx', 'rb') as f:
    response = requests.post(
        'http://localhost:3000/api/agents/legal-agent/upload',
        params={'prompt': 'Review for legal issues', 'context': 'contract'},
        files={'file': f}
    )
    print(response.json()['data']['analysis'])

# Chat
response = requests.get(
    'http://localhost:3000/api/agents/marketing-agent/chat',
    params={'q': 'What is brand positioning?'}
)
print(response.json()['answer'])

# Analyze text
response = requests.post(
    'http://localhost:3000/api/agents/research-analyst/analyze/text',
    params={'prompt': 'Summarize key points'},
    json={'text': 'Research findings...'}
)
print(response.json()['data']['analysis'])
```

---

## Migration from Old Endpoints

### Old Style:
```bash
POST /api/documents/analyze
-F "file=@doc.pdf"
-F "agent=legal-agent"
-F "prompt=analyze"
```

### New Style:
```bash
POST /api/agents/legal-agent/upload?prompt=analyze
-F "file=@doc.pdf"
```

**Benefits:**
- ✅ Cleaner URLs
- ✅ Agent-scoped operations
- ✅ More intuitive REST structure
- ✅ Easier to construct programmatically
- ✅ Better for API documentation

---

## Summary

The new agent-scoped routing provides a clean, RESTful API for interacting with specific agents:

```
/api/agents/{agent}/{action}/{object}?{params}
```

This makes it easy to:
- Route requests to specific agents
- Perform different actions (upload, chat, analyze, process)
- Work with different object types (documents, images, text)
- Pass parameters via query strings for clean URLs

All while maintaining full backward compatibility with existing endpoints!

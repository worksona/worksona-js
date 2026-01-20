# Worksona API Web Interface 🎨

## ✅ What's Been Added

### 1. **Agent Auto-Loading System**
- Automatically loads all agents from `agents/` directory on server startup
- Validates agent configurations
- Reports loading success/failures in console

### 2. **Web Interface**
Located at: **http://localhost:3000/**

#### Features:
- ✅ **Server Status Dashboard**: Real-time server and provider status
- ✅ **Agent Browser**: Visual cards for all loaded agents
- ✅ **API Endpoint Tester**: Interactive forms for testing endpoints
  - Simple Query (GET)
  - Agent-Specific Query
  - Batch Processing
  - Translation
  - **File Upload (Images & Text)**
- ✅ **Response Viewer**: Pretty-printed JSON responses with timing
- ✅ **Code Examples**: Auto-generated examples in cURL, JavaScript, Python

### 3. **File Upload Support**
- Upload images (jpg, png, gif, webp)
- Upload documents (txt, pdf, doc, docx)
- Optional agent selection
- Optional custom prompts
- Endpoint: `POST /api/documents/analyze`

## 📁 Directory Structure

```
worksona-js/
├── agents/                        # Agent configurations (auto-loaded)
│   ├── interviewer-agent.json    ✓ Loaded
│   ├── legal-agent.json           ✓ Loaded
│   ├── marketing-agent.json       ✓ Loaded
│   ├── prd-editor-agent.json      ✓ Loaded (fixed)
│   └── research-analyst.json      ✓ Loaded
├── public/                        # Web interface
│   ├── index.html                 # Main UI
│   ├── style.css                  # Dark theme styling
│   └── app.js                     # Frontend logic
└── worksona-server.js             # API server (updated)
```

## 🚀 How to Use

### Access the Web Interface
```bash
# Make sure server is running
node worksona-server.js

# Open in browser
open http://localhost:3000
```

### Add New Agents
Simply add a JSON file to the `agents/` directory and restart the server:

```json
{
  "id": "your-agent-id",
  "name": "Agent Name",
  "description": "What this agent does",
  "config": {
    "provider": "openai",
    "model": "gpt-5",
    "temperature": 0.7,
    "maxTokens": 500,
    "systemPrompt": "You are..."
  }
}
```

**Required fields:**
- `id` - Unique identifier (used in URLs)
- `name` - Display name
- `config.provider` - "openai", "anthropic", or "google"
- `config.model` - Model name

**Optional fields:**
- `description` - Agent description
- `config.temperature` - 0-2 (default: 0.7)
- `config.maxTokens` - Max response tokens
- `config.systemPrompt` - System instructions
- `config.examples` - Few-shot examples

### Upload Files via API

**cURL:**
```bash
curl -X POST http://localhost:3000/api/documents/analyze \
  -F "file=@image.jpg" \
  -F "prompt=Describe this image"
```

**JavaScript:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('prompt', 'Analyze this document');

const response = await fetch('http://localhost:3000/api/documents/analyze', {
  method: 'POST',
  body: formData
});
const data = await response.json();
```

**Python:**
```python
import requests

with open('document.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:3000/api/documents/analyze',
        files={'file': f},
        data={'prompt': 'Summarize this document'}
    )
    print(response.json())
```

## 🎨 Web Interface Features

### 1. Agent Browser
- Visual cards showing all loaded agents
- Click to quick-select for queries
- Shows provider and model for each agent

### 2. Endpoint Tester
Five tabs for different API operations:

#### **Simple Query**
- Quick queries to any model
- Model dropdown with GPT-5, GPT-4o, Claude options

#### **Agent Query**
- Query specific agents by ID
- Dropdown populated with loaded agents
- Uses agent's configured model and settings

#### **Batch Processing**
- Run multiple queries in parallel (max 10)
- One query per line
- Results for all queries returned together

#### **Translate**
- Quick translation endpoint
- Auto-detect source language
- Specify target language

#### **File Upload** ⭐ NEW
- Drag & drop or click to upload
- Supports images and documents
- Optional agent selection
- Optional custom prompt
- Visual feedback during upload

### 3. Response Viewer
- Pretty-printed JSON
- Response timing in milliseconds
- Copy to clipboard button
- Error highlighting

### 4. Code Examples
- Auto-generated based on last request
- Three languages: cURL, JavaScript, Python
- Copy-paste ready
- Updates with each request

## 📊 Server Console Output

When server starts:
```
╔═══════════════════════════════════════════════════════════════╗
║                   WORKSONA API SERVER                         ║
║                      Version 0.3.0                            ║
╠═══════════════════════════════════════════════════════════════╣
║  Status: Running on port 3000                                  ║
║  URL: http://localhost:3000                                    ║
║  Info: http://localhost:3000/api/info                          ║
║  Health: http://localhost:3000/health                          ║
╠═══════════════════════════════════════════════════════════════╣
║  Providers:                                                   ║
║    OpenAI: ✓                                            ║
║    Anthropic: ✓                                         ║
║    Google: ✗                                            ║
╚═══════════════════════════════════════════════════════════════╝

Loading 5 agents from agents/ directory...
  ✓ Loaded: Reporter Thompson (interviewer-agent)
  ✓ Loaded: James (legal-agent)
  ✓ Loaded: Emma (marketing-agent)
  ✓ Loaded: PRD Editor (prd-editor-agent)
  ✓ Loaded: Dr. Chen (research-analyst)
Agent loading complete.
```

## 🔧 Configuration

### Agent JSON Format
```json
{
  "id": "agent-id",              // REQUIRED: URL-safe identifier
  "name": "Agent Name",          // REQUIRED: Display name
  "description": "Description",  // OPTIONAL: Shown in UI
  "config": {                    // REQUIRED
    "provider": "openai",        // REQUIRED: openai|anthropic|google
    "model": "gpt-5",            // REQUIRED: Model name
    "temperature": 0.7,          // OPTIONAL: 0-2
    "maxTokens": 500,            // OPTIONAL: Max response
    "systemPrompt": "...",       // OPTIONAL: Instructions
    "examples": []               // OPTIONAL: Few-shot examples
  }
}
```

### File Upload Configuration
In `worksona-server.js`:
```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 5                     // 5 files max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'audio/mpeg', 'audio/wav', 'audio/ogg'
    ];
    // ...
  }
});
```

## 🎯 Use Cases

### 1. Quick API Testing
Use the web interface to test endpoints before integrating into your app.

### 2. Agent Development
Add agents to `agents/` directory and test them immediately in the web UI.

### 3. Document Processing
Upload images or PDFs for analysis using vision models.

### 4. Multi-Agent Workflows
Test different agents with the same query to compare responses.

### 5. Batch Operations
Process multiple queries efficiently with the batch endpoint.

## 🚨 Troubleshooting

### Agent Not Loading
**Problem**: Agent shows ✗ in console
**Solution**: Check JSON format, ensure `id` and `name` are present

### File Upload Fails
**Problem**: Upload returns error
**Solution**: Check file size (< 10MB) and type (see allowedTypes)

### Web UI Not Loading
**Problem**: http://localhost:3000 not accessible
**Solution**: Ensure server is running, check PORT in .env

### Agent Not in Dropdown
**Problem**: Agent loaded but not in dropdown
**Solution**: Refresh page, check browser console for errors

## 📚 API Endpoints

All existing endpoints still work:
- `GET /api/query` - Simple query
- `GET /api/agents` - List all agents
- `GET /api/agents/:id/query` - Query specific agent
- `POST /api/query/batch` - Batch processing
- `GET /api/translate` - Translation
- **`POST /api/documents/analyze`** - NEW: File upload

## 🎉 Summary

You now have:
1. ✅ Auto-loading agents from `agents/` directory
2. ✅ Web interface at http://localhost:3000
3. ✅ File upload support (images & documents)
4. ✅ Interactive API testing
5. ✅ Real-time code examples
6. ✅ Beautiful dark-themed UI

**Add new agents** → Drop JSON in `agents/` → Restart server → Ready to use!

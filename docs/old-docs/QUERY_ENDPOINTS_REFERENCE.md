# Worksona API - Query Endpoints Quick Reference

## 🎯 Simple Query API

### GET /api/query
Ask any question with URL parameters

```bash
# Basic query
curl "http://localhost:3000/api/query?q=What+is+AI"

# With specific agent
curl "http://localhost:3000/api/query?agent=expert&q=Explain+quantum+computing"

# With model override
curl "http://localhost:3000/api/query?q=Complex+question&model=gpt-5&temperature=0.3"

# All parameters
curl "http://localhost:3000/api/query?q=Question&agent=my-agent&model=gpt-4o&temperature=0.7&max_tokens=500"
```

**Response:**
```json
{
  "success": true,
  "query": "What is AI",
  "answer": "AI is artificial intelligence...",
  "metadata": {
    "agent": "default-query-agent",
    "model": "gpt-4o",
    "duration": 850,
    "timestamp": "2026-01-18T12:00:00Z"
  }
}
```

---

### POST /api/query
Query with context and structured data

```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "analyst",
    "query": "Summarize this data",
    "context": {
      "document": "Long document text...",
      "metadata": {"type": "report"}
    },
    "options": {
      "temperature": 0.5,
      "maxTokens": 1000
    }
  }'
```

---

## 🤖 Agent-Specific Endpoints

### GET /api/agents/:agentId/query
Query a specific agent via URL

```bash
# Legal expert
curl "http://localhost:3000/api/agents/legal-expert/query?q=Review+this+contract"

# Translator
curl "http://localhost:3000/api/agents/translator/query?q=Translate+to+spanish&text=Hello"

# With options
curl "http://localhost:3000/api/agents/analyst/query?q=Analyze+data&temperature=0.3&max_tokens=500"
```

---

### POST /api/agents/:agentId/query
Query with rich content

```bash
curl -X POST http://localhost:3000/api/agents/document-analyst/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Summarize this document",
    "document": "Long document content...",
    "options": {
      "maxTokens": 500,
      "temperature": 0.5
    }
  }'
```

---

### POST /api/agents/:agentId/analyze
Analyze text or files

```bash
# Analyze text
curl -X POST http://localhost:3000/api/agents/sentiment-agent/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Customer feedback text..."}'

# Analyze file
curl -X POST http://localhost:3000/api/agents/image-analyst/analyze \
  -F "file=@photo.jpg"
```

---

### POST /api/agents/:agentId/process
Process files with specific operations

```bash
# Extract invoice data
curl -X POST http://localhost:3000/api/agents/invoice-agent/process \
  -F "file=@invoice.pdf" \
  -F "schema=invoice"

# Extract receipt data
curl -X POST http://localhost:3000/api/agents/data-extractor/process \
  -F "file=@receipt.jpg" \
  -F "schema=receipt"

# Extract contact info
curl -X POST http://localhost:3000/api/agents/contact-extractor/process \
  -F "file=@business-card.jpg" \
  -F "schema=contact"
```

**Schemas:**
- `invoice` - Extract invoice data (number, date, vendor, total, line items)
- `receipt` - Extract receipt data (merchant, date, items, total)
- `contact` - Extract contact info (name, email, phone, address)
- `extract` - Generic extraction

---

## 📦 Batch Operations

### POST /api/query/batch
Execute multiple queries in parallel (max 10)

```bash
curl -X POST http://localhost:3000/api/query/batch \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      {
        "agent": "translator",
        "query": "Translate: Hello",
        "model": "gpt-4o"
      },
      {
        "agent": "summarizer",
        "query": "Summarize: Long text...",
        "options": {"maxTokens": 200}
      },
      {
        "query": "Analyze sentiment: I love this!",
        "model": "gpt-5"
      }
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "index": 0,
      "query": "Translate: Hello",
      "result": "Hola",
      "agent": "translator"
    }
  ],
  "errors": [],
  "metadata": {
    "total": 3,
    "succeeded": 3,
    "failed": 0,
    "duration": 2150
  }
}
```

---

## 🔔 Webhook Endpoint

### POST /api/webhook/:agentId
Receive webhook calls from external services

```bash
# Generic webhook
curl -X POST http://localhost:3000/api/webhook/email-processor \
  -H "Content-Type: application/json" \
  -d '{
    "trigger": "email_received",
    "text": "Process this email",
    "data": {
      "from": "user@example.com",
      "subject": "Important"
    }
  }'

# Slack-style webhook
curl -X POST http://localhost:3000/api/webhook/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "text": "What is quantum computing?",
    "user_id": "U123456",
    "channel_id": "C123456"
  }'
```

**Webhook Payload Formats:**
The endpoint looks for query in these fields (in order):
1. `text`
2. `message`
3. `query`
4. `data`

---

## ⚡ Convenience Endpoints

### GET /api/ask
Quick question answering (auto-creates agent)

```bash
curl "http://localhost:3000/api/ask?q=What+is+the+capital+of+France"
```

---

### GET /api/translate
Quick translation

```bash
# Translate to Spanish (default)
curl "http://localhost:3000/api/translate?text=Hello+world"

# Translate to specific language
curl "http://localhost:3000/api/translate?text=Hello&to=french&from=english"
```

**Response:**
```json
{
  "success": true,
  "translation": "Bonjour le monde",
  "from": "english",
  "to": "french",
  "original": "Hello world",
  "metadata": {
    "duration": 750
  }
}
```

---

## 📋 Complete Examples

### Example 1: Simple Q&A
```bash
curl "http://localhost:3000/api/query?q=What+is+quantum+computing"
```

### Example 2: Agent-Specific Query
```bash
# First, load an agent
curl -X POST http://localhost:3000/api/agents/load \
  -H "Content-Type: application/json" \
  -d '{
    "id": "legal-expert",
    "name": "Legal Expert",
    "config": {
      "provider": "anthropic",
      "model": "claude-opus-4-5-20251101",
      "temperature": 0.3,
      "systemPrompt": "You are a legal expert specializing in contract review."
    }
  }'

# Then query it
curl "http://localhost:3000/api/agents/legal-expert/query?q=Review+this+contract+clause"
```

### Example 3: Process Invoice
```bash
# Load invoice processor
curl -X POST http://localhost:3000/api/agents/load \
  -H "Content-Type: application/json" \
  -d '{
    "id": "invoice-processor",
    "name": "Invoice Processor",
    "config": {
      "provider": "openai",
      "model": "gpt-4o",
      "temperature": 0.2
    }
  }'

# Process invoice
curl -X POST http://localhost:3000/api/agents/invoice-processor/process \
  -F "file=@invoice.pdf" \
  -F "schema=invoice"
```

### Example 4: Batch Translation
```bash
curl -X POST http://localhost:3000/api/query/batch \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      {"query": "Translate to spanish: Hello", "model": "gpt-4o"},
      {"query": "Translate to french: Hello", "model": "gpt-4o"},
      {"query": "Translate to german: Hello", "model": "gpt-4o"}
    ]
  }'
```

### Example 5: Webhook Integration
```bash
# Set up agent for webhook
curl -X POST http://localhost:3000/api/agents/load \
  -H "Content-Type: application/json" \
  -d '{
    "id": "support-bot",
    "name": "Support Bot",
    "config": {
      "provider": "openai",
      "model": "gpt-5-mini",
      "systemPrompt": "You are a helpful customer support bot."
    }
  }'

# Receive webhook (e.g., from Slack)
curl -X POST http://localhost:3000/api/webhook/support-bot \
  -H "Content-Type: application/json" \
  -d '{
    "text": "How do I reset my password?",
    "user_id": "U123",
    "channel": "support"
  }'
```

---

## 🔑 URL Parameters Reference

### Query Endpoints
- `q` or `query` - The question/prompt (required)
- `agent` - Agent ID to use (optional, auto-creates if not exists)
- `model` - Model override (e.g., `gpt-5`, `claude-opus-4-5-20251101`)
- `temperature` - Temperature 0-2 (default: 0.7)
- `max_tokens` or `maxTokens` - Maximum response tokens

### Agent-Specific Endpoints
- `q` or `query` - The question (required)
- `temperature` - Temperature setting
- `maxTokens` or `max_tokens` - Maximum tokens
- Any other URL params are passed as options

---

## 🎯 Use Cases

### 1. Simple Chatbot Integration
```bash
# Your app can simply make GET requests
const answer = await fetch(
  `http://localhost:3000/api/query?q=${encodeURIComponent(userQuestion)}`
).then(r => r.json());
```

### 2. Specialized Agent Per Route
```bash
# /legal endpoint → legal-expert agent
curl "http://localhost:3000/api/agents/legal-expert/query?q=${query}"

# /translate endpoint → translator agent
curl "http://localhost:3000/api/agents/translator/query?q=${query}"
```

### 3. Document Processing Pipeline
```bash
# 1. OCR
curl -X POST http://localhost:3000/api/documents/ocr -F "file=@doc.jpg"

# 2. Extract data
curl -X POST http://localhost:3000/api/agents/extractor/process \
  -F "file=@doc.jpg" -F "schema=invoice"

# 3. Analyze
curl -X POST http://localhost:3000/api/agents/analyst/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Extracted text..."}'
```

### 4. External Service Integration
```bash
# Zapier trigger → Webhook → Worksona → Response
POST /api/webhook/email-bot
{
  "trigger": "new_email",
  "text": "Categorize this email: ...",
  "metadata": {...}
}
```

---

## 🚀 Quick Start

1. **Start server**
```bash
node worksona-server.js
```

2. **Simple query**
```bash
curl "http://localhost:3000/api/query?q=Hello"
```

3. **Load specialized agent**
```bash
curl -X POST http://localhost:3000/api/agents/load \
  -H "Content-Type: application/json" \
  -d '{"id": "my-agent", "config": {"provider": "openai", "model": "gpt-5"}}'
```

4. **Query your agent**
```bash
curl "http://localhost:3000/api/agents/my-agent/query?q=Your+question"
```

---

## 💡 Tips

✅ **Auto-create agents** - `/api/query` auto-creates agents if not exists
✅ **URL-friendly** - All GET endpoints work from browser address bar
✅ **Batch processing** - Use `/api/query/batch` for multiple queries
✅ **Agent reuse** - Load agents once, query multiple times
✅ **Webhooks** - Use `/api/webhook/:agentId` for external integrations

---

## 📚 See Also

- Full API documentation: `API_DESIGN.md`
- Query API design: `QUERY_API_DESIGN.md`
- Server README: `API_SERVER_README.md`
- Main library docs: `README.md`

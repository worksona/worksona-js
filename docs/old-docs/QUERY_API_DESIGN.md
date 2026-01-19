# Query-Based API Design for Worksona.js

**Version:** 0.3.0
**Purpose:** Enable URL query parameter operations and agent-specific endpoints

## Overview

Extend the API server to support:
1. **Query string parameters** - Simple GET/POST requests with URL params
2. **Agent-specific endpoints** - Direct routes to specific agents
3. **RESTful queries** - GET requests for read operations
4. **Webhook-style operations** - Simplified integrations

## Architecture

```
Query String API
├── Generic Endpoints (query params)
├── Agent-Specific Routes (/:agentId/*)
├── Convenience Endpoints (predefined operations)
└── Webhook Endpoints (external integrations)
```

---

## 1. Query String API

### Basic Query Operations

#### `GET /api/query`
Execute a simple query with URL parameters

**Parameters:**
- `agent` - Agent ID to use
- `q` or `query` - The question/prompt
- `model` - Optional model override
- `temperature` - Optional temperature (0-2)
- `max_tokens` - Optional max tokens

**Examples:**
```bash
# Simple query
curl "http://localhost:3000/api/query?agent=assistant&q=What+is+quantum+computing"

# With options
curl "http://localhost:3000/api/query?agent=analyst&q=Analyze+this+data&temperature=0.3&max_tokens=1000"

# Auto-create agent
curl "http://localhost:3000/api/query?q=Explain+AI&model=gpt-5"
```

**Response:**
```json
{
  "success": true,
  "query": "What is quantum computing",
  "answer": "Quantum computing is...",
  "metadata": {
    "agent": "assistant",
    "model": "gpt-4o",
    "duration": 850,
    "tokens": 245
  }
}
```

#### `POST /api/query`
Execute query with JSON or form data

**Body (JSON):**
```json
{
  "agent": "analyst",
  "query": "Summarize this text: ...",
  "context": {
    "document": "Full document text..."
  },
  "options": {
    "temperature": 0.5
  }
}
```

**Body (Form Data):**
```bash
curl -X POST http://localhost:3000/api/query \
  -F "agent=analyst" \
  -F "query=Analyze this document" \
  -F "file=@document.pdf"
```

---

## 2. Agent-Specific Endpoints

### Dynamic Agent Routes

#### `GET /api/agents/:agentId/query`
Query a specific agent via GET

```bash
# Simple query
curl "http://localhost:3000/api/agents/legal-expert/query?q=Review+this+contract"

# With context
curl "http://localhost:3000/api/agents/translator/query?q=translate+to+spanish&text=Hello+world"
```

#### `POST /api/agents/:agentId/query`
Query a specific agent via POST

```bash
curl -X POST http://localhost:3000/api/agents/document-analyst/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Summarize this document",
    "document": "Long document text...",
    "options": {"maxTokens": 500}
  }'
```

#### `POST /api/agents/:agentId/analyze`
Analyze content with specific agent

```bash
# Analyze text
curl -X POST http://localhost:3000/api/agents/sentiment-agent/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Customer feedback text..."}'

# Analyze file
curl -X POST http://localhost:3000/api/agents/invoice-agent/analyze \
  -F "file=@invoice.pdf"
```

#### `POST /api/agents/:agentId/process`
Process data with specific agent

```bash
curl -X POST http://localhost:3000/api/agents/data-extractor/process \
  -F "file=@form.pdf" \
  -F "schema=contact_info"
```

---

## 3. Convenience Endpoints

### Pre-configured Operations

#### `GET /api/ask`
Quick question answering (auto-selects best agent)

```bash
curl "http://localhost:3000/api/ask?q=What+is+the+capital+of+France"
```

#### `GET /api/translate`
Quick translation

```bash
curl "http://localhost:3000/api/translate?text=Hello&to=spanish&from=english"
```

#### `GET /api/summarize`
Quick summarization (accepts URL or text)

```bash
# Summarize text
curl "http://localhost:3000/api/summarize?text=Long+article+text..."

# Summarize URL (fetches and summarizes)
curl "http://localhost:3000/api/summarize?url=https://example.com/article"
```

#### `GET /api/extract`
Quick data extraction

```bash
curl "http://localhost:3000/api/extract?text=Email+me+at+john@example.com&type=email"
```

---

## 4. Advanced Query Patterns

### Multi-Agent Queries

#### `POST /api/query/pipeline`
Execute multi-step query pipeline

```bash
curl -X POST http://localhost:3000/api/query/pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "steps": [
      {
        "agent": "ocr-agent",
        "operation": "extract_text",
        "input": {"file": "base64..."}
      },
      {
        "agent": "analyst",
        "operation": "summarize",
        "input": "{{step1.output}}"
      },
      {
        "agent": "translator",
        "operation": "translate",
        "input": "{{step2.output}}",
        "params": {"to": "spanish"}
      }
    ]
  }'
```

#### `POST /api/query/batch`
Execute multiple queries in parallel

```bash
curl -X POST http://localhost:3000/api/query/batch \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      {"agent": "translator", "query": "translate to spanish", "text": "Hello"},
      {"agent": "translator", "query": "translate to french", "text": "Hello"},
      {"agent": "translator", "query": "translate to german", "text": "Hello"}
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "results": [
    {"index": 0, "result": "Hola"},
    {"index": 1, "result": "Bonjour"},
    {"index": 2, "result": "Hallo"}
  ],
  "metadata": {
    "total": 3,
    "succeeded": 3,
    "failed": 0,
    "duration": 2150
  }
}
```

---

## 5. Webhook Endpoints

### For External Integrations

#### `POST /api/webhook/:agentId`
Receive webhook calls

```bash
# Zapier integration
curl -X POST http://localhost:3000/api/webhook/email-processor \
  -H "Content-Type: application/json" \
  -d '{
    "trigger": "email_received",
    "data": {
      "subject": "New order",
      "body": "Order details...",
      "from": "customer@example.com"
    }
  }'
```

#### `POST /api/webhook/:agentId/slack`
Slack integration endpoint

```bash
# Slack slash command
curl -X POST http://localhost:3000/api/webhook/assistant/slack \
  -d "text=What+is+quantum+computing" \
  -d "user_id=U123456" \
  -d "channel_id=C123456"
```

#### `POST /api/webhook/:agentId/discord`
Discord bot integration

```bash
curl -X POST http://localhost:3000/api/webhook/chatbot/discord \
  -H "Content-Type: application/json" \
  -d '{
    "content": "!ask What is AI?",
    "author": {"id": "123", "username": "user"},
    "channel_id": "456"
  }'
```

---

## 6. Streaming Responses

### Server-Sent Events (SSE)

#### `GET /api/agents/:agentId/stream`
Stream responses in real-time

```bash
curl -N "http://localhost:3000/api/agents/assistant/stream?q=Write+a+long+story"
```

**Response (SSE):**
```
data: {"type":"start","timestamp":"2026-01-18T12:00:00Z"}

data: {"type":"chunk","content":"Once upon a time..."}

data: {"type":"chunk","content":" there was a..."}

data: {"type":"complete","total_tokens":150}
```

**JavaScript Client:**
```javascript
const eventSource = new EventSource(
  'http://localhost:3000/api/agents/assistant/stream?q=Tell+me+a+story'
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'chunk') {
    console.log(data.content);
  }
};
```

---

## 7. Context & Memory Management

### Conversation Context

#### `POST /api/agents/:agentId/context`
Set context for agent

```bash
curl -X POST http://localhost:3000/api/agents/assistant/context \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "user-123",
    "context": {
      "userName": "John",
      "previousTopic": "quantum computing",
      "preferences": {"language": "simple"}
    }
  }'
```

#### `GET /api/agents/:agentId/context/:sessionId`
Get conversation context

```bash
curl "http://localhost:3000/api/agents/assistant/context/user-123"
```

#### `POST /api/agents/:agentId/remember`
Add to agent memory

```bash
curl -X POST http://localhost:3000/api/agents/assistant/remember \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "user-123",
    "fact": "User prefers technical explanations"
  }'
```

---

## 8. Agent Discovery & Routing

### Smart Agent Selection

#### `POST /api/route`
Automatically route query to best agent

```bash
curl -X POST http://localhost:3000/api/route \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Extract data from this invoice",
    "availableAgents": ["ocr-agent", "data-extractor", "general-assistant"]
  }'
```

**Response:**
```json
{
  "success": true,
  "selectedAgent": "data-extractor",
  "reason": "Best suited for structured data extraction",
  "confidence": 0.95,
  "result": "Extracted data..."
}
```

#### `GET /api/agents/suggest`
Suggest agent for query

```bash
curl "http://localhost:3000/api/agents/suggest?query=Translate+this+text"
```

**Response:**
```json
{
  "suggestions": [
    {
      "agentId": "translator",
      "confidence": 0.98,
      "reason": "Specialized translation agent"
    },
    {
      "agentId": "general-assistant",
      "confidence": 0.45,
      "reason": "Can handle translation but not specialized"
    }
  ]
}
```

---

## Implementation Examples

### Enhanced Server Routes

```javascript
// Generic query endpoint
app.get('/api/query', async (req, res) => {
  try {
    const { agent, q, query, model, temperature, max_tokens } = req.query;
    const questionText = q || query;

    if (!questionText) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_QUERY', message: 'Query parameter required' }
      });
    }

    // Auto-create agent if needed
    let agentId = agent || 'default-query-agent';
    if (!worksona.getAgent(agentId)) {
      await worksona.loadAgent({
        id: agentId,
        name: 'Query Agent',
        config: {
          provider: 'openai',
          model: model || 'gpt-4o',
          temperature: parseFloat(temperature) || 0.7
        }
      });
    }

    const startTime = Date.now();
    const answer = await worksona.chat(agentId, questionText, {
      temperature: parseFloat(temperature),
      maxTokens: parseInt(max_tokens)
    });

    res.json({
      success: true,
      query: questionText,
      answer,
      metadata: {
        agent: agentId,
        model: worksona.getAgent(agentId).config.model,
        duration: Date.now() - startTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'QUERY_ERROR', message: error.message }
    });
  }
});

// Agent-specific query endpoint
app.get('/api/agents/:agentId/query', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { q, query, ...options } = req.query;
    const questionText = q || query;

    if (!questionText) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_QUERY', message: 'Query parameter required' }
      });
    }

    const agent = worksona.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: { code: 'AGENT_NOT_FOUND', message: `Agent ${agentId} not found` }
      });
    }

    const startTime = Date.now();
    const answer = await worksona.chat(agentId, questionText, options);

    res.json({
      success: true,
      query: questionText,
      answer,
      agent: {
        id: agentId,
        name: agent.name,
        model: agent.config.model
      },
      metadata: {
        duration: Date.now() - startTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'QUERY_ERROR', message: error.message }
    });
  }
});

// Batch query endpoint
app.post('/api/query/batch', async (req, res) => {
  try {
    const { queries } = req.body;

    if (!Array.isArray(queries) || queries.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_BATCH', message: 'Queries array required' }
      });
    }

    const startTime = Date.now();
    const results = await Promise.allSettled(
      queries.map(async (q, index) => {
        const agent = q.agent || 'default-batch-agent';

        // Ensure agent exists
        if (!worksona.getAgent(agent)) {
          await worksona.loadAgent({
            id: agent,
            name: `Batch Agent ${index}`,
            config: {
              provider: 'openai',
              model: q.model || 'gpt-4o'
            }
          });
        }

        const result = await worksona.chat(agent, q.query, q.options);
        return { index, result };
      })
    );

    const succeeded = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');

    res.json({
      success: true,
      results: succeeded.map(r => r.value),
      errors: failed.map((r, i) => ({ index: i, error: r.reason.message })),
      metadata: {
        total: queries.length,
        succeeded: succeeded.length,
        failed: failed.length,
        duration: Date.now() - startTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'BATCH_ERROR', message: error.message }
    });
  }
});

// Webhook endpoint
app.post('/api/webhook/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const payload = req.body;

    const agent = worksona.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: { code: 'AGENT_NOT_FOUND', message: `Agent ${agentId} not found` }
      });
    }

    // Extract query from various webhook formats
    const query = payload.text || payload.message || payload.query || payload.data;

    const result = await worksona.chat(agentId, JSON.stringify(query));

    res.json({
      success: true,
      result,
      webhook: {
        agent: agentId,
        trigger: payload.trigger || 'webhook',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'WEBHOOK_ERROR', message: error.message }
    });
  }
});

// Streaming endpoint (SSE)
app.get('/api/agents/:agentId/stream', async (req, res) => {
  const { agentId } = req.params;
  const { q, query } = req.query;
  const questionText = q || query;

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    res.write(`data: ${JSON.stringify({ type: 'start', timestamp: new Date() })}\n\n`);

    // For now, simulate streaming (will need streaming API support)
    const result = await worksona.chat(agentId, questionText);

    // Send in chunks
    const chunkSize = 50;
    for (let i = 0; i < result.length; i += chunkSize) {
      const chunk = result.slice(i, i + chunkSize);
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    res.write(`data: ${JSON.stringify({ type: 'complete' })}\n\n`);
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
});
```

---

## Usage Examples

### Simple Query API

```bash
# Basic query
curl "http://localhost:3000/api/query?q=What+is+AI"

# Query with specific agent
curl "http://localhost:3000/api/query?agent=expert&q=Explain+quantum+computing"

# Query with model override
curl "http://localhost:3000/api/query?q=Complex+analysis&model=gpt-5&temperature=0.3"
```

### Agent-Specific Endpoints

```bash
# Query legal expert
curl "http://localhost:3000/api/agents/legal-expert/query?q=Review+contract"

# Analyze sentiment
curl -X POST http://localhost:3000/api/agents/sentiment/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Customer feedback text"}'

# Process invoice
curl -X POST http://localhost:3000/api/agents/invoice-processor/process \
  -F "file=@invoice.pdf"
```

### Batch Operations

```bash
curl -X POST http://localhost:3000/api/query/batch \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      {"agent": "translator", "query": "translate: Hello", "model": "gpt-4o"},
      {"agent": "summarizer", "query": "summarize: Long text..."},
      {"agent": "analyst", "query": "analyze: Data..."}
    ]
  }'
```

### Webhook Integration

```bash
# Generic webhook
curl -X POST http://localhost:3000/api/webhook/email-processor \
  -H "Content-Type: application/json" \
  -d '{
    "trigger": "email_received",
    "text": "Process this email",
    "metadata": {"from": "user@example.com"}
  }'
```

---

## Benefits

### For Developers
✅ **Simple GET requests** - No complex payloads needed
✅ **URL parameters** - Easy integration from any platform
✅ **Agent-specific routes** - Direct access to specialized agents
✅ **Batch operations** - Process multiple queries efficiently
✅ **Webhooks** - Easy external integrations

### For Applications
✅ **Low-code integration** - Simple URLs, no SDKs
✅ **Query string API** - Works with any HTTP client
✅ **Streaming support** - Real-time responses
✅ **Context management** - Stateful conversations

### For Businesses
✅ **Rapid integration** - Minutes, not hours
✅ **Flexible endpoints** - Multiple integration patterns
✅ **Scalable** - Handle concurrent requests
✅ **Extensible** - Easy to add custom agents

---

## Next Steps

1. Implement query endpoints in server
2. Add streaming support
3. Create context/session management
4. Build webhook handlers
5. Add agent auto-discovery
6. Implement batch processing
7. Create webhook integrations (Slack, Discord, etc.)

This query-based design makes Worksona.js accessible from any platform via simple HTTP requests!

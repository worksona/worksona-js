# Worksona.js AI Coding Assistant Prompt

Use this prompt with Claude, ChatGPT, or other AI coding assistants to enable Worksona.js vibe coding.

## Quick Copy Prompt

```
I'm using Worksona.js (v0.3.0) - an AI agent management library with multi-provider support (OpenAI, Anthropic, Google). Help me write code using Worksona.js.

Reference Documentation:
- Docs Hub: https://worksona.dev/docs/index.html
- API Reference: https://worksona.dev/docs/api-reference-swagger.html
- 60+ Examples: https://worksona.dev/docs/code-examples-hub.html
- Workflow Builder: https://worksona.dev/docs/delegation-demo.html

Available via JavaScript include:
<script src="https://unpkg.com/worksona-js@latest/vibe-coding/worksona-vibe.js"></script>

Or via REST API endpoints at: http://localhost:3000/api

Core Capabilities:
✓ Chat with GPT-5, GPT-4o, Claude Opus 4.5, Claude Sonnet 4.5, o3, Gemini Pro
✓ Generate images with DALL-E 3
✓ Multi-agent workflows (delegation chains)
✓ Document processing (OCR, PDF, DOCX, XLSX)
✓ Web scraping and text-to-speech
✓ Batch operations and agent personality system

When helping me code:
1. Use the latest model names (gpt-4o, claude-opus-4.5, not gpt-4)
2. Show both library mode (worksona.chat) and API mode (fetch /api/query)
3. Include error handling and async/await
4. Reference documentation URLs for complex features
5. Suggest workflows for multi-step tasks

Quick Examples:

// Chat
const response = await worksona.chat('assistant', 'Hello!');

// Load Agent
await worksona.loadAgent({
  id: 'helper',
  config: { provider: 'openai', model: 'gpt-4o' }
});

// Generate Image
const imageUrl = await worksona.generateImage('sunset over mountains');

// Workflow
const results = await worksona.workflow([
  { agent: 'research', prompt: 'Research: ${input}', outputVariable: 'research' },
  { agent: 'writer', prompt: 'Write: ${research}', outputVariable: 'article' }
], 'AI trends');

Ready to code!
```

## Extended Context Prompt (For Complex Projects)

```markdown
# Worksona.js Vibe Coding Context

I'm working with Worksona.js v0.3.0 - a comprehensive AI agent management system.

## System Architecture

**Dual-Mode Operation:**
1. **Library Mode**: Direct JavaScript integration (`worksona.js`)
2. **API Server Mode**: REST API with 32+ endpoints (`worksona-server.js`)

**Component Overview:**
- Single-file library (2,241 lines, zero dependencies)
- Multi-provider support (OpenAI, Anthropic, Google)
- Event-driven architecture (17 event types)
- Built-in control panel for monitoring
- Tool system (DALL-E, web scraper, TTS)

## Documentation Structure

**Interactive Demos:**
- Documentation Hub: https://worksona.dev/docs/index.html
- API Reference (Swagger): https://worksona.dev/docs/api-reference-swagger.html
- Endpoint Demo: https://worksona.dev/docs/endpoint-api-demo.html
- Library Demo: https://worksona.dev/docs/library-internal-demo.html
- Code Examples (60+): https://worksona.dev/docs/code-examples-hub.html
- Workflow Builder: https://worksona.dev/docs/delegation-demo.html

## Quick Reference

### Supported Models

**OpenAI:**
- GPT-5: `gpt-5`, `gpt-5-mini`, `gpt-5-nano`
- Reasoning: `o3`, `o3-mini`, `o1`, `o1-mini`
- GPT-4: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`
- Image: `dall-e-3`, `dall-e-2`

**Anthropic:**
- Claude 4.5: `claude-opus-4-5-20251101`, `claude-sonnet-4-5-20250929`
- Claude 3.5: `claude-3-5-sonnet-20241022`

**Google:**
- Gemini: `gemini-pro`, `gemini-pro-vision`

### Core API Methods

**Library Mode:**
```javascript
// Initialize
const worksona = new Worksona({
  apiKeys: { openai: 'sk-...', anthropic: 'sk-ant-...', google: '...' }
});

// Agent Management
await worksona.loadAgent(config)
worksona.getAgent(agentId)
worksona.getAllAgents()
worksona.removeAgent(agentId)

// Chat Operations
await worksona.chat(agentId, message, options)

// Image Operations
await worksona.processImage(agentId, imageData, options)
await worksona.generateImage(agentId, prompt, options)
await worksona.editImage(agentId, imageData, prompt, options)
await worksona.variationImage(agentId, imageData, options)

// Events
worksona.on('agent-loaded', handler)
worksona.on('chat-complete', handler)
worksona.on('image-generation-complete', handler)
worksona.on('error', handler)
```

**API Server Mode:**
```javascript
// Base URL: http://localhost:3000/api

// Chat
POST /api/query
Body: { agent: 'assistant', query: 'Hello', options: {...} }

// Batch
POST /api/query/batch
Body: { queries: [{agent, query}, ...] }

// Agents
POST /api/agents/load
GET /api/agents
GET /api/agents/:agentId
DELETE /api/agents/:agentId

// Images
POST /api/images/generate
POST /api/images/analyze

// Documents
POST /api/documents/ocr
POST /api/documents/analyze

// Tools
GET /api/tools/dalle/generate?prompt=...
GET /api/tools/scraper/fetch?url=...
POST /api/tools/tts/speak
```

### Agent Configuration Schema

```javascript
{
  id: 'agent-id',           // Required: unique identifier
  name: 'Agent Name',       // Optional: display name
  description: 'Purpose',   // Optional: what agent does
  personality: {            // Optional: personality system
    traits: ['trait1', 'trait2'],
    knowledge: ['domain1', 'domain2'],
    tone: 'friendly and professional',
    background: 'Expert with 10 years experience'
  },
  config: {
    provider: 'openai',     // Required: 'openai', 'anthropic', 'google'
    model: 'gpt-4o',        // Required: model name
    temperature: 0.7,       // Optional: 0-2, default varies
    maxTokens: 2000,        // Optional: max response length
    systemPrompt: '...',    // Optional: system message
    examples: [             // Optional: few-shot examples
      { user: '...', assistant: '...' }
    ]
  }
}
```

### Multi-Agent Workflow Pattern

```javascript
// Sequential workflow
const step1 = await worksona.chat('research-agent', 'Research: ' + topic);
const step2 = await worksona.chat('writer-agent', 'Write article: ' + step1);
const step3 = await worksona.chat('editor-agent', 'Edit: ' + step2);

// Using workflow helper (if using WorksonaVibe)
const results = await worksona.workflow([
  {
    agent: 'research-agent',
    prompt: 'Research the topic: ${input}',
    outputVariable: 'research',
    options: { temperature: 0.3 }
  },
  {
    agent: 'writer-agent',
    prompt: 'Write comprehensive article based on: ${research}',
    outputVariable: 'article',
    options: { temperature: 0.8 }
  },
  {
    agent: 'editor-agent',
    prompt: 'Edit and polish: ${article}',
    outputVariable: 'final',
    options: { temperature: 0.5 }
  }
], 'AI trends in 2026');

console.log('Final article:', results.final);
```

### Error Handling Pattern

```javascript
async function robustChat(agentId, message, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await worksona.chat(agentId, message);
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);

      if (i === retries - 1) throw error;

      // Exponential backoff
      await new Promise(resolve =>
        setTimeout(resolve, 1000 * Math.pow(2, i))
      );
    }
  }
}
```

### Event Monitoring Pattern

```javascript
// Set up comprehensive monitoring
worksona.on('agent-loaded', (data) => {
  console.log(`✅ Agent ${data.agentId} loaded`);
});

worksona.on('chat-complete', ({ agentId, response, duration }) => {
  console.log(`💬 ${agentId} responded in ${duration}ms`);
});

worksona.on('image-generation-complete', ({ imageUrl, duration }) => {
  console.log(`🎨 Image generated in ${duration}ms:`, imageUrl);
});

worksona.on('error', ({ code, message, agentId }) => {
  console.error(`❌ Error in ${agentId}:`, code, message);
});

// Available events: (17 total)
// agent-loaded, agent-removed, chat-start, chat-complete,
// image-generation-start, image-generation-complete,
// image-analysis-start, image-analysis-complete,
// image-edit-start, image-edit-complete,
// image-variation-start, image-variation-complete,
// provider-switch, control-panel-toggle,
// transaction-added, error, config-updated
```

## Tool System

**DALL-E Image Generation:**
```javascript
// Library mode
const imageUrl = await worksona.generateImage('dalle-agent',
  'A futuristic city at sunset',
  { size: '1024x1024', quality: 'hd', style: 'vivid' }
);

// API mode
const res = await fetch('http://localhost:3000/api/images/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'A futuristic city at sunset',
    size: '1024x1024',
    quality: 'hd'
  })
});
```

**Web Scraper:**
```javascript
// API mode (scraper only available via API)
const content = await fetch(
  'http://localhost:3000/api/tools/scraper/fetch?url=' +
  encodeURIComponent('https://example.com')
);
const data = await content.json();
console.log(data.data.title, data.data.text);
```

**Text-to-Speech:**
```javascript
// API mode
const audioRes = await fetch('http://localhost:3000/api/tools/tts/speak', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Hello, this is a test.',
    voice: 'alloy'  // alloy, echo, fable, onyx, nova, shimmer
  })
});
```

## Common Patterns

### Pattern 1: Quick Prototype
```javascript
// Minimal setup for quick testing
<script src="https://unpkg.com/worksona-js@latest/worksona.min.js"></script>
<script src="https://unpkg.com/worksona-js@latest/vibe-coding/worksona-vibe.js"></script>
<script>
  // Use API server (already running)
  worksona.apiBase = 'http://localhost:3000/api';

  // Start coding
  const response = await worksona.chat('assistant', 'Hello!');
</script>
```

### Pattern 2: Production App
```javascript
// NPM installation
npm install worksona-js

// Import and initialize
import Worksona from 'worksona-js';

const worksona = new Worksona({
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY
  },
  controlPanel: false  // Disable in production
});

// Load agents from config files
const agents = ['support', 'sales', 'technical'].map(id =>
  require(`./agents/${id}-agent.json`)
);

for (const agent of agents) {
  await worksona.loadAgent(agent);
}
```

### Pattern 3: Microservice
```javascript
// Start API server
node worksona-server.js

// Use from any language
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"agent":"assistant","query":"Hello"}'
```

## Coding Guidelines

When helping me with Worksona.js:

1. **Always use latest model names**: `gpt-4o`, `claude-opus-4.5`, not deprecated names
2. **Show both modes**: Provide library and API approaches when relevant
3. **Include error handling**: Use try-catch and retry logic
4. **Reference docs**: Link to specific documentation sections for complex features
5. **Suggest workflows**: For multi-step tasks, recommend delegation patterns
6. **Use TypeScript types**: When applicable, reference `worksona.d.ts`
7. **Consider cost**: Mention token usage for production scenarios
8. **Security**: Never hardcode API keys, use environment variables

## Example Project Structures

**Frontend App:**
```
my-app/
├── index.html
├── app.js
├── agents/
│   ├── support-agent.json
│   └── sales-agent.json
└── config.js
```

**Backend Service:**
```
my-service/
├── server.js
├── routes/
│   ├── chat.js
│   └── agents.js
├── agents/
│   └── *.json
├── .env
└── package.json
```

**Full Stack:**
```
my-fullstack/
├── frontend/
│   ├── public/
│   └── src/
├── backend/
│   ├── worksona-server.js
│   └── agents/
├── shared/
│   └── types.ts
└── docker-compose.yml
```

Ready to help you code with Worksona.js! What would you like to build?
```

## Usage with AI Assistants

### For Claude Code / GitHub Copilot
Add to your workspace `.cursorrules` or `.github/copilot-instructions.md`:
```
@file:vibe-coding/AI_CODING_PROMPT.md
```

### For ChatGPT / Claude Web
Copy the "Quick Copy Prompt" section and paste at the start of your conversation.

### For Cursor / Windsurf
Add to your project instructions file.

### For Replit AI / v0.dev
Include as context in your project description.

## Benefits of Vibe Coding with Worksona.js

✓ **AI Assistant Awareness**: AI knows all Worksona.js capabilities
✓ **Up-to-date Examples**: Always references latest models and APIs
✓ **Dual-Mode Support**: Suggests both library and API approaches
✓ **Error Handling**: Includes robust error handling patterns
✓ **Documentation Links**: Points to specific docs for complex features
✓ **Workflow Patterns**: Suggests multi-agent delegation for complex tasks
✓ **Best Practices**: Follows security and production guidelines

---

**Next Steps:**
1. Copy the Quick Copy Prompt to your AI assistant
2. Include `<script src="https://unpkg.com/worksona-js@latest/vibe-coding/worksona-vibe.js"></script>` in your HTML
3. Start building with AI assistance!

# Worksona.js

**Last Updated:** January 19, 2026
**Version:** 0.3.0

[![npm version](https://badge.fury.io/js/worksona-js.svg)](https://badge.fury.io/js/worksona-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/worksona-js.svg)](https://npmjs.com/package/worksona-js)

A lightweight, single-file JavaScript library for creating and managing AI agents with distinct personalities across multiple LLM providers. Now supporting the latest frontier models including GPT-5, Claude Opus 4.5, and Claude Sonnet 4.5.

## 🆕 What's New in v0.3.0

- 📚 **Complete Documentation Suite** - Interactive demos, code examples, visual workflow builder
- 🔌 **REST API Server** - Production-ready Express server with 32+ endpoints
- 🛠️ **Tool System** - DALL-E image generation, web scraper, text-to-speech
- 🎨 **Agent Personality System** - Rich configuration with traits, knowledge, tone
- 📄 **Document Processing** - OCR, PDF/DOCX/XLSX parsing built-in
- ✨ **Latest Frontier Models** - Full support for GPT-5, Claude Opus 4.5, o3
- 🔗 **Multi-Agent Workflows** - Build and execute complex agent delegation chains

## ✨ Features

- 🤖 **Multi-Provider LLM Support** - OpenAI, Anthropic, Google
- 🖼️ **Complete Image Pipeline** - Analysis, generation, editing, variations
- 👥 **Agent Personality System** - Rich configuration with traits and examples
- 📊 **Real-time Control Panel** - Monitor agents, metrics, and transactions
- ⚡ **Event-Driven Architecture** - Comprehensive event system
- 📦 **Single File Deployment** - No dependencies, easy integration
- 🎯 **Production Ready** - Built-in error handling and monitoring

## 🚀 Quick Start

### Installation

**Via NPM:**
```bash
npm i worksona-js
```

**Via CDN:**
```html
<script src="https://unpkg.com/worksona-js@latest/worksona.min.js"></script>
```

**NPM Package:** https://www.npmjs.com/package/worksona-js

### Basic Usage

```javascript
const worksona = new Worksona({
  apiKeys: {
    openai: 'your-openai-api-key',
    anthropic: 'your-anthropic-api-key',
    google: 'your-google-api-key'
  }
});

// Load an agent with latest GPT-5 model
await worksona.loadAgent({
  id: 'customer-service',
  name: 'Sarah',
  description: 'Customer service representative',
  traits: {
    personality: ['empathetic', 'patient', 'solution-oriented'],
    knowledge: ['product catalog', 'return policies'],
    tone: 'friendly and professional'
  },
  config: {
    provider: 'openai',
    model: 'gpt-5', // Or 'gpt-5-mini', 'gpt-5-nano', 'o3', 'gpt-4o'
    temperature: 0.7,
    systemPrompt: 'You are Sarah, a helpful customer service representative...'
  }
});

// Load an agent with Claude Opus 4.5
await worksona.loadAgent({
  id: 'technical-writer',
  name: 'Alex',
  description: 'Technical documentation specialist',
  config: {
    provider: 'anthropic',
    model: 'claude-opus-4-5-20251101', // Or 'claude-sonnet-4-5-20250929'
    temperature: 0.5,
    systemPrompt: 'You are Alex, an expert technical writer...'
  }
});

// Chat with the agent
const response = await worksona.chat('customer-service', 'How do I return an item?');
console.log(response);
```

### Image Processing

```javascript
// Analyze an image
const analysis = await worksona.processImage('agent-id', imageUrl, {
  prompt: 'What do you see in this image?'
});

// Generate an image
const imageUrl = await worksona.generateImage('agent-id', 
  'A futuristic cityscape at sunset');

// Edit an image
const editedUrl = await worksona.editImage('agent-id', imageData, 
  'Add a rainbow in the sky');
```

## 🎯 Use Cases

- **Customer Support** - Intelligent chatbots with personality
- **Content Creation** - AI writers with specific styles
- **Image Analysis** - Visual content processing
- **Technical Support** - Specialized troubleshooting agents
- **Sales Assistance** - Personalized product recommendations
- **Creative Projects** - AI-powered image generation and editing

## 🔧 Provider Support

### Latest Frontier Models

| Provider | Latest Models | Chat | Vision | Image Generation |
|----------|--------------|------|---------|-----------------|
| **OpenAI** | GPT-5, GPT-5-mini, GPT-5-nano, o3, o1, GPT-4o | ✅ | ✅ | ✅ DALL-E 3 |
| **Anthropic** | Claude Opus 4.5, Claude Sonnet 4.5, Claude 3.5 Sonnet | ✅ | ❌ | ❌ |
| **Google** | Gemini Pro | ✅ | ❌ | ❌ |

### Supported Models by Provider

**OpenAI:**
- GPT-5 series: `gpt-5`, `gpt-5-mini`, `gpt-5-nano` 🆕
- Reasoning models: `o3`, `o3-mini`, `o1`, `o1-mini`, `o1-preview` 🆕
- GPT-4 series: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-4`, `gpt-4-32k`
- GPT-3.5 series: `gpt-3.5-turbo`, `gpt-3.5-turbo-16k`
- Image generation: `dall-e-3`, `dall-e-2`

**Anthropic:**
- Claude 4.5: `claude-opus-4-5-20251101`, `claude-sonnet-4-5-20250929` 🆕
- Claude 3.5: `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`
- Claude 3: `claude-3-opus-20240229`, `claude-3-sonnet-20240229`, `claude-3-haiku-20240307`
- Legacy: `claude-2.1`, `claude-2.0`, `claude-instant-1.2`

**Google:**
- Gemini: `gemini-pro`, `gemini-pro-vision`

## 📖 API Reference

### Core Methods

#### `loadAgent(config)`
Load an agent from configuration.

```javascript
const agent = await worksona.loadAgent({
  id: 'tech-support',
  name: 'Alex',
  description: 'Technical support specialist',
  config: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.5
  }
});
```

#### `chat(agentId, message, options)`
Send a message to an agent.

```javascript
const response = await worksona.chat('tech-support', 'My computer won\'t start', {
  temperature: 0.3,
  maxTokens: 800
});
```

#### Image Processing Methods

- `processImage(agentId, imageData, options)` - Analyze images
- `generateImage(agentId, prompt, options)` - Generate images from text
- `editImage(agentId, imageData, prompt, options)` - Edit existing images
- `variationImage(agentId, imageData, options)` - Create image variations

### Agent Management

- `getAgent(agentId)` - Retrieve an agent
- `getAllAgents()` - Get all loaded agents
- `removeAgent(agentId)` - Remove an agent
- `getAgentHistory(agentId)` - Get conversation history
- `getAgentMetrics(agentId)` - Get performance metrics

## 🎨 Agent Configuration

Agents are configured using JSON with rich personality traits:

```json
{
  "id": "creative-writer",
  "name": "Maya",
  "description": "Creative writing specialist",
  "traits": {
    "personality": ["creative", "empathetic", "detail-oriented"],
    "knowledge": ["storytelling", "character development", "plot structure"],
    "tone": "inspiring and supportive",
    "background": "Professional writer with 15 years of experience"
  },
  "config": {
    "provider": "openai",
    "model": "gpt-4o",
    "temperature": 0.8,
    "maxTokens": 1000,
    "systemPrompt": "You are Maya, a creative writing coach...",
    "examples": [
      {
        "user": "Help me develop a character",
        "assistant": "I'd love to help you create a compelling character! Let's start with their core motivation..."
      }
    ]
  }
}
```

## 📊 Built-in Control Panel

Worksona includes a floating control panel for development and monitoring:

- Real-time agent monitoring
- API key management
- Transaction history
- Performance metrics
- Provider status indicators

The control panel appears as a floating button and can be disabled:

```javascript
const worksona = new Worksona({
  controlPanel: false,  // Disable floating panel
  // ... other options
});
```

## 📧 Events & Error Handling

Comprehensive event system for monitoring:

```javascript
// Agent events
worksona.on('agent-loaded', (data) => {
  console.log(`Agent ${data.name} loaded`);
});

// Chat events
worksona.on('chat-complete', ({ agentId, response, duration }) => {
  console.log(`Chat completed in ${duration}ms`);
});

// Image processing events
worksona.on('image-generation-complete', ({ result }) => {
  console.log('Image generated:', result);
});

// Error handling
worksona.on('error', (error) => {
  console.error('Error:', error.message);
});
```

## 🔧 Advanced Usage

### Error Recovery

```javascript
async function robustChat(agentId, message, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await worksona.chat(agentId, message);
    } catch (error) {
      if (error.code === 'PROVIDER_ERROR' && i < retries - 1) {
        // Try fallback provider
        const agent = worksona.getAgent(agentId);
        const fallbackProvider = agent.config.provider === 'openai' ? 'anthropic' : 'openai';
        return await worksona.chat(agentId, message, { provider: fallbackProvider });
      }
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
```

### Multi-Agent Workflows

```javascript
// Research -> Write -> Fact-check workflow
const research = await worksona.chat('research-analyst', 'Research renewable energy trends');
const article = await worksona.chat('content-writer', `Write an article: ${research}`);
const factCheck = await worksona.chat('fact-checker', `Verify: ${article}`);
```

## 🛠️ Development

### TypeScript Support

TypeScript definitions are included:

```typescript
import Worksona from 'worksona-js';

const worksona = new Worksona({
  apiKeys: { openai: 'your-key' }
});
```

### Browser Compatibility

- Modern browsers (ES2018+)
- Node.js 14+
- CDN distribution available

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

## 📚 Documentation

### 🎯 Quick Links
- **[📖 Documentation Hub](docs/index.html)** - Central documentation portal
- **[🔌 API Reference (Swagger)](docs/api-reference-swagger.html)** - Interactive API documentation
- **[🎮 Try Live Demo](docs/endpoint-api-demo.html)** - Test all API endpoints
- **[💻 Code Examples](docs/code-examples-hub.html)** - 60+ copy/paste examples
- **[🔗 Workflow Builder](docs/delegation-demo.html)** - Visual multi-agent workflows
- **[🎵 Vibe Coding](vibe-coding/index.html)** - AI-assisted coding (NEW!)
- **[🚀 Marketing Site](marketing/index.html)** - Product overview

### 📖 Complete Documentation Suite
We've created a comprehensive documentation system with:
- **Interactive Demos**: Test all features directly in your browser
- **Code Examples**: 60+ examples in JavaScript, Node.js, Python, and cURL
- **Visual Workflow Builder**: Build and execute multi-agent workflows
- **API Reference**: Complete OpenAPI/Swagger documentation
- **Getting Started Guides**: Multiple learning paths for different use cases

**→ Start here: [docs/index.html](docs/index.html)**

## 🔗 Links

- [GitHub Repository](https://github.com/worksona/worksona-js)
- [NPM Package](https://www.npmjs.com/package/worksona-js)
- [Documentation](https://worksona.dev/docs)
- [Examples](https://worksona.dev/examples)

---

**Worksona.js** - Intelligent agent management made simple. 
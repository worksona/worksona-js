# Worksona.js

**Last Updated:** January 6, 2026

[![npm version](https://badge.fury.io/js/worksona-js.svg)](https://badge.fury.io/js/worksona-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/worksona-js.svg)](https://npmjs.com/package/worksona-js)

A lightweight, single-file JavaScript library for creating and managing AI agents with distinct personalities across multiple LLM providers. Features comprehensive image processing, real-time control panel, and event-driven architecture.

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

// Load an agent
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
    model: 'gpt-4o',
    temperature: 0.7,
    systemPrompt: 'You are Sarah, a helpful customer service representative...'
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

| Provider | Chat | Vision | Image Generation |
|----------|------|---------|-----------------|
| OpenAI | ✅ GPT-4, GPT-4o | ✅ GPT-4o | ✅ DALL-E 3 |
| Anthropic | ✅ Claude-3 | ❌ | ❌ |
| Google | ✅ Gemini Pro | ❌ | ❌ |

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

- [Full Documentation](WORKSONA_DOCUMENTATION.md)
- [API Reference](docs/api-reference.html)
- [Live Examples](docs/)

## 🔗 Links

- [GitHub Repository](https://github.com/worksona/worksona-js)
- [NPM Package](https://www.npmjs.com/package/worksona-js)
- [Documentation](https://worksona.dev/docs)
- [Examples](https://worksona.dev/examples)

---

**Worksona.js** - Intelligent agent management made simple. 
# Worksona.js Technical Specification

**Last Updated:** January 22, 2026  
**Version:** 0.3.0  
**Type:** Single-file JavaScript library + REST API Server  
**License:** MIT  

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Features](#core-features)
- [API Reference](#api-reference)
- [Image Processing](#image-processing)
- [Agent Configuration](#agent-configuration)
- [Events & Error Handling](#events--error-handling)
- [Control Panel](#control-panel)
- [Examples](#examples)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)

---

## Overview

Worksona.js is a lightweight, single-file JavaScript library that enables you to create and manage AI agents with distinct personalities across multiple LLM providers. With comprehensive image processing capabilities and a built-in control panel, you can deploy intelligent agents for customer service, technical support, sales, content creation, and visual analysis.

### Key Features

- ✅ **Multi-Provider Support** - OpenAI, Anthropic, Google
- ✅ **Image Processing Pipeline** - Analysis, generation, editing, variations
- ✅ **Agent Personality System** - Rich configuration with traits and examples
- ✅ **Real-time Control Panel** - Monitor agents, metrics, and transactions
- ✅ **Event-Driven Architecture** - Comprehensive event system
- ✅ **Single File Deployment** - No dependencies, easy integration

---

## Installation

### Option 1: Direct Include
```html
<script src="worksona.js"></script>
```

### Option 2: CDN
```html
<script src="https://unpkg.com/worksona-js@latest/worksona.min.js"></script>
```

### Option 3: NPM
```bash
npm i worksona-js
```

**NPM Package:** https://www.npmjs.com/package/worksona-js

---

## Quick Start

### 1. Initialize Worksona

```javascript
const worksona = new Worksona({
  apiKeys: {
    openai: 'your-openai-api-key',
    anthropic: 'your-anthropic-api-key',
    google: 'your-google-api-key'
  },
  debug: true,
  defaultProvider: 'openai',
  defaultModel: 'gpt-4o'
});
```

### 2. Load an Agent

```javascript
// From JSON file
const agent = await worksona.loadAgent('agents/customer-service.json');

// Or from object
const agent = await worksona.loadAgent({
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
    maxTokens: 500,
    systemPrompt: 'You are Sarah, a helpful customer service representative...'
  }
});
```

### 3. Chat with Agent

```javascript
const response = await worksona.chat('customer-service', 'How do I return an item?');
console.log(response);
```

### 4. Process Images

```javascript
// Analyze an image
const analysis = await worksona.processImage('customer-service', imageUrl, {
  prompt: 'What product is shown in this image?'
});

// Generate an image
const imageUrl = await worksona.generateImage('marketing-agent', 'Create a professional product photo');
```

---

## Core Features

### Multi-Provider LLM Support

| Provider | Chat | Vision | Image Generation |
|----------|------|---------|-----------------|
| OpenAI | ✅ GPT-5, o3, GPT-4o | ✅ GPT-4o | ✅ GPT Image 1.5, DALL-E 3 |
| Anthropic | ✅ Claude Opus 4.5, Sonnet 4.5 | ❌ | ❌ |
| Google | ✅ Gemini Pro | ❌ | ❌ |

### Agent Management System

- **Personality Configuration** - Define traits, knowledge, tone, background
- **State Management** - Track active/inactive status, current provider
- **Transaction History** - Complete conversation logs with metadata
- **Performance Metrics** - Response times, success rates, error tracking
- **Dynamic Loading** - Load agents from JSON files or objects

### Image Processing Pipeline

- **Image Analysis** - Detailed visual analysis using GPT-4o vision
- **Image Generation** - Create images from text prompts with GPT Image 1.5 (default), GPT Image 1, GPT Image 1-mini, or DALL-E 3
- **Image Editing** - Modify existing images with natural language (supports up to 16 images for GPT Image models)
- **Image Variations** - Generate variations of existing images (DALL-E models)
- **Advanced Features** - Transparent backgrounds, multiple output formats (PNG, JPEG, WebP), streaming support, quality controls

---

## API Reference

### Constructor

```javascript
new Worksona(options)
```

**Options:**
```javascript
{
  apiKeys: {
    openai: 'string',      // OpenAI API key
    anthropic: 'string',   // Anthropic API key  
    google: 'string'       // Google API key
  },
  debug: boolean,          // Enable debug logging (default: false)
  defaultProvider: 'string',  // Default LLM provider (default: 'openai')
  defaultModel: 'string',     // Default model (default: 'gpt-3.5-turbo')
  controlPanel: boolean       // Enable floating control panel (default: true)
}
```

### Core Methods

#### `loadAgent(config)`
Load an agent from configuration.

**Parameters:**
- `config` (string|object): JSON file URL or configuration object

**Returns:** `Promise<Agent|null>`

**Example:**
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

**Parameters:**
- `agentId` (string): Agent identifier
- `message` (string): Message to send
- `options` (object, optional): Override settings

**Returns:** `Promise<string|null>`

**Example:**
```javascript
const response = await worksona.chat('tech-support', 'My computer won\'t start', {
  temperature: 0.3,
  maxTokens: 800
});
```

#### `getAgent(agentId)`
Retrieve an agent by ID.

**Returns:** `Agent|undefined`

#### `getAllAgents()`
Get all loaded agents.

**Returns:** `Agent[]`

#### `removeAgent(agentId)`
Remove an agent.

**Returns:** `boolean`

### Agent Information Methods

#### `getAgentHistory(agentId)`
Get conversation history for an agent.

**Returns:** `Transaction[]`

#### `getAgentMetrics(agentId)`
Get performance metrics for an agent.

**Returns:** `Metrics`

```javascript
{
  totalQueries: number,
  avgResponseTime: number,
  lastActive: Date,
  successRate: number,
  errorCount: number
}
```

#### `getAgentState(agentId)`
Get current state of an agent.

**Returns:** `State`

```javascript
{
  isActive: boolean,
  currentProvider: string,
  currentModel: string,
  lastError: Error|null
}
```

---

## Image Processing

### Image Analysis

Analyze images using GPT-4o vision capabilities.

```javascript
await worksona.processImage(agentId, imageData, options)
await worksona.analyzeImage(agentId, imageData, options)  // Alias
```

**Parameters:**
- `agentId` (string): Agent identifier
- `imageData` (string): Image URL or base64 data
- `options` (object):
  - `prompt` (string): Analysis prompt (default: 'Please analyze this image.')
  - `detail` (string): Detail level - 'auto', 'low', 'high' (default: 'high')

**Example:**
```javascript
const analysis = await worksona.processImage('vision-agent', 'https://example.com/image.jpg', {
  prompt: 'Identify all objects in this image and describe their relationships',
  detail: 'high'
});
```

### Image Generation

Generate images from text prompts using DALL-E 3.

```javascript
await worksona.generateImage(agentId, prompt, options)
```

**Parameters:**
- `agentId` (string): Agent identifier
- `prompt` (string): Text description of desired image
- `options` (object):
  - `model` (string): 'gpt-image-1.5' (default), 'gpt-image-1', 'gpt-image-1-mini', 'dall-e-3', 'dall-e-2'
  - `size` (string): 'auto' (GPT Image), '1024x1024', '1536x1024', '1024x1536', '1792x1024', '1024x1792' (default: 'auto' for GPT Image, '1024x1024' for DALL-E)
  - `quality` (string): 'auto', 'high', 'medium', 'low' (GPT Image) or 'standard', 'hd' (DALL-E)
  - `output_format` (string): 'png', 'jpeg', 'webp' (GPT Image only)
  - `background` (string): 'auto', 'transparent', 'opaque' (GPT Image only)
  - `n` (number): Number of images (default: 1, max: 10)
  - `response_format` (string): 'url' (DALL-E) or 'b64_json' (GPT Image returns base64 automatically)

**Example:**
```javascript
// GPT Image 1.5 (default, returns base64 data URL)
const imageDataUrl = await worksona.generateImage('creative-agent', 
  'A futuristic cityscape with flying cars and neon lights', {
  model: 'gpt-image-1.5',
  size: 'auto',
  quality: 'high',
  output_format: 'png',
  background: 'transparent'
});

// DALL-E 3 (legacy, returns URL)
const imageUrl = await worksona.generateImage('creative-agent', 
  'A futuristic cityscape with flying cars and neon lights', {
  model: 'dall-e-3',
  size: '1024x1024',
  quality: 'hd'
});
```

### Image Editing

Edit existing images using natural language prompts. Supports single images or arrays of up to 16 images (GPT Image models).

```javascript
await worksona.editImage(agentId, imageData, prompt, options)
```

**Parameters:**
- `agentId` (string): Agent identifier
- `imageData` (string | string[]): Original image data (base64/data URL) or array of images (up to 16 for GPT Image)
- `prompt` (string): Description of desired changes
- `options` (object):
  - `model` (string): 'gpt-image-1.5' (default), 'gpt-image-1', 'dall-e-3'
  - `input_fidelity` (string): 'low' | 'high' (only for gpt-image-1)
  - `mask` (string): Optional PNG mask for DALL-E editing
  - `size`, `quality`, `output_format`, `background`: Same as generateImage

**Example:**
```javascript
// GPT Image 1.5 (supports multiple images)
const editedImage = await worksona.editImage('design-agent', [img1, img2, img3], 
  'Apply vintage filter to all images', {
  model: 'gpt-image-1.5',
  quality: 'high',
  output_format: 'png'
});

// GPT Image 1 (with input fidelity control)
const editedImage = await worksona.editImage('design-agent', originalImageData, 
  'Add a bright blue sky background', {
  model: 'gpt-image-1',
  input_fidelity: 'high',
  quality: 'high'
});

// DALL-E 3 (legacy)
const editedUrl = await worksona.editImage('design-agent', originalImageData, 
  'Add a bright blue sky background', {
  model: 'dall-e-3',
  size: '1024x1024'
});
```

### Image Variations

Create variations of existing images.

```javascript
await worksona.variationImage(agentId, imageData, options)
```

**Example:**
```javascript
const variationUrl = await worksona.variationImage('art-agent', imageData, {
  size: '1024x1024',
  n: 1
});
```

---

## Agent Configuration

### Complete Agent Schema

```json
{
  "id": "unique-agent-id",
  "name": "Agent Display Name",
  "description": "Brief description of the agent's role",
  "traits": {
    "personality": ["trait1", "trait2", "trait3"],
    "knowledge": ["domain1", "domain2"],
    "tone": "communication style",
    "background": "agent's background story"
  },
  "config": {
    "provider": "openai|anthropic|google",
    "model": "model-name",
    "temperature": 0.7,
    "maxTokens": 500,
    "topP": 1.0,
    "frequencyPenalty": 0.0,
    "presencePenalty": 0.0,
    "systemPrompt": "Detailed system prompt defining behavior",
    "examples": [
      {
        "user": "Example user message",
        "assistant": "Example assistant response"
      }
    ]
  }
}
```

### Configuration Parameters

#### Core Settings
- `id` (string): Unique identifier
- `name` (string): Display name
- `description` (string): Agent description

#### Personality Traits
- `personality` (array): Personality characteristics
- `knowledge` (array): Areas of expertise
- `tone` (string): Communication style
- `background` (string): Background information

#### Model Configuration
- `provider` (string): LLM provider ('openai', 'anthropic', 'google')
- `model` (string): Specific model name
- `imageGenerationModel` (string): Image generation model (default: 'gpt-image-1.5')
- `temperature` (number): Creativity level (0.0-2.0, fixed at 1.0 for GPT-5 and o-series)
- `maxTokens` (number): Maximum response length
- `topP` (number): Nucleus sampling parameter
- `topK` (number): Top-K sampling (Anthropic/Google)
- `organization` (string): OpenAI organization ID (optional)
- `frequencyPenalty` (number): Repetition penalty
- `presencePenalty` (number): Topic diversity penalty

#### Behavior Definition
- `systemPrompt` (string): Core behavior instructions
- `examples` (array): Few-shot learning examples

---

## Events & Error Handling

### Event System

Worksona emits events for all major operations:

```javascript
// Agent events
worksona.on('agent-loaded', (data) => {
  console.log(`Agent ${data.name} loaded`);
});

worksona.on('agent-removed', (agentId) => {
  console.log(`Agent ${agentId} removed`);
});

// Chat events
worksona.on('chat-start', ({ agentId, message }) => {
  console.log(`Chat started with ${agentId}`);
});

worksona.on('chat-complete', ({ agentId, response, duration }) => {
  console.log(`Chat completed in ${duration}ms`);
});

// Image processing events
worksona.on('image-analysis-start', (data) => {
  console.log('Image analysis started');
});

worksona.on('image-analysis-complete', ({ result }) => {
  console.log('Analysis complete:', result);
});

worksona.on('image-generation-start', (data) => {
  console.log('Image generation started');
});

worksona.on('image-generation-complete', ({ result }) => {
  console.log('Image generated:', result);
});

// Error events
worksona.on('error', (error) => {
  console.error('Worksona error:', error);
});
```

### Error Handling

Worksona provides structured error handling with specific error codes:

#### Error Codes
- `CONFIG_ERROR`: Invalid configuration
- `AGENT_LOAD_ERROR`: Failed to load agent
- `AGENT_NOT_FOUND`: Agent doesn't exist
- `PROVIDER_ERROR`: LLM provider error
- `CHAT_ERROR`: Chat operation failed
- `IMAGE_PROCESSING_ERROR`: Image analysis failed
- `IMAGE_GENERATION_ERROR`: Image generation failed
- `IMAGE_EDIT_ERROR`: Image editing failed
- `IMAGE_VARIATION_ERROR`: Image variation failed

#### Error Structure
```javascript
{
  message: "Human-readable error message",
  code: "ERROR_CODE",
  originalError: Error // Original error object
}
```

#### Error Handling Example
```javascript
try {
  const response = await worksona.chat('agent-id', 'Hello');
} catch (error) {
  switch (error.code) {
    case 'AGENT_NOT_FOUND':
      console.log('Agent not found, loading default agent...');
      break;
    case 'PROVIDER_ERROR':
      console.log('Provider error, trying different provider...');
      break;
    default:
      console.error('Unexpected error:', error.message);
  }
}
```

---

## Control Panel

Worksona includes a built-in floating control panel for development and monitoring.

### Features
- **Real-time Agent Monitoring** - View all loaded agents and their status
- **API Key Management** - Securely configure provider API keys
- **Transaction History** - View recent conversations and responses
- **Performance Metrics** - Monitor response times and success rates
- **Provider Status** - Check LLM provider connectivity
- **Agent Configuration Viewer** - Inspect agent settings and prompts

### Usage

The control panel is enabled by default and appears as a floating button in the bottom-right corner.

```javascript
// Disable control panel
const worksona = new Worksona({
  controlPanel: false,
  // ... other options
});

// Or create a custom control panel in a specific container
worksona.createControlPanel('my-control-panel-div');
```

### Control Panel API

```javascript
// Update control panel manually
worksona.updateControlPanel();

// Create floating control panel
worksona.createFloatingControlPanel();

// Create control panel in specific container
worksona.createControlPanel('container-id');
```

---

## Examples

### Basic Chat Agent

```javascript
const worksona = new Worksona({
  apiKeys: { openai: 'your-key' }
});

await worksona.loadAgent({
  id: 'helper',
  name: 'Assistant',
  description: 'General purpose assistant',
  config: {
    provider: 'openai',
    model: 'gpt-4o',
    systemPrompt: 'You are a helpful assistant.'
  }
});

const response = await worksona.chat('helper', 'Explain quantum computing');
```

### Customer Service Agent

```javascript
await worksona.loadAgent({
  id: 'customer-service',
  name: 'Sarah',
  description: 'Customer service representative',
  traits: {
    personality: ['empathetic', 'patient', 'professional'],
    knowledge: ['product information', 'return policies', 'troubleshooting'],
    tone: 'friendly and helpful'
  },
  config: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.7,
    systemPrompt: 'You are Sarah, a customer service representative for an e-commerce company. Always be helpful, empathetic, and solution-oriented.',
    examples: [
      {
        user: 'I want to return my order',
        assistant: 'I\'d be happy to help you with your return. Could you please provide your order number so I can look up the details?'
      }
    ]
  }
});
```

### Image Analysis Agent

```javascript
await worksona.loadAgent({
  id: 'vision-analyst',
  name: 'Visual AI',
  description: 'Image analysis specialist',
  traits: {
    personality: ['analytical', 'detail-oriented', 'thorough'],
    knowledge: ['computer vision', 'object recognition', 'visual analysis'],
    tone: 'technical but accessible'
  },
  config: {
    provider: 'openai',
    model: 'gpt-4o',
    systemPrompt: 'You are an expert in visual analysis. Provide detailed, accurate descriptions of images.'
  }
});

// Analyze an image
const analysis = await worksona.processImage('vision-analyst', 
  'https://example.com/product-image.jpg', {
  prompt: 'Analyze this product image for quality control purposes'
});
```

### Multi-Agent Workflow

```javascript
// Load multiple specialized agents
await Promise.all([
  worksona.loadAgent('agents/research-analyst.json'),
  worksona.loadAgent('agents/content-writer.json'),
  worksona.loadAgent('agents/fact-checker.json')
]);

// Research phase
const research = await worksona.chat('research-analyst', 
  'Research the latest trends in sustainable energy');

// Content creation phase
const content = await worksona.chat('content-writer', 
  `Write an article based on this research: ${research}`);

// Fact-checking phase
const factCheck = await worksona.chat('fact-checker', 
  `Verify the accuracy of this article: ${content}`);
```

### Image Generation Workflow

```javascript
// Load creative agent
await worksona.loadAgent({
  id: 'creative-designer',
  name: 'Creative AI',
  description: 'Visual content creator',
  config: {
    provider: 'openai',
    model: 'gpt-4o',
    imageGenerationModel: 'dall-e-3'
  }
});

// Generate concept art
const conceptArt = await worksona.generateImage('creative-designer',
  'A modern minimalist office space with natural lighting');

// Create variations
const variation1 = await worksona.variationImage('creative-designer', conceptArt);
const variation2 = await worksona.variationImage('creative-designer', conceptArt);

// Analyze the results
const analysis = await worksona.processImage('creative-designer', conceptArt, {
  prompt: 'Analyze the design elements and suggest improvements'
});
```

---

## Advanced Usage

### Custom Provider Configuration

```javascript
const worksona = new Worksona({
  apiKeys: {
    openai: 'your-openai-key',
    anthropic: 'your-anthropic-key'
  },
  defaultProvider: 'openai',
  defaultModel: 'gpt-4o'
});

// Override provider per chat
await worksona.chat('agent-id', 'Hello', {
  provider: 'anthropic',
  temperature: 0.9
});
```

### Dynamic Agent Loading

```javascript
// Load agents dynamically based on user needs
const userIntent = analyzeUserIntent(userMessage);

let agentId;
switch (userIntent) {
  case 'technical-question':
    if (!worksona.getAgent('tech-support')) {
      await worksona.loadAgent('agents/tech-support.json');
    }
    agentId = 'tech-support';
    break;
  case 'sales-inquiry':
    if (!worksona.getAgent('sales-agent')) {
      await worksona.loadAgent('agents/sales-agent.json');
    }
    agentId = 'sales-agent';
    break;
}

const response = await worksona.chat(agentId, userMessage);
```

### Performance Monitoring

```javascript
// Monitor agent performance
setInterval(() => {
  const agents = worksona.getAllAgents();
  
  agents.forEach(agent => {
    const metrics = agent.getMetrics();
    const state = agent.getState();
    
    console.log(`Agent ${agent.name}:`, {
      totalQueries: metrics.totalQueries,
      avgResponseTime: metrics.avgResponseTime,
      successRate: metrics.successRate,
      isActive: state.isActive
    });
  });
}, 30000); // Every 30 seconds
```

### Error Recovery

```javascript
async function robustChat(agentId, message, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await worksona.chat(agentId, message);
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error.message);
      
      if (error.code === 'PROVIDER_ERROR' && i < retries - 1) {
        // Try different provider
        const agent = worksona.getAgent(agentId);
        const fallbackProvider = agent.config.provider === 'openai' ? 'anthropic' : 'openai';
        
        try {
          return await worksona.chat(agentId, message, { 
            provider: fallbackProvider 
          });
        } catch (fallbackError) {
          console.warn('Fallback provider also failed:', fallbackError.message);
        }
      }
      
      if (i === retries - 1) throw error;
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Agent Not Found
```javascript
// Check if agent exists before chatting
if (!worksona.getAgent('agent-id')) {
  await worksona.loadAgent('agents/agent-config.json');
}
```

#### 2. API Key Issues
```javascript
// Verify API keys are set
const worksona = new Worksona({
  apiKeys: {
    openai: process.env.OPENAI_API_KEY || 'your-key'
  }
});

// Check provider status in control panel
worksona.on('error', (error) => {
  if (error.code === 'PROVIDER_ERROR') {
    console.log('Check your API keys in the control panel');
  }
});
```

#### 3. Image Processing Failures
```javascript
// Handle image-specific errors
worksona.on('image-processing-error', ({ error }) => {
  if (error.message.includes('image_too_large')) {
    console.log('Reduce image size before processing');
  } else if (error.message.includes('invalid_image_format')) {
    console.log('Use supported formats: JPEG, PNG, WEBP, GIF');
  }
});
```

#### 4. Control Panel Not Showing
```javascript
// Ensure control panel is enabled
const worksona = new Worksona({
  controlPanel: true,  // This is default
  // ... other options
});

// Or create manually
worksona.createFloatingControlPanel();
```

### Debug Mode

Enable debug mode for detailed logging:

```javascript
const worksona = new Worksona({
  debug: true,
  // ... other options
});
```

### Performance Tips

1. **Limit Transaction History**: Agents automatically keep only the last 100 transactions
2. **Use Appropriate Models**: Choose models based on complexity needs
3. **Optimize Temperature**: Lower temperature for consistent responses, higher for creativity
4. **Monitor Metrics**: Use the control panel to track performance

---

## TypeScript Support

Full TypeScript definitions are included (`worksona.d.ts`) with:
- Complete type definitions for all interfaces
- GPT Image model parameter types
- Image editing with multiple image support
- All agent configuration options
- Event handler types

```typescript
import Worksona from 'worksona-js';

const worksona = new Worksona({
  apiKeys: { openai: 'your-key' }
});

// TypeScript will provide autocomplete and type checking
const image = await worksona.generateImage('agent-id', 'prompt', {
  model: 'gpt-image-1.5',  // TypeScript knows valid models
  quality: 'high',          // TypeScript knows valid quality values
  output_format: 'png'      // TypeScript knows valid formats
});
```

## Testing

Worksona.js includes comprehensive automated testing:

- **Unit Tests**: Individual API endpoint tests
- **Integration Tests**: Full workflow tests
- **Test Framework**: Jest with Supertest
- **Coverage**: Code coverage reporting available
- **CI/CD**: GitHub Actions workflow included

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm run test:api
npm run test:integration
```

See [`docs/API_TESTING_GUIDE.md`](docs/API_TESTING_GUIDE.md) for complete testing documentation.

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions welcome! Please read the contributing guidelines and submit pull requests.

## Support

- GitHub Issues: [Repository Issues](https://github.com/worksona/worksona-js/issues)
- Documentation: [Full Documentation](docs/WORKSONA_JS_FEATURES.md)
- Examples: [Code Examples Hub](www/docs/code-examples-hub.html)
- Testing Guide: [API Testing Guide](docs/API_TESTING_GUIDE.md)

---

**Worksona.js** - Intelligent agent management made simple. 
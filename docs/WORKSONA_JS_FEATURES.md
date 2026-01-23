# Worksona.js Features and Capabilities

**Version:** 0.2.0  
**Last Updated:** January 2026

## Overview

Worksona.js is a lightweight, single-file JavaScript library for deploying and managing AI agents with distinct personalities across multiple LLM providers. It provides a unified interface for interacting with OpenAI, Anthropic, and Google's latest frontier models.

## Key Features

### 🎯 Core Capabilities

- **Multi-Provider Support**: Seamlessly switch between OpenAI, Anthropic, and Google providers
- **Latest Frontier Models**: Support for GPT-5, Claude Opus 4.5, Claude Sonnet 4.5, o3 reasoning models, and GPT Image 1.5
- **Agent Management**: Create, load, configure, and manage multiple AI agents with distinct personalities
- **Image Processing**: Generate, edit, analyze, and process images with vision models
- **Event-Driven Architecture**: Subscribe to events for agent lifecycle, chat, and image operations
- **Real-Time Control Panel**: Built-in browser-based control panel for development and debugging
- **Zero Runtime Dependencies**: Self-contained library with no external dependencies
- **Transaction History**: Automatic tracking of all agent interactions with metrics

---

## Supported Models

### OpenAI Models

#### Latest GPT-5 Series
- `gpt-5` - Most advanced model for complex reasoning
- `gpt-5-mini` - Balanced performance and cost
- `gpt-5-nano` - Fast and cost-effective

#### Reasoning Models (o-series)
- `o3` - Advanced reasoning capabilities
- `o3-mini` - Lightweight reasoning model
- `o1` - Original reasoning model
- `o1-mini` - Compact reasoning model
- `o1-preview` - Preview version

#### GPT-4 Series
- `gpt-4o` - Latest GPT-4 optimized model (default)
- `gpt-4o-mini` - Faster GPT-4 variant
- `gpt-4-turbo` - High-performance GPT-4
- `gpt-4` - Standard GPT-4
- `gpt-4-32k` - Extended context window

#### Vision Models
- `gpt-4o-vision` - Vision-capable GPT-4o
- `gpt-4-turbo-vision` - Vision-capable GPT-4 Turbo

#### GPT-3.5 Series
- `gpt-3.5-turbo` - Fast and cost-effective
- `gpt-3.5-turbo-16k` - Extended context

#### Image Generation Models
- `gpt-image-1.5` - Latest GPT Image model with transparency support
- `gpt-image-1` - GPT Image model with advanced features
- `gpt-image-1-mini` - Cost-effective image generation
- `dall-e-3` - DALL-E 3 (legacy)
- `dall-e-2` - DALL-E 2 (legacy)

### Anthropic Models

#### Claude 4.5 Series (Latest)
- `claude-opus-4-5-20251101` - Most capable Claude model
- `claude-sonnet-4-5-20250929` - Balanced performance

#### Claude 3.5 Series
- `claude-3-5-sonnet-20241022` - High-performance Claude
- `claude-3-5-haiku-20241022` - Fast Claude variant

#### Claude 3 Series
- `claude-3-opus-20240229` - Original Opus model
- `claude-3-sonnet-20240229` - Original Sonnet model
- `claude-3-haiku-20240307` - Original Haiku model

### Google Models

- `gemini-pro` - Google's Gemini Pro model
- `gemini-pro-vision` - Vision-capable Gemini Pro

---

## API Reference

### Constructor

```javascript
const worksona = new Worksona(options)
```

**Options:**
- `apiKeys` (object): API keys for providers
  - `openai` (string): OpenAI API key
  - `anthropic` (string): Anthropic API key
  - `google` (string): Google API key
- `debug` (boolean): Enable debug logging (default: `false`)
- `defaultProvider` (string): Default provider (default: `'openai'`)
- `defaultModel` (string): Default model (default: `'gpt-4o'`)
- `controlPanel` (boolean): Enable control panel (default: `true` in browser)

**Example:**
```javascript
const worksona = new Worksona({
  apiKeys: {
    openai: 'sk-...',
    anthropic: 'sk-ant-...',
    google: 'AIza...'
  },
  debug: true,
  defaultProvider: 'openai',
  defaultModel: 'gpt-5'
});
```

---

## Agent Management

### Load Agent

```javascript
await worksona.loadAgent(config)
```

Loads a new agent with the specified configuration.

**Parameters:**
- `config` (object|string): Agent configuration object or path to JSON file

**Agent Configuration:**
```javascript
{
  id: 'agent-id',              // Required: Unique identifier
  name: 'Agent Name',          // Required: Display name
  description: 'Description',  // Optional: Agent description
  config: {
    provider: 'openai',         // Required: 'openai', 'anthropic', or 'google'
    model: 'gpt-5',            // Required: Model identifier
    temperature: 0.7,          // Optional: 0-2, default 0.7
    max_completion_tokens: 1000,           // Optional: Maximum tokens
    systemPrompt: '...',       // Optional: System prompt
    examples: [                // Optional: Example conversations
      { user: '...', assistant: '...' }
    ],
    traits: {                  // Optional: Personality traits
      personality: '...',
      tone: '...'
    }
  }
}
```

**Returns:** `Agent` object or `null` on error

**Example:**
```javascript
const agent = await worksona.loadAgent({
  id: 'research-analyst',
  name: 'Research Analyst',
  config: {
    provider: 'openai',
    model: 'gpt-5',
    temperature: 0.7,
    systemPrompt: 'You are a research analyst...'
  }
});
```

### Get Agent

```javascript
worksona.getAgent(agentId)
```

Retrieves an agent by ID.

**Parameters:**
- `agentId` (string): Agent identifier

**Returns:** `Agent` object or `undefined`

### Get All Agents

```javascript
worksona.getAllAgents()
```

Returns an array of all loaded agents.

**Returns:** `Array<Agent>`

### Remove Agent

```javascript
worksona.removeAgent(agentId)
```

Removes an agent from the system.

**Parameters:**
- `agentId` (string): Agent identifier

**Returns:** `boolean` - `true` if removed, `false` if not found

### Get Agent History

```javascript
worksona.getAgentHistory(agentId)
```

Retrieves transaction history for an agent.

**Parameters:**
- `agentId` (string): Agent identifier

**Returns:** `Array<Transaction>` - Array of transaction objects

**Transaction Object:**
```javascript
{
  timestamp: Date,
  query: string,
  response: string,
  duration: number,  // milliseconds
  error: Error|null,
  provider: string,
  model: string
}
```

### Get Agent Metrics

```javascript
worksona.getAgentMetrics(agentId)
```

Retrieves performance metrics for an agent.

**Parameters:**
- `agentId` (string): Agent identifier

**Returns:** `Metrics` object or `null`

**Metrics Object:**
```javascript
{
  totalQueries: number,
  avgResponseTime: number,  // milliseconds
  lastActive: Date,
  successRate: number,      // 0-1
  errorCount: number
}
```

### Get Agent State

```javascript
worksona.getAgentState(agentId)
```

Retrieves current state of an agent.

**Parameters:**
- `agentId` (string): Agent identifier

**Returns:** `AgentState` object or `null`

**AgentState Object:**
```javascript
{
  isActive: boolean,
  currentProvider: string,
  currentModel: string,
  lastError: Error|null
}
```

---

## Chat & Messaging

### Chat

```javascript
await worksona.chat(agentId, message, options)
```

Sends a message to an agent and receives a response.

**Parameters:**
- `agentId` (string): Agent identifier
- `message` (string): User message
- `options` (object): Optional chat parameters
  - `temperature` (number): 0-2, controls randomness
  - `maxTokens` (number): Maximum response tokens
  - `topP` (number): Nucleus sampling parameter
  - `frequencyPenalty` (number): -2 to 2
  - `presencePenalty` (number): -2 to 2
  - `provider` (string): Override agent's provider
  - `model` (string): Override agent's model

**Returns:** `Promise<string|null>` - Response text or `null` on error

**Example:**
```javascript
const response = await worksona.chat('research-analyst', 'What is quantum computing?', {
  temperature: 0.7,
  maxTokens: 500
});
```

---

## Image Processing

### Generate Image

```javascript
await worksona.generateImage(agentId, prompt, options)
```

Generates an image using GPT Image models or DALL-E.

**Parameters:**
- `agentId` (string): Agent identifier (can be any agent ID)
- `prompt` (string): Image description
- `options` (object): Generation options
  - `model` (string): Image model (`gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`, `dall-e-3`, `dall-e-2`)
  - `size` (string): Image size (`1024x1024`, `1536x1024`, `1024x1536`, `auto`)
  - `quality` (string): Quality level (`auto`, `high`, `medium`, `low` for GPT Image; `standard`, `hd` for DALL-E)
  - `output_format` (string): Format (`png`, `jpeg`, `webp` for GPT Image)
  - `background` (string): Background (`auto`, `transparent`, `opaque` for GPT Image)
  - `n` (number): Number of images (1-10)
  - `moderation` (boolean): Content moderation (GPT Image)
  - `stream` (boolean): Streaming mode (GPT Image)

**Returns:** `Promise<string|null>` - Image URL (DALL-E) or base64 data URL (GPT Image)

**Example:**
```javascript
const imageUrl = await worksona.generateImage('image-agent', 'A futuristic city at sunset', {
  model: 'gpt-image-1.5',
  size: '1024x1024',
  quality: 'high',
  output_format: 'png',
  background: 'transparent'
});
```

### Edit Image

```javascript
await worksona.editImage(agentId, imageData, prompt, options)
```

Edits an existing image using GPT Image models.

**Parameters:**
- `agentId` (string): Agent identifier
- `imageData` (string): Base64 image data or URL
- `prompt` (string): Edit instruction
- `options` (object): Edit options
  - `model` (string): Image model (`gpt-image-1`, `gpt-image-1.5`)
  - `input_fidelity` (number): 0-1, how much to preserve original (GPT Image 1 only)
  - `mask` (string): Optional mask image for selective editing
  - `size` (string): Output size
  - `quality` (string): Quality level
  - `output_format` (string): Output format

**Returns:** `Promise<string|null>` - Edited image as base64 data URL

**Example:**
```javascript
const editedImage = await worksona.editImage('image-agent', base64Image, 'Add a rainbow in the sky', {
  model: 'gpt-image-1',
  input_fidelity: 0.8
});
```

### Process Image (Analyze)

```javascript
await worksona.processImage(agentId, imageData, options)
```

Analyzes an image using vision models.

**Parameters:**
- `agentId` (string): Agent identifier
- `imageData` (string): Image URL or base64 data
- `options` (object): Analysis options
  - `prompt` (string): Analysis prompt/question
  - `detail` (string): Image detail level (`'auto'`, `'low'`, `'high'`)

**Returns:** `Promise<string|null>` - Analysis text

**Example:**
```javascript
const analysis = await worksona.processImage('vision-agent', imageUrl, {
  prompt: 'What objects are in this image?',
  detail: 'high'
});
```

### Analyze Image (Alias)

```javascript
await worksona.analyzeImage(agentId, imageData, options)
```

Alias for `processImage()`.

### Variation Image

```javascript
await worksona.variationImage(agentId, imageData, options)
```

Creates variations of an image (DALL-E only).

**Parameters:**
- `agentId` (string): Agent identifier
- `imageData` (string): Base64 image data
- `options` (object): Variation options
  - `n` (number): Number of variations (1-10)
  - `size` (string): Output size

**Returns:** `Promise<string|null>` - Variation image URL

---

## Event System

### Subscribe to Events

```javascript
worksona.on(event, handler)
```

Subscribe to library events.

**Parameters:**
- `event` (string): Event name
- `handler` (function): Event handler function

**Available Events:**
- `agent-loaded` - Agent successfully loaded
- `agent-removed` - Agent removed
- `chat-start` - Chat request started
- `chat-complete` - Chat request completed
- `image-generation-start` - Image generation started
- `image-generation-complete` - Image generation completed
- `image-analysis-start` - Image analysis started
- `image-analysis-complete` - Image analysis completed
- `error` - Error occurred

**Example:**
```javascript
worksona.on('chat-complete', (data) => {
  console.log(`Agent ${data.agentId} responded in ${data.duration}ms`);
});

worksona.on('error', (error) => {
  console.error(`Error [${error.code}]: ${error.message}`);
});
```

### Unsubscribe from Events

```javascript
worksona.off(event, handler)
```

Remove an event handler.

**Parameters:**
- `event` (string): Event name
- `handler` (function): Handler function to remove

---

## Control Panel

### Create Control Panel

```javascript
worksona.createControlPanel(containerId)
```

Creates a control panel in a specified container element.

**Parameters:**
- `containerId` (string): ID of container element

**Returns:** `boolean` - `true` if created successfully

### Create Floating Control Panel

```javascript
worksona.createFloatingControlPanel()
```

Creates a floating control panel (default in browser).

**Returns:** `void`

### Update Control Panel

```javascript
worksona.updateControlPanel()
```

Refreshes the control panel display.

**Returns:** `void`

**Control Panel Features:**
- API key management
- Agent list and status
- Agent configuration viewing
- Transaction history
- Metrics display
- Real-time status indicators

---

## Utility Methods

### Get Agents (Alias)

```javascript
worksona.getAgents()
```

Alias for `getAllAgents()`.

**Returns:** `Array<Agent>`

---

## Error Handling

Worksona.js provides comprehensive error handling with specific error codes:

- `AGENT_NOT_FOUND` - Agent doesn't exist
- `PROVIDER_ERROR` - Provider configuration issue
- `CONFIG_ERROR` - Invalid agent configuration
- `AGENT_LOAD_ERROR` - Failed to load agent
- `CHAT_ERROR` - Chat request failed
- `IMAGE_PROCESSING_ERROR` - Image operation failed

Errors are emitted via the `error` event and can be caught using try-catch blocks.

---

## Usage Examples

### Basic Chat

```javascript
const worksona = new Worksona({
  apiKeys: { openai: 'sk-...' }
});

await worksona.loadAgent({
  id: 'assistant',
  name: 'Assistant',
  config: {
    provider: 'openai',
    model: 'gpt-5',
    temperature: 0.7
  }
});

const response = await worksona.chat('assistant', 'Hello!');
console.log(response);
```

### Image Generation

```javascript
const imageUrl = await worksona.generateImage('image-agent', 'A sunset over mountains', {
  model: 'gpt-image-1.5',
  size: '1024x1024',
  quality: 'high',
  output_format: 'png',
  background: 'transparent'
});

// Display image
const img = document.createElement('img');
img.src = imageUrl;
document.body.appendChild(img);
```

### Event Handling

```javascript
worksona.on('chat-complete', (data) => {
  console.log(`Response: ${data.response}`);
  console.log(`Duration: ${data.duration}ms`);
});

worksona.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});
```

### Multi-Agent System

```javascript
// Load multiple agents
await worksona.loadAgent({
  id: 'researcher',
  name: 'Researcher',
  config: { provider: 'openai', model: 'gpt-5' }
});

await worksona.loadAgent({
  id: 'writer',
  name: 'Writer',
  config: { provider: 'anthropic', model: 'claude-opus-4-5-20251101' }
});

// Use different agents for different tasks
const research = await worksona.chat('researcher', 'Research quantum computing');
const article = await worksona.chat('writer', `Write an article about: ${research}`);
```

---

## Browser vs Node.js

Worksona.js works in both browser and Node.js environments:

- **Browser**: Full support including control panel
- **Node.js**: All core features except control panel (requires DOM)

---

## Best Practices

1. **API Key Security**: Never expose API keys in client-side code. Use environment variables or secure backend storage.

2. **Error Handling**: Always handle errors and subscribe to error events.

3. **Agent Configuration**: Use descriptive agent IDs and names for better organization.

4. **Model Selection**: Choose models based on your needs:
   - GPT-5/Claude Opus 4.5: Complex reasoning tasks
   - GPT-4o/Claude Sonnet 4.5: General purpose
   - GPT-3.5/Gemini Pro: Cost-effective options

5. **Transaction History**: Monitor agent metrics to optimize performance and costs.

6. **Event-Driven Architecture**: Use events for logging, analytics, and UI updates.

---

## Version History

- **0.2.0** - Current version with GPT-5, Claude 4.5, and GPT Image support
- **0.1.0** - Initial release

---

## License

See LICENSE file for details.

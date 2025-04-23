# Worksona.js - LLM Agent Management API

Worksona.js is a lightweight, single-file JavaScript library that enables you to create and manage AI agents with distinct personalities across multiple LLM providers. With just one JavaScript file and minimal setup, you can deploy intelligent agents for customer service, technical support, sales, and more.

## Quick Start

### 1. Include the Script

Simply include the Worksona.js file in your HTML:

```html
<script src="worksona.js"></script>
```

Or install via npm:

```bash
npm install worksona
```

### 2. Initialize with API Keys

Create a new Worksona instance with your API keys:

```javascript
const worksona = new Worksona({
  apiKeys: {
    openai: 'your-openai-key',
    anthropic: 'your-anthropic-key',
    google: 'your-google-key'
  },
  debug: true  // Enable debug logging (optional)
});
```

### 3. Load an Agent

Load an agent from a JSON configuration file or object:

```javascript
// Load from URL
await worksona.loadAgent('agents/customer-service.json');

// Or load from object
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
    model: 'gpt-4-turbo-preview',
    temperature: 0.7
  }
});
```

### 4. Chat with the Agent

Send messages and receive responses:

```javascript
const response = await worksona.chat('customer-service', 'How do I return an item?');
console.log(response);
```

## Agent Configuration

Agents are defined using JSON configuration files. Here's a complete example:

```json
{
  "id": "technical-support",
  "name": "Alex Tech",
  "description": "Senior technical support engineer with 10 years of experience",
  "traits": {
    "personality": [
      "analytical",
      "patient",
      "detail-oriented",
      "problem-solver"
    ],
    "knowledge": [
      "software troubleshooting",
      "network configuration",
      "hardware diagnostics",
      "system administration"
    ],
    "tone": "professional and educational",
    "background": "Computer Science degree from MIT, previously worked at major tech companies"
  },
  "config": {
    "provider": "openai",
    "model": "gpt-4-turbo-preview",
    "temperature": 0.5,
    "maxTokens": 800,
    "systemPrompt": "You are Alex, a senior technical support engineer...",
    "examples": [
      {
        "user": "My computer won't boot up",
        "assistant": "I understand how frustrating that can be. Let's diagnose this step by step. First, can you tell me if you see any lights or hear any sounds when you press the power button?"
      }
    ]
  }
}
```

## API Reference

### Constructor Options

```javascript
new Worksona({
  apiKeys: {
    openai: 'key',      // OpenAI API key
    anthropic: 'key',   // Anthropic API key
    google: 'key'       // Google API key
  },
  debug: false,         // Enable debug logging
  defaultProvider: 'openai',
  defaultModel: 'gpt-4-turbo-preview'
});
```

### Core Methods

#### loadAgent(config)
Loads an agent from a JSON file URL or configuration object.

**Parameters:**
- `config` (string|object): URL to JSON file or agent configuration object

**Returns:** Promise<Agent|null>

**Example:**
```javascript
// Load from URL
const agent = await worksona.loadAgent('agents/sales.json');

// Load from object
const agent = await worksona.loadAgent({
  id: 'sales-agent',
  name: 'Emma',
  description: 'Sales specialist'
});
```

#### chat(agentId, message, options)
Sends a message to an agent and receives a response.

**Parameters:**
- `agentId` (string): ID of the agent to chat with
- `message` (string): Message to send
- `options` (object, optional): Override options
  - `provider`: Override the agent's default provider
  - `temperature`: Override temperature setting
  - `maxTokens`: Override max tokens

**Returns:** Promise<string|null>

**Example:**
```javascript
const response = await worksona.chat('customer-service', 'I need help with my order');

// With options
const response = await worksona.chat('sales-agent', 'Tell me about pricing', {
  temperature: 0.8,
  provider: 'anthropic'
});
```

#### getAgent(agentId)
Retrieves an agent by ID.

**Parameters:**
- `agentId` (string): ID of the agent

**Returns:** Agent|undefined

**Example:**
```javascript
const agent = worksona.getAgent('technical-support');
if (agent) {
  console.log(agent.name); // "Alex Tech"
}
```

#### getAllAgents()
Gets all loaded agents.

**Returns:** Agent[]

**Example:**
```javascript
const agents = worksona.getAllAgents();
agents.forEach(agent => {
  console.log(`${agent.name} (${agent.id})`);
});
```

#### removeAgent(agentId)
Removes an agent from the system.

**Parameters:**
- `agentId` (string): ID of the agent to remove

**Returns:** boolean

**Example:**
```javascript
const removed = worksona.removeAgent('old-agent');
console.log(removed ? 'Agent removed' : 'Agent not found');
```

### Event Handling

#### on(event, handler)
Subscribes to an event.

**Parameters:**
- `event` (string): Event name
- `handler` (function): Event handler function

**Events:**
- `agent-loaded`: Fired when an agent is loaded
- `agent-removed`: Fired when an agent is removed
- `chat-start`: Fired when a chat request starts
- `chat-complete`: Fired when a chat completes
- `error`: Fired when an error occurs

**Example:**
```javascript
worksona.on('agent-loaded', (agent) => {
  console.log(`Agent ${agent.name} is ready!`);
});

worksona.on('error', (error) => {
  console.error(`Error: ${error.message} (${error.code})`);
});
```

#### off(event, handler)
Unsubscribes from an event.

**Example:**
```javascript
const handler = (data) => console.log(data);
worksona.on('chat-complete', handler);
// Later...
worksona.off('chat-complete', handler);
```

### Development Tools

#### createControlPanel(containerId)
Creates a visual control panel for testing agents.

**Parameters:**
- `containerId` (string): ID of the container element

**Example:**
```html
<div id="control-panel"></div>
<script>
  worksona.createControlPanel('control-panel');
</script>
```

#### createFloatingControlPanel()
Creates a floating control panel button in the bottom right corner that opens a modal control panel when clicked. This is the easiest way to integrate the control panel.

**Example:**
```javascript
// Create floating control panel with a single line
const worksona = new Worksona({
  apiKeys: {/* your API keys */},
  controlPanel: true // Automatically creates floating control panel
});

// Or create it manually
worksona.createFloatingControlPanel();
```

## Common Use Cases

### 1. Customer Service Chatbot

```javascript
// Initialize with customer service agent
const worksona = new Worksona({
  apiKeys: { openai: 'your-key' }
});

await worksona.loadAgent({
  id: 'customer-service',
  name: 'Support Bot',
  description: 'Handles customer inquiries',
  traits: {
    personality: ['helpful', 'patient'],
    knowledge: ['product info', 'policies'],
    tone: 'friendly'
  }
});

// Handle customer messages
async function handleCustomerMessage(message) {
  const response = await worksona.chat('customer-service', message);
  displayResponse(response);
}
```

### 2. Multi-Agent System

```javascript
// Load multiple agents for different departments
const agents = [
  'agents/sales.json',
  'agents/support.json',
  'agents/billing.json'
];

await Promise.all(agents.map(url => worksona.loadAgent(url)));

// Route messages to appropriate agent
async function routeMessage(message) {
  let agentId = 'support'; // default
  
  if (message.includes('price') || message.includes('buy')) {
    agentId = 'sales';
  } else if (message.includes('invoice') || message.includes('payment')) {
    agentId = 'billing';
  }
  
  return await worksona.chat(agentId, message);
}
```

### 3. Context-Aware Conversations

```javascript
// Maintain conversation history
const conversations = new Map();

async function chatWithContext(sessionId, agentId, message) {
  // Get or create conversation history
  if (!conversations.has(sessionId)) {
    conversations.set(sessionId, []);
  }
  
  const history = conversations.get(sessionId);
  
  // Build context from history
  const contextMessage = history.length > 0
    ? `Previous conversation:\n${history.slice(-3).join('\n')}\n\nUser: ${message}`
    : message;
  
  // Get response
  const response = await worksona.chat(agentId, contextMessage);
  
  // Update history
  history.push(`User: ${message}`);
  history.push(`Agent: ${response}`);
  
  return response;
}
```

### 4. Error Handling

```javascript
// Robust error handling
worksona.on('error', (error) => {
  switch (error.code) {
    case 'AGENT_NOT_FOUND':
      console.error('Agent does not exist');
      break;
    case 'PROVIDER_ERROR':
      console.error('LLM provider error:', error.message);
      // Try fallback provider
      retryWithDifferentProvider(error);
      break;
    case 'RATE_LIMIT':
      console.error('Rate limit exceeded');
      // Implement exponential backoff
      setTimeout(() => retryRequest(), 5000);
      break;
    default:
      console.error('Unexpected error:', error);
  }
});

async function safeChat(agentId, message) {
  try {
    return await worksona.chat(agentId, message);
  } catch (error) {
    // Fallback response
    return "I'm experiencing technical difficulties. Please try again.";
  }
}
```

## Provider Support

Worksona supports three major LLM providers:

### OpenAI
- Default model: `gpt-4-turbo-preview`
- Models available: `gpt-4`, `gpt-4-turbo-preview`, `gpt-3.5-turbo`

### Anthropic
- Default model: `claude-3-opus-20240229`
- Models available: `claude-3-opus-20240229`, `claude-3-sonnet-20240229`

### Google
- Default model: `gemini-pro`
- Models available: `gemini-pro`, `gemini-pro-vision`

## Best Practices

1. **API Key Security**: Never expose API keys in client-side code
2. **Error Handling**: Always implement proper error handling
3. **Rate Limiting**: Implement rate limiting for production use
4. **Context Management**: Maintain conversation context for better responses
5. **Agent Specialization**: Create focused agents for specific tasks
6. **Testing**: Use the control panel for development and testing

## License

MIT License - Free for personal and commercial use.

## Support

For issues, questions, or contributions, please visit our GitHub repository.

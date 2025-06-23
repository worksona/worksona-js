# Getting Started with Worksona.js
**Version:** 0.1.2  
**Date:** 2025-05-11

## Installation
Include the Worksona.js file in your project:
```html
<script src="path/to/worksona.js"></script>
```

## Configuration
Initialize Worksona with your API keys and options:
```javascript
const worksona = new Worksona({
  debug: true,
  defaultProvider: 'openai',
  defaultModel: 'gpt-4o',
  apiKeys: {
    openai: 'your-openai-api-key',
    anthropic: 'your-anthropic-api-key',
    google: 'your-google-api-key'
  }
});
```

## Loading an Agent
Create an agent configuration and load it:
```javascript
const agentConfig = {
  id: 'agent1',
  name: 'Assistant',
  description: 'A helpful assistant',
  provider: 'openai',
  model: 'gpt-4o',
  systemPrompt: 'You are a helpful assistant.',
  examples: [
    { user: 'Hello', assistant: 'Hi there!' }
  ]
};
const agent = await worksona.loadAgent(agentConfig);
```

## Sending a Chat Message
Interact with your agent:
```javascript
const response = await worksona.chat('agent1', 'Hello, how are you?');
console.log(response);
```

## Analyzing an Image
Use the agent to analyze an image:
```javascript
const imageUrl = 'https://example.com/image.jpg';
const analysis = await worksona.analyzeImage('agent1', imageUrl, { prompt: 'Describe this image.' });
console.log(analysis);
```

## Generating an Image
Generate images using the agent:
```javascript
const imageUrl = await worksona.generateImage('agent1', 'A beautiful sunset over the ocean', { size: '1024x1024' });
console.log(imageUrl);
```

## Events
Listen for events to track agent operations:
```javascript
worksona.on('agent-loaded', (data) => {
  console.log('Agent loaded:', data);
});

worksona.on('chat-complete', (data) => {
  console.log('Chat complete:', data);
});

worksona.on('image-analysis-complete', (data) => {
  console.log('Image analysis complete:', data);
});

worksona.on('image-generation-complete', (data) => {
  console.log('Image generation complete:', data);
});

worksona.on('error', (error) => {
  console.error('Error:', error);
});
```

## Error Handling
Worksona.js provides detailed error messages for various scenarios. Errors are emitted as events and can be caught using the `on('error', ...)` method. 
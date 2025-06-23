# Worksona.js API Reference
**Version:** 0.1.2  
**Date:** 2025-05-11

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Agent Management](#agent-management)
- [Chat and Image Analysis](#chat-and-image-analysis)
- [Image Generation](#image-generation)
- [Events](#events)
- [Error Handling](#error-handling)

## Overview
Worksona.js is a lightweight, single-file solution for deploying and managing AI agents with distinct personalities across multiple LLM providers. It supports chat, image analysis, and image generation capabilities.

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

## Agent Management
### Loading an Agent
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

### Getting Agent Information
```javascript
const agent = worksona.getAgent('agent1');
const history = worksona.getAgentHistory('agent1');
const metrics = worksona.getAgentMetrics('agent1');
const state = worksona.getAgentState('agent1');
```

### Removing an Agent
```javascript
worksona.removeAgent('agent1');
```

## Chat and Image Analysis
### Sending a Chat Message
```javascript
const response = await worksona.chat('agent1', 'Hello, how are you?');
```

### Analyzing an Image
```javascript
const imageUrl = 'https://example.com/image.jpg';
const analysis = await worksona.analyzeImage('agent1', imageUrl, { prompt: 'Describe this image.' });
```

## Image Generation
### Generating an Image
```javascript
const imageUrl = await worksona.generateImage('agent1', 'A beautiful sunset over the ocean', { size: '1024x1024' });
```

### Editing an Image
```javascript
const base64Image = 'data:image/png;base64,...';
const editedImageUrl = await worksona.editImage('agent1', base64Image, 'Add a rainbow to the sky', { size: '1024x1024' });
```

### Creating an Image Variation
```javascript
const base64Image = 'data:image/png;base64,...';
const variationImageUrl = await worksona.variationImage('agent1', base64Image, { size: '1024x1024' });
```

## Events
Worksona.js emits events for various operations. Listen for events using the `on` method:
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
# Worksona API Reference

## Core Methods

### Agent Management
- `worksona.loadAgent(config)` - Load an agent configuration
- `worksona.getAgent(agentId)` - Retrieve agent information
- `worksona.getAllAgents()` - Get all loaded agents
- `worksona.removeAgent(agentId)` - Remove an agent
- `worksona.getAgentHistory(agentId)` - Get agent's conversation history
- `worksona.getAgentMetrics(agentId)` - Get agent's performance metrics
- `worksona.getAgentState(agentId)` - Get agent's current state

### Chat & Interaction
- `worksona.chat(agentId, message, options)` - Send message to agent
- `worksona._formatMessages(provider, agent, message)` - Format messages for provider

### Image Analysis
- `worksona.analyzeImage(agentId, imageData, options)` - Analyze image content
- `worksona.extractImageText(agentId, imageData, options)` - Extract text from images
- `worksona.detectImageObjects(agentId, imageData, options)` - Detect objects in images
- `worksona.classifyImage(agentId, imageData, options)` - Classify image content
- `worksona._processImageData(imageData)` - Process image data for analysis

### Image Generation
- `worksona.generateImage(agentId, prompt, options)` - Generate an image from a text prompt
- `worksona.editImage(agentId, imageData, prompt, options)` - Edit an image based on a prompt
- `worksona.variationImage(agentId, imageData, options)` - Create variations of an image

### Configuration & Settings
- `worksona.updateApiKeys(keys)` - Update API keys
- `worksona.updateLLMConfig(config)` - Update LLM settings
- `worksona.testProvider(provider)` - Test API connection
- `worksona._initializeProviders()` - Initialize API clients

### Control Panel
- `worksona.createControlPanel(containerId)` - Create control panel
- `worksona.createFloatingControlPanel()` - Create floating control panel
- `worksona.updateControlPanel()` - Update control panel display
- `worksona._updateProviderStatus()` - Update provider status indicators
- `worksona._updateAgentList()` - Update agent list display

## Events

### Agent Events
- `worksona.on('agent-loaded', handler)` - Agent loaded
- `worksona.on('agent-removed', handler)` - Agent removed
- `worksona.on('api-keys-updated', handler)` - API keys updated

### Chat Events
- `worksona.on('chat-start', handler)` - Chat started
- `worksona.on('chat-complete', handler)` - Chat completed
- `worksona.on('error', handler)` - Error occurred

### Image Analysis Events
- `worksona.on('image-analysis-start', handler)` - Image analysis started
- `worksona.on('image-analysis-complete', handler)` - Image analysis completed
- `worksona.on('image-processing-error', handler)` - Image processing error occurred

### Provider Events
- `worksona.on('provider-status', handler)` - Provider status changed
- `worksona.on('api-key-update', handler)` - API key updated

## Event Handling
- `worksona.on(event, handler)` - Add event listener
- `worksona.off(event, handler)` - Remove event listener
- `worksona._emit(event, data)` - Emit event
- `worksona._handleError(error, code, message)` - Handle errors

## Utility Methods
- `worksona._log(message, level)` - Logging utility
- `worksona._escapeHtml(unsafe)` - HTML escaping utility
- `worksona._setupEventListeners(container)` - Setup event listeners
- `worksona._setupAgentEventListeners()` - Setup agent event listeners
- `worksona._testProviderConnections()` - Test provider connections

## Implementation Notes
The implementation should properly use these Worksona.js API methods for:
- Agent management (loading, configuration, state)
- Chat functionality (sending/receiving messages)
- Image analysis (content analysis, text extraction, object detection)
- Image generation (text-to-image generation, image editing, image variation)
- API key management (updating, testing)
- LLM configuration (provider settings, model options)
- Error handling (catch and process errors)
- Event handling (subscribe to relevant events)
- Control panel management (UI updates, status)

- All agents now support both image analysis and image generation using the gpt-4o model (OpenAI).
- You do not need a special agent for image analysis or generation; any agent can use these capabilities if configured with a vision-capable model (e.g., gpt-4o).

## Best Practices
1. Always initialize Worksona with proper API keys
2. Handle all relevant events for robust error handling
3. Use the control panel for development and debugging
4. Test provider connections before production use
5. Monitor agent metrics and performance
6. Keep agent configurations organized and documented
7. Optimize image data before analysis to improve performance
8. Handle image processing errors gracefully
9. Implement proper image data validation
10. Consider image size and format limitations

## Example: Image Analysis and Generation

```js
const worksona = new Worksona({
  apiKeys: { openai: 'sk-...' }
});

// Load a general-purpose agent
await worksona.loadAgent({
  id: 'creative-agent',
  name: 'Creative Agent',
  config: { provider: 'openai', model: 'gpt-4o' }
});

// Analyze an image
const analysis = await worksona.analyzeImage('creative-agent', imageData);
console.log('Analysis:', analysis);

// Generate an image from a prompt
const generatedImage = await worksona.generateImage('creative-agent', 'A futuristic cityscape at sunset');
console.log('Generated Image URL:', generatedImage);
```
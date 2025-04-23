/**
 * Worksona.js - LLM Agent Management API
 * Version: 1.0.0
 * 
 * A lightweight, single-file solution for deploying and managing AI agents
 * with distinct personalities across multiple LLM providers.
 */

'use strict';

// Agent class for managing agent state and history
class Agent {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    
    // Normalize config to prevent nesting problems
    if (config.config) {
      // If there's a nested config, flatten it
      this.config = {
        ...config,
        ...config.config,
      };
      // Remove the nested config to avoid circular structure
      delete this.config.config;
    } else {
      this.config = config;
    }
    
    // Store system prompt and examples directly
    this.systemPrompt = this.config.systemPrompt;
    this.examples = this.config.examples || [];
    
    // If traits are in config, move them to top level
    if (this.config.traits) {
      this.traits = this.config.traits;
    }
    
    this.transactions = [];
    this.metrics = {
      totalQueries: 0,
      avgResponseTime: 0,
      lastActive: null,
      successRate: 1.0,
      errorCount: 0
    };
    this.state = {
      isActive: true,
      currentProvider: this.config.provider || 'openai',
      currentModel: this.config.model,
      lastError: null
    };
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
    this.metrics.totalQueries++;
    this.metrics.lastActive = new Date();
    
    // Update average response time
    if (transaction.duration) {
      const totalTime = this.metrics.avgResponseTime * (this.metrics.totalQueries - 1) + transaction.duration;
      this.metrics.avgResponseTime = totalTime / this.metrics.totalQueries;
    }

    // Update success rate if there was an error
    if (transaction.error) {
      this.metrics.errorCount++;
      this.metrics.successRate = (this.metrics.totalQueries - this.metrics.errorCount) / this.metrics.totalQueries;
      this.state.lastError = transaction.error;
    }

    // Keep only last 100 transactions to manage memory
    if (this.transactions.length > 100) {
      this.transactions = this.transactions.slice(-100);
    }
  }

  getHistory() {
    return this.transactions;
  }

  getMetrics() {
    return this.metrics;
  }

  getState() {
    return this.state;
  }
}

(function(global) {
  'use strict';

  class Worksona {
    constructor(options = {}) {
      this.options = {
        debug: false,
        defaultProvider: 'openai',
        defaultModel: 'gpt-3.5-turbo',
        apiKeys: {},
        ...options
      };
      
      this.agents = new Map();
      this.activeProvider = null;
      this.controlPanelId = null;
      this.eventHandlers = {};
      
      this._initializeProviders();

      // Initialize control panel if enabled
      if (options.controlPanel !== false) {
        // Create floating control panel by default
        this.createFloatingControlPanel();
      }
    }

    // Initialize API clients for different providers
    _initializeProviders() {
      this.providers = {
        openai: this.options.apiKeys.openai ? {
          chat: async (agent, message) => {
            try {
              // Use a guaranteed valid model name and ensure there are no spaces or invalid chars
              const modelName = (agent.config.model || this.options.defaultModel || 'gpt-3.5-turbo').trim();
              
              // Log the request details for debugging
              this._log(`Making OpenAI request with model: ${modelName}`, 'info');
              
              const requestBody = {
                model: modelName,
                  messages: [
                  { role: 'system', content: agent.config.systemPrompt || 'You are a helpful assistant.' },
                    ...(agent.config.examples || []).flatMap(ex => [
                      { role: 'user', content: ex.user },
                      { role: 'assistant', content: ex.assistant }
                    ]),
                    { role: 'user', content: message }
                  ],
                  temperature: agent.config.temperature || 0.7,
                max_tokens: agent.config.maxTokens || 500,
                top_p: agent.config.topP || 1,
                frequency_penalty: agent.config.frequencyPenalty || 0,
                presence_penalty: agent.config.presencePenalty || 0,
                stream: false
              };
              
              const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${this.options.apiKeys.openai}`
                },
                body: JSON.stringify(requestBody)
              });

              const data = await response.json();
              
              // Log detailed error information
              if (!response.ok) {
                this._log(`OpenAI API error: ${JSON.stringify(data)}`, 'error');
                throw new Error(data.error?.message || `OpenAI API error: ${response.status}`);
              }
              
              return data.choices[0].message.content;
            } catch (error) {
              this._log(`OpenAI error details: ${error.message}`, 'error');
              this._handleError(error, 'PROVIDER_ERROR', 'OpenAI request failed');
            }
          },
          defaultModels: {
            chat: 'gpt-3.5-turbo',
            completion: 'gpt-3.5-turbo'
          }
        } : null,

        anthropic: this.options.apiKeys.anthropic ? {
          chat: async (agent, message) => {
            try {
              const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': this.options.apiKeys.anthropic,
                  'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                  model: agent.config.model || 'claude-3-opus-20240229',
                  max_tokens: agent.config.maxTokens || 500,
                  temperature: agent.config.temperature || 0.7,
                  system: agent.config.systemPrompt,
                  messages: [
                    ...(agent.config.examples || []).flatMap(ex => [
                      { role: 'user', content: ex.user },
                      { role: 'assistant', content: ex.assistant }
                    ]),
                    { role: 'user', content: message }
                  ],
                  top_p: agent.config.topP || 1,
                  top_k: agent.config.topK || 50,
                  metadata: {
                    user_id: agent.id
                  }
                })
              });

              const data = await response.json();
              if (!response.ok) throw new Error(data.error?.message || 'Anthropic API error');
              return data.content[0].text;
            } catch (error) {
              this._handleError(error, 'PROVIDER_ERROR', 'Anthropic request failed');
            }
          },
          defaultModels: {
            chat: 'claude-3-opus-20240229',
            completion: 'claude-3-sonnet-20240229'
          }
        } : null,

        google: this.options.apiKeys.google ? {
          chat: async (agent, message) => {
            try {
              const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${agent.config.model || 'gemini-pro'}:generateContent?key=${this.options.apiKeys.google}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  contents: [
                    {
                      role: 'user',
                      parts: [
                        {
                          text: agent.config.systemPrompt
                        }
                      ]
                    },
                    ...(agent.config.examples || []).flatMap(ex => [
                      {
                        role: 'user',
                        parts: [{ text: ex.user }]
                      },
                      {
                        role: 'model',
                        parts: [{ text: ex.assistant }]
                      }
                    ]),
                    {
                      role: 'user',
                      parts: [{ text: message }]
                    }
                  ],
                  generationConfig: {
                    temperature: agent.config.temperature || 0.7,
                    maxOutputTokens: agent.config.maxTokens || 500,
                    topP: agent.config.topP || 1,
                    topK: agent.config.topK || 40,
                    candidateCount: 1
                  },
                  safetySettings: [
                    {
                      category: 'HARM_CATEGORY_HARASSMENT',
                      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                      category: 'HARM_CATEGORY_HATE_SPEECH',
                      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    }
                  ]
                })
              });

              const data = await response.json();
              if (!response.ok) throw new Error(data.error?.message || 'Google API error');
              return data.candidates[0].content.parts[0].text;
            } catch (error) {
              this._handleError(error, 'PROVIDER_ERROR', 'Google request failed');
            }
          },
          defaultModels: {
            chat: 'gemini-pro',
            vision: 'gemini-pro-vision'
          }
        } : null
      };
    }

    // Helper function to format messages based on provider
    _formatMessages(provider, agent, message) {
      switch (provider) {
        case 'openai':
          return [
            { role: 'system', content: agent.config.systemPrompt },
            ...(agent.config.examples || []).flatMap(ex => [
              { role: 'user', content: ex.user },
              { role: 'assistant', content: ex.assistant }
            ]),
            { role: 'user', content: message }
          ];

        case 'anthropic':
          return [
            ...(agent.config.examples || []).flatMap(ex => [
              { role: 'user', content: ex.user },
              { role: 'assistant', content: ex.assistant }
            ]),
            { role: 'user', content: message }
          ];

        case 'google':
          return [
            {
              role: 'user',
              parts: [{ text: agent.config.systemPrompt }]
            },
            ...(agent.config.examples || []).flatMap(ex => [
              {
                role: 'user',
                parts: [{ text: ex.user }]
              },
              {
                role: 'model',
                parts: [{ text: ex.assistant }]
              }
            ]),
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ];

        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    }

    // Load an agent from configuration
    async loadAgent(config) {
      if (!config.id || !config.name) {
        this._handleError(new Error('Invalid agent configuration'), 'CONFIG_ERROR');
        return null;
      }

      try {
        // Create new agent instance - Agent constructor now handles nested config
        const agent = new Agent(config);
        
        // Store agent
        this.agents.set(agent.id, agent);
        
        // Emit event
        this._emit('agent-loaded', { 
          agentId: agent.id,
          name: agent.name,
          description: agent.description,
          provider: agent.state.currentProvider,
          model: agent.state.currentModel
        });
        
        // Update the control panel to show the new agent
        this.updateControlPanel();
        
        this._log(`Agent loaded: ${agent.name} (${agent.id})`);
        return agent;
      } catch (error) {
        this._handleError(error, 'AGENT_LOAD_ERROR', `Failed to load agent: ${config.id}`);
        return null;
      }
    }

    // Send message to agent and get response
    async chat(agentId, message, options = {}) {
      const agent = this.agents.get(agentId);
      if (!agent) {
        this._handleError(new Error(`Agent not found: ${agentId}`), 'AGENT_NOT_FOUND');
        return null;
      }

      // Always use the agent's configured provider first, then fallback to options or default
      const provider = agent.config.provider || options.provider || this.options.defaultProvider;
      
      if (!this.providers[provider]) {
        this._handleError(new Error(`Provider not available: ${provider}`), 'PROVIDER_ERROR');
        return null;
      }
      
      // Update agent state with current provider and model
      agent.state.currentProvider = provider;
      agent.state.currentModel = agent.config.model || this.options.defaultModel;

      // Create transaction record
      const transaction = {
        timestamp: new Date(),
        query: message,
        response: null,
        duration: 0,
        error: null,
        provider,
        model: agent.state.currentModel
      };

      this._emit('chat-start', { agentId, message });
      this._log(`Chat request to ${agentId}: ${message}`);

      const startTime = Date.now();
      try {
        const response = await this.providers[provider].chat(agent, message);
        transaction.duration = Date.now() - startTime;
        transaction.response = response;
        
        // Add transaction to agent history
        agent.addTransaction(transaction);
        
        // Update control panel to reflect the new transaction
        this.updateControlPanel();
        
        this._emit('chat-complete', { 
          agentId, 
          message, 
          response,
          duration: transaction.duration
        });
        
        this._log(`Chat response from ${agentId}: ${response}`);
        return response;
      } catch (error) {
        transaction.error = error;
        transaction.duration = Date.now() - startTime;
        
        // Add failed transaction to history
        agent.addTransaction(transaction);
        
        // Update control panel to reflect the failed transaction
        this.updateControlPanel();
        
        this._handleError(error, 'CHAT_ERROR', `Chat failed with ${agentId}`);
        return null;
      }
    }

    // Get agent history
    getAgentHistory(agentId) {
      const agent = this.agents.get(agentId);
      return agent ? agent.getHistory() : [];
    }

    // Get agent metrics
    getAgentMetrics(agentId) {
      const agent = this.agents.get(agentId);
      return agent ? agent.getMetrics() : null;
    }

    // Get agent state
    getAgentState(agentId) {
      const agent = this.agents.get(agentId);
      return agent ? agent.getState() : null;
    }

    // Get agent by ID
    getAgent(agentId) {
      return this.agents.get(agentId);
    }

    // Get all loaded agents
    getAllAgents() {
      return Array.from(this.agents.values());
    }

    // Remove agent by ID
    removeAgent(agentId) {
      const removed = this.agents.delete(agentId);
      if (removed) {
        this._emit('agent-removed', agentId);
        this._log(`Agent removed: ${agentId}`);
        
        // Update the control panel to reflect the removed agent
        this.updateControlPanel();
      }
      return removed;
    }

    // Event handling
    on(event, handler) {
      if (!this.eventHandlers[event]) {
        this.eventHandlers[event] = [];
      }
      this.eventHandlers[event].push(handler);
    }

    off(event, handler) {
      if (this.eventHandlers[event]) {
        this.eventHandlers[event] = this.eventHandlers[event].filter(h => h !== handler);
      }
    }

    _emit(event, data) {
      if (this.eventHandlers[event]) {
        this.eventHandlers[event].forEach(handler => handler(data));
      }
    }

    // Error handling
    _handleError(error, code, message) {
      let errorMessage = message || error.message;
      
      // Add more context for common errors
      if (code === 'PROVIDER_ERROR') {
        if (error.message && error.message.includes('401')) {
          errorMessage = 'API key is invalid or missing. Please check your API key in the control panel.';
        } else if (error.message && error.message.includes('invalid_api_key')) {
          errorMessage = 'Invalid API key format. Please check your API key in the control panel.';
        } else if (error.message && error.message.includes('model')) {
          errorMessage = `Model error: ${error.message}. Please try a different model in the control panel.`;
        }
      }
      
      const worksonaError = {
        message: errorMessage,
        code,
        originalError: error
      };
      this._emit('error', worksonaError);
      this._log(`Error [${code}]: ${worksonaError.message}`, 'error');
      throw worksonaError;
    }

    // Logging
    _log(message, level = 'info') {
      if (this.options.debug) {
        console[level](`[Worksona] ${message}`);
      }
    }

    // Create control panel for development
    createControlPanel(containerId) {
      this.controlPanelId = containerId;
      const container = document.getElementById(containerId);
      if (!container) {
        this._log('Control panel container not found', 'error');
        return;
      }
      
      // Store the container reference for other methods to use
      this.controlPanelContainer = container;

      // Create basic structure
      container.innerHTML = `
        <div class="worksona-control-panel">
          <div class="worksona-panel-header">
            <h2>Worksona Agents Control Panel</h2>
            <button class="worksona-close-button">×</button>
          </div>
          
          <div class="worksona-llm-status-bar">
            <div class="worksona-status-label">LLM Status</div>
            <div class="worksona-status-indicators">
              <div class="worksona-status-item">
                <div class="worksona-status-dot" id="worksona-openai-status"></div>
                <span>OpenAI</span>
              </div>
              <div class="worksona-status-item">
                <div class="worksona-status-dot" id="worksona-anthropic-status"></div>
                <span>Anthropic</span>
              </div>
              <div class="worksona-status-item">
                <div class="worksona-status-dot" id="worksona-google-status"></div>
                <span>Google</span>
              </div>
            </div>
          </div>
          
          <div class="worksona-tabs">
            <button class="worksona-tab" data-tab="api-keys">API Keys</button>
            <button class="worksona-tab active" data-tab="agents">Agents</button>
          </div>
          
          <div class="worksona-content">
            <div class="worksona-tab-content" id="worksona-api-keys-tab">
              <h3 class="worksona-section-title">LLM Provider API Keys</h3>
              
              <div class="worksona-key-input">
                <label for="worksona-openai-key">OpenAI API Key</label>
                <div class="worksona-input-group">
                  <input type="password" id="worksona-openai-key" placeholder="sk-...">
                  <button class="worksona-toggle-visibility">👁️</button>
                </div>
              </div>
              
              <div class="worksona-key-input">
                <label for="worksona-anthropic-key">Anthropic API Key</label>
                <div class="worksona-input-group">
                  <input type="password" id="worksona-anthropic-key" placeholder="sk-ant-...">
                  <button class="worksona-toggle-visibility">👁️</button>
                </div>
              </div>
              
              <div class="worksona-key-input">
                <label for="worksona-google-key">Google API Key</label>
                <div class="worksona-input-group">
                  <input type="password" id="worksona-google-key" placeholder="AIza...">
                  <button class="worksona-toggle-visibility">👁️</button>
                </div>
              </div>
              
              <div class="worksona-button-group">
                <button id="worksona-save-keys" class="worksona-primary-button">Save API Keys</button>
                <button id="worksona-test-connections" class="worksona-secondary-button">Test Connections</button>
              </div>
            </div>
            
            <div class="worksona-tab-content active" id="worksona-agents-tab">
              <div id="worksona-agent-list"></div>
            </div>
          </div>
        </div>
      `;

      // Add styles
      const styles = `
        .worksona-control-panel {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #333;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          overflow: hidden;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .worksona-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
        }

        .worksona-panel-header h2 {
          margin: 0;
          color: #1a56db;
          font-size: 18px;
          font-weight: 600;
        }

        .worksona-close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #64748b;
        }

        .worksona-llm-status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background: #111827;
          color: white;
        }

        .worksona-status-indicators {
          display: flex;
          gap: 20px;
        }

        .worksona-status-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
        }

        .worksona-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6b7280;
        }

        .worksona-status-dot.active {
          background: #10b981;
        }

        .worksona-tabs {
          display: flex;
          padding: 0 20px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .worksona-tab {
          padding: 15px 20px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          font-weight: 500;
          position: relative;
        }

        .worksona-tab:hover {
          color: #4b5563;
        }

        .worksona-tab.active {
          color: #2563eb;
        }

        .worksona-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #2563eb;
        }

        .worksona-content {
          padding: 20px;
        }

        .worksona-tab-content {
          display: none;
        }

        .worksona-tab-content.active {
          display: block;
        }

        .worksona-section-title {
          font-size: 16px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 20px;
          color: #111827;
        }

        .worksona-key-input {
          margin-bottom: 15px;
        }

        .worksona-key-input label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #374151;
        }

        .worksona-input-group {
          display: flex;
          align-items: center;
        }

        .worksona-input-group input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px 0 0 6px;
          font-size: 14px;
        }

        .worksona-toggle-visibility {
          padding: 10px 12px;
          background: #f9fafb;
          border: 1px solid #d1d5db;
          border-left: none;
          border-radius: 0 6px 6px 0;
          cursor: pointer;
        }

        .worksona-button-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .worksona-primary-button {
          padding: 8px 16px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
        }

        .worksona-primary-button:hover {
          background: #1d4ed8;
        }

        .worksona-secondary-button {
          padding: 8px 16px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
        }

        .worksona-secondary-button:hover {
          background: #e5e7eb;
        }

        .worksona-agent-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          transition: box-shadow 0.2s;
        }
        
        .worksona-agent-card:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .worksona-agent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          cursor: pointer;
          position: relative;
        }
        
        .worksona-expand-icon {
          font-size: 12px;
          color: #6b7280;
          transition: transform 0.2s;
        }
        
        .worksona-expand-icon.rotated {
          transform: rotate(180deg);
        }
        
        .worksona-agent-details.active + .worksona-expand-icon {
          transform: rotate(180deg);
        }

        .worksona-agent-name {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .worksona-agent-id {
          color: #6b7280;
          font-size: 12px;
          font-family: monospace;
        }
        
        .worksona-agent-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .worksona-status-label {
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 10px;
          background: #f3f4f6;
        }
        
        .worksona-agent-status.active .worksona-status-label {
          background: #dcfce7;
          color: #166534;
        }
        
        .worksona-agent-status.inactive .worksona-status-label {
          background: #fee2e2;
          color: #991b1b;
        }

        .worksona-agent-description {
          color: #4b5563;
          margin-bottom: 15px;
          font-size: 14px;
        }
        
        .worksona-agent-details {
          display: none;
          overflow: hidden;
          border-top: 1px solid #e5e7eb;
          margin-top: 10px;
          padding-top: 15px;
        }
        
        .worksona-agent-details.active {
          display: block;
        }
        
        .worksona-agent-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 15px;
        }
        
        .worksona-agent-tab {
          padding: 8px 16px;
          border: none;
          background: none;
          cursor: pointer;
          color: #6b7280;
          font-weight: 500;
          position: relative;
          font-size: 14px;
        }
        
        .worksona-agent-tab:hover {
          color: #111827;
        }
        
        .worksona-agent-tab.active {
          color: #2563eb;
          border-bottom: 2px solid #2563eb;
        }
        
        .worksona-agent-tab-content {
          display: none;
          padding: 10px 0;
        }
        
        .worksona-agent-tab-content.active {
          display: block;
        }
        
        .worksona-agent-tab-content h4 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 10px;
          color: #111827;
        }
        
        .worksona-config-details,
        .worksona-traits,
        .worksona-metrics {
          background: #f9fafb;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 15px;
          font-size: 13px;
          line-height: 1.5;
        }
        
        .worksona-prompt-box {
          background: #f9fafb;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 15px;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
          font-family: monospace;
          max-height: 200px;
          overflow-y: auto;
        }
        
        .worksona-examples {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .worksona-example {
          background: #f9fafb;
          border-radius: 6px;
          padding: 12px;
          font-size: 13px;
        }
        
        .worksona-example-user {
          margin-bottom: 8px;
          color: #4b5563;
        }
        
        .worksona-example-assistant {
          color: #1f2937;
        }
        
        .worksona-history {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 15px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .worksona-history-item {
          background: #f9fafb;
          border-radius: 6px;
          padding: 12px;
          font-size: 13px;
        }
        
        .worksona-history-time {
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 5px;
        }
        
        .worksona-history-query {
          margin-bottom: 8px;
          color: #4b5563;
        }
        
        .worksona-history-response {
          color: #1f2937;
          margin-bottom: 8px;
        }
        
        .worksona-history-meta {
          font-size: 11px;
          color: #6b7280;
        }
        
        .worksona-no-agents {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .worksona-no-examples {
          color: #6b7280;
          font-style: italic;
          background: #f9fafb;
          padding: 12px;
          border-radius: 6px;
          margin: 10px 0;
        }
        
        .worksona-control-panel {
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
          max-height: 80vh;
          overflow: auto;
          background: white;
          border-radius: 8px;
        }
        
        .worksona-json-display {
          background: #f8fafc;
          border-radius: 6px;
          padding: 15px;
          margin: 0;
          font-family: monospace;
          font-size: 13px;
          line-height: 1.5;
          overflow: auto;
          max-height: 500px;
          white-space: pre-wrap;
          color: #334155;
          border: 1px solid #e2e8f0;
        }
        
        /* Ensure the json tab content has proper height */
        #worksona-agent-tab-content[id$="-json"] {
          max-height: 500px;
          overflow: auto;
        }
        
        /* JSON syntax highlighting */
        .worksona-json-key {
          color: #0f766e;
        }
        
        .worksona-json-string {
          color: #b91c1c;
        }
        
        .worksona-json-number {
          color: #1d4ed8;
        }
        
        .worksona-json-boolean {
          color: #7e22ce;
        }
        
        .worksona-json-null {
          color: #64748b;
        }
        
        /* Ensure the modal is scrollable on smaller screens */
        @media (max-height: 768px) {
          #worksona-modal-container {
            max-height: 90vh;
          }
          
          .worksona-control-panel {
            max-height: 90vh;
          }
        }
      `;

      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);

      // Add event listeners
      this._setupEventListeners(container);

      // Initial update
      this.updateControlPanel();
    }

    _setupEventListeners(container) {
      // Use the provided container or fall back to the stored container reference
      container = container || this.controlPanelContainer;
      
      if (!container) {
        this._log('No container available for event listeners', 'error');
        return;
      }
      
      // Tab switching
      container.querySelectorAll('.worksona-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          container.querySelectorAll('.worksona-tab').forEach(t => t.classList.remove('active'));
          container.querySelectorAll('.worksona-tab-content').forEach(c => c.classList.remove('active'));
          tab.classList.add('active');
          document.getElementById(`worksona-${tab.dataset.tab}-tab`).classList.add('active');
        });
      });

      // Password visibility toggle
      container.querySelectorAll('.worksona-toggle-visibility').forEach(button => {
        button.addEventListener('click', () => {
          const input = button.previousElementSibling;
          if (input.type === 'password') {
            input.type = 'text';
            button.textContent = '🔒';
          } else {
            input.type = 'password';
            button.textContent = '👁️';
          }
        });
      });

      // Save API keys
      const saveButton = document.getElementById('worksona-save-keys');
      if (saveButton) {
        saveButton.addEventListener('click', () => {
          const openaiKey = document.getElementById('worksona-openai-key').value;
          const anthropicKey = document.getElementById('worksona-anthropic-key').value;
          const googleKey = document.getElementById('worksona-google-key').value;
          
          // Update API keys in options
          this.options.apiKeys = {
            ...this.options.apiKeys,
            ...(openaiKey && { openai: openaiKey }),
            ...(anthropicKey && { anthropic: anthropicKey }),
            ...(googleKey && { google: googleKey })
          };
          
          // Reinitialize providers with new keys
          this._initializeProviders();
          
          // Update control panel
          this.updateControlPanel();
          
          // Emit event
          this._emit('api-keys-updated', { providers: Object.keys(this.options.apiKeys) });
          
          // Show success message
          alert('API keys saved successfully!');
        });
      }

      // Test connections
      const testButton = document.getElementById('worksona-test-connections');
      if (testButton) {
        testButton.addEventListener('click', async () => {
          testButton.disabled = true;
          testButton.textContent = 'Testing...';
          
          try {
            await this._testProviderConnections();
            this.updateControlPanel();
          } finally {
            testButton.disabled = false;
            testButton.textContent = 'Test Connections';
          }
        });
      }

      // Close button
      const closeButton = container.querySelector('.worksona-close-button');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          // If the control panel is in a modal or overlay, hide it
          const panel = container.querySelector('.worksona-control-panel');
          if (panel) {
            panel.style.display = 'none';
          }
        });
      }

      // Temperature slider inputs
      container.querySelectorAll('input[type="range"]').forEach(slider => {
        const valueDisplay = slider.nextElementSibling;
        
        slider.addEventListener('input', () => {
          if (valueDisplay) {
            valueDisplay.textContent = slider.value;
          }
        });
        
        // Initialize with current value
        if (valueDisplay && slider.value) {
          valueDisplay.textContent = slider.value;
        }
      });
    }

    async _testProviderConnections() {
      const providers = ['openai', 'anthropic', 'google'];
      
      for (const provider of providers) {
        const statusDot = document.getElementById(`worksona-${provider}-status`);
        if (!statusDot) continue;
        
        if (!this.options.apiKeys[provider] || this.options.apiKeys[provider].trim() === '') {
          statusDot.className = 'worksona-status-dot';
          continue;
        }
        
        try {
          // Simple validation for each provider based on key format
          let isValid = false;
          
          switch (provider) {
            case 'openai':
              isValid = this.options.apiKeys.openai && this.options.apiKeys.openai.startsWith('sk-');
              break;
            case 'anthropic':
              isValid = this.options.apiKeys.anthropic && this.options.apiKeys.anthropic.startsWith('sk-ant-');
              break;
            case 'google':
              isValid = this.options.apiKeys.google && this.options.apiKeys.google.length > 10;
              break;
          }
          
          statusDot.className = isValid ? 'worksona-status-dot active' : 'worksona-status-dot';
          this._log(`Provider ${provider} validation result: ${isValid ? 'valid' : 'invalid'}`);
          
        } catch (error) {
          statusDot.className = 'worksona-status-dot';
          console.error(`Error testing ${provider} connection:`, error);
        }
      }
    }

    updateControlPanel() {
      if (!this.controlPanelId) return;

      // Update provider status dots
      this._updateProviderStatus();

      // Fill existing API key inputs
      Object.entries(this.options.apiKeys).forEach(([provider, key]) => {
        const input = document.getElementById(`worksona-${provider}-key`);
        if (input && key) {
          input.value = key;
        }
      });

      // Update agent list
      this._updateAgentList();

      // Register for agent changes
      this._setupAgentEventListeners();
      
      // Ensure all event listeners are properly set up
      if (this.controlPanelContainer) {
        this._setupEventListeners(this.controlPanelContainer);
      }
    }

    _updateProviderStatus() {
      const providers = ['openai', 'anthropic', 'google'];
      
      providers.forEach(provider => {
        const statusDot = document.getElementById(`worksona-${provider}-status`);
        if (!statusDot) return;
        
        const isConfigured = !!this.options.apiKeys[provider];
        statusDot.className = isConfigured ? 'worksona-status-dot active' : 'worksona-status-dot';
      });
    }

    _updateAgentList() {
      const agentList = document.getElementById('worksona-agent-list');
      if (!agentList) return;
      
      const agents = this.getAgents();
      
      if (agents.length === 0) {
        agentList.innerHTML = `
          <div class="worksona-no-agents">
            <p>No agents have been loaded yet.</p>
            <p>Agents will appear here when they are loaded by your application.</p>
          </div>
        `;
        return;
      }
      
      agentList.innerHTML = agents.map(agent => {
        const metrics = agent.getMetrics();
        const state = agent.getState();
        const history = agent.getHistory();
        
        // Format history items
        const historyHtml = history.length > 0 
          ? history.slice(-5).map(item => `
              <div class="worksona-history-item">
                <div class="worksona-history-time">${new Date(item.timestamp).toLocaleTimeString()}</div>
                <div class="worksona-history-query"><strong>Query:</strong> ${this._escapeHtml(item.query)}</div>
                <div class="worksona-history-response"><strong>Response:</strong> ${this._escapeHtml(item.response || 'Error: ' + (item.error?.message || 'Unknown error'))}</div>
                <div class="worksona-history-meta">
                  <span>Provider: ${item.provider}</span> | 
                  <span>Model: ${item.model}</span> | 
                  <span>Duration: ${item.duration}ms</span>
                </div>
              </div>
            `).join('')
          : '<p>No interaction history available yet.</p>';
        
        // Get system prompt and examples - ensure we're getting them from the right places with thorough checks
        const getSystemPrompt = (agent) => {
          // Check all possible locations for system prompt
          return agent.systemPrompt || 
                 agent.config?.systemPrompt || 
                 (agent.config?.config?.systemPrompt) ||
                 '';
        };
        
        const getExamples = (agent) => {
          // Check all possible locations for examples, including deeper nesting
          const examples = agent.examples || 
                 agent.config?.examples || 
                 agent.config?.config?.examples ||
                 [];
          console.log('Agent:', agent.id, 'Examples:', JSON.stringify(examples));
          return examples;
        };
        
        const systemPrompt = getSystemPrompt(agent);
        const promptDisplay = systemPrompt 
          ? `<div class="worksona-prompt-box">${this._escapeHtml(systemPrompt)}</div>`
          : `<p class="worksona-no-examples">No system prompt has been defined for this agent. A system prompt helps establish the agent's behavior and capabilities.</p>`;
          
        const examples = getExamples(agent);
        
        const examplesHtml = examples && examples.length > 0
          ? examples.map(ex => `
              <div class="worksona-example">
                <div class="worksona-example-user"><strong>User:</strong> ${this._escapeHtml(ex.user || '')}</div>
                <div class="worksona-example-assistant"><strong>Assistant:</strong> ${this._escapeHtml(ex.assistant || '')}</div>
              </div>
            `).join('')
          : '<p class="worksona-no-examples">No examples have been defined for this agent. Examples help demonstrate the expected conversation flow.</p>';
        
        // Format configuration details - ensure we're showing all available config settings with proper null checks
        const configDetails = `
          <div class="worksona-config-details">
            <h4>Model Settings</h4>
            <div><strong>Provider:</strong> ${agent.config?.provider || agent.state?.currentProvider || 'default'}</div>
            <div><strong>Model:</strong> ${agent.config?.model || agent.state?.currentModel || 'default'}</div>
            <div><strong>Temperature:</strong> ${agent.config?.temperature !== undefined ? agent.config.temperature : (agent.config?.config?.temperature !== undefined ? agent.config.config.temperature : 'default')}</div>
            <div><strong>Max Tokens:</strong> ${agent.config?.maxTokens !== undefined ? agent.config.maxTokens : (agent.config?.config?.maxTokens !== undefined ? agent.config.config.maxTokens : 'default')}</div>
            ${agent.config?.topP !== undefined || agent.config?.config?.topP !== undefined ? `<div><strong>Top P:</strong> ${agent.config?.topP !== undefined ? agent.config.topP : agent.config?.config?.topP}</div>` : ''}
            ${agent.config?.frequencyPenalty !== undefined || agent.config?.config?.frequencyPenalty !== undefined ? `<div><strong>Frequency Penalty:</strong> ${agent.config?.frequencyPenalty !== undefined ? agent.config.frequencyPenalty : agent.config?.config?.frequencyPenalty}</div>` : ''}
            ${agent.config?.presencePenalty !== undefined || agent.config?.config?.presencePenalty !== undefined ? `<div><strong>Presence Penalty:</strong> ${agent.config?.presencePenalty !== undefined ? agent.config.presencePenalty : agent.config?.config?.presencePenalty}</div>` : ''}
          </div>
        `;

        // Format JSON for this specific agent with complete and properly formatted information
        const agentJson = JSON.stringify({
          id: agent.id,
          name: agent.name,
          description: agent.description,
          config: {
            provider: agent.config.provider,
            model: agent.config.model,
            temperature: agent.config.temperature,
            maxTokens: agent.config.maxTokens,
            topP: agent.config.topP,
            frequencyPenalty: agent.config.frequencyPenalty,
            presencePenalty: agent.config.presencePenalty,
          },
          systemPrompt: getSystemPrompt(agent),
          examples: getExamples(agent),
          traits: agent.traits || {},
          metrics: agent.getMetrics(),
          state: agent.getState(),
          transactions: agent.getHistory().slice(-5)
        }, null, 2);

        // Trait information
        const traits = agent.traits || {};
        const traitsHtml = `
          <div class="worksona-traits">
            ${traits.personality ? `<div><strong>Personality:</strong> ${traits.personality.join(', ')}</div>` : ''}
            ${traits.knowledge ? `<div><strong>Knowledge:</strong> ${traits.knowledge.join(', ')}</div>` : ''}
            ${traits.tone ? `<div><strong>Tone:</strong> ${traits.tone}</div>` : ''}
            ${traits.background ? `<div><strong>Background:</strong> ${traits.background}</div>` : ''}
          </div>
        `;
        
        return `
          <div class="worksona-agent-card">
            <div class="worksona-agent-header" onclick="document.getElementById('worksona-agent-details-${agent.id}').classList.toggle('active'); this.querySelector('.worksona-expand-icon').classList.toggle('rotated')">
              <h3 class="worksona-agent-name">${agent.name}</h3>
              <div class="worksona-agent-status ${state.isActive ? 'active' : 'inactive'}">
                <span class="worksona-agent-id">${agent.id}</span>
                <span class="worksona-status-label">${state.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div class="worksona-expand-icon">▼</div>
            </div>
            <p class="worksona-agent-description">${agent.description || 'No description provided'}</p>
            
            <div id="worksona-agent-details-${agent.id}" class="worksona-agent-details">
              <div class="worksona-agent-tabs">
                <button class="worksona-agent-tab active" data-agent="${agent.id}" data-tab="agent">Agent Details</button>
                <button class="worksona-agent-tab" data-agent="${agent.id}" data-tab="model">Model Settings</button>
                <button class="worksona-agent-tab" data-agent="${agent.id}" data-tab="prompt">System Prompt</button>
                <button class="worksona-agent-tab" data-agent="${agent.id}" data-tab="history">History</button>
                <button class="worksona-agent-tab" data-agent="${agent.id}" data-tab="json">Raw JSON</button>
              </div>
              
              <div class="worksona-agent-tab-content active" id="worksona-agent-${agent.id}-agent">
                <h4>Agent Configuration</h4>
                <div class="worksona-config-details">
                  <div><strong>ID:</strong> ${agent.id}</div>
                  <div><strong>Name:</strong> ${agent.name}</div>
                  <div><strong>Description:</strong> ${agent.description || 'No description provided'}</div>
                </div>
                <h4>Traits</h4>
                ${traitsHtml}
              </div>
              
              <div class="worksona-agent-tab-content" id="worksona-agent-${agent.id}-model">
                <h4>Model Settings</h4>
                ${configDetails}
              </div>
              
              <div class="worksona-agent-tab-content" id="worksona-agent-${agent.id}-prompt">
                <h4>System Prompt</h4>
                ${promptDisplay}
                
                <h4>Examples</h4>
                <div class="worksona-examples">
                  ${examplesHtml}
                </div>
              </div>
              
              <div class="worksona-agent-tab-content" id="worksona-agent-${agent.id}-history">
                <h4>Recent Interactions</h4>
                <div class="worksona-history">
                  ${historyHtml}
                </div>
                <div class="worksona-metrics">
                  <div><strong>Total Queries:</strong> ${metrics.totalQueries}</div>
                  <div><strong>Avg Response Time:</strong> ${Math.round(metrics.avgResponseTime)}ms</div>
                  <div><strong>Success Rate:</strong> ${(metrics.successRate * 100).toFixed(1)}%</div>
                  <div><strong>Last Active:</strong> ${metrics.lastActive ? new Date(metrics.lastActive).toLocaleTimeString() : 'Never'}</div>
                </div>
              </div>
              
              <div class="worksona-agent-tab-content" id="worksona-agent-${agent.id}-json">
                <h4>Agent Configuration JSON</h4>
                <div class="worksona-json-display">${this._escapeHtml(agentJson)}</div>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      // Remove any existing agent tab event listeners before adding new ones
      if (this.agentTabEventListeners) {
        this.agentTabEventListeners.forEach(({ element, type, listener }) => {
          element.removeEventListener(type, listener);
        });
      }
      
      // Initialize array to store new event listeners
      this.agentTabEventListeners = [];
      
      // Add click handlers for agent tabs
      agentList.querySelectorAll('.worksona-agent-tab').forEach(tab => {
        const clickHandler = (e) => {
          const agentId = tab.dataset.agent;
          const tabName = tab.dataset.tab;
          
          // Deactivate all tabs for this agent
          document.querySelectorAll(`.worksona-agent-tab[data-agent="${agentId}"]`).forEach(t => {
            t.classList.remove('active');
          });
          
          // Deactivate all tab contents for this agent
          document.querySelectorAll(`[id^="worksona-agent-${agentId}-"]`).forEach(c => {
            c.classList.remove('active');
          });
          
          // Activate clicked tab and content
          tab.classList.add('active');
          document.getElementById(`worksona-agent-${agentId}-${tabName}`).classList.add('active');
        };
        
        // Store reference to event listener
        this.agentTabEventListeners.push({
          element: tab,
          type: 'click',
          listener: clickHandler
        });
        
        // Add the event listener
        tab.addEventListener('click', clickHandler);
      });
    }
    
    // Helper to escape HTML for safe display
    _escapeHtml(unsafe) {
      if (!unsafe) return '';
      return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    _setupAgentEventListeners() {
      // Remove existing listeners to avoid duplicates
      this.off('agent-loaded', this._handleAgentLoaded);
      this.off('agent-removed', this._handleAgentRemoved);
      
      // Add listeners for agent changes
      this.on('agent-loaded', this._handleAgentLoaded.bind(this));
      this.on('agent-removed', this._handleAgentRemoved.bind(this));
    }

    _handleAgentLoaded() {
      this._updateAgentList();
    }

    _handleAgentRemoved() {
      this._updateAgentList();
    }

    // Get all loaded agents
    getAgents() {
      return Array.from(this.agents.values());
    }

    // Create a floating control panel with button in the bottom right
    createFloatingControlPanel() {
      // Create a wrapper for the button and panel
      const wrapper = document.createElement('div');
      wrapper.id = 'worksona-floating-control';
      
      // Create floating button
      const button = document.createElement('button');
      button.id = 'worksona-floating-button';
      button.innerHTML = '⚙️';
      button.setAttribute('aria-label', 'Open Worksona Control Panel');
      wrapper.appendChild(button);
      
      // Create control panel container
      const panelContainer = document.createElement('div');
      panelContainer.id = 'worksona-modal-container';
      
      // Create overlay
      const overlay = document.createElement('div');
      overlay.id = 'worksona-overlay';
      
      // Add panel and overlay to wrapper
      wrapper.appendChild(overlay);
      wrapper.appendChild(panelContainer);
      
      // Add wrapper to body
      document.body.appendChild(wrapper);
      
      // Set up the control panel - this will set up basic structure and event listeners
      this.createControlPanel('worksona-modal-container');
      
      // Add styles for floating button and modal
      const floatingStyles = document.createElement('style');
      floatingStyles.textContent = `
        #worksona-floating-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          border: none;
          font-size: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          cursor: pointer;
          z-index: 9998;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease-in-out;
        }
        
        #worksona-floating-button:hover {
          transform: scale(1.1);
          background: #1d4ed8;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        #worksona-floating-button:active {
          transform: scale(0.95);
        }
        
        @media (max-width: 768px) {
          #worksona-floating-button {
            width: 45px;
            height: 45px;
            font-size: 20px;
            bottom: 15px;
            right: 15px;
          }
        }
        
        #worksona-modal-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10000;
          width: 90%;
          max-width: 800px;
          max-height: 80vh;
          overflow: auto;
          display: none;
        }
        
        #worksona-modal-container.active {
          display: block;
        }
        
        #worksona-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 9999;
          display: none;
        }
        
        #worksona-overlay.active {
          display: block;
        }
        
        .worksona-control-panel {
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
          max-height: 80vh;
          overflow: auto;
          background: white;
          border-radius: 8px;
        }
      `;
      document.head.appendChild(floatingStyles);
      
      // Set up additional event listeners specific to floating panel
      button.addEventListener('click', () => {
        overlay.classList.add('active');
        panelContainer.classList.add('active');
      });
      
      overlay.addEventListener('click', () => {
        overlay.classList.remove('active');
        panelContainer.classList.remove('active');
      });
      
      // Also close when clicking the close button in the panel
      const closeButton = panelContainer.querySelector('.worksona-close-button');
      if (closeButton) {
        closeButton.addEventListener('click', (e) => {
          // Prevent default to avoid conflicts with other event handlers
          e.preventDefault();
          e.stopPropagation();
          
          overlay.classList.remove('active');
          panelContainer.classList.remove('active');
        });
      }
    }
  }

  // Export to global scope
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Worksona;
  } else {
    global.Worksona = Worksona;
  }

})(typeof window !== 'undefined' ? window : global);

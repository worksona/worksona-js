/**
 * Railway API Configuration Module
 * Shared configuration for Railway API server integration
 */

const RailwayConfig = {
  // Storage keys
  STORAGE_KEYS: {
    API_URL: 'worksona_railway_api_url',
    API_KEY: 'worksona_railway_api_key',
  },

  /**
   * Detect API base URL from environment or user configuration
   * Priority: 
   * 1) Netlify Environment Variable (window.RAILWAY_API_URL)
   * 2) User-configured URL (localStorage)
   * 3) Railway domain detection
   * 4) Netlify/Vercel detection
   * 5) Localhost fallback
   */
  detectApiUrl() {
    // Check for Netlify environment variable (injected at build time)
    if (typeof window !== 'undefined' && window.RAILWAY_API_URL) {
      return window.RAILWAY_API_URL;
    }

    // Check localStorage for user-configured URL (manual override)
    const savedUrl = localStorage.getItem(this.STORAGE_KEYS.API_URL);
    if (savedUrl) {
      return savedUrl;
    }

    // Check if we're on Railway
    const hostname = window.location.hostname;
    if (hostname.includes('railway.app')) {
      return window.location.origin;
    }

    // Check if we're on Netlify
    if (hostname === 'worksonajs.netlify.app' || hostname.includes('worksonajs')) {
      return 'https://worksonajs.netlify.app/api';
    }

    // Check if we're on Vercel
    if (hostname === 'worksona-js.vercel.app' || hostname.includes('vercel.app')) {
      return window.location.origin + '/api';
    }

    // Default: localhost for local development
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    return isLocalhost ? 'http://localhost:3000' : '';
  },

  /**
   * Get stored API key
   * Priority:
   * 1) Netlify Environment Variable (window.RAILWAY_API_KEY)
   * 2) User-configured key (localStorage)
   */
  getApiKey() {
    // Check for Netlify environment variable (injected at build time)
    if (typeof window !== 'undefined' && window.RAILWAY_API_KEY) {
      return window.RAILWAY_API_KEY;
    }

    // Check localStorage for user-configured key (manual override)
    return localStorage.getItem(this.STORAGE_KEYS.API_KEY) || '';
  },

  /**
   * Set API key in localStorage
   */
  setApiKey(apiKey) {
    if (apiKey) {
      localStorage.setItem(this.STORAGE_KEYS.API_KEY, apiKey);
    } else {
      localStorage.removeItem(this.STORAGE_KEYS.API_KEY);
    }
  },

  /**
   * Set API URL in localStorage
   */
  setApiUrl(apiUrl) {
    if (apiUrl) {
      // Remove trailing slash
      const cleanUrl = apiUrl.replace(/\/$/, '');
      localStorage.setItem(this.STORAGE_KEYS.API_URL, cleanUrl);
    } else {
      localStorage.removeItem(this.STORAGE_KEYS.API_URL);
    }
  },

  /**
   * Get default headers for API requests
   * Includes API key if available
   */
  getHeaders(contentType = 'application/json') {
    const headers = {};
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    const apiKey = this.getApiKey();
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }
    
    return headers;
  },

  /**
   * Make authenticated API request
   * Automatically includes API key if available
   */
  async fetch(endpoint, options = {}) {
    const apiUrl = this.detectApiUrl();
    const url = `${apiUrl}${endpoint}`;
    
    // Merge headers
    const headers = {
      ...this.getHeaders(),
      ...(options.headers || {})
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    // Handle common error cases
    if (response.status === 401) {
      throw new Error('Unauthorized: Invalid or missing API key');
    }
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded: Too many requests (300 per 15 minutes)');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    return response;
  },

  /**
   * Check if API server is accessible
   */
  async checkHealth() {
    try {
      const apiUrl = this.detectApiUrl();
      const response = await fetch(`${apiUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  /**
   * Initialize configuration UI
   * Adds API URL and API key input fields to the page
   */
  createConfigUI(containerId = 'railway-config') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('Railway config container not found:', containerId);
      return;
    }

    const currentUrl = this.detectApiUrl();
    const currentKey = this.getApiKey();

    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="railway-api-url" style="font-size: 0.875rem; color: var(--text-secondary, #64748b);">
            API URL:
          </label>
          <input 
            type="text" 
            id="railway-api-url" 
            placeholder="https://your-app.railway.app" 
            value="${currentUrl}"
            style="padding: 0.25rem 0.5rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 4px; font-size: 0.875rem; min-width: 250px;"
          >
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <label for="railway-api-key" style="font-size: 0.875rem; color: var(--text-secondary, #64748b);">
            API Key:
          </label>
          <input 
            type="password" 
            id="railway-api-key" 
            placeholder="wsk_live_..." 
            value="${currentKey}"
            style="padding: 0.25rem 0.5rem; border: 1px solid var(--border-color, #e2e8f0); border-radius: 4px; font-size: 0.875rem; min-width: 250px;"
          >
        </div>
        <button 
          onclick="RailwayConfig.saveConfig()" 
          style="padding: 0.25rem 0.75rem; background: var(--accent-blue, #2563eb); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.875rem;"
        >
          Update
        </button>
      </div>
    `;
  },

  /**
   * Save configuration from UI inputs
   */
  saveConfig() {
    const urlInput = document.getElementById('railway-api-url');
    const keyInput = document.getElementById('railway-api-key');
    
    if (urlInput) {
      this.setApiUrl(urlInput.value.trim());
    }
    
    if (keyInput) {
      this.setApiKey(keyInput.value.trim());
    }
    
    // Trigger a custom event for other components to react
    window.dispatchEvent(new CustomEvent('railway-config-updated', {
      detail: {
        apiUrl: this.detectApiUrl(),
        hasApiKey: !!this.getApiKey()
      }
    }));
    
    // Show feedback
    const button = event?.target;
    if (button) {
      const originalText = button.textContent;
      button.textContent = '✓ Saved';
      button.style.background = 'var(--success, #10b981)';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    }
  },

  /**
   * Clear all saved configuration
   */
  clearConfig() {
    localStorage.removeItem(this.STORAGE_KEYS.API_URL);
    localStorage.removeItem(this.STORAGE_KEYS.API_KEY);
    window.dispatchEvent(new CustomEvent('railway-config-updated', {
      detail: {
        apiUrl: this.detectApiUrl(),
        hasApiKey: false
      }
    }));
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.RailwayConfig = RailwayConfig;
}

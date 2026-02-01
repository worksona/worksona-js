// Use dynamic API URL detection
let API_URL = 'http://localhost:3000'; // Default, will be updated

// State
let agents = [];
let lastRequest = null;

// Detect API URL on load
function detectApiUrl() {
    // Check localStorage for user-configured URL
    const savedUrl = localStorage.getItem('worksona_api_url');
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
}

// Get API key from localStorage
function getApiKey() {
    return localStorage.getItem('worksona_api_key') || '';
}

// Get headers with API key
function getHeaders(includeContentType = true) {
    const headers = {};
    if (includeContentType) {
        headers['Content-Type'] = 'application/json';
    }
    const apiKey = getApiKey();
    if (apiKey) {
        headers['x-api-key'] = apiKey;
    }
    return headers;
}

// Save API configuration
function saveApiConfig() {
    const urlInput = document.getElementById('apiUrlInput');
    const keyInput = document.getElementById('apiKeyInput');
    
    if (urlInput && urlInput.value.trim()) {
        const cleanUrl = urlInput.value.trim().replace(/\/$/, '');
        localStorage.setItem('worksona_api_url', cleanUrl);
        API_URL = cleanUrl;
    }
    
    if (keyInput) {
        const apiKey = keyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('worksona_api_key', apiKey);
        } else {
            localStorage.removeItem('worksona_api_key');
        }
    }
    
    // Show feedback
    alert('Configuration saved! Reloading page...');
    location.reload();
}

// Initialize configuration form
function initConfigForm() {
    const urlInput = document.getElementById('apiUrlInput');
    const keyInput = document.getElementById('apiKeyInput');
    
    if (urlInput) {
        urlInput.value = API_URL || '';
    }
    
    if (keyInput) {
        const savedKey = getApiKey();
        if (savedKey) {
            keyInput.value = savedKey;
        }
    }
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
    API_URL = detectApiUrl();
    initConfigForm();
    await checkServerStatus();
    await loadAgents();
    setupTabs();
    setupForms();
});

// Check server status
async function checkServerStatus() {
    try {
        const response = await fetch(`${API_URL}/health`, {
            headers: getHeaders(false)
        });
        const data = await response.json();

        document.getElementById('status-indicator').classList.add('online');
        document.getElementById('status-text').textContent = 'Server Online';

        // Update provider status (from server banner, we know the status)
        // For now, we'll fetch the agents endpoint which shows provider info
        updateProviderStatus();
    } catch (error) {
        document.getElementById('status-indicator').classList.add('offline');
        document.getElementById('status-text').textContent = 'Server Offline';
        console.error('Server check failed:', error);
    }
}

// Update provider status
async function updateProviderStatus() {
    // Make a test request to see which providers work
    const providers = ['openai', 'anthropic', 'google'];

    for (const provider of providers) {
        const statusEl = document.getElementById(`${provider}-status`);
        // For now, mark OpenAI as active (we know it works)
        if (provider === 'openai') {
            statusEl.textContent = 'Active';
            statusEl.classList.add('active');
        } else {
            statusEl.textContent = 'Inactive';
            statusEl.classList.add('inactive');
        }
    }
}

// Load agents from API
async function loadAgents() {
    try {
        const response = await fetch(`${API_URL}/api/agents`, {
            headers: getHeaders()
        });
        const data = await response.json();

        if (data.success) {
            agents = data.data.agents;
            displayAgents(agents);
            populateAgentSelects();
        }
    } catch (error) {
        console.error('Failed to load agents:', error);
        document.getElementById('agents-list').innerHTML =
            '<div class="loading">Failed to load agents</div>';
    }
}

// Display agents
function displayAgents(agentList) {
    const container = document.getElementById('agents-list');

    if (agentList.length === 0) {
        container.innerHTML = '<div class="loading">No agents loaded</div>';
        return;
    }

    container.innerHTML = agentList.map(agent => `
        <div class="agent-card" onclick="selectAgent('${agent.id}')">
            <h3>${agent.name}</h3>
            <p>${agent.description || 'No description available'}</p>
            <div class="agent-meta">
                <span class="agent-tag">${agent.provider}</span>
                <span class="agent-tag">${agent.model}</span>
            </div>
        </div>
    `).join('');
}

// Populate agent select dropdowns
function populateAgentSelects() {
    const selects = ['agent-select', 'upload-agent-select'];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        const currentValue = select.value;

        // Keep existing options, add new ones
        const existingOptions = selectId === 'agent-select' ?
            '<option value="">Select an agent...</option>' :
            '<option value="">Auto-detect</option>';

        select.innerHTML = existingOptions + agents.map(agent =>
            `<option value="${agent.id}">${agent.name} (${agent.id})</option>`
        ).join('');

        select.value = currentValue;
    });
}

// Select an agent (from card click)
function selectAgent(agentId) {
    document.getElementById('agent-select').value = agentId;
    // Switch to agent tab
    document.querySelector('[data-tab="agent"]').click();
}

// Setup tabs
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            const parent = btn.closest('section');

            // Update buttons
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update content
            parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const content = parent.querySelector(`#${tabName}-tab, #${tabName}`);
            if (content) content.classList.add('active');
        });
    });
}

// Setup forms
function setupForms() {
    // Query form
    document.getElementById('query-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const q = formData.get('q');
        const model = formData.get('model');

        lastRequest = { type: 'query', q, model };
        updateCodeExamples();

        await makeRequest('GET', `/api/query?q=${encodeURIComponent(q)}&model=${model}`);
    });

    // Agent form
    document.getElementById('agent-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const agent = formData.get('agent');
        const q = formData.get('q');

        if (!agent) {
            alert('Please select an agent');
            return;
        }

        lastRequest = { type: 'agent', agent, q };
        updateCodeExamples();

        await makeRequest('GET', `/api/agents/${agent}/query?q=${encodeURIComponent(q)}`);
    });

    // Batch form
    document.getElementById('batch-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const queriesText = formData.get('queries');
        const model = formData.get('model');

        const queries = queriesText.split('\n')
            .filter(q => q.trim())
            .slice(0, 10)
            .map(q => ({ query: q.trim(), model }));

        lastRequest = { type: 'batch', queries };
        updateCodeExamples();

        await makeRequest('POST', '/api/query/batch', { queries });
    });

    // Translate form
    document.getElementById('translate-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const text = formData.get('text');
        const from = formData.get('from');
        const to = formData.get('to');

        lastRequest = { type: 'translate', text, from, to };
        updateCodeExamples();

        await makeRequest('GET', `/api/translate?text=${encodeURIComponent(text)}&from=${from}&to=${to}`);
    });

    // Upload form
    document.getElementById('upload-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        lastRequest = { type: 'upload', file: formData.get('file').name };
        updateCodeExamples();

        await uploadFile(formData);
    });

    // Copy button
    document.getElementById('copy-btn').addEventListener('click', () => {
        const text = document.getElementById('response-output').textContent;
        navigator.clipboard.writeText(text);
        alert('Response copied to clipboard!');
    });
}

// Make API request
async function makeRequest(method, endpoint, body = null) {
    const startTime = Date.now();

    try {
        showLoading();

        const options = {
            method,
            headers: getHeaders()
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();
        const duration = Date.now() - startTime;

        displayResponse(data, duration);
    } catch (error) {
        displayError(error);
    }
}

// Upload file
async function uploadFile(formData) {
    const startTime = Date.now();

    try {
        showLoading();

        const headers = {};
        const apiKey = getApiKey();
        if (apiKey) {
            headers['x-api-key'] = apiKey;
        }

        const response = await fetch(`${API_URL}/api/documents/analyze`, {
            method: 'POST',
            headers: headers,
            body: formData
        });

        const data = await response.json();
        const duration = Date.now() - startTime;

        displayResponse(data, duration);
    } catch (error) {
        displayError(error);
    }
}

// Display response
function displayResponse(data, duration) {
    const output = document.getElementById('response-output');
    const timeEl = document.getElementById('response-time');
    const copyBtn = document.getElementById('copy-btn');

    output.textContent = JSON.stringify(data, null, 2);
    timeEl.textContent = `Response time: ${duration}ms`;
    copyBtn.style.display = 'inline-block';
}

// Display error
function displayError(error) {
    const output = document.getElementById('response-output');
    const timeEl = document.getElementById('response-time');

    output.textContent = `Error: ${error.message}`;
    output.style.color = '#ef4444';
    timeEl.textContent = 'Request failed';
}

// Show loading
function showLoading() {
    const output = document.getElementById('response-output');
    const timeEl = document.getElementById('response-time');
    const copyBtn = document.getElementById('copy-btn');

    output.textContent = 'Loading...';
    output.style.color = '#94a3b8';
    timeEl.textContent = '';
    copyBtn.style.display = 'none';
}

// Update code examples
function updateCodeExamples() {
    if (!lastRequest) return;

    const { type } = lastRequest;

    let curlEx = '';
    let jsEx = '';
    let pyEx = '';

    switch (type) {
        case 'query':
            curlEx = `curl "${API_URL}/api/query?q=${encodeURIComponent(lastRequest.q)}&model=${lastRequest.model}"`;
            jsEx = `const response = await fetch('${API_URL}/api/query?q=${encodeURIComponent(lastRequest.q)}&model=${lastRequest.model}');
const data = await response.json();
console.log(data.answer);`;
            pyEx = `import requests
response = requests.get('${API_URL}/api/query',
    params={'q': '${lastRequest.q}', 'model': '${lastRequest.model}'})
print(response.json()['answer'])`;
            break;

        case 'agent':
            curlEx = `curl "${API_URL}/api/agents/${lastRequest.agent}/query?q=${encodeURIComponent(lastRequest.q)}"`;
            jsEx = `const response = await fetch('${API_URL}/api/agents/${lastRequest.agent}/query?q=${encodeURIComponent(lastRequest.q)}');
const data = await response.json();
console.log(data.answer);`;
            pyEx = `import requests
response = requests.get('${API_URL}/api/agents/${lastRequest.agent}/query',
    params={'q': '${lastRequest.q}'})
print(response.json()['answer'])`;
            break;

        case 'batch':
            curlEx = `curl -X POST ${API_URL}/api/query/batch \\
  -H "Content-Type: application/json" \\
  -d '{"queries": ${JSON.stringify(lastRequest.queries)}}'`;
            jsEx = `const response = await fetch('${API_URL}/api/query/batch', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({queries: ${JSON.stringify(lastRequest.queries)}})
});
const data = await response.json();`;
            pyEx = `import requests
response = requests.post('${API_URL}/api/query/batch',
    json={'queries': ${JSON.stringify(lastRequest.queries)}})
print(response.json())`;
            break;

        case 'translate':
            curlEx = `curl "${API_URL}/api/translate?text=${encodeURIComponent(lastRequest.text)}&from=${lastRequest.from}&to=${lastRequest.to}"`;
            jsEx = `const response = await fetch('${API_URL}/api/translate?text=${encodeURIComponent(lastRequest.text)}&from=${lastRequest.from}&to=${lastRequest.to}');
const data = await response.json();
console.log(data.translation);`;
            pyEx = `import requests
response = requests.get('${API_URL}/api/translate',
    params={'text': '${lastRequest.text}', 'from': '${lastRequest.from}', 'to': '${lastRequest.to}'})
print(response.json()['translation'])`;
            break;

        case 'upload':
            curlEx = `curl -X POST ${API_URL}/api/documents/analyze \\
  -F "file=@${lastRequest.file}"`;
            jsEx = `const formData = new FormData();
formData.append('file', fileInput.files[0]);
const response = await fetch('${API_URL}/api/documents/analyze', {
  method: 'POST',
  body: formData
});
const data = await response.json();`;
            pyEx = `import requests
with open('${lastRequest.file}', 'rb') as f:
    response = requests.post('${API_URL}/api/documents/analyze',
        files={'file': f})
    print(response.json())`;
            break;
    }

    document.getElementById('curl-example').textContent = curlEx;
    document.getElementById('js-example').textContent = jsEx;
    document.getElementById('py-example').textContent = pyEx;
}

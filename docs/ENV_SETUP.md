# Environment Configuration Guide

Quick guide for configuring your Worksona API server using environment variables.

## Setup Steps

1. **Copy example file** (if not already done):
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys** to `.env`:
   ```bash
   OPENAI_API_KEY=sk-proj-your-key-here
   ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   GOOGLE_API_KEY=your-google-key-here
   ```

3. **Start/restart the server**:
   ```bash
   node worksona-server.js
   ```

## Required Variables

### LLM Provider API Keys (at least one required)

| Provider | Variable | Get Key From |
|----------|----------|--------------|
| OpenAI | `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| Anthropic | `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys |
| Google AI | `GOOGLE_API_KEY` | https://makersuite.google.com/app/apikey |

### Optional Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `PORT` | Server port | 3000 |
| `API_KEY` | Endpoint authentication | (none) |
| `DEBUG` | Verbose logging | false |

## Troubleshooting

### ✗ marks in startup banner
**Issue**: API keys not loaded  
**Fix**: Restart server after adding keys to `.env`

### 500/503 errors on endpoints
**Issue**: Missing or invalid API key  
**Fix**: 
1. Verify key is in `.env`
2. Test key with provider
3. Restart server

### dotenv shows "(0) variables"
**Issue**: `.env` file empty or not found  
**Fix**: Ensure `.env` exists in project root with your keys

## Verify Setup

Check the server startup banner for ✓ marks:
```
║  Providers:                                                   ║
║    OpenAI: ✓                                                  ║
║    Anthropic: ✓                                               ║
║    Google: ✗                                                  ║
```

Or check via API:
```bash
curl http://localhost:3000/api/info
```

## Security

- ⚠️ Never commit `.env` to git (already in `.gitignore`)
- 🔐 Use different keys for dev/production
- 🔄 Rotate keys regularly
- 🛡️ Set `API_KEY` for production deployments

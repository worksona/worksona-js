# Worksona Tools System Guide

## Overview

The Worksona API now includes a powerful tool system that extends agent capabilities with specialized tools for image generation, web scraping, text-to-speech, and more.

## Architecture

**Tool Pattern:**
```
/api/tools/:toolName/:action
/api/agents/:agentId/tools/:toolName/:action
```

**Key Features:**
- ✅ Standalone tool access (no agent required)
- ✅ Agent-enhanced tool access (agents improve inputs/outputs)
- ✅ Extensible tool registry
- ✅ Auto-discovery endpoints
- ✅ Consistent error handling

---

## Available Tools

### 1. DALL-E Image Generator
**ID:** `dalle`
**Category:** generation
**Actions:** `generate`, `edit`, `variations`

Generate, edit, and create variations of images using OpenAI's DALL-E.

### 2. Web Scraper
**ID:** `scraper`
**Category:** utils
**Actions:** `fetch`, `extract`

Extract content and structured data from websites.

### 3. Text-to-Speech (TTS)
**ID:** `tts`
**Category:** generation
**Actions:** `speak`, `generate`

Convert text to natural speech audio in multiple voices.

### 4. Web Search *(Coming Soon)*
**ID:** `search`
**Category:** utils
**Status:** Disabled (requires API key)

---

## Tool Discovery

### List All Tools
```bash
GET /api/tools
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 4,
    "tools": [
      {
        "id": "dalle",
        "name": "DALL-E Image Generator",
        "description": "Generate, edit, and create variations of images",
        "category": "generation",
        "actions": ["generate", "edit", "variations"],
        "enabled": true,
        "endpoints": {
          "direct": "/api/tools/dalle",
          "withAgent": "/api/agents/:agentId/tools/dalle"
        }
      }
      // ... more tools
    ],
    "categories": ["generation", "utils"]
  }
}
```

### Get Tool Info
```bash
GET /api/tools/:toolName/info
```

---

## Tool Usage

### Pattern 1: Direct Tool Access
Use tools without an agent - get raw functionality.

```bash
GET/POST /api/tools/:toolName/:action?params
```

**Example:**
```bash
curl "http://localhost:3000/api/tools/dalle/generate?prompt=sunset"
```

### Pattern 2: Agent-Enhanced Tool Access
Use tools WITH an agent - agents enhance inputs and analyze outputs.

```bash
GET/POST /api/agents/:agentId/tools/:toolName/:action?params
```

**Example:**
```bash
curl "http://localhost:3000/api/agents/marketing-agent/tools/dalle/generate?prompt=logo"
```

**Agent Benefits:**
- 🎨 **Prompt Enhancement**: Agents improve tool inputs (e.g., enhance image prompts)
- 🧠 **Output Analysis**: Agents analyze tool outputs (e.g., summarize scraped content)
- 🎯 **Context Awareness**: Agents apply domain expertise

---

## DALL-E Tool

Generate, edit, and create image variations.

### Generate Image

**Endpoint:** `GET /api/tools/dalle/generate`

**Parameters:**
- `prompt` (required) - Image description
- `size` (optional) - `1024x1024` (default), `1792x1024`, `1024x1792`
- `quality` (optional) - `standard` (default), `hd`
- `style` (optional) - `natural` (default), `vivid`
- `enhance` (optional) - `true` (default), `false` - Enable/disable agent prompt enhancement

**Examples:**

#### Basic Usage
```bash
curl "http://localhost:3000/api/tools/dalle/generate?prompt=A%20mountain%20landscape"
```

#### With Custom Settings
```bash
curl "http://localhost:3000/api/tools/dalle/generate?prompt=Modern%20architecture&size=1792x1024&quality=hd&style=vivid"
```

#### With Agent Enhancement
```bash
# Agent enhances "logo" into a detailed professional prompt
curl "http://localhost:3000/api/agents/marketing-agent/tools/dalle/generate?prompt=logo"
```

**Response:**
```json
{
  "success": true,
  "tool": "dalle",
  "action": "generate",
  "data": {
    "imageUrl": "https://...",
    "prompt": "Detailed enhanced prompt...",
    "originalPrompt": "logo",
    "enhanced": true,
    "settings": {
      "size": "1024x1024",
      "quality": "standard",
      "style": "natural"
    }
  },
  "metadata": {
    "duration": 15000,
    "agent": "marketing-agent"
  }
}
```

### Edit Image

**Endpoint:** `POST /api/tools/dalle/edit`

**Body:**
```json
{
  "image": "base64_or_url",
  "prompt": "Add a sunset",
  "mask": "base64_mask_optional"
}
```

### Create Variations

**Endpoint:** `POST /api/tools/dalle/variations`

**Body:**
```json
{
  "image": "base64_or_url",
  "n": 2
}
```

---

## Web Scraper Tool

Extract content and structured data from websites.

### Fetch Content

**Endpoint:** `GET /api/tools/scraper/fetch`

**Parameters:**
- `url` (required) - Website URL
- `selector` (optional) - CSS selector for specific content
- `format` (optional) - `text` (default)
- `prompt` (optional, with agent) - Analysis instructions

**Examples:**

#### Basic Scraping
```bash
curl "http://localhost:3000/api/tools/scraper/fetch?url=https://example.com"
```

**Response:**
```json
{
  "success": true,
  "tool": "scraper",
  "action": "fetch",
  "data": {
    "url": "https://example.com",
    "content": "Extracted text content...",
    "fullContentLength": 5000,
    "analysis": null,
    "selector": "body",
    "format": "text"
  },
  "metadata": {
    "duration": 500,
    "agent": null,
    "contentLength": 5000
  }
}
```

#### With Specific Selector
```bash
curl "http://localhost:3000/api/tools/scraper/fetch?url=https://example.com&selector=article.main"
```

#### With Agent Analysis
```bash
# Agent analyzes and summarizes the scraped content
curl "http://localhost:3000/api/agents/research-analyst/tools/scraper/fetch?url=https://example.com&prompt=Summarize%20key%20points"
```

**Response with Agent:**
```json
{
  "success": true,
  "tool": "scraper",
  "action": "fetch",
  "data": {
    "url": "https://example.com",
    "content": "Full content...",
    "fullContentLength": 5000,
    "analysis": "The website discusses... Key points include...",
    "selector": "body",
    "format": "text"
  },
  "metadata": {
    "duration": 3000,
    "agent": "research-analyst",
    "contentLength": 5000
  }
}
```

### Extract Structured Data

**Endpoint:** `GET /api/tools/scraper/extract`

**Parameters:**
- `url` (required) - Website URL
- `dataType` (optional) - `auto` (default)

**Example:**
```bash
curl "http://localhost:3000/api/tools/scraper/extract?url=https://example.com"
```

**Response:**
```json
{
  "success": true,
  "tool": "scraper",
  "action": "extract",
  "data": {
    "url": "https://example.com",
    "extracted": {
      "title": "Page Title",
      "headings": ["Heading 1", "Heading 2"],
      "links": [
        {"text": "Link text", "href": "https://..."}
      ],
      "images": [
        {"alt": "Alt text", "src": "https://..."}
      ],
      "meta": {
        "description": "Page description",
        "keywords": "keyword1, keyword2",
        "author": "Author name"
      }
    },
    "dataType": "auto"
  },
  "metadata": {
    "duration": 600,
    "linksFound": 10,
    "imagesFound": 5
  }
}
```

---

## Text-to-Speech Tool

Convert text to natural speech audio.

### Generate Speech

**Endpoint:** `GET /api/tools/tts/speak` or `GET /api/tools/tts/generate`

**Parameters:**
- `text` (required) - Text to convert to speech
- `voice` (optional) - `alloy` (default), `echo`, `fable`, `onyx`, `nova`, `shimmer`
- `speed` (optional) - `0.25` to `4.0` (default: `1.0`)
- `format` (optional) - `mp3` (default)

**Available Voices:**
- `alloy` - Neutral and balanced
- `echo` - Male voice
- `fable` - British accent
- `onyx` - Deep male voice
- `nova` - Female voice
- `shimmer` - Soft female voice

**Examples:**

#### Basic Usage
```bash
curl "http://localhost:3000/api/tools/tts/speak?text=Hello%20world" -o speech.mp3
```

#### With Voice Selection
```bash
curl "http://localhost:3000/api/tools/tts/speak?text=Welcome%20to%20Worksona&voice=nova" -o welcome.mp3
```

#### With Speed Control
```bash
curl "http://localhost:3000/api/tools/tts/speak?text=Fast%20speech&voice=alloy&speed=1.5" -o fast.mp3
```

**Response:**
Returns binary audio file (MP3) for download.

---

## Error Handling

All tools return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "tool": "toolName"
  }
}
```

**Common Error Codes:**
- `TOOL_NOT_FOUND` - Tool doesn't exist
- `TOOL_DISABLED` - Tool is disabled
- `AGENT_NOT_FOUND` - Agent doesn't exist (for agent-scoped requests)
- `INVALID_ACTION` - Action not supported
- `MISSING_PARAMS` - Required parameters missing
- `TOOL_ERROR` - Tool execution failed

---

## Use Cases

### 1. Marketing Content Creation
```bash
# Generate professional marketing image
curl "http://localhost:3000/api/agents/marketing-agent/tools/dalle/generate?prompt=product%20showcase"

# Scrape competitor website
curl "http://localhost:3000/api/agents/marketing-agent/tools/scraper/fetch?url=https://competitor.com&prompt=Analyze%20marketing%20strategy"
```

### 2. Research & Analysis
```bash
# Scrape article and get analysis
curl "http://localhost:3000/api/agents/research-analyst/tools/scraper/fetch?url=https://research-paper.com&prompt=Extract%20methodology%20and%20findings"

# Extract structured data
curl "http://localhost:3000/api/tools/scraper/extract?url=https://data-source.com"
```

### 3. Content Production
```bash
# Generate image
curl "http://localhost:3000/api/tools/dalle/generate?prompt=blog%20header&size=1792x1024"

# Generate voiceover
curl "http://localhost:3000/api/tools/tts/speak?text=Video%20script%20here&voice=nova" -o voiceover.mp3
```

### 4. Legal Document Review
```bash
# Scrape legal document and analyze
curl "http://localhost:3000/api/agents/legal-agent/tools/scraper/fetch?url=https://legal-doc.com&prompt=Review%20for%20compliance%20issues"
```

---

## JavaScript Examples

```javascript
// Generate image
const response = await fetch(
  'http://localhost:3000/api/tools/dalle/generate?prompt=sunset&quality=hd'
);
const data = await response.json();
console.log('Image URL:', data.data.imageUrl);

// Scrape with agent analysis
const scrapeResponse = await fetch(
  'http://localhost:3000/api/agents/research-analyst/tools/scraper/fetch?' +
  new URLSearchParams({
    url: 'https://example.com',
    prompt: 'Summarize main points'
  })
);
const scrapeData = await scrapeResponse.json();
console.log('Analysis:', scrapeData.data.analysis);

// Generate speech
const audioResponse = await fetch(
  'http://localhost:3000/api/tools/tts/speak?text=Hello&voice=nova'
);
const audioBlob = await audioResponse.blob();
const audioUrl = URL.createObjectURL(audioBlob);
```

---

## Python Examples

```python
import requests

# Generate image
response = requests.get(
    'http://localhost:3000/api/tools/dalle/generate',
    params={
        'prompt': 'mountain landscape',
        'quality': 'hd'
    }
)
image_url = response.json()['data']['imageUrl']
print(f'Image: {image_url}')

# Scrape with agent
response = requests.get(
    'http://localhost:3000/api/agents/research-analyst/tools/scraper/fetch',
    params={
        'url': 'https://example.com',
        'prompt': 'Extract key findings'
    }
)
analysis = response.json()['data']['analysis']
print(f'Analysis: {analysis}')

# Generate speech
response = requests.get(
    'http://localhost:3000/api/tools/tts/speak',
    params={
        'text': 'Hello world',
        'voice': 'alloy'
    }
)
with open('speech.mp3', 'wb') as f:
    f.write(response.content)
```

---

## Adding New Tools

The tool system is designed to be easily extensible. Here's how to add a new tool:

### 1. Add to Tool Registry

```javascript
const toolRegistry = {
  // ... existing tools
  'mytool': {
    name: 'My Custom Tool',
    description: 'Description of what it does',
    category: 'utils', // or 'generation', 'analysis', etc.
    actions: ['action1', 'action2'],
    enabled: true
  }
};
```

### 2. Create Tool Handler

```javascript
async function mytoolHandler(action, req, res) {
  const startTime = Date.now();

  try {
    switch(action) {
      case 'action1': {
        const { param1 } = req.query;

        // Tool logic here
        const result = await doSomething(param1);

        // If agent context exists, enhance/analyze
        let analysis = null;
        if (req.agent) {
          analysis = await worksona.chat(req.agent.id,
            `Analyze this: ${result}`
          );
        }

        return res.json({
          success: true,
          tool: 'mytool',
          action: 'action1',
          data: {
            result,
            analysis
          },
          metadata: {
            duration: Date.now() - startTime,
            agent: req.agent?.id || null
          }
        });
      }

      default:
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: `Action "${action}" not supported`
          }
        });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'TOOL_ERROR', message: error.message, tool: 'mytool' }
    });
  }
}
```

### 3. Register Handler

```javascript
const handlers = {
  'dalle': dalleToolHandler,
  'scraper': scraperToolHandler,
  'tts': ttsToolHandler,
  'mytool': mytoolHandler  // Add your handler
};
```

### 4. Add Action Descriptions

```javascript
function getActionDescription(toolName, action) {
  const descriptions = {
    // ... existing tools
    'mytool': {
      'action1': 'Description of action1',
      'action2': 'Description of action2'
    }
  };
  return descriptions[toolName]?.[action] || 'No description available';
}
```

---

## Best Practices

1. **Use Agents for Context**: Agent-enhanced tools provide better results by applying domain expertise

2. **Handle Errors Gracefully**: Always check the `success` field in responses

3. **Rate Limiting**: Be mindful of API rate limits, especially for image generation

4. **Caching**: Cache tool results when appropriate (especially scraper results)

5. **Security**: Validate all URLs before scraping, never scrape internal/private URLs

6. **Cost Management**: Image generation and TTS consume API credits - use judiciously

---

## Troubleshooting

### Tool Not Found
```json
{
  "success": false,
  "error": {
    "code": "TOOL_NOT_FOUND",
    "availableTools": ["dalle", "scraper", "tts"]
  }
}
```
**Solution:** Check tool name spelling, or use `GET /api/tools` to see available tools

### Tool Disabled
```json
{
  "success": false,
  "error": {
    "code": "TOOL_DISABLED"
  }
}
```
**Solution:** Tool requires configuration (e.g., API key). Check server logs.

### Agent Not Found
```json
{
  "success": false,
  "error": {
    "code": "AGENT_NOT_FOUND",
    "availableAgents": ["legal-agent", "marketing-agent", ...]
  }
}
```
**Solution:** Use `GET /api/agents` to see available agents

---

## Summary

The Worksona Tools System provides:

✅ **3 Powerful Tools**: Image generation, web scraping, text-to-speech
✅ **Dual Access Patterns**: Direct access or agent-enhanced
✅ **Agent Intelligence**: Agents improve inputs and analyze outputs
✅ **Extensible Architecture**: Easy to add new tools
✅ **Auto-Discovery**: Tools self-describe their capabilities
✅ **Consistent Interface**: Same patterns across all tools

**Quick Start:**
```bash
# Discover tools
curl http://localhost:3000/api/tools

# Use a tool
curl "http://localhost:3000/api/tools/dalle/generate?prompt=sunset"

# Use with agent enhancement
curl "http://localhost:3000/api/agents/marketing-agent/tools/dalle/generate?prompt=logo"
```

Happy building! 🚀

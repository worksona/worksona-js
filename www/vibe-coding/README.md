# Worksona.js AI Engineering Package 🤖

Enable AI coding assistants (Claude, ChatGPT, Copilot, Cursor) to write Worksona.js code naturally.

## What's Included

- **`worksona-vibe.js`** - Lightweight SDK wrapper with helper methods
- **`AI_CODING_PROMPT.md`** - Complete context prompt for AI assistants
- **`index.html`** - Documentation and getting started guide
- **`README.md`** - This file

## Quick Start (30 seconds)

### 1. Include the SDK

```html
<script src="https://unpkg.com/worksona-js@latest/vibe-coding/worksona-vibe.js"></script>
```

Or via NPM:
```bash
npm install worksona-js
```

### 2. Give AI the Context

Copy this to your AI assistant (Claude, ChatGPT, etc.):

```
I'm using Worksona.js (v0.3.0) - an AI agent management library with multi-provider support.

Documentation: https://worksona.dev/docs/code-examples-hub.html

Available via: worksona.chat(agentId, message)
Supported models: GPT-5, GPT-4o, Claude Opus 4.5, Claude Sonnet 4.5, o3

When helping me code:
1. Use latest model names (gpt-4o, claude-opus-4.5)
2. Show both library and API approaches
3. Include error handling

Ready to code!
```

[Full prompt in AI_CODING_PROMPT.md](./AI_CODING_PROMPT.md)

### 3. Start Coding

Ask your AI assistant:
- "Create a chatbot with GPT-4o"
- "Build a workflow that researches then writes articles"
- "Add image generation with DALL-E"

## Features

### 🎯 Dual-Mode Support
Works in both library mode and API server mode automatically:

```javascript
// Library mode (if worksona.js loaded)
await worksona.chat('assistant', 'Hello!')

// API mode (if server running at localhost:3000)
// Automatically uses REST API
await worksona.chat('assistant', 'Hello!')
```

### 🔗 Workflow Builder
Execute multi-agent workflows easily:

```javascript
const results = await worksona.workflow([
  {
    agent: 'research-analyst',
    prompt: 'Research topic: ${input}',
    outputVariable: 'research',
    options: { temperature: 0.3 }
  },
  {
    agent: 'content-writer',
    prompt: 'Write article based on: ${research}',
    outputVariable: 'article',
    options: { temperature: 0.8 }
  }
], 'AI trends in 2026');

console.log(results.article);
```

### 📚 Built-in Snippets
Get code snippets for common patterns:

```javascript
// Available snippets
worksona.getSnippet('quick-chat')
worksona.getSnippet('load-agent')
worksona.getSnippet('generate-image')
worksona.getSnippet('workflow')
worksona.getSnippet('batch')
worksona.getSnippet('scrape')
worksona.getSnippet('tts')
```

### 📖 Documentation Helper
Quick access to all documentation:

```javascript
const docs = worksona.getDocs()
// {
//   hub: 'https://worksona.dev/docs/index.html',
//   api: 'https://worksona.dev/docs/api-reference-swagger.html',
//   examples: 'https://worksona.dev/docs/code-examples-hub.html',
//   workflows: 'https://worksona.dev/docs/delegation-demo.html'
// }
```

## API Reference

### Core Methods

```javascript
// Chat with an agent
await worksona.chat(agentId, message, options)

// Load an agent
await worksona.loadAgent(config)

// Generate image with DALL-E
await worksona.generateImage(prompt, options)

// Process multiple queries in parallel
await worksona.batch(queries)

// Execute multi-agent workflow
await worksona.workflow(steps, input)

// Get all agents
await worksona.getAgents()

// Web scraping
await worksona.scrape(url)

// Text-to-speech
await worksona.textToSpeech(text, options)
```

### Helper Methods

```javascript
// Get documentation links
worksona.getDocs()

// Get AI coding prompt
worksona.getAICodingPrompt()

// Get code snippet
worksona.getSnippet(patternName)
```

## Supported AI Tools

✅ **Claude Code** - CLI integration
✅ **ChatGPT** - Web & API
✅ **GitHub Copilot** - VS Code extension
✅ **Cursor** - AI-first IDE
✅ **Windsurf** - AI editor
✅ **Replit AI** - Online IDE
✅ **v0.dev** - Vercel AI
✅ **Cline** - VS Code agent

## Usage with Different AI Tools

### Claude Code
Create `.claude/instructions.md`:
```markdown
@file:ai-engineering/AI_CODING_PROMPT.md
```

### Cursor / Windsurf
Add to `.cursorrules`:
```
@worksona-ai-engineering
```

### ChatGPT / Claude Web
Copy the quick start prompt at the beginning of your conversation.

### GitHub Copilot
Add to workspace settings or use inline comments.

## Configuration

### Library Mode
```javascript
const worksona = new WorksonaVibe({
  mode: 'library',
  apiKeys: {
    openai: 'sk-...',
    anthropic: 'sk-ant-...',
    google: '...'
  }
});
```

### API Server Mode
```javascript
const worksona = new WorksonaVibe({
  mode: 'api',
  apiBase: 'http://localhost:3000/api'
});
```

### Auto Mode (Recommended)
```javascript
// Automatically detects available mode
const worksona = new WorksonaVibe({ mode: 'auto' });
```

## Live Examples

Explore complete, working examples in the `examples/` directory:

### 💬 [Example 1: Chatbot Interface](./examples/example-1-chatbot.html)
Interactive chat interface with model selection and temperature control.
```javascript
// Features: GPT-5, GPT-4o, Claude models, o3
const response = await worksona.chat('assistant', 'Hello, how are you?');
console.log(response);
```

### 📝 [Example 2: Content Creation Pipeline](./examples/example-2-content-pipeline.html)
Multi-agent workflow demonstrating Research → Write → Edit → Fact-Check.
```javascript
// 4-step sequential workflow with specialized agents
const results = await worksona.workflow([
  { agent: 'research', prompt: 'Research: ${input}', outputVariable: 'research' },
  { agent: 'writer', prompt: 'Write article: ${research}', outputVariable: 'draft' },
  { agent: 'editor', prompt: 'Edit: ${draft}', outputVariable: 'final' }
], 'Benefits of renewable energy');

console.log('Final article:', results.final);
```

### 🎨 [Example 3: AI Image Generator](./examples/example-3-image-generator.html)
DALL-E 3 image generation with gallery, size options, and quality settings.
```javascript
// Generate stunning images with AI
const imageUrl = await worksona.generateImage(
  'A futuristic cityscape at sunset',
  { size: '1024x1024', quality: 'hd', style: 'vivid' }
);
document.getElementById('result').src = imageUrl;
```

### Code Snippets

Quick snippets for common patterns:

**Batch Processing:**
```javascript
// Process multiple queries in parallel
const results = await worksona.batch([
  { agent: 'assistant', query: 'What is 2+2?' },
  { agent: 'assistant', query: 'What is the capital of France?' },
  { agent: 'assistant', query: 'Who wrote Romeo and Juliet?' }
]);

results.forEach((r, i) => console.log(`Q${i+1}:`, r.response));
```

**Web Scraping:**
```javascript
// Scrape and analyze web content
const content = await worksona.scrape('https://example.com');
console.log('Title:', content.title);
console.log('Text:', content.text);
```

**Text-to-Speech:**
```javascript
// Convert text to speech
const audioUrl = await worksona.textToSpeech(
  'Hello, this is a test of text to speech.',
  { voice: 'alloy' }
);
```

## Documentation Links

- **Getting Started**: [index.html](./index.html)
- **AI Prompt**: [AI_CODING_PROMPT.md](./AI_CODING_PROMPT.md)
- **Main Docs**: [../docs/index.html](../docs/index.html)
- **Code Examples**: [../docs/code-examples-hub.html](../docs/code-examples-hub.html)
- **API Reference**: [../docs/api-reference-swagger.html](../docs/api-reference-swagger.html)

## Benefits

✅ **Faster Development** - Write complex workflows in minutes with AI help
✅ **Best Practices** - AI knows optimal patterns and error handling
✅ **Up-to-date** - Always references latest models and APIs
✅ **Dual-Mode** - AI suggests both library and API approaches
✅ **Complete Context** - AI understands full Worksona.js capabilities

## Troubleshooting

### "worksona is not defined"
Include the SDK script:
```html
<script src="https://unpkg.com/worksona-js@latest/vibe-coding/worksona-vibe.js"></script>
```

### "API connection failed"
Make sure API server is running:
```bash
node worksona-server.js
```

### AI doesn't know Worksona.js
Copy the AI prompt from [AI_CODING_PROMPT.md](./AI_CODING_PROMPT.md)

## Contributing

Found a bug or have a suggestion? Open an issue on [GitHub](https://github.com/worksona/worksona-js/issues).

## License

MIT License - same as Worksona.js

---

**Get Started**: [Open index.html](./index.html) in your browser or copy the AI prompt to start coding with AI assistance!

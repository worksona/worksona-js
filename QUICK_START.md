# Worksona.js Quick Start Guide 🚀

Welcome to Worksona.js! This guide will help you get started quickly based on your use case.

## 📋 Choose Your Path

### 🎯 I want to...

#### 1. **Try it out first** (No installation)
→ Go to: [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html)
- Test all API endpoints in your browser
- See real responses from AI models
- Generate code in 4 languages automatically
- **Time: 5 minutes**

#### 2. **Learn by example** (Copy & paste code)
→ Go to: [`docs/code-examples-hub.html`](docs/code-examples-hub.html)
- 60+ ready-to-use examples
- JavaScript, Node.js, Python, cURL
- Search by keyword
- Copy with one click
- **Time: 10 minutes**

#### 3. **Build multi-agent workflows** (Visual builder)
→ Go to: [`docs/delegation-demo.html`](docs/delegation-demo.html)
- 5 pre-built workflow templates
- Visual workflow builder with Mermaid diagrams
- Execute workflows and see results
- Export code in multiple languages
- **Time: 15 minutes**

#### 4. **Understand the architecture** (Read documentation)
→ Go to: [`docs/index.html`](docs/index.html)
- Complete documentation hub
- 5 major sections
- Architecture diagrams
- Getting started guides
- **Time: 20 minutes**

#### 5. **Use as a library** (NPM installation)
```bash
npm install worksona-js
```
Then try: [`docs/library-internal-demo.html`](docs/library-internal-demo.html)
- **Time: 15 minutes**

#### 6. **Deploy as API server** (Production setup)
```bash
git clone https://github.com/worksona/worksona-js
cd worksona-js
npm install
node worksona-server.js
```
Then read: [`docs/api-reference-swagger.html`](docs/api-reference-swagger.html)
- **Time: 30 minutes**

## 🎬 30-Second Start

**The absolute fastest way to get started:**

1. Open [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html) in your browser
2. Click "Execute" on any example
3. See the response
4. Copy the generated code
5. Done! 🎉

## 📚 Documentation Map

```
worksona-js/
├── docs/
│   ├── index.html                    ← Start here (Documentation Hub)
│   ├── api-reference-swagger.html    ← API Reference (Interactive)
│   ├── endpoint-api-demo.html        ← Try Demo (No installation)
│   ├── library-internal-demo.html    ← Library Usage Demo
│   ├── code-examples-hub.html        ← 60+ Code Examples
│   ├── delegation-demo.html          ← Workflow Builder
│   └── openapi-spec.yaml             ← OpenAPI Specification
├── marketing/
│   └── index.html                    ← Product Overview
├── README.md                         ← You are here
├── QUICK_START.md                    ← This file
└── DOCUMENTATION_INDEX.md            ← Complete index
```

## 🎓 Learning Paths

### Path 1: For Developers (Library Mode)
1. Read: [`docs/index.html`](docs/index.html) → Core Library section
2. Try: [`docs/library-internal-demo.html`](docs/library-internal-demo.html)
3. Copy code: [`docs/code-examples-hub.html`](docs/code-examples-hub.html) → Quick Start
4. Reference: [`README.md`](README.md)

**Time: 1 hour**

### Path 2: For API Users (Server Mode)
1. Read: [`docs/index.html`](docs/index.html) → REST API section
2. Try: [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html)
3. Reference: [`docs/api-reference-swagger.html`](docs/api-reference-swagger.html)
4. Deploy: Start server and integrate

**Time: 1.5 hours**

### Path 3: For Multi-Agent Workflows
1. Read: [`docs/index.html`](docs/index.html) → Delegators section
2. Try: [`docs/delegation-demo.html`](docs/delegation-demo.html)
3. Examples: [`docs/code-examples-hub.html`](docs/code-examples-hub.html) → Advanced Patterns
4. Build: Create your custom workflow

**Time: 2 hours**

### Path 4: For Decision Makers
1. Start: [`marketing/index.html`](marketing/index.html)
2. Compare: View comparison table
3. Calculate: Use cost calculator
4. Try: [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html)

**Time: 30 minutes**

## 💡 Top 5 Features to Try First

1. **Chat with Latest Models** (GPT-5, Claude Opus 4.5, o3)
   - Demo: [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html) → Simple Query tab

2. **Generate Images with DALL-E 3**
   - Demo: [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html) → Images tab

3. **Process Documents (OCR)**
   - Demo: [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html) → Documents tab

4. **Build Multi-Agent Workflow**
   - Demo: [`docs/delegation-demo.html`](docs/delegation-demo.html) → Content Creation template

5. **Analyze Images with Vision**
   - Demo: [`docs/library-internal-demo.html`](docs/library-internal-demo.html) → Images tab

## 🔑 Getting API Keys

Before you can use Worksona.js, you need API keys from the providers:

### OpenAI (Required for GPT models and DALL-E)
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy key (starts with `sk-proj-...`)
4. Cost: Pay-as-you-go (GPT-4o: ~$2.50/1M tokens)

### Anthropic (Required for Claude models)
1. Go to: https://console.anthropic.com/
2. Navigate to API Keys
3. Create key (starts with `sk-ant-...`)
4. Cost: Pay-as-you-go (Claude Opus 4.5: ~$15/1M tokens)

### Google (Optional for Gemini)
1. Go to: https://ai.google.dev/
2. Get API key
3. Cost: Free tier available

## 🐛 Troubleshooting

### "Server offline" in demos
→ Start the API server: `node worksona-server.js`

### "Invalid API key"
→ Check your API keys in environment variables or demo interface

### "CORS error"
→ The API server includes CORS headers, but check browser console

### "404 Not Found"
→ Ensure you're opening HTML files from the correct directory

### "Mermaid diagrams not showing"
→ Check internet connection (Mermaid loads from CDN)

## 🆘 Need Help?

- **Documentation**: [`docs/index.html`](docs/index.html)
- **Examples**: [`docs/code-examples-hub.html`](docs/code-examples-hub.html)
- **API Reference**: [`docs/api-reference-swagger.html`](docs/api-reference-swagger.html)
- **GitHub Issues**: https://github.com/worksona/worksona-js/issues
- **Discussions**: https://github.com/worksona/worksona-js/discussions

## 🎯 What to Do Next?

After completing this quick start:

1. ✅ Try the demos
2. ✅ Read the documentation
3. ✅ Copy some examples
4. ✅ Build your first agent
5. ✅ Create a multi-agent workflow
6. ✅ Deploy to production
7. ✅ Share your project!

## 📊 Feature Matrix

| Feature | Library Mode | API Server Mode |
|---------|-------------|-----------------|
| Chat with AI | ✅ | ✅ |
| Image Generation | ✅ | ✅ |
| Image Analysis | ✅ | ✅ |
| Document OCR | ❌ | ✅ |
| File Upload | ❌ | ✅ |
| Multi-Agent Workflows | ✅ | ✅ |
| Web Scraper | ❌ | ✅ |
| Text-to-Speech | ❌ | ✅ |
| REST API | ❌ | ✅ |
| Control Panel | ✅ | ❌ |

## 💰 Cost Estimate

Use our interactive calculator: [`marketing/index.html`](marketing/index.html)

**Example costs:**
- 10K queries/month with GPT-4o: ~$25/month
- 10K queries/month with Claude Opus 4.5: ~$75/month
- 10K queries/month with Gemini Pro: ~$10/month

**Worksona.js is free** - you only pay for LLM API usage!

## 🚀 Ready to Build?

Pick your starting point above and dive in. Happy coding! 🎉

---

**Pro Tip**: The fastest way to understand Worksona.js is to try all the demos in this order:
1. [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html) - See it work
2. [`docs/code-examples-hub.html`](docs/code-examples-hub.html) - Copy the code
3. [`docs/delegation-demo.html`](docs/delegation-demo.html) - Build workflows
4. Deploy your own! 🚀

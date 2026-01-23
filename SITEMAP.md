# Worksona.js Documentation Sitemap 🗺️

Visual guide to all documentation and resources.

## 📁 File Structure Overview

```
worksona-js/
│
├── 📚 DOCUMENTATION (Start Here!)
│   ├── README.md                      Main project readme
│   ├── QUICK_START.md                 ⭐ Quick start guide (You are here!)
│   ├── DOCUMENTATION_INDEX.md         Complete documentation index
│   ├── DOCUMENTATION_COMPLETE.md      Implementation details
│   └── SITEMAP.md                     This file
│
├── 🎯 INTERACTIVE DEMOS (Try in Browser)
│   ├── www/
│   │   ├── docs/
│   │   │   ├── index.html                 ⭐ Documentation Hub (START HERE)
│   │   │   ├── api-reference-swagger.html  Interactive API Reference
│   │   │   └── code-examples-hub.html     ⭐ 60+ Code Examples
│   │   ├── demos/
│   │   │   ├── index.html                 Demos Home
│   │   │   ├── endpoint-api-demo.html     ⭐ API Testing Demo
│   │   │   ├── library-internal-demo.html  Library Usage Demo
│   │   │   ├── delegation-demo.html       ⭐ Visual Workflow Builder
│   │   │   └── examples/                  Additional examples
│   │   └── marketing/
│   │       └── index.html                  Product Landing Page
│
├── 🔌 API SPECIFICATION
│   ├── worksona-api.yaml               OpenAPI 3.0 Specification
│   └── www/openapi-spec.yaml           OpenAPI 3.0 Specification (www)
│
├── 🤖 AGENT CONFIGURATIONS
│   └── agents/
│       ├── interviewer-agent.json
│       ├── legal-agent.json
│       ├── marketing-agent.json
│       ├── prd-editor-agent.json
│       └── research-analyst.json
│
├── 💻 SOURCE CODE
│   ├── worksona.js                     Main library (2,432 lines)
│   ├── worksona.min.js                 Minified version (52KB)
│   ├── worksona-server.js              REST API Server
│   └── worksona.d.ts                   TypeScript definitions (updated with GPT Image support)
│
├── 📦 EXAMPLES
│   └── examples/
│       └── (Your example files here)
│
└── 🛠️ CONFIGURATION
    ├── package.json                    NPM configuration
    ├── .env                            Environment variables
    ├── .env.example                    Environment variables template
    └── jest.config.js                  Jest test configuration
```

## 🎯 Documentation by Purpose

### 📖 Learning & Getting Started

| What | Where | Time | Audience |
|------|-------|------|----------|
| Quick overview | [`README.md`](README.md) | 5 min | Everyone |
| Choose your path | [`QUICK_START.md`](QUICK_START.md) | 2 min | New users |
| Complete guide | [`docs/index.html`](docs/index.html) | 20 min | Developers |
| Try demo first | [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html) | 10 min | Everyone |

### 💻 For Developers

| What | Where | Time | Audience |
|------|-------|------|----------|
| Library usage | [`docs/library-internal-demo.html`](docs/library-internal-demo.html) | 15 min | Frontend devs |
| Code examples | [`docs/code-examples-hub.html`](docs/code-examples-hub.html) | Varies | All developers |
| API reference | [`docs/api-reference-swagger.html`](docs/api-reference-swagger.html) | 30 min | Backend devs |
| OpenAPI spec | [`docs/openapi-spec.yaml`](docs/openapi-spec.yaml) | - | API developers |

### 🔗 For Multi-Agent Workflows

| What | Where | Time | Audience |
|------|-------|------|----------|
| Workflow builder | [`docs/delegation-demo.html`](docs/delegation-demo.html) | 20 min | Advanced users |
| Delegation guide | [`docs/index.html#delegators`](docs/index.html) | 10 min | Architects |
| Examples | [`docs/code-examples-hub.html#advanced`](docs/code-examples-hub.html) | 15 min | Developers |

### 🚀 For Decision Makers

| What | Where | Time | Audience |
|------|-------|------|----------|
| Product overview | [`marketing/index.html`](marketing/index.html) | 10 min | Managers |
| Cost calculator | [`marketing/index.html#pricing`](marketing/index.html) | 5 min | Finance |
| Comparison table | [`marketing/index.html#compare`](marketing/index.html) | 5 min | Technical leads |
| Use cases | [`marketing/index.html#use-cases`](marketing/index.html) | 10 min | Product teams |

## 🎓 Learning Paths

### Path 1: Absolute Beginner
```
1. README.md (5 min)
   ↓
2. QUICK_START.md (2 min)
   ↓
3. docs/endpoint-api-demo.html (10 min)
   ↓
4. docs/code-examples-hub.html (20 min)
   ↓
5. Build your first agent! 🎉
```

### Path 2: Experienced Developer
```
1. docs/index.html (15 min)
   ↓
2. docs/api-reference-swagger.html (20 min)
   ↓
3. docs/code-examples-hub.html (quick scan)
   ↓
4. Deploy to production! 🚀
```

### Path 3: AI/ML Engineer
```
1. docs/index.html#core (10 min)
   ↓
2. docs/delegation-demo.html (20 min)
   ↓
3. docs/code-examples-hub.html#advanced (15 min)
   ↓
4. Build complex workflows! 🔗
```

### Path 4: Product Manager
```
1. marketing/index.html (10 min)
   ↓
2. docs/endpoint-api-demo.html (5 min)
   ↓
3. docs/delegation-demo.html (10 min)
   ↓
4. Make informed decision! 💡
```

## 🔍 Find by Topic

### Chat & Messaging
- Demo: [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html) → Simple Query tab
- Examples: [`docs/code-examples-hub.html#chat-operations`](docs/code-examples-hub.html)
- Docs: [`docs/index.html#core`](docs/index.html)

### Image Generation
- Demo: [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html) → Images tab
- Examples: [`docs/code-examples-hub.html#image-processing`](docs/code-examples-hub.html)
- Docs: [`docs/index.html#tooling`](docs/index.html)

### Document Processing
- Demo: [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html) → Documents tab
- Examples: [`docs/code-examples-hub.html#document-processing`](docs/code-examples-hub.html)
- Docs: [`docs/index.html#rest-api`](docs/index.html)

### Multi-Agent Workflows
- Demo: [`docs/delegation-demo.html`](docs/delegation-demo.html)
- Examples: [`docs/code-examples-hub.html#advanced-patterns`](docs/code-examples-hub.html)
- Docs: [`docs/index.html#delegators`](docs/index.html)

### Agent Configuration
- Demo: [`docs/library-internal-demo.html`](docs/library-internal-demo.html) → Agents tab
- Examples: [`docs/code-examples-hub.html#agent-management`](docs/code-examples-hub.html)
- Docs: [`docs/index.html#endpoint-agents`](docs/index.html)

### Tools (DALL-E, Scraper, TTS)
- Demo: [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html) → Tools tab
- Examples: [`docs/code-examples-hub.html#image-processing`](docs/code-examples-hub.html)
- Docs: [`docs/index.html#tooling`](docs/index.html)

## 📱 Quick Access by Use Case

### "I want to build a chatbot"
1. [`docs/index.html#core`](docs/index.html) - Understand the basics
2. [`docs/code-examples-hub.html#chat-operations`](docs/code-examples-hub.html) - Copy chat code
3. [`docs/library-internal-demo.html`](docs/library-internal-demo.html) - See it in action

### "I need to process documents"
1. [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html) - Try OCR
2. [`docs/code-examples-hub.html#document-processing`](docs/code-examples-hub.html) - Get the code
3. [`docs/api-reference-swagger.html`](docs/api-reference-swagger.html) - API details

### "I want to generate images"
1. [`www/demos/endpoint-api-demo.html`](www/demos/endpoint-api-demo.html) - Test GPT Image 1.5 & DALL-E
2. [`www/docs/code-examples-hub.html#image-processing`](www/docs/code-examples-hub.html) - Examples
3. [`www/demos/library-internal-demo.html`](www/demos/library-internal-demo.html) - Interactive demo
4. [`docs/MODELS_AND_PARAMETERS.md`](docs/MODELS_AND_PARAMETERS.md) - Complete model reference

### "I need multi-agent workflows"
1. [`www/demos/delegation-demo.html`](www/demos/delegation-demo.html) - Visual builder
2. [`www/docs/code-examples-hub.html#advanced-patterns`](www/docs/code-examples-hub.html) - Code patterns
3. [`www/docs/index.html#delegators`](www/docs/index.html) - Architecture

### "I want a REST API"
1. [`docs/api-reference-swagger.html`](docs/api-reference-swagger.html) - API reference
2. [`docs/endpoint-api-demo.html`](docs/endpoint-api-demo.html) - Test endpoints
3. `node worksona-server.js` - Deploy

## 🎨 By Format

### Interactive HTML Demos
- [`www/docs/index.html`](www/docs/index.html) - Documentation hub
- [`www/docs/api-reference-swagger.html`](www/docs/api-reference-swagger.html) - Swagger UI
- [`www/demos/endpoint-api-demo.html`](www/demos/endpoint-api-demo.html) - API demo
- [`www/demos/library-internal-demo.html`](www/demos/library-internal-demo.html) - Library demo
- [`www/docs/code-examples-hub.html`](www/docs/code-examples-hub.html) - Examples
- [`www/demos/delegation-demo.html`](www/demos/delegation-demo.html) - Workflows
- [`www/marketing/index.html`](www/marketing/index.html) - Landing page

### Markdown Documentation
- [`README.md`](README.md) - Project overview
- [`QUICK_START.md`](QUICK_START.md) - Quick start guide
- [`DOCUMENTATION_INDEX.md`](DOCUMENTATION_INDEX.md) - Complete index
- [`DOCUMENTATION_COMPLETE.md`](DOCUMENTATION_COMPLETE.md) - Implementation details
- [`CHANGELOG.md`](CHANGELOG.md) - Version history
- [`SITEMAP.md`](SITEMAP.md) - This file

### Specification Files
- [`worksona-api.yaml`](worksona-api.yaml) - OpenAPI 3.0
- [`www/openapi-spec.yaml`](www/openapi-spec.yaml) - OpenAPI 3.0 (www)
- [`package.json`](package.json) - NPM package
- [`worksona.d.ts`](worksona.d.ts) - TypeScript definitions (updated)

### Testing Documentation
- [`docs/API_TESTING_GUIDE.md`](docs/API_TESTING_GUIDE.md) - Complete testing guide
- [`tests/README.md`](tests/README.md) - Test setup and structure
- [`tests/api.test.js`](tests/api.test.js) - API endpoint tests
- [`tests/integration.test.js`](tests/integration.test.js) - Integration tests

### Source Code
- [`worksona.js`](worksona.js) - Main library
- [`worksona-server.js`](worksona-server.js) - API server

## 🔗 External Links

- **GitHub**: https://github.com/worksona/worksona-js
- **NPM**: https://www.npmjs.com/package/worksona-js
- **Issues**: https://github.com/worksona/worksona-js/issues
- **Discussions**: https://github.com/worksona/worksona-js/discussions

## 📊 Statistics

- **Total Files**: 15+ documentation files
- **Lines of Code**: ~12,000+ (documentation)
- **Code Examples**: 60+ (in 4 languages = 240 total)
- **Interactive Demos**: 6
- **Workflow Templates**: 5
- **API Endpoints**: 32+
- **Mermaid Diagrams**: 8
- **Test Suites**: 2 (API + Integration)
- **Test Coverage**: Comprehensive coverage of all endpoints
- **Supported Models**: 30+ (including GPT Image 1.5, GPT-5, Claude Opus 4.5)

## 🎯 Recommended Starting Points

### For Everyone
→ **Start**: [`QUICK_START.md`](QUICK_START.md)

### For Developers
→ **Start**: [`docs/index.html`](docs/index.html)

### For Managers
→ **Start**: [`marketing/index.html`](marketing/index.html)

### For Integration
→ **Start**: [`docs/api-reference-swagger.html`](docs/api-reference-swagger.html)

### For Learning
→ **Start**: [`docs/code-examples-hub.html`](docs/code-examples-hub.html)

---

**Can't find what you're looking for?**
- Check [`DOCUMENTATION_INDEX.md`](DOCUMENTATION_INDEX.md) for complete listing
- Search on GitHub: https://github.com/worksona/worksona-js
- Ask in Discussions: https://github.com/worksona/worksona-js/discussions

**Pro Tip**: Most people start with [`www/demos/endpoint-api-demo.html`](www/demos/endpoint-api-demo.html) to see it in action! 🎉

**Testing**: Run `npm test` to verify everything works, or check [`docs/API_TESTING_GUIDE.md`](docs/API_TESTING_GUIDE.md) for complete testing documentation.

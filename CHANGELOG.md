# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-18

### Added - Frontier Models Support 🚀

#### OpenAI Models
- **GPT-5 series support**
  - `gpt-5` - Latest flagship model for most complex tasks
  - `gpt-5-mini` - Balanced performance and cost
  - `gpt-5-nano` - Fast and efficient for simple tasks
- **o-series reasoning models**
  - `o3` - Advanced reasoning capabilities
  - `o3-mini` - Efficient reasoning
  - `o1`, `o1-mini`, `o1-preview` - Previous generation reasoning models
- Complete model list with categorization in provider configuration
- Added `supportedModels` array to OpenAI provider

#### Anthropic Models
- **Claude 4.5 series support**
  - `claude-opus-4-5-20251101` - Most capable Claude model
  - `claude-sonnet-4-5-20250929` - Balanced performance (new default)
- **Claude 3.5 series**
  - `claude-3-5-sonnet-20241022` - Updated Sonnet 3.5
  - `claude-3-5-haiku-20241022` - Fast and efficient
- Added `supportedModels` array to Anthropic provider
- Maintained backward compatibility with all Claude 3 and Claude 2 models

#### Documentation & Examples
- Created `llm.txt` for AI-friendly documentation
  - Comprehensive API reference optimized for LLMs
  - Model selection guidelines by use case
  - Common patterns and best practices
  - Error handling examples
  - Performance optimization tips
- Added `examples/frontier-models-demo.html`
  - Interactive testing for all new models
  - Multi-agent system demonstration
  - Real-time response comparison
  - Side-by-side model testing
- Updated README.md with:
  - "What's New in v0.2.0" section
  - Comprehensive model support table
  - Updated examples using latest models
  - Model selection guidelines

### Changed
- Updated default OpenAI model from `gpt-3.5-turbo` to `gpt-4o`
- Updated default Anthropic model from `claude-3-opus-20240229` to `claude-sonnet-4-5-20250929`
- Enhanced version documentation throughout codebase
- Improved package.json keywords for better discoverability:
  - Added: `gpt-5`, `claude-opus-4.5`, `claude-sonnet-4.5`, `o1`, `o3`
  - Added: `frontier-models`, `agentic-orchestration`, `entrepreneurial-prototyping`
- Updated image generation documentation to clarify DALL-E 3 support

### Maintained
- **Full backward compatibility** with all previous model versions
  - All GPT-4, GPT-3.5 models still supported
  - All Claude 3, Claude 2 models still supported
  - Existing agent configurations work without changes
- No breaking changes to public APIs
- All existing features continue to work as expected

### Technical
- Enhanced model selection logic with better fallbacks
- Improved error messages for unsupported models
- Added comprehensive model lists for validation
- Optimized for fast entrepreneurial prototyping and agentic orchestration

---

## [0.2.0] - 2026-01-06 (Previous Release)

### Changed
- **Package Renamed**: Changed package name from `worksona` to `worksona-js`
- **NPM Publishing**: Published to npm at https://www.npmjs.com/package/worksona-js
- Updated all documentation with new package name and installation instructions
- Updated CDN links to use unpkg.com/worksona-js

### Fixed
- Removed circular self-dependency from package.json
- Fixed CDN and installation references across all documentation

### Installation
```bash
npm i worksona-js
```

**CDN:**
```html
<script src="https://unpkg.com/worksona-js@latest/worksona.min.js"></script>
```

**NPM Package:** https://www.npmjs.com/package/worksona-js

---

## [0.1.2] - 2024-12-19

### Added
- Complete image processing pipeline with 4 core capabilities:
  - Image analysis using GPT-4o vision
  - Image generation with DALL-E 3
  - Image editing with natural language prompts
  - Image variations generation
- Comprehensive TypeScript definitions
- Built-in floating control panel for development and monitoring
- Real-time agent monitoring and metrics tracking
- Event-driven architecture with comprehensive event system
- Multi-provider LLM support (OpenAI, Anthropic, Google)
- Agent personality system with traits and examples
- Transaction history and performance metrics
- Error handling with specific error codes
- NPM package configuration for publishing

### Features
- **Multi-Provider Support**: OpenAI (full), Anthropic (chat), Google (chat)
- **Image Processing**: Complete visual AI pipeline
- **Agent Management**: Rich personality configuration system
- **Control Panel**: Real-time monitoring and debugging interface
- **Events**: Comprehensive event system for integration
- **Single File**: Zero dependencies, easy deployment

### Technical
- Minified version included for CDN distribution
- Browser and Node.js compatibility
- ES2018+ support
- Comprehensive error handling
- Automatic transaction history management (last 100 transactions)
- Built-in retry mechanisms and provider fallback support

### Documentation
- Complete API reference documentation
- Working HTML demos for all features
- TypeScript definitions for developer experience
- Comprehensive README with examples
- Agent configuration schema documentation

## [Unreleased]

### Planned
- Streaming response support
- Additional provider integrations
- Enhanced caching mechanisms
- Mobile-optimized control panel
- Plugin architecture
- Unit test coverage 
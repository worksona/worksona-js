# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-06

### Changed
- **Package Renamed**: Changed package name from `worksona` to `worksona-js`
- **NPM Publishing**: Published to npm at https://www.npmjs.com/package/worksona-js
- Updated all documentation with new package name and installation instructions
- Updated CDN links to use unpkg.com/worksona-js

### Fixed
- Removed circular self-dependency from package.json
- Fixed CDN and installation references across all documentation

### Documentation
- Updated README.md with new package name
- Updated TECH-SPEC.md with version 0.2.0
- Updated PUBLISHING.md with correct package information
- Created PACKAGE_INFO.md as quick reference guide

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
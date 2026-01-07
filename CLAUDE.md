# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build and Development
- `npm run build` - Build the project by minifying worksona.js
- `npm run minify` - Minify worksona.js to create worksona.min.js using terser
- `npm run validate` - Validate JavaScript syntax using Node.js
- `npm run prepare` - Runs automatically before publishing (calls build)
- `npm run prepack` - Runs before packaging (validates and builds)

### Testing
- No test suite is currently configured (`npm test` returns error)
- Manual testing can be done by opening HTML files in the `docs/` directory

### Validation
- `node -c worksona.js` - Check JavaScript syntax
- Use browser developer tools to test the library functionality

## Architecture Overview

### Single-File Library Structure
This is a single-file JavaScript library (`worksona.js`) that provides AI agent management across multiple LLM providers. The codebase is approximately 2,241 lines and follows a self-contained architecture pattern.

### Core Components

**Agent Class** (lines 12-91)
- Manages individual agent state, configuration, and conversation history
- Handles metrics tracking and transaction history
- Normalizes configuration to prevent nesting issues

**Worksona Class** (lines 96-2232)
- Core orchestrator managing multiple agents and provider integrations
- Handles API communications with OpenAI, Anthropic, and Google
- Provides unified interface for agent operations
- Manages visual control panel for development/debugging

### Provider Integrations
- **OpenAI**: Full support including GPT models, vision capabilities, and DALL-E image generation
- **Anthropic**: Claude models with message formatting and conversation history
- **Google**: Gemini models with safety settings and generation parameters

### Key Features
- **Image Processing Pipeline**: Analysis, generation, editing, and variations
- **Event-Driven Architecture**: Comprehensive event system for loose coupling
- **Control Panel**: Floating UI for development, monitoring, and configuration
- **Memory Management**: Transaction history limited to 100 entries per agent

## File Structure

### Main Files
- `worksona.js` - Main library file (2,241 lines)
- `worksona.min.js` - Minified version for production
- `worksona.d.ts` - TypeScript definitions

### Configuration
- `agents/` - Pre-configured agent JSON files (interviewer, legal, marketing, etc.)
- `package.json` - Project configuration and build scripts

### Documentation
- `README.md` - Comprehensive usage documentation
- `WORKSONA_DOCUMENTATION.md` - Extended documentation
- `docs/` - HTML examples and API reference

## Development Workflow

### Making Changes
1. Edit `worksona.js` directly (single-file architecture)
2. Run `npm run validate` to check syntax
3. Run `npm run build` to create minified version
4. Test changes using HTML files in `docs/` directory

### Agent Configuration
Agents are configured using JSON files in the `agents/` directory. Each agent has:
- Personality traits and knowledge domains
- Provider-specific configuration (model, temperature, etc.)
- System prompts and conversation examples

### Adding New Providers
Provider implementations are within the main Worksona class. Each provider needs:
- API integration method
- Error handling specific to that provider
- Parameter mapping to the provider's API format

## Important Notes

### Dependencies
- **Runtime**: No external dependencies (single-file design)
- **Development**: Only `terser` for minification

### Browser/Node Compatibility
- Modern browsers (ES2018+)
- Node.js 14+
- Self-contained with no external dependencies

### Error Handling
The library includes comprehensive error handling with specific error codes for different failure scenarios (API errors, configuration issues, etc.).

### Memory Management
Transaction history is automatically limited to 100 entries per agent to prevent memory issues in long-running applications.
# API Testing Guide

Complete guide for automating tests for the Worksona API Server.

## Quick Start

### 1. Install Test Dependencies

```bash
npm install --save-dev jest supertest
```

### 2. Run Tests

```bash
npm test
```

### 3. Run with Coverage

```bash
npm run test:coverage
```

## Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:api` | Run only API endpoint tests |
| `npm run test:integration` | Run only integration tests |

## Test Structure

```
tests/
├── api.test.js          # Main API endpoint tests
├── integration.test.js  # Integration and workflow tests
├── setup.js            # Test configuration
├── fixtures/           # Test files (images, documents)
└── README.md           # Test documentation
```

## Writing Tests

### Basic Test Example

```javascript
const request = require('supertest');
const app = require('../worksona-server.js');

describe('Health Endpoint', () => {
  test('GET /health should return ok', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.status).toBe('ok');
  });
});
```

### Testing Agent Endpoints

```javascript
describe('Agent Management', () => {
  const testAgent = {
    id: 'test-agent',
    name: 'Test Agent',
    config: {
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.7
    }
  };

  test('should create agent', async () => {
    const response = await request(app)
      .post('/api/agents/load')
      .send(testAgent)
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

### Testing File Uploads

```javascript
const path = require('path');

test('should upload and process file', async () => {
  const response = await request(app)
    .post('/api/agents/my-agent/upload')
    .attach('file', path.join(__dirname, 'fixtures', 'test.pdf'))
    .field('prompt', 'Analyze this document')
    .expect(200);

  expect(response.body.success).toBe(true);
});
```

### Testing Error Cases

```javascript
test('should return 404 for non-existent agent', async () => {
  const response = await request(app)
    .get('/api/agents/non-existent')
    .expect(404);

  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe('AGENT_NOT_FOUND');
});
```

## Test Configuration

### Environment Variables

Create `.env.test` for test-specific configuration:

```bash
PORT=3001
OPENAI_API_KEY=test-key
ANTHROPIC_API_KEY=test-key
GOOGLE_API_KEY=test-key
```

### Jest Configuration

See `jest.config.js` for full configuration. Key settings:

- **Test Timeout**: 30 seconds (for API calls)
- **Coverage**: Collects from `worksona-server.js` and `worksona.js`
- **Test Match**: All `*.test.js` files in `tests/` directory

## Mocking External APIs

To avoid making real API calls during tests:

```javascript
jest.mock('../worksona.js', () => ({
  chat: jest.fn().mockResolvedValue('Mocked response'),
  generateImage: jest.fn().mockResolvedValue('data:image/png;base64,...'),
  loadAgent: jest.fn().mockResolvedValue({ id: 'test-agent' })
}));
```

## Continuous Integration

### GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/test.yml`) that:

1. Runs tests on push and pull requests
2. Tests against multiple Node.js versions (18.x, 20.x)
3. Generates coverage reports
4. Uploads coverage to Codecov (optional)

### Running Tests Locally Before CI

```bash
# Run all tests
npm test

# Run with verbose output
npm test -- --verbose

# Run specific test file
npm test -- tests/api.test.js

# Run tests matching pattern
npm test -- --testNamePattern="Agent"
```

## Test Coverage

### View Coverage Report

```bash
npm run test:coverage
```

Coverage report is generated in `coverage/` directory:
- `coverage/lcov-report/index.html` - HTML report
- `coverage/lcov.info` - LCOV format (for CI)

### Coverage Goals

Aim for:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Best Practices

### 1. Test Isolation

Each test should be independent and not rely on other tests:

```javascript
// Good: Each test creates its own agent
test('test 1', async () => {
  const agentId = `test-${Date.now()}`;
  // ... test code
});

// Bad: Tests share state
let sharedAgentId;
test('test 1', () => {
  sharedAgentId = 'test-agent';
});
```

### 2. Cleanup After Tests

Always clean up test data:

```javascript
afterAll(async () => {
  await request(app).delete(`/api/agents/${testAgentId}`);
});
```

### 3. Use Descriptive Test Names

```javascript
// Good
test('POST /api/agents/load should create agent with valid config', ...);

// Bad
test('creates agent', ...);
```

### 4. Test Both Success and Error Cases

```javascript
describe('Agent Creation', () => {
  test('should succeed with valid config', ...);
  test('should fail with missing id', ...);
  test('should fail with invalid provider', ...);
});
```

### 5. Use Test Fixtures

Store test files in `tests/fixtures/`:

```
tests/fixtures/
├── test-image.png
├── test-document.pdf
└── test-document.docx
```

## Troubleshooting

### Tests Timing Out

Increase timeout in `setup.js`:

```javascript
jest.setTimeout(60000); // 60 seconds
```

### Port Already in Use

Change test port:

```javascript
process.env.PORT = '3002';
```

### Rate Limiting Issues

Add delays between tests or use mocking:

```javascript
afterEach(async () => {
  await sleep(1000); // Wait 1 second
});
```

### API Keys Not Set

Ensure environment variables are set or use mock keys in test setup.

## Advanced Testing

### Testing Webhooks

```javascript
test('should send webhook', async () => {
  const mockWebhook = jest.fn();
  
  // Setup webhook listener
  // ... setup code
  
  const response = await request(app)
    .post('/api/webhook/my-agent')
    .send({ text: 'Test webhook' })
    .expect(200);

  expect(mockWebhook).toHaveBeenCalled();
});
```

### Testing Batch Operations

```javascript
test('should process batch queries', async () => {
  const response = await request(app)
    .post('/api/query/batch')
    .send({
      queries: [
        { agent: 'agent-1', query: 'Query 1' },
        { agent: 'agent-2', query: 'Query 2' }
      ]
    })
    .expect(200);

  expect(response.body.data.results).toHaveLength(2);
});
```

### Performance Testing

```javascript
test('should respond within acceptable time', async () => {
  const start = Date.now();
  
  await request(app)
    .get('/api/info')
    .expect(200);

  const duration = Date.now() - start;
  expect(duration).toBeLessThan(1000); // Less than 1 second
});
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [API Testing Best Practices](https://www.postman.com/api-platform/api-testing/)

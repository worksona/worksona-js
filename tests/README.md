# API Testing Guide

This directory contains automated tests for the Worksona API Server.

## Setup

### Install Dependencies

```bash
npm install --save-dev jest supertest
```

### Configure Environment

Create a `.env.test` file for test-specific environment variables:

```bash
PORT=3001
OPENAI_API_KEY=your-test-key
ANTHROPIC_API_KEY=your-test-key
GOOGLE_API_KEY=your-test-key
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npm test -- tests/api.test.js
```

### Run with Coverage

```bash
npm test -- --coverage
```

### Run in Watch Mode

```bash
npm test -- --watch
```

### Run Verbose Output

```bash
npm test -- --verbose
```

## Test Structure

- `api.test.js` - Main API endpoint tests
- `integration.test.js` - Integration and workflow tests
- `setup.js` - Test configuration and utilities

## Writing Tests

### Basic Test Structure

```javascript
describe('Endpoint Name', () => {
  test('should do something', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

### Testing with Authentication

If API key authentication is enabled:

```javascript
const response = await request(app)
  .get('/api/endpoint')
  .set('X-API-Key', 'your-api-key')
  .expect(200);
```

### Testing File Uploads

```javascript
const response = await request(app)
  .post('/api/upload')
  .attach('file', path.join(__dirname, 'fixtures', 'test-file.pdf'))
  .expect(200);
```

## Test Fixtures

Create test fixtures in `tests/fixtures/`:
- `test-image.png` - For image upload tests
- `test-document.pdf` - For document tests
- `test-document.docx` - For Word document tests

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Mocking API Calls

For tests that don't require actual API calls, you can mock the Worksona library:

```javascript
jest.mock('../worksona.js', () => ({
  chat: jest.fn().mockResolvedValue('Mocked response'),
  generateImage: jest.fn().mockResolvedValue('data:image/png;base64,...')
}));
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up test data after tests
3. **Fixtures**: Use test fixtures for file uploads
4. **Mocking**: Mock external API calls when possible
5. **Error Cases**: Test both success and error scenarios
6. **Edge Cases**: Test boundary conditions

## Troubleshooting

### Tests Failing Due to Rate Limits

Increase delays between tests or use mocking:

```javascript
afterEach(async () => {
  await sleep(1000); // Wait 1 second between tests
});
```

### Port Already in Use

Change the test port in `setup.js`:

```javascript
process.env.PORT = '3002';
```

### API Keys Not Set

Ensure test environment variables are set or use mock keys.

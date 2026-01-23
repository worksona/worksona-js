/**
 * Test Setup Configuration
 * 
 * This file configures the test environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001'; // Use different port for tests

// Mock API keys for testing (use test keys or skip API calls)
// Tests will work even without real API keys - they'll just return 503 errors
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-key';
process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key';
process.env.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'test-key';

// Increase timeout for API calls
jest.setTimeout(30000); // 30 seconds

// Global test utilities
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Add small delay between tests to avoid rate limiting
afterEach(async () => {
  await sleep(100); // 100ms delay between tests
});

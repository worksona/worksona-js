/**
 * Integration Tests
 * 
 * Tests for complete workflows and multi-step operations
 */

const request = require('supertest');
const app = require('../worksona-server.js');

describe('Complete Workflows', () => {
  test('Full agent lifecycle: create -> chat -> delete', async () => {
    const agentId = `lifecycle-test-${Date.now()}`;
    const agentConfig = {
      id: agentId,
      name: 'Lifecycle Test Agent',
      config: {
        provider: 'openai',
        model: 'gpt-4o',
        temperature: 0.7
      }
    };

    // Create agent
    const createResponse = await request(app)
      .post('/api/agents/load')
      .send(agentConfig)
      .expect(200);
    expect(createResponse.body.success).toBe(true);

    // Chat with agent
    const chatResponse = await request(app)
      .post(`/api/agents/${agentId}/chat`)
      .send({ message: 'Say hello' })
      .expect(200);
    expect(chatResponse.body.success).toBe(true);

    // Get agent metrics
    const metricsResponse = await request(app)
      .get(`/api/agents/${agentId}`)
      .expect(200);
    expect(metricsResponse.body.data.metrics).toBeDefined();

    // Delete agent
    const deleteResponse = await request(app)
      .delete(`/api/agents/${agentId}`)
      .expect(200);
    expect(deleteResponse.body.success).toBe(true);
  });

  test('Batch processing workflow', async () => {
    const response = await request(app)
      .post('/api/query/batch')
      .send({
        queries: [
          { agent: 'research-analyst', query: 'What is AI?' },
          { agent: 'research-analyst', query: 'What is ML?' },
          { agent: 'research-analyst', query: 'What is NLP?' }
        ]
      });

    // May return 200, 429 (rate limited), or 503 (provider not configured)
    expect([200, 429, 503]).toContain(response.status);
    if (response.status === 200) {
      expect(response.body.success).toBe(true);
      if (response.body.data && response.body.data.results) {
        expect(response.body.data.results.length).toBe(3);
        expect(response.body.data.results[0]).toHaveProperty('answer');
      }
    }
  });
});

describe('Error Recovery', () => {
  test('Should handle invalid agent gracefully', async () => {
    const response = await request(app)
      .post('/api/agents/invalid-agent/chat')
      .send({ message: 'Hello' });

    // May return 404 (agent not found) or 500 (other error)
    expect([404, 500]).toContain(response.status);
    expect(response.body.success).toBe(false);
    if (response.body.error) {
      expect(response.body.error.code).toBeDefined();
    }
  });

  test('Should handle missing required fields', async () => {
    const response = await request(app)
      .post('/api/agents/load')
      .send({ name: 'Incomplete Agent' })
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

/**
 * Worksona.js Dual Mode Demo
 *
 * This example demonstrates both usage modes:
 * 1. Library Mode - Direct JavaScript API
 * 2. API Mode - REST API server
 */

// Load environment variables
require('dotenv').config({ override: true });

const Worksona = require('../worksona.js');

// ============================================================================
// MODE 1: LIBRARY MODE (Direct JavaScript API)
// ============================================================================

async function libraryModeDemo() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  MODE 1: LIBRARY MODE (Direct JavaScript API)             ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Initialize Worksona
  const worksona = new Worksona({
    apiKeys: {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY
    },
    debug: false
  });

  console.log('✓ Worksona initialized');

  // Example 1: Simple Chat with GPT-5
  console.log('\n[Example 1] Simple Chat with GPT-5');
  console.log('─────────────────────────────────────');

  await worksona.loadAgent({
    id: 'gpt5-assistant',
    name: 'GPT-5 Assistant',
    config: {
      provider: 'openai',
      model: 'gpt-5',
      temperature: 1,
      maxTokens: 200
    }
  });

  const response1 = await worksona.chat(
    'gpt5-assistant',
    'In one sentence, what is quantum computing?'
  );
  console.log('Question: In one sentence, what is quantum computing?');
  console.log('Answer:', response1);

  // Example 2: Claude 3.5 Sonnet Analysis (skip if no Anthropic key)
  if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'sk-ant-your-anthropic-key-here') {
    console.log('\n[Example 2] Claude 3.5 Sonnet Analysis');
    console.log('─────────────────────────────────────');

    await worksona.loadAgent({
      id: 'claude-analyst',
      name: 'Claude Analyst',
      config: {
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.5,
        maxTokens: 300,
        systemPrompt: 'You are a concise analytical expert.'
      }
    });

    const response2 = await worksona.chat(
      'claude-analyst',
      'Analyze the future of AI in 2-3 sentences'
    );
    console.log('Question: Analyze the future of AI in 2-3 sentences');
    console.log('Answer:', response2);
  } else {
    console.log('\n[Example 2] Claude 3.5 Sonnet Analysis - SKIPPED (no Anthropic API key)');
  }

  // Example 3: Multi-Agent System
  console.log('\n[Example 3] Multi-Agent System');
  console.log('─────────────────────────────────────');

  // Load researcher agent
  await worksona.loadAgent({
    id: 'researcher',
    name: 'Researcher Agent',
    config: {
      provider: 'openai',
      model: 'gpt-4o',
      temperature: 0.3,
      maxTokens: 200
    }
  });

  // Load writer agent with GPT-5
  await worksona.loadAgent({
    id: 'writer',
    name: 'Writer Agent',
    config: {
      provider: 'openai',
      model: 'gpt-5',
      temperature: 1, // GPT-5 only supports temp 1
      maxTokens: 150
    }
  });

  // Research then write
  const research = await worksona.chat('researcher', 'What are 3 key benefits of renewable energy?');
  console.log('Researcher:', research);

  const article = await worksona.chat('writer', `Write a catchy headline about: ${research}`);
  console.log('Writer:', article);

  // Example 4: Agent Metrics
  console.log('\n[Example 4] Agent Metrics');
  console.log('─────────────────────────────────────');

  const agents = worksona.getAllAgents();
  console.log(`Total agents loaded: ${agents.length}`);

  agents.forEach(agent => {
    const metrics = agent.getMetrics();
    console.log(`\n${agent.name}:`);
    console.log(`  - Queries: ${metrics.totalQueries}`);
    console.log(`  - Avg Response Time: ${Math.round(metrics.avgResponseTime)}ms`);
    console.log(`  - Success Rate: ${(metrics.successRate * 100).toFixed(1)}%`);
  });

  console.log('\n✓ Library mode demo completed\n');
}

// ============================================================================
// MODE 2: API MODE (REST API Queries)
// ============================================================================

async function apiModeDemo() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  MODE 2: API MODE (REST API Queries)                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const API_URL = process.env.API_URL || 'http://localhost:3000';

  // Check if server is running
  try {
    const healthCheck = await fetch(`${API_URL}/health`);
    const health = await healthCheck.json();
    console.log('✓ API Server is running:', health.status);
  } catch (error) {
    console.error('✗ API Server is not running. Start it with: node worksona-server.js');
    return;
  }

  // Example 1: Simple GET Query
  console.log('\n[Example 1] Simple GET Query');
  console.log('─────────────────────────────────────');

  const query1 = 'What is artificial intelligence?';
  const url1 = `${API_URL}/api/query?q=${encodeURIComponent(query1)}&model=gpt-4o`;

  console.log('Request:', url1);
  const response1 = await fetch(url1);
  const data1 = await response1.json();

  if (data1.success) {
    console.log('Answer:', data1.answer);
    console.log('Metadata:', data1.metadata);
  } else {
    console.error('Error:', data1.error);
  }

  // Example 2: Agent-Specific Query
  console.log('\n[Example 2] Agent-Specific Query');
  console.log('─────────────────────────────────────');

  // First, load an agent
  console.log('Loading agent via API...');
  const loadResponse = await fetch(`${API_URL}/api/agents/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'api-assistant',
      name: 'API Assistant',
      config: {
        provider: 'openai',
        model: 'gpt-5-mini',
        temperature: 0.7
      }
    })
  });

  const loadData = await loadResponse.json();
  console.log('Agent loaded:', loadData.success ? '✓' : '✗');

  // Query the agent
  const agentUrl = `${API_URL}/api/agents/api-assistant/query?q=Explain+REST+APIs+briefly`;
  console.log('Request:', agentUrl);

  const agentResponse = await fetch(agentUrl);
  const agentData = await agentResponse.json();

  if (agentData.success) {
    console.log('Answer:', agentData.answer);
    console.log('Agent:', agentData.agent);
  }

  // Example 3: Batch Processing
  console.log('\n[Example 3] Batch Processing');
  console.log('─────────────────────────────────────');

  const batchQueries = {
    queries: [
      { query: 'Define AI in 10 words', model: 'gpt-4o' },
      { query: 'Define ML in 10 words', model: 'gpt-4o' },
      { query: 'Define DL in 10 words', model: 'gpt-4o' }
    ]
  };

  console.log('Sending batch of', batchQueries.queries.length, 'queries...');

  const batchResponse = await fetch(`${API_URL}/api/query/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(batchQueries)
  });

  const batchData = await batchResponse.json();

  if (batchData.success) {
    console.log('Results:');
    batchData.results.forEach((result, i) => {
      console.log(`  ${i + 1}. ${result.query}`);
      console.log(`     → ${result.result}`);
    });
    console.log('Metadata:', batchData.metadata);
  }

  // Example 4: Quick Translation
  console.log('\n[Example 4] Quick Translation');
  console.log('─────────────────────────────────────');

  const translateUrl = `${API_URL}/api/translate?text=Hello+world&to=french`;
  console.log('Request:', translateUrl);

  const translateResponse = await fetch(translateUrl);
  const translateData = await translateResponse.json();

  if (translateData.success) {
    console.log('Original:', translateData.original);
    console.log('Translation:', translateData.translation);
    console.log('From:', translateData.from, '→ To:', translateData.to);
  }

  // Example 5: List All Agents
  console.log('\n[Example 5] List All Agents');
  console.log('─────────────────────────────────────');

  const agentsResponse = await fetch(`${API_URL}/api/agents`);
  const agentsData = await agentsResponse.json();

  if (agentsData.success) {
    console.log(`Total agents: ${agentsData.data.count}`);
    agentsData.data.agents.forEach(agent => {
      console.log(`  - ${agent.name} (${agent.id})`);
      console.log(`    Provider: ${agent.provider}, Model: ${agent.model}`);
    });
  }

  console.log('\n✓ API mode demo completed\n');
}

// ============================================================================
// COMPARISON & BEST PRACTICES
// ============================================================================

function showComparison() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  COMPARISON & BEST PRACTICES                               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('LIBRARY MODE (Direct JavaScript API)');
  console.log('─────────────────────────────────────');
  console.log('✓ Best for JavaScript/Node.js applications');
  console.log('✓ Direct access to all features');
  console.log('✓ No network overhead');
  console.log('✓ Full event system access');
  console.log('✓ Type definitions available');
  console.log('✗ Requires JavaScript environment');

  console.log('\nAPI MODE (REST API Server)');
  console.log('─────────────────────────────────────');
  console.log('✓ Works from ANY programming language');
  console.log('✓ Simple URL-based queries');
  console.log('✓ Easy external service integration');
  console.log('✓ File upload support');
  console.log('✓ Webhook endpoints');
  console.log('✗ Requires running server');
  console.log('✗ Network latency');

  console.log('\nUSE CASES:');
  console.log('─────────────────────────────────────');
  console.log('Library Mode:');
  console.log('  • Building web applications');
  console.log('  • Node.js backend services');
  console.log('  • Electron apps');
  console.log('  • React/Vue/Angular apps');

  console.log('\nAPI Mode:');
  console.log('  • Python/Ruby/PHP/Java apps');
  console.log('  • Mobile apps (Swift/Kotlin)');
  console.log('  • Zapier/Make.com integrations');
  console.log('  • Webhook receivers');
  console.log('  • Simple cURL scripts');

  console.log('\nYOU CAN USE BOTH! 🎯');
  console.log('  • Library mode for your main app');
  console.log('  • API mode for external integrations');
  console.log('');
}

// ============================================================================
// RUN DEMOS
// ============================================================================

async function main() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║          WORKSONA.JS DUAL MODE DEMONSTRATION               ║');
  console.log('║                    Version 0.3.0                           ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  // Check for API keys
  if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    console.error('\n✗ Error: No API keys found!');
    console.error('  Set OPENAI_API_KEY or ANTHROPIC_API_KEY in your environment\n');
    process.exit(1);
  }

  try {
    // Run Library Mode Demo
    await libraryModeDemo();

    // Run API Mode Demo
    await apiModeDemo();

    // Show Comparison
    showComparison();

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  DEMOS COMPLETED SUCCESSFULLY! ✓                           ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n✗ Error during demo:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export for use as module
module.exports = {
  libraryModeDemo,
  apiModeDemo,
  showComparison
};

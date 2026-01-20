/**
 * Worksona API Server
 * Version: 0.3.0-alpha
 *
 * REST API wrapper for Worksona.js with:
 * - File upload support
 * - Query string operations (GET/POST with URL params)
 * - Agent-specific endpoints
 * - Slash-command style operations
 * - Webhook integrations
 * - Batch processing
 */

// Load environment variables
require('dotenv').config({ override: true });

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Worksona = require('./worksona.js');
const fs = require('fs').promises;
const path = require('path');

// Document parsing libraries
const mammoth = require('mammoth');
const XLSX = require('xlsx');
const pdfParse = require('pdf-parse');
const { marked } = require('marked');

// Tool libraries
const axios = require('axios');
const cheerio = require('cheerio');

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// File upload configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      // Documents
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/msword', // .doc
      // Text formats
      'text/plain',
      'text/markdown',
      'text/csv',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/ogg'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // Also check file extension for edge cases
      const ext = file.originalname.split('.').pop().toLowerCase();
      if (['txt', 'md', 'csv', 'docx', 'xlsx', 'xls', 'pdf'].includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type: ${file.mimetype}`));
      }
    }
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}));

// Serve API Console at /console
app.use('/console', express.static(path.join(__dirname, 'public')));

// Keep legacy /public route for backward compatibility
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve documentation site from www as root website
app.use('/', express.static(path.join(__dirname, 'www')));

// Also serve at /docs for backward compatibility
app.use('/docs', express.static(path.join(__dirname, 'www')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later' }
});
app.use('/api', limiter);

// Initialize Worksona
const worksona = new Worksona({
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    google: process.env.GOOGLE_API_KEY
  },
  debug: process.env.DEBUG === 'true'
});

// Auto-load agents from agents/ directory
async function loadAgentsFromDirectory() {
  const agentsDir = path.join(__dirname, 'agents');
  try {
    const files = await fs.readdir(agentsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    console.log(`\nLoading ${jsonFiles.length} agents from agents/ directory...`);

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(agentsDir, file);
        const agentConfig = JSON.parse(await fs.readFile(filePath, 'utf8'));
        await worksona.loadAgent(agentConfig);
        console.log(`  ✓ Loaded: ${agentConfig.name} (${agentConfig.id})`);
      } catch (err) {
        console.error(`  ✗ Failed to load ${file}:`, err.message);
      }
    }
    console.log('Agent loading complete.\n');
  } catch (err) {
    console.error('Could not read agents directory:', err.message);
  }
}

// Load agents on startup
loadAgentsFromDirectory();

// Utility: Validate provider API keys
function validateProviderKeys(provider) {
  const keys = {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    google: process.env.GOOGLE_API_KEY
  };

  if (!keys[provider]) {
    const providerNames = {
      openai: 'OpenAI',
      anthropic: 'Anthropic',
      google: 'Google'
    };
    throw new Error(
      `${providerNames[provider]} API key not configured. ` +
      `Please add ${provider.toUpperCase()}_API_KEY to your .env file and restart the server.`
    );
  }
}

// Middleware: Check if required provider API key exists
function requireProviderKey(provider) {
  return (req, res, next) => {
    try {
      validateProviderKeys(provider);
      next();
    } catch (error) {
      res.status(503).json({
        success: false,
        error: {
          code: 'PROVIDER_NOT_CONFIGURED',
          message: error.message,
          provider
        }
      });
    }
  };
}

// API Key Authentication Middleware
function authenticateAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'MISSING_API_KEY',
        message: 'API key required. Provide via X-API-Key header'
      }
    });
  }

  // In production, validate against database
  // For now, check against environment variable
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid API key'
      }
    });
  }

  next();
}

// Apply auth to all /api routes (optional - comment out for testing)
// app.use('/api', authenticateAPIKey);

// Utility: Convert file to base64 data URL
async function fileToDataURL(filePath, mimeType) {
  const buffer = await fs.readFile(filePath);
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

// Utility: Cleanup uploaded file
async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error cleaning up file:', error);
  }
}

// Utility: Extract text from various document formats
async function extractTextFromDocument(filePath, mimeType) {
  try {
    // Plain text files
    if (mimeType === 'text/plain') {
      return await fs.readFile(filePath, 'utf8');
    }

    // Markdown files
    if (mimeType === 'text/markdown' || filePath.endsWith('.md')) {
      const markdown = await fs.readFile(filePath, 'utf8');
      // Convert markdown to plain text (strip formatting)
      return marked.parse(markdown, { gfm: true })
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
        .trim();
    }

    // Word documents (.docx)
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        filePath.endsWith('.docx')) {
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    // Excel files (.xlsx, .xls)
    if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        mimeType === 'application/vnd.ms-excel' ||
        filePath.endsWith('.xlsx') || filePath.endsWith('.xls')) {
      const workbook = XLSX.readFile(filePath);
      let text = '';

      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        text += `\n=== Sheet: ${sheetName} ===\n`;
        text += XLSX.utils.sheet_to_txt(worksheet);
      });

      return text.trim();
    }

    // PDF files
    if (mimeType === 'application/pdf' || filePath.endsWith('.pdf')) {
      const buffer = await fs.readFile(filePath);
      const data = await pdfParse(buffer);
      return data.text;
    }

    // CSV files
    if (mimeType === 'text/csv' || filePath.endsWith('.csv')) {
      const csvContent = await fs.readFile(filePath, 'utf8');
      return csvContent;
    }

    // Unsupported format
    throw new Error(`Unsupported document format: ${mimeType}`);

  } catch (error) {
    throw new Error(`Failed to extract text from document: ${error.message}`);
  }
}

// ============================================================================
// HEALTH & INFO ENDPOINTS
// ============================================================================

// Root landing page
app.get('/', async (req, res) => {
  try {
    const indexPath = path.resolve(__dirname, 'index.html');
    const content = await fs.readFile(indexPath, 'utf8');
    res.type('html').send(content);
  } catch (err) {
    console.error('Error serving index.html:', err.message);
    res.status(500).send('Error loading landing page');
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '0.3.0-alpha',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'Worksona API Server',
    version: '0.3.0-alpha',
    endpoints: {
      agents: [
        'POST /api/agents/load',
        'GET /api/agents',
        'GET /api/agents/:agentId',
        'DELETE /api/agents/:agentId',
        'POST /api/agents/:agentId/chat'
      ],
      images: [
        'POST /api/images/analyze',
        'POST /api/images/generate',
        'POST /api/images/edit'
      ],
      documents: [
        'POST /api/documents/ocr',
        'POST /api/documents/parse',
        'POST /api/documents/analyze'
      ],
      slash: [
        'POST /api/slash/ocr',
        'POST /api/slash/summarize',
        'POST /api/slash/translate',
        'POST /api/slash/extract-data'
      ]
    },
    providers: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      google: !!process.env.GOOGLE_API_KEY
    }
  });
});

// ============================================================================
// AGENT MANAGEMENT ENDPOINTS
// ============================================================================

// Load an agent
app.post('/api/agents/load', async (req, res) => {
  try {
    const agentConfig = req.body;

    if (!agentConfig.id || !agentConfig.config) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CONFIG', message: 'Agent id and config required' }
      });
    }

    await worksona.loadAgent(agentConfig);

    res.json({
      success: true,
      data: {
        agentId: agentConfig.id,
        message: 'Agent loaded successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'AGENT_LOAD_ERROR', message: error.message }
    });
  }
});

// List all agents
app.get('/api/agents', (req, res) => {
  try {
    const agents = worksona.getAllAgents();
    res.json({
      success: true,
      data: {
        count: agents.length,
        agents: agents.map(agent => ({
          id: agent.id,
          name: agent.name,
          description: agent.description,
          provider: agent.config.provider,
          model: agent.config.model
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'AGENT_LIST_ERROR', message: error.message }
    });
  }
});

// Get single agent
app.get('/api/agents/:agentId', (req, res) => {
  try {
    const agent = worksona.getAgent(req.params.agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: { code: 'AGENT_NOT_FOUND', message: 'Agent not found' }
      });
    }

    res.json({
      success: true,
      data: {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        provider: agent.config.provider,
        model: agent.config.model,
        metrics: agent.getMetrics()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'AGENT_GET_ERROR', message: error.message }
    });
  }
});

// Delete agent
app.delete('/api/agents/:agentId', (req, res) => {
  try {
    worksona.removeAgent(req.params.agentId);
    res.json({
      success: true,
      data: { message: 'Agent removed successfully' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'AGENT_DELETE_ERROR', message: error.message }
    });
  }
});

// Chat with agent
app.post('/api/agents/:agentId/chat', async (req, res) => {
  const startTime = Date.now();

  try {
    const { agentId } = req.params;
    const { message, options = {} } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_MESSAGE', message: 'Message required' }
      });
    }

    const result = await worksona.chat(agentId, message, options);

    res.json({
      success: true,
      data: {
        result,
        metadata: {
          agentId,
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CHAT_ERROR', message: error.message }
    });
  }
});

// ============================================================================
// QUERY-BASED ENDPOINTS
// ============================================================================

// Generic query endpoint (GET)
app.get('/api/query', async (req, res) => {
  const startTime = Date.now();

  try {
    const { agent, q, query, model, temperature, max_tokens } = req.query;
    const questionText = q || query;

    if (!questionText) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_QUERY', message: 'Query parameter (q or query) required' }
      });
    }

    // Auto-create agent if needed
    let agentId = agent || 'default-query-agent';
    if (!worksona.getAgent(agentId)) {
      await worksona.loadAgent({
        id: agentId,
        name: 'Query Agent',
        config: {
          provider: 'openai',
          model: model || 'gpt-4o',
          temperature: parseFloat(temperature) || 0.7
        }
      });
    }

    const answer = await worksona.chat(agentId, questionText, {
      temperature: parseFloat(temperature),
      maxTokens: parseInt(max_tokens)
    });

    res.json({
      success: true,
      query: questionText,
      answer,
      metadata: {
        agent: agentId,
        model: worksona.getAgent(agentId).config.model,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // Provide more helpful error messages
    const statusCode = error.message.includes('API key') || error.message.includes('not configured') ? 503 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 503 ? 'PROVIDER_NOT_CONFIGURED' : 'QUERY_ERROR',
        message: error.message,
        hint: statusCode === 503 ? 'Add the required API key to your .env file and restart the server' : undefined
      }
    });
  }
});

// Generic query endpoint (POST)
app.post('/api/query', async (req, res) => {
  const startTime = Date.now();

  try {
    const { agent, query, context, options = {} } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_QUERY', message: 'Query required in body' }
      });
    }

    // Build full message with context
    let fullMessage = query;
    if (context) {
      fullMessage = `Context: ${JSON.stringify(context)}\n\nQuery: ${query}`;
    }

    // Auto-create agent if needed
    let agentId = agent || 'default-query-agent';
    if (!worksona.getAgent(agentId)) {
      await worksona.loadAgent({
        id: agentId,
        name: 'Query Agent',
        config: {
          provider: 'openai',
          model: options.model || 'gpt-4o',
          temperature: options.temperature || 0.7
        }
      });
    }

    const answer = await worksona.chat(agentId, fullMessage, options);

    res.json({
      success: true,
      query,
      answer,
      metadata: {
        agent: agentId,
        model: worksona.getAgent(agentId).config.model,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // Provide more helpful error messages
    const statusCode = error.message.includes('API key') || error.message.includes('not configured') ? 503 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 503 ? 'PROVIDER_NOT_CONFIGURED' : 'QUERY_ERROR',
        message: error.message,
        hint: statusCode === 503 ? 'Add the required API key to your .env file and restart the server' : undefined
      }
    });
  }
});

// Agent-specific query endpoint (GET)
app.get('/api/agents/:agentId/query', async (req, res) => {
  const startTime = Date.now();

  try {
    const { agentId } = req.params;
    const { q, query, ...options } = req.query;
    const questionText = q || query;

    if (!questionText) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_QUERY', message: 'Query parameter (q or query) required' }
      });
    }

    const agent = worksona.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'AGENT_NOT_FOUND',
          message: `Agent ${agentId} not found. Load it first with POST /api/agents/load`
        }
      });
    }

    // Parse options
    const parsedOptions = {};
    if (options.temperature) parsedOptions.temperature = parseFloat(options.temperature);
    if (options.maxTokens) parsedOptions.maxTokens = parseInt(options.maxTokens);
    if (options.max_tokens) parsedOptions.maxTokens = parseInt(options.max_tokens);

    const answer = await worksona.chat(agentId, questionText, parsedOptions);

    res.json({
      success: true,
      query: questionText,
      answer,
      agent: {
        id: agentId,
        name: agent.name,
        model: agent.config.model
      },
      metadata: {
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // Provide more helpful error messages
    const statusCode = error.message.includes('API key') || error.message.includes('not configured') ? 503 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 503 ? 'PROVIDER_NOT_CONFIGURED' : 'QUERY_ERROR',
        message: error.message,
        hint: statusCode === 503 ? 'Add the required API key to your .env file and restart the server' : undefined
      }
    });
  }
});

// Agent-specific query endpoint (POST)
app.post('/api/agents/:agentId/query', async (req, res) => {
  const startTime = Date.now();

  try {
    const { agentId } = req.params;
    const { query, document, text, options = {} } = req.body;

    if (!query && !text) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_QUERY', message: 'Query or text required' }
      });
    }

    const agent = worksona.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'AGENT_NOT_FOUND',
          message: `Agent ${agentId} not found`
        }
      });
    }

    // Build message
    let message = query || text;
    if (document) {
      message = `Document: ${document}\n\nQuery: ${message}`;
    }

    const answer = await worksona.chat(agentId, message, options);

    res.json({
      success: true,
      query: query || text,
      answer,
      agent: {
        id: agentId,
        name: agent.name
      },
      metadata: {
        duration: Date.now() - startTime
      }
    });
  } catch (error) {
    // Provide more helpful error messages
    const statusCode = error.message.includes('API key') || error.message.includes('not configured') ? 503 : 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 503 ? 'PROVIDER_NOT_CONFIGURED' : 'QUERY_ERROR',
        message: error.message,
        hint: statusCode === 503 ? 'Add the required API key to your .env file and restart the server' : undefined
      }
    });
  }
});

// ============================================================================
// FLEXIBLE AGENT ACTION ROUTING
// Pattern: /api/agents/:agentId/:action/:object?
// Examples:
//   /api/agents/agatha-agent/upload?prompt=analyze
//   /api/agents/agatha-agent/chat?q=hello
//   /api/agents/agatha-agent/analyze/image?prompt=describe
//   /api/agents/agatha-agent/process/document?task=summarize
// ============================================================================

// Agent upload endpoint (POST with file)
app.post('/api/agents/:agentId/upload', upload.single('file'), async (req, res) => {
  const startTime = Date.now();

  try {
    const { agentId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FILE', message: 'File required' }
      });
    }

    // Check if agent exists
    const agent = worksona.getAgent(agentId);
    if (!agent) {
      await cleanupFile(req.file.path);
      return res.status(404).json({
        success: false,
        error: {
          code: 'AGENT_NOT_FOUND',
          message: `Agent ${agentId} not found. Available agents: ${worksona.getAgents().map(a => a.id).join(', ')}`
        }
      });
    }

    const prompt = req.query.prompt || req.body.prompt || 'Analyze this file';
    const context = req.query.context || req.body.context || '';
    const task = req.query.task || req.body.task || 'analyze';

    // Determine file type
    const isTextDocument = [
      'text/plain',
      'text/markdown',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/msword'
    ].includes(req.file.mimetype) ||
    req.file.originalname.match(/\.(txt|md|csv|docx|xlsx|xls|doc)$/i);

    const isPDF = req.file.mimetype === 'application/pdf';
    const isImage = req.file.mimetype.startsWith('image/');

    // Process text documents
    if (isTextDocument) {
      const extractedText = await extractTextFromDocument(req.file.path, req.file.mimetype);

      let fullPrompt = prompt;
      if (context) fullPrompt += `\n\nContext: ${context}`;
      fullPrompt += `\n\nDocument content:\n${extractedText}`;

      const result = await worksona.chat(agentId, fullPrompt);

      await cleanupFile(req.file.path);

      return res.json({
        success: true,
        data: {
          analysis: result,
          agent: agentId,
          extractedText: extractedText.substring(0, 500) + '...',
          metadata: {
            duration: Date.now() - startTime,
            fileType: req.file.mimetype,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            characterCount: extractedText.length,
            processingMethod: 'text-extraction'
          }
        }
      });
    }

    // Process images and PDFs with vision
    if (isImage || isPDF) {
      // Try text extraction for PDFs first
      if (isPDF) {
        try {
          const extractedText = await extractTextFromDocument(req.file.path, req.file.mimetype);
          if (extractedText.length > 50) {
            let fullPrompt = prompt;
            if (context) fullPrompt += `\n\nContext: ${context}`;
            fullPrompt += `\n\nDocument content:\n${extractedText}`;

            const result = await worksona.chat(agentId, fullPrompt);

            await cleanupFile(req.file.path);

            return res.json({
              success: true,
              data: {
                analysis: result,
                agent: agentId,
                extractedText: extractedText.substring(0, 500) + '...',
                metadata: {
                  duration: Date.now() - startTime,
                  fileType: req.file.mimetype,
                  fileName: req.file.originalname,
                  fileSize: req.file.size,
                  characterCount: extractedText.length,
                  processingMethod: 'pdf-text-extraction'
                }
              }
            });
          }
        } catch (error) {
          console.log('PDF text extraction failed, falling back to vision:', error.message);
        }
      }

      // Use vision for images and image-based PDFs
      const imageUrl = await fileToDataURL(req.file.path, req.file.mimetype);

      let fullPrompt = prompt;
      if (context) fullPrompt += `\n\nContext: ${context}`;

      const result = await worksona.processImage(agentId, imageUrl, { prompt: fullPrompt });

      await cleanupFile(req.file.path);

      return res.json({
        success: true,
        data: {
          analysis: result,
          agent: agentId,
          metadata: {
            duration: Date.now() - startTime,
            fileType: req.file.mimetype,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            processingMethod: 'vision'
          }
        }
      });
    }

    await cleanupFile(req.file.path);
    res.status(400).json({
      success: false,
      error: { code: 'UNSUPPORTED_FORMAT', message: 'File format not supported' }
    });

  } catch (error) {
    if (req.file) await cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      error: { code: 'UPLOAD_ERROR', message: error.message }
    });
  }
});

// Agent chat endpoint (GET with query params)
app.get('/api/agents/:agentId/chat', async (req, res) => {
  const startTime = Date.now();

  try {
    const { agentId } = req.params;
    const { q, query, message, context } = req.query;
    const userMessage = q || query || message;

    if (!userMessage) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_MESSAGE', message: 'Query parameter (q, query, or message) required' }
      });
    }

    const agent = worksona.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'AGENT_NOT_FOUND',
          message: `Agent ${agentId} not found. Available: ${worksona.getAgents().map(a => a.id).join(', ')}`
        }
      });
    }

    let fullMessage = userMessage;
    if (context) {
      fullMessage = `Context: ${context}\n\n${userMessage}`;
    }

    const answer = await worksona.chat(agentId, fullMessage);

    res.json({
      success: true,
      query: userMessage,
      answer,
      agent: {
        id: agentId,
        name: agent.name,
        model: agent.config.model
      },
      metadata: {
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'CHAT_ERROR', message: error.message }
    });
  }
});

// Agent analyze endpoint handler (shared logic)
async function handleAnalyze(req, res) {
  const startTime = Date.now();

  try {
    const { agentId, object } = req.params;
    const prompt = req.query.prompt || req.body.prompt || 'Analyze this content';

    const agent = worksona.getAgent(agentId);
    if (!agent) {
      if (req.file) await cleanupFile(req.file.path);
      return res.status(404).json({
        success: false,
        error: { code: 'AGENT_NOT_FOUND', message: `Agent ${agentId} not found` }
      });
    }

    // If file provided, process it
    if (req.file) {
      // Process file directly
      const isTextDocument = [
        'text/plain',
        'text/markdown',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/msword'
      ].includes(req.file.mimetype) ||
      req.file.originalname.match(/\.(txt|md|csv|docx|xlsx|xls|doc)$/i);

      if (isTextDocument) {
        const extractedText = await extractTextFromDocument(req.file.path, req.file.mimetype);
        const result = await worksona.chat(agentId, `${prompt}\n\nDocument content:\n${extractedText}`);
        await cleanupFile(req.file.path);

        return res.json({
          success: true,
          data: {
            analysis: result,
            agent: agentId,
            extractedText: extractedText.substring(0, 500) + '...',
            metadata: {
              duration: Date.now() - startTime,
              object: object || 'document',
              fileType: req.file.mimetype,
              fileName: req.file.originalname,
              characterCount: extractedText.length
            }
          }
        });
      }

      // For images/PDFs
      const imageUrl = await fileToDataURL(req.file.path, req.file.mimetype);
      const result = await worksona.processImage(agentId, imageUrl, { prompt });
      await cleanupFile(req.file.path);

      return res.json({
        success: true,
        data: {
          analysis: result,
          agent: agentId,
          metadata: {
            duration: Date.now() - startTime,
            object: object || 'image',
            fileType: req.file.mimetype,
            fileName: req.file.originalname,
            processingMethod: 'vision'
          }
        }
      });
    }

    // If text provided in body
    if (req.body.text) {
      const result = await worksona.chat(agentId, `${prompt}\n\nContent:\n${req.body.text}`);

      return res.json({
        success: true,
        data: {
          analysis: result,
          agent: agentId,
          metadata: {
            duration: Date.now() - startTime,
            object: object || 'text',
            characterCount: req.body.text.length
          }
        }
      });
    }

    // If URL provided
    if (req.body.url || req.query.url) {
      const url = req.body.url || req.query.url;

      return res.status(501).json({
        success: false,
        error: { code: 'NOT_IMPLEMENTED', message: 'URL analysis not yet implemented' }
      });
    }

    res.status(400).json({
      success: false,
      error: { code: 'MISSING_CONTENT', message: 'Provide file, text, or url to analyze' }
    });

  } catch (error) {
    if (req.file) await cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      error: { code: 'ANALYZE_ERROR', message: error.message }
    });
  }
}

// Agent analyze endpoint (with object type)
app.post('/api/agents/:agentId/analyze/:object', upload.single('file'), handleAnalyze);

// Agent analyze endpoint (without object type)
app.post('/api/agents/:agentId/analyze', upload.single('file'), handleAnalyze);

// Agent process endpoint (for specific tasks)
app.post('/api/agents/:agentId/process/:object', upload.single('file'), async (req, res) => {
  const startTime = Date.now();

  try {
    const { agentId, object } = req.params;
    const task = req.query.task || req.body.task || 'process';

    const agent = worksona.getAgent(agentId);
    if (!agent) {
      if (req.file) await cleanupFile(req.file.path);
      return res.status(404).json({
        success: false,
        error: { code: 'AGENT_NOT_FOUND', message: `Agent ${agentId} not found` }
      });
    }

    const taskPrompts = {
      summarize: 'Provide a concise summary of this content',
      extract: 'Extract key information and structured data',
      translate: 'Translate this content',
      review: 'Review and critique this content',
      improve: 'Suggest improvements for this content'
    };

    const prompt = taskPrompts[task] || `Process this ${object}`;

    // If file provided
    if (req.file) {
      // Set the prompt and call upload handler
      req.query.prompt = prompt;
      req.body.prompt = prompt;

      // Process file like upload does
      const isTextDocument = [
        'text/plain',
        'text/markdown',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/msword'
      ].includes(req.file.mimetype) ||
      req.file.originalname.match(/\.(txt|md|csv|docx|xlsx|xls|doc)$/i);

      if (isTextDocument) {
        const extractedText = await extractTextFromDocument(req.file.path, req.file.mimetype);
        const result = await worksona.chat(agentId, `${prompt}\n\nDocument content:\n${extractedText}`);
        await cleanupFile(req.file.path);

        return res.json({
          success: true,
          data: {
            result,
            agent: agentId,
            task,
            object,
            extractedText: extractedText.substring(0, 500) + '...',
            metadata: {
              duration: Date.now() - startTime,
              fileType: req.file.mimetype,
              fileName: req.file.originalname,
              characterCount: extractedText.length
            }
          }
        });
      }

      // For images/PDFs, use vision
      const imageUrl = await fileToDataURL(req.file.path, req.file.mimetype);
      const result = await worksona.processImage(agentId, imageUrl, { prompt });
      await cleanupFile(req.file.path);

      return res.json({
        success: true,
        data: {
          result,
          agent: agentId,
          task,
          object,
          metadata: {
            duration: Date.now() - startTime,
            fileType: req.file.mimetype,
            fileName: req.file.originalname,
            processingMethod: 'vision'
          }
        }
      });
    }

    // If text provided
    if (req.body.text) {
      const result = await worksona.chat(agentId, `${prompt}\n\nContent:\n${req.body.text}`);

      return res.json({
        success: true,
        data: {
          result,
          agent: agentId,
          task,
          object,
          metadata: {
            duration: Date.now() - startTime
          }
        }
      });
    }

    res.status(400).json({
      success: false,
      error: { code: 'MISSING_CONTENT', message: 'Provide file or text to process' }
    });

  } catch (error) {
    if (req.file) await cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      error: { code: 'PROCESS_ERROR', message: error.message }
    });
  }
});

// ============================================================================
// TOOL SYSTEM
// Extensible tool registry for adding capabilities
// ============================================================================

// Tool Registry
const toolRegistry = {
  'dalle': {
    name: 'DALL-E Image Generator',
    description: 'Generate, edit, and create variations of images using DALL-E',
    category: 'generation',
    actions: ['generate', 'edit', 'variations'],
    enabled: true
  },
  'scraper': {
    name: 'Web Scraper',
    description: 'Extract content and data from websites',
    category: 'utils',
    actions: ['fetch', 'extract'],
    enabled: true
  },
  'tts': {
    name: 'Text-to-Speech',
    description: 'Convert text to natural speech audio',
    category: 'generation',
    actions: ['speak', 'generate'],
    enabled: true
  },
  'search': {
    name: 'Web Search',
    description: 'Search the web for information',
    category: 'utils',
    actions: ['query'],
    enabled: false // Requires API key
  }
};

// Tool Handler: DALL-E Image Generation
async function dalleToolHandler(action, req, res) {
  const startTime = Date.now();

  try {
    const agentId = req.agent?.id || 'dalle-agent';

    // Ensure an agent exists for image generation
    if (!worksona.getAgent(agentId)) {
      await worksona.loadAgent({
        id: agentId,
        name: 'DALL-E Agent',
        config: {
          provider: 'openai',
          model: 'gpt-4o',
          temperature: 0.7
        }
      });
    }

    switch (action) {
      case 'generate': {
        const { prompt, size = '1024x1024', quality = 'standard', style = 'natural' } = req.query;

        if (!prompt) {
          return res.status(400).json({
            success: false,
            error: { code: 'MISSING_PROMPT', message: 'Prompt parameter required' }
          });
        }

        // If agent context exists, enhance the prompt
        let finalPrompt = prompt;
        if (req.agent && req.query.enhance !== 'false') {
          try {
            const enhancement = await worksona.chat(req.agent.id,
              `Enhance this image generation prompt to be more detailed and professional. Return only the enhanced prompt, nothing else: ${prompt}`
            );
            finalPrompt = enhancement.trim();
          } catch (error) {
            console.log('Prompt enhancement failed, using original:', error.message);
          }
        }

        // Generate image
        const imageUrl = await worksona.generateImage(agentId, finalPrompt, {
          size,
          quality,
          style
        });

        return res.json({
          success: true,
          tool: 'dalle',
          action: 'generate',
          data: {
            imageUrl,
            prompt: finalPrompt,
            originalPrompt: prompt,
            enhanced: finalPrompt !== prompt,
            settings: { size, quality, style }
          },
          metadata: {
            duration: Date.now() - startTime,
            agent: req.agent?.id || null
          }
        });
      }

      case 'edit': {
        const { image, prompt, mask } = req.body;

        if (!image || !prompt) {
          return res.status(400).json({
            success: false,
            error: { code: 'MISSING_PARAMS', message: 'Image and prompt required' }
          });
        }

        const editedUrl = await worksona.editImage(agentId, image, prompt, mask);

        return res.json({
          success: true,
          tool: 'dalle',
          action: 'edit',
          data: {
            imageUrl: editedUrl,
            prompt
          },
          metadata: {
            duration: Date.now() - startTime
          }
        });
      }

      case 'variations': {
        const { image, n = 1 } = req.body;

        if (!image) {
          return res.status(400).json({
            success: false,
            error: { code: 'MISSING_IMAGE', message: 'Image required' }
          });
        }

        const variationUrl = await worksona.createImageVariation(agentId, image, { n });

        return res.json({
          success: true,
          tool: 'dalle',
          action: 'variations',
          data: {
            imageUrl: variationUrl,
            count: n
          },
          metadata: {
            duration: Date.now() - startTime
          }
        });
      }

      default:
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_ACTION', message: `Action "${action}" not supported for dalle tool` }
        });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'TOOL_ERROR', message: error.message, tool: 'dalle' }
    });
  }
}

// Tool Handler: Web Scraper
async function scraperToolHandler(action, req, res) {
  const startTime = Date.now();

  try {
    switch (action) {
      case 'fetch': {
        const { url, selector, format = 'text' } = req.query;

        if (!url) {
          return res.status(400).json({
            success: false,
            error: { code: 'MISSING_URL', message: 'URL parameter required' }
          });
        }

        // Validate URL
        try {
          new URL(url);
        } catch (error) {
          return res.status(400).json({
            success: false,
            error: { code: 'INVALID_URL', message: 'Invalid URL format' }
          });
        }

        // Fetch website content
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'WorksonaBot/1.0 (https://worksona.com)',
          },
          timeout: 30000,
          maxRedirects: 5
        });

        const $ = cheerio.load(response.data);

        let content;
        if (selector) {
          // Extract specific selector
          content = $(selector).text().trim();
        } else {
          // Extract main content
          $('script, style, nav, header, footer, iframe, noscript').remove();
          content = $('body').text().trim().replace(/\s+/g, ' ');
        }

        // If agent context, analyze the content
        let analysis = null;
        if (req.agent) {
          const analysisPrompt = req.query.prompt || 'Summarize the key points from this content';
          analysis = await worksona.chat(req.agent.id,
            `${analysisPrompt}\n\nContent:\n${content.substring(0, 4000)}`
          );
        }

        return res.json({
          success: true,
          tool: 'scraper',
          action: 'fetch',
          data: {
            url,
            content: content.substring(0, 5000),
            fullContentLength: content.length,
            analysis,
            selector: selector || 'body',
            format
          },
          metadata: {
            duration: Date.now() - startTime,
            agent: req.agent?.id || null,
            contentLength: content.length
          }
        });
      }

      case 'extract': {
        const { url, dataType = 'auto' } = req.query;

        if (!url) {
          return res.status(400).json({
            success: false,
            error: { code: 'MISSING_URL', message: 'URL parameter required' }
          });
        }

        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'WorksonaBot/1.0',
          },
          timeout: 30000
        });

        const $ = cheerio.load(response.data);

        // Extract structured data
        const data = {
          title: $('title').text() || $('h1').first().text(),
          headings: $('h1, h2, h3').map((i, el) => $(el).text()).get(),
          links: $('a[href]').map((i, el) => ({
            text: $(el).text().trim(),
            href: $(el).attr('href')
          })).get().slice(0, 50),
          images: $('img[src]').map((i, el) => ({
            alt: $(el).attr('alt'),
            src: $(el).attr('src')
          })).get().slice(0, 20),
          meta: {
            description: $('meta[name="description"]').attr('content'),
            keywords: $('meta[name="keywords"]').attr('content'),
            author: $('meta[name="author"]').attr('content')
          }
        };

        return res.json({
          success: true,
          tool: 'scraper',
          action: 'extract',
          data: {
            url,
            extracted: data,
            dataType
          },
          metadata: {
            duration: Date.now() - startTime,
            linksFound: data.links.length,
            imagesFound: data.images.length
          }
        });
      }

      default:
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_ACTION', message: `Action "${action}" not supported for scraper tool` }
        });
    }
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(404).json({
        success: false,
        error: { code: 'URL_NOT_FOUND', message: 'Could not reach the specified URL' }
      });
    }

    res.status(500).json({
      success: false,
      error: { code: 'TOOL_ERROR', message: error.message, tool: 'scraper' }
    });
  }
}

// Tool Handler: Text-to-Speech
async function ttsToolHandler(action, req, res) {
  const startTime = Date.now();

  try {
    switch (action) {
      case 'speak':
      case 'generate': {
        const { text, voice = 'alloy', speed = 1.0, format = 'mp3' } = req.query;

        if (!text) {
          return res.status(400).json({
            success: false,
            error: { code: 'MISSING_TEXT', message: 'Text parameter required' }
          });
        }

        const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
        if (!validVoices.includes(voice)) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_VOICE',
              message: `Voice must be one of: ${validVoices.join(', ')}`
            }
          });
        }

        // Call OpenAI TTS API
        const response = await axios.post(
          'https://api.openai.com/v1/audio/speech',
          {
            model: 'tts-1',
            input: text,
            voice: voice,
            speed: parseFloat(speed)
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer'
          }
        );

        // Return audio file
        res.set({
          'Content-Type': `audio/${format}`,
          'Content-Disposition': `attachment; filename="speech-${Date.now()}.${format}"`
        });

        return res.send(Buffer.from(response.data));
      }

      default:
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_ACTION', message: `Action "${action}" not supported for tts tool` }
        });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'TOOL_ERROR', message: error.message, tool: 'tts' }
    });
  }
}

// ============================================================================
// TOOL DISCOVERY ENDPOINTS (must come before tool routers)
// ============================================================================

// List all tools
app.get('/api/tools', (req, res) => {
  const tools = Object.entries(toolRegistry).map(([id, tool]) => ({
    id,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    actions: tool.actions,
    enabled: tool.enabled,
    endpoints: {
      direct: `/api/tools/${id}`,
      withAgent: `/api/agents/:agentId/tools/${id}`
    }
  }));

  const categories = [...new Set(tools.map(t => t.category))];

  res.json({
    success: true,
    data: {
      count: tools.length,
      tools,
      categories
    }
  });
});

// Get specific tool info (must be GET to avoid conflict with POST routes)
app.get('/api/tools/:toolName/info', (req, res) => {
  const { toolName } = req.params;
  const tool = toolRegistry[toolName];

  if (!tool) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'TOOL_NOT_FOUND',
        message: `Tool "${toolName}" not found`,
        availableTools: Object.keys(toolRegistry)
      }
    });
  }

  res.json({
    success: true,
    data: {
      id: toolName,
      ...tool,
      endpoints: tool.actions.map(action => ({
        action,
        method: action === 'fetch' || action === 'query' || action === 'generate' ? 'GET/POST' : 'POST',
        url: `/api/tools/${toolName}/${action}`,
        agentUrl: `/api/agents/:agentId/tools/${toolName}/${action}`,
        description: getActionDescription(toolName, action)
      }))
    }
  });
});

// Helper: Get action descriptions
function getActionDescription(toolName, action) {
  const descriptions = {
    'dalle': {
      'generate': 'Generate a new image from a text prompt',
      'edit': 'Edit an existing image based on a prompt',
      'variations': 'Create variations of an existing image'
    },
    'scraper': {
      'fetch': 'Fetch and extract text content from a URL',
      'extract': 'Extract structured data (links, images, meta) from a URL'
    },
    'tts': {
      'speak': 'Convert text to speech audio',
      'generate': 'Generate speech audio from text'
    }
  };

  return descriptions[toolName]?.[action] || 'No description available';
}

// ============================================================================
// TOOL ROUTERS
// ============================================================================

// Tool Router: Direct tool access (with action)
app.use('/api/tools/:toolName/:action', async (req, res) => {
  const { toolName, action } = req.params;
  const tool = toolRegistry[toolName];

  if (!tool) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'TOOL_NOT_FOUND',
        message: `Tool "${toolName}" not found`,
        availableTools: Object.keys(toolRegistry)
      }
    });
  }

  if (!tool.enabled) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'TOOL_DISABLED',
        message: `Tool "${toolName}" is currently disabled`
      }
    });
  }

  const actionName = action || tool.actions[0];

  if (!tool.actions.includes(actionName)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ACTION',
        message: `Action "${actionName}" not available for tool "${toolName}"`,
        availableActions: tool.actions
      }
    });
  }

  // Route to appropriate handler
  const handlers = {
    'dalle': dalleToolHandler,
    'scraper': scraperToolHandler,
    'tts': ttsToolHandler
  };

  const handler = handlers[toolName];
  if (!handler) {
    return res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: `Handler for tool "${toolName}" not implemented` }
    });
  }

  await handler(actionName, req, res);
});

// Tool Router: Direct tool access (default action)
app.use('/api/tools/:toolName', async (req, res) => {
  const { toolName } = req.params;
  const tool = toolRegistry[toolName];

  if (!tool) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'TOOL_NOT_FOUND',
        message: `Tool "${toolName}" not found`,
        availableTools: Object.keys(toolRegistry)
      }
    });
  }

  if (!tool.enabled) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'TOOL_DISABLED',
        message: `Tool "${toolName}" is currently disabled`
      }
    });
  }

  // Use first action as default
  const actionName = tool.actions[0];

  // Route to appropriate handler
  const handlers = {
    'dalle': dalleToolHandler,
    'scraper': scraperToolHandler,
    'tts': ttsToolHandler
  };

  const handler = handlers[toolName];
  if (!handler) {
    return res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: `Handler for tool "${toolName}" not implemented` }
    });
  }

  await handler(actionName, req, res);
});

// Tool Router: Agent-scoped tool access (with action)
app.use('/api/agents/:agentId/tools/:toolName/:action', async (req, res) => {
  const { agentId, toolName, action } = req.params;

  // Verify agent exists
  const agent = worksona.getAgent(agentId);
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'AGENT_NOT_FOUND',
        message: `Agent "${agentId}" not found`,
        availableAgents: worksona.getAgents().map(a => a.id)
      }
    });
  }

  // Verify tool exists
  const tool = toolRegistry[toolName];
  if (!tool) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'TOOL_NOT_FOUND',
        message: `Tool "${toolName}" not found`,
        availableTools: Object.keys(toolRegistry)
      }
    });
  }

  if (!tool.enabled) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'TOOL_DISABLED',
        message: `Tool "${toolName}" is currently disabled`
      }
    });
  }

  const actionName = action || tool.actions[0];

  if (!tool.actions.includes(actionName)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ACTION',
        message: `Action "${actionName}" not available for tool "${toolName}"`,
        availableActions: tool.actions
      }
    });
  }

  // Attach agent to request
  req.agent = agent;

  // Route to appropriate handler
  const handlers = {
    'dalle': dalleToolHandler,
    'scraper': scraperToolHandler,
    'tts': ttsToolHandler
  };

  const handler = handlers[toolName];
  if (!handler) {
    return res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: `Handler for tool "${toolName}" not implemented` }
    });
  }

  await handler(actionName, req, res);
});

// ============================================================================
// END OF TOOL SYSTEM
// ============================================================================

// Batch query endpoint
app.post('/api/query/batch', async (req, res) => {
  const startTime = Date.now();

  try {
    const { queries } = req.body;

    if (!Array.isArray(queries) || queries.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_BATCH', message: 'Queries array required' }
      });
    }

    if (queries.length > 10) {
      return res.status(400).json({
        success: false,
        error: { code: 'BATCH_TOO_LARGE', message: 'Maximum 10 queries per batch' }
      });
    }

    const results = await Promise.allSettled(
      queries.map(async (q, index) => {
        const agent = q.agent || `batch-agent-${index}`;

        // Ensure agent exists
        if (!worksona.getAgent(agent)) {
          await worksona.loadAgent({
            id: agent,
            name: `Batch Agent ${index}`,
            config: {
              provider: q.provider || 'openai',
              model: q.model || 'gpt-4o',
              temperature: q.temperature || 0.7
            }
          });
        }

        const result = await worksona.chat(agent, q.query, q.options);
        return { index, query: q.query, result, agent };
      })
    );

    const succeeded = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const failed = results.filter(r => r.status === 'rejected').map((r, i) => ({
      index: i,
      error: r.reason?.message || 'Unknown error'
    }));

    res.json({
      success: true,
      results: succeeded,
      errors: failed,
      metadata: {
        total: queries.length,
        succeeded: succeeded.length,
        failed: failed.length,
        duration: Date.now() - startTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'BATCH_ERROR', message: error.message }
    });
  }
});

// Agent-specific analyze endpoint
app.post('/api/agents/:agentId/analyze', upload.single('file'), async (req, res) => {
  const startTime = Date.now();

  try {
    const { agentId } = req.params;
    const { text } = req.body;

    const agent = worksona.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: { code: 'AGENT_NOT_FOUND', message: `Agent ${agentId} not found` }
      });
    }

    let content;
    if (req.file) {
      // Analyze file
      const imageUrl = await fileToDataURL(req.file.path, req.file.mimetype);
      content = await worksona.processImage(agentId, imageUrl, {
        prompt: 'Analyze this content in detail'
      });
      await cleanupFile(req.file.path);
    } else if (text) {
      // Analyze text
      content = await worksona.chat(agentId, `Analyze: ${text}`);
    } else {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_CONTENT', message: 'File or text required' }
      });
    }

    res.json({
      success: true,
      data: {
        analysis: content,
        metadata: {
          agent: agentId,
          duration: Date.now() - startTime
        }
      }
    });
  } catch (error) {
    if (req.file) await cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      error: { code: 'ANALYSIS_ERROR', message: error.message }
    });
  }
});

// Agent-specific process endpoint
app.post('/api/agents/:agentId/process', upload.single('file'), async (req, res) => {
  const startTime = Date.now();

  try {
    const { agentId } = req.params;
    const { schema, operation } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FILE', message: 'File required' }
      });
    }

    const agent = worksona.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: { code: 'AGENT_NOT_FOUND', message: `Agent ${agentId} not found` }
      });
    }

    const imageUrl = await fileToDataURL(req.file.path, req.file.mimetype);

    const prompts = {
      extract: 'Extract all structured data from this document',
      invoice: 'Extract invoice data: number, date, vendor, total, line items',
      receipt: 'Extract receipt data: merchant, date, items, total',
      contact: 'Extract contact information: name, email, phone, address'
    };

    const prompt = prompts[schema] || prompts[operation] || prompts.extract;

    const result = await worksona.processImage(agentId, imageUrl, { prompt });

    await cleanupFile(req.file.path);

    res.json({
      success: true,
      data: {
        result,
        schema: schema || operation || 'default',
        metadata: {
          agent: agentId,
          fileType: req.file.mimetype,
          duration: Date.now() - startTime
        }
      }
    });
  } catch (error) {
    if (req.file) await cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      error: { code: 'PROCESS_ERROR', message: error.message }
    });
  }
});

// Webhook endpoint
app.post('/api/webhook/:agentId', async (req, res) => {
  const startTime = Date.now();

  try {
    const { agentId } = req.params;
    const payload = req.body;

    const agent = worksona.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: { code: 'AGENT_NOT_FOUND', message: `Agent ${agentId} not found` }
      });
    }

    // Extract query from various webhook formats
    const query = payload.text || payload.message || payload.query || payload.data;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_QUERY', message: 'No query found in webhook payload' }
      });
    }

    const result = await worksona.chat(agentId, typeof query === 'string' ? query : JSON.stringify(query));

    res.json({
      success: true,
      result,
      webhook: {
        agent: agentId,
        trigger: payload.trigger || 'webhook',
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'WEBHOOK_ERROR', message: error.message }
    });
  }
});

// Convenience: Quick ask endpoint
app.get('/api/ask', async (req, res) => {
  req.query.agent = 'quick-ask';
  // Forward to generic query handler
  return app._router.handle(req, res);
});

// Convenience: Quick translate endpoint
app.get('/api/translate', async (req, res) => {
  const startTime = Date.now();

  try {
    const { text, to = 'spanish', from = 'auto' } = req.query;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_TEXT', message: 'Text parameter required' }
      });
    }

    const agentId = 'translator';

    if (!worksona.getAgent(agentId)) {
      await worksona.loadAgent({
        id: agentId,
        name: 'Translator',
        config: {
          provider: 'openai',
          model: 'gpt-4o',
          temperature: 0.3
        }
      });
    }

    const result = await worksona.chat(agentId, `Translate this text to ${to}: ${text}`);

    res.json({
      success: true,
      translation: result,
      from,
      to,
      original: text,
      metadata: {
        duration: Date.now() - startTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'TRANSLATION_ERROR', message: error.message }
    });
  }
});

// ============================================================================
// IMAGE PROCESSING ENDPOINTS
// ============================================================================

// Analyze image
app.post('/api/images/analyze', upload.single('image'), async (req, res) => {
  const startTime = Date.now();

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FILE', message: 'Image file required' }
      });
    }

    const { agentId = 'default-vision', prompt = 'Analyze this image' } = req.body;

    // Ensure agent exists or create default
    if (!worksona.getAgent(agentId)) {
      await worksona.loadAgent({
        id: agentId,
        name: 'Vision Agent',
        config: {
          provider: 'openai',
          model: 'gpt-4o',
          temperature: 0.7
        }
      });
    }

    // Convert to data URL
    const imageUrl = await fileToDataURL(req.file.path, req.file.mimetype);

    // Process image
    const result = await worksona.processImage(agentId, imageUrl, { prompt });

    // Cleanup
    await cleanupFile(req.file.path);

    res.json({
      success: true,
      data: {
        result,
        metadata: {
          model: worksona.getAgent(agentId).config.model,
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          fileSize: req.file.size,
          fileType: req.file.mimetype
        }
      }
    });
  } catch (error) {
    if (req.file) await cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      error: { code: 'IMAGE_ANALYSIS_ERROR', message: error.message }
    });
  }
});

// Generate image
app.post('/api/images/generate', async (req, res) => {
  const startTime = Date.now();

  try {
    const { agentId = 'default-image-gen', prompt, options = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PROMPT', message: 'Prompt required' }
      });
    }

    // Ensure agent exists
    if (!worksona.getAgent(agentId)) {
      await worksona.loadAgent({
        id: agentId,
        name: 'Image Generator',
        config: {
          provider: 'openai',
          model: 'dall-e-3',
          temperature: 0.7
        }
      });
    }

    const imageUrl = await worksona.generateImage(agentId, prompt, options);

    res.json({
      success: true,
      data: {
        imageUrl,
        metadata: {
          prompt,
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'IMAGE_GENERATION_ERROR', message: error.message }
    });
  }
});

// ============================================================================
// DOCUMENT PROCESSING ENDPOINTS
// ============================================================================

// OCR - Extract text from image
app.post('/api/documents/ocr', upload.single('file'), async (req, res) => {
  const startTime = Date.now();

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FILE', message: 'File required' }
      });
    }

    const { agentId = 'default-ocr', language = 'eng' } = req.body;

    // Ensure agent exists
    if (!worksona.getAgent(agentId)) {
      await worksona.loadAgent({
        id: agentId,
        name: 'OCR Agent',
        config: {
          provider: 'openai',
          model: 'gpt-4o',
          temperature: 0.3,
          systemPrompt: 'You are an OCR specialist. Extract all text from images accurately.'
        }
      });
    }

    // Convert to data URL
    const imageUrl = await fileToDataURL(req.file.path, req.file.mimetype);

    // Use vision model to extract text
    const text = await worksona.processImage(agentId, imageUrl, {
      prompt: 'Extract all text from this image. Return only the text content, no descriptions.'
    });

    // Cleanup
    await cleanupFile(req.file.path);

    res.json({
      success: true,
      data: {
        text,
        metadata: {
          language,
          duration: Date.now() - startTime,
          fileSize: req.file.size,
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    if (req.file) await cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      error: { code: 'OCR_ERROR', message: error.message }
    });
  }
});

// Document analysis
app.post('/api/documents/analyze', upload.single('file'), async (req, res) => {
  const startTime = Date.now();

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FILE', message: 'File required' }
      });
    }

    // Extract agent parameter (could be 'agent' or 'agentId')
    let agentId = req.body.agentId || req.body.agent;
    // If empty string or not provided, set to null for auto-detection
    if (!agentId || agentId === '') {
      agentId = null;
    }
    const task = req.body.task || 'summarize';

    // Auto-select agent based on file type if not specified
    if (!agentId) {
      if (req.file.mimetype.startsWith('image/')) {
        // For images, use OpenAI (supports vision)
        agentId = 'image-analyst';
        if (!worksona.getAgent(agentId)) {
          await worksona.loadAgent({
            id: agentId,
            name: 'Image Analyst',
            config: {
              provider: 'openai',
              model: 'gpt-4o',
              temperature: 0.5
            }
          });
        }
      } else {
        // For text/documents, use default analyst
        agentId = 'default-analyst';
        if (!worksona.getAgent(agentId)) {
          await worksona.loadAgent({
            id: agentId,
            name: 'Document Analyst',
            config: {
              provider: 'openai',
              model: 'gpt-4o',
              temperature: 0.5
            }
          });
        }
      }
    }

    // Determine if file is text-based (document) or image
    const isTextDocument = [
      'text/plain',
      'text/markdown',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/msword' // .doc
    ].includes(req.file.mimetype) ||
    req.file.originalname.match(/\.(txt|md|csv|docx|xlsx|xls|doc)$/i);

    const isPDF = req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf');
    const isImage = req.file.mimetype.startsWith('image/');

    // For text-based documents, extract text and send to LLM
    if (isTextDocument) {
      const extractedText = await extractTextFromDocument(req.file.path, req.file.mimetype);
      const prompt = req.body.prompt || 'Analyze this document and provide insights';

      const result = await worksona.chat(agentId, `${prompt}\n\nDocument content:\n${extractedText}`);

      await cleanupFile(req.file.path);

      return res.json({
        success: true,
        data: {
          analysis: result,
          agent: agentId,
          extractedText: extractedText.substring(0, 500) + '...', // Preview
          metadata: {
            duration: Date.now() - startTime,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            characterCount: extractedText.length,
            processingMethod: 'text-extraction'
          }
        }
      });
    }

    // For PDFs, try text extraction first, fall back to vision if needed
    if (isPDF) {
      try {
        const extractedText = await extractTextFromDocument(req.file.path, req.file.mimetype);

        // If we got substantial text, use text-based analysis
        if (extractedText.length > 50) {
          const prompt = req.body.prompt || 'Analyze this PDF document and provide insights';
          const result = await worksona.chat(agentId, `${prompt}\n\nDocument content:\n${extractedText}`);

          await cleanupFile(req.file.path);

          return res.json({
            success: true,
            data: {
              analysis: result,
              agent: agentId,
              extractedText: extractedText.substring(0, 500) + '...', // Preview
              metadata: {
                duration: Date.now() - startTime,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                characterCount: extractedText.length,
                processingMethod: 'pdf-text-extraction'
              }
            }
          });
        }
      } catch (error) {
        console.log('PDF text extraction failed, falling back to vision:', error.message);
      }

      // Fall back to vision for image-based PDFs
    }

    // For images and image-based PDFs, use vision
    if (isImage || isPDF) {
      const imageUrl = await fileToDataURL(req.file.path, req.file.mimetype);

      const prompts = {
        summarize: 'Provide a comprehensive summary of this document',
        extract: 'Extract all key information from this document as structured data',
        analyze: 'Analyze this document and provide insights'
      };

      const result = await worksona.processImage(agentId, imageUrl, {
        prompt: req.body.prompt || prompts[task] || prompts.summarize
      });

      await cleanupFile(req.file.path);

      return res.json({
        success: true,
        data: {
          analysis: result,
          task,
          metadata: {
            duration: Date.now() - startTime,
            fileType: req.file.mimetype,
            fileSize: req.file.size
          }
        }
      });
    }

    res.status(400).json({
      success: false,
      error: { code: 'UNSUPPORTED_FORMAT', message: 'File format not yet supported' }
    });
  } catch (error) {
    if (req.file) await cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      error: { code: 'DOCUMENT_ANALYSIS_ERROR', message: error.message }
    });
  }
});

// ============================================================================
// SLASH COMMAND ENDPOINTS (Quick Operations)
// ============================================================================

// /ocr - Quick OCR
app.post('/api/slash/ocr', upload.single('file'), async (req, res) => {
  req.body.agentId = 'quick-ocr';
  return app._router.handle(req, res);
});

// /summarize - Quick summarization
app.post('/api/slash/summarize', upload.single('file'), async (req, res) => {
  req.body.task = 'summarize';
  req.body.agentId = 'quick-summarize';

  // Forward to document analyze
  return app._router.handle(req, res);
});

// /translate - Quick translation
app.post('/api/slash/translate', async (req, res) => {
  const startTime = Date.now();

  try {
    const { text, to = 'spanish', from = 'auto' } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_TEXT', message: 'Text required' }
      });
    }

    const agentId = 'translator';

    if (!worksona.getAgent(agentId)) {
      await worksona.loadAgent({
        id: agentId,
        name: 'Translator',
        config: {
          provider: 'openai',
          model: 'gpt-4o',
          temperature: 0.3
        }
      });
    }

    const result = await worksona.chat(agentId,
      `Translate this text to ${to}: ${text}`
    );

    res.json({
      success: true,
      data: {
        translation: result,
        from,
        to,
        metadata: {
          duration: Date.now() - startTime
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'TRANSLATION_ERROR', message: error.message }
    });
  }
});

// /extract-data - Extract structured data
app.post('/api/slash/extract-data', upload.single('file'), async (req, res) => {
  const startTime = Date.now();

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FILE', message: 'File required' }
      });
    }

    const { schema = 'general' } = req.body;
    const agentId = 'data-extractor';

    if (!worksona.getAgent(agentId)) {
      await worksona.loadAgent({
        id: agentId,
        name: 'Data Extractor',
        config: {
          provider: 'openai',
          model: 'gpt-4o',
          temperature: 0.2,
          systemPrompt: 'Extract structured data from documents. Return valid JSON.'
        }
      });
    }

    const imageUrl = await fileToDataURL(req.file.path, req.file.mimetype);

    const schemaPrompts = {
      invoice: 'Extract invoice data: invoice number, date, vendor, total, line items',
      receipt: 'Extract receipt data: merchant, date, items, total, payment method',
      general: 'Extract all structured data from this document as JSON'
    };

    const result = await worksona.processImage(agentId, imageUrl, {
      prompt: schemaPrompts[schema] || schemaPrompts.general
    });

    await cleanupFile(req.file.path);

    res.json({
      success: true,
      data: {
        extractedData: result,
        schema,
        metadata: {
          duration: Date.now() - startTime,
          fileType: req.file.mimetype
        }
      }
    });
  } catch (error) {
    if (req.file) await cleanupFile(req.file.path);
    res.status(500).json({
      success: false,
      error: { code: 'DATA_EXTRACTION_ERROR', message: error.message }
    });
  }
});

// ============================================================================
// ERROR HANDLERS
// ============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      availableEndpoints: '/api/info'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                   WORKSONA API SERVER                         ║
║                      Version 0.3.0                            ║
╠═══════════════════════════════════════════════════════════════╣
║  Status: Running on port ${port}                                  ║
║  URL: http://localhost:${port}                                    ║
║  Info: http://localhost:${port}/api/info                          ║
║  Health: http://localhost:${port}/health                          ║
╠═══════════════════════════════════════════════════════════════╣
║  Providers:                                                   ║
║    OpenAI: ${process.env.OPENAI_API_KEY ? '✓' : '✗'}                                            ║
║    Anthropic: ${process.env.ANTHROPIC_API_KEY ? '✓' : '✗'}                                         ║
║    Google: ${process.env.GOOGLE_API_KEY ? '✓' : '✗'}                                            ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;

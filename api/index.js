/**
 * Vercel Serverless Function Entry Point
 * This wraps the Express app for Vercel deployment
 * 
 * Vercel will route /api/* requests to this function
 * The Express app handles all routes internally
 * 
 * IMPORTANT: Vercel preserves the full path including /api prefix
 * So /api/agents becomes /api/agents in Express, which matches our routes
 */

try {
  // Set Vercel environment before loading
  process.env.VERCEL = '1';
  process.env.VERCEL_ENV = process.env.VERCEL_ENV || 'production';
  
  // Polyfill DOMMatrix for Node.js/serverless environment
  // pdf-parse (via pdfjs-dist) requires DOMMatrix which is a browser API
  if (typeof global.DOMMatrix === 'undefined') {
    try {
      // Try to use @napi-rs/canvas DOMMatrix if available
      const { DOMMatrix } = require('@napi-rs/canvas');
      global.DOMMatrix = DOMMatrix;
      global.DOMMatrixReadOnly = DOMMatrix;
    } catch (canvasError) {
      // Fallback: Create a minimal DOMMatrix polyfill
      // This is a simplified version - pdfjs-dist should work with this
      class DOMMatrixPolyfill {
        constructor(init) {
          if (typeof init === 'string') {
            // Parse matrix string like "matrix(1, 0, 0, 1, 0, 0)"
            const match = init.match(/matrix\(([^)]+)\)/);
            if (match) {
              const values = match[1].split(',').map(v => parseFloat(v.trim()));
              this.a = values[0] || 1;
              this.b = values[1] || 0;
              this.c = values[2] || 0;
              this.d = values[3] || 1;
              this.e = values[4] || 0;
              this.f = values[5] || 0;
            } else {
              this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
            }
          } else if (Array.isArray(init)) {
            this.a = init[0] || 1;
            this.b = init[1] || 0;
            this.c = init[2] || 0;
            this.d = init[3] || 1;
            this.e = init[4] || 0;
            this.f = init[5] || 0;
          } else if (init && typeof init === 'object') {
            this.a = init.a ?? 1;
            this.b = init.b ?? 0;
            this.c = init.c ?? 0;
            this.d = init.d ?? 1;
            this.e = init.e ?? 0;
            this.f = init.f ?? 0;
          } else {
            this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
          }
          this.is2D = true;
          this.isIdentity = this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.e === 0 && this.f === 0;
        }
        multiply(other) { 
          // Return a new matrix (simplified - just return identity for now)
          return new DOMMatrixPolyfill([1, 0, 0, 1, 0, 0]);
        }
        inverse() { 
          return new DOMMatrixPolyfill([1, 0, 0, 1, 0, 0]);
        }
        translate() { return this; }
        scale() { return this; }
        rotate() { return this; }
      }
      // Make it available as a constructor function
      global.DOMMatrix = DOMMatrixPolyfill;
      global.DOMMatrixReadOnly = DOMMatrixPolyfill;
    }
  }
  
  // Load the Express app
  const app = require('../worksona-server.js');
  
  console.log('Express app loaded successfully');

  // Export the Express app for Vercel
  // Vercel's @vercel/node adapter automatically wraps Express apps
  // All routes defined in worksona-server.js will work
  // The /api prefix is preserved by Vercel rewrites

  // For Vercel serverless functions, we export the app directly
  // Vercel will handle the routing based on vercel.json rewrites
  // The Express app receives the full path including /api prefix
  module.exports = app;
} catch (error) {
  // Log full error details for debugging
  console.error('Error loading Express app:', error);
  console.error('Error stack:', error.stack);
  console.error('Error message:', error.message);
  console.error('Current directory:', __dirname);
  console.error('Process env:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV
  });
  
  // Export a detailed error handler
  module.exports = (req, res) => {
    console.error('Function error on request:', {
      url: req.url,
      method: req.method,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      error: {
        code: 'FUNCTION_LOAD_ERROR',
        message: 'Failed to load Express app',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development' ? error.stack : undefined
      }
    });
  };
}

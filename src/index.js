const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { convertToMarkdown } = require('./parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration - use stricter per-IP detection for Render
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Trust proxy to get real client IP
  skip: (req, res) => {
    // Don't rate limit health checks
    return req.path === '/health';
  },
  keyGenerator: (req, res) => {
    // For Render, use X-Forwarded-For. For local, use remoteAddress
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    return req.ip;
  }
});

// Middleware - apply trust proxy setting for accurate IP detection
app.set('trust proxy', 1); // Trust first proxy (Render)
app.use(express.json());

// Serve static files from public directory
const publicPath = path.join(__dirname, '../public');
console.log('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Explicitly serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

/**
 * GET /parse - Converts a URL to clean Markdown
 * Query Parameters:
 *   - url (required): The URL to fetch and convert
 */
app.get('/parse', limiter, async (req, res) => {
  const { url } = req.query;

  // Validate URL parameter
  if (!url) {
    return res.status(400).json({
      error: 'Missing required query parameter: url'
    });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid URL format'
    });
  }

  try {
    const result = await convertToMarkdown(url);
    res.json(result);
  } catch (error) {
    console.error('Parse error:', error.message);
    res.status(500).json({
      error: 'Failed to parse URL',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TokenSaver running on http://localhost:${PORT}`);
  console.log(`📝 GET /parse?url=https://example.com - Convert URL to Markdown`);
});
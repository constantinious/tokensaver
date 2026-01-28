const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { convertToMarkdown } = require('./parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * GET /parse - Converts a URL to clean Markdown
 * Query Parameters:
 *   - url (required): The URL to fetch and convert
 */
app.get('/parse', limiter, async (req, res) => {', publicPath);
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
app.get('/parse', async (req, res) => {
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
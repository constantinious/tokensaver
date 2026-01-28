const express = require('express');
const path = require('path');
const { convertToMarkdown } = require('./parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

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
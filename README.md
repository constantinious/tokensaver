# TokenSaver 🚀

Convert any URL into clean, **LLM-ready Markdown** in seconds.

## Features

✨ **Smart Content Extraction** - Strips ads, navbars, popups, and junk  
⚡ **Fast Processing** - Typical response time: 1-2 seconds  
🤖 **LLM-Optimized** - Clean markdown perfect for AI/ML pipelines  
🔄 **Bot Detection Bypass** - Rotates user agents to avoid blocks  
📊 **Compression** - 90%+ reduction from raw HTML  
🐳 **Docker Ready** - One-command deployment  

## Quick Start

### Using Docker (Recommended)

```bash
docker pull yourusername/tokensaver:latest
docker run -p 3000:3000 yourusername/tokensaver:latest
```

### Using NPM

```bash
git clone https://github.com/yourusername/tokensaver.git
cd tokensaver
npm install
npm start
```

Server runs on `http://localhost:3000`

## API Usage

### Convert URL to Markdown

**Endpoint:** `GET /parse`

**Query Parameters:**
- `url` (required) - The URL to convert

**Example Request:**
```bash
curl "http://localhost:3000/parse?url=https://www.bbc.com/news"
```

**Example Response:**
```json
{
  "title": "BBC News - Home",
  "author": "BBC News",
  "excerpt": "The latest news from around the world...",
  "markdown": "# BBC News - Home\n\nThe latest news from around the world...",
  "length": 2048
}
```

### Health Check

**Endpoint:** `GET /health`

```bash
curl http://localhost:3000/health
```

## Error Handling

| Status | Reason |
|--------|--------|
| 400 | Missing or invalid `url` parameter |
| 500 | Failed to fetch or parse the URL |

**Error Response:**
```json
{
  "error": "Failed to parse URL",
  "details": "Request failed with status code 401"
}
```

## Testing

Run the comprehensive stress test suite:

```bash
npm test
# or
node tests/test-runner.js
```

Tests include:
- ✅ News sites with aggressive ads
- ✅ Recipe blogs with fluff content
- ✅ Wiki pages with math formulas
- ✅ Technical blogs with code syntax highlighting
- ✅ Platform-specific content extraction
- ✅ Complex table formatting

## How It Works

1. **Fetch** - Downloads HTML using Axios with rotating user agents
2. **Parse** - Uses JSDOM to simulate a real browser DOM
3. **Extract** - Mozilla Readability identifies main article content
4. **Convert** - Turndown transforms HTML to clean Markdown
5. **Return** - JSON response with metadata and markdown

## Technologies

- **Express.js** - Web framework
- **Axios** - HTTP client with bot detection bypass
- **JSDOM** - DOM simulator for complex sites
- **@mozilla/readability** - Content extraction
- **Turndown** - HTML to Markdown conversion

## Environment Variables

```bash
PORT=3000          # Server port (default: 3000)
NODE_ENV=production # Node environment
```

## Development

```bash
# Install dependencies
npm install

# Start server with auto-reload
npm start

# Run tests
npm test

# Build Docker image
docker build -t tokensaver:latest .
```

## Docker Deployment

### Docker Hub

```bash
docker build -t yourusername/tokensaver:latest .
docker push yourusername/tokensaver:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  tokensaver:
    image: yourusername/tokensaver:latest
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=production
```

Run with: `docker-compose up`

## Performance

- **Average Response Time:** 1-2 seconds
- **Content Compression:** 90%+ reduction from raw HTML
- **Markdown Quality:** Optimized for LLM processing

## Limitations

- Large pages (>10MB) may timeout
- JavaScript-rendered content won't be captured (SPA pages)
- Some sites with aggressive anti-scraping measures may fail
- Maximum timeout: 10 seconds per request

## License

MIT

## Contributing

Contributions welcome! Please submit issues and PRs on GitHub.

## Support

For bugs and feature requests, open an issue on GitHub.

---

Made with ❤️ for LLM engineers

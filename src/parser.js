const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const TurndownService = require('turndown');
const { getRandomHeaders } = require('./utils/headers');

/**
 * Converts a URL to clean, LLM-ready Markdown
 * @param {string} url - The URL to fetch and convert
 * @returns {Promise<Object>} Object with title, author, excerpt, and markdown content
 */
async function convertToMarkdown(url) {
  try {
    // Fetch the HTML from the URL
    const response = await axios.get(url, {
      headers: getRandomHeaders(),
      timeout: 10000,
      maxRedirects: 5
    });

    const html = response.data;

    // Use JSDOM to parse the HTML
    const dom = new JSDOM(html, { url });

    // Use Readability to extract the main article content
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error('Failed to extract article content');
    }

    // Use Turndown to convert HTML to Markdown
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(article.content);

    // Return object with extracted metadata and markdown
    return {
      title: article.title || '',
      author: article.byline || '',
      excerpt: article.excerpt || '',
      markdown: markdown,
      length: article.length || 0
    };
  } catch (error) {
    throw new Error(`Failed to convert URL to Markdown: ${error.message}`);
  }
}

module.exports = { convertToMarkdown };

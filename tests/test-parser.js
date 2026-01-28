const axios = require('axios');
const path = require('path');
const { convertToMarkdown } = require('../src/parser');

// Load test URLs from JSON file
const testUrls = require('./test-urls.json');

/**
 * Calculate compression ratio
 * @param {number} htmlSize - Original HTML size in bytes
 * @param {number} markdownSize - Markdown size in bytes
 * @returns {number} Compression percentage (how much was removed)
 */
function getCompressionRatio(htmlSize, markdownSize) {
  return ((1 - markdownSize / htmlSize) * 100).toFixed(2);
}

/**
 * Run parser tests on multiple URLs
 */
async function runTests() {
  console.log('🧪 TokenSaver Parser Test Suite\n');
  console.log('=' .repeat(80));

  let successCount = 0;
  let failureCount = 0;

  for (const url of testUrls) {
    try {
      console.log(`\n📍 Testing: ${url}`);
      console.log('-'.repeat(80));

      // Fetch raw HTML
      const htmlResponse = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const htmlSize = Buffer.byteLength(htmlResponse.data, 'utf8');

      // Convert to Markdown
      const result = await convertToMarkdown(url);
      const markdownSize = Buffer.byteLength(result.markdown, 'utf8');

      // Calculate compression
      const compression = getCompressionRatio(htmlSize, markdownSize);

      // Display results
      console.log(`✅ Title: ${result.title}`);
      console.log(`📝 Author: ${result.author || 'N/A'}`);
      console.log(`📊 Original HTML: ${(htmlSize / 1024).toFixed(2)} KB`);
      console.log(`📄 Markdown: ${(markdownSize / 1024).toFixed(2)} KB`);
      console.log(`🎯 Compression: ${compression}% smaller`);

      // Check success metric (90% smaller)
      if (compression >= 90) {
        console.log(`✨ SUCCESS: Clean-Reader working perfectly!`);
        successCount++;
      } else if (compression >= 70) {
        console.log(`⚠️  PARTIAL: Good compression but could be better`);
        successCount++;
      } else {
        console.log(`❌ FAILED: Compression below 70%`);
        failureCount++;
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      failureCount++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log(`\n📈 Test Summary:`);
  console.log(`   ✅ Passed: ${successCount}/${testUrls.length}`);
  console.log(`   ❌ Failed: ${failureCount}/${testUrls.length}`);
  console.log(`\n✨ Success Metric: Markdown should be 90% smaller than raw HTML\n`);
}

// Run tests
runTests().catch(console.error);

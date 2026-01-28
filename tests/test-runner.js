const { convertToMarkdown } = require('../src/parser');
const testCases = require('./test-urls.json');

/**
 * Color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Run stress tests on all URLs
 */
async function runStressTests() {
  console.log(`${colors.blue}╔════════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║${colors.reset}         🔥 TokenSaver - Stress Test Suite 🔥                  ${colors.blue}║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  let passCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const testNum = i + 1;

    console.log(`${colors.cyan}[Test ${testNum}/${testCases.length}]${colors.reset} ${colors.yellow}${testCase.category}${colors.reset}`);
    console.log(`📍 URL: ${testCase.url}`);
    console.log(`⚠️  Challenge: ${testCase.challenge}`);
    console.log(`${colors.gray}${'─'.repeat(70)}${colors.reset}`);

    try {
      const startTime = Date.now();
      const result = await convertToMarkdown(testCase.url);
      const duration = Date.now() - startTime;

      // Calculate markdown size
      const markdownSize = Buffer.byteLength(result.markdown, 'utf8');

      // Check for content
      const hasContent = result.markdown.length > 100;
      const status = hasContent ? `${colors.green}✅ PASS${colors.reset}` : `${colors.yellow}⚠️  PARTIAL${colors.reset}`;

      console.log(`${status}`);
      console.log(`📝 Title: ${result.title || '(No title found)'}`);
      console.log(`👤 Author: ${result.author || '(No author found)'}`);
      console.log(`📊 Markdown Size: ${formatBytes(markdownSize)}`);
      console.log(`⏱️  Duration: ${duration}ms`);
      console.log(`📄 Preview: ${result.markdown.substring(0, 120).replace(/\n/g, ' ')}...`);

      if (hasContent) {
        passCount++;
      } else {
        failCount++;
      }

      results.push({
        category: testCase.category,
        status: hasContent ? 'PASS' : 'PARTIAL',
        markdownSize,
        duration,
        contentLength: result.markdown.length
      });

    } catch (error) {
      console.log(`${colors.red}❌ FAIL${colors.reset}`);
      console.log(`🚨 Error: ${error.message}`);
      failCount++;
      results.push({
        category: testCase.category,
        status: 'FAIL',
        error: error.message
      });
    }

    console.log();
  }

  // Summary Report
  console.log(`${colors.blue}╔════════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║${colors.reset}                         📊 Test Summary                           ${colors.blue}║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  results.forEach((result, index) => {
    const statusIcon = result.status === 'PASS' ? '✅' : result.status === 'PARTIAL' ? '⚠️' : '❌';
    console.log(`${statusIcon} ${result.category}`);
    if (result.error) {
      console.log(`   ${colors.red}Error: ${result.error}${colors.reset}`);
    } else {
      console.log(`   Size: ${formatBytes(result.markdownSize)} | Duration: ${result.duration}ms`);
    }
  });

  console.log(`\n${colors.green}✅ Passed: ${passCount}/${testCases.length}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failCount}/${testCases.length}${colors.reset}\n`);

  // Recommendations
  console.log(`${colors.cyan}💡 Recommendations:${colors.reset}`);
  console.log(`   • News Sites: Check for leftover ad text or newsletter CTAs`);
  console.log(`   • Recipe Blogs: Ensure ingredients/instructions are prioritized`);
  console.log(`   • Math Content: Verify LaTeX formulas are preserved`);
  console.log(`   • Code Blogs: Check code blocks use triple backticks with language`);
  console.log(`   • Medium: If failing, update headers.js with better User-Agent`);
  console.log(`   • Tables: Ensure Markdown table format is readable\n`);
}

// Run all tests
runStressTests().catch(console.error);

/**
 * @example Web Scraping
 * 
 * Robust web scraping with error recovery and retry logic.
 */

import { Ok, Err, match, andThen, orElse } from '@resultsafe/core-fp-result';

// ===== Error types =====

type ScrapingError =
  | { type: 'network'; message: string; url: string }
  | { type: 'parse'; message: string; url: string }
  | { type: 'selector'; message: string; selector: string }
  | { type: 'rate-limit'; retryAfter: number }
  | { type: 'not-found'; url: string };

// ===== Scraping utilities =====

interface ScrapedData {
  url: string;
  title: string;
  content: string;
  links: string[];
  timestamp: string;
}

const fetchWithRetry = async (
  url: string,
  maxRetries = 3
): Promise<Result<string, ScrapingError>> => {
  let lastError: ScrapingError | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ResultSafe Bot/1.0)',
        },
      });

      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10);
        lastError = { type: 'rate-limit', retryAfter };
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      if (response.status === 404) {
        return Err({ type: 'not-found', url });
      }

      if (!response.ok) {
        lastError = {
          type: 'network',
          message: `HTTP ${response.status}`,
          url,
        };
        continue;
      }

      return Ok(await response.text());
    } catch (error) {
      lastError = {
        type: 'network',
        message: error instanceof Error ? error.message : 'Unknown error',
        url,
      };

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  return Err(lastError!);
};

const parseHtml = (
  html: string,
  url: string
): Result<ScrapedData, ScrapingError> => {
  try {
    // Simulated parsing (in real code, use cheerio, jsdom, or similar)
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

    // Extract links
    const linkMatches = html.match(/href=["']([^"']+)["']/g) || [];
    const links = linkMatches
      .map((link) => link.replace(/href=["']([^"']+)["']/, '$1'))
      .filter((link) => link.startsWith('http'));

    return Ok({
      url,
      title,
      content: html.slice(0, 500), // First 500 chars
      links: links.slice(0, 10), // First 10 links
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Err({
      type: 'parse',
      message: error instanceof Error ? error.message : 'Parse failed',
      url,
    });
  }
};

// ===== Scraping pipeline =====

const scrapeUrl = async (url: string): Promise<Result<ScrapedData, ScrapingError>> => {
  // Step 1: Fetch with retry
  const fetchResult = await fetchWithRetry(url);
  if (fetchResult.ok === false) return fetchResult;

  // Step 2: Parse HTML
  return parseHtml(fetchResult.value, url);
};

const scrapeMultiple = async (
  urls: string[],
  concurrency = 3
): Promise<Result<ScrapedData[], ScrapingError>> => {
  const results: ScrapedData[] = [];
  const errors: ScrapingError[] = [];

  // Process with limited concurrency
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((url) => scrapeUrl(url))
    );

    for (const result of batchResults) {
      if (result.ok) {
        results.push(result.value);
      } else {
        errors.push(result.error);
      }
    }

    // Rate limiting between batches
    if (i + concurrency < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (errors.length > 0) {
    // Return partial results with errors
    console.warn(`Scraped ${results.length} URLs, ${errors.length} failed`);
  }

  return Ok(results);
};

// ===== Example usage =====

const runExample = async () => {
  console.log('=== Web Scraping Example ===\n');

  const urls = [
    'https://example.com',
    'https://example.org',
    'https://httpstat.us/404', // Will fail
  ];

  const result = await scrapeMultiple(urls);

  match(
    result,
    (data) => {
      console.log(`Successfully scraped ${data.length} pages:`);
      data.forEach((page) => {
        console.log(`  - ${page.title} (${page.url})`);
      });
    },
    (error) => {
      console.log('Scraping failed:', error);
    }
  );
};

// Uncomment to run:
// runExample().catch(console.error);

#!/usr/bin/env node
/**
 * Standalone Keep-Alive Ping Script
 * Can be run via crontab, Render Cron Job, or GitHub Actions.
 *
 * Usage:
 *   node scripts/cron-ping.js [URL]
 *   Or set RENDER_EXTERNAL_URL in environment.
 */
import https from 'https';
import http from 'http';

const targetUrl = process.argv[2] || process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;

if (!targetUrl) {
  console.error('Error: No target URL provided. Pass as arg or set RENDER_EXTERNAL_URL/SERVER_URL.');
  process.exit(1);
}

const endpoint = `${targetUrl.replace(/\/+$/, '')}/api/health`;
console.log(`[KeepAlive] Pinging: ${endpoint}...`);

const client = endpoint.startsWith('https') ? https : http;

const req = client.get(endpoint, (res) => {
  console.log(`[KeepAlive] Response status: ${res.statusCode} ${res.statusMessage}`);
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log(`[KeepAlive] Response body:`, body);
    process.exit(res.statusCode >= 200 && res.statusCode < 400 ? 0 : 1);
  });
});

req.on('error', (err) => {
  console.error(`[KeepAlive] Request failed: ${err.message}`);
  process.exit(1);
});

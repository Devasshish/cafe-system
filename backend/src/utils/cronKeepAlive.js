import https from 'https';
import http from 'http';

/**
 * Render Free Tier Keep-Alive Cron Job
 * Render puts free web services to sleep after 15 minutes of inactivity.
 * This helper automatically pings /api/health every 14 minutes when a public
 * URL is configured (either RENDER_EXTERNAL_URL provided by Render, or SERVER_URL).
 */
export const startKeepAliveCron = () => {
  const targetUrl = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;

  if (!targetUrl) {
    console.log('[KeepAlive Cron] No RENDER_EXTERNAL_URL or SERVER_URL set. Running in local/dev mode (keep-alive disabled).');
    return;
  }

  // Ping every 14 minutes (840,000 milliseconds)
  const INTERVAL_MS = 14 * 60 * 1000;
  const healthEndpoint = `${targetUrl.replace(/\/+$/, '')}/api/health`;

  console.log(`[KeepAlive Cron] Initialized: pinging ${healthEndpoint} every 14 minutes to prevent Render sleep.`);

  const pingServer = () => {
    try {
      const client = healthEndpoint.startsWith('https') ? https : http;
      client
        .get(healthEndpoint, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            console.log(`[KeepAlive Cron] Success: server pinged at ${new Date().toISOString()} (HTTP ${res.statusCode})`);
          } else {
            console.warn(`[KeepAlive Cron] Received HTTP status ${res.statusCode} from ${healthEndpoint}`);
          }
        })
        .on('error', (err) => {
          console.error(`[KeepAlive Cron] Ping error: ${err.message}`);
        });
    } catch (err) {
      console.error(`[KeepAlive Cron] Unexpected ping failure: ${err.message}`);
    }
  };

  // Ping once after 1 minute to verify, then periodically every 14 minutes
  setTimeout(pingServer, 60 * 1000);
  const intervalId = setInterval(pingServer, INTERVAL_MS);

  // Clean interval if process terminates
  const cleanup = () => {
    clearInterval(intervalId);
  };
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
};

export default startKeepAliveCron;


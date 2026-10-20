const { Worker } = require('bullmq');
const cheerio = require('cheerio');
const connectDB = require('./config/db');
const { QUEUE_NAME } = require('./config/queue');
const linkRepository = require('./repositories/link.repository');

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
};

const resolve = (value, base) => {
  if (!value) return null;
  try { return new URL(value, base).href; } catch { return null; }
};

const fetchMetadata = async (url) => {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { 'User-Agent': 'LinkVaultBot/1.0' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const empty = { title: null, description: null, image: null, favicon: null };
  if (!(res.headers.get('content-type') || '').includes('text/html')) return empty;

  const $ = cheerio.load(await res.text());
  const meta = (key) =>
    $(`meta[property="${key}"]`).attr('content') ||
    $(`meta[name="${key}"]`).attr('content') || null;

  return {
    title: meta('og:title') || $('title').first().text().trim() || null,
    description: meta('og:description') || meta('description'),
    image: resolve(meta('og:image'), res.url),
    favicon:
      resolve($('link[rel~="icon"]').attr('href'), res.url) ||
      resolve('/favicon.ico', res.url),
  };
};

const start = async () => {
  await connectDB();

  const worker = new Worker(QUEUE_NAME, async (job) => {
    const { linkId, url } = job.data;
    const data = await fetchMetadata(url);
    await linkRepository.updateLinkInternal(linkId, { ...data, metadataStatus: 'completed' });
  }, { connection, concurrency: 5 });

  worker.on('failed', async (job, err) => {
    console.error(`Job ${job.id} failed (attempt ${job.attemptsMade}):`, err.message);
    if (job.attemptsMade >= job.opts.attempts) {
      await linkRepository.updateLinkInternal(job.data.linkId, { metadataStatus: 'failed' });
    }
  });
};

start();
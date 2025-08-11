/*
  FILE: pages/api/fetch-news.js
  -> Sostituisci completamente il file esistente con questo.
  -> Poi fai commit su GitHub: Vercel ricostruirà il progetto.

  Nota importante: la pagina front-end si aspetta una risposta JSON con
  { items: [...], fetchedAt: 'ISO timestamp' }
  quindi qui restituiamo esattamente quel formato.
*/

import Parser from 'rss-parser';
import dayjs from 'dayjs';

const CLEAN_TEXT = (s) => {
  if (!s) return '';
  return String(s)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export default async function handler(req, res) {
  try {
    const days = Number(req.query.days) || 3;

    const parser = new Parser({
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GenAI-NewsBot/1.0)' }
    });

    const feedUrls = [
      'https://gigicogo.substack.com/feed',
      'https://medium.com/feed/tag/intelligenza-artificiale',
      'https://www.ansa.it/canale_tecnologia/notizie/tecnologia_rss.xml',
      'https://medium.com/feed/tag/artificial-intelligence',
      'https://www.wired.it/feed/rss',
      'https://www.ilsole24ore.com/rss/tecnologia.xml',
      'https://www.startupitalia.eu/feed',
      'http://www.dday.it/redazione.xml',
      'https://ainews.it/feed/',
      'https://gomoot.com/category/tech/intelligenza-artificiale/feed/',
      'https://www.notizie.ai/feed/',
      'https://rivistaai.substack.com/feed'
    ];

    let allItems = [];

    for (const url of feedUrls) {
      try {
        const feed = await parser.parseURL(url);
        const source = feed && feed.title ? String(feed.title).trim() : (new URL(url)).hostname;
        const items = (feed.items || []).map(it => {
          const title = (it.title || '').trim();
          const link = it.link || it.guid || '';
          const pubDate = it.pubDate || it.isoDate || null;

          // prefer contentSnippet/summary/description/content
          let raw = it.contentSnippet || it.content || it.summary || it.description || '';
          if (!raw && it['content:encoded']) raw = it['content:encoded'];
          let summary = CLEAN_TEXT(raw);

          // If summary too short, try to expand with summary, description or title
          if ((summary || '').length < 180) {
            const extra = CLEAN_TEXT(it.summary || it.description || it.content || '');
            summary = (summary + ' ' + extra).trim();
          }

          // enforce maximum length
          if ((summary || '').length > 800) summary = summary.substring(0, 800) + '…';

          return { title, link, pubDate, summary, source };
        });

        allItems.push(...items);
      } catch (err) {
        // non blocchiamo l'intero processo per un singolo feed
        console.error('[fetch-news] Errore caricando feed:', url, err && err.message ? err.message : err);
      }
    }

    // filtra per data
    const cutoff = dayjs().subtract(days, 'day');
    let filtered = allItems.filter(it => it.pubDate && dayjs(it.pubDate).isValid() && dayjs(it.pubDate).isAfter(cutoff));

    // dedup by link or title
    const seen = new Set();
    const dedup = [];
    for (const it of filtered) {
      const key = (it.link || it.title || '').slice(0, 300);
      if (!seen.has(key)) { seen.add(key); dedup.push(it); }
    }

    // sort newest first
    dedup.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    const items = dedup.slice(0, 10).map(it => ({
      title: it.title || '(senza titolo)',
      link: it.link || '#',
      pubDate: it.pubDate || new Date().toISOString(),
      summary: it.summary || '',
      source: it.source || ''
    }));

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ items, fetchedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[fetch-news] Errore generale:', error && error.message ? error.message : error);
    return res.status(500).json({ items: [], fetchedAt: new Date().toISOString(), error: 'Errore nel recupero delle notizie' });
  }
}

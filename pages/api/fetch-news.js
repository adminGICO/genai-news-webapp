// Sostituisci **tutto** il contenuto attuale di pages/api/fetch-news.js con questo:

import Parser from 'rss-parser';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  try {
    const days = parseInt(req.query.days) || 3;
    const parser = new Parser();
    const feedUrls = [
      'https://gigicogo.substack.com/feed',
      'https://medium.com/feed/tag/artificial-intelligence',
      'https://www.wired.it/feed',
      'https://www.ilsole24ore.com/rss/tecnologia.xml',
      'https://www.startupitalia.eu/feed'
    ];

    let allItems = [];

    for (const url of feedUrls) {
      try {
        const feed = await parser.parseURL(url);
        allItems = allItems.concat(feed.items.map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          contentSnippet: item.contentSnippet || ''
        })));
      } catch (err) {
        console.error(`Errore caricando ${url}`, err);
      }
    }

    const cutoffDate = dayjs().subtract(days, 'day');
    const filtered = allItems.filter(item => dayjs(item.pubDate).isAfter(cutoffDate));

    filtered.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    res.status(200).json(filtered.slice(0, 10));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero delle notizie' });
  }
}

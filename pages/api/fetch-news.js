import Parser from 'rss-parser';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  try {
    const days = parseInt(req.query.days) || 3;
    const parser = new Parser({
      headers: { 'User-Agent': 'Mozilla/5.0' } // aiuta con alcuni feed che bloccano richieste generiche
    });
    const feedUrls = [
      'https://gigicogo.substack.com/feed',
      'https://medium.com/feed/tag/artificial-intelligence',
      'https://www.wired.it/feed/rss',
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
          pubDate: item.pubDate || item.isoDate,
          contentSnippet: item.contentSnippet || item.content || ''
        })));
      } catch (err) {
        console.error(`Errore caricando ${url}`, err.message);
      }
    }

    if (allItems.length === 0) {
      return res.status(200).json([]);
    }

    const cutoffDate = dayjs().subtract(days, 'day');
    const filtered = allItems.filter(item => {
      const date = dayjs(item.pubDate);
      return date.isValid() && date.isAfter(cutoffDate);
    });

    filtered.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    res.status(200).json(filtered.slice(0, 10));
  } catch (error) {
    console.error('Errore generale', error.message);
    res.status(500).json({ error: 'Errore nel recupero delle notizie' });
  }
}

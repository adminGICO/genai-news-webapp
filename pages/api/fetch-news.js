import Parser from 'rss-parser';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  try {
    const days = parseInt(req.query.days) || 3;
    const parser = new Parser({
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GenAI-NewsBot/1.0)' }
    });
    const feedUrls = [
      'https://www.ansa.it/canale_tecnologia/notizie/tecnologia_rss.xml',
      'https://medium.com/feed/tag/artificial-intelligence',
      'https://www.wired.it/feed/rss',
      'https://www.ilsole24ore.com/rss/tecnologia.xml',
      'https://www.startupitalia.eu/feed'
      'http://www.dday.it/redazione.xml'
      'https://ainews.it/feed/'
      'https://gomoot.com/category/tech/intelligenza-artificiale/feed/'
      'https://www.notizie.ai/feed/'
      'https://rivistaai.substack.com/feed'
    ];

    let allItems = [];

    for (const url of feedUrls) {
      try {
        const feed = await parser.parseURL(url);
        allItems = allItems.concat(feed.items.map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate || item.isoDate || null,
          contentSnippet: (item.contentSnippet || item.content || '')
            .replace(/<[^>]*>?/gm, '') // rimuove eventuali tag HTML
            .trim()
        })));
      } catch (err) {
        console.error(`Errore caricando ${url}:`, err.message);
      }
    }

    const cutoffDate = dayjs().subtract(days, 'day');
    const filtered = allItems.filter(item => {
      if (!item.pubDate) return false;
      const date = dayjs(item.pubDate);
      return date.isValid() && date.isAfter(cutoffDate);
    });

    filtered.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    res.status(200).json(filtered.slice(0, 10));
  } catch (error) {
    console.error('Errore generale:', error.message);
    res.status(500).json({ error: 'Errore nel recupero delle notizie' });
  }
}

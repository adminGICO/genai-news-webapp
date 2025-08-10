/* ------------------------- pages/api/fetch-news.js ------------------------- */

const Parser = require('rss-parser')
const dayjs = require('dayjs')
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrAfter)

const parser = new Parser({ timeout: 10000 })

const FEEDS = [
  'https://www.agendadigitale.eu/feed/',
  'https://www.wired.it/feed/',
  'https://www.ilpost.it/feed',
  'https://www.startmag.it/feed/',
  'https://www.datamanager.it/feed/',
  'https://gigicogo.substack.com/feed',
  'https://medium.com/feed/tag/ai',
]

const KEYWORDS = [
  'intelligenza artificiale', 'intelligenza-artificiale', 'ai', 'genai', 'gen ai', 'gen-ai', 'genAI', 'generative', 'generative ai', 'genereative', 'generazione', 'llm', 'chatbot', 'chat gpt', 'chatgpt', 'gpt', 'bard', 'luma', 'midjourney', 'dall', 'dall-e', 'dall e', 'stabilità', 'stability ai'
]

function matchesKeyword(text) {
  if (!text) return false
  const t = text.toLowerCase()
  return KEYWORDS.some(k => t.includes(k))
}

module.exports = async (req, res) => {
  try {
    const q = req.query.days ? parseInt(req.query.days, 10) : 3
    const since = dayjs().subtract(q, 'day')

    const promises = FEEDS.map(url => parser.parseURL(url).catch(e => {
      console.warn('feed error', url, e.message)
      return null
    }))

    const parsed = await Promise.all(promises)

    let items = []
    parsed.forEach(feed => {
      if (!feed || !feed.items) return
      feed.items.forEach(it => {
        const title = it.title || ''
        const content = it.contentSnippet || it.content || it.summary || ''
        const pubDate = it.isoDate || it.pubDate || new Date().toISOString()
        const link = it.link || it.guid || ''
        const source = feed.title || (new URL(feed.link || '').hostname)

        if (dayjs(pubDate).isBefore(since)) return

        if (matchesKeyword(title) || matchesKeyword(content) || matchesKeyword(source)) {
          const summary = (content && content.length > 200) ? content.substring(0, 800) : content || ''
          items.push({ title, summary, pubDate, link, source })
        }
      })
    })

    const seen = new Set()
    items = items.filter(it => {
      const key = (it.link || it.title).slice(0, 200)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    items = items.slice(0, 10)

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.status(200).json({ items, fetchedAt: new Date().toISOString() })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

/* --------------------------- package.json snippet --------------------------- */
// {
//   "dependencies": {
//     "rss-parser": "^3.12.0",
//     "dayjs": "^1.11.9"
//   }
// }

// GenAI-News-WebApp
// Single-file reference with frontend (React) + serverless API (Next.js / pages API style)
// Purpose: present the latest 10 generalist (non-scientific) Italian news about GenAI/AI
// - Clickable title
// - Abstract of at least 3 lines
// - Buttons: "Ultimi 3 giorni", "Ultimi 5 giorni"
// - Auto-refresh / periodic discovery

/* --------------------------- pages/index.jsx --------------------------- */
import React, { useEffect, useState, useCallback } from 'react'

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [days, setDays] = useState(3)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchNews = useCallback(async (d = days) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/fetch-news?days=${d}`)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setItems(data.items || [])
      setLastUpdated(data.fetchedAt || new Date().toISOString())
    } catch (e) {
      console.error(e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchNews(days)
    const iv = setInterval(() => fetchNews(days), 1000 * 60 * 10)
    return () => clearInterval(iv)
  }, [])

  function onDaysClick(d) {
    setDays(d)
    fetchNews(d)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Ultime notizie (GenAI / AI) — Italiano</h1>
          <p className="text-sm text-gray-600">Notizie generaliste raccolte da feed di settore, blog, Substack, Medium e testate online. Aggiornamento automatico.</p>
          <div className="mt-3 flex gap-2 items-center">
            <button onClick={() => onDaysClick(3)} className={`px-3 py-1 rounded ${days===3? 'bg-blue-600 text-white':'bg-white border'}`}>Ultimi 3 giorni</button>
            <button onClick={() => onDaysClick(5)} className={`px-3 py-1 rounded ${days===5? 'bg-blue-600 text-white':'bg-white border'}`}>Ultimi 5 giorni</button>
            <button onClick={() => fetchNews(days)} className="px-3 py-1 rounded bg-white border">Aggiorna</button>
            <div className="ml-auto text-xs text-gray-500">{lastUpdated ? `Aggiornato: ${new Date(lastUpdated).toLocaleString('it-IT')}` : ''}</div>
          </div>
        </header>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700">Errore: {error}</div>}

        {loading ? (
          <div className="p-6 text-center">Caricamento...</div>
        ) : (
          <main className="space-y-4">
            {items.length === 0 && <div className="p-6 text-gray-500">Nessuna notizia trovata per l'intervallo selezionato.</div>}
            {items.map((it, idx) => (
              <article key={idx} className="p-4 bg-white rounded shadow-sm">
                <a href={it.link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline">{it.title}</a>
                <div className="text-xs text-gray-500">{it.source} • {new Date(it.pubDate).toLocaleString('it-IT')}</div>
                <p className="mt-2 text-sm leading-6 text-gray-700" style={{minHeight: '4.5em'}}>{it.summary}</p>
              </article>
            ))}
          </main>
        )}

        <footer className="mt-8 text-xs text-gray-500">Nota: l'aggregazione avviene via feed RSS / HTML server-side. Alcune testate potrebbero non avere summary nei feed: in quel caso il server prova a estrarre un estratto dall'articolo.</footer>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react';

export default function Home() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(3);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/news?days=${days}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (!data || data.length === 0) {
        setNews([]);
      } else {
        setNews(data);
      }
    } catch (err) {
      setError(err.message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [days]);

  return (
    <div>
      <h1>Selezione notizie (GenAI)</h1>
      <p>Notizie raccolte da feed RSS filtrate per data</p>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setDays(3)}>Ultimi 3 giorni</button>
        <button onClick={() => setDays(5)}>Ultimi 5 giorni</button>
      </div>
      {loading && <p>Caricamento...</p>}
      {error && <p style={{ color: 'red' }}>Errore nel recupero delle notizie: {error}</p>}
      {!loading && !error && news.length === 0 && <p>Nessuna notizia trovata.</p>}
      {!loading && !error && news.length > 0 && (
        <ul>
          {news.map((n, i) => (
            <li key={i}>{n.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

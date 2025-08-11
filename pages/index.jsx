import { useState, useEffect } from 'react';

export default function Home() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);

  const fetchNews = async (selectedDays) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/fetch-news?days=${selectedDays}`);
      if (!res.ok) throw new Error(`Errore HTTP: ${res.status}`);
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error(err);
      setError('Errore nel recupero delle notizie');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(days);
  }, [days]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2b3a67' }}>Selezione notizie (GenAI / AI) offerte da IASEMPLICE</h1>
        <p style={{ fontSize: '1.2em', color: '#555' }}>
          Notizie raccolte da feed di settore, blog, e testate online. <br />
          Aggiornamento automatico.
        </p>
      </header>

      <section style={{ backgroundColor: '#fff4db', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#7c4d00' }}>Filtri rapidi</h2>
        <div style={{ marginBottom: '10px' }}>
          <button
            style={{ padding: '10px 15px', marginRight: '10px', backgroundColor: days === 3 ? '#f9d56e' : '#fff', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}
            onClick={() => setDays(3)}
          >
            Ultimi 3 giorni
          </button>
          <button
            style={{ padding: '10px 15px', backgroundColor: days === 5 ? '#f9d56e' : '#fff', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}
            onClick={() => setDays(5)}
          >
            Ultimi 5 giorni
          </button>
        </div>
        <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px', color: '#888', fontSize: '0.9em' }}>
          Aggiornato: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </section>

      <section style={{ backgroundColor: '#e7f0fd', padding: '15px', borderRadius: '8px' }}>
        <h2 style={{ color: '#1e3d59' }}>Ultime 10 notizie</h2>
        {loading && <p>Caricamento in corso...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && news.length === 0 && !error && <p>Nessuna notizia trovata.</p>}
        <ul>
          {news.map((item, index) => (
            <li key={index} style={{ marginBottom: '15px' }}>
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', color: '#2b3a67' }}>{item.title}</a>
              <br />
              <small style={{ color: '#555' }}>{new Date(item.pubDate).toLocaleString()}</small>
              <p style={{ marginTop: '5px' }}>{item.contentSnippet}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer style={{ textAlign: 'center', marginTop: '30px', color: '#888', fontSize: '0.9em' }}>
        © {new Date().getFullYear()} IASEMPLICE - Tutti i diritti riservati
      </footer>
    </div>
  );
}


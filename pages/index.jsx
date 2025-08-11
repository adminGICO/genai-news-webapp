import { useState, useEffect } from 'react';

export default function Home() {
  const [news, setNews] = useState([]);
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/news?days=${days}`);
        if (!res.ok) throw new Error('Errore nel recupero delle notizie');
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [days]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2b3a67' }}>Selezione notizie (GenAI / AI) offerte da IASEMPLICE</h1>
        <p style={{ fontSize: '1.2em', color: '#555' }}>
          Notizie raccolte da feed di settore, blog, e testate online.<br />
          Aggiornamento automatico.
        </p>
      </header>

      <section style={{ backgroundColor: '#fef7e1', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#7c4d00' }}>Filtri rapidi</h2>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={() => setDays(3)} style={{ padding: '10px 15px', marginRight: '10px', backgroundColor: '#f9d56e', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Ultimi 3 giorni</button>
          <button onClick={() => setDays(5)} style={{ padding: '10px 15px', backgroundColor: '#f9d56e', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Ultimi 5 giorni</button>
        </div>
        <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px', color: '#888', fontSize: '0.9em' }}>
          Aggiornato: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </section>

      <section style={{ backgroundColor: '#e7f0fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e3d59' }}>Ultime 10 notizie</h2>
        {loading && <p>Caricamento in corso...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && news.length === 0 && <p>Nessuna notizia trovata.</p>}
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {news.map((item, index) => (
            <li key={index} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#2b3a67', textDecoration: 'none' }}>{item.title}</a>
              <p style={{ marginTop: '5px', color: '#333' }}>{item.contentSnippet}</p>
              <small style={{ color: '#888' }}>{new Date(item.pubDate).toLocaleDateString()} {new Date(item.pubDate).toLocaleTimeString()}</small>
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

import { useEffect, useState } from 'react';

export default function Home() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');
  const [days, setDays] = useState(3);

  useEffect(() => {
    fetch(`/api/fetch-news?days=${days}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNews(data);
          setError('');
        } else {
          throw new Error('Formato dati non valido');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Errore nel recupero delle notizie');
        setNews([]);
      });
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

      <section style={{ backgroundColor: '#fff6dc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#7c4d00' }}>Filtri rapidi</h2>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={() => setDays(3)} style={{ padding: '10px 15px', marginRight: '10px', backgroundColor: days === 3 ? '#f9d56e' : '#fff', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>Ultimi 3 giorni</button>
          <button onClick={() => setDays(5)} style={{ padding: '10px 15px', backgroundColor: days === 5 ? '#f9d56e' : '#fff', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>Ultimi 5 giorni</button>
        </div>
        <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px', color: '#888', fontSize: '0.9em' }}>
          Aggiornato: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </section>

      <section style={{ backgroundColor: '#e7f0fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e3d59' }}>Ultime 10 notizie</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {news.length === 0 && !error && <p>Nessuna notizia trovata.</p>}
        <ul>
          {news.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#2b3a67', fontWeight: 'bold' }}>{item.title}</a>
              <div style={{ fontSize: '0.9em', color: '#555' }}>{new Date(item.pubDate).toLocaleDateString()} - {item.contentSnippet}</div>
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

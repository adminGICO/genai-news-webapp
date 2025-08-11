export default function Home() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2b3a67' }}>Selezione notizie (GenAI / AI) offerte da IASEMPLICE</h1>
        <p style={{ fontSize: '1.2em', color: '#555' }}>
          Notizie raccolte da feed di settore, blog, e testate online. <br />
          Aggiornamento automatico.
        </p>
      </header>

      <section style={{ backgroundColor: '#e7f0fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#1e3d59' }}>Ultime 10 notizie</h2>
        {/* Qui va il mapping delle news */}
      </section>

      <section style={{ backgroundColor: '#fef7e1', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#7c4d00' }}>Filtri rapidi</h2>
        <div style={{ marginBottom: '10px' }}>
          <button style={{ padding: '10px 15px', marginRight: '10px', backgroundColor: '#f9d56e', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Ultimi 3 giorni</button>
          <button style={{ padding: '10px 15px', backgroundColor: '#f9d56e', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Ultimi 5 giorni</button>
        </div>
        <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px', color: '#888', fontSize: '0.9em' }}>
          Aggiornato: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </section>

      <footer style={{ textAlign: 'center', marginTop: '30px', color: '#888', fontSize: '0.9em' }}>
        © {new Date().getFullYear()} IASEMPLICE - Tutti i diritti riservati
      </footer>
    </div>
  );
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="app">
      <section className="hero">
        <div className="brand-mark">S</div>
        <p className="eyebrow">SEUTON</p>
        <h1>Sua música.<br /><span>Seu tom.</span></h1>
        <p className="subtitle">Seu jeito de tocar.</p>
        <div className="search">🔎 <span>Buscar música, artista ou cifra...</span></div>
        <div className="quick-actions">
          <button>🎵 Explorar cifras</button>
          <button>★ Favoritos</button>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);

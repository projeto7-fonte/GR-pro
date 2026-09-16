import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { songs, Song } from './data';
import './styles.css';

const order = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const categories = ['Todos', 'MPB', 'Rock', 'Pop'];

type View = 'explore' | 'favorites';

function transposeChord(chord: string, steps: number) {
  const match = chord.match(/^([A-G](#|b)?)(.*)$/);
  if (!match) return chord;

  const normalized = match[1]
    .replace('Db', 'C#')
    .replace('Eb', 'D#')
    .replace('Gb', 'F#')
    .replace('Ab', 'G#')
    .replace('Bb', 'A#');
  const index = order.indexOf(normalized);
  return index < 0 ? chord : order[(index + steps + 12) % 12] + match[3];
}

function transposeText(text: string, steps: number) {
  return text.replace(/\[([A-G](?:#|b)?)([^\]]*)\]/g, (_, chord, rest) =>
    `[${transposeChord(chord, steps)}${rest}]`,
  );
}

function readFavorites() {
  try {
    const saved = localStorage.getItem('seuton:favorites');
    const parsed: unknown = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) && parsed.every(value => typeof value === 'number') ? parsed : [];
  } catch {
    return [];
  }
}

function App() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Song | null>(null);
  const [favorites, setFavorites] = useState<number[]>(readFavorites);
  const [steps, setSteps] = useState(0);
  const [category, setCategory] = useState('Todos');
  const [view, setView] = useState<View>('explore');

  useEffect(() => {
    localStorage.setItem('seuton:favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(current => current.includes(id)
      ? current.filter(value => value !== id)
      : [...current, id]);
  };

  const filtered = useMemo(() => songs.filter(song => {
    const q = query.trim().toLowerCase();
    const matchesSearch = !q || `${song.title} ${song.artist} ${song.category}`.toLowerCase().includes(q);
    const matchesCategory = category === 'Todos' || song.category === category;
    const matchesView = view === 'explore' || favorites.includes(song.id);
    return matchesSearch && matchesCategory && matchesView;
  }), [query, category, view, favorites]);

  if (selected) {
    const displayedKey = transposeChord(selected.key, steps);
    return (
      <main className="app">
        <section className="song-page">
          <button className="back" onClick={() => { setSelected(null); setSteps(0); }}>← Voltar</button>
          <header className="song-header">
            <div>
              <p className="eyebrow">SEUTON · {selected.category.toUpperCase()}</p>
              <h1>{selected.title}</h1>
              <p>{selected.artist} · Tom {displayedKey}</p>
            </div>
            <button
              className="favorite"
              aria-label={favorites.includes(selected.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              onClick={() => toggleFavorite(selected.id)}
            >
              {favorites.includes(selected.id) ? '★' : '☆'}
            </button>
          </header>

          <div className="toolbar" aria-label="Controles de tom">
            <button onClick={() => setSteps(value => value - 1)}>− Tom</button>
            <strong>Tom: {displayedKey}</strong>
            <button onClick={() => setSteps(value => value + 1)}>+ Tom</button>
          </div>

          <article className="lyrics" aria-label={`Cifra de ${selected.title}`}>
            {transposeText(selected.lyrics, steps).split('\n').map((line, index) => <p key={index}>{line}</p>)}
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="home">
        <nav>
          <button className="brand" onClick={() => { setView('explore'); setQuery(''); }} aria-label="Ir para início">
            <span className="mini-logo">S</span>
            <strong>SEUTON</strong>
          </button>
          <span>Sua música. Seu tom.</span>
          <button className="nav-favorites" onClick={() => setView(view === 'favorites' ? 'explore' : 'favorites')}>
            {view === 'favorites' ? 'Explorar' : `★ ${favorites.length}`}
          </button>
        </nav>

        <div className="hero">
          <p className="eyebrow">SUA MÚSICA · SEU TOM</p>
          <h1>Encontre.<br /><span>Toque.</span></h1>
          <p>Suas cifras sempre no tom certo para você.</p>
          <input
            aria-label="Buscar música, artista ou cifra"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="⌕  Buscar música, artista ou cifra..."
          />
        </div>

        <div className="filters" aria-label="Filtrar por categoria">
          {categories.map(item => (
            <button className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>
              {item}
            </button>
          ))}
        </div>

        <div className="catalog">
          <div className="section-title">
            <h2>{view === 'favorites' ? 'Favoritos' : query ? 'Resultados' : 'Explore'}</h2>
            <span>{filtered.length} {filtered.length === 1 ? 'música' : 'músicas'}</span>
          </div>

          {filtered.length > 0 ? filtered.map(song => (
            <button className="song-card" key={song.id} onClick={() => setSelected(song)}>
              <div className="cover">♫</div>
              <div className="song-info"><strong>{song.title}</strong><small>{song.artist}</small></div>
              <b>{song.key}</b>
              <span>›</span>
            </button>
          )) : (
            <div className="empty-state">
              <div>♫</div>
              <strong>Nenhuma música encontrada</strong>
              <p>{view === 'favorites' ? 'Adicione músicas aos favoritos para encontrá-las aqui.' : 'Tente outro termo ou categoria.'}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

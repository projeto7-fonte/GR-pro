import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { songs, Song } from './data';
import './styles.css';

const order = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
function transposeChord(chord: string, steps: number) {
  const match = chord.match(/^([A-G](#|b)?)(.*)$/);
  if (!match) return chord;
  const normalized = match[1].replace('Db','C#').replace('Eb','D#').replace('Gb','F#').replace('Ab','G#').replace('Bb','A#');
  const index = order.indexOf(normalized);
  return index < 0 ? chord : order[(index + steps + 12) % 12] + match[3];
}
function transposeText(text: string, steps: number) {
  return text.replace(/\[([A-G](?:#|b)?)([^\]]*)\]/g, (_, chord, rest) => `[${transposeChord(chord, steps)}${rest}]`);
}

function App() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Song | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [steps, setSteps] = useState(0);
  const [category, setCategory] = useState('Todos');
  const filtered = useMemo(() => songs.filter(song => {
    const q = query.toLowerCase();
    return (!q || `${song.title} ${song.artist} ${song.category}`.toLowerCase().includes(q)) && (category === 'Todos' || song.category === category);
  }), [query, category]);

  if (selected) {
    const displayedKey = transposeChord(selected.key, steps);
    return <main className="app"><section className="song-page">
      <button className="back" onClick={() => { setSelected(null); setSteps(0); }}>← Voltar</button>
      <header className="song-header"><div><p className="eyebrow">SEUTON</p><h1>{selected.title}</h1><p>{selected.artist} · Tom {displayedKey}</p></div>
      <button className="favorite" onClick={() => setFavorites(f => f.includes(selected.id) ? f.filter(x => x !== selected.id) : [...f, selected.id])}>{favorites.includes(selected.id) ? '★' : '☆'}</button></header>
      <div className="toolbar"><button onClick={() => setSteps(s => s - 1)}>− Tom</button><strong>Tom: {displayedKey}</strong><button onClick={() => setSteps(s => s + 1)}>+ Tom</button></div>
      <article className="lyrics">{transposeText(selected.lyrics, steps).split('\n').map((line, i) => <p key={i}>{line}</p>)}</article>
    </section></main>;
  }

  return <main className="app"><section className="home">
    <nav><div className="mini-logo">S</div><strong>SEUTON</strong><span>Sua música. Seu tom.</span></nav>
    <div className="hero"><p className="eyebrow">SUA MÚSICA · SEU TOM</p><h1>Encontre.<br /><span>Toque.</span></h1><p>Suas cifras sempre no tom certo para você.</p>
      <input aria-label="Buscar" value={query} onChange={e => setQuery(e.target.value)} placeholder="⌕  Buscar música, artista ou cifra..." /></div>
    <div className="filters">{['Todos','MPB','Rock','Pop'].map(c => <button className={category === c ? 'active' : ''} onClick={() => setCategory(c)} key={c}>{c}</button>)}</div>
    <div className="catalog"><div className="section-title"><h2>{query ? 'Resultados' : 'Explore'}</h2><span>{filtered.length} músicas</span></div>
      {filtered.map(song => <button className="song-card" key={song.id} onClick={() => setSelected(song)}><div className="cover">♫</div><div><strong>{song.title}</strong><small>{song.artist}</small></div><b>{song.key}</b><span>›</span></button>)}
    </div>
  </section></main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

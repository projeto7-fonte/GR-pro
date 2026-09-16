export type Song = {
  id: number;
  title: string;
  artist: string;
  key: string;
  category: string;
  chords: string;
  lyrics: string;
};

export const songs: Song[] = [
  { id: 1, title: 'Oceano', artist: 'Djavan', key: 'C', category: 'MPB', chords: 'C  Am  F  G', lyrics: '[C]Assim que o dia amanheceu\n[Am]Lá no mar alto da paixão\n[F]Dava pra ver o tempo ruir\n[G]Cadê você?' },
  { id: 2, title: 'Tempo Perdido', artist: 'Legião Urbana', key: 'G', category: 'Rock', chords: 'G  D  Em  C', lyrics: '[G]Todos os dias quando acordo\n[D]Não tenho mais o tempo que passou\n[Em]Mas tenho muito tempo\n[C]Temos todo o tempo do mundo' },
  { id: 3, title: 'Anna Júlia', artist: 'Los Hermanos', key: 'E', category: 'Rock', chords: 'E  A  B', lyrics: '[E]Quem te vê passar assim por mim\n[A]Não sabe o que é sofrer\n[B]Ter que passar por isso assim\n[E]Sem você perceber' },
  { id: 4, title: 'Trem-Bala', artist: 'Ana Vilela', key: 'C', category: 'Pop', chords: 'C  G  Am  F', lyrics: '[C]Não é sobre ter todas as pessoas do mundo pra si\n[G]É sobre saber que em algum lugar alguém gosta de você' }
];

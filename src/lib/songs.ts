import { supabase } from '../supabase';

export type RemoteSong = {
  id: string;
  title: string;
  artist: string;
  key: string;
  category: string;
  chords: string;
  lyrics: string;
};

export async function fetchSongs(category = 'Todos', query = '') {
  let request = supabase.from('songs').select('id,title,artist,key,category,chords,lyrics').order('title');
  if (category !== 'Todos') request = request.eq('category', category);
  if (query.trim()) {
    const q = query.trim().replace(/[,%]/g, '');
    request = request.or(`title.ilike.%${q}%,artist.ilike.%${q}%,category.ilike.%${q}%`);
  }
  const { data, error } = await request;
  if (error) throw error;
  return (data ?? []) as RemoteSong[];
}

export async function getFavoriteSongIds() {
  const { data, error } = await supabase.from('favorites').select('song_id');
  if (error) throw error;
  return (data ?? []).map(row => row.song_id as string);
}

export async function setFavorite(songId: string, favorite: boolean) {
  if (favorite) {
    const { error } = await supabase.from('favorites').insert({ song_id: songId });
    if (error) throw error;
  } else {
    const { error } = await supabase.from('favorites').delete().eq('song_id', songId);
    if (error) throw error;
  }
}

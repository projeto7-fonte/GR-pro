create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  key text not null,
  category text not null,
  chords text not null,
  lyrics text not null,
  created_at timestamptz not null default now()
);

create index if not exists songs_title_lower_idx on public.songs (lower(title));
create index if not exists songs_artist_lower_idx on public.songs (lower(artist));
create index if not exists songs_category_idx on public.songs (category);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, song_id)
);

alter table public.songs enable row level security;
alter table public.favorites enable row level security;

grant select on public.songs to anon, authenticated;
grant select, insert, delete on public.favorites to authenticated;

drop policy if exists "songs are publicly readable" on public.songs;
create policy "songs are publicly readable" on public.songs
  for select to anon, authenticated using (true);

drop policy if exists "users read own favorites" on public.favorites;
create policy "users read own favorites" on public.favorites
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "users insert own favorites" on public.favorites;
create policy "users insert own favorites" on public.favorites
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "users delete own favorites" on public.favorites;
create policy "users delete own favorites" on public.favorites
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Test de Perfil Táctico — APEX SYNDICATE
-- Ejecutar completo en el SQL Editor de Supabase (proyecto nuevo, capa gratuita).

create table pilotos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  org text not null default 'APEX SYNDICATE',
  fecha_alta timestamptz not null default now()
);

-- Evita duplicados por mayúsculas/minúsculas ("Guty" vs "guty").
create unique index pilotos_nombre_unique_ci on pilotos (lower(nombre));

create table resultados_test (
  id uuid primary key default gen_random_uuid(),
  piloto_id uuid not null references pilotos(id) on delete cascade,
  fecha timestamptz not null default now(),
  puntuacion_aire numeric not null,
  puntuacion_agua numeric not null,
  puntuacion_tierra numeric not null,
  puntuacion_fuego numeric not null,
  respuesta_dudosa boolean not null default false,
  respuestas_crudas jsonb not null
);

create index resultados_test_piloto_id_idx on resultados_test (piloto_id);

-- RLS: sitio estático sin login (brief-proyecto.md), así que el rol anon
-- necesita poder leer y crear directamente. No se permite update/delete
-- desde el cliente: nadie debe poder alterar un resultado ya guardado.
alter table pilotos enable row level security;
alter table resultados_test enable row level security;

create policy "pilotos: lectura pública" on pilotos
  for select using (true);

create policy "pilotos: alta pública" on pilotos
  for insert with check (true);

create policy "resultados: lectura pública" on resultados_test
  for select using (true);

create policy "resultados: alta pública" on resultados_test
  for insert with check (true);

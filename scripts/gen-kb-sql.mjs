// Gera supabase/mentor_kb.sql a partir de src/lib/mentorKb.js (mantém em sincronia).
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { MENTOR_KB } from "../src/lib/mentorKb.js";

const here = dirname(fileURLToPath(import.meta.url));
const q = (s) => "'" + String(s ?? "").replace(/'/g, "''") + "'";
const arr = (a) => "array[" + a.map(q).join(",") + "]::text[]";

const rows = MENTOR_KB.map(
  (k) =>
    `  (${q(k.slug)}, ${q(k.categoria)}, ${k.prioridade || 0}, ${arr(k.palavras_chave)}, ${q(k.pergunta)}, ${q(k.resposta)})`,
).join(",\n");

const sql = `-- ============================================================================
-- Base de conhecimento do Mentor IA (respostas automáticas). Gerado de
-- src/lib/mentorKb.js. Cole no SQL Editor e rode. Idempotente.
-- ============================================================================

create table if not exists public.mentor_kb (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  categoria      text,
  prioridade     int not null default 0,
  palavras_chave text[] not null default '{}',
  pergunta       text,
  resposta       text not null,
  created_at     timestamptz not null default now()
);

alter table public.mentor_kb enable row level security;
drop policy if exists "mentor_kb read" on public.mentor_kb;
create policy "mentor_kb read" on public.mentor_kb for select to authenticated using (true);

insert into public.mentor_kb (slug, categoria, prioridade, palavras_chave, pergunta, resposta) values
${rows}
on conflict (slug) do update set
  categoria = excluded.categoria,
  prioridade = excluded.prioridade,
  palavras_chave = excluded.palavras_chave,
  pergunta = excluded.pergunta,
  resposta = excluded.resposta;
`;

writeFileSync(join(here, "..", "supabase", "mentor_kb.sql"), sql, "utf8");
console.log(`OK: ${MENTOR_KB.length} respostas -> supabase/mentor_kb.sql`);

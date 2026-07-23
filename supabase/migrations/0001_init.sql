-- ============================================================================
-- Patrimônio 10X — Esquema inicial (Fase 0: fundação)
-- Postgres / Supabase. Segue a seção 4 do documento de arquitetura.
-- Todas as tabelas de usuário têm id uuid, created_at, updated_at e RLS por user_id.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: updated_at automático
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ===========================================================================
-- ENUMS
-- ===========================================================================
do $$ begin
  create type risk_profile as enum ('conservador','moderado','arrojado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type knowledge_level as enum ('iniciante','intermediario','avancado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type goal_status as enum ('bloqueada','ativa','concluida');
exception when duplicate_object then null; end $$;

do $$ begin
  create type plan_status as enum ('pendente','em_andamento','concluido');
exception when duplicate_object then null; end $$;

do $$ begin
  create type mood as enum ('confiante','preocupado','ansioso','motivado','feliz','desanimado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type message_role as enum ('user','assistant','system');
exception when duplicate_object then null; end $$;

-- ===========================================================================
-- PROFILES (1:1 com auth.users)
-- ===========================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nome        text default 'Você',
  pais        text default 'BR',
  idioma      text default 'pt-BR',
  moeda       text default 'BRL',
  tema        text default 'light',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ===========================================================================
-- FINANCIAL_PROFILES
-- ===========================================================================
create table if not exists public.financial_profiles (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  idade                int,
  renda_mensal         numeric(14,2),
  despesas_mensais     numeric(14,2),
  valor_disponivel     numeric(14,2),
  perfil_risco         risk_profile default 'moderado',
  conhecimento         knowledge_level default 'iniciante',
  instituicao          text default 'Nubank',
  aporte_padrao        numeric(14,2) default 2000,
  objetivos            text,
  prazo_independencia  int,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (user_id)
);

-- ===========================================================================
-- GOALS — a Escada do Patrimônio
-- ===========================================================================
create table if not exists public.goals (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  ordem               int not null,
  titulo              text not null,
  valor_alvo          numeric(14,2) not null,
  valor_atual         numeric(14,2) not null default 0,
  status              goal_status not null default 'bloqueada',
  previsao_conclusao  date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, ordem)
);

-- ===========================================================================
-- PORTFOLIO_HOLDINGS
-- ===========================================================================
create table if not exists public.portfolio_holdings (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  classe_ativo    text not null,
  nome            text,
  quantidade      numeric(18,6) default 0,
  valor_investido numeric(14,2) default 0,
  valor_atual     numeric(14,2) default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ===========================================================================
-- CONTRIBUTIONS (aportes)
-- ===========================================================================
create table if not exists public.contributions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  mes_ref     text not null,               -- 'YYYY-MM'
  valor       numeric(14,2) not null,
  data        date not null default current_date,
  origem      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ===========================================================================
-- MONTHLY_PLANS + PLAN_ITEMS
-- ===========================================================================
create table if not exists public.monthly_plans (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  mes_ref           text not null,          -- 'YYYY-MM'
  salario_recebido  numeric(14,2),
  valor_a_investir  numeric(14,2),
  status            plan_status not null default 'pendente',
  gerado_por_ia     boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (user_id, mes_ref)
);

create table if not exists public.plan_items (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  plano_id     uuid not null references public.monthly_plans(id) on delete cascade,
  classe_ativo text not null,
  descricao    text,
  valor        numeric(14,2) not null default 0,
  concluido    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ===========================================================================
-- TRANSACTIONS (extrato bruto)
-- ===========================================================================
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  data        date not null default current_date,
  descricao   text,
  valor       numeric(14,2) not null,
  categoria   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ===========================================================================
-- MODULES / LESSONS (catálogo público, leitura para autenticados)
-- ===========================================================================
create table if not exists public.modules (
  id          uuid primary key default gen_random_uuid(),
  ordem       int not null unique,
  titulo      text not null,
  icone       text,
  descricao   text,
  created_at  timestamptz not null default now()
);

create table if not exists public.lessons (
  id            uuid primary key default gen_random_uuid(),
  module_id     uuid not null references public.modules(id) on delete cascade,
  ordem         int not null,
  titulo        text not null,
  conteudo      text,
  duracao_seg   int default 180,
  quiz          jsonb,
  created_at    timestamptz not null default now(),
  unique (module_id, ordem)
);

-- ===========================================================================
-- LESSON_PROGRESS
-- ===========================================================================
create table if not exists public.lesson_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  lesson_id   uuid not null references public.lessons(id) on delete cascade,
  concluida   boolean not null default false,
  nota_quiz   int,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- ===========================================================================
-- MENTOR (chat)
-- ===========================================================================
create table if not exists public.mentor_conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  titulo      text default 'Conversa',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.mentor_messages (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  conversation_id  uuid not null references public.mentor_conversations(id) on delete cascade,
  role             message_role not null,
  conteudo         text not null,
  metadados        jsonb,
  created_at       timestamptz not null default now()
);

-- ===========================================================================
-- HABITS / HABIT_LOGS
-- ===========================================================================
create table if not exists public.habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  titulo      text not null,
  ativo       boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  habit_id    uuid not null references public.habits(id) on delete cascade,
  data        date not null default current_date,
  feito       boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (habit_id, data)
);

-- ===========================================================================
-- JOURNAL_ENTRIES
-- ===========================================================================
create table if not exists public.journal_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  mes_ref     text not null,
  humor       mood not null,
  nota        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ===========================================================================
-- ACHIEVEMENTS / USER_ACHIEVEMENTS (catálogo + desbloqueios)
-- ===========================================================================
create table if not exists public.achievements (
  id          uuid primary key default gen_random_uuid(),
  codigo      text not null unique,
  titulo      text not null,
  descricao   text,
  icone       text,
  xp          int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.user_achievements (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  achievement_id  uuid not null references public.achievements(id) on delete cascade,
  desbloqueada_em timestamptz not null default now(),
  unique (user_id, achievement_id)
);

-- ===========================================================================
-- XP_EVENTS (fonte única da verdade do XP)
-- ===========================================================================
create table if not exists public.xp_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  origem      text not null,
  pontos      int not null,
  created_at  timestamptz not null default now()
);

-- ===========================================================================
-- NOTIFICATIONS
-- ===========================================================================
create table if not exists public.notifications (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  tipo           text not null,
  payload        jsonb,
  agendada_para  timestamptz,
  enviada        boolean not null default false,
  created_at     timestamptz not null default now()
);

-- ===========================================================================
-- Triggers updated_at
-- ===========================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','financial_profiles','goals','portfolio_holdings','contributions',
    'monthly_plans','plan_items','transactions','lesson_progress',
    'mentor_conversations','habits','journal_entries'
  ]
  loop
    execute format('drop trigger if exists trg_%1$s_updated on public.%1$s;', t);
    execute format(
      'create trigger trg_%1$s_updated before update on public.%1$s
       for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- ===========================================================================
-- Bootstrap do usuário: cria profile, financial_profile e semeia as metas
-- ===========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ladder numeric[] := array[12000,25000,50000,100000,250000,500000,1000000,2000000,5000000,10000000];
  titulos text[] := array[
    'Reserva de emergência','Primeiro degrau','Ganhando ritmo','Seis dígitos',
    'Um quarto de milhão','Meio milhão','O primeiro milhão','Dois milhões',
    'Cinco milhões','Independência 10X'];
  i int;
begin
  insert into public.profiles (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', 'Você'))
  on conflict (id) do nothing;

  insert into public.financial_profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  for i in 1 .. array_length(ladder, 1) loop
    insert into public.goals (user_id, ordem, titulo, valor_alvo, status)
    values (new.id, i, titulos[i], ladder[i], case when i = 1 then 'ativa' else 'bloqueada' end)
    on conflict (user_id, ordem) do nothing;
  end loop;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===========================================================================
-- RLS
-- ===========================================================================
-- Tabelas de usuário: dono vê/edita só o próprio (user_id = auth.uid()).
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','financial_profiles','goals','portfolio_holdings','contributions',
    'monthly_plans','plan_items','transactions','lesson_progress',
    'mentor_conversations','mentor_messages','habits','habit_logs',
    'journal_entries','user_achievements','xp_events','notifications'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
  end loop;
end $$;

-- profiles usa a coluna id (= auth.uid()); as demais usam user_id.
drop policy if exists "profiles owner" on public.profiles;
create policy "profiles owner" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array[
    'financial_profiles','goals','portfolio_holdings','contributions',
    'monthly_plans','plan_items','transactions','lesson_progress',
    'mentor_conversations','mentor_messages','habits','habit_logs',
    'journal_entries','user_achievements','xp_events','notifications'
  ]
  loop
    execute format('drop policy if exists "%1$s owner" on public.%1$s;', t);
    execute format(
      'create policy "%1$s owner" on public.%1$s
       for all using (user_id = auth.uid()) with check (user_id = auth.uid());', t);
  end loop;
end $$;

-- Catálogos públicos: leitura para qualquer usuário autenticado.
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.achievements enable row level security;

drop policy if exists "modules read" on public.modules;
create policy "modules read" on public.modules for select to authenticated using (true);
drop policy if exists "lessons read" on public.lessons;
create policy "lessons read" on public.lessons for select to authenticated using (true);
drop policy if exists "achievements read" on public.achievements;
create policy "achievements read" on public.achievements for select to authenticated using (true);

-- ===========================================================================
-- Índices úteis
-- ===========================================================================
create index if not exists idx_goals_user on public.goals(user_id);
create index if not exists idx_contrib_user_mes on public.contributions(user_id, mes_ref);
create index if not exists idx_plan_user_mes on public.monthly_plans(user_id, mes_ref);
create index if not exists idx_planitems_plan on public.plan_items(plano_id);
create index if not exists idx_msgs_conv on public.mentor_messages(conversation_id, created_at);
create index if not exists idx_xp_user on public.xp_events(user_id);

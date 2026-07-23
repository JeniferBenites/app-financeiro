-- Schema completo do Patrimônio 10X (tabelas + catálogo + Mentor + login por CPF).
-- Cole tudo no SQL Editor e rode uma vez.

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
    values (new.id, i, titulos[i], ladder[i],
            (case when i = 1 then 'ativa' else 'bloqueada' end)::goal_status)
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


-- ============================================================================
-- Seed dos catálogos públicos: módulos/aulas (área Aprender) e conquistas.
-- Idempotente (on conflict do nothing / update).
-- ============================================================================

-- ---- Módulos (18 módulos do protótipo; o doc cita ~20) --------------------
insert into public.modules (ordem, titulo, icone, descricao) values
  (1,  'Mentalidade Financeira',      '🧠', 'Como pensar como um investidor de longo prazo.'),
  (2,  'Organização Financeira',      '📊', 'Enxergar para onde vai o seu dinheiro.'),
  (3,  'Como funciona o dinheiro',    '💵', 'O básico que ninguém te ensinou.'),
  (4,  'Inflação',                    '🎈', 'Por que o dinheiro parado encolhe.'),
  (5,  'CDI e Selic',                 '📈', 'As réguas da renda fixa.'),
  (6,  'Tesouro Direto',              '🏛️', 'Emprestar para o governo com segurança.'),
  (7,  'Renda Fixa',                  '🔒', 'Previsibilidade e segurança.'),
  (8,  'Renda Variável',             '🎢', 'Mais risco, mais potencial no longo prazo.'),
  (9,  'ETF',                         '🧺', 'Uma cesta pronta de investimentos.'),
  (10, 'Ações',                       '🏢', 'Ser sócio das empresas.'),
  (11, 'Fundos Imobiliários',         '🏠', 'Renda de aluguéis sem comprar imóvel.'),
  (12, 'Diversificação',              '🍱', 'Não colocar os ovos na mesma cesta.'),
  (13, 'Juros Compostos',             '❄️', 'O efeito bola de neve.'),
  (14, 'Gestão de Risco',             '🛡️', 'Proteger o que você construiu.'),
  (15, 'Independência Financeira',    '🕊️', 'Quando o dinheiro trabalha por você.'),
  (16, 'Psicologia do Investidor',    '🧭', 'Dominar as próprias emoções.'),
  (17, 'Erros mais comuns',           '⚠️', 'O que evitar na jornada.'),
  (18, 'Aposentadoria',               '🌅', 'Planejar o longo prazo com calma.')
on conflict (ordem) do update
  set titulo = excluded.titulo, icone = excluded.icone, descricao = excluded.descricao;

-- ---- Uma aula introdutória por módulo -------------------------------------
insert into public.lessons (module_id, ordem, titulo, conteudo, duracao_seg)
select m.id, 1, 'Introdução: ' || m.titulo,
       'Aula introdutória do módulo "' || m.titulo || '", explicada como para uma criança de 12 anos.',
       180
from public.modules m
on conflict (module_id, ordem) do nothing;

-- ---- Conquistas -----------------------------------------------------------
insert into public.achievements (codigo, titulo, descricao, icone, xp) values
  ('first_plan',    'Primeiro plano',       'Você gerou seu primeiro plano de investimentos.', '🗺️', 100),
  ('first_contrib', 'Primeiro aporte',      'Você concluiu seu primeiro aporte do mês.',        '💰', 120),
  ('streak_3',      'Três meses seguidos',  'Manteve a sequência por 3 meses.',                 '🔥', 200),
  ('reserve_done',  'Reserva conquistada',  'Você completou sua reserva de emergência.',        '🛡️', 300),
  ('first_lesson',  'Primeiro aprendizado', 'Concluiu sua primeira aula.',                      '🎓', 60),
  ('first_million', 'O primeiro milhão',    'Alcançou R$ 1.000.000 de patrimônio.',             '👑', 1000)
on conflict (codigo) do update
  set titulo = excluded.titulo, descricao = excluded.descricao, icone = excluded.icone, xp = excluded.xp;


-- ============================================================================
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
  ('o-que-e-investir', 'conceito', 1, array['investir','investimento','começar a investir','o que e investir']::text[], 'O que é investir?', 'Investir é colocar seu dinheiro para trabalhar por você, em vez de deixá-lo parado perdendo valor para a inflação. Você aplica um pouco todo mês, com paciência, e os juros vão se somando ao longo dos anos. O segredo não é acertar o melhor investimento, é ser constante por muito tempo.'),
  ('reserva-emergencia', 'conceito', 3, array['reserva','emergencia','reserva de emergência','colchão','imprevisto']::text[], 'O que é reserva de emergência?', 'É o seu ''colchão'' de segurança: um dinheiro guardado para imprevistos (perder o emprego, um conserto urgente). O ideal é ter de 3 a 6 meses dos seus gastos, num lugar seguro e fácil de sacar, como Tesouro Selic ou CDB de liquidez diária. É sempre o primeiro passo, antes de qualquer investimento de risco.'),
  ('inflacao', 'conceito', 2, array['inflacao','inflação','preços subindo','dinheiro encolhe','poder de compra']::text[], 'O que é inflação?', 'Inflação é o dinheiro perdendo poder de compra: o pão que custava R$5 passa a custar R$6. Por isso guardar dinheiro parado ''encolhe'' com o tempo. No Brasil, a meta de inflação é de 3% ao ano (com margem para mais ou menos). Investir serve, antes de tudo, para correr mais rápido que a inflação.'),
  ('selic-2026', 'cenario2026', 2, array['selic','taxa de juros','juros altos','copom','banco central']::text[], 'O que é a Selic e como está em 2026?', 'A Selic é a taxa básica de juros do país, definida pelo Banco Central. Ela é a régua da renda fixa: quando está alta, investimentos seguros como Tesouro Selic rendem bem. Em 2026 os juros no Brasil seguem em patamar elevado, o que favorece a renda fixa — mas isso muda com o tempo, então não conte com um número fixo para sempre. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('cdi', 'conceito', 2, array['cdi','100% do cdi','cdb rende']::text[], 'O que é CDI?', 'O CDI é uma taxa que anda praticamente colada na Selic e serve de régua para a renda fixa. Quando você vê ''rende 100% do CDI'', significa que aquele investimento acompanha essa régua. Acima de 100% do CDI é melhor; bem abaixo, geralmente não vale a pena.'),
  ('tesouro-direto', 'produto', 2, array['tesouro','tesouro direto','emprestar pro governo','titulo publico']::text[], 'O que é Tesouro Direto?', 'Tesouro Direto é você emprestar dinheiro para o governo e receber de volta com juros. É considerado o investimento mais seguro do país. Tem três tipos principais: Selic (para reserva), IPCA+ (protege da inflação no longo prazo) e Prefixado (taxa travada). (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('tesouro-selic', 'produto', 2, array['tesouro selic','selic 2029','reserva onde']::text[], 'O que é Tesouro Selic?', 'É o título público que acompanha a taxa Selic. Tem baixo risco e você pode sacar quando quiser sem perder dinheiro, por isso é ótimo para a reserva de emergência. Em 2026, com juros altos, ele rende de forma consistente para segurança e liquidez.'),
  ('tesouro-ipca', 'produto', 2, array['ipca','tesouro ipca','proteger inflacao','longo prazo renda fixa']::text[], 'O que é Tesouro IPCA+?', 'É um título que paga a inflação (IPCA) mais uma taxa fixa por cima. Assim seu dinheiro sempre ganha da inflação, não importa o que aconteça — ótimo para objetivos de longo prazo, como aposentadoria. A regra é levar até o vencimento para não sofrer com oscilações no meio do caminho.'),
  ('renda-fixa', 'conceito', 2, array['renda fixa','seguro','previsivel']::text[], 'O que é renda fixa?', 'Renda fixa é quando você empresta dinheiro (para o governo, um banco ou empresa) e já sabe a regra do quanto vai render. É mais previsível e segura, base de qualquer carteira. Exemplos: Tesouro Direto, CDB, LCI e LCA.'),
  ('cdb', 'produto', 1, array['cdb','banco rende','certificado deposito']::text[], 'O que é CDB?', 'CDB é você emprestando dinheiro para um banco e recebendo com juros. Costuma render um percentual do CDI (ex.: 100%, 110%). Tem a proteção do FGC até R$250 mil por banco, o que traz segurança. Bons para reserva (liquidez diária) ou metas de médio prazo. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('lci-lca', 'produto', 1, array['lci','lca','isento de imposto','isento ir renda fixa']::text[], 'O que são LCI e LCA?', 'São títulos de renda fixa ligados ao setor imobiliário (LCI) e do agronegócio (LCA). O atrativo é que são isentos de Imposto de Renda para pessoa física, então às vezes rendem mais ''no bolso'' que um CDB. Costumam ter prazo mínimo para resgatar. Também têm proteção do FGC.'),
  ('renda-variavel', 'conceito', 2, array['renda variavel','renda variável','oscila','risco']::text[], 'O que é renda variável?', 'Renda variável é quando o preço sobe e desce e não há retorno garantido — como ações, ETFs e fundos imobiliários. Traz mais risco no curto prazo, mas historicamente mais potencial de crescimento no longo prazo. A chave é diversificar e ter paciência de anos. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('acoes', 'produto', 2, array['acao','ação','acoes','ações','bolsa','b3','socio empresa']::text[], 'O que são ações?', 'Comprar uma ação é virar sócio de um pedacinho de uma empresa. Se a empresa cresce e dá lucro, você tende a ganhar (valorização e dividendos); se vai mal, pode perder. Para iniciante, ETFs costumam ser mais simples que escolher ações uma a uma. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('dividendos', 'conceito', 1, array['dividendo','dividendos','pagamento acionista','renda passiva acoes']::text[], 'O que são dividendos?', 'Dividendos são pedaços do lucro que a empresa distribui para os sócios (acionistas). É como receber um ''aluguel'' por ser dono de parte do negócio. Ações no Brasil pagam dividendos isentos de imposto para a pessoa física hoje, e reinvesti-los turbina os juros compostos.'),
  ('etf', 'produto', 3, array['etf','cesta','fundo de indice','diversificar facil']::text[], 'O que é ETF?', 'ETF é uma cesta pronta de vários investimentos numa compra só. Em vez de escolher uma empresa, você compra um pedacinho de centenas de uma vez, o que dilui o risco e simplifica sua vida. É uma das formas mais simples de diversificar e começar na bolsa.'),
  ('etf-internacional', 'produto', 2, array['etf internacional','sp500','s&p','ivvb11','exterior','dolarizar','estados unidos']::text[], 'Como investir no exterior / S&P 500?', 'Dá para investir nas maiores empresas do mundo sem sair do Brasil, usando ETFs internacionais (que seguem índices como o S&P 500, das maiores empresas dos EUA). Isso te expõe ao dólar e diversifica seu patrimônio para além do Brasil. Uma fatia internacional é comum em carteiras de longo prazo. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('etf-brasil', 'produto', 1, array['bova11','ibovespa','etf brasileiro','bolsa brasil']::text[], 'O que é um ETF brasileiro / Ibovespa?', 'É uma cesta com as maiores empresas da bolsa brasileira (o índice Ibovespa). Com uma única compra você fica sócio de dezenas das principais companhias do país. É um jeito simples de ter renda variável nacional sem escolher ação por ação.'),
  ('fii', 'produto', 2, array['fii','fundo imobiliario','fundos imobiliários','aluguel','imovel investir']::text[], 'O que são fundos imobiliários (FIIs)?', 'FIIs deixam você investir em imóveis (shoppings, galpões, prédios) comprando cotas na bolsa, sem precisar comprar um imóvel inteiro. Eles costumam distribuir rendimentos mensais, hoje isentos de IR para pessoa física, tipo um aluguel. O preço das cotas oscila, então é investimento de longo prazo. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('diversificacao', 'conceito', 3, array['diversificar','diversificacao','diversificação','nao colocar ovos','espalhar']::text[], 'O que é diversificação?', 'Diversificar é não colocar todos os ovos na mesma cesta: espalhar o dinheiro entre renda fixa, ações, fundos imobiliários e ativos internacionais. Se uma parte vai mal, as outras seguram. É a principal ferramenta para reduzir risco sem abrir mão de crescer.'),
  ('juros-compostos', 'conceito', 3, array['juros compostos','bola de neve','juros sobre juros','efeito tempo']::text[], 'O que são juros compostos?', 'Juros compostos são juros que rendem sobre os próprios juros — o efeito ''bola de neve''. No começo parece pouco, mas depois de alguns anos viram a maior parte do seu patrimônio. É por isso que começar cedo e manter a constância vale mais que acertar o investimento perfeito.'),
  ('vender-no-panico', 'comportamento', 5, array['vender','caiu','queda','panico','pânico','mercado caindo','crise','medo perder','despencou','recuo']::text[], 'O mercado caiu, devo vender?', 'Respira. Quedas fazem parte de investir no longo prazo — quem vende no susto costuma transformar uma queda temporária em perda de verdade. Seu plano é de anos, não de dias. Se nada mudou nos seus objetivos, o melhor movimento quase sempre é continuar aportando com disciplina. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('ansiedade', 'comportamento', 3, array['ansioso','ansiedade','nervoso','com medo','inseguro','preocupado']::text[], 'Estou ansioso com meus investimentos.', 'É super normal sentir isso, ainda mais no começo. O antídoto é ter um plano simples e olhar a carteira com menos frequência — investir de longo prazo é chato de propósito. Confie na diversificação e na constância dos aportes; o tempo trabalha a seu favor.'),
  ('disciplina', 'comportamento', 2, array['disciplina','constancia','manter ritmo','todo mes','habito']::text[], 'Como manter a disciplina?', 'O truque é automatizar: programe o aporte para logo depois que o salário cai, antes de gastar. Comemore a sequência de meses (a ''streak''), não o saldo. Investir vira hábito quando você não precisa decidir toda vez — já está no automático.'),
  ('dolar', 'produto', 1, array['dolar','dólar','moeda estrangeira','comprar dolar']::text[], 'Vale a pena comprar dólar?', 'Dólar funciona mais como proteção do que como fonte de crescimento — costuma subir quando há medo no mercado. Pode ser uma fatia pequena da carteira para dar estabilidade (muita gente faz isso via ETF internacional), mas não é a base de quem constrói patrimônio no longo prazo. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('ouro', 'produto', 1, array['ouro','metal','reserva de valor']::text[], 'E investir em ouro?', 'O ouro é visto como reserva de valor e proteção em tempos de crise, mas não gera renda (não paga juros nem dividendos). Serve como uma pequena fatia de proteção, não como motor de crescimento do patrimônio. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('cripto', 'produto', 2, array['cripto','bitcoin','criptomoeda','ethereum','btc']::text[], 'Devo investir em criptomoedas / Bitcoin?', 'Cripto é um ativo de alto risco e muita oscilação — pode subir muito e cair muito. Se tiver curiosidade, a regra é usar só uma fatia pequena que você aguenta perder, e nunca a reserva de emergência. Primeiro o básico (reserva e diversificação); cripto, se for o caso, é tempero, não o prato principal. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('day-trade', 'alerta', 4, array['day trade','daytrade','trader','ganhar rapido','operar','scalp','ficar rico rapido']::text[], 'Vale a pena fazer day trade?', 'Não recomendo day trade. Estudos mostram que a enorme maioria das pessoas perde dinheiro tentando operar no curto prazo — é mais perto de aposta do que de investir. O caminho que constrói patrimônio de verdade é o contrário: aportes constantes, diversificação e paciência de anos. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('piramide-golpe', 'alerta', 4, array['piramide','pirâmide','esquema','golpe','renda garantida','rendimento garantido','robo de trade','grupo de whatsapp','ganho certo']::text[], 'Um esquema promete lucro garantido, é confiável?', 'Fique longe. Promessa de lucro alto e ''garantido'', pressão para trazer amigos ou ''robôs'' milagrosos são sinais clássicos de golpe e pirâmide. No mercado sério, ninguém garante retorno. Investimento de verdade passa por instituições reguladas (CVM, Banco Central) — desconfie sempre de atalhos. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('como-comecar', 'pratico', 3, array['como comecar','como começar','primeiro passo','iniciante','nunca investi','por onde começo']::text[], 'Como começo a investir?', 'Passo a passo: 1) organize as contas e quite dívidas caras; 2) monte a reserva de emergência no Tesouro Selic ou CDB de liquidez diária; 3) defina um aporte mensal fixo; 4) diversifique aos poucos (renda fixa + ETFs). O app já monta esse plano pra você — é só seguir o checklist do mês.'),
  ('quanto-investir', 'pratico', 2, array['quanto investir','quanto guardar','quanto por mes','valor ideal']::text[], 'Quanto devo investir por mês?', 'O quanto importa menos que a constância. Um bom ponto de partida é a regra 50-30-20: 50% para necessidades, 30% para desejos e 20% para investir. Se 20% for muito agora, comece com o que der — até R$100 por mês criam o hábito. O importante é nunca deixar de aportar.'),
  ('abrir-conta', 'pratico', 1, array['corretora','abrir conta','nubank','onde investir','conta investimento','banco ou corretora']::text[], 'Onde eu invisto? Preciso de corretora?', 'Você investe por uma corretora ou pelo app do seu banco (o Nubank, por exemplo, já tem caixinhas e investimentos dentro do app). O importante é ser uma instituição regulada. Procure taxa zero de corretagem para Tesouro e ETFs, e comece simples.'),
  ('perfil-risco', 'conceito', 2, array['perfil de risco','conservador','moderado','arrojado','meu perfil']::text[], 'O que é perfil de risco?', 'É o quanto de oscilação você aguenta sem perder o sono. Conservador prioriza segurança (mais renda fixa); moderado equilibra; arrojado aceita mais risco por mais potencial. O app usa seu perfil para sugerir uma distribuição ilustrativa dos aportes — sempre mantendo a reserva intacta. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('aporte', 'conceito', 1, array['aporte','o que e aporte','aportar']::text[], 'O que é um aporte?', 'Aporte é cada vez que você coloca dinheiro nos investimentos — normalmente todo mês, depois de receber. Aporte constante é o combustível dos juros compostos. No app, você marca cada aporte concluído no checklist e ganha XP por manter a sequência.'),
  ('longo-prazo', 'conceito', 2, array['longo prazo','quando resgatar','quanto tempo','prazo']::text[], 'Por que investir pensando no longo prazo?', 'Porque o tempo é o maior aliado dos juros compostos e ele suaviza as quedas: no curto prazo o mercado sobe e desce, mas em prazos de 10, 20, 30 anos a tendência histórica é de crescimento. Quanto mais longe o objetivo, mais você pode ter em renda variável.'),
  ('ir-investimentos', 'imposto', 2, array['imposto de renda','ir','tributacao','quanto de imposto','aliquota']::text[], 'Como funciona o Imposto de Renda nos investimentos?', 'Na renda fixa e em fundos, o IR é regressivo: quanto mais tempo você deixa, menos paga (de 22,5% até 15% após 2 anos), cobrado só sobre o lucro. Tesouro, CDB e fundos seguem essa tabela; LCI, LCA, dividendos de ações e rendimentos de FIIs são isentos hoje para pessoa física. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('isencao-acoes', 'imposto', 1, array['isencao acoes','20 mil','vender acoes imposto','isento venda']::text[], 'Tem isenção de imposto ao vender ações?', 'Sim: vendas de ações até R$20 mil no mesmo mês são isentas de imposto sobre o ganho, para pessoa física (não vale para day trade nem para ETFs). Acima disso, o imposto incide só sobre o lucro. Vale conferir as regras vigentes, pois podem mudar. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('come-cotas', 'imposto', 1, array['come cotas','come-cotas','antecipacao imposto fundo']::text[], 'O que é come-cotas?', 'Come-cotas é uma antecipação do Imposto de Renda que acontece em alguns fundos duas vezes por ano, reduzindo um pouquinho a quantidade de cotas. Não é uma cobrança extra, é o imposto sendo pago aos poucos. Tesouro Direto e ações não têm come-cotas.'),
  ('independencia', 'meta', 3, array['independencia financeira','independência','fire','viver de renda','liberdade financeira']::text[], 'O que é independência financeira?', 'É quando seus investimentos rendem o suficiente para cobrir seus gastos, ou seja, o dinheiro trabalha por você e trabalhar vira opção. Uma referência comum é acumular cerca de 25 vezes seu gasto anual e sacar por volta de 4% ao ano. É uma maratona de décadas, não uma corrida. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('aposentadoria', 'meta', 2, array['aposentadoria','aposentar','previdencia','pgbl','vgbl','futuro']::text[], 'Como me planejar para a aposentadoria?', 'Comece cedo e seja constante — o tempo faz o trabalho pesado. Para o longo prazo, Tesouro IPCA+ e uma carteira diversificada com ações/ETFs costumam aparecer. Planos de previdência (PGBL/VGBL) podem ajudar por benefícios fiscais, mas confira as taxas antes. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('dividas-antes', 'pratico', 3, array['divida','dívida','dividas','devo dinheiro','quitar','endividado']::text[], 'Tenho dívidas, invisto ou pago primeiro?', 'Quase sempre pague as dívidas caras primeiro — cartão de crédito e cheque especial cobram juros muito maiores do que qualquer investimento rende. Quitar uma dívida de juros altos é o ''investimento'' com melhor retorno garantido que existe. Depois de limpar isso, comece a investir. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('cartao-rotativo', 'pratico', 2, array['cartao de credito','cartão','rotativo','juros do cartao','fatura']::text[], 'Por que o cartão de crédito é perigoso?', 'O crédito em si não é o vilão — o problema é o juro rotativo, que aparece quando você paga só o mínimo da fatura. Ele está entre os juros mais altos do mercado e vira uma bola de neve contra você. Regra de ouro: pague sempre a fatura inteira.'),
  ('orcamento', 'pratico', 2, array['orcamento','orçamento','controlar gastos','50 30 20','planilha','onde vai meu dinheiro']::text[], 'Como organizar meu orçamento?', 'Anote para onde vai o dinheiro por um mês — só enxergar já muda o comportamento. Uma divisão simples é a 50-30-20: 50% necessidades, 30% desejos, 20% para investir e reserva. Ajuste as fatias à sua realidade, mas garanta que a de investir nunca fique em zero.'),
  ('taxas', 'conceito', 2, array['taxa de administracao','taxas','custo','corretagem','taxa fundo']::text[], 'As taxas importam?', 'Muito. Taxa de administração e corretagem parecem pequenas, mas ao longo de décadas corroem uma fatia enorme do seu patrimônio. Prefira produtos com taxa baixa ou zero (Tesouro, muitos ETFs) e desconfie de fundos caros que não entregam resultado melhor.'),
  ('liquidez', 'conceito', 1, array['liquidez','resgatar','sacar','quando posso tirar']::text[], 'O que é liquidez?', 'Liquidez é a facilidade de transformar o investimento em dinheiro na conta. A reserva de emergência precisa de liquidez diária (sacar quando quiser). Já investimentos de longo prazo podem ter menos liquidez em troca de render mais — o importante é combinar cada objetivo com o prazo certo.'),
  ('rentabilidade-passada', 'conceito', 2, array['rentabilidade passada','rendeu no passado','vai render','historico garante']::text[], 'Se rendeu muito no passado, vai render de novo?', 'Não necessariamente. Rentabilidade passada não garante rentabilidade futura — é uma das frases mais importantes do mercado. O histórico ajuda a entender o comportamento de um investimento, mas nunca é promessa. Por isso o foco é diversificar e pensar no longo prazo, não perseguir o que subiu ontem. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('fgc', 'conceito', 1, array['fgc','garantia','banco quebrar','protecao renda fixa','250 mil']::text[], 'O que é o FGC?', 'O FGC (Fundo Garantidor de Créditos) protege seu dinheiro em investimentos como CDB, LCI, LCA e poupança até R$250 mil por CPF por instituição, caso o banco quebre. Por isso muita gente distribui valores entre bancos. Tesouro Direto não usa FGC porque já é garantido pelo próprio governo.'),
  ('rebalanceamento', 'conceito', 1, array['rebalancear','rebalanceamento','ajustar carteira','proporcao carteira']::text[], 'O que é rebalancear a carteira?', 'Rebalancear é, de tempos em tempos, ajustar sua carteira de volta às proporções planejadas. Se as ações subiram muito e passaram do combinado, você vende um pouco e reforça o que ficou para trás. Isso mantém o risco sob controle e faz você ''comprar na baixa'' de forma disciplinada. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('poupanca', 'produto', 2, array['poupanca','poupança','deixar na poupanca','caderneta']::text[], 'Devo deixar meu dinheiro na poupança?', 'A poupança é segura e simples, mas costuma render menos que o Tesouro Selic e outros investimentos de baixo risco, muitas vezes perdendo ou empatando com a inflação. Para a reserva, Tesouro Selic ou um CDB de liquidez diária geralmente rendem mais com segurança parecida. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('cenario-2026', 'cenario2026', 3, array['2026','cenario','cenário','como esta o mercado','mercado agora','economia 2026','panorama']::text[], 'Como está o mercado em 2026?', 'Em 2026 o Brasil segue com juros (Selic) em patamar elevado, o que deixa a renda fixa atraente para segurança e reserva, enquanto a renda variável e os ativos internacionais seguem como motores de longo prazo. Mas cenário muda o tempo todo — por isso a estratégia não é adivinhar o próximo mês, e sim diversificar e aportar sempre. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('quanto-para-aposentar', 'meta', 1, array['quanto preciso aposentar','quanto para viver de renda','quanto juntar','meta aposentadoria']::text[], 'Quanto preciso juntar para viver de renda?', 'Uma referência simples: multiplique seu gasto anual por 25. Se você gasta R$5 mil por mês (R$60 mil por ano), a meta seria cerca de R$1,5 milhão, sacando por volta de 4% ao ano. É uma estimativa educacional para dar direção, não uma regra exata. (Conteúdo educacional, não é recomendação personalizada de investimentos.)'),
  ('comecar-com-pouco', 'pratico', 2, array['pouco dinheiro','comecar com pouco','100 reais','sem dinheiro','salario baixo']::text[], 'Dá para investir com pouco dinheiro?', 'Dá sim! Hoje você investe no Tesouro a partir de cerca de R$30, e em muitos ETFs e fundos com quantias baixas. No começo o valor importa menos que criar o hábito — R$50 ou R$100 por mês já colocam os juros compostos para trabalhar. O tempo faz o resto.')
on conflict (slug) do update set
  categoria = excluded.categoria,
  prioridade = excluded.prioridade,
  palavras_chave = excluded.palavras_chave,
  pergunta = excluded.pergunta,
  resposta = excluded.resposta;


-- ============================================================================
-- Login por CPF + e-mail para confirmação da conta.
-- Adiciona CPF ao perfil, atualiza o bootstrap e cria a busca CPF -> e-mail.
-- Cole no SQL Editor e rode. Idempotente.
-- ============================================================================

-- 1) coluna cpf no perfil
alter table public.profiles add column if not exists cpf text;
create unique index if not exists uq_profiles_cpf on public.profiles(cpf) where cpf is not null;

-- 2) bootstrap: agora também grava o CPF vindo do cadastro (metadata)
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
  insert into public.profiles (id, nome, cpf)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', 'Você'),
    nullif(regexp_replace(coalesce(new.raw_user_meta_data->>'cpf',''), '\D', '', 'g'), '')
  )
  on conflict (id) do update set
    nome = coalesce(excluded.nome, public.profiles.nome),
    cpf  = coalesce(excluded.cpf,  public.profiles.cpf);

  insert into public.financial_profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  for i in 1 .. array_length(ladder, 1) loop
    insert into public.goals (user_id, ordem, titulo, valor_alvo, status)
    values (new.id, i, titulos[i], ladder[i],
            (case when i = 1 then 'ativa' else 'bloqueada' end)::goal_status)
    on conflict (user_id, ordem) do nothing;
  end loop;

  return new;
end;
$$;

-- 3) backfill: preenche o CPF de usuários que já existem (a partir do metadata)
update public.profiles p
set cpf = nullif(regexp_replace(coalesce(u.raw_user_meta_data->>'cpf',''), '\D', '', 'g'), '')
from auth.users u
where u.id = p.id and p.cpf is null
  and coalesce(u.raw_user_meta_data->>'cpf','') <> '';

-- 4) busca CPF -> e-mail (para o login por CPF). SECURITY DEFINER: lê auth.users.
create or replace function public.email_by_cpf(p_cpf text)
returns text
language sql
security definer
set search_path = public
as $$
  select u.email
  from public.profiles pr
  join auth.users u on u.id = pr.id
  where pr.cpf = regexp_replace(coalesce(p_cpf,''), '\D', '', 'g')
  limit 1;
$$;

grant execute on function public.email_by_cpf(text) to anon, authenticated;

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

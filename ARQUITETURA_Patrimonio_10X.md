# Patrimônio 10X — Documento de Arquitetura e Plano de Engenharia

> Documento de fundação (fase pré-código). Define stack, estrutura, banco de dados, fluxos, regras de negócio, camada de IA, plano por fases e backlog. Serve como contrato técnico para o desenvolvimento.

---

## 1. Visão e princípios de produto

O Patrimônio 10X é um **mentor financeiro pessoal** que transforma leigos em investidores disciplinados ao longo de 10 a 30 anos. O sucesso do produto **não** se mede por rentabilidade, e sim por *comportamento*: consistência de aportes, hábitos criados e conhecimento adquirido.

Cinco princípios guiam toda decisão de design e engenharia:

1. **Linguagem de 12 anos.** Nenhum termo técnico sem explicação simples opcional (tooltip “o que é isso?”).
2. **Comportamento acima de números.** A tela principal celebra disciplina (sequência, hábitos), não só o saldo.
3. **Educação, não promessa.** A IA nunca apresenta projeção como certeza e sempre sinaliza risco.
4. **Antifragilidade emocional.** O app previne decisões impulsivas (vender no pânico) via Mentor IA e diário.
5. **Privacidade e conformidade primeiro.** Dados financeiros são sensíveis (LGPD); tudo é criptografado e o usuário é dono dos dados.

### 1.1 Alerta regulatório (decisão de negócio crítica)

No Brasil, **recomendação personalizada de investimentos é atividade regulada pela CVM** (Resoluções CVM 19 e 179 — consultoria de valores mobiliários). Um app que diz “invista R$800 neste ETF” pode ser interpretado como consultoria não autorizada.

Estratégia recomendada para operar legalmente:

- Posicionar o produto como **educacional e de organização financeira** (isento de registro).
- Apresentar alocações como **modelos ilustrativos por perfil de risco**, sempre com o disclaimer “isto é conteúdo educacional, não é recomendação personalizada”, nunca citando o *ativo específico* como ordem de compra.
- Para recomendação de fato personalizada, firmar parceria com **consultoria/gestora registrada na CVM** ou operar como robo-advisor licenciado. *Consultar advogado especializado antes do lançamento.*

Este documento assume o modo educacional como padrão.

---

## 2. Stack tecnológica

| Camada | Escolha | Por quê |
|---|---|---|
| App (Android/iOS/Web) | **Flutter 3.x** | Uma base de código, UI premium idêntica nas 3 plataformas, ótimo desempenho de animação |
| Gerência de estado | **Riverpod** | Testável, sem boilerplate, escala bem |
| Navegação | **go_router** | Rotas declarativas, deep links, guarda de rotas |
| Cache local / offline | **Drift (SQLite)** + **flutter_secure_storage** | Funciona offline; segredos criptografados |
| Backend (MVP) | **Supabase** (Postgres + Auth + Storage + Edge Functions) | Auth pronta, Row Level Security nativa, rápido para MVP |
| Backend (escala) | Migração para **NestJS + PostgreSQL** em serviços dedicados | Quando o volume justificar lógica de negócio complexa |
| IA | **Claude API (Anthropic)** + camada RAG sobre base de conhecimento financeiro | Mentor IA e geração de plano com *tool use* estruturado |
| Autenticação | Supabase Auth + **biometria local** (local_auth) | Login seguro + conveniência |
| Gráficos | **fl_chart** | Curvas suaves, animação, tema claro/escuro |
| Notificações | **Firebase Cloud Messaging** + notificações locais | Lembretes de aporte, conquistas |
| i18n | **intl / ARB** | Múltiplos idiomas desde a fundação |
| CI/CD | GitHub Actions → Firebase App Distribution / TestFlight / lojas | Entrega contínua |
| Observabilidade | Sentry (erros) + PostHog (produto) | Qualidade e comportamento |

> Alternativa válida: **React Native (Expo) + Next.js**. Flutter foi escolhido pela consistência visual premium exigida no brief (“Apple/Nubank/Notion”).

---

## 3. Estrutura de pastas (Flutter, feature-first + Clean Architecture)

```
patrimonio10x/
├── lib/
│   ├── main.dart
│   ├── app/
│   │   ├── app.dart                 # MaterialApp + router
│   │   ├── router.dart              # go_router + guards
│   │   └── theme/                   # tokens, claro/escuro, tipografia
│   ├── core/
│   │   ├── config/                  # env, feature flags
│   │   ├── errors/                  # Failure, exceptions
│   │   ├── network/                 # cliente http, interceptors
│   │   ├── security/                # cripto, biometria, secure storage
│   │   ├── i18n/                    # arquivos ARB
│   │   ├── money/                   # value objects Money, Currency
│   │   └── widgets/                 # Card, Button, TermTooltip, etc.
│   ├── features/
│   │   ├── onboarding/
│   │   │   ├── data/ domain/ presentation/
│   │   ├── dashboard/
│   │   ├── monthly_plan/            # assistente mensal + checklist
│   │   ├── goals/                   # escada de metas
│   │   ├── mentor/                  # chat Mentor IA
│   │   ├── learn/                   # curso e aulas
│   │   ├── calculator/             # calculadora + simulador
│   │   ├── journal/                 # diário emocional
│   │   ├── habits/
│   │   ├── gamification/            # XP, níveis, conquistas, missões
│   │   ├── reports/
│   │   ├── notifications/
│   │   └── settings/                # perfil, tema, backup, segurança
│   └── shared/
│       ├── models/ providers/ services/
├── test/                            # unit + widget
├── integration_test/
└── supabase/                        # migrations SQL, edge functions
```

Cada feature segue **data → domain → presentation** (repositórios, entidades/casos de uso, telas/controllers), garantindo componentes reutilizáveis e testáveis.

---

## 4. Modelo de dados (PostgreSQL / Supabase)

Tabelas principais (chaves e campos-chave; todas com `id uuid`, `created_at`, `updated_at` e RLS por `user_id`):

- **users / profiles** — dados de conta, país, idioma, moeda, tema.
- **financial_profiles** — idade, renda_mensal, despesas_mensais, valor_disponivel, perfil_risco (`conservador|moderado|arrojado`), conhecimento (`iniciante|intermediario|avancado`), instituicao (default `Nubank`), aporte_padrao (default `2000`), objetivos, prazo_independencia.
- **goals** — ordem, titulo, valor_alvo, valor_atual, status, previsao_conclusao. (Semente automática: reserva → R$12k, 25k, 50k, 100k, 250k, 500k, 1M, 2M, 5M, 10M.)
- **portfolio_holdings** — classe_ativo, nome, quantidade, valor_investido, valor_atual.
- **contributions (aportes)** — mes_ref, valor, data, origem.
- **monthly_plans** — mes_ref, salario_recebido, valor_a_investir, status, gerado_por_ia.
- **plan_items** — plano_id, classe_ativo, descricao, valor, concluido (checklist).
- **transactions** — histórico bruto (import de extrato futuro).
- **lessons / modules** — módulo, ordem, titulo, conteudo, duracao_seg, quiz(jsonb).
- **lesson_progress** — usuario, licao, concluida, nota_quiz.
- **mentor_conversations / mentor_messages** — thread do chat, papel, conteúdo, metadados.
- **habits / habit_logs** — hábito mensal e marcação diária/mensal.
- **journal_entries** — mes_ref, humor (`confiante|preocupado|ansioso|motivado|feliz|desanimado`), nota.
- **achievements / user_achievements** — catálogo e desbloqueios.
- **xp_events** — origem, pontos (fonte única da verdade do XP → nível derivado).
- **notifications** — tipo, payload, agendada_para, enviada.

**Segurança:** RLS obrigatória (`user_id = auth.uid()`), criptografia em repouso, backups automáticos, campos sensíveis nunca em logs. Conformidade LGPD: exportar/apagar dados a pedido.

---

## 5. Fluxos de navegação

```
Splash → (autenticado?)
  ├── não → Login/Cadastro → Onboarding inteligente → Geração do plano (IA) → Dashboard
  └── sim → Biometria → (novo mês?) → Assistente Mensal → Dashboard

Barra inferior (5 abas):
  [Início] [Metas] [Mentor IA] [Aprender] [Mais ▸ Calculadora, Diário, Hábitos, Relatórios, Ajustes]
```

Gatilhos automáticos:
- **Virada de mês** → abre o Assistente Mensal (“Você já recebeu seu salário?”).
- **Fim de mês** → abre o Diário emocional.
- **Meta atingida / marco de dias** → tela de celebração + conquista.

---

## 6. Regras de negócio essenciais

- **Padrão do usuário:** iniciante, Nubank, aporte R$2.000/mês — tudo editável em Ajustes.
- **Ordem sagrada:** reserva de emergência (R$12k) *antes* de qualquer meta de crescimento.
- **Escada de metas** semeada automaticamente e avança sozinha ao concluir cada nível.
- **Alocação por perfil (modelo ilustrativo, não ordem de compra):**
  - Conservador → mais Tesouro Selic / IPCA+, pouca renda variável.
  - Moderado → equilíbrio renda fixa / ETFs (BR + internacional).
  - Arrojado → maior fatia em ETFs e ações, mantendo reserva intacta.
- **Sequência (streak):** conta meses consecutivos com todos os itens do plano concluídos.
- **XP e níveis:** XP por aporte concluído, aula estudada, hábito cumprido, meta batida; nível = f(XP acumulado) com curva crescente.
- **Guardas da IA (invioláveis):** nunca recomendar algo incompatível com o perfil; nunca incentivar apostas, jogos, pirâmides, day trade ou especulação extrema; sempre incentivar disciplina, diversificação e longo prazo; sempre sinalizar risco; nunca prometer retorno.

---

## 7. Camada de IA

**Dois usos principais:**

1. **Gerador de plano** — recebe o perfil do onboarding e produz, via *tool use* (saída JSON estruturada), a reserva, metas, distribuição mensal e cronograma. Valida contra as regras do perfil antes de exibir.
2. **Mentor IA (chat)** — responde dúvidas educacionais 24h. Contexto injetado a cada conversa: patrimônio, aportes, carteira, estratégia, distância da próxima meta e da independência.

**Arquitetura da IA:**
- *System prompt* fixo com as guardas da seção 6 + persona “explique como para uma criança de 12 anos”.
- **RAG** sobre base curada de educação financeira (os 20 módulos) para respostas ancoradas e consistentes.
- **Guardrails de saída:** filtro que bloqueia recomendações fora do perfil e qualquer incentivo proibido; fallback educacional quando a pergunta pede algo especulativo (“não recomendo day trade; veja por quê…”).
- **Disclaimers automáticos** anexados a qualquer conteúdo com viés de recomendação.
- Chamadas via *Edge Function* (a chave da API nunca fica no cliente).

---

## 8. Design system

- **Inspiração:** Apple (espaço e refinamento) + Nubank (cor e calor) + Notion (estrutura calma).
- **Cor:** violeta profundo como primária, dourado como cor de conquista/patrimônio, verde para ganhos.
- **Tipografia:** display de personalidade + corpo neutro legível + fonte utilitária para números.
- **Assinatura visual:** a **Escada do Patrimônio** — os 10 marcos de R$12k a R$10M como uma jornada escalável; e o **herói de patrimônio animado** no topo do dashboard.
- Tema **claro e escuro**, animações suaves, acessibilidade (contraste AA, foco visível, respeito a “reduzir movimento”).

---

## 9. Plano de desenvolvimento por fases

| Fase | Escopo | Entrega |
|---|---|---|
| **0 — Fundação** | Repo, CI/CD, design system, auth, tema, i18n, esquema do banco + RLS | Base pronta |
| **1 — MVP** | Onboarding, geração de plano, Dashboard, Assistente Mensal + checklist, Escada de Metas, Calculadora | App usável ponta a ponta |
| **2 — Inteligência e educação** | Mentor IA (chat + guardrails), área Aprender (20 módulos + quizzes), Gamificação (XP, níveis, conquistas, missões) | Diferencial competitivo |
| **3 — Hábitos e retenção** | Diário emocional, sistema de hábitos, notificações inteligentes, Relatórios | Retenção e engajamento |
| **4 — Integrações** | Open Finance / APIs de bancos (com autorização), import PDF/CSV, cálculo de IR, multimoeda e multilíngue completos, backup em nuvem | Escala e conveniência |

---

## 10. Backlog inicial (épicos → histórias)

- **Onboarding:** questionário passo a passo · valores padrão (Nubank/R$2.000) · geração do plano pela IA · tela de resumo do plano.
- **Dashboard:** herói de patrimônio · cards de métricas · gráfico de evolução · gráfico de aportes · projeções (5/10/20 anos, aposentadoria) · card da meta atual.
- **Assistente Mensal:** gatilho na virada de mês · pergunta de salário · captura do valor · plano do mês via IA · checklist marcável · celebração + XP.
- **Metas:** escada semeada · progresso, tempo estimado e previsão por meta · avanço automático.
- **Mentor IA:** chat com contexto financeiro · guardrails · disclaimers · perguntas sugeridas.
- **Aprender:** grade de módulos · aula < 5 min · quiz · progresso.
- **Calculadora/Simulador:** entradas (aporte, inicial, tempo, rentabilidade, inflação) · resultados + gráfico · comparação de cenários.
- **Diário:** pergunta de fim de mês · gráfico emocional no tempo.
- **Hábitos:** checklist mensal · histórico.
- **Gamificação:** conquistas, medalhas, XP, níveis, missões semanais/mensais, linha do tempo patrimonial.
- **Relatórios:** rentabilidade, distribuição, histórico, comparação anual, dividendos.
- **Plataforma:** login seguro, biometria, sincronização, backup, tema, i18n, acessibilidade, testes, segurança.

---

## 11. Qualidade e segurança

- **Testes:** unitários (regras de negócio, cálculos de juros), widget (telas), integração (fluxos onboarding→dashboard→plano).
- **Segurança:** RLS, criptografia em repouso e trânsito, secure storage, biometria, sem segredos no cliente, rate limiting nas Edge Functions.
- **Conformidade:** LGPD (consentimento, exportação e exclusão de dados), disclaimers de investimento, alerta CVM da seção 1.1.
- **Acessibilidade:** contraste AA, leitores de tela, alvos de toque ≥ 44px, redução de movimento.

---

*Próximo passo natural: transformar cada épico do backlog em código de produção (telas Flutter, migrations SQL, Edge Functions da IA). O protótipo interativo que acompanha este documento demonstra a experiência das telas centrais.*

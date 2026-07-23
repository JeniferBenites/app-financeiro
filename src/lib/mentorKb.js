// ============================================================================
// Base de conhecimento do Mentor IA (respostas automáticas, sem API externa).
// Contexto: investidor iniciante brasileiro, ano de 2026.
// Tudo é conteúdo EDUCACIONAL, não recomendação personalizada (alerta CVM).
// A mesma base é semeada no Supabase (tabela mentor_kb) via supabase/mentor_kb.sql.
// ============================================================================

const DISC = "(Conteúdo educacional, não é recomendação personalizada de investimentos.)";

export const MENTOR_KB = [
  // ---- Fundamentos ----
  { slug: "o-que-e-investir", categoria: "conceito", prioridade: 1,
    palavras_chave: ["investir", "investimento", "começar a investir", "o que e investir"],
    pergunta: "O que é investir?",
    resposta: "Investir é colocar seu dinheiro para trabalhar por você, em vez de deixá-lo parado perdendo valor para a inflação. Você aplica um pouco todo mês, com paciência, e os juros vão se somando ao longo dos anos. O segredo não é acertar o melhor investimento, é ser constante por muito tempo." },

  { slug: "reserva-emergencia", categoria: "conceito", prioridade: 3,
    palavras_chave: ["reserva", "emergencia", "reserva de emergência", "colchão", "imprevisto"],
    pergunta: "O que é reserva de emergência?",
    resposta: "É o seu 'colchão' de segurança: um dinheiro guardado para imprevistos (perder o emprego, um conserto urgente). O ideal é ter de 3 a 6 meses dos seus gastos, num lugar seguro e fácil de sacar, como Tesouro Selic ou CDB de liquidez diária. É sempre o primeiro passo, antes de qualquer investimento de risco." },

  { slug: "inflacao", categoria: "conceito", prioridade: 2,
    palavras_chave: ["inflacao", "inflação", "preços subindo", "dinheiro encolhe", "poder de compra"],
    pergunta: "O que é inflação?",
    resposta: "Inflação é o dinheiro perdendo poder de compra: o pão que custava R$5 passa a custar R$6. Por isso guardar dinheiro parado 'encolhe' com o tempo. No Brasil, a meta de inflação é de 3% ao ano (com margem para mais ou menos). Investir serve, antes de tudo, para correr mais rápido que a inflação." },

  { slug: "selic-2026", categoria: "cenario2026", prioridade: 2,
    palavras_chave: ["selic", "taxa de juros", "juros altos", "copom", "banco central"],
    pergunta: "O que é a Selic e como está em 2026?",
    resposta: "A Selic é a taxa básica de juros do país, definida pelo Banco Central. Ela é a régua da renda fixa: quando está alta, investimentos seguros como Tesouro Selic rendem bem. Em 2026 os juros no Brasil seguem em patamar elevado, o que favorece a renda fixa — mas isso muda com o tempo, então não conte com um número fixo para sempre. " + DISC },

  { slug: "cdi", categoria: "conceito", prioridade: 2,
    palavras_chave: ["cdi", "100% do cdi", "cdb rende"],
    pergunta: "O que é CDI?",
    resposta: "O CDI é uma taxa que anda praticamente colada na Selic e serve de régua para a renda fixa. Quando você vê 'rende 100% do CDI', significa que aquele investimento acompanha essa régua. Acima de 100% do CDI é melhor; bem abaixo, geralmente não vale a pena." },

  { slug: "tesouro-direto", categoria: "produto", prioridade: 2,
    palavras_chave: ["tesouro", "tesouro direto", "emprestar pro governo", "titulo publico"],
    pergunta: "O que é Tesouro Direto?",
    resposta: "Tesouro Direto é você emprestar dinheiro para o governo e receber de volta com juros. É considerado o investimento mais seguro do país. Tem três tipos principais: Selic (para reserva), IPCA+ (protege da inflação no longo prazo) e Prefixado (taxa travada). " + DISC },

  { slug: "tesouro-selic", categoria: "produto", prioridade: 2,
    palavras_chave: ["tesouro selic", "selic 2029", "reserva onde"],
    pergunta: "O que é Tesouro Selic?",
    resposta: "É o título público que acompanha a taxa Selic. Tem baixo risco e você pode sacar quando quiser sem perder dinheiro, por isso é ótimo para a reserva de emergência. Em 2026, com juros altos, ele rende de forma consistente para segurança e liquidez." },

  { slug: "tesouro-ipca", categoria: "produto", prioridade: 2,
    palavras_chave: ["ipca", "tesouro ipca", "proteger inflacao", "longo prazo renda fixa"],
    pergunta: "O que é Tesouro IPCA+?",
    resposta: "É um título que paga a inflação (IPCA) mais uma taxa fixa por cima. Assim seu dinheiro sempre ganha da inflação, não importa o que aconteça — ótimo para objetivos de longo prazo, como aposentadoria. A regra é levar até o vencimento para não sofrer com oscilações no meio do caminho." },

  { slug: "renda-fixa", categoria: "conceito", prioridade: 2,
    palavras_chave: ["renda fixa", "seguro", "previsivel"],
    pergunta: "O que é renda fixa?",
    resposta: "Renda fixa é quando você empresta dinheiro (para o governo, um banco ou empresa) e já sabe a regra do quanto vai render. É mais previsível e segura, base de qualquer carteira. Exemplos: Tesouro Direto, CDB, LCI e LCA." },

  { slug: "cdb", categoria: "produto", prioridade: 1,
    palavras_chave: ["cdb", "banco rende", "certificado deposito"],
    pergunta: "O que é CDB?",
    resposta: "CDB é você emprestando dinheiro para um banco e recebendo com juros. Costuma render um percentual do CDI (ex.: 100%, 110%). Tem a proteção do FGC até R$250 mil por banco, o que traz segurança. Bons para reserva (liquidez diária) ou metas de médio prazo. " + DISC },

  { slug: "lci-lca", categoria: "produto", prioridade: 1,
    palavras_chave: ["lci", "lca", "isento de imposto", "isento ir renda fixa"],
    pergunta: "O que são LCI e LCA?",
    resposta: "São títulos de renda fixa ligados ao setor imobiliário (LCI) e do agronegócio (LCA). O atrativo é que são isentos de Imposto de Renda para pessoa física, então às vezes rendem mais 'no bolso' que um CDB. Costumam ter prazo mínimo para resgatar. Também têm proteção do FGC." },

  { slug: "renda-variavel", categoria: "conceito", prioridade: 2,
    palavras_chave: ["renda variavel", "renda variável", "oscila", "risco"],
    pergunta: "O que é renda variável?",
    resposta: "Renda variável é quando o preço sobe e desce e não há retorno garantido — como ações, ETFs e fundos imobiliários. Traz mais risco no curto prazo, mas historicamente mais potencial de crescimento no longo prazo. A chave é diversificar e ter paciência de anos. " + DISC },

  { slug: "acoes", categoria: "produto", prioridade: 2,
    palavras_chave: ["acao", "ação", "acoes", "ações", "bolsa", "b3", "socio empresa"],
    pergunta: "O que são ações?",
    resposta: "Comprar uma ação é virar sócio de um pedacinho de uma empresa. Se a empresa cresce e dá lucro, você tende a ganhar (valorização e dividendos); se vai mal, pode perder. Para iniciante, ETFs costumam ser mais simples que escolher ações uma a uma. " + DISC },

  { slug: "dividendos", categoria: "conceito", prioridade: 1,
    palavras_chave: ["dividendo", "dividendos", "pagamento acionista", "renda passiva acoes"],
    pergunta: "O que são dividendos?",
    resposta: "Dividendos são pedaços do lucro que a empresa distribui para os sócios (acionistas). É como receber um 'aluguel' por ser dono de parte do negócio. Ações no Brasil pagam dividendos isentos de imposto para a pessoa física hoje, e reinvesti-los turbina os juros compostos." },

  { slug: "etf", categoria: "produto", prioridade: 3,
    palavras_chave: ["etf", "cesta", "fundo de indice", "diversificar facil"],
    pergunta: "O que é ETF?",
    resposta: "ETF é uma cesta pronta de vários investimentos numa compra só. Em vez de escolher uma empresa, você compra um pedacinho de centenas de uma vez, o que dilui o risco e simplifica sua vida. É uma das formas mais simples de diversificar e começar na bolsa." },

  { slug: "etf-internacional", categoria: "produto", prioridade: 2,
    palavras_chave: ["etf internacional", "sp500", "s&p", "ivvb11", "exterior", "dolarizar", "estados unidos"],
    pergunta: "Como investir no exterior / S&P 500?",
    resposta: "Dá para investir nas maiores empresas do mundo sem sair do Brasil, usando ETFs internacionais (que seguem índices como o S&P 500, das maiores empresas dos EUA). Isso te expõe ao dólar e diversifica seu patrimônio para além do Brasil. Uma fatia internacional é comum em carteiras de longo prazo. " + DISC },

  { slug: "etf-brasil", categoria: "produto", prioridade: 1,
    palavras_chave: ["bova11", "ibovespa", "etf brasileiro", "bolsa brasil"],
    pergunta: "O que é um ETF brasileiro / Ibovespa?",
    resposta: "É uma cesta com as maiores empresas da bolsa brasileira (o índice Ibovespa). Com uma única compra você fica sócio de dezenas das principais companhias do país. É um jeito simples de ter renda variável nacional sem escolher ação por ação." },

  { slug: "fii", categoria: "produto", prioridade: 2,
    palavras_chave: ["fii", "fundo imobiliario", "fundos imobiliários", "aluguel", "imovel investir"],
    pergunta: "O que são fundos imobiliários (FIIs)?",
    resposta: "FIIs deixam você investir em imóveis (shoppings, galpões, prédios) comprando cotas na bolsa, sem precisar comprar um imóvel inteiro. Eles costumam distribuir rendimentos mensais, hoje isentos de IR para pessoa física, tipo um aluguel. O preço das cotas oscila, então é investimento de longo prazo. " + DISC },

  { slug: "diversificacao", categoria: "conceito", prioridade: 3,
    palavras_chave: ["diversificar", "diversificacao", "diversificação", "nao colocar ovos", "espalhar"],
    pergunta: "O que é diversificação?",
    resposta: "Diversificar é não colocar todos os ovos na mesma cesta: espalhar o dinheiro entre renda fixa, ações, fundos imobiliários e ativos internacionais. Se uma parte vai mal, as outras seguram. É a principal ferramenta para reduzir risco sem abrir mão de crescer." },

  { slug: "juros-compostos", categoria: "conceito", prioridade: 3,
    palavras_chave: ["juros compostos", "bola de neve", "juros sobre juros", "efeito tempo"],
    pergunta: "O que são juros compostos?",
    resposta: "Juros compostos são juros que rendem sobre os próprios juros — o efeito 'bola de neve'. No começo parece pouco, mas depois de alguns anos viram a maior parte do seu patrimônio. É por isso que começar cedo e manter a constância vale mais que acertar o investimento perfeito." },

  // ---- Comportamento / emocional ----
  { slug: "vender-no-panico", categoria: "comportamento", prioridade: 5,
    palavras_chave: ["vender", "caiu", "queda", "panico", "pânico", "mercado caindo", "crise", "medo perder", "despencou", "recuo"],
    pergunta: "O mercado caiu, devo vender?",
    resposta: "Respira. Quedas fazem parte de investir no longo prazo — quem vende no susto costuma transformar uma queda temporária em perda de verdade. Seu plano é de anos, não de dias. Se nada mudou nos seus objetivos, o melhor movimento quase sempre é continuar aportando com disciplina. " + DISC },

  { slug: "ansiedade", categoria: "comportamento", prioridade: 3,
    palavras_chave: ["ansioso", "ansiedade", "nervoso", "com medo", "inseguro", "preocupado"],
    pergunta: "Estou ansioso com meus investimentos.",
    resposta: "É super normal sentir isso, ainda mais no começo. O antídoto é ter um plano simples e olhar a carteira com menos frequência — investir de longo prazo é chato de propósito. Confie na diversificação e na constância dos aportes; o tempo trabalha a seu favor." },

  { slug: "disciplina", categoria: "comportamento", prioridade: 2,
    palavras_chave: ["disciplina", "constancia", "manter ritmo", "todo mes", "habito"],
    pergunta: "Como manter a disciplina?",
    resposta: "O truque é automatizar: programe o aporte para logo depois que o salário cai, antes de gastar. Comemore a sequência de meses (a 'streak'), não o saldo. Investir vira hábito quando você não precisa decidir toda vez — já está no automático." },

  // ---- Produtos de cautela ----
  { slug: "dolar", categoria: "produto", prioridade: 1,
    palavras_chave: ["dolar", "dólar", "moeda estrangeira", "comprar dolar"],
    pergunta: "Vale a pena comprar dólar?",
    resposta: "Dólar funciona mais como proteção do que como fonte de crescimento — costuma subir quando há medo no mercado. Pode ser uma fatia pequena da carteira para dar estabilidade (muita gente faz isso via ETF internacional), mas não é a base de quem constrói patrimônio no longo prazo. " + DISC },

  { slug: "ouro", categoria: "produto", prioridade: 1,
    palavras_chave: ["ouro", "metal", "reserva de valor"],
    pergunta: "E investir em ouro?",
    resposta: "O ouro é visto como reserva de valor e proteção em tempos de crise, mas não gera renda (não paga juros nem dividendos). Serve como uma pequena fatia de proteção, não como motor de crescimento do patrimônio. " + DISC },

  { slug: "cripto", categoria: "produto", prioridade: 2,
    palavras_chave: ["cripto", "bitcoin", "criptomoeda", "ethereum", "btc"],
    pergunta: "Devo investir em criptomoedas / Bitcoin?",
    resposta: "Cripto é um ativo de alto risco e muita oscilação — pode subir muito e cair muito. Se tiver curiosidade, a regra é usar só uma fatia pequena que você aguenta perder, e nunca a reserva de emergência. Primeiro o básico (reserva e diversificação); cripto, se for o caso, é tempero, não o prato principal. " + DISC },

  { slug: "day-trade", categoria: "alerta", prioridade: 4,
    palavras_chave: ["day trade", "daytrade", "trader", "ganhar rapido", "operar", "scalp", "ficar rico rapido"],
    pergunta: "Vale a pena fazer day trade?",
    resposta: "Não recomendo day trade. Estudos mostram que a enorme maioria das pessoas perde dinheiro tentando operar no curto prazo — é mais perto de aposta do que de investir. O caminho que constrói patrimônio de verdade é o contrário: aportes constantes, diversificação e paciência de anos. " + DISC },

  { slug: "piramide-golpe", categoria: "alerta", prioridade: 4,
    palavras_chave: ["piramide", "pirâmide", "esquema", "golpe", "renda garantida", "rendimento garantido", "robo de trade", "grupo de whatsapp", "ganho certo"],
    pergunta: "Um esquema promete lucro garantido, é confiável?",
    resposta: "Fique longe. Promessa de lucro alto e 'garantido', pressão para trazer amigos ou 'robôs' milagrosos são sinais clássicos de golpe e pirâmide. No mercado sério, ninguém garante retorno. Investimento de verdade passa por instituições reguladas (CVM, Banco Central) — desconfie sempre de atalhos. " + DISC },

  // ---- Prático / começando ----
  { slug: "como-comecar", categoria: "pratico", prioridade: 3,
    palavras_chave: ["como comecar", "como começar", "primeiro passo", "iniciante", "nunca investi", "por onde começo"],
    pergunta: "Como começo a investir?",
    resposta: "Passo a passo: 1) organize as contas e quite dívidas caras; 2) monte a reserva de emergência no Tesouro Selic ou CDB de liquidez diária; 3) defina um aporte mensal fixo; 4) diversifique aos poucos (renda fixa + ETFs). O app já monta esse plano pra você — é só seguir o checklist do mês." },

  { slug: "quanto-investir", categoria: "pratico", prioridade: 2,
    palavras_chave: ["quanto investir", "quanto guardar", "quanto por mes", "valor ideal"],
    pergunta: "Quanto devo investir por mês?",
    resposta: "O quanto importa menos que a constância. Um bom ponto de partida é a regra 50-30-20: 50% para necessidades, 30% para desejos e 20% para investir. Se 20% for muito agora, comece com o que der — até R$100 por mês criam o hábito. O importante é nunca deixar de aportar." },

  { slug: "abrir-conta", categoria: "pratico", prioridade: 1,
    palavras_chave: ["corretora", "abrir conta", "nubank", "onde investir", "conta investimento", "banco ou corretora"],
    pergunta: "Onde eu invisto? Preciso de corretora?",
    resposta: "Você investe por uma corretora ou pelo app do seu banco (o Nubank, por exemplo, já tem caixinhas e investimentos dentro do app). O importante é ser uma instituição regulada. Procure taxa zero de corretagem para Tesouro e ETFs, e comece simples." },

  { slug: "perfil-risco", categoria: "conceito", prioridade: 2,
    palavras_chave: ["perfil de risco", "conservador", "moderado", "arrojado", "meu perfil"],
    pergunta: "O que é perfil de risco?",
    resposta: "É o quanto de oscilação você aguenta sem perder o sono. Conservador prioriza segurança (mais renda fixa); moderado equilibra; arrojado aceita mais risco por mais potencial. O app usa seu perfil para sugerir uma distribuição ilustrativa dos aportes — sempre mantendo a reserva intacta. " + DISC },

  { slug: "aporte", categoria: "conceito", prioridade: 1,
    palavras_chave: ["aporte", "o que e aporte", "aportar"],
    pergunta: "O que é um aporte?",
    resposta: "Aporte é cada vez que você coloca dinheiro nos investimentos — normalmente todo mês, depois de receber. Aporte constante é o combustível dos juros compostos. No app, você marca cada aporte concluído no checklist e ganha XP por manter a sequência." },

  { slug: "longo-prazo", categoria: "conceito", prioridade: 2,
    palavras_chave: ["longo prazo", "quando resgatar", "quanto tempo", "prazo"],
    pergunta: "Por que investir pensando no longo prazo?",
    resposta: "Porque o tempo é o maior aliado dos juros compostos e ele suaviza as quedas: no curto prazo o mercado sobe e desce, mas em prazos de 10, 20, 30 anos a tendência histórica é de crescimento. Quanto mais longe o objetivo, mais você pode ter em renda variável." },

  // ---- Impostos ----
  { slug: "ir-investimentos", categoria: "imposto", prioridade: 2,
    palavras_chave: ["imposto de renda", "ir", "tributacao", "quanto de imposto", "aliquota"],
    pergunta: "Como funciona o Imposto de Renda nos investimentos?",
    resposta: "Na renda fixa e em fundos, o IR é regressivo: quanto mais tempo você deixa, menos paga (de 22,5% até 15% após 2 anos), cobrado só sobre o lucro. Tesouro, CDB e fundos seguem essa tabela; LCI, LCA, dividendos de ações e rendimentos de FIIs são isentos hoje para pessoa física. " + DISC },

  { slug: "isencao-acoes", categoria: "imposto", prioridade: 1,
    palavras_chave: ["isencao acoes", "20 mil", "vender acoes imposto", "isento venda"],
    pergunta: "Tem isenção de imposto ao vender ações?",
    resposta: "Sim: vendas de ações até R$20 mil no mesmo mês são isentas de imposto sobre o ganho, para pessoa física (não vale para day trade nem para ETFs). Acima disso, o imposto incide só sobre o lucro. Vale conferir as regras vigentes, pois podem mudar. " + DISC },

  { slug: "come-cotas", categoria: "imposto", prioridade: 1,
    palavras_chave: ["come cotas", "come-cotas", "antecipacao imposto fundo"],
    pergunta: "O que é come-cotas?",
    resposta: "Come-cotas é uma antecipação do Imposto de Renda que acontece em alguns fundos duas vezes por ano, reduzindo um pouquinho a quantidade de cotas. Não é uma cobrança extra, é o imposto sendo pago aos poucos. Tesouro Direto e ações não têm come-cotas." },

  // ---- Aposentadoria / independência ----
  { slug: "independencia", categoria: "meta", prioridade: 3,
    palavras_chave: ["independencia financeira", "independência", "fire", "viver de renda", "liberdade financeira"],
    pergunta: "O que é independência financeira?",
    resposta: "É quando seus investimentos rendem o suficiente para cobrir seus gastos, ou seja, o dinheiro trabalha por você e trabalhar vira opção. Uma referência comum é acumular cerca de 25 vezes seu gasto anual e sacar por volta de 4% ao ano. É uma maratona de décadas, não uma corrida. " + DISC },

  { slug: "aposentadoria", categoria: "meta", prioridade: 2,
    palavras_chave: ["aposentadoria", "aposentar", "previdencia", "pgbl", "vgbl", "futuro"],
    pergunta: "Como me planejar para a aposentadoria?",
    resposta: "Comece cedo e seja constante — o tempo faz o trabalho pesado. Para o longo prazo, Tesouro IPCA+ e uma carteira diversificada com ações/ETFs costumam aparecer. Planos de previdência (PGBL/VGBL) podem ajudar por benefícios fiscais, mas confira as taxas antes. " + DISC },

  // ---- Dívidas / orçamento ----
  { slug: "dividas-antes", categoria: "pratico", prioridade: 3,
    palavras_chave: ["divida", "dívida", "dividas", "devo dinheiro", "quitar", "endividado"],
    pergunta: "Tenho dívidas, invisto ou pago primeiro?",
    resposta: "Quase sempre pague as dívidas caras primeiro — cartão de crédito e cheque especial cobram juros muito maiores do que qualquer investimento rende. Quitar uma dívida de juros altos é o 'investimento' com melhor retorno garantido que existe. Depois de limpar isso, comece a investir. " + DISC },

  { slug: "cartao-rotativo", categoria: "pratico", prioridade: 2,
    palavras_chave: ["cartao de credito", "cartão", "rotativo", "juros do cartao", "fatura"],
    pergunta: "Por que o cartão de crédito é perigoso?",
    resposta: "O crédito em si não é o vilão — o problema é o juro rotativo, que aparece quando você paga só o mínimo da fatura. Ele está entre os juros mais altos do mercado e vira uma bola de neve contra você. Regra de ouro: pague sempre a fatura inteira." },

  { slug: "orcamento", categoria: "pratico", prioridade: 2,
    palavras_chave: ["orcamento", "orçamento", "controlar gastos", "50 30 20", "planilha", "onde vai meu dinheiro"],
    pergunta: "Como organizar meu orçamento?",
    resposta: "Anote para onde vai o dinheiro por um mês — só enxergar já muda o comportamento. Uma divisão simples é a 50-30-20: 50% necessidades, 30% desejos, 20% para investir e reserva. Ajuste as fatias à sua realidade, mas garanta que a de investir nunca fique em zero." },

  // ---- Conceitos de mercado ----
  { slug: "taxas", categoria: "conceito", prioridade: 2,
    palavras_chave: ["taxa de administracao", "taxas", "custo", "corretagem", "taxa fundo"],
    pergunta: "As taxas importam?",
    resposta: "Muito. Taxa de administração e corretagem parecem pequenas, mas ao longo de décadas corroem uma fatia enorme do seu patrimônio. Prefira produtos com taxa baixa ou zero (Tesouro, muitos ETFs) e desconfie de fundos caros que não entregam resultado melhor." },

  { slug: "liquidez", categoria: "conceito", prioridade: 1,
    palavras_chave: ["liquidez", "resgatar", "sacar", "quando posso tirar"],
    pergunta: "O que é liquidez?",
    resposta: "Liquidez é a facilidade de transformar o investimento em dinheiro na conta. A reserva de emergência precisa de liquidez diária (sacar quando quiser). Já investimentos de longo prazo podem ter menos liquidez em troca de render mais — o importante é combinar cada objetivo com o prazo certo." },

  { slug: "rentabilidade-passada", categoria: "conceito", prioridade: 2,
    palavras_chave: ["rentabilidade passada", "rendeu no passado", "vai render", "historico garante"],
    pergunta: "Se rendeu muito no passado, vai render de novo?",
    resposta: "Não necessariamente. Rentabilidade passada não garante rentabilidade futura — é uma das frases mais importantes do mercado. O histórico ajuda a entender o comportamento de um investimento, mas nunca é promessa. Por isso o foco é diversificar e pensar no longo prazo, não perseguir o que subiu ontem. " + DISC },

  { slug: "fgc", categoria: "conceito", prioridade: 1,
    palavras_chave: ["fgc", "garantia", "banco quebrar", "protecao renda fixa", "250 mil"],
    pergunta: "O que é o FGC?",
    resposta: "O FGC (Fundo Garantidor de Créditos) protege seu dinheiro em investimentos como CDB, LCI, LCA e poupança até R$250 mil por CPF por instituição, caso o banco quebre. Por isso muita gente distribui valores entre bancos. Tesouro Direto não usa FGC porque já é garantido pelo próprio governo." },

  { slug: "rebalanceamento", categoria: "conceito", prioridade: 1,
    palavras_chave: ["rebalancear", "rebalanceamento", "ajustar carteira", "proporcao carteira"],
    pergunta: "O que é rebalancear a carteira?",
    resposta: "Rebalancear é, de tempos em tempos, ajustar sua carteira de volta às proporções planejadas. Se as ações subiram muito e passaram do combinado, você vende um pouco e reforça o que ficou para trás. Isso mantém o risco sob controle e faz você 'comprar na baixa' de forma disciplinada. " + DISC },

  { slug: "poupanca", categoria: "produto", prioridade: 2,
    palavras_chave: ["poupanca", "poupança", "deixar na poupanca", "caderneta"],
    pergunta: "Devo deixar meu dinheiro na poupança?",
    resposta: "A poupança é segura e simples, mas costuma render menos que o Tesouro Selic e outros investimentos de baixo risco, muitas vezes perdendo ou empatando com a inflação. Para a reserva, Tesouro Selic ou um CDB de liquidez diária geralmente rendem mais com segurança parecida. " + DISC },

  { slug: "cenario-2026", categoria: "cenario2026", prioridade: 3,
    palavras_chave: ["2026", "cenario", "cenário", "como esta o mercado", "mercado agora", "economia 2026", "panorama"],
    pergunta: "Como está o mercado em 2026?",
    resposta: "Em 2026 o Brasil segue com juros (Selic) em patamar elevado, o que deixa a renda fixa atraente para segurança e reserva, enquanto a renda variável e os ativos internacionais seguem como motores de longo prazo. Mas cenário muda o tempo todo — por isso a estratégia não é adivinhar o próximo mês, e sim diversificar e aportar sempre. " + DISC },

  { slug: "quanto-para-aposentar", categoria: "meta", prioridade: 1,
    palavras_chave: ["quanto preciso aposentar", "quanto para viver de renda", "quanto juntar", "meta aposentadoria"],
    pergunta: "Quanto preciso juntar para viver de renda?",
    resposta: "Uma referência simples: multiplique seu gasto anual por 25. Se você gasta R$5 mil por mês (R$60 mil por ano), a meta seria cerca de R$1,5 milhão, sacando por volta de 4% ao ano. É uma estimativa educacional para dar direção, não uma regra exata. " + DISC },

  { slug: "comecar-com-pouco", categoria: "pratico", prioridade: 2,
    palavras_chave: ["pouco dinheiro", "comecar com pouco", "100 reais", "sem dinheiro", "salario baixo"],
    pergunta: "Dá para investir com pouco dinheiro?",
    resposta: "Dá sim! Hoje você investe no Tesouro a partir de cerca de R$30, e em muitos ETFs e fundos com quantias baixas. No começo o valor importa menos que criar o hábito — R$50 ou R$100 por mês já colocam os juros compostos para trabalhar. O tempo faz o resto." },
];

/* --------------------------------------------------------------------- */
/*  Casador de perguntas → resposta                                      */
/* --------------------------------------------------------------------- */
function normalize(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // tira acentos
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP = new Set(["de","da","do","e","o","a","os","as","um","uma","que","qual","quais","como","para","pra","por","com","meu","minha","eu","é","e","em","no","na","se","ou","the"]);

/**
 * Escolhe a melhor resposta da base para a pergunta do usuário.
 * Retorna { resposta, slug, score }.
 */
export function answerFromKb(question) {
  const q = normalize(question);
  const qTokens = q.split(" ").filter((t) => t && !STOP.has(t));

  let best = null;
  let bestScore = 0;

  for (const item of MENTOR_KB) {
    let score = 0;
    for (const kw of item.palavras_chave) {
      const nkw = normalize(kw);
      if (!nkw) continue;
      if (q.includes(nkw)) {
        // frase-chave inteira presente vale mais (peso pelo nº de palavras)
        score += 3 + nkw.split(" ").length;
      } else {
        // casamento por palavras individuais da keyword
        const kwTokens = nkw.split(" ").filter((t) => t && !STOP.has(t));
        for (const kt of kwTokens) {
          if (qTokens.includes(kt)) score += 1;
        }
      }
    }
    // leve desempate por prioridade do tema
    score += (item.prioridade || 0) * 0.05;

    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  const threshold = 1.2; // abaixo disso, resposta genérica
  if (!best || bestScore < threshold) {
    return {
      slug: "default",
      score: bestScore,
      resposta:
        "Ótima pergunta! O caminho aqui é sempre o mesmo: reserva de emergência primeiro, depois aportes constantes e diversificados pensando no longo prazo, evitando decisões por impulso. Quer que eu explique algum termo específico de forma simples — tipo ETF, Tesouro, inflação, dividendos ou juros compostos? (Conteúdo educacional, não é recomendação personalizada.)",
    };
  }
  return { slug: best.slug, score: bestScore, resposta: best.resposta };
}

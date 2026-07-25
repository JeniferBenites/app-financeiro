/* ------------------------------------------------------------------ */
/*  Currículo — módulos 13 a 18 (estratégia e comportamento)           */
/* ------------------------------------------------------------------ */

export const MODULOS_3 = [
  /* ================================================================ */
  {
    slug: "juros-compostos",
    titulo: "Juros Compostos",
    icone: "❄️",
    resumo: "A força que constrói (ou destrói) patrimônio.",
    paginas: [
      {
        titulo: "A bola de neve",
        min: 3,
        blocos: [
          { t: "p", x: "Juros compostos são juros que rendem sobre os próprios juros. No primeiro ano parece pouco. No décimo, começa a chamar atenção. No trigésimo, a maior parte do seu patrimônio não é mais o que você depositou — é o que o dinheiro rendeu sozinho." },
          { t: "p", x: "A fórmula é simples: você ganha sobre o valor investido mais tudo o que já foi acumulado. Cada ano parte de uma base maior que a do ano anterior, e é isso que faz a curva subir cada vez mais rápido." },
          { t: "chave", x: "Tempo é o ingrediente mais importante — mais até do que o valor do aporte." },
        ],
      },
      {
        titulo: "O gráfico que muda a cabeça",
        min: 4,
        blocos: [
          { t: "p", x: "Investindo R$ 1.000 por mês a 10% ao ano, veja o que acontece com o total investido e com o patrimônio final:" },
          { t: "lista", x: [
            "10 anos: R$ 120 mil investidos, cerca de R$ 205 mil de patrimônio.",
            "20 anos: R$ 240 mil investidos, cerca de R$ 760 mil.",
            "30 anos: R$ 360 mil investidos, cerca de R$ 2,2 milhões.",
            "40 anos: R$ 480 mil investidos, cerca de R$ 6,3 milhões.",
          ] },
          { t: "p", x: "Repare no detalhe mais importante: entre 30 e 40 anos você depositou apenas R$ 120 mil a mais, mas o patrimônio cresceu mais de R$ 4 milhões. A última década faz mais do que as três primeiras juntas." },
          { t: "chave", x: "A parte mais poderosa dos juros compostos está sempre no fim. É por isso que desistir no meio é tão caro." },
        ],
      },
      {
        titulo: "Os três parâmetros e a regra dos 72",
        min: 4,
        blocos: [
          { t: "p", x: "Só três coisas determinam o resultado: quanto você aporta, por quanto tempo e a que taxa. A que menos importa, surpreendentemente, costuma ser o valor do aporte — porque o tempo tem efeito exponencial, e o aporte, apenas linear." },
          { t: "p", x: "Um atalho útil para pensar rápido é a regra dos 72: divida 72 pela taxa anual e você descobre em quantos anos o dinheiro dobra." },
          { t: "lista", x: [
            "A 6% ao ano: dobra em cerca de 12 anos.",
            "A 10% ao ano: dobra em cerca de 7 anos.",
            "A 12% ao ano: dobra em cerca de 6 anos.",
          ] },
          { t: "exemplo", x: "Com 10% ao ano, R$ 100 mil viram R$ 200 mil em 7 anos, R$ 400 mil em 14 e R$ 800 mil em 21. Nada mudou na sua rotina — só o tempo passou." },
        ],
      },
      {
        titulo: "Os inimigos da bola de neve",
        min: 4,
        blocos: [
          { t: "p", x: "Os juros compostos funcionam nas duas direções, e quatro coisas conseguem sabotá-los." },
          { t: "lista", x: [
            "Resgates no meio do caminho: cada retirada apaga todo o crescimento futuro daquele valor.",
            "Taxas altas: 2% ao ano de taxa pode consumir um terço do patrimônio final em 30 anos.",
            "Inflação: se o ganho nominal não supera os preços, a bola de neve derrete.",
            "Dívidas caras: no cartão, os juros compostos trabalham contra você com a mesma força.",
          ] },
          { t: "p", x: "O caso da dívida merece destaque: R$ 5.000 no rotativo do cartão a 15% ao mês viram mais de R$ 26 mil em um ano. É a mesma matemática que constrói patrimônio, só apontada na sua direção." },
          { t: "chave", x: "Não interrompa a bola de neve. Ela precisa dos anos finais para mostrar do que é capaz." },
        ],
      },
    ],
    quiz: [
      { p: "Juros compostos são:", o: ["Juros sempre sobre o valor inicial", "Juros que rendem sobre os próprios juros", "Uma taxa cobrada pela corretora", "Um tipo de título público"], r: 1, e: "A base de cálculo cresce a cada período — é o efeito bola de neve." },
      { p: "Qual é o fator mais poderoso nos juros compostos?", o: ["O valor do aporte", "O tempo", "A corretora escolhida", "O tipo de conta"], r: 1, e: "Tempo age de forma exponencial; aporte, de forma linear." },
      { p: "Pela regra dos 72, a 12% ao ano o dinheiro dobra em cerca de:", o: ["3 anos", "6 anos", "12 anos", "20 anos"], r: 1, e: "72 dividido por 12 resulta em aproximadamente 6 anos." },
      { p: "Investindo R$ 1.000/mês a 10% ao ano por 30 anos, o patrimônio fica perto de:", o: ["R$ 360 mil", "R$ 760 mil", "R$ 2,2 milhões", "R$ 6,3 milhões"], r: 2, e: "Você deposita R$ 360 mil; o resto é rendimento acumulado." },
      { p: "Entre o ano 30 e o ano 40, o crescimento é enorme porque:", o: ["Os aportes aumentam", "A base acumulada já é muito grande", "A taxa sobe", "Os impostos caem"], r: 1, e: "A parte mais forte dos juros compostos está sempre no fim." },
      { p: "Resgatar dinheiro no meio do caminho é ruim porque:", o: ["Gera multa contratual", "Apaga todo o crescimento futuro daquele valor", "Aumenta a inflação", "Reduz o CDI"], r: 1, e: "Você perde não só o valor, mas os anos de rendimento que ele teria." },
      { p: "Uma taxa de 2% ao ano em 30 anos pode consumir:", o: ["Quase nada", "Cerca de um terço do patrimônio final", "Metade dos aportes", "Apenas o primeiro ano"], r: 1, e: "Custos também são compostos, e por isso pesam muito." },
      { p: "R$ 5.000 no rotativo do cartão a 15% ao mês, em um ano, viram cerca de:", o: ["R$ 5.900", "R$ 9.000", "R$ 26 mil", "R$ 60 mil"], r: 2, e: "Juros compostos contra você são devastadores." },
      { p: "Se o rendimento nominal não supera a inflação:", o: ["A bola de neve continua igual", "O patrimônio real não cresce", "O imposto cai", "O prazo diminui"], r: 1, e: "Só o ganho real aumenta o poder de compra." },
      { p: "A lição prática mais importante do módulo é:", o: ["Buscar a maior taxa possível", "Começar cedo e não interromper", "Aportar só quando o mercado cair", "Concentrar em um ativo"], r: 1, e: "Tempo ininterrupto é o que faz a matemática trabalhar por você." },
    ],
  },

  /* ================================================================ */
  {
    slug: "risco",
    titulo: "Gestão de Risco",
    icone: "🛡️",
    resumo: "Proteger o que você já construiu.",
    paginas: [
      {
        titulo: "Risco não é sinônimo de perigo",
        min: 3,
        blocos: [
          { t: "p", x: "Investir sem risco não existe. Até o dinheiro parado tem risco — o de perder poder de compra para a inflação. A questão nunca é eliminar risco, é escolher quais riscos valem a pena e em que tamanho." },
          { t: "p", x: "Existem riscos diferentes e cada um pede uma defesa diferente." },
          { t: "lista", x: [
            "Risco de mercado: o preço oscila. Defesa: prazo longo e diversificação.",
            "Risco de crédito: quem deve não paga. Defesa: FGC, boas emissoras, diversificar emissores.",
            "Risco de liquidez: não conseguir vender quando precisa. Defesa: reserva em ativos líquidos.",
            "Risco de concentração: apostar tudo em um lugar. Defesa: limites por ativo.",
            "Risco comportamental: você mesmo. Defesa: regras escritas e automação.",
          ] },
        ],
      },
      {
        titulo: "A reserva de emergência é a base de tudo",
        min: 4,
        blocos: [
          { t: "p", x: "A reserva não é um investimento, é um seguro. Ela existe para que nenhum imprevisto — desemprego, saúde, carro quebrado — obrigue você a vender investimentos no pior momento possível." },
          { t: "lista", x: [
            "Tamanho: 3 a 6 meses de gastos para quem tem renda estável; 6 a 12 meses para autônomos.",
            "Onde: Tesouro Selic ou CDB com liquidez diária e rendimento próximo do CDI.",
            "Onde não: ações, FIIs, prefixados longos ou qualquer coisa que possa cair quando você precisar.",
          ] },
          { t: "p", x: "Um detalhe que muita gente erra: calcule a reserva pelos seus gastos, não pela sua renda. Quem gasta R$ 4 mil precisa de R$ 12 mil a R$ 24 mil, mesmo que ganhe R$ 10 mil." },
          { t: "chave", x: "Reserva de emergência não precisa render bem. Precisa estar lá quando você precisar." },
        ],
      },
      {
        titulo: "Limites, regras e o tamanho da aposta",
        min: 4,
        blocos: [
          { t: "p", x: "A maioria das perdas grandes não vem de escolher um ativo ruim, mas de escolher um ativo ruim com uma fatia grande demais do patrimônio. Definir limites antes de investir resolve isso." },
          { t: "lista", x: [
            "Máximo por ação individual: 5% a 10% da carteira.",
            "Máximo por emissor de renda fixa: respeite o teto do FGC de R$ 250 mil.",
            "Ativos muito arriscados (cripto, empresas pequenas): trate como fatia pequena, algo que você aceita perder inteiro.",
            "Nunca invista com dinheiro emprestado.",
          ] },
          { t: "p", x: "Escreva suas regras num papel enquanto está calmo. Elas servem justamente para o dia em que você não estiver — quando o mercado cair 20% e o impulso disser para vender tudo." },
          { t: "chave", x: "Decida o tamanho da aposta antes de ter emoção envolvida." },
        ],
      },
      {
        titulo: "Golpes e promessas impossíveis",
        min: 3,
        blocos: [
          { t: "p", x: "Nenhum risco destrói patrimônio mais rápido que uma fraude. E fraudes se reconhecem por padrões, não por análise complicada." },
          { t: "lista", x: [
            "Promessa de retorno fixo e alto, sem risco. Não existe.",
            "Pressão para decidir rápido ou vaga limitada.",
            "Bônus por indicar amigos — marca registrada de pirâmide.",
            "Empresa sem registro na CVM ou no Banco Central.",
            "Dinheiro transferido para conta de pessoa física.",
          ] },
          { t: "p", x: "Uma verificação de dois minutos no site da CVM evita a maior parte dos prejuízos desse tipo. E lembre: se você não entende de onde vem o rendimento, o rendimento provavelmente vem de você." },
          { t: "chave", x: "Se parece bom demais para ser verdade, a parte falsa é o “bom”." },
        ],
      },
    ],
    quiz: [
      { p: "Deixar dinheiro parado tem risco de:", o: ["Nenhum", "Perder poder de compra para a inflação", "Crédito", "Liquidez"], r: 1, e: "Não existe opção sem risco; parado, o risco é a inflação." },
      { p: "A defesa contra risco de mercado é:", o: ["FGC", "Prazo longo e diversificação", "Liquidez diária", "Alavancagem"], r: 1, e: "Tempo e distribuição diluem a oscilação de preços." },
      { p: "Risco de crédito é:", o: ["O preço oscilar", "Quem deve não pagar", "Não conseguir vender", "A inflação subir"], r: 1, e: "Por isso importam FGC e a qualidade do emissor." },
      { p: "O tamanho da reserva de emergência deve ser calculado com base:", o: ["Na sua renda", "Nos seus gastos mensais", "No valor da carteira", "Na taxa Selic"], r: 1, e: "É o custo de vida que precisa ser coberto durante o imprevisto." },
      { p: "Para autônomos, a reserva recomendada é de:", o: ["1 a 2 meses", "3 meses fixos", "6 a 12 meses de gastos", "24 meses"], r: 2, e: "Renda instável exige um colchão maior." },
      { p: "Onde a reserva de emergência NÃO deve ficar?", o: ["Tesouro Selic", "CDB com liquidez diária", "Ações e FIIs", "Conta remunerada com resgate imediato"], r: 2, e: "Ativos que oscilam podem estar em queda justamente quando você precisar." },
      { p: "Um limite razoável para uma única ação é:", o: ["5% a 10% da carteira", "30%", "50%", "Sem limite se a empresa for boa"], r: 0, e: "Limites evitam que um erro isolado destrua o patrimônio." },
      { p: "Investir com dinheiro emprestado é:", o: ["Estratégia recomendada para acelerar", "Algo a evitar sempre", "Indicado para renda fixa", "Neutro"], r: 1, e: "Alavancagem transforma oscilação normal em risco de ruína." },
      { p: "Qual é um sinal clássico de pirâmide financeira?", o: ["Registro na CVM", "Bônus por indicar amigos e retorno fixo alto", "Rendimento atrelado ao CDI", "Extrato mensal auditado"], r: 1, e: "O dinheiro vem dos novos entrantes, não de atividade real." },
      { p: "Antes de investir em uma empresa desconhecida, o passo mais útil é:", o: ["Ver quantos seguidores ela tem", "Consultar o registro na CVM ou Banco Central", "Testar com valor alto", "Pedir opinião em grupos"], r: 1, e: "Dois minutos de verificação evitam a maior parte das fraudes." },
    ],
  },

  /* ================================================================ */
  {
    slug: "independencia",
    titulo: "Independência Financeira",
    icone: "🕊️",
    resumo: "Quando os investimentos pagam a sua vida.",
    paginas: [
      {
        titulo: "O que é ser independente",
        min: 3,
        blocos: [
          { t: "p", x: "Independência financeira é o ponto em que a renda dos seus investimentos cobre o seu custo de vida. Trabalhar passa a ser uma escolha, não uma necessidade." },
          { t: "p", x: "Note que não se trata de ser rico. Duas pessoas com o mesmo patrimônio podem estar em situações opostas: quem gasta R$ 5 mil por mês precisa de muito menos do que quem gasta R$ 20 mil. Independência é uma relação entre patrimônio e estilo de vida." },
          { t: "chave", x: "Reduzir o custo de vida encurta o caminho tanto quanto aumentar a renda." },
        ],
      },
      {
        titulo: "O número mágico",
        min: 4,
        blocos: [
          { t: "p", x: "Existe uma conta simples e famosa para estimar quanto você precisa: multiplique seu gasto anual por 25. Ela vem da regra dos 4%, que sugere que retirar 4% do patrimônio por ano tende a ser sustentável por décadas." },
          { t: "exemplo", x: "Gasto de R$ 5.000 por mês são R$ 60 mil por ano. Multiplicando por 25, o alvo é R$ 1,5 milhão. Retirando 4% ao ano desse valor, você tem os R$ 60 mil de volta — e o patrimônio tende a se manter." },
          { t: "p", x: "No Brasil, com juros historicamente mais altos, muita gente usa uma taxa de retirada um pouco maior. Mas é prudente ser conservador: taxas menores, como 3,5%, aumentam bastante a margem de segurança." },
          { t: "lista", x: [
            "Gasto de R$ 3 mil/mês: alvo aproximado de R$ 900 mil.",
            "Gasto de R$ 5 mil/mês: alvo aproximado de R$ 1,5 milhão.",
            "Gasto de R$ 10 mil/mês: alvo aproximado de R$ 3 milhões.",
          ] },
        ],
      },
      {
        titulo: "Taxa de poupança: o acelerador real",
        min: 4,
        blocos: [
          { t: "p", x: "O que mais determina quando você chega não é a rentabilidade, é o percentual da renda que você investe. Isso acontece porque investir mais tem efeito duplo: aumenta o patrimônio acumulado e reduz o custo de vida que precisa ser coberto." },
          { t: "lista", x: [
            "Investindo 10% da renda: cerca de 45 anos para a independência.",
            "Investindo 25%: cerca de 30 anos.",
            "Investindo 50%: cerca de 17 anos.",
            "Investindo 65%: cerca de 11 anos.",
          ] },
          { t: "p", x: "Esses números assumem retornos reais moderados e gastos estáveis. Servem para mostrar a ordem de grandeza: cada aumento na taxa de poupança encurta o caminho de forma desproporcional." },
          { t: "chave", x: "A pergunta que mais acelera o processo: quanto da minha renda eu invisto hoje?" },
        ],
      },
      {
        titulo: "Os degraus até lá",
        min: 4,
        blocos: [
          { t: "p", x: "Independência total é longa, e mirar só nela desanima. É melhor comemorar degraus intermediários — cada um deles muda a sua vida antes de você chegar ao fim." },
          { t: "lista", x: [
            "Reserva pronta: você para de viver com medo do imprevisto.",
            "Primeiros R$ 100 mil: o rendimento começa a ser perceptível, e este é o degrau mais difícil.",
            "Independência parcial: os rendimentos cobrem contas básicas como moradia ou mercado.",
            "Independência plena: os rendimentos cobrem tudo. Trabalhar vira escolha.",
          ] },
          { t: "p", x: "Vale um aviso honesto: independência financeira não resolve problemas de propósito. Quem chega lá sem saber o que fazer com o tempo livre costuma se sentir perdido. Vale pensar nisso durante o caminho, não depois." },
          { t: "chave", x: "O caminho já melhora a sua vida muito antes da linha de chegada." },
        ],
      },
    ],
    quiz: [
      { p: "Independência financeira é quando:", o: ["Você tem R$ 1 milhão", "A renda dos investimentos cobre seu custo de vida", "Você não tem dívidas", "Você se aposenta pelo INSS"], r: 1, e: "É uma relação entre patrimônio e gastos, não um valor absoluto." },
      { p: "A regra dos 4% sugere multiplicar o gasto anual por:", o: ["10", "15", "25", "40"], r: 2, e: "Gasto anual × 25 estima o patrimônio necessário." },
      { p: "Com gasto de R$ 5.000 por mês, o alvo aproximado é:", o: ["R$ 600 mil", "R$ 1,5 milhão", "R$ 3 milhões", "R$ 5 milhões"], r: 1, e: "R$ 60 mil por ano multiplicados por 25." },
      { p: "Reduzir o custo de vida ajuda porque:", o: ["Aumenta a rentabilidade", "Diminui o patrimônio necessário e aumenta o aporte", "Reduz impostos", "Elimina a inflação"], r: 1, e: "Tem efeito duplo: exige menos e permite investir mais." },
      { p: "O fator que mais define o tempo até a independência é:", o: ["A rentabilidade da carteira", "O percentual da renda que você investe", "A corretora escolhida", "O tipo de ação"], r: 1, e: "A taxa de poupança pesa mais que a rentabilidade." },
      { p: "Investindo cerca de 50% da renda, o tempo estimado é de:", o: ["5 anos", "Cerca de 17 anos", "30 anos", "45 anos"], r: 1, e: "Taxas de poupança altas encurtam o caminho de forma desproporcional." },
      { p: "Investindo apenas 10% da renda, a estimativa fica próxima de:", o: ["15 anos", "25 anos", "45 anos", "60 anos"], r: 2, e: "Com aporte baixo, o processo depende quase todo do tempo." },
      { p: "Uma taxa de retirada de 3,5% em vez de 4% significa:", o: ["Mais risco", "Mais margem de segurança", "Menos patrimônio necessário", "Isenção de imposto"], r: 1, e: "Retirar menos aumenta a chance de o patrimônio durar." },
      { p: "Qual degrau costuma ser o mais difícil?", o: ["A reserva de emergência", "Os primeiros R$ 100 mil", "De R$ 500 mil para R$ 1 milhão", "O último milhão"], r: 1, e: "No começo, quase todo o crescimento vem do seu aporte." },
      { p: "Independência parcial significa:", o: ["Ter metade do patrimônio alvo", "Os rendimentos cobrirem parte das contas, como moradia", "Trabalhar meio período", "Ter renda fixa apenas"], r: 1, e: "É um degrau intermediário que já reduz muito a pressão financeira." },
    ],
  },

  /* ================================================================ */
  {
    slug: "psicologia",
    titulo: "Psicologia do Investidor",
    icone: "🧭",
    resumo: "Seu maior adversário é você mesmo.",
    paginas: [
      {
        titulo: "O inimigo mora dentro",
        min: 3,
        blocos: [
          { t: "p", x: "Estudos de comportamento mostram algo desconfortável: o investidor médio ganha menos que os próprios fundos em que investe. O motivo não é escolha ruim de ativo — é entrar depois da alta e sair depois da queda." },
          { t: "p", x: "Nosso cérebro foi treinado para fugir de perigo imediato, não para tolerar um extrato negativo por dois anos. Investir bem exige agir contra vários instintos que, em outras situações, nos protegem." },
          { t: "chave", x: "A distância entre o retorno do mercado e o seu retorno tem nome: comportamento." },
        ],
      },
      {
        titulo: "Os vieses que mais custam dinheiro",
        min: 4,
        blocos: [
          { t: "lista", x: [
            "Aversão à perda: perder R$ 1.000 dói cerca de duas vezes mais do que ganhar R$ 1.000 alegra. Resultado: gente que vende no fundo para “parar de sofrer”.",
            "Efeito manada: se todos estão comprando, parece seguro. É justo quando o preço está mais caro.",
            "Excesso de confiança: dois acertos seguidos criam a ilusão de habilidade, e aí vem a aposta grande.",
            "Viés de confirmação: você só lê notícias que concordam com o que já comprou.",
            "Ancoragem: você trava no preço que pagou e se recusa a decidir com base no presente.",
            "Contabilidade mental: tratar o 13º como “dinheiro extra” que pode ser gasto sem culpa.",
          ] },
          { t: "p", x: "Perceber o viés não elimina ele. O que funciona é criar regras e automações que reduzam a quantidade de decisões tomadas no calor do momento." },
        ],
      },
      {
        titulo: "O ciclo emocional do mercado",
        min: 4,
        blocos: [
          { t: "p", x: "Todo ciclo de alta e baixa passa pelas mesmas emoções, na mesma ordem. Reconhecer onde você está ajuda a não agir errado." },
          { t: "lista", x: [
            "Otimismo → empolgação → euforia: o ponto de euforia é normalmente o de maior risco financeiro, quando tudo parece fácil.",
            "Ansiedade → negação → medo: os preços caem e você diz que é temporário.",
            "Desespero → pânico → capitulação: aqui a maioria vende. É, historicamente, o ponto de maior oportunidade.",
            "Desânimo → esperança → alívio: a recuperação começa sem que quase ninguém perceba.",
          ] },
          { t: "chave", x: "O maior risco está no momento de euforia. A maior oportunidade, no de pânico." },
        ],
      },
      {
        titulo: "Como se proteger de si mesmo",
        min: 4,
        blocos: [
          { t: "p", x: "A solução não é ter mais disciplina do que os outros. É construir um sistema que funcione mesmo nos seus dias ruins." },
          { t: "lista", x: [
            "Automatize o aporte: nenhuma decisão mensal, nenhum debate interno.",
            "Escreva sua estratégia em uma página, com os motivos. Leia antes de qualquer mudança.",
            "Reduza a frequência: olhar a carteira uma vez por mês é suficiente e melhora resultados.",
            "Crie um intervalo obrigatório: qualquer decisão fora do plano só pode ser executada depois de 48 horas.",
            "Registre suas decisões e o que sentia na hora. Reler isso um ano depois ensina mais que qualquer curso.",
            "Aceite que quedas de 20% a 30% são normais e vão acontecer várias vezes na sua vida de investidor.",
          ] },
          { t: "chave", x: "Não confie na sua calma futura. Construa regras enquanto você está calmo agora." },
        ],
      },
    ],
    quiz: [
      { p: "Por que o investidor médio ganha menos que os fundos em que investe?", o: ["Por causa das taxas", "Porque entra depois da alta e sai depois da queda", "Por causa dos impostos", "Porque diversifica demais"], r: 1, e: "A diferença é explicada por comportamento, não por escolha de ativo." },
      { p: "Aversão à perda significa que:", o: ["Perder dói cerca de duas vezes mais do que ganhar alegra", "Investidores gostam de risco", "Perdas são sempre maiores que ganhos", "Você evita renda fixa"], r: 0, e: "É o que leva muita gente a vender exatamente no fundo." },
      { p: "Efeito manada é:", o: ["Diversificar entre setores", "Seguir o que todos estão fazendo", "Rebalancear a carteira", "Comprar só renda fixa"], r: 1, e: "Costuma levar a comprar caro, quando o entusiasmo é máximo." },
      { p: "Viés de confirmação é:", o: ["Buscar só informações que concordam com sua posição", "Confirmar ordens duas vezes", "Confiar na corretora", "Rever a estratégia todo mês"], r: 0, e: "Impede que você enxergue riscos reais do que já comprou." },
      { p: "Ancoragem, ao investir, é:", o: ["Travar no preço que você pagou", "Fixar um aporte mensal", "Manter renda fixa como base", "Escolher um índice de referência"], r: 0, e: "O preço pago não deveria influenciar a decisão de hoje." },
      { p: "No ciclo emocional, o momento de maior risco financeiro é:", o: ["O pânico", "A euforia", "O desânimo", "A esperança"], r: 1, e: "Quando tudo parece fácil, os preços costumam estar mais altos." },
      { p: "O momento historicamente de maior oportunidade é:", o: ["A euforia", "A capitulação e o pânico", "O otimismo inicial", "O alívio"], r: 1, e: "É quando a maioria vende e os preços ficam descontados." },
      { p: "Qual prática mais protege contra decisões impulsivas?", o: ["Acompanhar cotações de hora em hora", "Automatizar aportes e ter regras escritas", "Seguir influenciadores", "Trocar de estratégia a cada trimestre"], r: 1, e: "Sistema funciona nos dias em que a disciplina falha." },
      { p: "Com que frequência é saudável olhar a carteira?", o: ["Várias vezes por dia", "Cerca de uma vez por mês", "A cada hora em dias de queda", "Nunca mais"], r: 1, e: "Menos ruído significa menos decisões ruins." },
      { p: "Quedas de 20% a 30% na bolsa devem ser tratadas como:", o: ["Sinal de que a estratégia falhou", "Eventos normais que acontecerão várias vezes", "Momento de vender tudo", "Erro da corretora"], r: 1, e: "Esperar por elas é parte de um plano realista." },
    ],
  },

  /* ================================================================ */
  {
    slug: "erros",
    titulo: "Erros mais comuns",
    icone: "⚠️",
    resumo: "O que evitar para não perder dinheiro.",
    paginas: [
      {
        titulo: "Os erros do começo",
        min: 4,
        blocos: [
          { t: "p", x: "A boa notícia sobre erros de iniciante é que eles são previsíveis. Quase todo mundo comete os mesmos, e conhecê-los antes economiza anos." },
          { t: "lista", x: [
            "Investir antes de ter reserva de emergência: o primeiro imprevisto desmonta tudo.",
            "Investir tendo dívida de cartão: nada rende mais do que os juros que você está pagando.",
            "Esperar “o momento certo” para começar: quem espera perde os anos que mais importam.",
            "Colocar tudo de uma vez por medo de perder oportunidade.",
            "Achar que precisa de muito dinheiro para começar: dá para começar com R$ 30.",
          ] },
          { t: "chave", x: "O melhor momento para começar foi ontem. O segundo melhor é hoje, com o valor que você tem." },
        ],
      },
      {
        titulo: "Os erros de estratégia",
        min: 4,
        blocos: [
          { t: "lista", x: [
            "Concentrar demais: 50% da carteira em uma ação transforma um erro em desastre.",
            "Investir em algo que você não entende, só porque alguém recomendou.",
            "Perseguir o que mais subiu no ano passado — normalmente é comprar no topo.",
            "Girar a carteira toda hora: cada troca gera custo, imposto e reinicia a contagem do tempo.",
            "Ignorar taxas: 2% ao ano parece pequeno e come um terço do resultado em 30 anos.",
            "Confundir prazo: colocar dinheiro de curto prazo em ativo volátil.",
          ] },
          { t: "p", x: "Um erro silencioso merece destaque: não ter estratégia nenhuma. Comprar um pouco de tudo a cada dica recebida gera uma carteira sem lógica, impossível de avaliar e fácil de abandonar." },
        ],
      },
      {
        titulo: "Os erros emocionais e os golpes",
        min: 4,
        blocos: [
          { t: "lista", x: [
            "Vender no pânico: transforma oscilação temporária em perda definitiva.",
            "Parar de aportar quando o mercado cai — justo quando os preços estão melhores.",
            "Dobrar a aposta para recuperar prejuízo rápido.",
            "Usar dinheiro emprestado ou alavancagem sem entender o risco de ruína.",
            "Acreditar em retorno garantido e alto: é o roteiro de toda fraude.",
            "Entrar em esquema com bônus por indicação de amigos.",
          ] },
          { t: "p", x: "Vale repetir porque é o mais caro de todos: se você não entende de onde vem o rendimento prometido, o rendimento vem de você." },
          { t: "chave", x: "Perder dinheiro devagar por taxas é ruim. Perder tudo em uma fraude é irreversível." },
        ],
      },
      {
        titulo: "A lista de verificação antes de investir",
        min: 3,
        blocos: [
          { t: "p", x: "Antes de qualquer aporte novo, cinco perguntas resolvem a maioria dos problemas." },
          { t: "lista", x: [
            "1. Eu já tenho reserva de emergência e estou livre de dívida cara?",
            "2. Eu entendo como esse investimento ganha dinheiro?",
            "3. Quando eu vou precisar desse dinheiro — e o prazo do ativo combina com isso?",
            "4. Quanto isso vai representar da minha carteira? Estou dentro do meu limite?",
            "5. Se cair 30% amanhã, eu consigo dormir e continuar aportando?",
          ] },
          { t: "p", x: "Se alguma resposta for “não sei”, a resposta certa é esperar e estudar. Deixar de fazer um bom investimento custa pouco; fazer um ruim custa caro." },
          { t: "chave", x: "Investir bem é, na maior parte do tempo, evitar erros grandes." },
        ],
      },
    ],
    quiz: [
      { p: "Qual é o erro mais comum de quem está começando?", o: ["Escolher o ETF errado", "Investir antes de ter reserva de emergência", "Diversificar demais", "Aportar todo mês"], r: 1, e: "Sem reserva, o primeiro imprevisto desmonta a carteira." },
      { p: "Ter dívida de cartão e investir ao mesmo tempo é ruim porque:", o: ["O banco não permite", "Os juros da dívida superam qualquer rendimento", "Reduz o score", "Aumenta o imposto"], r: 1, e: "Quitar a dívida é o melhor retorno disponível." },
      { p: "Esperar “o momento certo” para começar custa caro porque:", o: ["As taxas sobem", "Você perde os anos que mais importam para os juros compostos", "O mercado fecha", "O CDI cai"], r: 1, e: "Tempo é o recurso que não se recupera." },
      { p: "Colocar 50% da carteira em uma única ação é:", o: ["Estratégia de foco recomendada", "Concentração que transforma erro em desastre", "Diversificação suficiente", "Indicado para iniciantes"], r: 1, e: "Limites por ativo existem justamente para isso." },
      { p: "Perseguir o ativo que mais subiu no ano passado normalmente significa:", o: ["Comprar barato", "Comprar no topo", "Reduzir risco", "Diversificar"], r: 1, e: "Retorno passado não se repete por decreto." },
      { p: "Girar a carteira com frequência gera:", o: ["Mais rendimento", "Custos, impostos e reinício da contagem de tempo", "Isenção fiscal", "Menos risco"], r: 1, e: "Movimento excessivo destrói retorno de forma silenciosa." },
      { p: "Uma taxa de 2% ao ano ao longo de 30 anos pode consumir:", o: ["Nada relevante", "Cerca de um terço do patrimônio final", "Só o primeiro aporte", "Metade dos dividendos"], r: 1, e: "Custos também são compostos." },
      { p: "Parar de aportar quando o mercado cai é ruim porque:", o: ["Gera multa", "Você deixa de comprar justamente quando está mais barato", "Aumenta impostos", "Reduz a liquidez"], r: 1, e: "Quedas são as melhores oportunidades de quem acumula." },
      { p: "Dobrar a aposta para recuperar um prejuízo rápido é:", o: ["Estratégia de recuperação válida", "Comportamento de risco que costuma ampliar a perda", "Rebalanceamento", "Diversificação"], r: 1, e: "É a mesma lógica de apostador tentando virar o jogo." },
      { p: "Se você não entende de onde vem o rendimento prometido:", o: ["Provavelmente ele vem de você", "É porque é um produto sofisticado", "Basta confiar no vendedor", "É sinal de exclusividade"], r: 0, e: "É a assinatura de fraudes e pirâmides." },
    ],
  },

  /* ================================================================ */
  {
    slug: "aposentadoria",
    titulo: "Aposentadoria",
    icone: "🌅",
    resumo: "Construir hoje a sua liberdade de amanhã.",
    paginas: [
      {
        titulo: "Por que o INSS não basta",
        min: 4,
        blocos: [
          { t: "p", x: "A aposentadoria pública tem teto — em 2026 pouco acima de R$ 8 mil — e a média paga fica bem abaixo disso, perto de um a dois salários mínimos. Se você ganha mais que o teto, aposentar-se só pelo INSS significa uma queda enorme de padrão de vida." },
          { t: "p", x: "Existe também um fator demográfico: as pessoas vivem mais e nascem menos crianças. Isso significa menos trabalhadores sustentando mais aposentados, e é a razão pela qual as regras vêm ficando mais duras a cada reforma." },
          { t: "chave", x: "Trate o INSS como um complemento, não como o plano principal." },
        ],
      },
      {
        titulo: "Quanto você vai precisar",
        min: 4,
        blocos: [
          { t: "p", x: "Comece de trás para frente: quanto você quer receber por mês? Multiplique por 12 e depois por 25. Esse é o patrimônio aproximado que sustenta essa renda com retiradas de 4% ao ano." },
          { t: "exemplo", x: "Para uma renda de R$ 8.000 por mês, sem contar o INSS: R$ 96 mil por ano, multiplicados por 25, resultam em cerca de R$ 2,4 milhões. Se você espera R$ 3 mil do INSS, precisa gerar R$ 5 mil, o que reduz o alvo para cerca de R$ 1,5 milhão." },
          { t: "p", x: "E o efeito do tempo aqui é brutal. Para chegar a R$ 2,4 milhões rendendo 8% reais ao ano: começando aos 25 anos, o aporte necessário é modesto; começando aos 45, ele se multiplica várias vezes. É o mesmo objetivo com esforço completamente diferente." },
          { t: "chave", x: "Cada década de atraso multiplica o aporte necessário — não soma, multiplica." },
        ],
      },
      {
        titulo: "Onde investir para a aposentadoria",
        min: 4,
        blocos: [
          { t: "p", x: "O dinheiro da aposentadoria tem a maior vantagem possível: prazo. Isso permite aceitar oscilação em troca de retorno real maior, e pede ativos que protejam da inflação por décadas." },
          { t: "lista", x: [
            "Tesouro IPCA+ com vencimentos longos: garante ganho acima da inflação.",
            "ETFs de índice, Brasil e global: crescimento com custo baixo e diversificação ampla.",
            "Fundos imobiliários: renda mensal isenta que pode substituir salário no futuro.",
            "Ações pagadoras de dividendos: fluxo crescente de renda ao longo do tempo.",
            "Previdência privada PGBL ou VGBL: útil principalmente pelo benefício fiscal.",
          ] },
          { t: "p", x: "Sobre previdência privada: PGBL permite deduzir até 12% da renda bruta na declaração completa do IR, o que é vantajoso para quem tem renda mais alta. VGBL faz mais sentido na declaração simplificada. Em ambos, escolha planos com taxa de administração baixa e sem taxa de carregamento — planos caros anulam o benefício fiscal." },
        ],
      },
      {
        titulo: "A transição e a fase de retirada",
        min: 4,
        blocos: [
          { t: "p", x: "Chegar ao número não é o fim do trabalho. A forma como você retira o dinheiro determina se ele vai durar." },
          { t: "lista", x: [
            "Nos 5 anos antes de parar, migre parte da carteira para ativos menos voláteis.",
            "Mantenha de 2 a 3 anos de despesas em renda fixa líquida, para não vender ações em crise.",
            "Retire entre 3,5% e 4% ao ano, ajustando pela inflação.",
            "Em anos de queda forte, reduza a retirada se possível — isso prolonga muito a vida da carteira.",
            "Mantenha uma parte em ativos de crescimento: a aposentadoria pode durar 30 anos e a inflação continua correndo.",
          ] },
          { t: "p", x: "Por último, algo que nenhuma planilha calcula: pense no que você vai fazer com o tempo. Aposentadoria tranquila é a soma de dinheiro suficiente com propósito para os dias — o dinheiro compra as opções, mas não escolhe por você." },
          { t: "chave", x: "Comece hoje, com o valor que você consegue. Tempo é o único ingrediente que não se compra depois." },
        ],
      },
    ],
    quiz: [
      { p: "Por que o INSS geralmente não é suficiente?", o: ["Porque não existe mais", "Porque tem teto e a média paga é baixa", "Porque é isento de imposto", "Porque exige 50 anos de contribuição"], r: 1, e: "Quem ganha acima do teto sofre queda forte de padrão de vida." },
      { p: "O fator demográfico que pressiona a Previdência é:", o: ["Mais nascimentos e menos idosos", "Pessoas vivendo mais e menos nascimentos", "Aumento da informalidade apenas", "Queda dos juros"], r: 1, e: "Menos trabalhadores sustentam mais aposentados." },
      { p: "Para uma renda de R$ 8.000 por mês, o patrimônio alvo pela regra dos 4% é de cerca de:", o: ["R$ 960 mil", "R$ 1,5 milhão", "R$ 2,4 milhões", "R$ 5 milhões"], r: 2, e: "R$ 96 mil por ano multiplicados por 25." },
      { p: "Contar com R$ 3 mil do INSS, dentro de uma meta de R$ 8 mil, faz o alvo:", o: ["Aumentar", "Cair para cerca de R$ 1,5 milhão", "Ficar igual", "Dobrar"], r: 1, e: "Você só precisa gerar a diferença com investimentos." },
      { p: "Começar 20 anos mais tarde exige um aporte:", o: ["Um pouco maior", "Várias vezes maior", "Igual", "Menor, por causa dos juros"], r: 1, e: "O efeito do tempo é exponencial, não linear." },
      { p: "Qual título é o mais adequado para objetivos de aposentadoria?", o: ["Tesouro Selic", "Tesouro IPCA+ longo", "CDB de liquidez diária", "Poupança"], r: 1, e: "Garante ganho real acima da inflação por décadas." },
      { p: "O PGBL é mais vantajoso para quem:", o: ["Faz a declaração simplificada", "Faz a declaração completa e pode deduzir até 12% da renda", "Não paga imposto de renda", "Investe menos de R$ 100 por mês"], r: 1, e: "O benefício fiscal é a principal razão para escolher PGBL." },
      { p: "Ao escolher um plano de previdência privada, o mais importante é:", o: ["A marca do banco", "Taxas baixas e ausência de taxa de carregamento", "O nome do fundo", "A promessa de rentabilidade"], r: 1, e: "Planos caros consomem justamente o benefício fiscal." },
      { p: "Na fase de retirada, manter de 2 a 3 anos de despesas em renda fixa líquida serve para:", o: ["Aumentar o rendimento", "Não precisar vender ações durante uma crise", "Reduzir impostos", "Antecipar o INSS"], r: 1, e: "Evita que uma queda de mercado force vendas ruins." },
      { p: "Durante a aposentadoria, manter parte em ativos de crescimento é importante porque:", o: ["A inflação continua corroendo por décadas", "Renda fixa é proibida", "Aumenta o benefício do INSS", "Elimina o risco"], r: 0, e: "A aposentadoria pode durar 30 anos — o dinheiro precisa continuar crescendo." },
    ],
  },
];

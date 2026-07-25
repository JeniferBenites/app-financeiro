/* ------------------------------------------------------------------ */
/*  Currículo — módulos 1 a 6 (fundamentos)                            */
/*                                                                     */
/*  Formato de cada módulo:                                            */
/*   slug, titulo, icone, resumo                                       */
/*   paginas: [{ titulo, min, blocos: [...] }]                         */
/*   quiz: 10 perguntas { p, o: [4 opções], r: índice correto, e }      */
/*                                                                     */
/*  Blocos: { t: "p" | "chave" | "lista" | "exemplo", x }              */
/* ------------------------------------------------------------------ */

export const MODULOS_1 = [
  /* ================================================================ */
  {
    slug: "mentalidade",
    titulo: "Mentalidade Financeira",
    icone: "🧠",
    resumo: "Como pensar como um investidor de longo prazo.",
    paginas: [
      {
        titulo: "Dinheiro é tempo guardado",
        min: 3,
        blocos: [
          { t: "p", x: "Todo mês você troca horas da sua vida por dinheiro. Quando você gasta tudo o que recebe, você troca essas horas por coisas que se consomem rápido. Quando você investe uma parte, você guarda um pedaço daquelas horas para o seu eu do futuro." },
          { t: "p", x: "É por isso que investir não é sobre ser rico. É sobre comprar liberdade: a liberdade de escolher o que fazer com o seu tempo mais tarde, sem depender de um salário que precisa cair todo dia 5." },
          { t: "chave", x: "Investir não é o que sobra no fim do mês. É o que você separa no começo." },
          { t: "p", x: "A maioria das pessoas faz a conta assim: salário − gastos = o que sobra para investir. Só que quase nunca sobra. Quem constrói patrimônio inverte a conta: salário − investimento = o que posso gastar." },
        ],
      },
      {
        titulo: "A diferença entre ficar rico e ficar tranquilo",
        min: 3,
        blocos: [
          { t: "p", x: "Existe uma fantasia de que investir é achar a ação que multiplica por dez em um ano. Isso acontece com pouquíssima gente e quase sempre por sorte. O que funciona para praticamente todo mundo é bem mais chato: pouco dinheiro, todos os meses, por muitos anos." },
          { t: "p", x: "A boa notícia é que o chato funciona. Uma pessoa que investe R$ 500 por mês com disciplina por 25 anos costuma terminar em uma situação muito melhor do que alguém que tenta adivinhar o próximo grande acerto e desiste no primeiro susto." },
          { t: "lista", x: [
            "Constância vence intensidade: aportar sempre importa mais do que aportar muito uma vez.",
            "Tempo é o seu maior aliado — e ele só funciona se você começar.",
            "O objetivo não é acertar tudo, é errar pequeno e continuar.",
          ] },
          { t: "exemplo", x: "Duas pessoas investem R$ 500/mês. A primeira começa aos 25 anos e para aos 35 (10 anos aportando). A segunda começa aos 35 e vai até os 60 (25 anos aportando). Aos 60, com juros parecidos, as duas terminam com valores próximos — só porque a primeira deu mais tempo ao dinheiro." },
        ],
      },
      {
        titulo: "Ativos e passivos: o que enriquece e o que consome",
        min: 3,
        blocos: [
          { t: "p", x: "Ativo é tudo que coloca dinheiro no seu bolso ou cresce de valor com o tempo: investimentos, uma reserva rendendo, um curso que aumenta o seu salário. Passivo é tudo que tira dinheiro do seu bolso todo mês: parcela de carro, assinatura esquecida, dívida do cartão." },
          { t: "p", x: "Enriquecer, na prática, é aumentar a distância entre esses dois times. Não existe mágica: é comprar mais ativos e evitar acumular passivos que você não precisa." },
          { t: "chave", x: "A pergunta certa antes de uma compra grande: isso vai me dar dinheiro ou vai me custar dinheiro todo mês?" },
          { t: "p", x: "Cuidado especial com o crédito. Juros de cartão e cheque especial no Brasil passam facilmente de 300% ao ano. Nenhum investimento do mundo rende isso. Por isso pagar essas dívidas é, na prática, o melhor investimento possível." },
        ],
      },
      {
        titulo: "A ordem certa dos passos",
        min: 4,
        blocos: [
          { t: "p", x: "Muita gente quer começar comprando ações porque é a parte divertida. Mas se você investe em ações antes de ter uma reserva, o primeiro imprevisto vai te obrigar a vender no pior momento — e aí o prejuízo vira definitivo." },
          { t: "lista", x: [
            "1. Sair das dívidas caras (cartão, cheque especial, empréstimo pessoal).",
            "2. Montar a reserva de emergência: 3 a 6 meses dos seus gastos, em algo seguro e que você possa resgatar rápido.",
            "3. Automatizar um aporte mensal — mesmo pequeno.",
            "4. Diversificar aos poucos, aprendendo um assunto por vez.",
            "5. Só então pensar em coisas mais arriscadas, e sempre com uma fatia pequena.",
          ] },
          { t: "p", x: "Essa ordem existe para proteger você de si mesmo. A reserva não está lá para render muito — está lá para você nunca precisar desmontar seus investimentos com pressa." },
          { t: "chave", x: "Primeiro segurança, depois crescimento. Nunca o contrário." },
        ],
      },
    ],
    quiz: [
      { p: "Qual conta descreve melhor a mentalidade de quem constrói patrimônio?", o: ["Salário − gastos = o que sobra para investir", "Salário − investimento = o que posso gastar", "Salário − investimento = o que vou emprestar", "Gastos − salário = dívida planejada"], r: 1, e: "Investir primeiro (e viver com o resto) é o que garante que sempre sobre algo para o futuro." },
      { p: "O que é um ativo?", o: ["Tudo que você compra parcelado", "Algo que tira dinheiro do bolso todo mês", "Algo que coloca dinheiro no bolso ou cresce de valor", "Qualquer coisa de valor alto"], r: 2, e: "Ativo trabalha a seu favor: rende, valoriza ou aumenta sua capacidade de ganhar." },
      { p: "Antes de investir em ações, qual passo vem primeiro?", o: ["Comprar dólar", "Quitar dívidas caras e montar a reserva de emergência", "Abrir conta em cinco corretoras", "Estudar análise de gráficos"], r: 1, e: "Sem reserva, qualquer imprevisto força a venda dos investimentos no pior momento." },
      { p: "Por que pagar a dívida do cartão de crédito costuma ser o melhor investimento?", o: ["Porque melhora seu score", "Porque os juros do cartão são maiores que qualquer rendimento", "Porque libera limite para comprar mais", "Porque o banco devolve parte dos juros"], r: 1, e: "Juros de cartão passam de 300% ao ano; nenhum investimento acompanha isso." },
      { p: "Uma reserva de emergência deve cobrir aproximadamente:", o: ["1 mês de gastos", "3 a 6 meses de gastos", "2 anos de gastos", "O valor de um carro"], r: 1, e: "Três a seis meses dá tempo de resolver imprevistos sem desmontar a carteira." },
      { p: "O que importa mais no longo prazo?", o: ["Acertar o momento exato de comprar", "Aportar valores altos uma única vez", "Aportar de forma constante por muitos anos", "Escolher a ação da moda"], r: 2, e: "Constância e tempo explicam a maior parte do resultado de um investidor comum." },
      { p: "Começar a investir dez anos mais cedo, mesmo com pouco, importa porque:", o: ["As taxas ficam menores", "O dinheiro tem mais tempo para render sobre si mesmo", "Você paga menos imposto", "As corretoras dão bônus"], r: 1, e: "Tempo é o ingrediente que os juros compostos usam para multiplicar." },
      { p: "Qual destes é um passivo?", o: ["Um Tesouro IPCA+ na carteira", "A reserva de emergência", "A parcela do financiamento de um carro que você não precisa", "Um ETF de índice"], r: 2, e: "Passivo é o que consome dinheiro do seu bolso mês após mês." },
      { p: "A principal função da reserva de emergência é:", o: ["Render mais que a bolsa", "Proteger você de vender investimentos com pressa", "Servir de entrada para um imóvel", "Bater a inflação no longo prazo"], r: 1, e: "Ela é um colchão de segurança, não um motor de rentabilidade." },
      { p: "Investir, no fundo, serve para comprar:", o: ["Status", "Liberdade e tempo no futuro", "Sorte", "Proteção contra impostos"], r: 1, e: "O patrimônio é o que permite escolher como usar o próprio tempo mais tarde." },
    ],
  },

  /* ================================================================ */
  {
    slug: "organizacao",
    titulo: "Organização Financeira",
    icone: "📊",
    resumo: "Enxergar para onde vai o seu dinheiro.",
    paginas: [
      {
        titulo: "Você não controla o que não vê",
        min: 3,
        blocos: [
          { t: "p", x: "A maior parte das pessoas que sente que “o dinheiro desaparece” não gasta demais em coisas grandes. Gasta em coisas pequenas e frequentes que ninguém soma. O problema quase nunca é falta de disciplina — é falta de visibilidade." },
          { t: "p", x: "Antes de qualquer planilha complicada, o primeiro passo é ridiculamente simples: por um mês, anote tudo. Aplicativo, papel, bloco de notas do celular, tanto faz. O objetivo não é julgar, é enxergar." },
          { t: "chave", x: "Um mês de anotações revela mais sobre a sua vida financeira do que um ano de intenções." },
        ],
      },
      {
        titulo: "Gastos fixos, variáveis e invisíveis",
        min: 3,
        blocos: [
          { t: "p", x: "Depois de anotar, separe em três grupos. Fixos são os que chegam todo mês igual: aluguel, luz, plano de celular, escola. Variáveis mudam: mercado, transporte, lazer, farmácia. E existe um terceiro grupo, o mais perigoso: os invisíveis." },
          { t: "lista", x: [
            "Assinaturas que você esqueceu que existem.",
            "Taxas de conta e de cartão que passam batido.",
            "Compras por impulso de valor baixo, várias vezes por semana.",
            "Parcelas antigas que continuam pesando no cartão.",
          ] },
          { t: "p", x: "Os invisíveis são a melhor oportunidade que existe, porque cortá-los não dói. Ninguém fica mais infeliz por cancelar um serviço que não usava." },
          { t: "exemplo", x: "Três assinaturas esquecidas de R$ 30 e um café diário de R$ 8 somam cerca de R$ 330 por mês. Investidos por 20 anos a 10% ao ano, isso passa de R$ 250 mil. É o mesmo dinheiro, só com destino diferente." },
        ],
      },
      {
        titulo: "Um orçamento que você consegue seguir",
        min: 4,
        blocos: [
          { t: "p", x: "Orçamento apertado demais fracassa igual dieta radical. É melhor um plano folgado que dura anos do que um plano perfeito que dura três semanas." },
          { t: "p", x: "Uma referência simples é a regra 50/30/20: metade da renda para necessidades, 30% para o que você gosta e 20% para investir e quitar dívidas. Se hoje o seu 20% é 5%, comece com 5% — o número certo é o que você consegue manter." },
          { t: "chave", x: "O melhor orçamento não é o mais eficiente, é o que sobrevive ao mês difícil." },
          { t: "p", x: "E deixe um espaço para diversão. Orçamento sem prazer nenhum vira revolta, e revolta vira compra por impulso. Planejar lazer é parte de um plano que funciona." },
        ],
      },
      {
        titulo: "Automatize e esqueça",
        min: 3,
        blocos: [
          { t: "p", x: "Força de vontade é um recurso que acaba. Sistema não. Por isso o passo mais poderoso da organização financeira é tirar a decisão das suas mãos: programe uma transferência automática para o investimento no dia em que o salário cai." },
          { t: "p", x: "Se o dinheiro sai antes de você ver, você se acostuma a viver com o que ficou. É o mesmo mecanismo que faz ninguém sentir falta do desconto do INSS: o que não passa pela conta corrente não é gasto." },
          { t: "lista", x: [
            "Aporte automático no dia do salário.",
            "Contas fixas em débito automático, para não pagar juros por esquecimento.",
            "Uma revisão rápida por mês — 15 minutos bastam.",
          ] },
          { t: "chave", x: "Decida uma vez, no lugar de decidir todo mês." },
        ],
      },
    ],
    quiz: [
      { p: "Qual é o primeiro passo para organizar a vida financeira?", o: ["Montar uma planilha complexa", "Anotar todos os gastos por um mês", "Cortar todo o lazer", "Pedir um empréstimo para quitar tudo"], r: 1, e: "Visibilidade vem antes de controle: primeiro enxergar, depois ajustar." },
      { p: "Gastos “invisíveis” são:", o: ["Contas de água e luz", "Aluguel e escola", "Assinaturas esquecidas, taxas e pequenos impulsos", "Investimentos automáticos"], r: 2, e: "São pequenos, frequentes e ninguém soma — por isso são a melhor oportunidade de corte." },
      { p: "Na regra 50/30/20, o que representa os 20%?", o: ["Lazer", "Necessidades", "Investimentos e quitação de dívidas", "Impostos"], r: 2, e: "50% necessidades, 30% desejos, 20% construir patrimônio." },
      { p: "Por que orçamentos muito apertados falham?", o: ["Porque o banco não permite", "Porque geram revolta e o abandono do plano", "Porque reduzem o score de crédito", "Porque aumentam impostos"], r: 1, e: "Um plano sustentável vale mais que um plano perfeito que dura três semanas." },
      { p: "Qual a vantagem do aporte automático no dia do salário?", o: ["Rende mais que aporte manual", "Elimina impostos", "Tira a decisão da força de vontade", "Garante rentabilidade fixa"], r: 2, e: "O que sai antes de você ver não é sentido como gasto." },
      { p: "Aluguel e plano de celular são exemplos de gasto:", o: ["Variável", "Fixo", "Invisível", "Extraordinário"], r: 1, e: "Chegam todo mês em valor parecido — são a base do orçamento." },
      { p: "Cortar R$ 330 por mês de gastos inúteis e investir por 20 anos a 10% ao ano resulta em, aproximadamente:", o: ["R$ 80 mil", "R$ 250 mil", "R$ 1 milhão", "R$ 40 mil"], r: 1, e: "Pequenos valores, muito tempo e juros compostos formam quantias grandes." },
      { p: "Por que vale planejar o lazer dentro do orçamento?", o: ["Para gastar mais", "Porque evita compras por impulso e abandono do plano", "Porque o banco exige", "Porque lazer não é gasto"], r: 1, e: "Prazer previsto no plano reduz a chance de estourar por revolta." },
      { p: "Quanto tempo de revisão mensal já ajuda bastante?", o: ["Cerca de 15 minutos", "Três horas", "Um dia inteiro", "Nenhum, o app resolve"], r: 0, e: "Consistência importa mais que profundidade nessa revisão." },
      { p: "Se hoje você só consegue investir 5% da renda, o certo é:", o: ["Esperar até conseguir 20%", "Começar com 5% e aumentar com o tempo", "Pegar empréstimo para investir 20%", "Desistir de investir"], r: 1, e: "O melhor percentual é o que você consegue manter todos os meses." },
    ],
  },

  /* ================================================================ */
  {
    slug: "dinheiro",
    titulo: "Como funciona o dinheiro",
    icone: "💵",
    resumo: "O básico que ninguém te ensinou.",
    paginas: [
      {
        titulo: "Dinheiro é combinado, não é riqueza",
        min: 3,
        blocos: [
          { t: "p", x: "Uma nota de R$ 50 é um pedaço de papel. Ela vale algo porque todos nós combinamos que vale — e porque o país tem uma instituição, o Banco Central, garantindo esse combinado." },
          { t: "p", x: "Entender isso muda a forma de pensar: o dinheiro em si não é riqueza, é um vale-troca. Riqueza é o que ele consegue comprar. Se os preços dobram e o seu dinheiro fica igual, você ficou mais pobre sem ninguém tirar nada de você." },
          { t: "chave", x: "O que importa não é quantos reais você tem, é quanto eles compram." },
        ],
      },
      {
        titulo: "Por onde o dinheiro circula",
        min: 3,
        blocos: [
          { t: "p", x: "Quando você deixa dinheiro no banco, ele não fica numa gaveta com o seu nome. O banco empresta esse dinheiro para outras pessoas e empresas, cobrando juros maiores do que paga a você. A diferença é o lucro dele." },
          { t: "p", x: "É exatamente por isso que a conta corrente é o pior lugar para o seu dinheiro: você empresta de graça. E é também por isso que existem investimentos — eles são formas de você entrar nesse jogo do lado de quem recebe os juros." },
          { t: "lista", x: [
            "Conta corrente: não rende. Você financia o banco.",
            "Renda fixa: você empresta para o governo, banco ou empresa e recebe juros.",
            "Renda variável: você se torna sócio de um negócio e participa dos lucros e prejuízos.",
          ] },
        ],
      },
      {
        titulo: "Os juros são o preço do tempo",
        min: 3,
        blocos: [
          { t: "p", x: "Juros são o aluguel do dinheiro. Quem tem hoje e empresta cobra por esperar. Quem quer antecipar o futuro paga por isso. Todo produto financeiro do mundo é uma variação dessa ideia." },
          { t: "p", x: "Existem dois tipos. Juro simples incide sempre sobre o valor inicial. Juro composto incide sobre o valor inicial mais os juros que já foram acumulados — é o famoso juros sobre juros. Quase tudo na vida real, para o bem e para o mal, é composto." },
          { t: "exemplo", x: "R$ 1.000 a 10% ao ano: com juro simples, R$ 100 por ano, sempre. Com juro composto, R$ 100 no primeiro ano, R$ 110 no segundo, R$ 121 no terceiro. Em 30 anos, o simples chega a R$ 4.000 e o composto passa de R$ 17.000." },
          { t: "chave", x: "Juros compostos trabalham para você quando você investe — e contra você quando você deve." },
        ],
      },
      {
        titulo: "Liquidez, risco e retorno",
        min: 4,
        blocos: [
          { t: "p", x: "Todo investimento se descreve com três palavras. Liquidez é a velocidade com que você transforma aquilo em dinheiro na conta. Risco é o tamanho do susto possível. Retorno é o quanto se espera ganhar." },
          { t: "p", x: "Esses três nunca são ótimos ao mesmo tempo. Se alguém oferece retorno alto, com risco zero e resgate imediato, a única coisa certa é que falta uma informação — ou é golpe." },
          { t: "lista", x: [
            "Muita liquidez e segurança costumam significar retorno menor (bom para reserva).",
            "Retorno maior quase sempre pede mais tempo e mais tolerância a oscilação.",
            "Prazo longo é o que permite aceitar risco com tranquilidade.",
          ] },
          { t: "chave", x: "Não existe almoço grátis: retorno alto sem risco é sempre sinal de alerta." },
        ],
      },
    ],
    quiz: [
      { p: "O que dá valor a uma nota de dinheiro?", o: ["O papel usado", "A confiança coletiva e a garantia do Banco Central", "O ouro guardado em cofres", "A assinatura do presidente"], r: 1, e: "Moeda moderna funciona por confiança e por uma instituição que a sustenta." },
      { p: "Deixar dinheiro parado na conta corrente significa:", o: ["Render 100% do CDI", "Emprestar ao banco de graça", "Estar protegido da inflação", "Investir em renda fixa"], r: 1, e: "O banco usa esse dinheiro e não divide nada com você." },
      { p: "Em renda fixa, o seu papel é de:", o: ["Sócio da empresa", "Quem empresta e recebe juros", "Segurado", "Corretor"], r: 1, e: "Você empresta para governo, banco ou empresa e recebe juros combinados." },
      { p: "Em renda variável, o seu papel é de:", o: ["Credor", "Sócio do negócio", "Poupador garantido", "Fiador"], r: 1, e: "Como sócio, você participa dos lucros e também dos prejuízos." },
      { p: "Juros compostos são:", o: ["Juros sempre sobre o valor inicial", "Juros sobre o valor inicial mais os juros acumulados", "Juros cobrados só no fim", "Uma taxa fixa da corretora"], r: 1, e: "É o efeito bola de neve — juros que rendem sobre juros." },
      { p: "R$ 1.000 a 10% ao ano por 30 anos rende mais em qual regime?", o: ["Simples, cerca de R$ 4 mil", "Composto, mais de R$ 17 mil", "Os dois iguais", "Depende do banco"], r: 1, e: "A diferença entre simples e composto explode com o tempo." },
      { p: "Liquidez significa:", o: ["Quanto o investimento rende", "A rapidez para transformar em dinheiro disponível", "O risco de perder tudo", "O imposto cobrado"], r: 1, e: "Alta liquidez é essencial para a reserva de emergência." },
      { p: "Alguém oferece 5% ao mês garantidos, sem risco e com resgate imediato. A leitura correta é:", o: ["Boa oportunidade, aportar rápido", "Provável golpe ou informação escondida", "Investimento comum de renda fixa", "Aplicação do Tesouro"], r: 1, e: "Retorno alto sem risco não existe; é o padrão clássico de fraude." },
      { p: "Ter mais tempo até precisar do dinheiro permite:", o: ["Eliminar o risco", "Aceitar mais oscilação em troca de retorno maior", "Garantir lucro", "Dispensar diversificação"], r: 1, e: "Prazo é o que transforma volatilidade em algo suportável." },
      { p: "Se os preços dobram e seu dinheiro fica igual, você:", o: ["Continua na mesma", "Ficou mais pobre em poder de compra", "Ganhou, porque tem o mesmo valor", "Depende do banco"], r: 1, e: "Riqueza se mede pelo que o dinheiro compra, não pelo número." },
    ],
  },

  /* ================================================================ */
  {
    slug: "inflacao",
    titulo: "Inflação",
    icone: "🎈",
    resumo: "Por que o dinheiro parado encolhe.",
    paginas: [
      {
        titulo: "O encolhimento invisível",
        min: 3,
        blocos: [
          { t: "p", x: "Imagine que você guarda R$ 100 embaixo do colchão. Um ano depois, ainda são R$ 100 — só que o pão, o aluguel e a gasolina ficaram mais caros. O número não mudou, mas o que ele compra diminuiu. Esse encolhimento silencioso é a inflação." },
          { t: "p", x: "Inflação é a alta geral e contínua dos preços. Ela não avisa, não aparece no extrato e não tem culpado visível. É por isso que ela é o inimigo mais perigoso de quem só guarda dinheiro." },
          { t: "chave", x: "Investir é, antes de tudo, correr mais rápido do que a inflação." },
        ],
      },
      {
        titulo: "Como a inflação é medida",
        min: 3,
        blocos: [
          { t: "p", x: "No Brasil, o índice oficial é o IPCA, calculado pelo IBGE. Todo mês, pesquisadores anotam o preço de centenas de itens — comida, transporte, aluguel, saúde, educação — e comparam com o mês anterior. A média ponderada dessa cesta é a inflação." },
          { t: "p", x: "Um detalhe importante: a inflação divulgada é uma média do país, não a sua. Se você gasta muito com transporte e o combustível sobe forte, a sua inflação pessoal é maior que a do noticiário." },
          { t: "lista", x: [
            "IPCA: índice oficial, base das metas e do Tesouro IPCA+.",
            "IGP-M: mais ligado a preços no atacado, muito usado em aluguéis.",
            "INPC: foca em famílias de renda mais baixa.",
          ] },
        ],
      },
      {
        titulo: "Rendimento nominal e rendimento real",
        min: 4,
        blocos: [
          { t: "p", x: "Aqui está o conceito mais importante do módulo. Rendimento nominal é o número que aparece: “rendeu 10% no ano”. Rendimento real é o que sobrou depois de descontar a inflação — é o único que aumenta o seu poder de compra." },
          { t: "exemplo", x: "Seu investimento rendeu 10% no ano e a inflação foi de 6%. Seu ganho real foi de aproximadamente 4%. Se tivesse rendido 6% com inflação de 6%, você teria ganhado zero: mais reais, mesmo poder de compra." },
          { t: "p", x: "Isso explica por que a poupança é uma armadilha. Em vários anos ela rendeu menos que a inflação — quem estava lá perdeu poder de compra achando que estava ganhando, porque o saldo subia." },
          { t: "chave", x: "Se o rendimento não supera a inflação, você está perdendo dinheiro devagar." },
        ],
      },
      {
        titulo: "Como se proteger",
        min: 3,
        blocos: [
          { t: "p", x: "A proteção não vem de fugir do risco, vem de escolher ativos que acompanham ou superam os preços. Alguns fazem isso por contrato, outros por natureza econômica." },
          { t: "lista", x: [
            "Tesouro IPCA+: paga a inflação medida pelo IPCA mais uma taxa fixa. Proteção contratual.",
            "Ações de empresas boas: com o tempo, empresas repassam custos e crescem com a economia.",
            "Fundos imobiliários: muitos contratos de aluguel são corrigidos por índices de inflação.",
            "Investimentos no exterior: protegem também da desvalorização do real.",
          ] },
          { t: "p", x: "Note que dinheiro parado e poupança não aparecem na lista. Segurança de curto prazo é importante para a reserva, mas para o dinheiro de longo prazo o risco real é ficar de fora." },
          { t: "chave", x: "No longo prazo, não investir também é uma decisão de risco — com perda quase garantida." },
        ],
      },
    ],
    quiz: [
      { p: "Inflação é:", o: ["A alta geral e contínua dos preços", "A queda dos juros", "A variação do dólar", "O imposto sobre investimentos"], r: 0, e: "É o aumento generalizado de preços que reduz o poder de compra do dinheiro." },
      { p: "Qual é o índice oficial de inflação do Brasil?", o: ["IGP-M", "IPCA", "CDI", "Selic"], r: 1, e: "O IPCA, medido pelo IBGE, é a referência oficial e base das metas." },
      { p: "Rendimento real é:", o: ["O rendimento antes dos impostos", "O rendimento bruto anunciado", "O rendimento depois de descontar a inflação", "O rendimento previsto para o próximo ano"], r: 2, e: "Só o ganho real aumenta o seu poder de compra." },
      { p: "Investimento rendeu 10% e a inflação foi 6%. O ganho real foi de aproximadamente:", o: ["16%", "10%", "4%", "0%"], r: 2, e: "Descontando a inflação, sobrou cerca de 4% de ganho real." },
      { p: "Rendeu 6% com inflação de 6%. Isso significa:", o: ["Ganho de 6% de poder de compra", "Ganho real próximo de zero", "Prejuízo de 6%", "Ganho de 12%"], r: 1, e: "Mais reais no extrato, mesmo poder de compra: ganho real nulo." },
      { p: "Por que a poupança pode ser uma armadilha?", o: ["Porque tem taxas altas", "Porque em vários anos rendeu menos que a inflação", "Porque não é garantida", "Porque exige prazo mínimo de 5 anos"], r: 1, e: "O saldo sobe, mas o poder de compra cai — perda disfarçada de ganho." },
      { p: "Qual investimento protege da inflação por contrato?", o: ["Tesouro Selic", "Tesouro IPCA+", "CDB pós-fixado ao CDI", "Poupança"], r: 1, e: "Ele paga o IPCA mais uma taxa fixa, garantindo ganho acima da inflação." },
      { p: "A inflação divulgada no noticiário é:", o: ["Exatamente a sua inflação", "Uma média do país, que pode diferir da sua", "Um valor fixado pelo governo", "Só válida para alimentos"], r: 1, e: "Sua inflação pessoal depende de onde você gasta o seu dinheiro." },
      { p: "Qual índice é mais usado em reajuste de aluguéis?", o: ["INPC", "IPCA", "IGP-M", "CDI"], r: 2, e: "O IGP-M, ligado ao atacado, é tradicional em contratos de aluguel." },
      { p: "Sobre deixar todo o dinheiro de longo prazo parado:", o: ["É a opção sem risco", "Tem risco alto de perda de poder de compra", "É melhor que investir em anos de crise", "Não afeta o patrimônio"], r: 1, e: "Não investir no longo prazo garante perda para a inflação." },
    ],
  },

  /* ================================================================ */
  {
    slug: "cdi-selic",
    titulo: "CDI e Selic",
    icone: "📈",
    resumo: "As réguas da renda fixa.",
    paginas: [
      {
        titulo: "Selic: a taxa que manda em tudo",
        min: 3,
        blocos: [
          { t: "p", x: "A Selic é a taxa básica de juros do país. Ela é definida a cada 45 dias pelo Copom, um comitê do Banco Central, e funciona como o preço do dinheiro no Brasil: a partir dela se formam os juros do financiamento, do cartão, do empréstimo e dos investimentos." },
          { t: "p", x: "O objetivo principal do Banco Central ao mexer na Selic é controlar a inflação. Preços subindo rápido? Sobe a Selic, o crédito fica caro, as pessoas consomem menos e os preços desaceleram. Economia parada? Desce a Selic para estimular consumo e investimento." },
          { t: "chave", x: "Selic alta esfria a economia e favorece a renda fixa. Selic baixa estimula a economia e favorece a bolsa." },
        ],
      },
      {
        titulo: "CDI: a régua dos investimentos",
        min: 3,
        blocos: [
          { t: "p", x: "Todos os dias, bancos emprestam dinheiro uns aos outros por um dia para fechar o caixa. A taxa média desses empréstimos é o CDI. Na prática, ele anda quase colado na Selic, sempre um pouquinho abaixo." },
          { t: "p", x: "Por que isso importa? Porque o CDI se tornou a régua do mercado. Quando um CDB diz “rende 100% do CDI”, significa que ele entrega praticamente o mesmo que a taxa básica. 110% do CDI é 10% mais que essa régua." },
          { t: "exemplo", x: "Com CDI a 12% ao ano: 100% do CDI ≈ 12%; 110% do CDI ≈ 13,2%; 85% do CDI ≈ 10,2%. Comparar produtos fica fácil quando todos usam a mesma régua." },
          { t: "chave", x: "Antes de aceitar um investimento, pergunte: quanto isso paga do CDI?" },
        ],
      },
      {
        titulo: "Prefixado, pós-fixado e híbrido",
        min: 4,
        blocos: [
          { t: "p", x: "Toda renda fixa se encaixa em um destes três formatos, e entender a diferença evita boa parte dos arrependimentos." },
          { t: "lista", x: [
            "Pós-fixado: acompanha uma taxa que muda (ex.: 100% do CDI). Você não sabe o valor final, mas nunca fica para trás se os juros subirem.",
            "Prefixado: taxa travada hoje (ex.: 12% ao ano). Você sabe exatamente quanto vai receber, mas perde se os juros subirem depois.",
            "Híbrido: parte fixa mais um índice (ex.: IPCA + 6%). Protege da inflação e ainda entrega ganho real.",
          ] },
          { t: "p", x: "A escolha depende do cenário e do seu objetivo. Reserva de emergência pede pós-fixado colado no CDI, porque rende todo dia e não oscila. Prefixado faz sentido quando os juros estão altos e a tendência é de queda. Híbrido é o padrão para metas longas." },
          { t: "chave", x: "Não existe formato melhor — existe formato adequado ao prazo do seu objetivo." },
        ],
      },
      {
        titulo: "O que a Selic faz com a sua carteira",
        min: 3,
        blocos: [
          { t: "p", x: "Mudanças na Selic mexem com tudo, e saber a direção ajuda a não se assustar. Quando ela sobe, a renda fixa passa a pagar mais, mas as ações costumam sofrer: crédito caro reduz lucro das empresas e o investidor passa a ter uma alternativa segura rendendo bem." },
          { t: "p", x: "Quando ela cai, acontece o inverso — a renda fixa perde graça e o dinheiro migra para a bolsa e para fundos imobiliários em busca de retorno." },
          { t: "lista", x: [
            "Selic subindo: renda fixa mais atrativa, bolsa pressionada, prefixados antigos se desvalorizam.",
            "Selic caindo: bolsa e FIIs animam, prefixados travados em taxa alta viram ótimos.",
          ] },
          { t: "p", x: "Isso não é motivo para ficar trocando de investimento a cada reunião do Copom. Serve para você entender por que a carteira se move — e continuar aportando com calma." },
        ],
      },
    ],
    quiz: [
      { p: "Quem define a taxa Selic?", o: ["O Congresso", "O Copom, no Banco Central", "A B3", "Os bancos privados"], r: 1, e: "O Copom se reúne a cada 45 dias para definir a taxa básica." },
      { p: "O principal objetivo do Banco Central ao mexer na Selic é:", o: ["Controlar a inflação", "Valorizar a bolsa", "Aumentar a arrecadação", "Baratear o dólar"], r: 0, e: "A Selic é o principal instrumento de controle da inflação." },
      { p: "O CDI é:", o: ["Um imposto sobre renda fixa", "A taxa média dos empréstimos entre bancos", "A taxa de inflação", "A taxa de câmbio"], r: 1, e: "Ele anda colado na Selic e virou a régua da renda fixa." },
      { p: "Um CDB que rende 110% do CDI, com CDI a 12% ao ano, paga aproximadamente:", o: ["12%", "13,2%", "22%", "10,8%"], r: 1, e: "110% de 12% resulta em cerca de 13,2% ao ano." },
      { p: "Investimento pós-fixado é aquele que:", o: ["Tem taxa travada desde o início", "Acompanha uma taxa que varia, como o CDI", "Paga só inflação", "Não tem rendimento"], r: 1, e: "Você não sabe o valor final, mas acompanha os juros do momento." },
      { p: "Qual formato é mais adequado para a reserva de emergência?", o: ["Prefixado longo", "Pós-fixado colado no CDI", "Ações de dividendos", "IPCA+ com vencimento em 2045"], r: 1, e: "Rende todos os dias, não oscila e permite resgate rápido." },
      { p: "IPCA + 6% ao ano é um investimento:", o: ["Prefixado", "Pós-fixado", "Híbrido", "Variável"], r: 2, e: "Combina um índice de inflação com uma taxa fixa." },
      { p: "Quando a Selic sobe, a tendência é que a bolsa:", o: ["Suba forte", "Fique pressionada", "Não se altere", "Feche para negociação"], r: 1, e: "Crédito caro reduz lucros e a renda fixa vira alternativa atraente." },
      { p: "Travar um prefixado com juros altos é vantajoso se depois os juros:", o: ["Subirem", "Caírem", "Ficarem iguais", "Forem extintos"], r: 1, e: "Você segue recebendo a taxa alta enquanto o mercado passa a pagar menos." },
      { p: "Diante de cada reunião do Copom, o comportamento saudável é:", o: ["Trocar toda a carteira", "Entender o movimento e manter os aportes", "Sacar tudo", "Parar de investir por 45 dias"], r: 1, e: "Entender o cenário serve para ter calma, não para girar a carteira." },
    ],
  },

  /* ================================================================ */
  {
    slug: "tesouro",
    titulo: "Tesouro Direto",
    icone: "🏛️",
    resumo: "Emprestar para o governo com segurança.",
    paginas: [
      {
        titulo: "O que é o Tesouro Direto",
        min: 3,
        blocos: [
          { t: "p", x: "O Tesouro Direto é um programa que permite a qualquer pessoa emprestar dinheiro para o governo brasileiro e receber de volta com juros. Você compra um título público pela corretora, a partir de cerca de R$ 30." },
          { t: "p", x: "É considerado o investimento de menor risco do país. O motivo é simples: se o governo brasileiro não pagar a própria dívida em reais, nenhum banco ou empresa daqui estará em condição melhor. Ele é o piso da segurança." },
          { t: "chave", x: "Renda fixa não significa rendimento fixo — significa que as regras de remuneração são combinadas desde o início." },
        ],
      },
      {
        titulo: "Os três tipos de título",
        min: 4,
        blocos: [
          { t: "p", x: "São só três famílias, e cada uma serve para um objetivo diferente." },
          { t: "lista", x: [
            "Tesouro Selic: acompanha a taxa básica. Rende todos os dias, quase não oscila e é o único indicado para reserva de emergência.",
            "Tesouro IPCA+: paga a inflação mais uma taxa fixa. É a escolha natural para objetivos de longo prazo, como aposentadoria.",
            "Tesouro Prefixado: taxa travada hoje. Você sabe exatamente o valor no vencimento.",
          ] },
          { t: "p", x: "Existem também versões “com juros semestrais”, que pagam parte do rendimento a cada seis meses. Para quem está acumulando patrimônio, as versões sem esses pagamentos costumam ser melhores, porque tudo continua rendendo junto." },
          { t: "chave", x: "Reserva no Selic, longo prazo no IPCA+. Esses dois resolvem a vida de quase todo investidor." },
        ],
      },
      {
        titulo: "Marcação a mercado: o susto que confunde",
        min: 4,
        blocos: [
          { t: "p", x: "Muita gente compra Tesouro IPCA+, abre o app meses depois e vê o valor negativo. Isso não é erro nem perda: é marcação a mercado, o preço que aquele título valeria se você vendesse hoje." },
          { t: "p", x: "Funciona assim: se os juros do país sobem, títulos novos passam a pagar mais, então o seu título antigo vale menos para quem fosse comprá-lo. Se os juros caem, o seu título antigo vira uma joia e valoriza." },
          { t: "exemplo", x: "Você compra IPCA+ 6% com vencimento em 2035. Os juros sobem e o mercado passa a oferecer IPCA+ 7%. No app, seu título aparece desvalorizado. Mas se você levar até 2035, receberá exatamente IPCA + 6% ao ano, como combinado." },
          { t: "chave", x: "A oscilação só se transforma em prejuízo se você vender antes do vencimento." },
        ],
      },
      {
        titulo: "Custos, imposto e como comprar",
        min: 4,
        blocos: [
          { t: "p", x: "O Tesouro Direto cobra uma taxa de custódia da B3 de 0,20% ao ano, e o Tesouro Selic é isento dessa taxa para saldos até R$ 10 mil. As principais corretoras não cobram taxa própria — se a sua cobra, vale trocar." },
          { t: "p", x: "O Imposto de Renda segue a tabela regressiva: quanto mais tempo você deixa, menos paga. Ele incide apenas sobre o rendimento e só no resgate." },
          { t: "lista", x: [
            "Até 180 dias: 22,5% sobre o lucro",
            "181 a 360 dias: 20%",
            "361 a 720 dias: 17,5%",
            "Acima de 720 dias: 15% — a menor alíquota",
          ] },
          { t: "p", x: "Para comprar: abra conta em uma corretora, transfira o dinheiro, procure Tesouro Direto, escolha o título conforme o seu prazo e confirme. Todo o processo leva poucos minutos e o título fica registrado no seu CPF na B3, não na corretora." },
        ],
      },
    ],
    quiz: [
      { p: "No Tesouro Direto, você está:", o: ["Comprando ações do governo", "Emprestando dinheiro ao governo", "Pagando impostos antecipados", "Comprando dólar"], r: 1, e: "Título público é um empréstimo ao governo, devolvido com juros." },
      { p: "Qual título é indicado para reserva de emergência?", o: ["Tesouro IPCA+ 2045", "Tesouro Prefixado 2031", "Tesouro Selic", "Tesouro IPCA+ com juros semestrais"], r: 2, e: "Rende diariamente, oscila pouco e tem liquidez rápida." },
      { p: "Tesouro IPCA+ paga:", o: ["Só a inflação", "Inflação mais uma taxa fixa", "Só uma taxa fixa", "100% do CDI"], r: 1, e: "Garante ganho real acima da inflação até o vencimento." },
      { p: "Marcação a mercado é:", o: ["Um erro do aplicativo", "O preço que o título valeria se vendido hoje", "Uma taxa da corretora", "O imposto sobre o rendimento"], r: 1, e: "É a variação do preço de mercado antes do vencimento." },
      { p: "Se os juros do país sobem, um título prefixado antigo:", o: ["Valoriza", "Desvaloriza no mercado", "Continua igual", "Vence antecipadamente"], r: 1, e: "Títulos novos pagam mais, então o antigo vale menos hoje." },
      { p: "Levando o título até o vencimento, você recebe:", o: ["O valor de mercado do dia", "Exatamente a taxa contratada na compra", "Sempre 100% do CDI", "Apenas o valor investido"], r: 1, e: "A oscilação no meio do caminho não altera o combinado no vencimento." },
      { p: "A taxa de custódia da B3 no Tesouro Direto é de:", o: ["0,20% ao ano", "2% ao ano", "5% ao ano", "Não existe"], r: 0, e: "São 0,20% ao ano, com isenção no Tesouro Selic até R$ 10 mil." },
      { p: "A menor alíquota de Imposto de Renda (15%) vale para resgates após:", o: ["180 dias", "360 dias", "720 dias", "5 anos"], r: 2, e: "A tabela é regressiva e chega a 15% depois de 720 dias." },
      { p: "O Imposto de Renda incide sobre:", o: ["O valor total investido", "Apenas o rendimento, no resgate", "O saldo, todo mês", "A taxa de custódia"], r: 1, e: "Só o lucro é tributado, e só quando você resgata." },
      { p: "Por que o Tesouro é considerado o investimento mais seguro do país?", o: ["Porque rende mais que a bolsa", "Porque é garantido pelo FGC", "Porque o governo é o devedor mais sólido em reais", "Porque não tem imposto"], r: 2, e: "Se o governo não paga em reais, nada no país está mais seguro." },
    ],
  },
];

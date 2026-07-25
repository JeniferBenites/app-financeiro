/* ------------------------------------------------------------------ */
/*  Currículo — módulos 7 a 12 (produtos e carteira)                   */
/* ------------------------------------------------------------------ */

export const MODULOS_2 = [
  /* ================================================================ */
  {
    slug: "renda-fixa",
    titulo: "Renda Fixa",
    icone: "🔒",
    resumo: "Emprestar dinheiro com regras combinadas.",
    paginas: [
      {
        titulo: "A ideia por trás de toda renda fixa",
        min: 3,
        blocos: [
          { t: "p", x: "Em renda fixa você é o banco. Alguém precisa de dinheiro — o governo, um banco, uma empresa — e você empresta em troca de juros combinados desde o início. Simples assim." },
          { t: "p", x: "O nome engana: “fixa” não quer dizer que o valor nunca muda. Quer dizer que a regra de remuneração é conhecida na hora da compra. Pode ser 12% ao ano, 100% do CDI ou IPCA + 6% — o que é fixo é a fórmula, não o número final." },
          { t: "chave", x: "Renda fixa é você emprestando. Renda variável é você virando sócio." },
        ],
      },
      {
        titulo: "CDB, LCI, LCA e a proteção do FGC",
        min: 4,
        blocos: [
          { t: "p", x: "CDB é um empréstimo para um banco. LCI e LCA são parecidos, mas o dinheiro é direcionado aos setores imobiliário e do agronegócio — e têm uma vantagem grande: são isentos de Imposto de Renda para pessoa física." },
          { t: "p", x: "Todos os três contam com o FGC, o Fundo Garantidor de Créditos, que devolve até R$ 250 mil por CPF por instituição, com teto de R$ 1 milhão a cada quatro anos, se o banco quebrar." },
          { t: "exemplo", x: "Uma LCI isenta pagando 90% do CDI pode render mais no bolso do que um CDB de 105% do CDI, porque no CDB você ainda vai pagar de 15% a 22,5% de imposto sobre o lucro." },
          { t: "chave", x: "Compare sempre o rendimento líquido, depois do imposto — nunca só o número anunciado." },
        ],
      },
      {
        titulo: "Debêntures, CRI e CRA: mais retorno, mais risco",
        min: 3,
        blocos: [
          { t: "p", x: "Debênture é um empréstimo direto para uma empresa, sem banco no meio. CRI e CRA são títulos ligados a recebíveis imobiliários e do agronegócio. Costumam pagar mais que CDB — e o motivo é justo: não têm FGC." },
          { t: "p", x: "Aqui quem garante o pagamento é apenas a saúde financeira de quem emitiu. Se a empresa tiver problemas, você entra na fila dos credores. É investimento para quem já entende o básico e aceita analisar risco de crédito." },
          { t: "lista", x: [
            "Debêntures incentivadas: isentas de IR, ligadas a projetos de infraestrutura.",
            "Sem FGC: o risco é da empresa, não do sistema bancário.",
            "Liquidez costuma ser ruim: vender antes do vencimento pode ser difícil ou custar caro.",
          ] },
        ],
      },
      {
        titulo: "Como escolher sem errar",
        min: 4,
        blocos: [
          { t: "p", x: "Antes de olhar a taxa, olhe o prazo. Renda fixa combina com objetivos de data conhecida: uma viagem em dois anos, a entrada de um imóvel em cinco, a aposentadoria em vinte. Escolha um vencimento próximo da data em que vai usar o dinheiro." },
          { t: "lista", x: [
            "Precisa a qualquer momento? Tesouro Selic ou CDB com liquidez diária.",
            "Data marcada em 2 a 5 anos? Prefixado ou IPCA+ vencendo perto dessa data.",
            "Aposentadoria? IPCA+ longo, para garantir ganho acima da inflação.",
          ] },
          { t: "p", x: "Cuidado com o produto que rende bem mas trava seu dinheiro por cinco anos quando você vai precisar dele em um. Liquidez errada estraga o melhor investimento." },
          { t: "chave", x: "Primeiro o prazo, depois a taxa. Nunca o contrário." },
        ],
      },
    ],
    quiz: [
      { p: "Em renda fixa, o investidor atua como:", o: ["Sócio da empresa", "Quem empresta dinheiro", "Segurado", "Corretor"], r: 1, e: "Você empresta e recebe juros combinados na contratação." },
      { p: "“Fixa” em renda fixa significa que:", o: ["O valor nunca oscila", "A regra de remuneração é conhecida na compra", "O governo garante o lucro", "Não há imposto"], r: 1, e: "A fórmula é fixa; o valor final pode variar com índices e prazo." },
      { p: "Qual a principal vantagem de LCI e LCA?", o: ["Rendem mais que ações", "São isentas de Imposto de Renda para pessoa física", "Têm liquidez diária garantida", "Não têm risco de crédito"], r: 1, e: "A isenção de IR aumenta o rendimento líquido." },
      { p: "O FGC garante até:", o: ["R$ 50 mil por CPF", "R$ 250 mil por CPF por instituição", "R$ 1 milhão por aplicação", "Valor ilimitado"], r: 1, e: "São R$ 250 mil por CPF por instituição, com teto de R$ 1 milhão a cada 4 anos." },
      { p: "Debêntures, CRI e CRA têm cobertura do FGC?", o: ["Sim, integral", "Sim, até R$ 250 mil", "Não têm", "Só as incentivadas"], r: 2, e: "Sem FGC, o risco é da empresa emissora — por isso pagam mais." },
      { p: "Uma LCI isenta a 90% do CDI pode superar um CDB a 105% do CDI porque:", o: ["A LCI tem FGC maior", "No CDB há desconto de Imposto de Renda", "A LCI rende juros compostos", "O CDB tem taxa de custódia"], r: 1, e: "O que importa é o rendimento líquido, depois do imposto." },
      { p: "Para um objetivo com data marcada em 3 anos, o mais adequado é:", o: ["Ações de crescimento", "Título com vencimento próximo dessa data", "Tesouro IPCA+ 2045", "Criptomoedas"], r: 1, e: "Casar o vencimento com a data do objetivo evita vender no susto." },
      { p: "O maior problema de escolher pela taxa e ignorar a liquidez é:", o: ["Pagar mais imposto", "Precisar do dinheiro e não conseguir resgatar", "Perder o FGC", "Reduzir o rendimento nominal"], r: 1, e: "Liquidez errada estraga até o investimento mais rentável." },
      { p: "Debênture é um empréstimo para:", o: ["O governo federal", "Um banco", "Uma empresa, sem banco no meio", "Um fundo imobiliário"], r: 2, e: "A empresa capta direto com investidores e paga juros." },
      { p: "Debêntures incentivadas se destacam por:", o: ["Terem FGC", "Serem isentas de IR e ligadas a infraestrutura", "Terem liquidez diária", "Renderem sempre acima do CDI"], r: 1, e: "A isenção compensa o risco de crédito e o prazo longo." },
    ],
  },

  /* ================================================================ */
  {
    slug: "renda-variavel",
    titulo: "Renda Variável",
    icone: "🎢",
    resumo: "Virar sócio e conviver com a oscilação.",
    paginas: [
      {
        titulo: "O que muda quando você vira sócio",
        min: 3,
        blocos: [
          { t: "p", x: "Em renda variável ninguém promete nada. Você compra um pedaço de um negócio e o seu resultado depende de como esse negócio vai — e de quanto outras pessoas estão dispostas a pagar por esse pedaço hoje." },
          { t: "p", x: "É por isso que o preço sobe e desce todos os dias. Não é defeito do sistema, é a natureza dele. O preço reflete a opinião do mercado sobre o futuro, e opiniões mudam a todo momento." },
          { t: "chave", x: "Oscilação é o pedágio que você paga pelo retorno maior no longo prazo." },
        ],
      },
      {
        titulo: "O que existe em renda variável",
        min: 3,
        blocos: [
          { t: "lista", x: [
            "Ações: pedaços de empresas listadas na bolsa.",
            "ETFs: cestas que replicam um índice inteiro em uma única compra.",
            "Fundos imobiliários (FIIs): cotas de carteiras de imóveis ou de papéis do setor.",
            "BDRs: recibos que permitem investir em empresas estrangeiras pela B3.",
            "Fundos de investimento: um gestor decide onde alocar o dinheiro do grupo.",
          ] },
          { t: "p", x: "Para quem está começando, ETFs são a porta de entrada mais sensata: com um clique você compra dezenas ou centenas de empresas, o que dilui muito o risco de escolher errado." },
        ],
      },
      {
        titulo: "Volatilidade não é o mesmo que risco",
        min: 4,
        blocos: [
          { t: "p", x: "Volatilidade é o tamanho do sobe e desce. Risco de verdade é a chance de perder dinheiro de forma permanente. As duas coisas se confundem, mas são bem diferentes." },
          { t: "p", x: "Uma carteira diversificada de boas empresas pode cair 30% em uma crise e se recuperar em alguns anos — isso é volatilidade. Colocar todo o seu dinheiro em uma única empresa que vai à falência é risco: não volta nunca." },
          { t: "exemplo", x: "Em crises recentes, a bolsa brasileira caiu forte várias vezes e depois voltou a fazer novas máximas. Quem vendeu no fundo transformou volatilidade em prejuízo. Quem continuou aportando comprou barato." },
          { t: "chave", x: "A queda só se torna perda quando você vende. Até lá, é apenas preço." },
        ],
      },
      {
        titulo: "Como participar sem se machucar",
        min: 4,
        blocos: [
          { t: "p", x: "A regra prática mais útil: dinheiro que você pode precisar em menos de cinco anos não entra em renda variável. Com esse prazo, a chance de você ser forçado a vender numa queda é grande." },
          { t: "lista", x: [
            "Tenha reserva de emergência antes de comprar a primeira ação.",
            "Aporte sempre o mesmo valor, todo mês, sem tentar adivinhar o fundo.",
            "Comece por ETFs e adicione ações individuais só quando entender o que está comprando.",
            "Evite olhar cotação todo dia: aumenta a ansiedade e a chance de errar.",
          ] },
          { t: "p", x: "Aportar valores parecidos em datas fixas tem um nome: preço médio. Você compra mais cotas quando está barato e menos quando está caro, sem precisar de nenhuma previsão." },
          { t: "chave", x: "Prazo longo e aportes constantes fazem mais pelo seu resultado do que qualquer análise." },
        ],
      },
    ],
    quiz: [
      { p: "Em renda variável você:", o: ["Empresta dinheiro com juros combinados", "Se torna sócio de um negócio", "Tem rendimento garantido", "Fica protegido pelo FGC"], r: 1, e: "Como sócio, você participa dos resultados — bons e ruins." },
      { p: "Volatilidade é:", o: ["A chance de perder tudo", "O tamanho das oscilações de preço", "A taxa cobrada pela corretora", "O imposto sobre ganhos"], r: 1, e: "É o sobe e desce, diferente de perda permanente." },
      { p: "Risco de perda permanente acontece principalmente quando:", o: ["A bolsa cai 20%", "Você concentra tudo em um único ativo que quebra", "Você aporta todo mês", "O dólar sobe"], r: 1, e: "Concentração excessiva é o que transforma queda em perda definitiva." },
      { p: "Dinheiro que você pode precisar em menos de 5 anos deve ficar:", o: ["Em ações de dividendos", "Em renda fixa adequada ao prazo", "Em ETFs internacionais", "Em fundos imobiliários"], r: 1, e: "Prazo curto e renda variável é a combinação que força vendas no pior momento." },
      { p: "Qual é a porta de entrada mais sensata na bolsa?", o: ["Ações de empresas pequenas", "ETFs de índice", "Opções", "Day trade"], r: 1, e: "Um ETF entrega dezenas de empresas em uma única compra." },
      { p: "Aportar o mesmo valor todo mês é uma estratégia chamada:", o: ["Alavancagem", "Preço médio", "Arbitragem", "Hedge"], r: 1, e: "Você compra mais quando está barato e menos quando está caro." },
      { p: "BDR permite:", o: ["Investir em empresas estrangeiras pela B3", "Emprestar para o governo", "Comprar imóveis físicos", "Ter renda fixa isenta"], r: 0, e: "É um recibo negociado no Brasil que representa ação lá fora." },
      { p: "Uma queda de 30% na carteira diversificada significa:", o: ["Prejuízo definitivo", "Volatilidade, que pode ser recuperada com o tempo", "Falência das empresas", "Erro da corretora"], r: 1, e: "Só vira prejuízo se você vender naquele momento." },
      { p: "Olhar a cotação várias vezes por dia tende a:", o: ["Melhorar os resultados", "Aumentar a ansiedade e a chance de decisões ruins", "Reduzir as taxas", "Antecipar tendências"], r: 1, e: "Ruído de curto prazo atrapalha decisões de longo prazo." },
      { p: "O que explica mais o resultado de um investidor comum?", o: ["Análise gráfica", "Prazo longo e aportes constantes", "Escolher o dia certo de comprar", "Seguir influenciadores"], r: 1, e: "Tempo e disciplina superam tentativa de acertar o momento." },
    ],
  },

  /* ================================================================ */
  {
    slug: "etf",
    titulo: "ETF",
    icone: "🧺",
    resumo: "Uma cesta pronta de investimentos.",
    paginas: [
      {
        titulo: "Uma cesta em uma única compra",
        min: 3,
        blocos: [
          { t: "p", x: "ETF é um fundo negociado na bolsa como se fosse uma ação. Em vez de escolher uma empresa, você compra uma cota que representa um pedacinho de todas as empresas de um índice." },
          { t: "p", x: "Comprar o ETF que segue o Ibovespa é como comprar, de uma vez, as maiores empresas do Brasil na proporção que elas têm no índice. Uma ordem, uma taxa, dezenas de negócios na carteira." },
          { t: "chave", x: "Com ETF você deixa de apostar em qual empresa vai ganhar e passa a apostar no crescimento do conjunto." },
        ],
      },
      {
        titulo: "Gestão passiva e o custo que sobra para você",
        min: 4,
        blocos: [
          { t: "p", x: "A maioria dos ETFs é de gestão passiva: ninguém tenta escolher as melhores ações, o fundo só copia o índice. Isso parece pouco ambicioso, mas há um detalhe incômodo para a indústria — na média e no longo prazo, a maioria dos fundos com gestor ativo não consegue superar o índice depois das taxas." },
          { t: "p", x: "E as taxas fazem uma diferença enorme. ETFs costumam cobrar de 0,03% a 0,60% ao ano, enquanto fundos ativos cobram 2% mais 20% do que exceder um referencial." },
          { t: "exemplo", x: "R$ 1.000 por mês durante 30 anos rendendo 10% ao ano: com taxa de 0,2% você chega perto de R$ 2,2 milhões; com 2% ao ano, algo em torno de R$ 1,6 milhão. A diferença ficou com o gestor." },
          { t: "chave", x: "Taxa é o único elemento do seu retorno que você conhece com certeza antes de investir." },
        ],
      },
      {
        titulo: "Os principais tipos disponíveis no Brasil",
        min: 3,
        blocos: [
          { t: "lista", x: [
            "Índice brasileiro: seguem o Ibovespa ou índices de empresas menores. Fatia do Brasil.",
            "Índice americano: acompanham o S&P 500 ou o Nasdaq, em reais, pela B3.",
            "Mundo e mercados emergentes: diversificação geográfica ampla.",
            "Setoriais e temáticos: tecnologia, energia, dividendos, small caps.",
            "Renda fixa: cestas de títulos públicos ou privados.",
          ] },
          { t: "p", x: "Uma carteira simples e sólida pode ser montada com dois ou três ETFs: um do Brasil, um global e um de renda fixa. Não é preciso ter dez." },
        ],
      },
      {
        titulo: "Pontos de atenção",
        min: 4,
        blocos: [
          { t: "p", x: "ETF não é mágico. Se o índice cai, o ETF cai igual — ele não protege de crises, apenas evita que você seja destruído por uma empresa específica." },
          { t: "lista", x: [
            "ETFs brasileiros normalmente reinvestem os dividendos em vez de repassar em dinheiro.",
            "Sobre ETF de ações não existe a isenção de R$ 20 mil de vendas mensais: o ganho é tributado em 15%.",
            "Prefira ETFs com bom volume de negociação, para comprar e vender com facilidade.",
            "ETF de índice estrangeiro em reais também embute a variação do dólar — o que ajuda ou atrapalha, depende do momento.",
          ] },
          { t: "chave", x: "Diversificação reduz o risco de escolher errado, não o risco do mercado inteiro." },
        ],
      },
    ],
    quiz: [
      { p: "ETF é:", o: ["Um título público", "Um fundo negociado na bolsa que replica um índice", "Um empréstimo a bancos", "Uma ação de empresa de tecnologia"], r: 1, e: "Compra-se como ação, e ele representa uma cesta de ativos." },
      { p: "A principal vantagem de um ETF é:", o: ["Rendimento garantido", "Diversificação instantânea com custo baixo", "Isenção total de impostos", "Proteção do FGC"], r: 1, e: "Uma ordem entrega dezenas ou centenas de ativos." },
      { p: "Gestão passiva significa:", o: ["O gestor escolhe as melhores ações", "O fundo apenas replica um índice", "O fundo só compra renda fixa", "Não há cobrança de taxas"], r: 1, e: "Sem tentativa de superar o índice, o custo cai muito." },
      { p: "Na média e no longo prazo, a maioria dos fundos ativos:", o: ["Supera o índice com folga", "Não supera o índice depois das taxas", "Tem retorno garantido", "É isenta de imposto"], r: 1, e: "É o principal argumento a favor de investir no índice." },
      { p: "Taxas típicas de ETFs ficam em torno de:", o: ["0,03% a 0,60% ao ano", "2% ao ano mais 20% de performance", "5% ao ano", "10% na entrada"], r: 0, e: "Custo baixo é uma das maiores vantagens estruturais dos ETFs." },
      { p: "Sobre ETF de ações no Brasil, a isenção de R$ 20 mil em vendas mensais:", o: ["Vale integralmente", "Não se aplica: o ganho é tributado em 15%", "Vale só no primeiro ano", "Vale até R$ 35 mil"], r: 1, e: "A isenção existe para ações individuais, não para ETFs de ações." },
      { p: "O que costuma acontecer com os dividendos em ETFs brasileiros?", o: ["São pagos em dinheiro todo mês", "São reinvestidos na própria carteira", "São perdidos", "Viram desconto de imposto"], r: 1, e: "O reinvestimento aparece como valorização da cota." },
      { p: "Se o índice cai 20%, o ETF que o segue:", o: ["Sobe", "Cai perto de 20%", "Fica estável", "Suspende negociação"], r: 1, e: "ETF acompanha o índice para cima e para baixo." },
      { p: "Uma carteira simples e diversificada pode ser feita com:", o: ["Dez ETFs setoriais", "Dois ou três ETFs: Brasil, global e renda fixa", "Apenas um ETF temático", "Somente ETFs de tecnologia"], r: 1, e: "Simplicidade bem distribuída vence complexidade desnecessária." },
      { p: "Por que preferir ETFs com bom volume de negociação?", o: ["Rendem mais", "Facilitam comprar e vender a preço justo", "Têm menos imposto", "São garantidos pelo governo"], r: 1, e: "Liquidez evita que você pague caro para entrar ou sair." },
    ],
  },

  /* ================================================================ */
  {
    slug: "acoes",
    titulo: "Ações",
    icone: "🏢",
    resumo: "Ser dono de um pedaço de uma empresa.",
    paginas: [
      {
        titulo: "O que você compra de verdade",
        min: 3,
        blocos: [
          { t: "p", x: "Uma ação é uma fração do capital de uma empresa. Quando você compra uma ação da Petrobras, você é dono de um pedacinho — minúsculo, mas real — das refinarias, dos poços e dos lucros dela." },
          { t: "p", x: "Isso significa duas fontes de retorno: a valorização da ação, quando o negócio cresce e o mercado passa a pagar mais por ele, e os dividendos, que é a parte do lucro distribuída aos donos." },
          { t: "lista", x: [
            "Ação ON (terminação 3): tem direito a voto nas assembleias.",
            "Ação PN (terminações 4, 5, 6): sem voto, mas com preferência na distribuição de lucros.",
            "Unit (terminação 11): um pacote que junta ações ON e PN.",
          ] },
          { t: "chave", x: "Comprar ação é comprar empresa. Se você não entende o negócio, não entende o que tem na mão." },
        ],
      },
      {
        titulo: "Indicadores que ajudam a ler uma empresa",
        min: 4,
        blocos: [
          { t: "p", x: "Não é preciso ser analista, mas alguns números contam boa parte da história." },
          { t: "lista", x: [
            "P/L (preço sobre lucro): quantos anos de lucro atual você paga pelo preço de hoje. Alto pode indicar expectativa de crescimento — ou exagero.",
            "Dividend Yield: dividendos dos últimos 12 meses divididos pelo preço. Mostra quanto a empresa devolve em dinheiro.",
            "ROE: quanto de lucro a empresa gera sobre o próprio patrimônio. Acima de 15% costuma indicar negócio eficiente.",
            "Dívida líquida / EBITDA: quantos anos de geração de caixa seriam necessários para pagar a dívida. Acima de 3 pede atenção.",
            "Margem líquida: quanto de cada real vendido sobra como lucro.",
          ] },
          { t: "p", x: "Nenhum indicador funciona isolado, e comparar setores diferentes é um erro comum: banco, varejo e mineradora têm padrões completamente distintos." },
          { t: "chave", x: "Indicador barato em empresa ruim não é oportunidade — é armadilha de valor." },
        ],
      },
      {
        titulo: "Dividendos e o efeito bola de neve",
        min: 3,
        blocos: [
          { t: "p", x: "Dividendos são a parte do lucro que a empresa distribui aos acionistas. No Brasil eles são isentos de Imposto de Renda para a pessoa física, o que os tornou muito populares." },
          { t: "p", x: "O poder real aparece quando você reinveste: os dividendos compram mais ações, que geram mais dividendos, que compram mais ações. É o juros composto aplicado à propriedade de empresas." },
          { t: "exemplo", x: "Uma carteira que paga 6% ao ano em dividendos, com tudo reinvestido e alguma valorização, tende a dobrar o número de cotas em pouco mais de uma década — sem você colocar um real a mais." },
          { t: "p", x: "Um alerta: dividend yield muito alto pode ser sinal de que a ação caiu muito ou de que houve um pagamento extraordinário que não se repete. Desconfie de yields fora do padrão." },
        ],
      },
      {
        titulo: "Impostos e regras práticas",
        min: 4,
        blocos: [
          { t: "p", x: "Vendas de ações até R$ 20 mil por mês são isentas de Imposto de Renda sobre o lucro. Acima disso, paga-se 15% sobre o ganho. Em day trade a alíquota é 20% e não existe isenção." },
          { t: "p", x: "O imposto é apurado por você, com pagamento via DARF até o último dia útil do mês seguinte. Dividendos recebidos são isentos, mas precisam ser declarados." },
          { t: "lista", x: [
            "Comece com poucas empresas que você entende, ou vá de ETF.",
            "Nenhuma ação individual deveria dominar a carteira: 5% a 10% é um limite razoável.",
            "Fuja de dicas prontas e de promessas de multiplicação rápida.",
            "Acompanhe resultados trimestrais das suas empresas — é a única forma de saber se a tese continua válida.",
          ] },
          { t: "chave", x: "Você não precisa ter muitas ações. Precisa entender as que tem." },
        ],
      },
    ],
    quiz: [
      { p: "Comprar uma ação significa:", o: ["Emprestar dinheiro à empresa", "Ser dono de uma fração da empresa", "Ter rendimento garantido", "Adquirir um título público"], r: 1, e: "Acionista é sócio, com direito a participar dos lucros." },
      { p: "As duas formas de ganhar com ações são:", o: ["Juros e amortização", "Valorização e dividendos", "Cupom e ágio", "Aluguel e correção"], r: 1, e: "O preço pode subir e a empresa pode distribuir lucros." },
      { p: "Ações com terminação 3 são:", o: ["Preferenciais, sem voto", "Ordinárias, com direito a voto", "Units", "BDRs"], r: 1, e: "ON dá direito a voto nas assembleias." },
      { p: "O indicador P/L mostra:", o: ["Quanto a empresa deve", "Quantos anos de lucro atual você paga pelo preço de hoje", "A margem de lucro", "O dividendo pago"], r: 1, e: "Relaciona preço da ação com o lucro gerado." },
      { p: "ROE mede:", o: ["Lucro sobre o patrimônio da empresa", "Dívida sobre o caixa", "Preço sobre lucro", "Dividendos sobre preço"], r: 0, e: "Indica a eficiência da empresa em gerar lucro com o próprio capital." },
      { p: "Dívida líquida / EBITDA acima de 3 costuma indicar:", o: ["Empresa muito eficiente", "Endividamento que merece atenção", "Dividendos altos garantidos", "Ação barata"], r: 1, e: "Sinaliza que a dívida é grande frente à geração de caixa." },
      { p: "Dividendos recebidos por pessoa física no Brasil são:", o: ["Tributados em 15%", "Isentos de IR, mas declaráveis", "Tributados em 20%", "Isentos e não declaráveis"], r: 1, e: "Hoje são isentos na pessoa física, mas entram na declaração." },
      { p: "Vendas de ações até R$ 20 mil por mês:", o: ["São isentas de IR sobre o lucro", "Pagam 15%", "Pagam 20%", "Pagam 22,5%"], r: 0, e: "A isenção vale para operações comuns, não para day trade." },
      { p: "Dividend yield muito acima do normal pode indicar:", o: ["Empresa excelente sempre", "Queda forte do preço ou pagamento extraordinário", "Isenção de imposto", "Baixo endividamento"], r: 1, e: "Yield alto às vezes é sintoma de problema, não de qualidade." },
      { p: "Um limite razoável para uma única ação na carteira é:", o: ["50%", "5% a 10%", "80%", "100% se a empresa for boa"], r: 1, e: "Concentração excessiva é a principal causa de perdas permanentes." },
    ],
  },

  /* ================================================================ */
  {
    slug: "fiis",
    titulo: "Fundos Imobiliários",
    icone: "🏠",
    resumo: "Viver de aluguel sem comprar imóvel.",
    paginas: [
      {
        titulo: "Imóveis divididos em cotas",
        min: 3,
        blocos: [
          { t: "p", x: "Um fundo imobiliário junta o dinheiro de muitos investidores para comprar imóveis ou títulos do setor. Você compra cotas na bolsa, como uma ação, e recebe uma parte dos aluguéis todo mês." },
          { t: "p", x: "A comparação com o imóvel próprio é reveladora: com R$ 200 você já participa de um shopping ou de um galpão logístico; não precisa de escritura, não paga ITBI, não corre atrás de inquilino e vende em segundos pelo app." },
          { t: "chave", x: "FII é o jeito mais simples de receber aluguel sem ter as dores de cabeça de ser proprietário." },
        ],
      },
      {
        titulo: "Os tipos de FII",
        min: 4,
        blocos: [
          { t: "lista", x: [
            "Tijolo: donos de imóveis reais — shoppings, galpões logísticos, lajes corporativas, hospitais, agências.",
            "Papel: investem em CRIs, títulos de dívida imobiliária. Rendimento acompanha inflação ou CDI.",
            "Fundo de fundos (FOF): compram cotas de outros FIIs, entregando diversificação pronta.",
            "Híbridos: misturam imóveis e papéis.",
          ] },
          { t: "p", x: "Fundos de papel costumam sofrer menos com vacância e responder mais rápido a juros e inflação. Fundos de tijolo dependem de contratos, localização e da qualidade do inquilino, mas oferecem potencial de valorização do imóvel." },
          { t: "p", x: "Duas palavras aparecem sempre na análise: vacância, que é a fatia do imóvel sem inquilino, e o tipo de contrato — o atípico, mais longo e rígido, dá muito mais previsibilidade que o típico." },
        ],
      },
      {
        titulo: "Rendimento, isenção e o preço justo",
        min: 4,
        blocos: [
          { t: "p", x: "Os rendimentos mensais distribuídos por FIIs são isentos de Imposto de Renda para a pessoa física, desde que o fundo tenha ao menos 100 cotistas e você tenha menos de 10% das cotas. Já o lucro na venda de cotas é tributado em 20%." },
          { t: "p", x: "O indicador mais usado é o P/VP: o preço da cota dividido pelo valor patrimonial. Abaixo de 1 significa que o mercado paga menos do que os imóveis valem no balanço — pode ser oportunidade ou desconfiança justificada." },
          { t: "lista", x: [
            "Dividend yield mensal: quanto o fundo distribui em relação ao preço.",
            "P/VP: preço da cota frente ao patrimônio.",
            "Vacância física e financeira: quanto está vazio e quanto isso custa.",
            "Liquidez diária: fundos pequenos podem ser difíceis de vender.",
          ] },
          { t: "chave", x: "Rendimento isento e mensal é ótimo, mas cota barata demais quase sempre tem um motivo." },
        ],
      },
      {
        titulo: "Riscos que não aparecem no yield",
        min: 3,
        blocos: [
          { t: "p", x: "FII não é renda fixa, e essa confusão gera muita frustração. O valor da cota oscila todos os dias e a distribuição pode cair de um mês para o outro." },
          { t: "lista", x: [
            "Vacância: inquilino sai, o rendimento cai na hora.",
            "Juros altos: renda fixa segura passa a competir e as cotas costumam se desvalorizar.",
            "Inadimplência: nos fundos de papel, devedores que atrasam derrubam a distribuição.",
            "Emissões novas: podem diluir a sua participação se feitas em condições ruins.",
          ] },
          { t: "p", x: "A defesa é a mesma de sempre: diversificar entre tipos e entre fundos, e reinvestir os rendimentos recebidos para acelerar a bola de neve." },
        ],
      },
    ],
    quiz: [
      { p: "Um fundo imobiliário permite:", o: ["Comprar um imóvel inteiro com desconto", "Receber parte de aluguéis comprando cotas na bolsa", "Emprestar dinheiro ao governo", "Ter rendimento fixo garantido"], r: 1, e: "Você participa de imóveis ou títulos do setor via cotas." },
      { p: "FII de “tijolo” investe em:", o: ["Títulos de dívida imobiliária", "Imóveis reais, como shoppings e galpões", "Cotas de outros fundos", "Ações de construtoras"], r: 1, e: "São donos de imóveis físicos alugados." },
      { p: "FII de “papel” investe principalmente em:", o: ["Imóveis físicos", "CRIs e títulos de dívida imobiliária", "Ações", "Ouro"], r: 1, e: "O rendimento acompanha índices como IPCA ou CDI." },
      { p: "Os rendimentos mensais de FIIs para pessoa física são:", o: ["Tributados em 20%", "Isentos de IR, cumpridas as regras do fundo", "Tributados em 15%", "Isentos apenas no primeiro ano"], r: 1, e: "Precisa ter 100+ cotistas e você deter menos de 10% das cotas." },
      { p: "O lucro na venda de cotas de FII é tributado em:", o: ["Isento", "15%", "20%", "22,5%"], r: 2, e: "Diferente do rendimento mensal, o ganho de capital paga 20%." },
      { p: "P/VP abaixo de 1 significa que:", o: ["O fundo está sempre barato", "O mercado paga menos que o valor patrimonial", "O fundo tem vacância zero", "O rendimento é garantido"], r: 1, e: "Pode ser oportunidade ou refletir um problema real." },
      { p: "Vacância é:", o: ["A taxa de administração", "A parte do imóvel sem inquilino", "O imposto sobre aluguel", "A valorização da cota"], r: 1, e: "Mais vacância significa menos aluguel distribuído." },
      { p: "Contratos atípicos se destacam por:", o: ["Serem mais curtos e flexíveis", "Serem longos e rígidos, com mais previsibilidade", "Não terem reajuste", "Isentar o fundo de impostos"], r: 1, e: "Dão maior segurança de receita ao fundo." },
      { p: "Quando os juros sobem muito, as cotas de FIIs costumam:", o: ["Valorizar", "Se desvalorizar, pela competição com a renda fixa", "Ficar estáveis", "Ser suspensas"], r: 1, e: "Renda fixa segura pagando bem reduz o apetite por FIIs." },
      { p: "A principal defesa contra vacância e inadimplência é:", o: ["Escolher um único fundo grande", "Diversificar entre tipos e fundos", "Comprar só o de maior yield", "Vender a cada queda"], r: 1, e: "Diversificação dilui o impacto de um problema isolado." },
    ],
  },

  /* ================================================================ */
  {
    slug: "diversificacao",
    titulo: "Diversificação",
    icone: "🍱",
    resumo: "Não colocar todos os ovos na mesma cesta.",
    paginas: [
      {
        titulo: "Por que diversificar funciona",
        min: 3,
        blocos: [
          { t: "p", x: "Ninguém sabe o que vai render mais nos próximos anos. Diversificar é admitir isso com honestidade e montar uma carteira que sobrevive a vários cenários, em vez de uma que só funciona se você estiver certo." },
          { t: "p", x: "O efeito é matemático: quando os ativos não sobem e descem juntos, a oscilação da carteira fica menor que a média das oscilações individuais. Você reduz sustos sem abrir mão de retorno." },
          { t: "chave", x: "Diversificação é a única proteção contra aquilo que você não sabe que não sabe." },
        ],
      },
      {
        titulo: "As camadas da diversificação",
        min: 4,
        blocos: [
          { t: "p", x: "Diversificar não é ter dez ações do mesmo setor. Existem camadas, e a maioria das pessoas só usa a primeira." },
          { t: "lista", x: [
            "Por classe: renda fixa, ações, fundos imobiliários, exterior.",
            "Por setor: bancos, energia, consumo, saúde, tecnologia.",
            "Por geografia: Brasil e outros países — o Brasil é cerca de 1% do mercado global.",
            "Por moeda: parte do patrimônio em dólar protege contra a desvalorização do real.",
            "Por prazo de vencimento, dentro da renda fixa.",
          ] },
          { t: "exemplo", x: "Dez ações de bancos brasileiros parecem diversificadas, mas reagem quase igual a juros, inadimplência e política local. Um ETF global somado a dois títulos públicos diversifica muito mais com menos ativos." },
        ],
      },
      {
        titulo: "Alocação por perfil",
        min: 4,
        blocos: [
          { t: "p", x: "A pergunta certa não é “qual o melhor investimento”, é “qual a divisão que eu consigo manter sem entrar em pânico”. Estas são referências educacionais, não recomendações." },
          { t: "lista", x: [
            "Conservador: cerca de 75% renda fixa, 15% ações e FIIs, 10% exterior.",
            "Moderado: cerca de 50% renda fixa, 30% ações e FIIs, 20% exterior.",
            "Arrojado: cerca de 30% renda fixa, 45% ações e FIIs, 25% exterior.",
          ] },
          { t: "p", x: "Seu perfil não é só sobre coragem, é sobre prazo e necessidade. Alguém a três anos da aposentadoria deve ser mais conservador do que alguém com trinta anos pela frente, independentemente de temperamento." },
          { t: "chave", x: "A melhor carteira é a que você consegue segurar durante uma crise." },
        ],
      },
      {
        titulo: "Rebalanceamento: o disciplinador automático",
        min: 4,
        blocos: [
          { t: "p", x: "Com o tempo, o que sobe muito passa a ocupar um espaço maior do que você planejou. Rebalancear é voltar às proporções originais, e isso faz você vender parte do que subiu e comprar o que ficou para trás — exatamente o oposto do que o impulso manda fazer." },
          { t: "p", x: "Você pode rebalancear uma ou duas vezes por ano, ou quando uma classe se afastar mais de 5 pontos percentuais do alvo. Para quem está na fase de acumulação, existe um jeito ainda melhor: direcionar os novos aportes para a classe que está abaixo do alvo, sem vender nada." },
          { t: "exemplo", x: "Meta de 50% ações. A bolsa sobe e elas viram 62%. Nos próximos meses, você aporta tudo em renda fixa até a proporção voltar ao lugar — sem pagar imposto e sem precisar prever nada." },
          { t: "chave", x: "Rebalancear obriga você a comprar barato e vender caro sem depender de previsão." },
        ],
      },
    ],
    quiz: [
      { p: "O principal objetivo da diversificação é:", o: ["Garantir o maior retorno possível", "Reduzir o risco de errar em um único ativo", "Eliminar impostos", "Aumentar a liquidez"], r: 1, e: "Ela protege você do que não é possível prever." },
      { p: "Ter dez ações de bancos brasileiros é:", o: ["Uma boa diversificação", "Concentração disfarçada, pois reagem de forma parecida", "Diversificação geográfica", "Proteção contra o dólar"], r: 1, e: "Mesmo setor e mesmo país reagem aos mesmos fatores." },
      { p: "O mercado brasileiro representa aproximadamente quanto do mercado global?", o: ["Cerca de 1%", "Cerca de 10%", "Cerca de 25%", "Metade"], r: 0, e: "Por isso investir só no Brasil é uma aposta bem concentrada." },
      { p: "Ter parte do patrimônio em dólar serve principalmente para:", o: ["Aumentar o rendimento garantido", "Proteger contra a desvalorização do real", "Reduzir impostos", "Eliminar volatilidade"], r: 1, e: "É diversificação de moeda, uma camada que muita gente ignora." },
      { p: "Rebalancear a carteira significa:", o: ["Vender tudo e recomeçar", "Voltar às proporções originais entre as classes", "Comprar apenas o que mais subiu", "Trocar de corretora"], r: 1, e: "Traz a carteira de volta ao plano definido." },
      { p: "Rebalanceamento faz você, na prática:", o: ["Comprar o que subiu e vender o que caiu", "Vender parte do que subiu e comprar o que ficou atrás", "Manter tudo parado", "Concentrar no melhor ativo"], r: 1, e: "É um mecanismo automático de comprar barato e vender caro." },
      { p: "Na fase de acumulação, a forma mais eficiente de rebalancear é:", o: ["Vender ativos todos os meses", "Direcionar os novos aportes para a classe abaixo do alvo", "Parar de aportar", "Zerar a renda fixa"], r: 1, e: "Evita imposto e custos de transação." },
      { p: "Um perfil moderado costuma ter, como referência:", o: ["90% em ações", "Cerca de 50% em renda fixa e o resto em variável e exterior", "100% em renda fixa", "Tudo em fundos imobiliários"], r: 1, e: "É uma divisão equilibrada entre segurança e crescimento." },
      { p: "Alguém a três anos da aposentadoria deveria:", o: ["Aumentar o risco para ganhar mais rápido", "Ser mais conservador, pelo prazo curto", "Ignorar o perfil e seguir o temperamento", "Concentrar em uma única ação"], r: 1, e: "Prazo curto reduz a capacidade de esperar uma recuperação." },
      { p: "A melhor carteira é aquela que:", o: ["Rendeu mais no último ano", "Você consegue manter durante uma crise", "Tem mais ativos diferentes", "Foi indicada por um influenciador"], r: 1, e: "Consistência importa mais que otimização teórica." },
    ],
  },
];

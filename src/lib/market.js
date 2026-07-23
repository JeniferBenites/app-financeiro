// ============================================================================
// Cotações da B3 (somente leitura) — brapi.dev + AwesomeAPI (dólar).
// Com token da brapi: todos os ativos liberados (Ibovespa, ETFs, ações).
// Plano gratuito da brapi = 1 ativo por requisição, então buscamos em paralelo.
// Dados informativos, podem ter atraso. Não é recomendação.
// ============================================================================

const BRAPI = "https://brapi.dev/api/quote";
// Token público de frontend da brapi (fica no bundle do cliente, como toda
// chave de API de front). Env var tem prioridade, se definida.
const TOKEN = import.meta.env.VITE_BRAPI_TOKEN || "jjxSEUSaaMFCw4UGAudXp4";

// Com token: universo completo. Sem token: subconjunto liberado no free.
export const TICKERS_FULL = [
  "^BVSP", "BOVA11", "IVVB11", "PETR4", "VALE3", "ITUB4",
  "BBAS3", "BBDC4", "ABEV3", "WEGE3", "B3SA3", "MGLU3",
];
export const TICKERS_FREE = ["PETR4", "VALE3", "ITUB4", "ABEV3", "BBDC4", "MGLU3"];

// Defesa/aeroespacial e IA/tecnologia — Embraer (BR) + BDRs de gigantes globais.
export const TICKERS_DEFESA_IA = [
  "EMBR3",  // Embraer (defesa/aviação, Brasil)
  "LMTB34", // Lockheed Martin
  "RYTT34", // RTX (Raytheon)
  "NOCG34", // Northrop Grumman
  "GDBR34", // General Dynamics
  "BOEI34", // Boeing
  "NVDC34", // NVIDIA
  "MSFT34", // Microsoft
  "GOGL34", // Alphabet (Google)
  "A1MD34", // AMD
  "P2LT34", // Palantir
  "TSLA34", // Tesla
];

const hasToken = Boolean(TOKEN);

function mapQuote(q) {
  return {
    symbol: q.symbol,
    nome: q.longName || q.shortName || q.symbol,
    preco: q.regularMarketPrice,
    pct: q.regularMarketChangePercent,
    logo: q.logourl || null,
    hora: q.regularMarketTime || null,
  };
}

function urlFor(symbol) {
  const u = `${BRAPI}/${encodeURIComponent(symbol)}`;
  return TOKEN ? `${u}?token=${encodeURIComponent(TOKEN)}` : u;
}

export async function fetchDolar() {
  try {
    const r = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL");
    if (!r.ok) return null;
    const j = await r.json();
    const d = j.USDBRL;
    if (!d) return null;
    return { symbol: "USD", nome: "Dólar comercial", preco: Number(d.bid), pct: Number(d.pctChange), logo: null };
  } catch {
    return null;
  }
}

/** Busca um único ativo (usado pela busca e pela lista). Retorna obj ou null. */
export async function fetchOne(symbol) {
  try {
    const r = await fetch(urlFor(symbol));
    if (!r.ok) return null;
    const j = await r.json();
    const q = (j.results || [])[0];
    return q && q.regularMarketPrice != null ? mapQuote(q) : null;
  } catch {
    return null;
  }
}

/** Busca a lista padrão (paralelo, ignora os que falharem). */
export async function fetchQuotes() {
  const tickers = hasToken ? TICKERS_FULL : TICKERS_FREE;
  const results = await Promise.all(tickers.map(fetchOne));
  return results.filter(Boolean);
}

/** Busca a cesta de Defesa & IA (via BDRs + Embraer). */
export async function fetchDefesaIA() {
  const results = await Promise.all(TICKERS_DEFESA_IA.map(fetchOne));
  return results.filter(Boolean);
}

export const temToken = hasToken;

/* --------------------------------------------------------------------- */
/*  Análise automática por indicadores reais (não é garantia)            */
/* --------------------------------------------------------------------- */

// Detecta um código de ativo da B3 no texto (ex.: PETR4, ITUB4, BOVA11).
export function detectarTicker(texto) {
  const up = (texto || "").toUpperCase();
  const m = up.match(/\b([A-Z]{4}\d{1,2})\b/);
  return m ? m[1] : null;
}

// Lista analisada quando o usuário pede uma recomendação geral.
const ATIVOS_ANALISE = [
  // Brasil
  "PETR4", "VALE3", "ITUB4", "BBAS3", "WEGE3", "MGLU3", "EMBR3",
  // Defesa & IA (via BDR)
  "LMTB34", "RYTT34", "NOCG34", "GDBR34", "NVDC34", "MSFT34", "GOGL34", "P2LT34", "TSLA34",
];

export async function analisar(symbol) {
  try {
    const q = `${BRAPI}/${encodeURIComponent(symbol)}?fundamental=true&modules=defaultKeyStatistics${TOKEN ? `&token=${encodeURIComponent(TOKEN)}` : ""}`;
    const r = await fetch(q);
    if (!r.ok) return null;
    const j = await r.json();
    const d = (j.results || [])[0];
    if (!d || d.regularMarketPrice == null) return null;

    const price = d.regularMarketPrice;
    const low = d.fiftyTwoWeekLow, high = d.fiftyTwoWeekHigh;
    const pe = d.priceEarnings;
    const dyRaw = d.dividendYield ?? d?.defaultKeyStatistics?.dividendYield;
    const chg = d.regularMarketChangePercent ?? 0;

    // BDRs (código termina em 3X, ex.: LMTB34) têm P/L e dividendos distorcidos
    // na fonte — para eles usamos só a faixa de preço, que é confiável.
    const isBDR = /3\d$/.test(d.symbol);

    let score = 0;
    const motivos = [];

    let faixaPct = null;
    if (low != null && high != null && high > low) {
      faixaPct = ((price - low) / (high - low)) * 100;
      if (faixaPct <= 30) { score++; motivos.push(`Perto da mínima de 12 meses (${faixaPct.toFixed(0)}% da faixa) — mais descontado historicamente.`); }
      else if (faixaPct >= 75) { score--; motivos.push(`Perto da máxima de 12 meses (${faixaPct.toFixed(0)}% da faixa) — pode estar esticado.`); }
      else { motivos.push(`No meio da faixa de 12 meses (${faixaPct.toFixed(0)}%).`); }
    }
    if (!isBDR && pe != null && !Number.isNaN(pe)) {
      if (pe > 0 && pe < 10) { score++; motivos.push(`P/L baixo (${pe.toFixed(1)}) — preço atrativo frente ao lucro.`); }
      else if (pe > 25) { score--; motivos.push(`P/L alto (${pe.toFixed(1)}) — muita expectativa no preço.`); }
      else if (pe < 0) { score--; motivos.push(`Lucro negativo (P/L ${pe.toFixed(1)}) — mais risco.`); }
      else { motivos.push(`P/L moderado (${pe.toFixed(1)}).`); }
    }
    if (!isBDR && dyRaw != null && !Number.isNaN(dyRaw) && dyRaw > 0) {
      const dyp = dyRaw <= 1 ? dyRaw * 100 : dyRaw;
      if (dyp >= 6) { score++; motivos.push(`Bons dividendos (~${dyp.toFixed(1)}% ao ano).`); }
      else { motivos.push(`Dividendos ~${dyp.toFixed(1)}% ao ano.`); }
    }

    let label, cor;
    if (score >= 2) { label = "Parece atrativo"; cor = "pos"; }
    else if (score === 1) { label = "Levemente atrativo"; cor = "pos"; }
    else if (score === -1) { label = "Requer atenção"; cor = "neg"; }
    else if (score <= -2) { label = "Pede cautela"; cor = "neg"; }
    else { label = "Neutro"; cor = "mut"; }

    return {
      symbol: d.symbol, nome: d.longName || d.shortName || d.symbol,
      price, chg, faixaPct, pe, dy: dyRaw, score, label, cor, motivos,
    };
  } catch {
    return null;
  }
}

export async function analisarLista() {
  const res = await Promise.all(ATIVOS_ANALISE.map(analisar));
  return res.filter(Boolean).sort((a, b) => b.score - a.score);
}

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

export const temToken = hasToken;

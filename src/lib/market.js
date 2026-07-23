// ============================================================================
// Cotações da B3 (somente leitura) — brapi.dev + AwesomeAPI (dólar).
// Sem token: mostra os papéis liberados no plano gratuito.
// Com um token grátis da brapi (VITE_BRAPI_TOKEN): desbloqueia ETFs e índices.
// Dados informativos, possivelmente com atraso. Não é recomendação.
// ============================================================================

const BRAPI = "https://brapi.dev/api/quote";
const TOKEN = import.meta.env.VITE_BRAPI_TOKEN || "";

// Com token dá para incluir ETFs e o Ibovespa; sem token, papéis grandes liberados.
export const TICKERS_COM_TOKEN = ["^BVSP", "BOVA11", "IVVB11", "PETR4", "VALE3", "ITUB4", "BBAS3", "WEGE3", "ABEV3", "B3SA3"];
export const TICKERS_SEM_TOKEN = ["PETR4", "VALE3", "ITUB4", "ABEV3", "BBDC4", "MGLU3", "PETR3", "B3SA3"];

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

export async function fetchQuotes() {
  // Com token: uma única chamada em lote (mais eficiente) + índice.
  if (TOKEN) {
    try {
      const url = `${BRAPI}/${TICKERS_COM_TOKEN.join(",")}?token=${encodeURIComponent(TOKEN)}`;
      const r = await fetch(url);
      const j = await r.json();
      return (j.results || []).map(mapQuote).filter((q) => q.preco != null);
    } catch {
      return [];
    }
  }
  // Sem token: uma requisição por papel, ignorando os que exigem token (401).
  const results = await Promise.all(
    TICKERS_SEM_TOKEN.map(async (t) => {
      try {
        const r = await fetch(`${BRAPI}/${encodeURIComponent(t)}`);
        if (!r.ok) return null;
        const j = await r.json();
        const q = (j.results || [])[0];
        return q && q.regularMarketPrice != null ? mapQuote(q) : null;
      } catch {
        return null;
      }
    }),
  );
  return results.filter(Boolean);
}

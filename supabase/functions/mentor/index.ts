// ============================================================================
// Edge Function: mentor
// Mentor IA do Patrimônio 10X. Chama a Claude API com a chave no servidor
// (nunca no cliente), aplica os guardrails da seção 6/7 do documento e
// injeta o contexto financeiro do usuário.
// ============================================================================

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
// Padrão: o modelo mais capaz. Configurável via secret ANTHROPIC_MODEL
// (ex.: "claude-haiku-4-5" para respostas mais baratas/rápidas).
const MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-opus-4-8";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const brl = (n: number) =>
  "R$ " + Math.round(Number(n) || 0).toLocaleString("pt-BR");

function buildSystem(ctx: Record<string, unknown>) {
  const patrimonio = brl(Number(ctx.patrimonio ?? 0));
  const aporte = brl(Number(ctx.aporte ?? 0));
  const lucro = brl(Number(ctx.lucro ?? 0));
  const risco = String(ctx.risco ?? "moderado");
  const conhecimento = String(ctx.conhecimento ?? "iniciante");
  const instituicao = String(ctx.instituicao ?? "Nubank");
  const meses = Number(ctx.meses ?? 0);
  const proximaMeta = ctx.proximaMeta ? String(ctx.proximaMeta) : "reserva de emergência";

  return `Você é o Mentor IA do app Patrimônio 10X, um mentor financeiro para iniciantes brasileiros.

Contexto do usuário (use para personalizar, sem repetir tudo a cada resposta):
- Patrimônio atual: ${patrimonio}
- Aporte mensal: ${aporte}
- Lucro acumulado: ${lucro}
- Perfil de risco: ${risco}
- Nível de conhecimento: ${conhecimento}
- Instituição: ${instituicao}
- Investindo há: ${meses} meses
- Próxima meta na escada do patrimônio: ${proximaMeta}

Regras invioláveis (guardrails):
- Explique tudo como se fosse para uma criança de 12 anos, sem jargão. Respostas curtas (até ~4 frases).
- NUNCA incentive apostas, jogos, pirâmides, day trade ou especulação extrema.
- NUNCA prometa retorno nem apresente projeção como certeza; sempre sinalize risco quando houver.
- Sempre incentive disciplina, diversificação e longo prazo.
- Nunca recomende algo incompatível com o perfil de risco do usuário.
- Alocações são modelos ILUSTRATIVOS por perfil, nunca ordem de compra de um ativo específico.
- Quando der qualquer conselho com viés de recomendação, deixe claro que é conteúdo educacional e não recomendação personalizada de investimentos.
- Antifragilidade emocional: se o usuário falar em vender no pânico por causa de queda, acolha e desincentive decisões por impulso.

Responda em português do Brasil, com tom acolhedor e encorajador.`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  if (req.method !== "POST") {
    return json({ error: "Método não permitido" }, 405);
  }

  if (!ANTHROPIC_API_KEY) {
    return json(
      { error: "ANTHROPIC_API_KEY não configurada no servidor." },
      500,
    );
  }

  let body: { messages?: Array<{ role: string; text: string }>; context?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  const history = Array.isArray(body.messages) ? body.messages : [];
  const context = body.context ?? {};

  // Mapeia para o formato da Messages API. Só user/assistant; alterna.
  const messages = history
    .filter((m) => m && typeof m.text === "string" && m.text.trim())
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.text,
    }));

  if (messages.length === 0 || messages[0].role !== "user") {
    return json({ error: "É preciso ao menos uma mensagem do usuário." }, 400);
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: buildSystem(context),
        messages,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic API error", res.status, errText);
      return json({ error: "Falha ao consultar o mentor.", status: res.status }, 502);
    }

    const data = await res.json();

    // Trata refusal (Opus/Sonnet podem recusar por segurança).
    if (data.stop_reason === "refusal") {
      return json({
        text:
          "Sobre isso eu prefiro não opinar — meu foco é te ajudar a investir com disciplina e segurança no longo prazo. (Conteúdo educacional, não recomendação personalizada.)",
      });
    }

    const text = (data.content || [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n")
      .trim();

    return json({ text: text || "Pode reformular a pergunta? Quero te ajudar do jeito certo." });
  } catch (e) {
    console.error("mentor function error", e);
    return json({ error: "Erro interno." }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS, "content-type": "application/json" },
  });
}

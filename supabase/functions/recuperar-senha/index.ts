// ============================================================================
// Edge Function: recuperar-senha
//
// Troca a senha de quem esqueceu. Como o login é só por CPF (sem e-mail de
// verdade na conta), a prova de identidade é o e-mail de recuperação que a
// pessoa cadastrou: só troca a senha quem informar CPF + esse e-mail exato.
//
// A chave de serviço fica só aqui no servidor — o app nunca consegue trocar a
// senha de outra pessoa.
// ============================================================================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  Deno.env.get("SUPABASE_SECRET_KEY") ??
  "";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

const digitos = (s: string) => (s || "").replace(/\D/g, "");

function cpfValido(cpf: string) {
  const d = digitos(cpf);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;
  const calc = (base: string, len: number) => {
    let soma = 0;
    for (let i = 0; i < len; i++) soma += Number(base[i]) * (len + 1 - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(d, 9) === Number(d[9]) && calc(d, 10) === Number(d[10]);
}

/* Atrasa a resposta para desestimular tentativa em massa. */
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ erro: "metodo_invalido" }, 405);
  if (!SERVICE_KEY) return json({ erro: "servidor_sem_chave" }, 500);

  let corpo: { cpf?: string; email?: string; nova_senha?: string };
  try {
    corpo = await req.json();
  } catch {
    return json({ erro: "corpo_invalido" }, 400);
  }

  const cpf = digitos(corpo.cpf ?? "");
  const email = (corpo.email ?? "").trim().toLowerCase();
  const novaSenha = corpo.nova_senha ?? "";

  if (!cpfValido(cpf)) return json({ erro: "cpf_invalido" }, 400);
  if (!email) return json({ erro: "email_obrigatorio" }, 400);
  if (novaSenha.length < 6) return json({ erro: "senha_curta" }, 400);

  const auth = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };

  await espera(700);

  // Acha a conta pelo CPF (o e-mail interno é <cpf>@patrimonio10x.app, mas
  // contas antigas podem ter e-mail próprio — então busca pelo metadata).
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?filter=${cpf}`, { headers: auth });
  if (!res.ok) return json({ erro: "falha_na_busca" }, 500);
  const { users } = await res.json();
  const conta = (users ?? []).find(
    (u: { user_metadata?: { cpf?: string }; email?: string }) =>
      digitos(u.user_metadata?.cpf ?? "") === cpf || (u.email ?? "").startsWith(`${cpf}@`),
  );

  if (!conta) return json({ erro: "cpf_nao_encontrado" }, 404);

  const cadastrado = (conta.user_metadata?.email_recuperacao ?? "").trim().toLowerCase();
  if (!cadastrado) return json({ erro: "sem_email_recuperacao" }, 409);
  if (cadastrado !== email) return json({ erro: "email_nao_confere" }, 403);

  const troca = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${conta.id}`, {
    method: "PUT",
    headers: auth,
    body: JSON.stringify({ password: novaSenha }),
  });
  if (!troca.ok) {
    console.error("falha ao trocar senha:", await troca.text());
    return json({ erro: "falha_ao_trocar" }, 500);
  }

  return json({ ok: true });
});

// ============================================================================
// Edge Function: signup-cpf
//
// Cria a conta usando só CPF e senha. Existe porque o cadastro público do
// Supabase passou a recusar o e-mail interno (<cpf>@patrimonio10x.app): o
// domínio não tem registro MX, e a validação de e-mail derruba o signup com
// "Email address is invalid". Aqui a conta é criada pelo lado servidor, já
// confirmada, com a chave de serviço — que nunca sai do servidor.
//
// Recebe { cpf, nome, senha } e devolve { ok: true }. O login em si continua
// sendo feito pelo app (signInWithPassword), com a mesma senha.
// ============================================================================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  Deno.env.get("SUPABASE_SECRET_KEY") ??
  "";

const DOMINIO = "patrimonio10x.app";

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

function somenteDigitos(s: string) {
  return (s || "").replace(/\D/g, "");
}

/* Mesma validação do app, repetida aqui: cliente nunca é fonte de verdade. */
function cpfValido(cpf: string) {
  const d = somenteDigitos(cpf);
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ erro: "metodo_invalido" }, 405);
  if (!SERVICE_KEY) return json({ erro: "servidor_sem_chave" }, 500);

  let corpo: { cpf?: string; nome?: string; senha?: string };
  try {
    corpo = await req.json();
  } catch {
    return json({ erro: "corpo_invalido" }, 400);
  }

  const cpf = somenteDigitos(corpo.cpf ?? "");
  const senha = corpo.senha ?? "";
  const nome = (corpo.nome ?? "").trim() || "Você";

  if (!cpfValido(cpf)) return json({ erro: "cpf_invalido" }, 400);
  if (senha.length < 6) return json({ erro: "senha_curta" }, 400);

  const email = `${cpf}@${DOMINIO}`;
  const auth = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };

  // Já existe conta com esse CPF?
  const busca = await fetch(
    `${SUPABASE_URL}/auth/v1/admin/users?filter=${encodeURIComponent(email)}`,
    { headers: auth },
  );
  if (busca.ok) {
    const { users } = await busca.json();
    if (Array.isArray(users) && users.some((u: { email?: string }) => u.email === email)) {
      return json({ erro: "cpf_ja_cadastrado" }, 409);
    }
  }

  // Cria já confirmada — não existe caixa de entrada para confirmar.
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: auth,
    body: JSON.stringify({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { nome, cpf },
    }),
  });
  const criado = await res.json();

  if (!res.ok) {
    const msg = String(criado?.msg ?? criado?.message ?? "").toLowerCase();
    if (msg.includes("already") || msg.includes("registered")) {
      return json({ erro: "cpf_ja_cadastrado" }, 409);
    }
    console.error("falha ao criar usuário:", criado);
    return json({ erro: "falha_ao_criar", detalhe: criado?.msg ?? criado?.message }, 500);
  }

  return json({ ok: true, id: criado?.id });
});

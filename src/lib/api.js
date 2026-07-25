import { supabase, isSupabaseConfigured } from "./supabase";

/* Mês de referência atual no formato 'YYYY-MM'. */
export function currentMesRef(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/* ---- CPF: validação e mapeamento para e-mail interno --------------------- */
// O acesso é por CPF. Internamente convertemos o CPF em um e-mail
// (CPF@patrimonio10x.app) que o usuário nunca vê — é só o identificador
// que o Supabase Auth exige.
const CPF_EMAIL_DOMAIN = "patrimonio10x.app";

export function onlyDigits(s) {
  return (s || "").replace(/\D/g, "");
}

export function formatCpf(s) {
  const d = onlyDigits(s).slice(0, 11);
  const p = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9), d.slice(9, 11)];
  let out = p[0];
  if (p[1]) out += "." + p[1];
  if (p[2]) out += "." + p[2];
  if (p[3]) out += "-" + p[3];
  return out;
}

export function isValidCpf(cpf) {
  const d = onlyDigits(cpf);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false; // todos iguais
  const calc = (base, len) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(base[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  const dv1 = calc(d, 9);
  const dv2 = calc(d, 10);
  return dv1 === Number(d[9]) && dv2 === Number(d[10]);
}

/* Busca o e-mail da conta a partir do CPF (função no banco). */
export async function resolveEmailByCpf(cpf) {
  const { data, error } = await supabase.rpc("email_by_cpf", { p_cpf: onlyDigits(cpf) });
  if (error) throw error;
  return data || null; // e-mail (string) ou null
}

/* ---- Auth: cadastro e login só com CPF ----------------------------------- */
// Não pedimos e-mail: o identificador interno é CPF@patrimonio10x.app, gerado
// aqui. Assim ninguém precisa de caixa de entrada para criar a conta.
export function cpfToEmail(cpf) {
  return `${onlyDigits(cpf)}@${CPF_EMAIL_DOMAIN}`;
}

export async function signIn(cpf, password) {
  // Tenta o e-mail interno primeiro; se a conta for antiga (cadastrada com
  // e-mail de verdade), cai na busca pelo CPF no banco.
  const email = (await resolveEmailByCpf(cpf)) || cpfToEmail(cpf);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Cria a conta e já entra.
 *
 * O cadastro público do Supabase recusa o e-mail interno
 * (<cpf>@patrimonio10x.app) porque o domínio não tem MX — dá
 * "Email address is invalid". Por isso a conta é criada pela Edge Function
 * 'signup-cpf', que usa a chave de serviço no servidor e já marca o e-mail
 * como confirmado. Depois o login normal acontece aqui.
 *
 * Se a função ainda não estiver publicada, tenta o cadastro direto (que
 * funciona em projetos sem essa validação).
 */
export async function signUp({ nome, cpf, password }) {
  const payload = { cpf: onlyDigits(cpf), nome: nome || "Você", senha: password };

  let criadaNoServidor = false;
  try {
    const { data, error } = await supabase.functions.invoke("signup-cpf", { body: payload });
    if (error) {
      // A função responde 409 com { erro: "cpf_ja_cadastrado" }.
      const detalhe = await lerErroDaFuncao(error);
      if (detalhe) throw new Error(detalhe);
      throw error;
    }
    if (data?.erro) throw new Error(data.erro);
    criadaNoServidor = !!data?.ok;
  } catch (e) {
    // Erro de regra (CPF já existe, senha curta) sobe para a tela.
    if (ERROS_DE_REGRA.some((k) => String(e?.message || "").includes(k))) throw e;
    // Função ausente ou fora do ar: tenta o caminho direto.
    criadaNoServidor = false;
  }

  if (!criadaNoServidor) {
    const { error } = await supabase.auth.signUp({
      email: cpfToEmail(cpf),
      password,
      options: { data: { nome: nome || "Você", cpf: onlyDigits(cpf) } },
    });
    if (error) throw error;
  }

  // Conta criada já confirmada: entra direto.
  return await signIn(cpf, password);
}

const ERROS_DE_REGRA = ["cpf_ja_cadastrado", "cpf_invalido", "senha_curta"];

/* A mensagem útil da Edge Function vem no corpo da resposta, não no error. */
async function lerErroDaFuncao(error) {
  try {
    const corpo = await error?.context?.json?.();
    return corpo?.erro || null;
  } catch {
    return null;
  }
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}

/* ---- Carga do estado do usuário ----------------------------------------- */
/**
 * Lê perfil, perfil financeiro, metas, plano do mês (com itens) e XP.
 * Se o plano do mês ainda não existir, cria um a partir do aporte padrão
 * distribuído por classe de ativo conforme o perfil de risco.
 */
export async function loadUserState(userId) {
  const mesRef = currentMesRef();

  const [{ data: profile }, { data: fin }, { data: goals }, { data: xp }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("financial_profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("goals").select("*").eq("user_id", userId).order("ordem"),
      supabase.from("xp_events").select("pontos").eq("user_id", userId),
    ]);

  const totalXp = (xp || []).reduce((s, e) => s + (e.pontos || 0), 0);

  const plan = await ensureMonthlyPlan(userId, fin, mesRef);

  // Patrimônio = soma dos aportes concluídos historicamente + carteira.
  const { data: contribs } = await supabase
    .from("contributions")
    .select("valor, mes_ref, data")
    .eq("user_id", userId)
    .order("mes_ref");
  const invested = (contribs || []).reduce((s, c) => s + Number(c.valor || 0), 0);
  const meses = new Set((contribs || []).map((c) => c.mes_ref)).size;

  return {
    profile: profile || { nome: "Você", tema: "light" },
    fin: fin || defaultFin(),
    goals: goals && goals.length ? goals : [],
    plan,
    xp: totalXp,
    invested,
    meses,
    contributions: contribs || [],
  };
}

function defaultFin() {
  return {
    perfil_risco: "moderado",
    conhecimento: "iniciante",
    instituicao: "Nubank",
    aporte_padrao: 2000,
  };
}

/* Distribuição ilustrativa por perfil de risco (soma = 1). */
function allocationFor(risco) {
  switch (risco) {
    case "conservador":
      return [
        { cls: "Tesouro Selic", pct: 0.4, tip: "Segurança e liquidez — bom p/ reserva." },
        { cls: "Tesouro IPCA+", pct: 0.35, tip: "Protege seu dinheiro da inflação." },
        { cls: "ETF brasileiro", pct: 0.15, tip: "Cesta das maiores empresas do Brasil." },
        { cls: "ETF internacional", pct: 0.1, tip: "Fatia do mundo todo em uma cesta só." },
      ];
    case "arrojado":
      return [
        { cls: "ETF internacional", pct: 0.4, tip: "Fatia do mundo todo em uma cesta só." },
        { cls: "ETF brasileiro", pct: 0.3, tip: "Cesta das maiores empresas do Brasil." },
        { cls: "Tesouro IPCA+", pct: 0.2, tip: "Protege seu dinheiro da inflação." },
        { cls: "Tesouro Selic", pct: 0.1, tip: "Segurança e liquidez — bom p/ reserva." },
      ];
    default: // moderado
      return [
        { cls: "ETF internacional", pct: 0.35, tip: "Fatia do mundo todo em uma cesta só." },
        { cls: "ETF brasileiro", pct: 0.25, tip: "Cesta das maiores empresas do Brasil." },
        { cls: "Tesouro IPCA+", pct: 0.25, tip: "Protege seu dinheiro da inflação." },
        { cls: "Tesouro Selic", pct: 0.15, tip: "Segurança e liquidez — bom p/ reserva." },
      ];
  }
}

async function ensureMonthlyPlan(userId, fin, mesRef) {
  const aporte = Number(fin?.aporte_padrao ?? 2000);
  const risco = fin?.perfil_risco ?? "moderado";

  let { data: plan } = await supabase
    .from("monthly_plans")
    .select("*, plan_items(*)")
    .eq("user_id", userId)
    .eq("mes_ref", mesRef)
    .maybeSingle();

  if (plan) {
    plan.plan_items = (plan.plan_items || []).sort((a, b) =>
      a.valor < b.valor ? 1 : -1,
    );
    return plan;
  }

  // Cria o plano do mês + itens.
  const { data: newPlan, error } = await supabase
    .from("monthly_plans")
    .insert({ user_id: userId, mes_ref: mesRef, valor_a_investir: aporte, gerado_por_ia: true })
    .select()
    .single();
  if (error) throw error;

  const alloc = allocationFor(risco);
  const items = alloc.map((a) => ({
    user_id: userId,
    plano_id: newPlan.id,
    classe_ativo: a.cls,
    descricao: a.tip,
    valor: Math.round(aporte * a.pct),
    concluido: false,
  }));
  const { data: insertedItems } = await supabase.from("plan_items").insert(items).select();
  newPlan.plan_items = insertedItems || [];
  return newPlan;
}

/* ---- Mutations ----------------------------------------------------------- */
export async function togglePlanItem(itemId, concluido) {
  const { error } = await supabase
    .from("plan_items")
    .update({ concluido })
    .eq("id", itemId);
  if (error) throw error;
}

export async function completeMonthlyPlan(userId, plan) {
  const total = (plan.plan_items || []).reduce((s, i) => s + Number(i.valor || 0), 0);
  await supabase
    .from("monthly_plans")
    .update({ status: "concluido" })
    .eq("id", plan.id);
  await supabase.from("contributions").insert({
    user_id: userId,
    mes_ref: plan.mes_ref,
    valor: total,
    origem: "plano_mensal",
  });
  await addXp(userId, "aporte_mensal", 120);
}

export async function addXp(userId, origem, pontos) {
  const { error } = await supabase
    .from("xp_events")
    .insert({ user_id: userId, origem, pontos });
  if (error) throw error;
}

export async function saveOnboarding(userId, answers) {
  // answers: { conhecimento, instituicao, aporte, risco }
  const { error } = await supabase
    .from("financial_profiles")
    .upsert(
      {
        user_id: userId,
        conhecimento: answers.conhecimento,
        instituicao: answers.instituicao,
        aporte_padrao: answers.aporte,
        perfil_risco: answers.risco,
      },
      { onConflict: "user_id" },
    );
  if (error) throw error;
}

/* ---- Mentor IA ----------------------------------------------------------- */
/** Chama a Edge Function 'mentor'. Retorna string de resposta. */
export async function askMentor(messages, context) {
  if (!isSupabaseConfigured) throw new Error("supabase-off");
  const { data, error } = await supabase.functions.invoke("mentor", {
    body: { messages, context },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data?.text ?? "";
}

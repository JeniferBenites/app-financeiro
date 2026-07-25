import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Home, Target, MessageCircle, BookOpen, Calculator as CalcIcon,
  TrendingUp, TrendingDown, Flame, Check, ChevronRight, Sparkles, Shield, Wallet,
  PiggyBank, Award, Sun, Moon, Send, Info, ArrowLeft, Lock, Trophy,
  GraduationCap, HelpCircle, RefreshCw, BarChart3, UserCog,
} from "lucide-react";
import { fetchQuotes, fetchDolar, fetchOne, fetchDefesaIA, detectarTicker, analisar, analisarLista } from "./lib/market";
import { useSession } from "./hooks/useSession";
import { useAppUpdate } from "./hooks/useAppUpdate";
import Auth from "./screens/Auth.jsx";
import {
  loadUserState, togglePlanItem, completeMonthlyPlan, saveOnboarding,
  signOut, askMentor, currentMesRef, addXp,
  trocarSenha, salvarEmailRecuperacao, emailRecuperacaoDaSessao, formatCpf,
} from "./lib/api";
import { isSupabaseConfigured } from "./lib/supabase";
import { answerFromKb } from "./lib/mentorKb";
import {
  CURRICULO, TOTAL_MODULOS, ACERTOS_MINIMOS, XP_MODULO,
  moduloPorSlug, moduloLiberado, indiceAtual,
} from "./lib/curriculum";
import { loadProgresso, saveProgresso, marcarPagina, registrarQuiz } from "./lib/learnProgress";

/* ------------------------------------------------------------------ */
/*  Tema (claro / escuro)                                             */
/* ------------------------------------------------------------------ */
const tokens = (dark) => dark ? {
  bg: "#0D0A17", surface: "#17122A", surfaceAlt: "#1F1836",
  text: "#F4F2FB", textMut: "#A79FC2", border: "#2A2340",
  primary: "#9D6DF5", primarySoft: "#241B3D",
  accent: "#F5B93B", positive: "#2DD4A7", negative: "#FF6B6E",
  hero: "linear-gradient(135deg,#5B21B6 0%,#7C3AED 55%,#B531C9 100%)",
} : {
  bg: "#F7F6FB", surface: "#FFFFFF", surfaceAlt: "#F1EEFA",
  text: "#1A1526", textMut: "#6B6580", border: "#ECE8F5",
  primary: "#6D28D9", primarySoft: "#EDE7FB",
  accent: "#E0A106", positive: "#0BA678", negative: "#E5484D",
  hero: "linear-gradient(135deg,#6D28D9 0%,#9333EA 55%,#C026D3 100%)",
};

const brl = (n) => "R$ " + Math.round(n).toLocaleString("pt-BR");
const brlk = (n) => n >= 1000000 ? "R$ " + (n / 1000000).toFixed(n % 1000000 ? 1 : 0) + "M"
  : n >= 1000 ? "R$ " + Math.round(n / 1000) + "k" : brl(n);

const MESES_PT = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const mesAtualNome = () => MESES_PT[new Date().getMonth()];

/* Projeção de juros compostos com aporte mensal */
function project(years, monthly, ratePct, initial) {
  const r = ratePct / 100, pts = [];
  let bal = initial;
  const y0 = new Date().getFullYear();
  for (let y = 0; y <= years; y++) {
    pts.push({ year: y0 + y, value: Math.round(bal), aportado: Math.round(initial + monthly * 12 * y) });
    for (let m = 0; m < 12; m++) bal = bal * (1 + r / 12) + monthly;
  }
  return pts;
}

const GOALS_FALLBACK = [
  { t: "Reserva de emergência", v: 12000 }, { t: "Primeiro degrau", v: 25000 },
  { t: "Ganhando ritmo", v: 50000 }, { t: "Seis dígitos", v: 100000 },
  { t: "Um quarto de milhão", v: 250000 }, { t: "Meio milhão", v: 500000 },
  { t: "O primeiro milhão", v: 1000000 }, { t: "Dois milhões", v: 2000000 },
  { t: "Cinco milhões", v: 5000000 }, { t: "Independência 10X", v: 10000000 },
];

/* ------------------------------------------------------------------ */
/*  App raiz — decide entre Auth, carga e modo demo                    */
/* ------------------------------------------------------------------ */
export default function App() {
  const [dark, setDark] = useState(false);
  const C = tokens(dark);
  const { session, loading, configured } = useSession();
  const update = useAppUpdate();

  // A barra de atualização aparece em qualquer tela (login, onboarding ou app).
  const tela = (() => {
    if (!configured) return <MainApp C={C} dark={dark} setDark={setDark} demo />;
    if (loading) return <Splash C={C} />;
    if (!session) return <Auth C={C} dark={dark} setDark={setDark} />;
    return <AuthedApp C={C} dark={dark} setDark={setDark} session={session} />;
  })();

  return (
    <>
      {tela}
      <UpdateBanner C={C} update={update} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Aviso de versão nova — o usuário decide quando atualizar           */
/* ------------------------------------------------------------------ */
function UpdateBanner({ C, update }) {
  const { status, info, progresso, atualizar, dispensar } = update;
  if (status === "idle") return null;

  const caixa = {
    position: "fixed", left: "50%", transform: "translateX(-50%)", bottom: 92,
    width: "calc(100% - 32px)", maxWidth: 448, zIndex: 70,
    background: C.surface, border: `1.5px solid ${C.primary}`, borderRadius: 20,
    padding: 15, boxShadow: "0 12px 32px rgba(0,0,0,.22)",
    fontFamily: "'Inter',system-ui,sans-serif", color: C.text,
  };

  if (status === "baixando") {
    return (
      <div style={caixa}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <RefreshCw size={17} color={C.primary} />
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>Baixando a atualização… {progresso}%</div>
        </div>
        <div style={{ height: 6, borderRadius: 6, background: C.surfaceAlt, overflow: "hidden" }}>
          <div style={{ width: `${progresso}%`, height: "100%", background: C.hero, transition: "width .3s" }} />
        </div>
        <div style={{ fontSize: 12, color: C.textMut, marginTop: 8 }}>
          O app vai reabrir sozinho na versão nova. Não feche agora.
        </div>
      </div>
    );
  }

  if (status === "erro") {
    return (
      <div style={caixa}>
        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>Não deu para atualizar</div>
        <div style={{ fontSize: 13, color: C.textMut, marginBottom: 12, lineHeight: 1.45 }}>
          Verifique sua internet e tente de novo. O app continua funcionando na versão atual.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={dispensar} style={{ flex: 1, padding: "11px 0", borderRadius: 13, border: "none",
            background: C.surfaceAlt, color: C.text, fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
            Agora não
          </button>
          <button onClick={atualizar} style={{ flex: 1, padding: "11px 0", borderRadius: 13, border: "none",
            background: C.primary, color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
            Tentar de novo
          </button>
        </div>
      </div>
    );
  }

  // status === "disponivel"
  return (
    <div style={caixa}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ width: 30, height: 30, borderRadius: 10, background: C.hero, display: "grid",
          placeItems: "center", color: "#fff", flexShrink: 0 }}>
          <Sparkles size={16} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 15 }}>Nova versão disponível</div>
      </div>
      <div style={{ fontSize: 13, color: C.textMut, lineHeight: 1.45, margin: "6px 0 12px" }}>
        {info?.notas ? info.notas : "Melhorias e correções novas no app."}
        {info?.versao && <span style={{ display: "block", marginTop: 3, fontSize: 11.5 }}>
          versão {info.versao}{info.atual ? ` · você está na ${info.atual}` : ""}
        </span>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={dispensar} style={{ width: 108, padding: "12px 0", borderRadius: 13, border: "none",
          background: C.surfaceAlt, color: C.text, fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
          Depois
        </button>
        <button onClick={atualizar} style={{ flex: 1, padding: "12px 0", borderRadius: 13, border: "none",
          background: C.primary, color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          <RefreshCw size={16} /> Atualizar agora
        </button>
      </div>
    </div>
  );
}

function Splash({ C }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "grid", placeItems: "center", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: C.hero, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, margin: "0 auto 14px" }}>10X</div>
        <div style={{ color: C.textMut }}>Carregando…</div>
      </div>
    </div>
  );
}

/* Carrega o estado do usuário do Supabase e monta o app. */
function AuthedApp({ C, dark, setDark, session }) {
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const userId = session.user.id;

  async function refresh() {
    try {
      const s = await loadUserState(userId);
      setState(s);
    } catch (e) {
      setError(e?.message || "Erro ao carregar seus dados.");
    }
  }

  useEffect(() => { refresh(); }, [userId]);

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "grid", placeItems: "center", padding: 24, fontFamily: "'Inter',system-ui,sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 340 }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Ops…</div>
          <div style={{ color: C.textMut, fontSize: 14, marginBottom: 16 }}>{error}</div>
          <button onClick={() => { setError(null); refresh(); }} style={{ padding: "12px 18px", borderRadius: 12, border: "none", background: C.primary, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Tentar de novo</button>
        </div>
      </div>
    );
  }

  if (!state) return <Splash C={C} />;

  const needsOnboarding = !state.fin || !state.fin.perfil_risco || state.fin.__isDefault;

  return (
    <MainApp
      C={C} dark={dark} setDark={setDark}
      session={session} state={state} onRefresh={refresh}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  MainApp — recebe estado real (ou usa demo)                         */
/* ------------------------------------------------------------------ */
function MainApp({ C, dark, setDark, demo, session, state, onRefresh }) {
  const [booted, setBooted] = useState(demo ? false : true); // onboarding
  const [tab, setTab] = useState("inicio");
  const [moduloAberto, setModuloAberto] = useState(null); // slug do módulo em leitura
  const [contaAberta, setContaAberta] = useState(false);

  // ---- Derivar o "user" e coleções a partir do estado real ou demo ----
  const demoUser = { nome: "Você", instituicao: "Nubank", aporte: 2000, risco: "moderado",
    conhecimento: "iniciante", invested: 16000, patrimonio: 17240, meses: 8 };

  const fin = state?.fin;
  const invested = demo ? demoUser.invested : (state?.invested ?? 0);
  const patrimonio = demo ? demoUser.patrimonio : invested; // sem dados de mercado, patrimônio ≈ aportado
  const user = demo ? demoUser : {
    nome: state?.profile?.nome || "Você",
    instituicao: fin?.instituicao || "Nubank",
    aporte: Number(fin?.aporte_padrao ?? 2000),
    risco: fin?.perfil_risco || "moderado",
    conhecimento: fin?.conhecimento || "iniciante",
    invested,
    patrimonio,
    meses: state?.meses ?? 0,
  };
  const lucro = user.patrimonio - user.invested;
  const rentab = user.invested > 0 ? (lucro / user.invested) * 100 : 0;

  const [xp, setXp] = useState(demo ? 1240 : (state?.xp ?? 0));
  useEffect(() => { if (!demo && state) setXp(state.xp ?? 0); }, [state, demo]);
  const nivel = Math.floor(xp / 400) + 1;
  const xpNivel = xp % 400;

  // ---- Trilha "Aprender": progresso por usuário, começando do zero ----
  const learnId = demo ? "demo" : session?.user?.id;
  const [progresso, setProgresso] = useState(() => loadProgresso(learnId));
  useEffect(() => { setProgresso(loadProgresso(learnId)); }, [learnId]);

  function guardarProgresso(atualizar) {
    setProgresso((prev) => {
      const next = atualizar(prev);
      saveProgresso(learnId, next);
      return next;
    });
  }
  function aoLerPagina(slug, pagina) {
    guardarProgresso((p) => marcarPagina(p, slug, pagina));
  }
  function aoTerminarQuiz(slug, acertos, aprovado) {
    const jaConcluido = !!progresso?.[slug]?.concluido;
    guardarProgresso((p) => registrarQuiz(p, slug, acertos, aprovado));
    if (aprovado && !jaConcluido) {
      setXp(x => x + XP_MODULO);
      if (!demo && session) {
        addXp(session.user.id, `modulo:${slug}`, XP_MODULO).catch(() => { /* silencioso */ });
      }
    }
  }

  // ---- Itens do plano do mês ----
  const demoItems = [
    { id: 1, cls: "ETF internacional", val: 700, tip: "Fatia do mundo todo em uma cesta só.", done: false },
    { id: 2, cls: "ETF brasileiro", val: 500, tip: "Cesta das maiores empresas do Brasil.", done: false },
    { id: 3, cls: "Tesouro IPCA+", val: 500, tip: "Protege seu dinheiro da inflação.", done: false },
    { id: 4, cls: "Tesouro Selic", val: 300, tip: "Segurança e liquidez — bom p/ reserva.", done: false },
  ];
  const [items, setItems] = useState(demoItems);
  useEffect(() => {
    if (!demo && state?.plan?.plan_items) {
      setItems(state.plan.plan_items.map((i) => ({
        id: i.id, cls: i.classe_ativo, val: Number(i.valor), tip: i.descricao, done: i.concluido,
      })));
    }
  }, [state, demo]);
  const allDone = items.length > 0 && items.every((i) => i.done);
  const planConcluido = !demo && state?.plan?.status === "concluido";

  // ---- Metas ----
  const goals = (!demo && state?.goals?.length)
    ? state.goals.map((g) => ({ t: g.titulo, v: Number(g.valor_alvo) }))
    : GOALS_FALLBACK;

  const mentorCtx = {
    patrimonio: user.patrimonio, aporte: user.aporte, lucro, risco: user.risco,
    conhecimento: user.conhecimento, instituicao: user.instituicao, meses: user.meses,
    proximaMeta: (goals.find((g) => g.v > user.patrimonio) || goals[goals.length - 1])?.t,
  };

  const history = useMemo(() => buildHistory(demo, state, user), [demo, state]);

  // ---- Handlers de persistência ----
  async function persistToggle(item) {
    if (demo || !session) return;
    try { await togglePlanItem(item.id, item.done); } catch (e) { /* silencioso */ }
  }
  async function persistComplete() {
    if (demo || !session || planConcluido) return;
    try {
      await completeMonthlyPlan(session.user.id, state.plan);
      onRefresh?.();
    } catch (e) { /* silencioso */ }
  }

  if (!booted) {
    return (
      <Onboarding C={C} dark={dark} setDark={setDark} demo={demo} session={session}
        onDone={() => { setBooted(true); if (!demo) onRefresh?.(); }} />
    );
  }

  const shell = { minHeight: "100vh", background: C.bg, color: C.text,
    fontFamily: "'Inter',system-ui,sans-serif", maxWidth: 480, margin: "0 auto",
    position: "relative", paddingBottom: 78 };

  return (
    <div style={shell}>
      <Header C={C} dark={dark} setDark={setDark} nivel={nivel} xpNivel={xpNivel}
        streak={user.meses} canLogout={!demo && !!session}
        onConta={() => setContaAberta(true)} />

      <div style={{ padding: "0 18px" }}>
        {tab === "inicio" && <Dashboard C={C} user={user} lucro={lucro} rentab={rentab} goals={goals} items={items} history={history} />}
        {tab === "metas" && <Goals C={C} goals={goals} patrimonio={user.patrimonio} aporte={user.aporte} />}
        {tab === "mentor" && <Mentor C={C} user={user} lucro={lucro} ctx={mentorCtx} />}
        {tab === "aprender" && <Learn C={C} progresso={progresso} onOpen={setModuloAberto} />}
        {tab === "calc" && <Calc C={C} aporteInicial={user.aporte} />}
      </div>

      {tab === "inicio" && (
        <MonthlyCard C={C} items={items} setItems={setItems} allDone={allDone}
          planConcluido={planConcluido} xp={xp} setXp={setXp}
          onToggle={persistToggle} onComplete={persistComplete} demo={demo} />
      )}

      {contaAberta && session && (
        <ContaModal C={C} session={session} onClose={() => setContaAberta(false)} />
      )}

      {moduloAberto && moduloPorSlug(moduloAberto) && (
        <ModuleReader C={C} modulo={moduloPorSlug(moduloAberto)} progresso={progresso}
          onPagina={aoLerPagina} onConcluir={aoTerminarQuiz}
          onClose={() => setModuloAberto(null)} />
      )}

      <BottomNav C={C} tab={tab} setTab={setTab} />
    </div>
  );
}

function buildHistory(demo, state, user) {
  if (demo) {
    return [
      { m: "Jan", v: 2000 }, { m: "Fev", v: 4120 }, { m: "Mar", v: 6180 },
      { m: "Abr", v: 8350 }, { m: "Mai", v: 10600 }, { m: "Jun", v: 12980 },
      { m: "Jul", v: 15100 }, { m: "Ago", v: 17240 },
    ];
  }
  const contribs = state?.contributions || [];
  if (!contribs.length) {
    return [{ m: mesAtualNome().slice(0, 3), v: user.patrimonio }];
  }
  let acc = 0;
  return contribs.map((c) => {
    acc += Number(c.valor || 0);
    const mm = Number((c.mes_ref || "").split("-")[1] || 1) - 1;
    return { m: (MESES_PT[mm] || "").slice(0, 3), v: acc };
  });
}

/* ------------------------------------------------------------------ */
/*  Componentes compartilhados                                        */
/* ------------------------------------------------------------------ */
function Card({ C, children, style }) {
  return <div style={{ background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 22, padding: 18, ...style }}>{children}</div>;
}

function Term({ C, label, tip }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 3 }}>
      {label}
      <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: C.primary, display: "inline-flex" }}>
        <HelpCircle size={13} />
      </button>
      {open && (
        <span style={{ position: "absolute", bottom: "130%", left: 0, width: 210, background: C.text, color: C.bg,
          fontSize: 12, lineHeight: 1.4, padding: "8px 10px", borderRadius: 12, zIndex: 50, fontWeight: 500 }}>
          {tip}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Minha conta — trocar senha e e-mail de recuperação                 */
/* ------------------------------------------------------------------ */
function ContaModal({ C, session, onClose }) {
  const [email, setEmail] = useState(emailRecuperacaoDaSessao(session) || "");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [msg, setMsg] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const cpf = session?.user?.user_metadata?.cpf;
  const nome = session?.user?.user_metadata?.nome || "Você";

  const campo = { width: "100%", background: C.surfaceAlt, border: `1px solid ${C.border}`,
    borderRadius: 13, padding: "12px 14px", fontSize: 14.5, color: C.text, outline: "none" };
  const botao = (bg, cor) => ({ padding: "12px 0", borderRadius: 13, border: "none", cursor: "pointer",
    background: bg, color: cor, fontWeight: 700, fontSize: 14, width: "100%" });

  async function salvarEmail() {
    setMsg(null); setSalvando(true);
    try {
      await salvarEmailRecuperacao(email);
      setMsg({ ok: true, t: email.trim() ? "E-mail de recuperação salvo." : "E-mail de recuperação removido." });
    } catch (e) {
      setMsg({ ok: false, t: e?.message === "email_invalido" ? "E-mail inválido." : "Não deu para salvar. Tente de novo." });
    } finally { setSalvando(false); }
  }

  async function salvarSenha() {
    setMsg(null);
    if (senha.length < 6) { setMsg({ ok: false, t: "A senha precisa ter ao menos 6 caracteres." }); return; }
    if (senha !== senha2) { setMsg({ ok: false, t: "As duas senhas não são iguais." }); return; }
    setSalvando(true);
    try {
      await trocarSenha(senha);
      setSenha(""); setSenha2("");
      setMsg({ ok: true, t: "Senha trocada." });
    } catch (e) {
      setMsg({ ok: false, t: "Não deu para trocar a senha. Tente de novo." });
    } finally { setSalvando(false); }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 65,
      display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.surface, width: "100%", maxWidth: 480,
        borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 24, maxHeight: "88vh", overflowY: "auto",
        fontFamily: "'Inter',system-ui,sans-serif", color: C.text }}>
        <div style={{ width: 40, height: 4, borderRadius: 4, background: C.border, margin: "0 auto 18px" }} />

        <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.5 }}>Minha conta</div>
        <div style={{ fontSize: 13, color: C.textMut, marginTop: 4, marginBottom: 18 }}>
          {nome}{cpf ? ` · CPF ${formatCpf(cpf)}` : ""}
        </div>

        {msg && (
          <div style={{ fontSize: 13, fontWeight: 600, borderRadius: 11, padding: "10px 12px", marginBottom: 14,
            color: msg.ok ? C.positive : C.negative,
            background: msg.ok ? C.primarySoft : "rgba(229,72,77,.12)" }}>{msg.t}</div>
        )}

        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 6 }}>E-mail para recuperar senha</div>
        <div style={{ fontSize: 12.5, color: C.textMut, marginBottom: 10, lineHeight: 1.45 }}>
          Sem ele, não há como recuperar a senha se você esquecer.
        </div>
        <input style={campo} type="email" inputMode="email" placeholder="seu@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={salvarEmail} disabled={salvando} style={{ ...botao(C.surfaceAlt, C.text), marginTop: 9 }}>
          Salvar e-mail
        </button>

        <div style={{ height: 1, background: C.border, margin: "22px 0" }} />

        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 10 }}>Trocar senha</div>
        <input style={{ ...campo, marginBottom: 9 }} type="password" placeholder="Nova senha"
          value={senha} onChange={(e) => setSenha(e.target.value)} />
        <input style={campo} type="password" placeholder="Repita a nova senha"
          value={senha2} onChange={(e) => setSenha2(e.target.value)} />
        <button onClick={salvarSenha} disabled={salvando} style={{ ...botao(C.primary, "#fff"), marginTop: 9 }}>
          Trocar senha
        </button>

        <div style={{ height: 1, background: C.border, margin: "22px 0" }} />

        <button onClick={() => signOut()} style={botao(C.surfaceAlt, C.negative)}>Sair da conta</button>
        <button onClick={onClose} style={{ ...botao("transparent", C.textMut), marginTop: 6 }}>Fechar</button>
      </div>
    </div>
  );
}

function Header({ C, dark, setDark, nivel, xpNivel, streak, canLogout, onConta }) {
  return (
    <div style={{ padding: "16px 18px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 11, background: C.hero, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>10X</div>
        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>Patrimônio 10X</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: C.surfaceAlt, padding: "5px 9px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: C.accent }}>
          <Flame size={13} /> {streak}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, background: C.surfaceAlt, padding: "5px 9px", borderRadius: 20 }}>
          <div style={{ width: 20, height: 20, borderRadius: 7, background: C.primary, color: "#fff", fontSize: 11, fontWeight: 800, display: "grid", placeItems: "center" }}>{nivel}</div>
          <div style={{ width: 34, height: 5, borderRadius: 5, background: C.border, overflow: "hidden" }}>
            <div style={{ width: `${(xpNivel / 400) * 100}%`, height: "100%", background: C.accent }} />
          </div>
        </div>
        <button onClick={() => setDark(d => !d)} style={{ background: C.surfaceAlt, border: "none", borderRadius: 20, width: 30, height: 30, display: "grid", placeItems: "center", color: C.text, cursor: "pointer" }}>
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        {canLogout && (
          <button onClick={onConta} title="Minha conta" style={{ background: C.surfaceAlt, border: "none", borderRadius: 20, width: 30, height: 30, display: "grid", placeItems: "center", color: C.textMut, cursor: "pointer" }}>
            <UserCog size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function BottomNav({ C, tab, setTab }) {
  const items = [
    { id: "inicio", ic: Home, l: "Início" },
    { id: "metas", ic: Target, l: "Metas" },
    { id: "mentor", ic: MessageCircle, l: "Mentor" },
    { id: "aprender", ic: BookOpen, l: "Aprender" },
    { id: "calc", ic: CalcIcon, l: "Calcular" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480,
      background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", padding: "8px 6px 12px", zIndex: 40 }}>
      {items.map(({ id, ic: Ic, l }) => {
        const on = tab === id;
        return (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: on ? C.primary : C.textMut }}>
            <Ic size={21} strokeWidth={on ? 2.6 : 2} />
            <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 500 }}>{l}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Onboarding                                                         */
/* ------------------------------------------------------------------ */
function Onboarding({ C, dark, setDark, onDone, demo, session }) {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const steps = [
    { q: "Qual é o seu nível hoje?", k: "conhecimento", opts: ["Nunca investi", "Sei o básico", "Já invisto"],
      vals: ["iniciante", "intermediario", "avancado"] },
    { q: "Onde você guarda seu dinheiro?", k: "instituicao", opts: ["Nubank", "Banco tradicional", "Corretora", "Ainda não tenho"],
      vals: ["Nubank", "Banco tradicional", "Corretora", "Nenhuma"] },
    { q: "Quanto dá para investir por mês?", k: "aporte", opts: ["R$ 500", "R$ 1.000", "R$ 2.000", "R$ 5.000+"],
      vals: [500, 1000, 2000, 5000] },
    { q: "Como você reage a oscilações?", k: "risco", opts: ["Prefiro segurança", "Aceito um meio-termo", "Topo mais risco por mais retorno"],
      vals: ["conservador", "moderado", "arrojado"] },
    { q: "Qual é o grande objetivo?", k: "meta", opts: ["Reserva de emergência", "Comprar um imóvel", "Aposentadoria tranquila", "Independência financeira"],
      vals: ["reserva", "imovel", "aposentadoria", "independencia"] },
  ];
  const [ans, setAns] = useState({ conhecimento: 0, instituicao: 0, aporte: 2, risco: 1, meta: 3 });
  const isLast = step === steps.length - 1;

  const wrap = { minHeight: "100vh", background: C.bg, color: C.text, maxWidth: 480, margin: "0 auto",
    fontFamily: "'Inter',system-ui,sans-serif", padding: 22, display: "flex", flexDirection: "column" };

  async function finish() {
    setGenerating(true);
    if (!demo && session) {
      try {
        await saveOnboarding(session.user.id, {
          conhecimento: steps[0].vals[ans.conhecimento],
          instituicao: steps[1].vals[ans.instituicao],
          aporte: steps[2].vals[ans.aporte],
          risco: steps[3].vals[ans.risco],
        });
      } catch (e) { /* segue mesmo assim */ }
    }
    setTimeout(onDone, demo ? 1600 : 900);
  }

  if (generating) {
    return (
      <div style={{ ...wrap, alignItems: "center", justifyContent: "center", textAlign: "center", gap: 18 }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: C.hero, display: "grid", placeItems: "center", color: "#fff" }}>
          <Sparkles size={30} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Montando seu plano…</div>
        <div style={{ color: C.textMut, fontSize: 14, maxWidth: 280 }}>
          Criando sua reserva de emergência, suas metas e a distribuição mensal dos aportes.
        </div>
      </div>
    );
  }

  const s = steps[step];
  return (
    <div style={wrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 26 : 8, height: 8, borderRadius: 8, background: i <= step ? C.primary : C.border, transition: "all .3s" }} />
          ))}
        </div>
        <button onClick={() => setDark(d => !d)} style={{ background: C.surfaceAlt, border: "none", borderRadius: 20, width: 32, height: 32, display: "grid", placeItems: "center", color: C.text, cursor: "pointer" }}>
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {step === 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: C.hero, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, marginBottom: 14 }}>10X</div>
          <div style={{ fontSize: 15, color: C.textMut }}>Vamos montar seu plano em 30 segundos. Sem termos difíceis — prometo.</div>
        </div>
      )}

      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.15, marginBottom: 22 }}>{s.q}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {s.opts.map((o, i) => {
          const on = ans[s.k] === i;
          return (
            <button key={i} onClick={() => setAns(a => ({ ...a, [s.k]: i }))}
              style={{ textAlign: "left", padding: "16px 18px", borderRadius: 16, cursor: "pointer",
                background: on ? C.primarySoft : C.surface, color: C.text,
                border: `1.5px solid ${on ? C.primary : C.border}`, fontSize: 15.5, fontWeight: on ? 700 : 500,
                display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {o}
              {on && <Check size={18} color={C.primary} />}
            </button>
          );
        })}
      </div>

      <button onClick={() => { if (isLast) finish(); else setStep(step + 1); }}
        style={{ marginTop: 20, padding: 17, borderRadius: 16, border: "none", cursor: "pointer",
        background: C.primary, color: "#fff", fontSize: 16, fontWeight: 700, display: "flex",
        justifyContent: "center", alignItems: "center", gap: 8 }}>
        {isLast ? "Gerar meu plano" : "Continuar"} <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */
function Dashboard({ C, user, lucro, rentab, goals, items, history }) {
  const nextGoal = goals.find(g => g.v > user.patrimonio) || goals[goals.length - 1];
  const prevGoalV = goals[goals.indexOf(nextGoal) - 1]?.v || 0;
  const pct = Math.min(100, Math.max(0, ((user.patrimonio - prevGoalV) / (nextGoal.v - prevGoalV)) * 100));

  const proj = { 5: 0, 10: 0, 20: 0, 35: 0 };
  Object.keys(proj).forEach(y => {
    const p = project(+y, user.aporte, 10, user.patrimonio);
    proj[y] = p[p.length - 1].value;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Herói */}
      <div style={{ background: C.hero, borderRadius: 26, padding: 22, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 600 }}>Seu patrimônio hoje</div>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.5, margin: "2px 0 6px" }}>{brl(user.patrimonio)}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.18)", padding: "5px 11px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
          <TrendingUp size={14} /> +{brl(lucro)} · +{rentab.toFixed(1)}%
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 18 }}>
          <MiniStat l="Investido" v={brl(user.invested)} />
          <MiniStat l="Aporte/mês" v={brl(user.aporte)} />
          <MiniStat l="Investindo há" v={`${user.meses} ${user.meses === 1 ? "mês" : "meses"}`} />
        </div>
      </div>

      {/* Meta atual */}
      <Card C={C}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Target size={17} color={C.primary} />
            <span style={{ fontWeight: 700, fontSize: 14.5 }}>{nextGoal.t}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{pct.toFixed(0)}%</span>
        </div>
        <div style={{ height: 10, borderRadius: 10, background: C.surfaceAlt, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: C.hero, borderRadius: 10 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12.5, color: C.textMut }}>
          <span>{brl(user.patrimonio)}</span>
          <span>faltam {brl(Math.max(0, nextGoal.v - user.patrimonio))}</span>
        </div>
      </Card>

      {/* Evolução */}
      <Card C={C}>
        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 6 }}>Evolução do patrimônio</div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={history} margin={{ left: -18, right: 4, top: 4 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.primary} stopOpacity={0.5} />
                <stop offset="100%" stopColor={C.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={C.border} />
            <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.textMut }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: C.textMut }} axisLine={false} tickLine={false} tickFormatter={brlk} />
            <Tooltip formatter={(v) => brl(v)} contentStyle={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: 12 }} />
            <Area type="monotone" dataKey="v" stroke={C.primary} strokeWidth={2.5} fill="url(#g1)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Projeções */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 14.5, margin: "2px 4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
          Se você mantiver o ritmo <Term C={C} label="" tip="Simulação com 10% ao ano mantendo seu aporte atual. É estimativa, não garantia." />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <ProjCard C={C} l="Em 5 anos" v={proj[5]} />
          <ProjCard C={C} l="Em 10 anos" v={proj[10]} />
          <ProjCard C={C} l="Em 20 anos" v={proj[20]} />
          <ProjCard C={C} l="Aposentadoria" v={proj[35]} hi />
        </div>
      </div>

      {/* Mercado B3 */}
      <MercadoB3 C={C} />
    </div>
  );
}

function MercadoRow({ C, q }) {
  const up = (q.pct ?? 0) >= 0;
  const isIndex = q.symbol === "^BVSP";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: `1px solid ${C.border}` }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, background: C.surfaceAlt, display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0 }}>
        {q.logo
          ? <img src={q.logo} alt="" width={30} height={30} style={{ objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
          : <span style={{ fontSize: 11, fontWeight: 800, color: C.primary }}>{q.symbol.replace("^", "").slice(0, 4)}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5 }}>{isIndex ? "Ibovespa" : q.symbol}</div>
        <div style={{ fontSize: 11.5, color: C.textMut, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q.nome}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 13.5, fontVariantNumeric: "tabular-nums" }}>
          {isIndex ? Math.round(q.preco).toLocaleString("pt-BR") : "R$ " + q.preco.toFixed(2)}
        </div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: up ? C.positive : C.negative, display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {up ? "+" : ""}{(q.pct ?? 0).toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

function MercadoB3({ C }) {
  const [aba, setAba] = useState("b3");
  const [dolar, setDolar] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [hora, setHora] = useState("");
  const [busca, setBusca] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [buscaMsg, setBuscaMsg] = useState("");
  // Defesa & IA (carrega sob demanda)
  const [di, setDi] = useState([]);
  const [loadingDi, setLoadingDi] = useState(false);
  const [erroDi, setErroDi] = useState(false);
  const [diLoaded, setDiLoaded] = useState(false);

  async function buscar(e) {
    e?.preventDefault();
    const s = busca.trim().toUpperCase();
    if (!s || buscando) return;
    setBuscando(true);
    setBuscaMsg("");
    const q = await fetchOne(s);
    setBuscando(false);
    if (!q) { setBuscaMsg(`“${s}” não encontrado.`); return; }
    setQuotes((prev) => [q, ...prev.filter((x) => x.symbol !== q.symbol)]);
    setBusca("");
  }

  async function carregar() {
    setLoading(true);
    setErro(false);
    try {
      const [d, q] = await Promise.all([fetchDolar(), fetchQuotes()]);
      setDolar(d);
      setQuotes(q);
      if (!d && q.length === 0) setErro(true);
      const now = new Date();
      setHora(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
    } catch {
      setErro(true);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { carregar(); }, []);

  async function carregarDI() {
    setLoadingDi(true);
    setErroDi(false);
    try {
      const q = await fetchDefesaIA();
      setDi(q);
      setDiLoaded(true);
      if (!q.length) setErroDi(true);
    } catch {
      setErroDi(true);
    } finally {
      setLoadingDi(false);
    }
  }
  function irPara(t) {
    setAba(t);
    if (t === "di" && !diLoaded && !loadingDi) carregarDI();
  }

  const listaB3 = dolar ? [dolar, ...quotes] : quotes;
  const tabBtn = (t, txt) => (
    <button onClick={() => irPara(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 700, background: aba === t ? C.primary : "transparent", color: aba === t ? "#fff" : C.textMut }}>{txt}</button>
  );

  return (
    <Card C={C} style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BarChart3 size={17} color={C.primary} />
          <span style={{ fontWeight: 700, fontSize: 14.5 }}>Mercado</span>
        </div>
        <button onClick={() => (aba === "b3" ? carregar() : carregarDI())} disabled={loading || loadingDi} title="Atualizar" style={{ background: C.surfaceAlt, border: "none", borderRadius: 10, width: 30, height: 30, display: "grid", placeItems: "center", color: C.textMut, cursor: "pointer" }}>
          <RefreshCw size={14} style={(loading || loadingDi) ? { opacity: 0.5 } : {}} />
        </button>
      </div>

      <div style={{ display: "flex", gap: 6, background: C.surfaceAlt, borderRadius: 12, padding: 4, marginBottom: 12 }}>
        {tabBtn("b3", "Ações B3")}
        {tabBtn("di", "Defesa & IA")}
      </div>

      {aba === "b3" && (
        <>
          <form onSubmit={buscar} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar ação (ex.: PETR4, VALE3)"
              style={{ flex: 1, background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 13px", fontSize: 13.5, color: C.text, outline: "none" }} />
            <button type="submit" disabled={buscando} style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 12, padding: "0 16px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", opacity: buscando ? 0.7 : 1 }}>
              {buscando ? "…" : "Buscar"}
            </button>
          </form>
          {buscaMsg && <div style={{ fontSize: 12, color: C.negative, marginTop: -6, marginBottom: 10 }}>{buscaMsg}</div>}
          {loading && <div style={{ color: C.textMut, fontSize: 13, padding: "8px 0" }}>Carregando cotações…</div>}
          {!loading && erro && <div style={{ color: C.textMut, fontSize: 13, padding: "8px 0" }}>Não foi possível carregar agora. Toque em atualizar.</div>}
          {!loading && !erro && (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {listaB3.map((q) => <MercadoRow key={q.symbol} C={C} q={q} />)}
            </div>
          )}
        </>
      )}

      {aba === "di" && (
        <>
          <div style={{ fontSize: 11.5, color: C.textMut, marginBottom: 10, lineHeight: 1.4 }}>
            Defesa/aeroespacial e IA — Embraer (Brasil) e gigantes globais via BDR (recibos negociados na B3).
          </div>
          {loadingDi && <div style={{ color: C.textMut, fontSize: 13, padding: "8px 0" }}>Carregando…</div>}
          {!loadingDi && erroDi && <div style={{ color: C.textMut, fontSize: 13, padding: "8px 0" }}>Não foi possível carregar agora. Toque em atualizar.</div>}
          {!loadingDi && !erroDi && (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {di.map((q) => <MercadoRow key={q.symbol} C={C} q={q} />)}
            </div>
          )}
        </>
      )}

      <div style={{ fontSize: 10.5, color: C.textMut, marginTop: 10, lineHeight: 1.4 }}>
        Fonte: brapi.dev / AwesomeAPI · cotações do dia {hora && `· ${hora}`} · pode ter atraso. Conteúdo educacional, não é recomendação.
      </div>
    </Card>
  );
}
function MiniStat({ l, v }) {
  return <div><div style={{ fontSize: 11, opacity: 0.8 }}>{l}</div><div style={{ fontSize: 14.5, fontWeight: 700 }}>{v}</div></div>;
}
function ProjCard({ C, l, v, hi }) {
  return (
    <div style={{ background: hi ? C.hero : C.surface, color: hi ? "#fff" : C.text, border: `1px solid ${hi ? "transparent" : C.border}`, borderRadius: 18, padding: 15 }}>
      <div style={{ fontSize: 12, opacity: hi ? 0.85 : 1, color: hi ? "#fff" : C.textMut, fontWeight: 600 }}>{l}</div>
      <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.6, marginTop: 3 }}>{brlk(v)}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Assistente mensal / checklist                                     */
/* ------------------------------------------------------------------ */
function MonthlyCard({ C, items, setItems, allDone, planConcluido, xp, setXp, onToggle, onComplete, demo }) {
  const [celebrated, setCelebrated] = useState(planConcluido);
  useEffect(() => {
    if (allDone && !celebrated) {
      setCelebrated(true);
      setXp(x => x + 120);
      onComplete?.();
    }
  }, [allDone]);

  const toggle = (id) => setItems(list => {
    const next = list.map(i => i.id === id ? { ...i, done: !i.done } : i);
    const changed = next.find(i => i.id === id);
    onToggle?.(changed);
    return next;
  });
  const total = items.reduce((s, i) => s + i.val, 0);
  const doneVal = items.filter(i => i.done).reduce((s, i) => s + i.val, 0);
  const done = allDone || planConcluido;
  const mes = mesAtualNome();

  return (
    <div style={{ padding: "14px 18px 0" }}>
      <Card C={C} style={{ background: done ? C.primarySoft : C.surface, borderColor: done ? C.primary : C.border }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "6px 0" }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: C.hero, display: "grid", placeItems: "center", color: "#fff", margin: "0 auto 10px" }}>
              <Trophy size={26} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>Aportes de {mes} concluídos! 🎉</div>
            <div style={{ color: C.textMut, fontSize: 13.5, marginTop: 4 }}>Você investiu {brl(total)} e ganhou +120 XP. Sequência mantida.</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Sparkles size={17} color={C.primary} />
              <span style={{ fontWeight: 800, fontSize: 15.5, textTransform: "capitalize" }}>Plano de {mes}</span>
            </div>
            <div style={{ color: C.textMut, fontSize: 13, marginBottom: 14 }}>
              Vamos investir {brl(total)} este mês. Marque conforme concluir cada um.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {items.map(i => (
                <button key={i.id} onClick={() => toggle(i.id)} style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                  background: C.surfaceAlt, border: `1px solid ${i.done ? C.primary : "transparent"}`, borderRadius: 14, padding: "12px 14px", cursor: "pointer" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0, background: i.done ? C.primary : "transparent",
                    border: `2px solid ${i.done ? C.primary : C.border}`, display: "grid", placeItems: "center" }}>
                    {i.done && <Check size={15} color="#fff" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.text, textDecoration: i.done ? "line-through" : "none", opacity: i.done ? 0.6 : 1 }}>
                      <Term C={C} label={i.cls} tip={i.tip} />
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 14.5, color: C.text }}>{brl(i.val)}</div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 12, height: 6, borderRadius: 6, background: C.surfaceAlt, overflow: "hidden" }}>
              <div style={{ width: `${total ? (doneVal / total) * 100 : 0}%`, height: "100%", background: C.primary, transition: "width .3s" }} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Metas — a Escada do Patrimônio                                    */
/* ------------------------------------------------------------------ */
function Goals({ C, goals, patrimonio, aporte }) {
  return (
    <div style={{ paddingBottom: 8 }}>
      <SectionTitle C={C} icon={Target} title="Escada do Patrimônio" sub="Dez degraus da reserva ao seu primeiro 10X." />
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 19, top: 10, bottom: 10, width: 2, background: C.border }} />
        {goals.map((g, i) => {
          const reached = patrimonio >= g.v;
          const current = !reached && (i === 0 || patrimonio >= goals[i - 1].v);
          const base = i === 0 ? 0 : goals[i - 1].v;
          const pct = Math.max(0, Math.min(100, ((patrimonio - base) / (g.v - base)) * 100));
          const falta = g.v - patrimonio;
          const meses = Math.max(1, Math.ceil(falta / (aporte || 1)));
          return (
            <div key={i} style={{ display: "flex", gap: 14, position: "relative", marginBottom: 12 }}>
              <div style={{ width: 40, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 13, zIndex: 2, display: "grid", placeItems: "center",
                  background: reached ? C.hero : current ? C.surface : C.surfaceAlt,
                  border: `2px solid ${reached ? "transparent" : current ? C.primary : C.border}`,
                  color: reached ? "#fff" : current ? C.primary : C.textMut }}>
                  {reached ? <Check size={19} /> : current ? <Flame size={18} /> : <Lock size={16} />}
                </div>
              </div>
              <Card C={C} style={{ flex: 1, opacity: !reached && !current ? 0.65 : 1, padding: 15 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: 14.5 }}>{g.t}</span>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>{brlk(g.v)}</span>
                </div>
                {current && (
                  <>
                    <div style={{ height: 7, borderRadius: 7, background: C.surfaceAlt, overflow: "hidden", margin: "9px 0 6px" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: C.hero }} />
                    </div>
                    <div style={{ fontSize: 12, color: C.textMut }}>
                      Faltam {brl(Math.max(0, falta))} · ~{meses} {meses === 1 ? "mês" : "meses"} no ritmo atual
                    </div>
                  </>
                )}
                {reached && <div style={{ fontSize: 12, color: C.positive, fontWeight: 700, marginTop: 5 }}>Conquistado ✓</div>}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mentor IA — Edge Function com fallback educacional                */
/* ------------------------------------------------------------------ */
const FALLBACK = [
  { k: ["vender", "caiu", "queda", "pânico", "panico"], a: "Respira. Quedas fazem parte de investir no longo prazo — quem vende no susto costuma transformar uma queda temporária em perda de verdade. Seu plano é de anos, não de dias. Se nada mudou nos seus objetivos, o melhor movimento quase sempre é continuar aportando com disciplina. (Conteúdo educacional, não recomendação personalizada.)" },
  { k: ["etf"], a: "ETF é como uma cesta pronta de vários investimentos numa compra só. Em vez de escolher uma empresa, você compra um pedacinho de centenas delas de uma vez — o que dilui o risco e simplifica sua vida. É uma das formas mais simples de diversificar." },
  { k: ["tesouro"], a: "Tesouro Direto é você emprestar dinheiro para o governo e receber de volta com juros. É considerado o investimento mais seguro do país. O 'Selic' acompanha os juros e é ótimo para reserva; o 'IPCA+' protege da inflação para o longo prazo." },
  { k: ["inflação", "inflacao"], a: "Inflação é o dinheiro perdendo poder de compra: o mesmo pão que custava R$5 passa a custar R$6. Por isso guardar dinheiro parado 'encolhe' com o tempo — investir serve, antes de tudo, para correr mais rápido que a inflação." },
  { k: ["cdi", "selic"], a: "A Selic é a taxa básica de juros do país. O CDI anda coladinho nela e serve de régua para renda fixa — quando você vê 'rende 100% do CDI', é isso sendo comparado a essa régua." },
  { k: ["dólar", "dolar", "ouro"], a: "Dólar e ouro funcionam mais como proteção do que como fonte de crescimento — costumam subir quando há medo no mercado. Podem ser uma fatia pequena da carteira para dar estabilidade, mas não são a base de quem constrói patrimônio no longo prazo." },
  { k: ["juros compostos"], a: "Juros compostos são juros que rendem sobre os próprios juros — o efeito 'bola de neve'. No começo parece pouco, mas depois de alguns anos vira a maior parte do seu patrimônio. É o motor de tudo aqui." },
];
function pickFallback(q) {
  const low = q.toLowerCase();
  const hit = FALLBACK.find(f => f.k.some(k => low.includes(k)));
  return hit ? hit.a : "Ótima pergunta! O caminho aqui é sempre o mesmo: reserva de emergência primeiro, depois aportes constantes e diversificados pensando no longo prazo. Evite decisões por impulso. Quer que eu explique algum termo específico de forma simples?";
}

const DISCLAIMER_REC = "⚠️ Análise automática por indicadores reais (não é garantia). Rentabilidade passada não garante futura — diversifique e pense no longo prazo.";

function montarRec(a) {
  const nome = a.symbol === "^BVSP" ? "Ibovespa" : a.symbol;
  const linhas = [
    `${nome} — ${a.nome}`,
    `Preço: R$ ${a.price.toFixed(2)} (${a.chg >= 0 ? "+" : ""}${a.chg.toFixed(2)}% hoje)`,
    "",
    `Leitura automática: ${a.label}.`,
    ...a.motivos.map(m => "• " + m),
    "",
    DISCLAIMER_REC,
  ];
  return linhas.join("\n");
}

function montarRanking(lista) {
  if (!lista || !lista.length) return "Não consegui buscar as cotações agora — tenta de novo em instantes.";
  const atrativos = lista.filter(a => a.score >= 1).slice(0, 4);
  const cautela = lista.filter(a => a.score <= -1).slice(0, 3);
  const fmt = a => `• ${a.symbol} (R$ ${a.price.toFixed(2)}, ${a.chg >= 0 ? "+" : ""}${a.chg.toFixed(2)}%) — ${a.motivos[0] || a.label}`;
  const p = ["Leitura automática do mercado agora, por indicadores:", ""];
  if (atrativos.length) { p.push("🟢 Mais atrativos hoje:"); atrativos.forEach(a => p.push(fmt(a))); p.push(""); }
  if (cautela.length) { p.push("🔴 Pedem cautela:"); cautela.forEach(a => p.push(fmt(a))); p.push(""); }
  if (!atrativos.length && !cautela.length) { p.push("Nada se destaca fortemente agora — sinais neutros. Manter aportes constantes e diversificar segue sendo o melhor caminho."); p.push(""); }
  p.push(DISCLAIMER_REC);
  return p.join("\n");
}

function Mentor({ C, user, lucro, ctx }) {
  const suggestions = ["O que está atrativo hoje?", "A PETR4 está boa?", "O que é ETF?", "O mercado caiu, devo vender?"];
  const [msgs, setMsgs] = useState([
    { role: "assistant", text: `Oi! Sou seu mentor. ${user.patrimonio > 0 ? `Já vi que você tem ${brl(user.patrimonio)} investidos e vem mantendo o ritmo há ${user.meses} ${user.meses === 1 ? "mês" : "meses"} — parabéns pela disciplina.` : "Vamos construir seu patrimônio juntos, um aporte de cada vez."} Pode me perguntar qualquer coisa, sem medo de parecer básico.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput("");
    const next = [...msgs, { role: "user", text: q }];
    setMsgs(next);
    setLoading(true);

    // 1) Recomendação/análise em tempo real (dados reais da B3)
    try {
      const ticker = detectarTicker(q);
      const low = q.toLowerCase();
      const pedeRec = /(recomend|vale a pena|devo comprar|o que comprar|o que investir|o que .*(bom|atrativ)|melhor.*(a[cç][aã]o|ativo)|dica|est[aá] bo[am])/.test(low);

      if (ticker) {
        const a = await analisar(ticker);
        if (a) {
          setMsgs(m => [...m, { role: "assistant", text: montarRec(a) }]);
          setLoading(false); return;
        }
      }
      if (pedeRec) {
        const lista = await analisarLista();
        setMsgs(m => [...m, { role: "assistant", text: montarRanking(lista) }]);
        setLoading(false); return;
      }
    } catch { /* cai para a base educacional */ }

    // 2) Base de conhecimento educacional (offline)
    const { resposta } = answerFromKb(q);
    const delay = 300 + Math.min(700, resposta.length * 3);
    setTimeout(() => {
      setMsgs(m => [...m, { role: "assistant", text: resposta }]);
      setLoading(false);
    }, delay);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 150px)" }}>
      <SectionTitle C={C} icon={MessageCircle} title="Mentor IA" sub="Seu mentor financeiro 24h. Nenhuma pergunta é boba." />
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%",
            background: m.role === "user" ? C.primary : C.surface, color: m.role === "user" ? "#fff" : C.text,
            border: m.role === "user" ? "none" : `1px solid ${C.border}`, borderRadius: 18,
            borderBottomRightRadius: m.role === "user" ? 5 : 18, borderBottomLeftRadius: m.role === "user" ? 18 : 5,
            padding: "11px 14px", fontSize: 14, lineHeight: 1.5 }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ alignSelf: "flex-start", color: C.textMut, fontSize: 13, padding: "4px 8px" }}>Mentor está digitando…</div>}
        <div ref={endRef} />
      </div>

      {msgs.length <= 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => send(s)} style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`,
              color: C.text, borderRadius: 20, padding: "8px 12px", fontSize: 12.5, cursor: "pointer", fontWeight: 600 }}>{s}</button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Pergunte qualquer coisa…" style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 22, padding: "13px 16px", fontSize: 14, color: C.text, outline: "none" }} />
        <button onClick={() => send()} style={{ width: 46, height: 46, borderRadius: 23, border: "none", cursor: "pointer",
          background: C.primary, color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Aprender — trilha de 18 módulos com aulas e quiz de 10 perguntas   */
/* ------------------------------------------------------------------ */
function Learn({ C, progresso, onOpen }) {
  const concluidos = CURRICULO.filter(m => progresso?.[m.slug]?.concluido).length;
  const atual = indiceAtual(progresso);
  const pct = (concluidos / TOTAL_MODULOS) * 100;

  return (
    <div style={{ paddingBottom: 8 }}>
      <SectionTitle C={C} icon={GraduationCap} title="Aprender"
        sub={`${concluidos} de ${TOTAL_MODULOS} módulos concluídos · cada módulo termina com um quiz de 10 perguntas`} />
      <div style={{ height: 8, borderRadius: 8, background: C.surfaceAlt, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: C.hero, transition: "width .4s" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {CURRICULO.map((m, i) => {
          const p = progresso?.[m.slug] || {};
          const liberado = moduloLiberado(i, progresso);
          const concluido = !!p.concluido;
          const emAndamento = !concluido && liberado && (p.pagina > 0 || p.tentativas > 0);
          const destaque = !concluido && i === atual;

          let status = "Começar →";
          if (concluido) status = `Concluído ✓ · ${p.nota}/10`;
          else if (!liberado) status = "Bloqueado";
          else if (emAndamento) status = `Continuar · aula ${Math.min(p.pagina + 1, m.paginas.length)} de ${m.paginas.length}`;

          return (
            <button key={m.slug} onClick={() => liberado && onOpen(m.slug)} disabled={!liberado}
              style={{ textAlign: "left", background: C.surface, cursor: liberado ? "pointer" : "default",
                border: `1.5px solid ${destaque ? C.primary : C.border}`, borderRadius: 18, padding: 14,
                position: "relative", opacity: liberado ? 1 : 0.55 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{m.icone}</div>
                {!liberado && <Lock size={14} color={C.textMut} />}
                {concluido && <Check size={16} color={C.positive} />}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: C.text, lineHeight: 1.25 }}>{m.titulo}</div>
              <div style={{ fontSize: 11, color: C.textMut, marginTop: 4 }}>
                {m.paginas.length} aulas · quiz de {m.quiz.length}
              </div>
              <div style={{ marginTop: 8, fontSize: 11.5, fontWeight: 700,
                color: concluido ? C.positive : !liberado ? C.textMut : C.primary }}>
                {status}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ fontSize: 11.5, color: C.textMut, marginTop: 14, lineHeight: 1.5 }}>
        Conteúdo educacional. Conclua o quiz com pelo menos {ACERTOS_MINIMOS} acertos para liberar o módulo seguinte.
      </div>
    </div>
  );
}

/* Renderiza um bloco de conteúdo da aula. */
function Bloco({ C, b }) {
  if (b.t === "chave") {
    return (
      <div style={{ background: C.primarySoft, borderRadius: 16, padding: 15, marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.primary, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <Info size={15} /> Em uma frase
        </div>
        <div style={{ fontSize: 14.5, color: C.text, lineHeight: 1.5, fontWeight: 600 }}>{b.x}</div>
      </div>
    );
  }
  if (b.t === "exemplo") {
    return (
      <div style={{ background: C.surfaceAlt, borderRadius: 16, padding: 15, marginBottom: 14, borderLeft: `3px solid ${C.accent}` }}>
        <div style={{ fontWeight: 700, fontSize: 12.5, color: C.accent, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={14} /> Na prática
        </div>
        <div style={{ fontSize: 14, color: C.text, lineHeight: 1.55 }}>{b.x}</div>
      </div>
    );
  }
  if (b.t === "lista") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 16 }}>
        {b.x.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
            <div style={{ width: 6, height: 6, borderRadius: 6, background: C.primary, marginTop: 7, flexShrink: 0 }} />
            <div style={{ fontSize: 14.5, lineHeight: 1.5, color: C.text }}>{item}</div>
          </div>
        ))}
      </div>
    );
  }
  return <p style={{ fontSize: 15, lineHeight: 1.62, color: C.text, marginTop: 0, marginBottom: 14 }}>{b.x}</p>;
}

/* Embaralha as alternativas para que a posição não entregue a resposta. */
function embaralharQuiz(quiz) {
  return quiz.map((q) => {
    const idx = q.o.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return { ...q, o: idx.map((i) => q.o[i]), r: idx.indexOf(q.r) };
  });
}

/* Leitor do módulo: passa por todas as aulas e depois aplica o quiz. */
function ModuleReader({ C, modulo, progresso, onPagina, onConcluir, onClose }) {
  const salvo = progresso?.[modulo.slug] || {};
  const total = modulo.paginas.length;
  const [pagina, setPagina] = useState(Math.min(salvo.pagina || 0, total - 1));
  const [view, setView] = useState("aula"); // aula | quiz | resultado
  const [qIdx, setQIdx] = useState(0);
  const [escolha, setEscolha] = useState(null);
  const [acertos, setAcertos] = useState(0);
  const [tentativa, setTentativa] = useState(0);
  const topRef = useRef(null);

  // Alternativas embaralhadas a cada tentativa do quiz.
  const perguntas = useMemo(() => embaralharQuiz(modulo.quiz), [modulo.slug, tentativa]);

  useEffect(() => { topRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }, [pagina, qIdx, view]);

  function avancar() {
    if (pagina < total - 1) {
      const prox = pagina + 1;
      setPagina(prox);
      onPagina(modulo.slug, prox);
    } else {
      onPagina(modulo.slug, total - 1);
      iniciarQuiz();
    }
  }
  function iniciarQuiz() {
    setTentativa(t => t + 1);
    setQIdx(0); setEscolha(null); setAcertos(0); setView("quiz");
  }
  function responder(i) {
    if (escolha !== null) return;
    setEscolha(i);
    if (i === perguntas[qIdx].r) setAcertos(a => a + 1);
  }
  function proximaPergunta() {
    if (qIdx < perguntas.length - 1) {
      setQIdx(qIdx + 1);
      setEscolha(null);
    } else {
      const aprovado = acertos >= ACERTOS_MINIMOS;
      onConcluir(modulo.slug, acertos, aprovado);
      setView("resultado");
    }
  }

  const barra = view === "aula" ? ((pagina + 1) / total) * 100 : ((qIdx + 1) / perguntas.length) * 100;
  const q = perguntas[qIdx];
  const aprovado = acertos >= ACERTOS_MINIMOS;

  const btn = (bg, cor) => ({ padding: "15px 18px", borderRadius: 15, border: "none", cursor: "pointer",
    background: bg, color: cor, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8, width: "100%" });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, background: C.bg, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Cabeçalho */}
        <div style={{ padding: "14px 18px 10px", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <button onClick={onClose} style={{ background: C.surfaceAlt, border: "none", borderRadius: 11, width: 32, height: 32,
              display: "grid", placeItems: "center", color: C.text, cursor: "pointer", flexShrink: 0 }}>
              <ArrowLeft size={17} />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {modulo.icone} {modulo.titulo}
              </div>
              <div style={{ fontSize: 11.5, color: C.textMut, marginTop: 2 }}>
                {view === "aula" && `Aula ${pagina + 1} de ${total} · ${modulo.paginas[pagina].min} min de leitura`}
                {view === "quiz" && `Quiz · pergunta ${qIdx + 1} de ${modulo.quiz.length}`}
                {view === "resultado" && "Resultado do quiz"}
              </div>
            </div>
          </div>
          <div style={{ height: 5, borderRadius: 5, background: C.surfaceAlt, overflow: "hidden" }}>
            <div style={{ width: `${view === "resultado" ? 100 : barra}%`, height: "100%",
              background: view === "aula" ? C.hero : C.accent, transition: "width .3s" }} />
          </div>
        </div>

        {/* Conteúdo */}
        <div ref={topRef} style={{ flex: 1, overflowY: "auto", padding: "20px 18px 8px" }}>
          {view === "aula" && (
            <>
              <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
                {modulo.paginas.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 4,
                    background: i <= pagina ? C.primary : C.border }} />
                ))}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 16 }}>
                {modulo.paginas[pagina].titulo}
              </div>
              {modulo.paginas[pagina].blocos.map((b, i) => <Bloco key={i} C={C} b={b} />)}
            </>
          )}

          {view === "quiz" && (
            <>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textMut, marginBottom: 8 }}>
                ACERTOS: {acertos} · MÍNIMO PARA CONCLUIR: {ACERTOS_MINIMOS}
              </div>
              <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.3, letterSpacing: -0.3, marginBottom: 18 }}>
                {q.p}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.o.map((op, i) => {
                  const respondeu = escolha !== null;
                  const correta = i === q.r;
                  const marcada = escolha === i;
                  let bg = C.surface, bd = C.border, cor = C.text;
                  if (respondeu && correta) { bg = C.primarySoft; bd = C.positive; }
                  else if (respondeu && marcada) { bd = C.negative; }
                  return (
                    <button key={i} onClick={() => responder(i)} disabled={respondeu}
                      style={{ textAlign: "left", padding: "14px 16px", borderRadius: 15, background: bg, color: cor,
                        border: `1.5px solid ${bd}`, fontSize: 14.5, fontWeight: marcada || (respondeu && correta) ? 700 : 500,
                        cursor: respondeu ? "default" : "pointer", display: "flex", justifyContent: "space-between",
                        alignItems: "center", gap: 10, lineHeight: 1.4 }}>
                      <span>{op}</span>
                      {respondeu && correta && <Check size={17} color={C.positive} style={{ flexShrink: 0 }} />}
                      {respondeu && marcada && !correta && <span style={{ color: C.negative, fontWeight: 800, flexShrink: 0 }}>✕</span>}
                    </button>
                  );
                })}
              </div>
              {escolha !== null && (
                <div style={{ marginTop: 14, background: C.surfaceAlt, borderRadius: 15, padding: 14,
                  borderLeft: `3px solid ${escolha === q.r ? C.positive : C.negative}` }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5, color: escolha === q.r ? C.positive : C.negative, marginBottom: 4 }}>
                    {escolha === q.r ? "Acertou!" : "Não é essa"}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: C.text }}>{q.e}</div>
                </div>
              )}
            </>
          )}

          {view === "resultado" && (
            <div style={{ textAlign: "center", paddingTop: 12 }}>
              <div style={{ width: 72, height: 72, borderRadius: 24, margin: "0 auto 16px", display: "grid", placeItems: "center",
                background: aprovado ? C.hero : C.surfaceAlt, color: aprovado ? "#fff" : C.textMut }}>
                {aprovado ? <Trophy size={34} /> : <RefreshCw size={30} />}
              </div>
              <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>{acertos}/{modulo.quiz.length}</div>
              <div style={{ fontSize: 19, fontWeight: 800, marginTop: 6 }}>
                {aprovado ? "Módulo concluído! 🎉" : "Quase lá"}
              </div>
              <div style={{ color: C.textMut, fontSize: 14, lineHeight: 1.55, marginTop: 8, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
                {aprovado
                  ? `Você ganhou +${XP_MODULO} XP e liberou o próximo módulo da trilha.`
                  : `Você precisa de ${ACERTOS_MINIMOS} acertos para concluir. Revise as aulas e tente de novo — dá para repetir quantas vezes quiser.`}
              </div>
            </div>
          )}
        </div>

        {/* Ações */}
        <div style={{ padding: "12px 18px 20px", borderTop: `1px solid ${C.border}`, background: C.surface,
          display: "flex", gap: 10 }}>
          {view === "aula" && (
            <>
              {pagina > 0 && (
                <button onClick={() => setPagina(pagina - 1)}
                  style={{ ...btn(C.surfaceAlt, C.text), width: 110, fontSize: 14 }}>
                  <ArrowLeft size={16} /> Voltar
                </button>
              )}
              <button onClick={avancar} style={btn(C.primary, "#fff")}>
                {pagina < total - 1 ? <>Continuar <ChevronRight size={18} /></> : <>Fazer o quiz ({modulo.quiz.length} perguntas) <ChevronRight size={18} /></>}
              </button>
            </>
          )}

          {view === "quiz" && (
            <button onClick={proximaPergunta} disabled={escolha === null}
              style={{ ...btn(escolha === null ? C.surfaceAlt : C.primary, escolha === null ? C.textMut : "#fff"),
                cursor: escolha === null ? "default" : "pointer" }}>
              {escolha === null
                ? "Escolha uma resposta"
                : qIdx < modulo.quiz.length - 1 ? <>Próxima pergunta <ChevronRight size={18} /></> : "Ver resultado"}
            </button>
          )}

          {view === "resultado" && (
            <>
              <button onClick={() => { setPagina(0); setView("aula"); }}
                style={{ ...btn(C.surfaceAlt, C.text), fontSize: 14 }}>
                Rever aulas
              </button>
              {aprovado
                ? <button onClick={onClose} style={btn(C.primary, "#fff")}>Concluir</button>
                : <button onClick={iniciarQuiz} style={btn(C.primary, "#fff")}>
                    <RefreshCw size={16} /> Refazer o quiz
                  </button>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Calculadora / simulador                                           */
/* ------------------------------------------------------------------ */
function Calc({ C, aporteInicial }) {
  const [aporte, setAporte] = useState(aporteInicial || 2000);
  const [inicial, setInicial] = useState(5000);
  const [anos, setAnos] = useState(20);
  const [taxa, setTaxa] = useState(10);

  const data = useMemo(() => project(anos, aporte, taxa, inicial), [aporte, anos, taxa, inicial]);
  const final = data[data.length - 1];
  const aportado = final.aportado;
  const juros = final.value - aportado;

  const Slider = ({ label, value, set, min, max, step, fmt }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13.5, color: C.textMut, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(+e.target.value)}
        style={{ width: "100%", accentColor: C.primary }} />
    </div>
  );

  return (
    <div style={{ paddingBottom: 8 }}>
      <SectionTitle C={C} icon={CalcIcon} title="Calculadora" sub="Veja o poder dos juros compostos com seus números." />
      <Card C={C} style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: C.textMut, fontWeight: 600 }}>Patrimônio em {anos} anos</div>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1, color: C.primary, margin: "2px 0 12px" }}>{brl(final.value)}</div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={data} margin={{ left: -18, right: 4, top: 4 }}>
            <CartesianGrid vertical={false} stroke={C.border} />
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: C.textMut }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: C.textMut }} axisLine={false} tickLine={false} tickFormatter={brlk} />
            <Tooltip formatter={(v) => brl(v)} contentStyle={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: 12 }} />
            <Line type="monotone" dataKey="aportado" name="Você depositou" stroke={C.textMut} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="value" name="Com juros" stroke={C.primary} strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <Pill C={C} l="Você depositou" v={brl(aportado)} />
          <Pill C={C} l="Juros ganhos" v={brl(juros)} color={C.positive} />
        </div>
      </Card>

      <Card C={C}>
        <Slider label="Aporte mensal" value={aporte} set={setAporte} min={100} max={10000} step={100} fmt={brl} />
        <Slider label="Valor inicial" value={inicial} set={setInicial} min={0} max={100000} step={1000} fmt={brl} />
        <Slider label="Tempo" value={anos} set={setAnos} min={1} max={40} step={1} fmt={v => v + " anos"} />
        <Slider label="Rentabilidade ao ano" value={taxa} set={setTaxa} min={2} max={20} step={0.5} fmt={v => v + "%"} />
        <div style={{ fontSize: 11.5, color: C.textMut, display: "flex", gap: 6, alignItems: "flex-start", marginTop: 4 }}>
          <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
          Simulação educacional. Rentabilidade passada não garante rentabilidade futura.
        </div>
      </Card>
    </div>
  );
}
function Pill({ C, l, v, color }) {
  return (
    <div style={{ flex: 1, background: C.surfaceAlt, borderRadius: 14, padding: "10px 12px" }}>
      <div style={{ fontSize: 11.5, color: C.textMut, fontWeight: 600 }}>{l}</div>
      <div style={{ fontSize: 15.5, fontWeight: 800, color: color || C.text, marginTop: 2 }}>{v}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function SectionTitle({ C, icon: Ic, title, sub }) {
  return (
    <div style={{ margin: "12px 0 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 34, height: 34, borderRadius: 11, background: C.primarySoft, display: "grid", placeItems: "center", color: C.primary }}>
          <Ic size={18} />
        </div>
        <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.5 }}>{title}</div>
      </div>
      {sub && <div style={{ fontSize: 13, color: C.textMut, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

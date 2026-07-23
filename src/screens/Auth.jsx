import React, { useState } from "react";
import { Sparkles, User, Lock, IdCard, ArrowRight } from "lucide-react";
import { signIn, signUp, isValidCpf, formatCpf, onlyDigits } from "../lib/api";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setMsg(null);

    if (!isValidCpf(cpf)) {
      setMsg({ ok: false, t: "CPF inválido. Confira os números." });
      return;
    }
    if (senha.length < 6) {
      setMsg({ ok: false, t: "A senha precisa ter ao menos 6 caracteres." });
      return;
    }
    if (mode === "signup" && nome.trim().length < 2) {
      setMsg({ ok: false, t: "Digite seu nome." });
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { session } = await signUp(cpf, senha, nome.trim());
        if (!session) {
          // Confirmação de e-mail ligada — tenta login mesmo assim.
          try {
            await signIn(cpf, senha);
          } catch {
            setMsg({ ok: true, t: "Conta criada! Já pode entrar com seu CPF." });
            setMode("login");
          }
        }
        // com sessão, o onAuthStateChange redireciona.
      } else {
        await signIn(cpf, senha);
      }
    } catch (err) {
      setMsg({ ok: false, t: traduzErro(err?.message) });
    } finally {
      setLoading(false);
    }
  }

  const glass = {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.28)",
    boxShadow: "0 20px 50px rgba(20,8,60,0.35)",
  };
  const field = {
    width: "100%", display: "flex", alignItems: "center", gap: 10,
    background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: 14, padding: "13px 15px",
  };
  const inputStyle = {
    flex: 1, background: "transparent", border: "none", outline: "none",
    color: "#fff", fontSize: 15.5, fontWeight: 500,
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "linear-gradient(150deg,#4C1D95 0%,#7C3AED 42%,#A855F7 72%,#C084FC 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter',system-ui,sans-serif", padding: 22, position: "relative", overflow: "hidden",
    }}>
      {/* placeholder branco + brilhos de fundo */}
      <style>{`
        .p10x-in::placeholder{color:rgba(255,255,255,.72);font-weight:500}
        .p10x-in:-webkit-autofill{-webkit-text-fill-color:#fff;transition:background-color 9999s}
      `}</style>
      <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.18)", filter: "blur(60px)", top: -80, right: -60 }} />
      <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "rgba(216,180,254,0.35)", filter: "blur(70px)", bottom: -70, left: -50 }} />

      <div style={{ width: "100%", maxWidth: 400, zIndex: 2 }}>
        {/* Marca */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{
            width: 68, height: 68, borderRadius: 20, margin: "0 auto 14px",
            display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: 22,
            ...glass,
          }}>10X</div>
          <div style={{ color: "#fff", fontSize: 25, fontWeight: 800, letterSpacing: -0.6 }}>Patrimônio 10X</div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 4 }}>Seu mentor financeiro pessoal</div>
        </div>

        {/* Card em vidro */}
        <div style={{ ...glass, borderRadius: 26, padding: 24 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: 5 }}>
            {["login", "signup"].map((m) => (
              <button key={m} onClick={() => { setMode(m); setMsg(null); }} style={{
                flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: 14, fontWeight: 700,
                background: mode === m ? "rgba(255,255,255,0.9)" : "transparent",
                color: mode === m ? "#6D28D9" : "rgba(255,255,255,0.85)",
              }}>
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "signup" && (
              <div style={field}>
                <User size={18} color="rgba(255,255,255,0.85)" />
                <input className="p10x-in" style={inputStyle} placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
            )}

            <div style={field}>
              <IdCard size={18} color="rgba(255,255,255,0.85)" />
              <input className="p10x-in" style={inputStyle} inputMode="numeric" placeholder="CPF"
                value={formatCpf(cpf)} onChange={(e) => setCpf(onlyDigits(e.target.value))} maxLength={14} />
            </div>

            <div style={field}>
              <Lock size={18} color="rgba(255,255,255,0.85)" />
              <input className="p10x-in" style={inputStyle} type="password" placeholder="Senha"
                value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>

            {msg && (
              <div style={{ fontSize: 13, fontWeight: 600, color: msg.ok ? "#D9FBEF" : "#FFD9DB",
                background: msg.ok ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)",
                borderRadius: 10, padding: "9px 12px" }}>{msg.t}</div>
            )}

            <button type="submit" disabled={loading} style={{
              marginTop: 4, padding: 16, borderRadius: 15, border: "none", cursor: "pointer",
              background: "#fff", color: "#6D28D9", fontSize: 16, fontWeight: 800,
              display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
              opacity: loading ? 0.75 : 1,
            }}>
              {loading ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar minha conta"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, color: "rgba(255,255,255,0.8)", fontSize: 12.5, lineHeight: 1.5 }}>
          <Sparkles size={13} style={{ verticalAlign: "-2px" }} /> Cadastre-se com seu CPF e comece agora.<br />
          Conteúdo educacional — não é recomendação de investimentos.
        </div>
      </div>
    </div>
  );
}

function traduzErro(m = "") {
  const s = m.toLowerCase();
  if (s.includes("invalid login")) return "CPF ou senha incorretos.";
  if (s.includes("already registered") || s.includes("already been")) return "Este CPF já tem conta. Use 'Entrar'.";
  if (s.includes("email not confirmed")) return "Cadastro criado, mas a confirmação de e-mail está ligada no servidor. Peça para desativá-la.";
  if (s.includes("password")) return "Senha muito curta (mínimo 6 caracteres).";
  return m || "Algo deu errado. Tente de novo.";
}

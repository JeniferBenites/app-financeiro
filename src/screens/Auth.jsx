import React, { useState } from "react";
import { Sparkles, Sun, Moon } from "lucide-react";
import { signIn, signUp } from "../lib/api";

export default function Auth({ C, dark, setDark }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const wrap = {
    minHeight: "100vh", background: C.bg, color: C.text, maxWidth: 480, margin: "0 auto",
    fontFamily: "'Inter',system-ui,sans-serif", padding: 24, display: "flex",
    flexDirection: "column", justifyContent: "center",
  };

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(email.trim(), senha, nome.trim());
        setMsg({ ok: true, t: "Conta criada! Você já pode entrar." });
        setMode("login");
      } else {
        await signIn(email.trim(), senha);
        // onAuthStateChange cuida do redirect.
      }
    } catch (err) {
      setMsg({ ok: false, t: traduzErro(err?.message) });
    } finally {
      setLoading(false);
    }
  }

  const input = {
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
    padding: "14px 16px", fontSize: 15, color: C.text, outline: "none", width: "100%",
  };

  return (
    <div style={wrap}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <button onClick={() => setDark((d) => !d)} style={{ background: C.surfaceAlt, border: "none", borderRadius: 20, width: 34, height: 34, display: "grid", placeItems: "center", color: C.text, cursor: "pointer" }}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <div style={{ width: 48, height: 48, borderRadius: 15, background: C.hero, display: "grid", placeItems: "center", color: "#fff", fontWeight: 800 }}>10X</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Patrimônio 10X</div>
          <div style={{ fontSize: 13, color: C.textMut }}>Seu mentor financeiro pessoal</div>
        </div>
      </div>

      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, marginBottom: 18 }}>
        {mode === "login" ? "Entrar" : "Criar conta"}
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mode === "signup" && (
          <input style={input} placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        )}
        <input style={input} type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={input} type="password" required minLength={6} placeholder="Senha (mín. 6 caracteres)" value={senha} onChange={(e) => setSenha(e.target.value)} />

        {msg && (
          <div style={{ fontSize: 13, color: msg.ok ? C.positive : C.negative, fontWeight: 600 }}>{msg.t}</div>
        )}

        <button type="submit" disabled={loading} style={{ marginTop: 4, padding: 16, borderRadius: 15, border: "none", cursor: "pointer", background: C.primary, color: "#fff", fontSize: 16, fontWeight: 700, opacity: loading ? 0.7 : 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
          <Sparkles size={17} /> {loading ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(null); }} style={{ marginTop: 16, background: "none", border: "none", color: C.primary, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
        {mode === "login" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
      </button>
    </div>
  );
}

function traduzErro(m = "") {
  const s = m.toLowerCase();
  if (s.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (s.includes("already registered") || s.includes("already been")) return "Este e-mail já tem conta.";
  if (s.includes("password")) return "Senha muito curta (mínimo 6 caracteres).";
  if (s.includes("email")) return "E-mail inválido.";
  return m || "Algo deu errado. Tente de novo.";
}

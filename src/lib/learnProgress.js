/* ------------------------------------------------------------------ */
/*  Progresso da trilha "Aprender"                                     */
/*                                                                     */
/*  Guardado por usuário no próprio aparelho. Usuário novo começa       */
/*  sempre do zero: nenhum módulo concluído, nenhuma aula lida.         */
/*                                                                     */
/*  Formato: { [slug]: { pagina, concluido, nota, tentativas } }        */
/* ------------------------------------------------------------------ */

const VERSAO = "v1";
const chave = (userId) => `p10x:aprender:${VERSAO}:${userId || "demo"}`;

export function loadProgresso(userId) {
  try {
    const raw = localStorage.getItem(chave(userId));
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

export function saveProgresso(userId, progresso) {
  try {
    localStorage.setItem(chave(userId), JSON.stringify(progresso));
  } catch { /* aparelho sem armazenamento — segue só em memória */ }
}

/* Guarda até onde o usuário leu, para ele poder retomar depois. */
export function marcarPagina(progresso, slug, pagina) {
  const atual = progresso[slug] || {};
  return {
    ...progresso,
    [slug]: { ...atual, pagina: Math.max(atual.pagina || 0, pagina) },
  };
}

/* Registra o resultado do quiz. Mantém sempre a melhor nota. */
export function registrarQuiz(progresso, slug, acertos, aprovado) {
  const atual = progresso[slug] || {};
  return {
    ...progresso,
    [slug]: {
      ...atual,
      nota: Math.max(atual.nota || 0, acertos),
      tentativas: (atual.tentativas || 0) + 1,
      concluido: atual.concluido || aprovado,
    },
  };
}

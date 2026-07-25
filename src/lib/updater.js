// ============================================================================
// Atualização OTA (self-hosted no Supabase Storage).
//
// O app checa um manifesto no Storage. Se houver versão nova, o app NÃO baixa
// escondido: ele avisa na tela e espera o usuário tocar em "Atualizar agora".
// O download e a troca do pacote web acontecem sem reinstalar o APK.
//
// No navegador não há OTA (o site já vem atualizado a cada deploy), então a
// checagem só roda no app instalado.
// ============================================================================

const MANIFEST_URL =
  "https://hywupnarvaztectxxbud.supabase.co/storage/v1/object/public/downloads/app-manifest.json";

/* Versão embutida no pacote web, gravada no build (vem do package.json). */
export const VERSAO_EMBUTIDA =
  typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "0.0.0";

export async function isNativo() {
  try {
    const { Capacitor } = await import("@capacitor/core");
    return !!Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
}

async function plugin() {
  const { CapacitorUpdater } = await import("@capgo/capacitor-updater");
  return CapacitorUpdater;
}

/* Confirma que o pacote atual abriu bem — sem isso o Capgo faz rollback. */
export async function confirmarAppOk() {
  try {
    if (!(await isNativo())) return;
    await (await plugin()).notifyAppReady();
  } catch { /* silencioso */ }
}

/* Versão que está rodando agora no aparelho. */
export async function versaoAtual() {
  try {
    if (!(await isNativo())) return VERSAO_EMBUTIDA;
    const atual = await (await plugin()).current();
    const v = atual?.bundle?.version;
    // "builtin" = ainda está no pacote que veio dentro do APK.
    return !v || v === "builtin" ? VERSAO_EMBUTIDA : v;
  } catch {
    return VERSAO_EMBUTIDA;
  }
}

/* Compara "1.0.10" com "1.0.9" corretamente (número por número). */
export function compararVersao(a, b) {
  const pa = String(a).split(".").map((n) => parseInt(n, 10) || 0);
  const pb = String(b).split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d > 0 ? 1 : -1;
  }
  return 0;
}

/**
 * Procura versão nova no manifesto.
 * Retorna { disponivel, versao, notas, url, atual }.
 */
export async function verificarAtualizacao() {
  const atual = await versaoAtual();
  const res = await fetch(`${MANIFEST_URL}?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("manifesto indisponível");
  const m = await res.json(); // { version, url, notes }
  if (!m?.version || !m?.url) throw new Error("manifesto inválido");

  return {
    disponivel: compararVersao(m.version, atual) > 0,
    versao: m.version,
    notas: m.notes || "",
    url: m.url,
    atual,
  };
}

/**
 * Baixa o pacote novo e aplica. O app recarrega sozinho na versão nova.
 * `onProgresso` recebe 0–100 durante o download.
 */
export async function baixarEAplicar({ versao, url }, onProgresso) {
  const CapacitorUpdater = await plugin();

  let ouvinte;
  try {
    ouvinte = await CapacitorUpdater.addListener("download", (info) => {
      const pct = Number(info?.percent);
      if (Number.isFinite(pct)) onProgresso?.(Math.max(0, Math.min(100, pct)));
    });
  } catch { /* sem evento de progresso: segue sem barra */ }

  try {
    const bundle = await CapacitorUpdater.download({ url, version: versao });
    onProgresso?.(100);
    await CapacitorUpdater.set(bundle); // aplica e recarrega o app
  } finally {
    try { await ouvinte?.remove(); } catch { /* ignora */ }
  }
}

// ============================================================================
// Auto-update OTA (self-hosted no Supabase Storage).
// Na abertura do app nativo, checa um manifesto; se houver versão nova,
// baixa o novo pacote web e aplica — sem reinstalar o APK.
// No navegador (web) não faz nada (o site já atualiza sozinho pelo deploy).
// ============================================================================

const MANIFEST_URL =
  "https://hywupnarvaztectxxbud.supabase.co/storage/v1/object/public/downloads/app-manifest.json";

export async function checkForUpdate() {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor?.isNativePlatform?.()) return; // só no app instalado

    const { CapacitorUpdater } = await import("@capgo/capacitor-updater");

    // Confirma que o bundle atual funciona (evita rollback automático).
    await CapacitorUpdater.notifyAppReady();

    const res = await fetch(`${MANIFEST_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return;
    const m = await res.json(); // { version, url }
    if (!m?.version || !m?.url) return;

    let atual = "builtin";
    try {
      const cur = await CapacitorUpdater.current();
      atual = cur?.bundle?.version || "builtin";
    } catch { /* usa builtin */ }

    if (m.version !== atual) {
      const bundle = await CapacitorUpdater.download({ url: m.url, version: m.version });
      await CapacitorUpdater.set(bundle); // aplica e recarrega
    }
  } catch {
    // silencioso: se falhar, o app segue na versão atual
  }
}

import { createClient } from "@supabase/supabase-js";

// Padrões públicos do projeto (URL e chave publicável NÃO são secretas — já vão
// no bundle do cliente e o RLS protege os dados). As variáveis de ambiente,
// quando definidas, têm prioridade. A secret key nunca aparece aqui.
const DEFAULT_URL = "https://hywupnarvaztectxxbud.supabase.co";
const DEFAULT_PUBLISHABLE_KEY = "sb_publishable_jBAF10AfRUmeldpjKfZpbA_yQ-BqztD";

const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_PUBLISHABLE_KEY;

/**
 * O cliente só é criado se a URL e a chave publicável estiverem presentes.
 * Assim o app roda em modo "demo" (dados locais) enquanto o Supabase não
 * estiver configurado, e passa a persistir de verdade quando estiver.
 */
export const isSupabaseConfigured = Boolean(url && publishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

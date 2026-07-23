import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

/**
 * Observa a sessão de autenticação do Supabase.
 * Em modo demo (sem Supabase configurado) retorna configured=false e a UI
 * segue com dados locais.
 */
export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading, configured: isSupabaseConfigured };
}

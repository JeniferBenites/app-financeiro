import { useCallback, useEffect, useRef, useState } from "react";
import {
  confirmarAppOk, isNativo, verificarAtualizacao, baixarEAplicar, VERSAO_EMBUTIDA,
} from "../lib/updater";

const INTERVALO_MS = 15 * 60 * 1000; // checa a cada 15 min com o app aberto

/* Modo de teste da barra de atualização no navegador: ?testeUpdate=1 */
function modoTeste() {
  try {
    return new URLSearchParams(window.location.search).get("testeUpdate") === "1";
  } catch {
    return false;
  }
}

/**
 * Vigia se saiu versão nova. Não aplica nada sozinho: devolve o estado para a
 * tela mostrar o botão "Atualizar agora".
 *
 * status: "idle" | "disponivel" | "baixando" | "erro"
 */
export function useAppUpdate() {
  const [status, setStatus] = useState("idle");
  const [info, setInfo] = useState(null);   // { versao, notas, url, atual }
  const [progresso, setProgresso] = useState(0);
  const checando = useRef(false);
  const teste = useRef(modoTeste());

  const verificar = useCallback(async () => {
    if (checando.current) return;
    // Não interrompe um download em andamento.
    if (status === "baixando") return;

    if (teste.current) {
      setInfo({ versao: "teste", notas: "Simulação da barra de atualização.", atual: VERSAO_EMBUTIDA });
      setStatus("disponivel");
      return;
    }
    if (!(await isNativo())) return; // no navegador não há OTA

    checando.current = true;
    try {
      const r = await verificarAtualizacao();
      if (r.disponivel) { setInfo(r); setStatus("disponivel"); }
    } catch {
      // sem internet ou manifesto fora do ar: tenta de novo na próxima checagem
    } finally {
      checando.current = false;
    }
  }, [status]);

  const atualizar = useCallback(async () => {
    setProgresso(0);
    setStatus("baixando");
    try {
      if (teste.current) {
        for (let p = 10; p <= 100; p += 15) {
          await new Promise((r) => setTimeout(r, 160));
          setProgresso(p);
        }
        window.location.reload();
        return;
      }
      // Ao terminar, o app recarrega sozinho na versão nova.
      await baixarEAplicar(info, setProgresso);
    } catch {
      setStatus("erro");
    }
  }, [info]);

  const dispensar = useCallback(() => setStatus("idle"), []);

  useEffect(() => {
    confirmarAppOk();   // avisa que este pacote abriu bem (evita rollback)
    verificar();

    const timer = setInterval(verificar, INTERVALO_MS);
    // Ao voltar para o app (troca de aba/app em segundo plano), checa de novo.
    const aoVoltar = () => { if (!document.hidden) verificar(); };
    document.addEventListener("visibilitychange", aoVoltar);
    window.addEventListener("focus", aoVoltar);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", aoVoltar);
      window.removeEventListener("focus", aoVoltar);
    };
  }, []);

  return { status, info, progresso, verificar, atualizar, dispensar };
}

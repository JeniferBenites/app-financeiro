import { MODULOS_1 } from "../content/modulos1";
import { MODULOS_2 } from "../content/modulos2";
import { MODULOS_3 } from "../content/modulos3";

/* Trilha completa: 18 módulos, cada um com várias aulas e um quiz de 10 perguntas. */
export const CURRICULO = [...MODULOS_1, ...MODULOS_2, ...MODULOS_3];

/* Acertos mínimos para concluir um módulo (7 de 10). */
export const ACERTOS_MINIMOS = 7;

/* XP ganho ao concluir um módulo. */
export const XP_MODULO = 80;

export const TOTAL_MODULOS = CURRICULO.length;

export function moduloPorSlug(slug) {
  return CURRICULO.find((m) => m.slug === slug) || null;
}

/* Um módulo é liberado quando o anterior já foi concluído. */
export function moduloLiberado(indice, progresso) {
  if (indice === 0) return true;
  const anterior = CURRICULO[indice - 1];
  return !!progresso?.[anterior.slug]?.concluido;
}

/* Índice do primeiro módulo ainda não concluído — onde o usuário deve continuar. */
export function indiceAtual(progresso) {
  const i = CURRICULO.findIndex((m) => !progresso?.[m.slug]?.concluido);
  return i === -1 ? CURRICULO.length - 1 : i;
}

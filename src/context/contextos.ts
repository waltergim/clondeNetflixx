import { createContext } from "react";
import { CLAVES, leer } from "../utils/almacen";
import type { ItemMiLista, Perfil } from "../types";

/**
 * Definición de los contextos globales. Los `Provider` viven en `Providers.tsx`
 * y los hooks consumidores en `hooks.ts`, para no mezclar componentes y lógica
 * en el mismo módulo.
 */

/* ------------------------------------------------------------------ */
/* Perfiles                                                           */
/* ------------------------------------------------------------------ */

const COLORES_PERFIL = [
  "#00a8e1",
  "#14b8a6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#22c55e",
] as const;

const AVATARES = ["🦊", "🐼", "🦁", "🐙", "🦄", "🐯"] as const;

export const crearPerfilInicial = (indice: number): Perfil => ({
  id: crypto.randomUUID(),
  nombre: `Perfil ${indice + 1}`,
  color: COLORES_PERFIL[indice % COLORES_PERFIL.length],
  avatar: AVATARES[indice % AVATARES.length],
  createdAt: Date.now(),
});

/** Perfiles de fábrica, solo se usan la primera vez que se abre la app. */
export const perfilesPorDefecto = (): Perfil[] =>
  ["Walte", "Familia", "Amigos"].map((nombre, i) => ({
    id: crypto.randomUUID(),
    nombre,
    color: COLORES_PERFIL[i],
    avatar: AVATARES[i],
    createdAt: Date.now(),
  }));

const perfilesIniciales = leer<Perfil[]>(CLAVES.perfiles, perfilesPorDefecto());

export interface ValorPerfiles {
  perfiles: Perfil[];
  perfilActivo: Perfil | null;
  primerUso: boolean;
  /** Marca la app como "ya abierta" para no volver al selector. */
  completarPrimerUso: () => void;
  seleccionarPerfil: (id: string) => void;
  crearPerfil: (nombre: string, color?: string) => Perfil | null;
  renombrarPerfil: (id: string, nombre: string) => void;
  eliminarPerfil: (id: string) => void;
  /** Color sugerido para el siguiente perfil nuevo. */
  colorSugerido: () => string;
}

export const PerfilesContexto = createContext<ValorPerfiles>({
  perfiles: perfilesIniciales,
  perfilActivo: null,
  primerUso: true,
  completarPrimerUso: () => {},
  seleccionarPerfil: () => {},
  crearPerfil: () => null,
  renombrarPerfil: () => {},
  eliminarPerfil: () => {},
  colorSugerido: () => COLORES_PERFIL[0],
});

/* ------------------------------------------------------------------ */
/* Mi lista                                                           */
/* ------------------------------------------------------------------ */

/** Listas indexadas por id de perfil: cada uno tiene su propia "Mi lista". */
export type ListasPorPerfil = Record<string, ItemMiLista[]>;

export interface ValorMiLista {
  /** Elementos del perfil activo, del más reciente al más antiguo. */
  items: ItemMiLista[];
  total: number;
  contiene: (clave: string) => boolean;
  alternar: (item: ItemMiLista) => void;
  quitar: (clave: string) => void;
  vaciar: () => void;
}

export const MiListaContexto = createContext<ValorMiLista>({
  items: [],
  total: 0,
  contiene: () => false,
  alternar: () => {},
  quitar: () => {},
  vaciar: () => {},
});

/* ------------------------------------------------------------------ */
/* Listas por perfil                                                 */
/* ------------------------------------------------------------------ */

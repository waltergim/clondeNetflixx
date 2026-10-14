import { useContext } from "react";
import {
  MiListaContexto,
  PerfilesContexto,
  type ValorMiLista,
  type ValorPerfiles,
} from "./contextos";

/**
 * Hooks de acceso al estado global. Cada hook devuelve el valor por defecto
 * documented en `contextos.ts` si falta su `Provider`, para no romper el render.
 */

export const usePerfil = (): ValorPerfiles => useContext(PerfilesContexto);

export const useMiLista = (): ValorMiLista => useContext(MiListaContexto);

/** Atajo cuando el consumidor ya sabe que hay un perfil activo. */
export const usePerfilActivo = () => usePerfil().perfilActivo;

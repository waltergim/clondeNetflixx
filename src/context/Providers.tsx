import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  MiListaContexto,
  PerfilesContexto,
  crearPerfilInicial,
  perfilesPorDefecto,
  type ListasPorPerfil,
  type ValorMiLista,
  type ValorPerfiles,
} from "./contextos";
import { usePerfil } from "./hooks";
import { CLAVES, leer, escribir, MAX_PERFILES } from "../utils/almacen";
import type { ItemMiLista, Perfil } from "../types";

/**
 * `Provider`s de la aplicación. Se montan una sola vez vía `AppProviders` y
 * encapsulan la persistencia en `localStorage`.
 */

const COLORES = ["#00a8e1", "#14b8a6", "#f59e0b", "#8b5cf6", "#ec4899", "#22c55e"];

/* ------------------------------------------------------------------ */
/* Perfiles                                                           */
/* ------------------------------------------------------------------ */

/**
 * Lee los perfiles guardados. Si el almacenamiento quedó corrupto, vacío o no
 * tiene perfiles, se regeneran los de fábrica: nunca podemos quedarnos en un
 * estado donde el usuario no pueda entrar.
 */
const leerPerfiles = (): Perfil[] => {
  const guardados = leer<Perfil[]>(CLAVES.perfiles, []);

  if (guardados.length > 0) return guardados;

  const porDefecto = perfilesPorDefecto();
  escribir(CLAVES.perfiles, porDefecto);
  return porDefecto;
};

interface EstadoInicial {
  perfiles: Perfil[];
  idActivo: string | null;
  primerUso: boolean;
}

/** Estado inicial consistente: si el id guardado no apunta a un perfil real, se reinicia. */
const leerEstado = (): EstadoInicial => {
  const perfiles = leerPerfiles();
  const guardado = leer<string | null>(CLAVES.perfilActivo, null);
  const existe = guardado !== null && perfiles.some((p) => p.id === guardado);

  return { perfiles, idActivo: existe ? guardado : null, primerUso: !existe };
};

export const PerfilesProvider = ({ children }: { children: ReactNode }) => {
  const [inicial] = useState(leerEstado);

  const [perfiles, setPerfiles] = useState<Perfil[]>(inicial.perfiles);
  const [idActivo, setIdActivo] = useState<string | null>(inicial.idActivo);
  const [primerUso, setPrimerUso] = useState<boolean>(inicial.primerUso);

  const guardarPerfiles = useCallback((siguientes: Perfil[]) => {
    setPerfiles(siguientes);
    escribir(CLAVES.perfiles, siguientes);
  }, []);

  const seleccionarPerfil = useCallback((id: string) => {
    setIdActivo(id);
    escribir(CLAVES.perfilActivo, id);
    setPrimerUso(false);
    escribir(CLAVES.primerUso, false);
  }, []);

  const completarPrimerUso = useCallback(() => {
    setPrimerUso(false);
    escribir(CLAVES.primerUso, false);
  }, []);

  const crearPerfil = useCallback(
    (nombre: string, color?: string): Perfil | null => {
      const limpio = nombre.trim();
      if (!limpio || perfiles.length >= MAX_PERFILES) return null;

      const nuevo: Perfil = {
        ...crearPerfilInicial(perfiles.length),
        nombre: limpio,
        color: color ?? COLORES[perfiles.length % COLORES.length],
      };

      guardarPerfiles([...perfiles, nuevo]);
      return nuevo;
    },
    [perfiles, guardarPerfiles],
  );

  const renombrarPerfil = useCallback(
    (id: string, nombre: string) => {
      const limpio = nombre.trim();
      if (!limpio) return;
      guardarPerfiles(
        perfiles.map((p) => (p.id === id ? { ...p, nombre: limpio } : p)),
      );
    },
    [perfiles, guardarPerfiles],
  );

  const eliminarPerfil = useCallback(
    (id: string) => {
      const restantes = perfiles.filter((p) => p.id !== id);
      if (restantes.length === perfiles.length) return;

      guardarPerfiles(restantes);

      if (idActivo === id) {
        const siguiente = restantes[0]?.id ?? null;
        setIdActivo(siguiente);
        escribir(CLAVES.perfilActivo, siguiente);
      }
    },
    [perfiles, idActivo, guardarPerfiles],
  );

  const valor = useMemo<ValorPerfiles>(
    () => ({
      perfiles,
      perfilActivo: perfiles.find((p) => p.id === idActivo) ?? null,
      primerUso,
      completarPrimerUso,
      seleccionarPerfil,
      crearPerfil,
      renombrarPerfil,
      eliminarPerfil,
      colorSugerido: () => COLORES[perfiles.length % COLORES.length],
    }),
    [
      perfiles,
      idActivo,
      primerUso,
      completarPrimerUso,
      seleccionarPerfil,
      crearPerfil,
      renombrarPerfil,
      eliminarPerfil,
    ],
  );

  return (
    <PerfilesContexto.Provider value={valor}>{children}</PerfilesContexto.Provider>
  );
};

/* ------------------------------------------------------------------ */
/* Mi lista                                                           */
/* ------------------------------------------------------------------ */

export const MiListaProvider = ({ children }: { children: ReactNode }) => {
  const { perfilActivo } = usePerfil();
  const [listas, setListas] = useState<ListasPorPerfil>(() =>
    leer<ListasPorPerfil>(CLAVES.miLista, {}),
  );

  const guardar = useCallback((siguientes: ListasPorPerfil) => {
    setListas(siguientes);
    escribir(CLAVES.miLista, siguientes);
  }, []);

  const items = useMemo(
    () => (perfilActivo ? (listas[perfilActivo.id] ?? []) : []),
    [listas, perfilActivo],
  );

  const valor = useMemo<ValorMiLista>(() => {
    const actuales = items;

    return {
      items: actuales,
      total: actuales.length,
      contiene: (clave) => actuales.some((i) => i.clave === clave),
      alternar: (item: ItemMiLista) => {
        if (!perfilActivo) return;
        const suyas = listas[perfilActivo.id] ?? [];
        const existe = suyas.some((i) => i.clave === item.clave);

        guardar({
          ...listas,
          [perfilActivo.id]: existe
            ? suyas.filter((i) => i.clave !== item.clave)
            : [item, ...suyas],
        });
      },
      quitar: (clave) => {
        if (!perfilActivo) return;
        guardar({
          ...listas,
          [perfilActivo.id]: (listas[perfilActivo.id] ?? []).filter(
            (i) => i.clave !== clave,
          ),
        });
      },
      vaciar: () => {
        if (!perfilActivo) return;
        guardar({ ...listas, [perfilActivo.id]: [] });
      },
    };
  }, [items, listas, perfilActivo, guardar]);

  return <MiListaContexto.Provider value={valor}>{children}</MiListaContexto.Provider>;
};

/* ------------------------------------------------------------------ */
/* Composición                                                        */
/* ------------------------------------------------------------------ */

/** Monta toda la pila de contextos. `MiListaProvider` necesita el perfil. */
export const AppProviders = ({ children }: { children: ReactNode }) => (
  <PerfilesProvider>
    <MiListaProvider>{children}</MiListaProvider>
  </PerfilesProvider>
);

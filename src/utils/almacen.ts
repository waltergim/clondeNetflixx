/**
 * Acceso tipado a `localStorage`. Todo el estado que debe sobrevivir a un
 * refresh (perfiles y Mi lista) pasa por aquí.
 */

export const CLAVES = {
  perfiles: "clonvideo:perfiles",
  perfilActivo: "clonvideo:perfil-activo",
  primerUso: "clonvideo:primer-uso",
  miLista: "clonvideo:mi-lista",
} as const;

/** Máximo de perfiles, igual que Prime Video. */
export const MAX_PERFILES = 6;

export const leer = <T>(clave: string, porDefecto: T): T => {
  try {
    const crudo = window.localStorage.getItem(clave);
    if (crudo === null) return porDefecto;
    return JSON.parse(crudo) as T;
  } catch {
    // JSON corrupto o almacenamiento bloqueado (modo privado, etc.).
    return porDefecto;
  }
};

export const escribir = (clave: string, valor: unknown): void => {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Cuota superada o almacenamiento no disponible: el estado seguirá solo
    // en memoria, que es un degradado aceptable.
  }
};

export const borrar = (clave: string): void => {
  try {
    window.localStorage.removeItem(clave);
  } catch {
    // ignorado a propósito
  }
};

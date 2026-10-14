import type { TipoMedio } from "../types/tmdb";

/** Fábrica central de rutas para no repetir cadenas en los componentes. */

export const RUTAS = {
  inicio: "/",
  perfiles: "/perfiles",
  buscar: "/buscar",
  miLista: "/mi-lista",
} as const;

/** `/pelicula/550` o `/serie/1399`. */
export const rutaDetalle = (medio: TipoMedio, id: number): string =>
  medio === "movie" ? `/pelicula/${id}` : `/serie/${id}`;

export const rutaPelicula = (id: number): string => `/pelicula/${id}`;

export const rutaSerie = (id: number): string => `/serie/${id}`;

/** Lee `id` numérico de los parámetros de react-router. */
export const idDesdeParam = (param: string | undefined): number => {
  const id = Number(param);
  return Number.isFinite(id) && id > 0 ? id : NaN;
};

/** `/buscar?q=...`, normalizando espacios y quitando acentos al buscar. */
export const rutaBusqueda = (consulta: string): string => {
  const limpio = consulta.trim();
  return limpio ? `${RUTAS.buscar}?q=${encodeURIComponent(limpio)}` : RUTAS.buscar;
};

/** Quita acentos y pasa a minúsculas para que "accion" encuentre "Acción". */
export const normalizarConsulta = (texto: string): string =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

import { GENEROS_PELICULA, GENEROS_SERIE, nombreGenero } from "./config";
import { pedir, type OpcionesPeticion } from "./client";
import type {
  Detalle,
  Genero,
  MediaId,
  Pagina,
  Persona,
  Reparto,
  Resumen,
  ResultadoMultiple,
  TipoMedio,
  Video,
} from "../types/tmdb";
import type { FilaCatalogo } from "../types";

 

type Opciones = OpcionesPeticion;

 
export const tendencias = (
  medio: TipoMedio | "all" = "all",
  ventana: "day" | "week" = "week",
  opciones?: Opciones,
): Promise<Pagina<Resumen>> =>
  pedir<Pagina<Resumen>>(`/trending/${medio}/${ventana}`, opciones);

 
export const descubrirPeliculas = (
  filtros: DiscoverParams = {},
  opciones?: Opciones,
): Promise<Pagina<Resumen>> =>
  pedir<Pagina<Resumen>>("/discover/movie", {
    ...opciones,
    params: { sort_by: "popularity.desc", include_adult: false, ...aParams(filtros) },
  });

 
export const descubrirSeries = (
  filtros: DiscoverParams = {},
  opciones?: Opciones,
): Promise<Pagina<Resumen>> =>
  pedir<Pagina<Resumen>>("/discover/tv", {
    ...opciones,
    params: { sort_by: "popularity.desc", include_adult: false, ...aParams(filtros) },
  });
 
export const descubrir = (
  medio: TipoMedio,
  filtros: DiscoverParams = {},
  opciones?: Opciones,
): Promise<Pagina<Resumen>> =>
  medio === "movie" ? descubrirPeliculas(filtros, opciones) : descubrirSeries(filtros, opciones);

export interface DiscoverParams {
  pagina?: number;
  genero?: number;
 
  anio?: number;
 
  duracionMax?: number;
 
  votacionMin?: number;
 
  orden?: string;
}

 
const aParams = (f: DiscoverParams): Record<string, string | number> => {
  const params: Record<string, string | number> = {};

  if (f.pagina) params.page = f.pagina;
  if (f.orden) params.sort_by = f.orden;
  if (f.genero) params.with_genres = f.genero;
  if (f.anio) params.year = f.anio;
  if (f.duracionMax) params["with_runtime.lte"] = f.duracionMax;
  if (f.votacionMin !== undefined) params["vote_average.gte"] = f.votacionMin;

  return params;
};

 
export const pedirFila = (
  fila: FilaCatalogo,
  signal?: AbortSignal,
  forzar = false,
): Promise<Pagina<Resumen>> => {
  if (fila.tipo === "Mixto") {
    return tendencias("all", fila.ventana ?? "week", { signal, forzar });
  }

  const tipo = fila.tipo === "Pelicula" ? "movie" : "tv";

  if (fila.ventana) {
    return tendencias(tipo, fila.ventana, { signal, forzar });
  }

  return descubrir(
    tipo,
    fila.conGenero ? { genero: fila.conGenero } : {},
    { signal, forzar },
  );
};

 
export const detalle = (
  medio: TipoMedio,
  id: MediaId,
  opciones?: Opciones,
): Promise<Detalle> =>
  pedir<Detalle>(`/${medio}/${id}`, {
    ...opciones,
    params: { append_to_response: "credits,videos" },
  });
 
export const reparto = (
  medio: TipoMedio,
  id: MediaId,
  opciones?: Opciones,
): Promise<Reparto> => pedir<Reparto>(`/${medio}/${id}/credits`, opciones);

 
export const videos = (
  medio: TipoMedio,
  id: MediaId,
  opciones?: Opciones,
): Promise<{ results: Video[] }> => pedir<{ results: Video[] }>(`/${medio}/${id}/videos`, opciones);

 
export const similares = (
  medio: TipoMedio,
  id: MediaId,
  opciones?: Opciones,
): Promise<Pagina<Resumen>> =>
  pedir<Pagina<Resumen>>(`/${medio}/${id}/similar`, opciones);

 
export const recomendaciones = (
  medio: TipoMedio,
  id: MediaId,
  opciones?: Opciones,
): Promise<Pagina<Resumen>> =>
  pedir<Pagina<Resumen>>(`/${medio}/${id}/recommendations`, opciones);

 
export const buscar = (
  query: string,
  opciones?: Opciones & { pagina?: number },
): Promise<Pagina<ResultadoMultiple>> =>
  pedir<Pagina<ResultadoMultiple>>("/search/multi", {
    ...opciones,
    params: { query, page: opciones?.pagina, include_adult: false },
  });

 
export const persona = (
  id: number,
  opciones?: Opciones,
): Promise<Persona> =>
  pedir<Persona>(`/person/${id}`, {
    ...opciones,
    params: { append_to_response: "combined_credits" },
  });

 
export const generosDe = (medio: TipoMedio): Genero[] =>
  medio === "movie"
    ? GENEROS_PELICULA.map((g) => ({ id: g.id, name: g.nombre }))
    : GENEROS_SERIE.map((g) => ({ id: g.id, name: g.nombre }));

 
export const generosDeTitulo = (titulo: Resumen): Genero[] => {
  if ("genres" in titulo && Array.isArray(titulo.genres) && titulo.genres.length > 0) {
    return titulo.genres;
  }
  return (titulo.genre_ids ?? []).map((id) => ({ id, name: nombreGenero(id) }));
};

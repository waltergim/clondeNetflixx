import type { TamanoImagen, TipoMedio } from "../types/tmdb";

 
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const API_KEY = import.meta.env.VITE_TMDB_API_KEY ?? "";
export const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN ?? "";
export const LANGUAGE = import.meta.env.VITE_TMDB_LANGUAGE ?? "es-ES";

 
export const CACHE_TTL_MS = 5 * 60 * 1000;

export const IMAGE_SIZES = {
  poster: "w342",
  posterGrande: "w500",
  backdrop: "w780",
  backdropGrande: "w1280",
  perfil: "w185",
} as const satisfies Record<string, TamanoImagen>;

 
export const GENEROS_PELICULA = [
  { id: 28, nombre: "Acción" },
  { id: 12, nombre: "Aventura" },
  { id: 16, nombre: "Animación" },
  { id: 35, nombre: "Comedia" },
  { id: 80, nombre: "Crimen" },
  { id: 99, nombre: "Documental" },
  { id: 18, nombre: "Drama" },
  { id: 10751, nombre: "Familia" },
  { id: 14, nombre: "Fantasía" },
  { id: 36, nombre: "Historia" },
  { id: 27, nombre: "Terror" },
  { id: 10402, nombre: "Música" },
  { id: 9648, nombre: "Misterio" },
  { id: 10749, nombre: "Romance" },
  { id: 878, nombre: "Ciencia ficción" },
  { id: 10770, nombre: "Película de TV" },
  { id: 53, nombre: "Thriller" },
  { id: 10752, nombre: "Acción y aventura" },
  { id: 37, nombre: "Western" },
] as const;

 
export const GENEROS_SERIE = [
  { id: 10759, nombre: "Acción y aventura" },
  { id: 10765, nombre: "Ciencia ficción y fantasía" },
  { id: 10768, nombre: "Guerra y política" },
  { id: 80, nombre: "Crimen" },
  { id: 18, nombre: "Drama" },
  { id: 9648, nombre: "Misterio" },
  { id: 10763, nombre: "Noticias" },
  { id: 10764, nombre: "Reality" },
  { id: 10766, nombre: "Soap" },
  { id: 10767, nombre: "Talk" },
  { id: 10762, nombre: "Infantil" },
  { id: 10751, nombre: "Familia" },
  { id: 35, nombre: "Comedia" },
  { id: 16, nombre: "Animación" },
  { id: 99, nombre: "Documental" },
  { id: 37, nombre: "Western" },
] as const;

const NOMBRES_GENERO = new Map<number, string>([
  ...GENEROS_PELICULA.map((g) => [g.id, g.nombre] as const),
  ...GENEROS_SERIE.map((g) => [g.id, g.nombre] as const),
]);

 
export const nombreGenero = (id: number): string =>
  NOMBRES_GENERO.get(id) ?? "Otro";

 
export const etiquetaMedio = (medio: TipoMedio): string =>
  medio === "movie" ? "Película" : "Serie";

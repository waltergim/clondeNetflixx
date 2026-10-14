/**
 * Tipos de la API de TMDB (v3).
 * @see https://developer.themoviedb.org/reference
 */

 
export type MediaId = number;

 
export interface Titulos {
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  tagline?: string;
}

export interface Genre {
  id: number;
  name: string;
}

 
export type Genero = Genre;
 
export type TipoMedioListado = TipoMedio | "person";

 
export interface Resumen extends Titulos {
  id: MediaId;
  media_type?: TipoMedioListado;
  adult?: boolean;
  overview?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids?: number[];
  
  release_date?: string;
  first_air_date?: string;
 
  runtime?: number | null;
  original_language?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  
  episode_run_time?: number[] | number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  origin_country?: string[];
}

export interface Produccion {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface RepartoMiembro {
  id: number;
  name: string;
  character?: string;
  job?: string;
  profile_path: string | null;
  order?: number;
  credit_id?: string;
}

export interface Reparto {
  cast: RepartoMiembro[];
  crew: RepartoMiembro[];
}

 
export interface Video {
  id: string;
  key: string;
  name: string;
  site: "YouTube" | "Vimeo" | string;
  type: "Trailer" | "Teaser" | "Clip" | "Featurette" | string;
  official?: boolean;
  published_at?: string;
}

 
export interface Detalle extends Resumen {
  tagline?: string;
  status?: string;
  homepage?: string | null;
  runtime?: number | null;
 
  episode_run_time?: number[];
  genres: Genre[];
  production_companies?: Produccion[];
  production_countries?: Produccion[];
  spoken_languages?: { english_name: string; iso_639_1: string }[];
  budget?: number;
  revenue?: number;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
 
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Temporada[];
 
  in_production?: boolean;
  last_air_date?: string;
  next_episode_to_air?: Episodio | null;
 
  credits?: Reparto;
  videos?: { results: Video[] };
}

export interface Temporada {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  overview?: string;
  air_date?: string;
}

export interface Episodio {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  overview?: string;
  still_path: string | null;
  air_date?: string;
  runtime?: number;
}

 
export interface Persona {
  id: number;
  name: string;
  biography?: string;
  birthday?: string | null;
  deathday?: string | null;
  place_of_birth?: string | null;
  profile_path: string | null;
  known_for_department?: string;
  popularity?: number;
  also_known_as?: string[];
  credits?: {
    cast: Resumen[];
    crew: Resumen[];
  };
}

 
export interface Pagina<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

 
export interface ResultadoMultiple extends Resumen {
  
  profile_path?: string | null;
   
  known_for?: Resumen[];
  known_for_department?: string;
}

 
export type TamanoImagen =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

export type TamanoPoster = TamanoImagen;

 
export type TipoMedio = "movie" | "tv";

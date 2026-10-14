import type { Resumen, TipoMedio } from "./tmdb";

/** Perfil de usuario local (tipo selector de perfiles). */
export interface Perfil {
  id: string;
  nombre: string;
  /** Color de acento del avatar. */
  color: string;
  /** Emoji o inicial mostrada en el avatar. */
  avatar?: string;
  esInfantil?: boolean;
  createdAt: number;
}

/** Clave normalizada `movie:1234` / `tv:5678` para identificar un título. */
export type ClaveMedio = `${TipoMedio}:${number}`;

/** Elemento guardado en "Mi lista". Guarda lo justo para pintar la lista sin red. */
export interface ItemMiLista {
  clave: ClaveMedio;
  media: Resumen;
  addedAt: number;
}

/** Estado devuelto por los hooks de fetching. */
export type EstadoCarga = "cargando" | "listo" | "error";

/** Fila de la home: título + endpoint que la alimenta. */
export interface FilaCatalogo {
  id: string;
  titulo: string;
  subtitulo?: string;
  /** `Pelicula` para `/movie/...`, `Serie` para `/tv/...`, `Mixto` para `trending/all`. */
  tipo: "Pelicula" | "Serie" | "Mixto";
  /** DeterminesTMDB. */
  medio: TipoMedio | "all";
  ventana?: "day" | "week";
  conGenero?: number;
}

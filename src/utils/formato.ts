import { IMAGE_SIZES, TMDB_IMAGE_BASE } from "../api/config";
import type { Resumen, TamanoImagen, TipoMedio } from "../types/tmdb";
import type { ClaveMedio } from "../types";

/** Utilidades de imagen, formato y navegación. */

/** Construye una URL de imagen de TMDB a partir de un path y un tamaño. */
export const urlImagen = (
  path: string | null | undefined,
  size: TamanoImagen = IMAGE_SIZES.backdrop,
): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const urlPoster = (path: string | null | undefined): string | null =>
  urlImagen(path, IMAGE_SIZES.poster);

export const urlFondo = (path: string | null | undefined): string | null =>
  urlImagen(path, IMAGE_SIZES.backdropGrande);

export const urlAvatar = (path: string | null | undefined): string | null =>
  urlImagen(path, IMAGE_SIZES.perfil);

/** Título de un resultado de listado: `title` en películas, `name` en series. */
export const titulo = (item: Resumen): string =>
  item.title ?? item.name ?? item.original_title ?? item.original_name ?? "Sin título";

/** Título original, útil como subtítulo cuando difiere del traducido. */
export const tituloOriginal = (item: Resumen): string =>
  item.original_title ?? item.original_name ?? "";

const formatoFecha = new Intl.DateTimeFormat("es-ES", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const formatoAnio = new Intl.DateTimeFormat("es-ES", { year: "numeric" });

const sinDia = (fecha: string): string =>
  new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(
    new Date(`${fecha}T00:00:00`),
  );

/** Extrae el año de `release_date` o `first_air_date`. */
export const anio = (item: Resumen): string | null => {
  const fecha = item.release_date ?? item.first_air_date;
  if (!fecha) return null;
  return formatoAnio.format(new Date(`${fecha}T00:00:00`));
};

/** Fecha completa en español, o `null` si el título no tiene fecha. */
export const fechaLarga = (item: Resumen): string | null => {
  const fecha = item.release_date ?? item.first_air_date;
  if (!fecha) return null;
  return formatoFecha.format(new Date(`${fecha}T00:00:00`));
};

/** Fecha corta tipo "octubre de 2024" (usada en "Añadido a Mi lista"). */
export const fechaCorta = (iso: string): string => sinDia(iso);

/** Duración en minutos → `1 h 58 min` / `58 min`. */
export const duracion = (minutos?: number | null): string | null => {
  if (!minutos) return null;
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return horas > 0 ? `${horas} h ${mins} min` : `${mins} min`;
};

/** Deduce el tipo de medio de un listado normal de TMDB. */
export const medioDe = (item: Resumen): TipoMedio =>
  item.media_type === "tv" || Boolean(item.first_air_date) ? "tv" : "movie";

/** Clave estable `movie:1234` para usar en listas y rutas. */
export const claveDe = (medio: TipoMedio, id: number): ClaveMedio => `${medio}:${id}`;

/** Clave estable deducida de un resultado. */
export const claveDeResumen = (item: Resumen): ClaveMedio => claveDe(medioDe(item), item.id);

/** Votación formateada a una sola cifra decimal, o `null`. */
export const valoracion = (nota?: number | null): string | null =>
  typeof nota === "number" ? nota.toFixed(1) : null;

/** Vídeo elegido para el reproductor, con su tipo original de TMDB. */
export interface VideoElegido {
  key: string;
  tipo: string;
}

/** Etiqueta en español para el tipo de vídeo que muestra el reproductor. */
export const etiquetaVideo = (tipo: string): string => {
  switch (tipo.toLowerCase()) {
    case "trailer":
      return "Tráiler";
    case "teaser":
      return "Teaser";
    case "clip":
      return "Clip";
    case "featurette":
      return "Featurette";
    default:
      return "Vídeo";
  }
};

/**
 * Elige el mejor vídeo para el reproductor: primero el trailer oficial de
 * YouTube y, si no hay, cualquier teaser o clip. Algunas series en TMDB solo
 * tienen clips, así que conviene conservar el tipo para poder etiquetarlo.
 */
export const mejorTrailer = (
  videos: { key: string; site: string; type: string; official?: boolean; language?: string }[],
): VideoElegido | null => {
  const candidates = videos.filter(
    (v) => v.site === "YouTube" && /^(Trailer|Teaser|Clip|Featurette)$/i.test(v.type),
  );

  const puntuado = candidates
    .map((v) => {
      let puntos = 0;
      if (/^Trailer$/i.test(v.type)) puntos += 100;
      if (/^Teaser$/i.test(v.type)) puntos += 60;
      if (v.official) puntos += 50;
      if (v.language?.startsWith("es")) puntos += 30;
      return { key: v.key, tipo: v.type, puntos };
    })
    .sort((a, b) => b.puntos - a.puntos);

  const mejor = puntuado[0];
  return mejor ? { key: mejor.key, tipo: mejor.tipo } : null;
};

/** Construye la URL de embed de YouTube a partir de una clave. */
export const urlYoutube = (key: string): string =>
  `https://www.youtube-nocookie.com/embed/${key}?autoplay=1&rel=0&modestbranding=1`;

/** Recorta una sinopsis a un máximo de caracteres sin cortar palabras. */
export const recortar = (texto: string, maximo = 220): string => {
  if (texto.length <= maximo) return texto;
  const corte = texto.slice(0, maximo);
  return `${corte.slice(0, corte.lastIndexOf(" "))}…`;
};

/** Array de 0 a 5 estrellas a partir de una nota sobre 10. */
export const estrellas = (nota?: number): number => {
  if (!nota) return 0;
  return Math.max(0, Math.min(5, Math.round((nota / 10) * 5)));
};

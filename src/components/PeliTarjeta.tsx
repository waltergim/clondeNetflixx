import { Link } from "react-router-dom";
import { Icono } from "./Icono";
import { useMiLista } from "../context/hooks";
import {
  anio as anioDe,
  claveDe,
  titulo as tituloDe,
  urlPoster,
  valoracion,
} from "../utils/formato";
import { rutaDetalle } from "../utils/rutas";
import type { Resumen, TipoMedio } from "../types/tmdb";

/**
 * Tarjeta de póster. Es el componente más repetido de la app, así que además
 * expone el botón de "Mi lista" y un overlay de acción al pasar el ratón.
 */

export const PeliTarjeta = ({
  medio,
  titulo,
  subtitulo,
  className = "",
}: {
  medio: TipoMedio;
  titulo: Resumen;
  /** Texto auxiliar bajo la tarjeta (actor, fecha de añadido…). */
  subtitulo?: string;
  className?: string;
}) => {
  const { contiene, alternar } = useMiLista();

  const clave = claveDe(medio, titulo.id);
  const enLista = contiene(clave);

  const alternarLista = () =>
    alternar({ clave, media: titulo, addedAt: Date.now() });

  const cartel = urlPoster(titulo.poster_path);
  const nombre = tituloDe(titulo);
  const salida = anioDe(titulo);
  const nota = valoracion(titulo.vote_average);

  return (
    <article className={`group/card relative ${className}`}>
      <Link
        to={rutaDetalle(medio, titulo.id)}
        aria-label={nombre}
        className="block focus-visible:outline-none">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-superficie ring-1 ring-white/5 transition duration-300 group-hover/card:ring-2 group-hover/card:ring-primario/70">
          {cartel ? (
            <img
              src={cartel}
              alt={nombre}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-500 group-hover/card:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-superficie to-fondo p-3 text-center">
              <span className="line-clamp-4 text-xs font-medium text-white/50">
                {nombre}
              </span>
            </div>
          )}

          {/* Degradado inferior con los metadatos */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-8">
            <p className="line-clamp-2 text-xs font-semibold leading-tight sm:text-sm">
              {nombre}
            </p>
            <p className="mt-1 flex items-center gap-2 text-[11px] text-white/70">
              {salida ? <span>{salida}</span> : null}
              {nota ? (
                <>
                  <span className="text-primario">★</span>
                  <span>{nota}</span>
                </>
              ) : null}
            </p>
          </div>

          <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/45 opacity-0 transition duration-200 group-hover/card:opacity-100">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white/95 text-fondo shadow-lg">
              <Icono nombre="play" relleno className="ml-0.5 text-xl" />
            </span>
          </span>
        </div>
      </Link>

      <button
        type="button"
        onClick={alternarLista}
        aria-pressed={enLista}
        aria-label={enLista ? `Quitar ${nombre} de Mi lista` : `Añadir ${nombre} a Mi lista`}
        title={enLista ? "Quitar de Mi lista" : "Añadir a Mi lista"}
        className={`absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/20 backdrop-blur transition ${
          enLista
            ? "bg-primario text-white opacity-100"
            : "bg-black/60 text-white opacity-0 hover:bg-black/85 focus-visible:opacity-100 group-hover/card:opacity-100"
        }`}>
        <Icono nombre={enLista ? "check" : "mas"} className="text-sm" />
      </button>

      {subtitulo ? (
        <p className="mt-2 line-clamp-2 text-xs text-white/50">{subtitulo}</p>
      ) : null}
    </article>
  );
};

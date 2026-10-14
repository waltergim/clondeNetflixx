import { useCallback } from "react";
import { Carrusel } from "./Carrusel";
import { PeliTarjeta } from "./PeliTarjeta";
import { ErrorEstado, EsqueletoFila } from "./Estados";
import { useApi } from "../hooks/useApi";
import { pedirFila } from "../api/TmdbApi";
import { medioDe } from "../utils/formato";
import type { FilaCatalogo as DefinicionFila } from "../types";
import type { Resumen, TipoMedio } from "../types/tmdb";

/**
 * Fila de catálogo: pide sus datos, pinta el carrusel y gestiona los estados de
 * carga y error. Todas las filas de la home usan esta pieza, así que añadir un
 * carrusel nuevo es escribir una entrada en `src/Inicio/filas.ts`.
 */

interface PropiedadesFila {
  definicion: DefinicionFila;
  /** Muestra el número de posición sobre la tarjeta (estilo "Top 10"). */
  numerada?: boolean;
  className?: string;
  porPagina?: number;
}

export const FilaCatalogo = ({
  definicion,
  numerada = false,
  className = "py-6",
  porPagina = 6,
}: PropiedadesFila) => {
  const { id, titulo: encabezado, tipo, medio, ventana, conGenero } = definicion;

  const pedir = useCallback(
    (signal: AbortSignal, forzar: boolean) =>
      pedirFila({ id, titulo: encabezado, tipo, medio, ventana, conGenero }, signal, forzar),
    [id, encabezado, tipo, medio, ventana, conGenero],
  );

  const { data, loading, error, reload } = useApi(pedir, [id]);

  if (loading) return <EsqueletoFila cantidad={7} />;

  if (error) {
    return (
      <section className={`py-6 ${className}`}>
        <ErrorEstado
          titulo={`No se pudo cargar "${encabezado}"`}
          mensaje={error}
          onReintentar={reload}
        />
      </section>
    );
  }

  const resultados: Resumen[] = data?.results ?? [];
  if (resultados.length === 0) return null;

  return (
    <Carrusel
      titulo={encabezado}
      subtitulo={definicion.subtitulo}
      porPagina={porPagina}
      total={resultados.length}
      className={className}
      vacio={null}>
      {resultados.map((item, indice) => (
        <TarjetaFila
          key={`${item.id}-${indice}`}
          medio={medioDeItem(tipo, item)}
          pelicula={item}
          posicion={numerada ? indice + 1 : null}
        />
      ))}
    </Carrusel>
  );
};

/**
 * En las filas "Mixto" (`trending/all`) cada elemento llega con su propio tipo,
 * así que hay que deducirlo del propio título y no de la definición de la fila.
 */
const medioDeItem = (tipo: DefinicionFila["tipo"], item: Resumen): TipoMedio => {
  if (tipo === "Pelicula") return "movie";
  if (tipo === "Serie") return "tv";
  return medioDe(item);
};

/* ------------------------------------------------------------------ */
/* Tarjeta con rango opcional                                         */
/* ------------------------------------------------------------------ */

const TarjetaFila = ({
  medio,
  pelicula,
  posicion,
}: {
  medio: TipoMedio;
  pelicula: Resumen;
  posicion: number | null;
}) => {
  if (posicion === null) return <PeliTarjeta medio={medio} titulo={pelicula} />;

  return (
    <div className="flex items-stretch gap-1">
      <span
        aria-hidden
        className="flex shrink-0 items-end font-extrabold leading-[0.8] text-5xl text-white/25 outline-none [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] sm:text-6xl">
        {posicion}
      </span>
      <div className="min-w-0 flex-1">
        <PeliTarjeta medio={medio} titulo={pelicula} />
      </div>
    </div>
  );
};

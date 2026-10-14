import { useCallback } from "react";
import { Link } from "react-router-dom";
import { Carrusel } from "../components/Carrusel";
import { PeliTarjeta } from "../components/PeliTarjeta";
import { ErrorEstado, EsqueletoFila } from "../components/Estados";
import { useApi } from "../hooks/useApi";
import { recomendaciones, similares } from "../api/TmdbApi";
import type { MediaId, TipoMedio } from "../types/tmdb";

interface Propiedades {
  medio: TipoMedio;
  id: MediaId;
}

export const Similares = ({ medio, id }: Propiedades) => {
  const pedirSimilares = useCallback(
    (signal: AbortSignal, forzar: boolean) =>
      similares(medio, id, { signal, forzar }),
    [medio, id],
  );

  const pedirRecomendaciones = useCallback(
    (signal: AbortSignal, forzar: boolean) =>
      recomendaciones(medio, id, { signal, forzar }),
    [medio, id],
  );

  const consultaSimilares = useApi(pedirSimilares, [medio, id]);
  const consultaRecomendaciones = useApi(pedirRecomendaciones, [medio, id]);

  const cargando = consultaSimilares.loading && consultaRecomendaciones.loading;

  const titulosSimilares = consultaSimilares.data?.results ?? [];
  const titulosRecomendados = consultaRecomendaciones.data?.results ?? [];

  const error = consultaSimilares.error ?? consultaRecomendaciones.error;

  if (cargando) {
    return (
      <div className="mx-auto w-full max-w-[1800px] space-y-2 py-10 md:px-12">
        <EsqueletoFila cantidad={7} />
        <EsqueletoFila cantidad={7} />
      </div>
    );
  }

  if (
    error &&
    titulosSimilares.length === 0 &&
    titulosRecomendados.length === 0
  ) {
    return (
      <div className="mx-auto w-full max-w-[1800px] md:px-12">
        <ErrorEstado
          titulo="No pudimos cargar el contenido relacionado"
          mensaje={error}
          onReintentar={consultaSimilares.reload}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 pt-10 md:px-12">
      {titulosSimilares.length > 0 ? (
        <Carrusel
          titulo="Títulos similares"
          porPagina={6}
          total={titulosSimilares.length}
          className="py-6"
          acciones={<VerMas destino="/peliculas" />}>
          {titulosSimilares.map((titulo) => (
            <PeliTarjeta key={titulo.id} medio={medio} titulo={titulo} />
          ))}
        </Carrusel>
      ) : null}

      {titulosRecomendados.length > 0 ? (
        <Carrusel
          titulo="Recomendado para ti"
          porPagina={6}
          total={titulosRecomendados.length}
          className="py-6">
          {titulosRecomendados.map((titulo) => (
            <PeliTarjeta key={titulo.id} medio={medio} titulo={titulo} />
          ))}
        </Carrusel>
      ) : null}
    </div>
  );
};

const VerMas = ({ destino }: { destino: string }) => (
  <Link
    to={destino}
    className="text-xs font-semibold text-primario hover:underline">
    Ver más
  </Link>
);

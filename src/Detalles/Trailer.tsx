import { useState, type ReactNode } from "react";
import { Modal } from "../components/Modal";
import { EsqueletoBloque, Vacio } from "../components/Estados";
import { Icono } from "../components/Icono";
import { videos } from "../api/TmdbApi";
import { useApi } from "../hooks/useApi";
import { mejorTrailer, urlYoutube, etiquetaVideo } from "../utils/formato";
import type { TipoMedio } from "../types/tmdb";

interface PropiedadesTrailer {
  abierto: boolean;
  onCerrar: () => void;
  medio: TipoMedio;
  id: number;
  titulo?: string;
}

export const Trailer = ({
  abierto,
  onCerrar,
  medio,
  id,
  titulo,
}: PropiedadesTrailer) => {
  const [reproduciendo, setReproduciendo] = useState(false);

  const { data, loading, error, reload } = useApi(
    (signal, forzar) => videos(medio, id, { signal, forzar }),
    [medio, id],
    { enabled: abierto },
  );

  const elegido = data ? mejorTrailer(data.results) : null;
  const nombre = titulo ?? "Tráiler";
  const clase = elegido ? etiquetaVideo(elegido.tipo) : "Tráiler";

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo={nombre} ancho="lg">
      <div className="aspect-video w-full bg-black">
        {loading ? (
          <EsqueletoBloque className="h-full w-full rounded-none" />
        ) : error ? (
          <Vacio
            titulo="No se pudo cargar el tráiler"
            mensaje={error}
            accion={
              <button
                type="button"
                onClick={reload}
                className="rounded-md bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25">
                Reintentar
              </button>
            }
          />
        ) : elegido ? (
          reproduciendo ? (
            <iframe
              src={urlYoutube(elegido.key)}
              title={`${clase} de ${nombre}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setReproduciendo(true)}
              className="group relative h-full w-full">
              <img
                src={`https://i.ytimg.com/vi/${elegido.key}/maxresdefault.jpg`}
                alt={`${clase} de ${nombre}`}
                loading="lazy"
                className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
              />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-primario text-2xl text-white shadow-2xl transition-transform group-hover:scale-110">
                  <Icono nombre="play" relleno className="ml-1" />
                </span>
              </span>
              <span className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-1 text-xs font-semibold">
                Reproducir {clase.toLowerCase()}
              </span>
            </button>
          )
        ) : (
          <Vacio
            titulo="Sin tráiler disponible"
            mensaje="TMDB no tiene vídeos asociados a este título."
          />
        )}
      </div>

      <div className="flex flex-wrap gap-2 px-5 py-4 text-xs text-white/60">
        {data?.results.length ? (
          <>
            <span className="rounded bg-white/10 px-2 py-1">
              {data.results.length} vídeo{data.results.length === 1 ? "" : "s"}{" "}
              disponibles
            </span>
            {elegido ? (
              <span className="rounded bg-white/10 px-2 py-1">
                Mostrando: {clase}
              </span>
            ) : null}
            <span className="rounded bg-white/10 px-2 py-1">
              Fuente: YouTube
            </span>
          </>
        ) : null}
      </div>
    </Modal>
  );
};

export const BotonTrailer = ({
  medio,
  id,
  titulo,
  children,
  className = "",
}: {
  medio: TipoMedio;
  id: number;
  titulo: string;
  children?: ReactNode;
  className?: string;
}) => {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className={className}>
        {children ?? (
          <span className="inline-flex items-center gap-2">
            <Icono nombre="play" relleno />
            Reproducir
          </span>
        )}
      </button>
      <Trailer
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        medio={medio}
        id={id}
        titulo={titulo}
      />
    </>
  );
};

import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useApi } from "../hooks/useApi";
import { useMiLista } from "../context/hooks";
import { generosDeTitulo, tendencias } from "../api/TmdbApi";
import { EsqueletoHero } from "../components/Estados";
import { Icono } from "../components/Icono";
import { Trailer } from "./Trailer";
import {
  anio as anioDe,
  claveDe,
  duracion,
  medioDe,
  recortar,
  titulo as tituloDe,
  urlFondo,
  valoracion,
} from "../utils/formato";
import { rutaDetalle } from "../utils/rutas";
import type { Resumen, TipoMedio } from "../types/tmdb";

const CUANTOS = 5;

export const Portada = () => {
  const [trailerDe, setTrailerDe] = useState<Resumen | null>(null);

  const { data, loading, error } = useApi(
    (signal, forzar) => tendencias("all", "week", { signal, forzar }),
    [],
  );

  const destacados = (data?.results ?? [])
    .filter((item) => item.backdrop_path && item.overview)
    .slice(0, CUANTOS);

  if (loading) return <EsqueletoHero />;

  if (error) {
    return (
      <div className="flex h-[45vh] min-h-[320px] items-center justify-center bg-superficie/40 px-6 text-center">
        <p className="text-sm text-white/60">{error}</p>
      </div>
    );
  }

  if (destacados.length === 0) return null;

  return (
    <section className="relative">
      <Swiper
        modules={[Pagination, Keyboard, A11y, Autoplay]}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        autoplay={{ delay: 7000, disableOnInteraction: true }}
        loop={destacados.length > 1}
        speed={600}
        className="[--swiper-pagination-color:#00a8e1] [--swiper-pagination-bullet-inactive-color:#fff] [--swiper-pagination-bullet-inactive-opacity:0.3] [--swiper-pagination-bottom:1.5rem]">
        {destacados.map((item, indice) => (
          <SwiperSlide key={`${medioDe(item)}-${item.id}`}>
            <BannerPelicula
              pelicula={item}
              puesto={indice + 1}
              onTrailer={() => setTrailerDe(item)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {trailerDe ? (
        <Trailer
          abierto
          onCerrar={() => setTrailerDe(null)}
          medio={medioDe(trailerDe)}
          id={trailerDe.id}
          titulo={tituloDe(trailerDe)}
        />
      ) : null}
    </section>
  );
};

const BannerPelicula = ({
  pelicula,
  puesto,
  onTrailer,
}: {
  pelicula: Resumen;
  puesto: number;
  onTrailer: () => void;
}) => {
  const medio = medioDe(pelicula);
  const nombre = tituloDe(pelicula);
  const fondo = urlFondo(pelicula.backdrop_path);
  const generos = generosDeTitulo(pelicula).slice(0, 3);
  const salida = anioDe(pelicula);

  const runtime: number | null =
    pelicula.runtime ??
    (Array.isArray(pelicula.episode_run_time)
      ? (pelicula.episode_run_time[0] ?? null)
      : (pelicula.episode_run_time ?? null));

  const largo = duracion(runtime);
  const nota = valoracion(pelicula.vote_average);

  return (
    <article className="relative h-[78vh] min-h-[520px] max-h-[760px] w-full overflow-hidden">
      {fondo ? (
        <img
          src={fondo}
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-0 h-full w-full animate-[fundido_0.8s_ease-out] object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-superficie to-fondo" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-fondo via-fondo/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-fondo via-transparent to-black/50" />

      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-2xl px-4 pb-24 md:px-12 md:pb-28">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primario/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primario">
            <Icono nombre="estrella" relleno className="text-xs" />
            Top {puesto} esta semana
          </p>

          <h1 className="text-3xl font-extrabold leading-tight drop-shadow-2xl sm:text-4xl lg:text-5xl">
            {nombre}
          </h1>

          {pelicula.tagline ? (
            <p className="mt-2 text-sm italic text-white/70 sm:text-base">
              {pelicula.tagline}
            </p>
          ) : null}

          <ul className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/80 sm:text-sm">
            {salida ? (
              <li className="font-medium text-white">{salida}</li>
            ) : null}
            {largo ? <li>{largo}</li> : null}
            {nota ? (
              <li className="flex items-center gap-1">
                <Icono nombre="estrella" relleno className="text-primario" />
                <span className="font-semibold text-white">{nota}</span>
                <span className="text-white/60">/10</span>
              </li>
            ) : null}
            {generos.map((genero) => (
              <li key={genero.id}>{genero.name}</li>
            ))}
          </ul>

          {pelicula.overview ? (
            <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-white/85 drop-shadow sm:text-base">
              {recortar(pelicula.overview, 260)}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onTrailer}
              className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold text-fondo transition hover:bg-white/85 sm:text-base">
              <Icono nombre="play" relleno />
              Reproducir
            </button>

            <BotonAnadir medio={medio} pelicula={pelicula} />

            <Link
              to={rutaDetalle(medio, pelicula.id)}
              className="inline-flex items-center gap-2 rounded-md bg-white/15 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/25 sm:text-base">
              <Icono nombre="info" />
              Más info
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

const BotonAnadir = ({
  medio,
  pelicula,
}: {
  medio: TipoMedio;
  pelicula: Resumen;
}) => {
  const { contiene, alternar } = useMiLista();
  const clave = claveDe(medio, pelicula.id);
  const enLista = contiene(clave);

  return (
    <button
      type="button"
      onClick={() => alternar({ clave, media: pelicula, addedAt: Date.now() })}
      aria-pressed={enLista}
      className="inline-flex items-center gap-2 rounded-md bg-white/15 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/25 sm:text-base">
      <Icono nombre={enLista ? "check" : "mas"} relleno={!enLista} />
      {enLista ? "En Mi lista" : "Mi lista"}
    </button>
  );
};

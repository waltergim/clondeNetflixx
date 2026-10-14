import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { detalle } from "../api/TmdbApi";
import { useApi } from "../hooks/useApi";
import { useMiLista } from "../context/hooks";
import { Boton } from "../components/Boton";
import { ErrorEstado, EsqueletoBloque } from "../components/Estados";
import { Icono } from "../components/Icono";
import { Trailer } from "./Trailer";
import { Similares } from "./Similares";
import {
  anio as anioDe,
  claveDe,
  duracion,
  fechaLarga,
  titulo as tituloDe,
  tituloOriginal,
  urlAvatar,
  urlFondo,
  urlPoster,
  valoracion,
} from "../utils/formato";
import { idDesdeParam, RUTAS } from "../utils/rutas";
import type {
  Detalle as DetalleMedio,
  RepartoMiembro,
  TipoMedio,
} from "../types/tmdb";

export const Informacion = ({ medio }: { medio: TipoMedio }) => {
  const { id: idCrudo } = useParams();
  const id = idDesdeParam(idCrudo);

  const [trailerAbierto, setTrailerAbierto] = useState(false);

  const pedir = useCallback(
    (signal: AbortSignal, forzar: boolean) => {
      if (!Number.isFinite(id))
        return Promise.reject(new Error("Identificador no válido."));
      return detalle(medio, id, { signal, forzar });
    },
    [medio, id],
  );

  const { data, loading, error, reload } = useApi(pedir, [medio, id]);

  if (loading) return <EsqueletoDetalle />;

  if (error) {
    return (
      <div className="min-h-[70vh] pt-24">
        <ErrorEstado
          titulo="No pudimos cargar este título"
          mensaje={error}
          onReintentar={reload}
        />
        <div className="flex justify-center pb-16">
          <Boton variante="fantasma" onClick={() => window.history.back()}>
            <Icono nombre="volver" />
            Volver
          </Boton>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <InformacionCabecera
        detalle={data}
        medio={medio}
        onTrailer={() => setTrailerAbierto(true)}
      />
      <Similares medio={medio} id={data.id} />

      <Trailer
        abierto={trailerAbierto}
        onCerrar={() => setTrailerAbierto(false)}
        medio={medio}
        id={data.id}
        titulo={tituloDe(data)}
      />
    </>
  );
};

const InformacionCabecera = ({
  detalle: ficha,
  medio,
  onTrailer,
}: {
  detalle: DetalleMedio;
  medio: TipoMedio;
  onTrailer: () => void;
}) => {
  const { contiene, alternar } = useMiLista();

  const nombre = tituloDe(ficha);
  const original = tituloOriginal(ficha);
  const fondo = urlFondo(ficha.backdrop_path);
  const poster = urlPoster(ficha.poster_path);
  const salida = anioDe(ficha);
  const largo = duracion(ficha.runtime ?? ficha.episode_run_time?.[0]);
  const nota = valoracion(ficha.vote_average);
  const clave = claveDe(medio, ficha.id);
  const enLista = contiene(clave);

  return (
    <>
      {/* Fondo */}
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {fondo ? (
          <img
            src={fondo}
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="h-full w-full bg-superficie" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-fondo via-fondo/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-fondo via-fondo/40 to-transparent" />
      </div>

      <div className="mx-auto -mt-56 w-full max-w-[1800px] px-4 pb-8 md:-mt-72 md:px-12">
        <Link
          to={RUTAS.inicio}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-xs font-semibold backdrop-blur transition hover:bg-black/75">
          <Icono nombre="volver" className="text-sm" />
          Volver al inicio
        </Link>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
          {poster ? (
            <img
              src={poster}
              alt=""
              aria-hidden
              className="hidden w-40 shrink-0 rounded-xl shadow-2xl ring-1 ring-white/10 sm:block lg:w-52"
            />
          ) : null}

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-primario">
              {medio === "movie" ? "Película" : "Serie"}
            </p>

            <h1 className="mt-1 text-3xl font-extrabold leading-tight drop-shadow-2xl sm:text-4xl lg:text-5xl">
              {nombre}
            </h1>

            {original && original !== nombre ? (
              <p className="mt-1 text-sm text-white/55">{original}</p>
            ) : null}

            {ficha.tagline ? (
              <p className="mt-2 text-sm italic text-white/70">
                {ficha.tagline}
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
              {ficha.genres?.map((genero) => (
                <li key={genero.id}>{genero.name}</li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onTrailer}
                className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold text-fondo transition hover:bg-white/85 sm:text-base">
                <Icono nombre="play" relleno />
                Reproducir
              </button>

              <button
                type="button"
                onClick={() =>
                  alternar({ clave, media: ficha, addedAt: Date.now() })
                }
                aria-pressed={enLista}
                className="inline-flex items-center gap-2 rounded-md bg-white/15 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/25 sm:text-base">
                <Icono nombre={enLista ? "check" : "mas"} relleno={!enLista} />
                {enLista ? "En Mi lista" : "Mi lista"}
              </button>

              {ficha.homepage ? (
                <a
                  href={ficha.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-white/15 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/25 sm:text-base">
                  <Icono nombre="volver-inicio" />
                  Sitio oficial
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Columnas de información */}
      <div className="mx-auto grid w-full max-w-[1800px] gap-8 px-4 md:px-12 lg:grid-cols-[2fr_1fr]">
        <div>
          {ficha.overview ? (
            <section>
              <h2 className="text-lg font-bold">Sinopsis</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/75">
                {ficha.overview}
              </p>
            </section>
          ) : null}

          <Reparto credits={ficha.credits?.cast} />

          {medio === "tv" && ficha.seasons?.length ? (
            <Temporadas seasons={ficha.seasons} />
          ) : null}
        </div>

        <aside className="space-y-5 text-sm">
          <FichaDatos detalle={ficha} />
        </aside>
      </div>
    </>
  );
};

const Reparto = ({ credits }: { credits?: RepartoMiembro[] }) => {
  if (!credits?.length) return null;

  const reparto = credits.slice(0, 18);

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold">Reparto principal</h2>
      <ul className="mt-4 flex gap-4 overflow-x-auto pb-2 sin-barra">
        {reparto.map((actor) => {
          const foto = urlAvatar(actor.profile_path);

          return (
            <li
              key={actor.credit_id ?? actor.id}
              className="w-24 shrink-0 text-center">
              {foto ? (
                <img
                  src={foto}
                  alt={actor.name}
                  loading="lazy"
                  className="aspect-square w-24 rounded-lg object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="grid aspect-square w-24 place-items-center rounded-lg bg-superficie text-xl font-bold text-white/40 ring-1 ring-white/10">
                  {actor.name.charAt(0)}
                </div>
              )}
              <p className="mt-2 line-clamp-2 text-xs font-semibold">
                {actor.name}
              </p>
              {actor.character ? (
                <p className="line-clamp-2 text-[11px] text-white/50">
                  {actor.character}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const Temporadas = ({
  seasons,
}: {
  seasons: NonNullable<DetalleMedio["seasons"]>;
}) => {
  // TMDB incluye una temporada 0 de episodios especiales: la filtramos.
  const reales = seasons.filter((temporada) => temporada.season_number > 0);

  if (reales.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold">Temporadas ({reales.length})</h2>
      <ul className="mt-4 space-y-2">
        {reales.map((temporada) => (
          <li
            key={temporada.id}
            className="flex items-center gap-4 rounded-lg bg-superficie/60 p-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primario/15 text-sm font-bold text-primario">
              {temporada.season_number}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{temporada.name}</p>
              <p className="text-xs text-white/50">
                {temporada.episode_count} episodio
                {temporada.episode_count === 1 ? "" : "s"}
                {temporada.air_date ? ` · ${temporada.air_date}` : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

const Fila = ({
  etiqueta,
  valor,
}: {
  etiqueta: string;
  valor: string | null;
}) => {
  if (!valor) return null;

  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-white/40">
        {etiqueta}
      </dt>
      <dd className="mt-0.5 text-white/85">{valor}</dd>
    </div>
  );
};

const FichaDatos = ({ detalle: ficha }: { detalle: DetalleMedio }) => {
  const paises = ficha.production_countries?.map((p) => p.name).join(", ");
  const companias = ficha.production_companies
    ?.map((empresa) => empresa.name)
    .join(", ");

  const creadoPor = ficha.credits?.crew?.find(
    (persona) =>
      persona.job === "Director" ||
      persona.job === "Creator" ||
      persona.job === "Executive Producer",
  );

  return (
    <dl className="space-y-4 rounded-xl bg-superficie/50 p-5">
      <Fila etiqueta="Director" valor={creadoPor?.name ?? null} />
      <Fila etiqueta="Estreno" valor={fechaLarga(ficha)} />
      <Fila etiqueta="Países" valor={paises ?? null} />
      <Fila etiqueta="Estado" valor={ficha.status ?? null} />
      <Fila
        etiqueta="Puntuación"
        valor={
          ficha.vote_average
            ? `${valoracion(ficha.vote_average)} / 10 (${ficha.vote_count ?? 0} votos)`
            : null
        }
      />
      <Fila etiqueta="Compañías" valor={companias ?? null} />
    </dl>
  );
};

const EsqueletoDetalle = () => (
  <div>
    <div className="h-[60vh] min-h-[420px] w-full bg-superficie/60" />
    <div className="mx-auto -mt-40 max-w-[1800px] px-4 md:px-12">
      <EsqueletoBloque className="mb-6 h-10 w-64" />
      <div className="flex gap-8">
        <EsqueletoBloque className="hidden w-48 aspect-[2/3] sm:block" />
        <div className="flex-1 space-y-4">
          <EsqueletoBloque className="h-8 w-3/4" />
          <EsqueletoBloque className="h-4 w-1/2" />
          <EsqueletoBloque className="h-4 w-full" />
          <EsqueletoBloque className="h-4 w-5/6" />
          <div className="flex gap-3 pt-4">
            <EsqueletoBloque className="h-11 w-36" />
            <EsqueletoBloque className="h-11 w-32" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

import { Link } from "react-router-dom";
import { PeliTarjeta } from "../components/PeliTarjeta";
import { Icono } from "../components/Icono";
import {
  anio as anioDe,
  titulo as tituloDe,
  urlAvatar,
  urlPoster,
} from "../utils/formato";
import { rutaDetalle } from "../utils/rutas";
import type { ResultadoMultiple, TipoMedio } from "../types/tmdb";

export const Resultados = ({
  resultados,
}: {
  resultados: ResultadoMultiple[];
}) => {
  const titulos = resultados.filter((item) => item.media_type !== "person");
  const personas = resultados.filter((item) => item.media_type === "person");

  return (
    <div className="space-y-10">
      {titulos.length > 0 ? <RejillaTitulos titulos={titulos} /> : null}

      {personas.length > 0 ? (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">
            Personas
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {personas.map((persona) => (
              <FichaPersona key={persona.id} persona={persona} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
};

const RejillaTitulos = ({ titulos }: { titulos: ResultadoMultiple[] }) => (
  <section>
    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">
      Títulos
    </h2>
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
      {titulos.map((titulo) => (
        <li key={`${titulo.media_type}-${titulo.id}`}>
          <PeliTarjeta
            medio={titulo.media_type === "tv" ? "tv" : "movie"}
            titulo={titulo}
          />
        </li>
      ))}
    </ul>
  </section>
);

const FichaPersona = ({ persona }: { persona: ResultadoMultiple }) => {
  const nombre = persona.name ?? "Sin nombre";
  const foto = urlAvatar(persona.profile_path);

  return (
    <li>
      <details className="group rounded-xl bg-superficie/60 p-4">
        <summary className="flex cursor-pointer list-none items-center gap-4">
          {foto ? (
            <img
              src={foto}
              alt=""
              loading="lazy"
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-white/10"
            />
          ) : (
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-fondo-2 text-xl font-bold text-white/40">
              {nombre.charAt(0)}
            </span>
          )}

          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold">{nombre}</span>
            <span className="block truncate text-xs text-white/50">
              {persona.known_for_department ?? "Actor"}
            </span>
          </span>

          <Icono
            nombre="chevron-abajo"
            className="shrink-0 text-white/40 transition-transform group-open:rotate-180"
          />
        </summary>

        <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
          <Creditos persona={persona} />
        </ul>
      </details>
    </li>
  );
};

const Creditos = ({ persona }: { persona: ResultadoMultiple }) => {
  const destacados = (persona.known_for ?? []).slice(0, 6);

  if (destacados.length === 0) {
    return <li className="text-xs text-white/40">Sin créditos destacados.</li>;
  }

  return (
    <>
      {destacados.map((titulo) => {
        const medio: TipoMedio = titulo.first_air_date ? "tv" : "movie";
        const poster = urlPoster(titulo.poster_path);

        return (
          <li key={`${medio}-${titulo.id}`}>
            <Link
              to={rutaDetalle(medio, titulo.id)}
              className="flex items-center gap-3 rounded-lg p-1 transition hover:bg-white/5">
              {poster ? (
                <img
                  src={poster}
                  alt=""
                  loading="lazy"
                  className="h-12 w-9 shrink-0 rounded object-cover"
                />
              ) : (
                <span className="grid h-12 w-9 shrink-0 place-items-center rounded bg-fondo-2 text-[10px] text-white/30">
                  —
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium">
                  {tituloDe(titulo)}
                </span>
                <span className="block text-[11px] text-white/45">
                  {medio === "tv" ? "Serie" : "Película"}
                  {anioDe(titulo) ? ` · ${anioDe(titulo)}` : ""}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

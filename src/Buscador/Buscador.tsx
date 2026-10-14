import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { buscar } from "../api/TmdbApi";
import { useApi } from "../hooks/useApi";
import { useDebounce } from "../hooks/useDebounce";
import { Resultados } from "./Resultados";
import { EsqueletoRejilla, Vacio } from "../components/Estados";
import { Icono } from "../components/Icono";
import { RUTAS } from "../utils/rutas";

export const Buscador = () => {
  const [parametros] = useSearchParams();
  const consultaUrl = parametros.get("q") ?? "";
  const consulta = useDebounce(consultaUrl, 400).trim();

  const pedir = useCallback(
    (signal: AbortSignal, forzar: boolean) =>
      buscar(consulta, { signal, forzar }),
    [consulta],
  );

  const { data, loading, error, reload } = useApi(pedir, [consulta], {
    enabled: consulta.length >= 2,
  });

  const resultados = data?.results ?? [];

  return (
    <div className="min-h-[70vh] pt-24 pb-16">
      <div className="mx-auto w-full max-w-[1800px] px-4 md:px-12">
        <header className="mb-6">
          <h1 className="text-xl font-bold sm:text-2xl">
            Resultados para{" "}
            <span className="text-primario">«{consultaUrl}»</span>
          </h1>
          {data && !loading ? (
            <p className="mt-1 text-xs text-white/50">
              {data.total_results} resultado
              {data.total_results === 1 ? "" : "s"}
            </p>
          ) : null}
        </header>

        <ContenidoBusqueda
          consulta={consulta}
          cargando={loading}
          error={error}
          resultados={resultados}
          onReintentar={reload}
        />
      </div>
    </div>
  );
};

const ContenidoBusqueda = ({
  consulta,
  cargando,
  error,
  resultados,
  onReintentar,
}: {
  consulta: string;
  cargando: boolean;
  error: string | null;
  resultados: Parameters<typeof Resultados>[0]["resultados"];
  onReintentar: () => void;
}) => {
  if (consulta.length === 0) return <Sugerencias />;

  if (consulta.length === 1) {
    return (
      <Vacio
        titulo="Escribe un poco más"
        mensaje="Necesitamos al menos dos caracteres para buscar."
        icono="lupa"
      />
    );
  }

  if (cargando) return <EsqueletoRejilla />;

  if (error) {
    return (
      <Vacio
        titulo="La búsqueda falló"
        mensaje={error}
        icono="alerta"
        accion={
          <button
            type="button"
            onClick={onReintentar}
            className="rounded-md bg-white/15 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/25">
            Reintentar
          </button>
        }
      />
    );
  }

  if (resultados.length === 0) {
    return (
      <Vacio
        titulo={`Nada encontrado para «${consulta}»`}
        mensaje="Prueba con otro título, un actor o una serie."
        icono="lupa"
      />
    );
  }

  return <Resultados resultados={resultados} />;
};

const SUGERENCIAS = [
  "Dune",
  "The Bear",
  "Interstellar",
  "Severance",
  "Oppenheimer",
  "La Casa de Papel",
];

const Sugerencias = () => (
  <section>
    <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
      Búsquedas populares
    </h2>
    <ul className="mt-4 flex flex-wrap gap-2">
      {SUGERENCIAS.map((sugerencia) => (
        <li key={sugerencia}>
          <a
            href={`${RUTAS.buscar}?q=${encodeURIComponent(sugerencia)}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm transition hover:border-primario hover:bg-primario/10">
            <Icono nombre="lupa" className="text-xs text-white/50" />
            {sugerencia}
          </a>
        </li>
      ))}
    </ul>
  </section>
);

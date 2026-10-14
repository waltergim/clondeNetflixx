import { useCallback, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { descubrir, generosDe } from "../api/TmdbApi";
import { useApi } from "../hooks/useApi";
import { PeliTarjeta } from "../components/PeliTarjeta";
import { ErrorEstado, EsqueletoRejilla, Vacio } from "../components/Estados";
import { Icono } from "../components/Icono";
import { etiquetaMedio } from "../api/config";
import type { TipoMedio } from "../types/tmdb";

const ORDENES = [
  { valor: "popularity.desc", texto: "Más populares" },
  { valor: "vote_average.desc", texto: "Mejor valoradas" },
  { valor: "primary_release_date.desc", texto: "Más recientes" },
  { valor: "revenue.desc", texto: "Mayores ingresos" },
] as const;

export const Explorar = ({ medio }: { medio: TipoMedio }) => {
  const [parametros, setParametros] = useSearchParams();

  const genero = Number(parametros.get("genero")) || null;
  const orden = parametros.get("orden") ?? "popularity.desc";
  const pagina = Math.max(1, Number(parametros.get("pagina")) || 1);

  const generos = generosDe(medio);

  const pedir = useCallback(
    (signal: AbortSignal, forzar: boolean) =>
      descubrir(
        medio,
        { pagina, genero: genero ?? undefined, orden },
        { signal, forzar },
      ),
    [medio, pagina, genero, orden],
  );

  const { data, loading, error, reload } = useApi(pedir, [
    medio,
    pagina,
    genero,
    orden,
  ]);

  const resultados = data?.results ?? [];
  const nombreGenero = generos.find((g) => g.id === genero)?.name;
  const totalPaginas = data?.total_pages ?? 1;

  const actualizar = (clave: string, valor: string | null) => {
    const siguiente = new URLSearchParams(parametros);

    if (valor === null) siguiente.delete(clave);
    else siguiente.set(clave, valor);

    if (clave !== "pagina") siguiente.delete("pagina");

    setParametros(siguiente, { replace: false });
  };

  return (
    <div className="min-h-[70vh] pt-24 pb-16">
      <div className="mx-auto w-full max-w-[1800px] px-4 md:px-12">
        <header className="mb-6">
          <h1 className="text-xl font-bold sm:text-2xl">
            {etiquetaMedio(medio)}
            {nombreGenero ? `: ${nombreGenero}` : ""}
          </h1>
          {data && !loading ? (
            <p className="mt-1 text-xs text-white/50">
              {data.total_results} títulos
            </p>
          ) : null}
        </header>

        {/* Géneros */}
        <nav aria-label="Géneros" className="mb-6">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Chip
                activo={genero === null}
                onClick={() => actualizar("genero", null)}>
                Todos
              </Chip>
            </li>
            {generos.map((opcion) => (
              <li key={opcion.id}>
                <Chip
                  activo={genero === opcion.id}
                  onClick={() => actualizar("genero", String(opcion.id))}>
                  {opcion.name}
                </Chip>
              </li>
            ))}
          </ul>
        </nav>

        {/* Orden */}
        <div className="mb-8 flex items-center gap-2">
          <Icono nombre="filtro" className="text-sm text-white/40" />
          <label htmlFor="orden" className="text-sm text-white/50">
            Ordenar por
          </label>
          <select
            id="orden"
            value={orden}
            onChange={(e) => actualizar("orden", e.target.value)}
            className="rounded-md border border-white/15 bg-superficie px-3 py-1.5 text-sm outline-none focus:border-primario">
            {ORDENES.map((opcion) => (
              <option
                key={opcion.valor}
                value={opcion.valor}
                className="bg-superficie">
                {opcion.texto}
              </option>
            ))}
          </select>
        </div>

        {loading ? <EsqueletoRejilla cantidad={18} /> : null}

        {!loading && error ? (
          <ErrorEstado mensaje={error} onReintentar={reload} />
        ) : null}

        {!loading && !error && resultados.length === 0 ? (
          <Vacio
            titulo="Sin resultados"
            mensaje="Prueba con otro género o cambia el orden."
            icono="filtro"
          />
        ) : null}

        {!loading && resultados.length > 0 ? (
          <>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
              {resultados.map((titulo) => (
                <li key={titulo.id}>
                  <PeliTarjeta medio={medio} titulo={titulo} />
                </li>
              ))}
            </ul>

            <Paginacion
              pagina={pagina}
              totalPaginas={totalPaginas}
              onIr={(nueva) => actualizar("pagina", String(nueva))}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

const Chip = ({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={activo}
    className={`rounded-full px-4 py-1.5 text-sm transition ${
      activo
        ? "bg-primario font-semibold text-white"
        : "bg-white/8 text-white/70 hover:bg-white/15 hover:text-white"
    }`}>
    {children}
  </button>
);

const Paginacion = ({
  pagina,
  totalPaginas,
  onIr,
}: {
  pagina: number;
  totalPaginas: number;
  onIr: (pagina: number) => void;
}) => {
  if (totalPaginas <= 1) return null;

  // Ventana deslizante de 5 páginas alrededor de la actual.
  const desde = Math.max(1, Math.min(pagina - 2, totalPaginas - 4));
  const hasta = Math.min(totalPaginas, desde + 4);
  const numeros = Array.from(
    { length: hasta - desde + 1 },
    (_, i) => desde + i,
  );

  return (
    <nav
      aria-label="Paginación"
      className="mt-12 flex items-center justify-center gap-2">
      <BotonPagina
        etiqueta="Página anterior"
        deshabilitado={pagina <= 1}
        onClick={() => onIr(pagina - 1)}>
        <Icono nombre="chevron-izq" />
      </BotonPagina>

      {numeros.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onIr(n)}
          aria-current={n === pagina ? "page" : undefined}
          className={`h-9 min-w-9 rounded-md px-3 text-sm font-semibold transition ${
            n === pagina
              ? "bg-primario text-white"
              : "bg-white/8 text-white/70 hover:bg-white/15"
          }`}>
          {n}
        </button>
      ))}

      <BotonPagina
        etiqueta="Página siguiente"
        deshabilitado={pagina >= totalPaginas}
        onClick={() => onIr(pagina + 1)}>
        <Icono nombre="chevron-der" />
      </BotonPagina>
    </nav>
  );
};

const BotonPagina = ({
  etiqueta,
  deshabilitado,
  onClick,
  children,
}: {
  etiqueta: string;
  deshabilitado: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={deshabilitado}
    aria-label={etiqueta}
    className="grid h-9 w-9 place-items-center rounded-md bg-white/8 text-white/70 transition hover:bg-white/15 disabled:opacity-30">
    {children}
  </button>
);

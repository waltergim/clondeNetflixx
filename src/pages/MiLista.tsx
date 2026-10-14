import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMiLista, usePerfil } from "../context/hooks";
import { PeliTarjeta } from "../components/PeliTarjeta";
import { Vacio } from "../components/Estados";
import { BotonEnlace } from "../components/Boton";
import { Icono } from "../components/Icono";
import { fechaCorta, medioDe, titulo as tituloDe } from "../utils/formato";
import type { ItemMiLista } from "../types";

type Orden = "recientes" | "alfabetico" | "antiguos";

const ORDENES: { valor: Orden; texto: string }[] = [
  { valor: "recientes", texto: "Añadidos recientemente" },
  { valor: "antiguos", texto: "Añadidos antes" },
  { valor: "alfabetico", texto: "Título (A-Z)" },
];

export const MiLista = () => {
  const { items, quitar, vaciar } = useMiLista();
  const { perfilActivo } = usePerfil();
  const [orden, setOrden] = useState<Orden>("recientes");

  const ordenados = useMemo(() => ordenar(items, orden), [items, orden]);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] pt-24 pb-16">
        <div className="mx-auto w-full max-w-[1800px] px-4 md:px-12">
          <h1 className="text-xl font-bold sm:text-2xl">Mi lista</h1>
          <Vacio
            titulo="Tu lista está vacía"
            mensaje={
              perfilActivo
                ? `Guarda títulos desde el botón "+" y aparecerán aquí en el perfil ${perfilActivo.nombre}.`
                : 'Guarda títulos desde el botón "+" y aparecerán aquí.'
            }
            icono="lista"
            accion={<BotonEnlace to="/">Explorar el catálogo</BotonEnlace>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] pt-24 pb-16">
      <div className="mx-auto w-full max-w-[1800px] px-4 md:px-12">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">Mi lista</h1>
            <p className="mt-1 text-sm text-white/50">
              {items.length} título{items.length === 1 ? "" : "s"}
              {perfilActivo ? ` · perfil ${perfilActivo.nombre}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="orden-lista">
              Ordenar por
            </label>
            <select
              id="orden-lista"
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="rounded-md border border-white/15 bg-superficie px-3 py-2 text-sm outline-none focus:border-primario">
              {ORDENES.map((opcion) => (
                <option
                  key={opcion.valor}
                  value={opcion.valor}
                  className="bg-superficie">
                  {opcion.texto}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                if (window.confirm("¿Vaciar la lista de este perfil?"))
                  vaciar();
              }}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-red-600/70">
              <Icono nombre="basura" className="text-sm" />
              <span className="hidden sm:inline">Vaciar</span>
            </button>
          </div>
        </header>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {ordenados.map((item) => (
            <li key={item.clave} className="relative">
              <PeliTarjeta medio={medioDe(item.media)} titulo={item.media} />
              <button
                type="button"
                onClick={() => quitar(item.clave)}
                aria-label={`Quitar ${tituloDe(item.media)} de Mi lista`}
                title="Quitar de Mi lista"
                className="absolute -bottom-5 right-0 inline-flex items-center gap-1 text-[11px] text-white/40 transition hover:text-red-400">
                <Icono nombre="cerrar" className="text-[10px]" />
                {fechaCorta(new Date(item.addedAt).toISOString())}
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-xs text-white/35">
          ¿Buscas más?{" "}
          <Link to="/peliculas" className="text-primario hover:underline">
            Explora películas
          </Link>{" "}
          o{" "}
          <Link to="/series" className="text-primario hover:underline">
            series
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

const ordenar = (items: ItemMiLista[], orden: Orden): ItemMiLista[] => {
  const copia = [...items];

  switch (orden) {
    case "antiguos":
      return copia.sort((a, b) => a.addedAt - b.addedAt);
    case "alfabetico":
      return copia.sort((a, b) =>
        tituloDe(a.media).localeCompare(tituloDe(b.media), "es"),
      );
    default:
      return copia.sort((a, b) => b.addedAt - a.addedAt);
  }
};

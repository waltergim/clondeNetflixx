import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FilaCatalogo } from "../components/FilaCatalogo";
import { PeliTarjeta } from "../components/PeliTarjeta";
import { Icono } from "../components/Icono";
import { useMiLista } from "../context/hooks";
import { fechaCorta, medioDe } from "../utils/formato";
import { Peliculas } from "./Peliculas";
import { Populares } from "./Populares";
import { Series } from "./Series";
import { Tendencias } from "./Tendencias";
import { FILAS } from "./filas";

const FILAS_POR_DEFECTO = [
  "accion",
  "comedia",
  "ciencia-ficcion",
  "series-crimen",
  "animacion",
  "documentales",
  "terror",
  "series-fantasia",
];

export const Hero = () => {
  const { total } = useMiLista();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="bg-fondo text-white">
      <div className="mx-auto w-full max-w-[1800px] px-4 pb-16 md:px-12">
        <Populares />
        <Tendencias />
        <Peliculas />
        <Series />
        {FILAS_POR_DEFECTO.map((id) => (
          <FilaExtra key={id} id={id} />
        ))}
      </div>

      {total > 0 ? <FilaMiLista /> : <InvitacionMiLista />}
    </div>
  );
};

const FilaExtra = ({ id }: { id: string }) => {
  const definicion = FILAS.find((fila) => fila.id === id);
  if (!definicion) return null;
  return <FilaCatalogo definicion={definicion} />;
};

const FilaMiLista = () => {
  const { items } = useMiLista();

  if (items.length === 0) return null;

  return (
    <section className="py-8">
      <header className="mb-3 flex items-end justify-between gap-4 px-4 md:px-12">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight sm:text-xl">
            <Icono nombre="lista" className="text-primario" />
            Mi lista
          </h2>
          <p className="mt-0.5 text-xs text-white/50">
            {items.length} título{items.length === 1 ? "" : "s"} guardado
            {items.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          to="/mi-lista"
          className="shrink-0 text-xs font-semibold text-primario hover:underline">
          Ver todo
        </Link>
      </header>

      <div className="flex gap-4 overflow-x-auto px-4 pb-2 sin-barra md:px-12">
        {items.slice(0, 14).map((item) => (
          <div key={item.clave} className="w-40 shrink-0 sm:w-44">
            <PeliTarjeta
              medio={medioDe(item.media)}
              titulo={item.media}
              subtitulo={`Añadido el ${fechaCorta(new Date(item.addedAt).toISOString())}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

const InvitacionMiLista = () => (
  <section className="border-t border-white/10 bg-black/30 px-4 py-14 text-center md:px-12">
    <Icono nombre="lista" className="mx-auto text-4xl text-white/20" />
    <h2 className="mt-3 text-xl font-bold">
      Guarda lo que quieras ver después
    </h2>
    <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
      Pulsa el botón{" "}
      <span className="inline-flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5 align-middle text-white">
        <Icono nombre="mas" className="text-xs" />
      </span>{" "}
      en cualquier título y aparecerá aquí, en tu lista personal.
    </p>
    <Link
      to="/mi-lista"
      className="mt-5 inline-flex items-center gap-2 rounded-md bg-white/15 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/25">
      Ver mi lista
      <Icono nombre="chevron-der" className="text-xs" />
    </Link>
  </section>
);

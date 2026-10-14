import { BotonEnlace } from "../components/Boton";
import { Icono } from "../components/Icono";

export const NoEncontrado = () => (
  <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
    <Icono nombre="alerta" relleno className="text-5xl text-primario" />
    <p className="mt-4 text-6xl font-extrabold tracking-tight text-white/10">
      404
    </p>
    <h1 className="mt-2 text-xl font-bold">Esta página no existe</h1>
    <p className="mt-2 max-w-md text-sm text-white/60">
      El enlace puede estar roto o el título que buscabas ya no está disponible.
    </p>

    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <BotonEnlace to="/">Volver al inicio</BotonEnlace>
      <BotonEnlace to="/buscar" variante="secundario">
        <Icono nombre="lupa" />
        Buscar en el catálogo
      </BotonEnlace>
    </div>
  </div>
);

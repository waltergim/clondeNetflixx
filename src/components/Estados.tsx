import type { HTMLAttributes, ReactNode } from "react";
import { Boton } from "./Boton";
import { Icono } from "./Icono";

/** Skeletons, estado de error y estado vacío. */

/* ------------------------------------------------------------------ */
/* Cargando                                                           */
/* ------------------------------------------------------------------ */

export const EsqueletoBloque = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    aria-hidden
    className={`animate-pulse rounded-lg bg-white/10 ${className}`}
    {...props}
  />
);

/** Fila de tarjetas fantasma mientras llegan los datos. */
export const EsqueletoFila = ({ cantidad = 6 }: { cantidad?: number }) => (
  <section className="px-4 md:px-12">
    <EsqueletoBloque className="mb-4 h-6 w-56" />
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: cantidad }, (_, i) => (
        <EsqueletoBloque key={i} className="aspect-[2/3] w-40 shrink-0" />
      ))}
    </div>
  </section>
);

/** Banner del hero mientras se resuelve el título destacado. */
export const EsqueletoHero = () => (
  <div className="flex h-[70vh] min-h-[420px] items-end bg-superficie">
    <div className="w-full px-4 pb-20 md:px-12">
      <EsqueletoBloque className="mb-4 h-10 w-2/3 max-w-xl" />
      <EsqueletoBloque className="mb-6 h-4 w-full max-w-2xl" />
      <div className="flex gap-3">
        <EsqueletoBloque className="h-11 w-40" />
        <EsqueletoBloque className="h-11 w-40" />
      </div>
    </div>
  </div>
);

/** Rejilla fantasma para páginas de listado (búsqueda / mi lista). */
export const EsqueletoRejilla = ({ cantidad = 18 }: { cantidad?: number }) => (
  <div className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 md:px-12">
    {Array.from({ length: cantidad }, (_, i) => (
      <EsqueletoBloque key={i} className="aspect-[2/3] w-full" />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Error                                                              */
/* ------------------------------------------------------------------ */

interface ErrorEstadoProps {
  titulo?: string;
  mensaje: string;
  onReintentar?: () => void;
  className?: string;
}

export const ErrorEstado = ({
  titulo = "Algo ha ido mal",
  mensaje,
  onReintentar,
  className = "",
}: ErrorEstadoProps) => (
  <div
    role="alert"
    className={`flex flex-col items-center justify-center gap-3 px-6 py-16 text-center ${className}`}>
    <Icono nombre="alerta" relleno className="text-4xl text-primario" />
    <h2 className="text-lg font-semibold">{titulo}</h2>
    <p className="max-w-md text-sm text-white/60">{mensaje}</p>
    {onReintentar ? (
      <Boton variante="secundario" className="mt-2" onClick={onReintentar}>
        Reintentar
      </Boton>
    ) : null}
  </div>
);

/* ------------------------------------------------------------------ */
/* Vacío                                                              */
/* ------------------------------------------------------------------ */

interface VacioProps {
  titulo: string;
  mensaje?: string;
  icono?: "lista" | "lupa" | "usuario" | "info" | "alerta" | "filtro";
  accion?: ReactNode;
  className?: string;
}

export const Vacio = ({
  titulo,
  mensaje,
  icono = "info",
  accion,
  className = "",
}: VacioProps) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 px-6 py-20 text-center ${className}`}>
    <Icono nombre={icono} className="text-5xl text-white/25" />
    <h2 className="text-lg font-semibold">{titulo}</h2>
    {mensaje ? <p className="max-w-md text-sm text-white/60">{mensaje}</p> : null}
    {accion ? <div className="mt-2">{accion}</div> : null}
  </div>
);

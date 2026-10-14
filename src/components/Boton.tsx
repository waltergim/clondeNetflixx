import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

/** Botón con las variantes de la interfaz y soporte de enlace. */

export type VarianteBoton = "primario" | "secundario" | "fantasma" | "peligro";

const VARIANTES: Record<VarianteBoton, string> = {
  primario:
    "bg-primario text-white hover:bg-primario-fuerte focus-visible:outline-primario",
  secundario:
    "bg-white/15 text-white backdrop-blur hover:bg-white/25 focus-visible:outline-white",
  fantasma:
    "bg-transparent text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-white",
  peligro: "bg-red-600/90 text-white hover:bg-red-500 focus-visible:outline-red-400",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold " +
  "transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

interface Comunes {
  variante?: VarianteBoton;
  tamano?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}

const TAMANOS = {
  sm: "px-3 py-1.5 text-xs",
  md: "",
  lg: "px-7 py-3 text-base",
};

export const Boton = ({
  variante = "primario",
  tamano = "md",
  className = "",
  children,
  ...props
}: Comunes & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    className={`${BASE} ${TAMANOS[tamano]} ${VARIANTES[variante]} ${className}`}
    {...props}>
    {children}
  </button>
);

interface Enlace extends Comunes {
  to: string;
}

export const BotonEnlace = ({
  variante = "primario",
  tamano = "md",
  className = "",
  children,
  to,
}: Enlace) => (
  <Link
    to={to}
    className={`${BASE} ${TAMANOS[tamano]} ${VARIANTES[variante]} ${className}`}>
    {children}
  </Link>
);

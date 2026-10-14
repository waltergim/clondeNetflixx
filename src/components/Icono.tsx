import type { SVGProps } from "react";

/**
 * Set de iconos en línea para no depender de una librería externa.
 * Todos son `stroke: currentColor` sobre un lienzo de 24x24.
 */

export type NombreIcono =
  | "lupa"
  | "cerrar"
  | "play"
  | "pausa"
  | "mas"
  | "check"
  | "chevron-izq"
  | "chevron-der"
  | "chevron-abajo"
  | "info"
  | "estrella"
  | "lapiz"
  | "basura"
  | "usuario"
  | "lista"
  | "volver"
  | "volver-inicio"
  | "filtro"
  | "alerta"
  | "puntos";

const trazos: Record<NombreIcono, string> = {
  lupa: "M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z",
  cerrar: "M6 6l12 12M18 6L6 18",
  play: "M8 5.5v13l11-6.5-11-6.5Z",
  pausa: "M9.5 5.5v13M14.5 5.5v13",
  mas: "M12 5v14M5 12h14",
  check: "M4.5 12.5l5 5 10-11",
  "chevron-izq": "M15 5l-7 7 7 7",
  "chevron-der": "M9 5l7 7-7 7",
  "chevron-abajo": "M5 9l7 7 7-7",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 7.75h.01",
  estrella: "M12 3.5l2.7 5.5 6 .9-4.35 4.25L17.4 20 12 17.2 6.6 20l1.05-5.85L3.3 9.9l6-.9L12 3.5Z",
  lapiz: "M4 20h4l10.5-10.5a2.12 2.12 0 0 0-3-3L5 17v3ZM14.5 6.5l3 3",
  basura:
    "M4 7h16M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7M6.5 7l.8 12A2 2 0 0 0 9.3 21h5.4a2 2 0 0 0 2-2l.8-12M10 11v6M14 11v6",
  usuario: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0",
  lista: "M4 6.5h11M4 12h11M4 17.5h7M18.5 15.5v6M15.5 18.5h6",
  volver: "M20 12H4.5M10.5 6l-6 6 6 6",
  "volver-inicio": "M4 11.5L12 4.5l8 7M6.5 10v9.5h11V10",
  filtro: "M4 6h16M7 12h10M10 18h4",
  alerta: "M12 8.5V13m0 3h.01M10.3 4.2 2.9 17.5A2 2 0 0 0 4.6 20.5h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z",
  puntos: "M6 12h.01M12 12h.01M18 12h.01",
};

interface Propiedades extends Omit<SVGProps<SVGSVGElement>, "name"> {
  nombre: NombreIcono;
  /** Los iconos "play", "info" y "alerta" se rellenan, el resto va con trazo. */
  relleno?: boolean;
  titulo?: string;
}

export const Icono = ({ nombre, relleno, titulo, ...props }: Propiedades) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-hidden={titulo ? undefined : true}
    role={titulo ? "img" : undefined}
    fill={relleno ? "currentColor" : "none"}
    stroke={relleno ? "none" : "currentColor"}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}>
    {titulo ? <title>{titulo}</title> : null}
    <path d={trazos[nombre]} />
  </svg>
);

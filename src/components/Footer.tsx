import { Link } from "react-router-dom";
import { RUTAS } from "../utils/rutas";

/** Pie de página con aviso legal y aviso de que los datos vienen de TMDB. */

/** Calculado una vez: evita renderizados impuros en cadamontaje. */
const ANIO = new Date().getFullYear();

const COLUMNAS = [
  {
    titulo: "Explorar",
    enlaces: [
      { texto: "Inicio", to: RUTAS.inicio },
      { texto: "Películas", to: "/peliculas" },
      { texto: "Series", to: "/series" },
      { texto: "Mi lista", to: RUTAS.miLista },
    ],
  },
  {
    titulo: "Cuenta",
    enlaces: [
      { texto: "Perfiles", to: RUTAS.perfiles },
      { texto: "Buscar", to: RUTAS.buscar },
    ],
  },
] as const;

export const Footer = () => (
  <footer className="mt-16 border-t border-white/10 bg-black/40 px-4 py-10 text-sm text-white/50 md:px-12">
    <div className="mx-auto max-w-[1800px]">
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        <div className="max-w-sm">
          <p className="text-lg font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-primario to-acento bg-clip-text text-transparent">
              Clon
            </span>
            video
          </p>
          <p className="mt-2 text-xs leading-relaxed">
            Proyecto de práctica. Las fichas, imágenes y trailers proceden de{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noreferrer"
              className="text-primario underline-offset-2 hover:underline">
              TMDB
            </a>
            . Sin ánimo de lucro y sin afiliación con Prime Video.
          </p>
        </div>

        {COLUMNAS.map((columna) => (
          <nav key={columna.titulo} aria-label={columna.titulo}>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-white/80">
              {columna.titulo}
            </h2>
            <ul className="mt-3 space-y-2">
              {columna.enlaces.map((enlace) => (
                <li key={enlace.to}>
                  <Link
                    to={enlace.to}
                    className="transition-colors hover:text-primario">
                    {enlace.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <p className="mt-8 border-t border-white/5 pt-6 text-xs text-white/35">
        © {ANIO} Clonvideo. Hecho con React, TypeScript y Tailwind.
      </p>
    </div>
  </footer>
);

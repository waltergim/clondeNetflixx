import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Icono } from "../components/Icono";
import { useMiLista, usePerfil } from "../context/hooks";
import { useDebounce, useScroll } from "../hooks/useDebounce";
import { RUTAS, rutaBusqueda } from "../utils/rutas";
import type { Perfil } from "../types";

const ENLACES = [
  { to: RUTAS.inicio, texto: "Inicio" },
  { to: "/peliculas", texto: "Películas" },
  { to: "/series", texto: "Series" },
  { to: RUTAS.miLista, texto: "Mi lista" },
] as const;

export const Navbar = () => {
  const location = useLocation();
  const { perfiles, perfilActivo, seleccionarPerfil } = usePerfil();
  const { total } = useMiLista();
  const desplazado = useScroll(20);

  const enInicio = location.pathname === RUTAS.inicio;
  const opaca = desplazado || !enInicio;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        opaca
          ? "border-b border-white/10 bg-fondo/95 backdrop-blur"
          : "bg-gradient-to-b from-black/85 via-black/40 to-transparent"
      }`}>
      <div className="mx-auto flex max-w-[1800px] items-center gap-3 px-4 py-3 md:gap-6 md:px-12">
        <Link to={RUTAS.inicio} className="flex shrink-0 items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {ENLACES.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              end={enlace.to === RUTAS.inicio}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }>
              {enlace.texto}
              {enlace.to === RUTAS.miLista && total > 0 ? (
                <span className="ml-1.5 rounded bg-primario px-1.5 py-0.5 text-[10px] font-bold">
                  {total}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          <Buscador />

          <Link
            to={RUTAS.miLista}
            aria-label="Mi lista"
            title="Mi lista"
            className="hidden h-10 w-10 place-items-center rounded-full text-lg transition-colors hover:bg-white/10 sm:grid">
            <Icono nombre="lista" />
          </Link>

          <MenuPerfil
            perfiles={perfiles}
            activo={perfilActivo}
            onSeleccionar={seleccionarPerfil}
          />

          <MenuMovil />
        </div>
      </div>
    </header>
  );
};

const Logo = () => (
  <span className="flex items-baseline gap-0.5 text-xl font-extrabold tracking-tight">
    <span className="bg-gradient-to-r from-primario to-acento bg-clip-text text-transparent">
      Clon
    </span>
    <span className="text-white">video</span>
  </span>
);

const Buscador = () => {
  const navegar = useNavigate();
  const location = useLocation();
  const [parametros] = useSearchParams();

  const enBusqueda = location.pathname === RUTAS.buscar;
  const consultaUrl = parametros.get("q") ?? "";

  const [texto, setTexto] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [urlVista, setUrlVista] = useState(consultaUrl);
  const input = useRef<HTMLInputElement>(null);

  const diferido = useDebounce(texto, 400);

  if (enBusqueda && consultaUrl !== urlVista) {
    setUrlVista(consultaUrl);
    setTexto(consultaUrl);
  }

  useEffect(() => {
    if (!abierto || !enBusqueda) return;
    const limpio = diferido.trim();

    if (limpio === consultaUrl) return;
    navegar(
      limpio ? `${RUTAS.buscar}?q=${encodeURIComponent(limpio)}` : RUTAS.buscar,
      {
        replace: true,
      },
    );
  }, [abierto, enBusqueda, diferido, consultaUrl, navegar]);

  const enviar = (evento: React.FormEvent) => {
    evento.preventDefault();
    const limpio = texto.trim();
    if (limpio) navegar(rutaBusqueda(limpio));
  };

  const limpiar = () => {
    setTexto("");
    input.current?.focus();
    if (enBusqueda) navegar(RUTAS.buscar, { replace: true });
  };

  return (
    <form onSubmit={enviar} role="search" className="flex items-center">
      <div
        className={`flex items-center overflow-hidden rounded-full bg-black/40 transition-all duration-300 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-primario ${
          abierto ? "w-44 px-3 sm:w-56" : "w-10"
        }`}>
        <button
          type={abierto ? "submit" : "button"}
          aria-label={abierto ? "Buscar" : "Abrir buscador"}
          onClick={() => {
            setAbierto((v) => !v);
            if (!abierto) requestAnimationFrame(() => input.current?.focus());
          }}
          className="grid h-10 w-10 shrink-0 place-items-center text-lg transition-colors hover:text-primario">
          <Icono nombre="lupa" />
        </button>

        {abierto ? (
          <>
            <input
              ref={input}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setAbierto(false)}
              type="search"
              placeholder="Películas, series, personas…"
              aria-label="Buscar en el catálogo"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {texto ? (
              <button
                type="button"
                onClick={limpiar}
                aria-label="Borrar búsqueda"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                <Icono nombre="cerrar" className="text-sm" />
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </form>
  );
};

const MenuPerfil = ({
  perfiles,
  activo,
  onSeleccionar,
}: {
  perfiles: Perfil[];
  activo: Perfil | null;
  onSeleccionar: (id: string) => void;
}) => {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;

    const alClicarFuera = (evento: MouseEvent) => {
      if (!caja.current?.contains(evento.target as Node)) setAbierto(false);
    };
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAbierto(false);
    };

    document.addEventListener("mousedown", alClicarFuera);
    document.addEventListener("keydown", alPulsar);
    return () => {
      document.removeEventListener("mousedown", alClicarFuera);
      document.removeEventListener("keydown", alPulsar);
    };
  }, [abierto]);

  const iniciales = (nombre: string) =>
    nombre.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="relative" ref={caja}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-label="Menú de perfil"
        className="flex items-center gap-1.5 rounded-md p-1 transition-colors hover:bg-white/10">
        <Avatar
          nombre={activo?.nombre ?? "?"}
          color={activo?.color ?? "#263248"}
        />
        <Icono
          nombre="chevron-abajo"
          className="hidden text-xs text-white/70 sm:block"
        />
      </button>

      {abierto ? (
        <div
          role="menu"
          className="absolute right-0 top-12 w-60 overflow-hidden rounded-lg border border-white/10 bg-superficie shadow-2xl">
          <p className="border-b border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/50">
            Cambiar de perfil
          </p>

          <ul className="max-h-64 overflow-y-auto py-1">
            {perfiles.map((perfil) => (
              <li key={perfil.id}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onSeleccionar(perfil.id);
                    setAbierto(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/10">
                  <Avatar
                    nombre={perfil.nombre}
                    color={perfil.color}
                    avatar={perfil.avatar}
                    inicial={iniciales(perfil.nombre)}
                  />
                  <span className="flex-1 truncate">{perfil.nombre}</span>
                  {perfil.id === activo?.id ? (
                    <Icono nombre="check" className="text-sm text-primario" />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>

          <Link
            to={RUTAS.perfiles}
            role="menuitem"
            onClick={() => setAbierto(false)}
            className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-sm transition-colors hover:bg-white/10">
            <Icono nombre="usuario" className="text-base text-white/70" />
            Administrar perfiles
          </Link>
        </div>
      ) : null}
    </div>
  );
};

const Avatar = ({
  nombre,
  color,
  avatar,
  inicial,
}: {
  nombre: string;
  color: string;
  avatar?: string;
  inicial?: string;
}) => (
  <span
    aria-hidden
    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold text-white"
    style={{ backgroundColor: color }}>
    {avatar ?? inicial ?? nombre.charAt(0).toUpperCase()}
  </span>
);

/* ------------------------------------------------------------------ */
/* Menú móvil                                                         */
/* ------------------------------------------------------------------ */

const MenuMovil = () => {
  const [abierto, setAbierto] = useState(false);
  const { total } = useMiLista();

  useEffect(() => {
    if (!abierto) return;
    const cerrar = () => setAbierto(false);
    window.addEventListener("click", cerrar);
    return () => window.removeEventListener("click", cerrar);
  }, [abierto]);

  return (
    <div className="md:hidden" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-label="Menú"
        aria-expanded={abierto}
        className="grid h-10 w-10 place-items-center rounded-md text-xl transition-colors hover:bg-white/10">
        <Icono nombre={abierto ? "cerrar" : "filtro"} />
      </button>

      {abierto ? (
        <nav className="absolute inset-x-0 top-16 border-b border-white/10 bg-fondo/98 px-4 py-2 backdrop-blur">
          {ENLACES.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              end={enlace.to === RUTAS.inicio}
              onClick={() => setAbierto(false)}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/10"
                }`
              }>
              {enlace.texto}
              {enlace.to === RUTAS.miLista && total > 0 ? (
                <span className="rounded bg-primario px-1.5 py-0.5 text-[10px] font-bold">
                  {total}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </div>
  );
};

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icono } from "./Icono";

/**
 * Modal accesible: cierra con Escape o clic en el fondo, bloquea el scroll del
 * body y devuelve el foco al elemento que lo abrió.
 */

interface PropiedadesModal {
  abierto: boolean;
  onCerrar: () => void;
  titulo?: string;
  children: ReactNode;
  /** `ancho` controla la caja en pantallas grandes. */
  ancho?: "md" | "lg" | "xl";
  /** Oculta el encabezado cuando el contenido ya aporta su propio título. */
  sinEncabezado?: boolean;
}

const ANCHOS = {
  md: "max-w-lg",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
} as const;

export const Modal = ({
  abierto,
  onCerrar,
  titulo,
  children,
  ancho = "lg",
  sinEncabezado = false,
}: PropiedadesModal) => {
  const caja = useRef<HTMLDivElement>(null);
  const devolverFoco = useRef<HTMLElement | null>(null);

  const alPulsarTecla = useCallback(
    (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        onCerrar();
        return;
      }

      // Cycle trap básico: Tab no debe salir de la caja del modal.
      if (evento.key !== "Tab" || !caja.current) return;

      const focusables = caja.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusables.length === 0) return;

      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    },
    [onCerrar],
  );

  useEffect(() => {
    if (!abierto) return;

    devolverFoco.current = document.activeElement as HTMLElement | null;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", alPulsarTecla);

    // Damos el foco al contenido al abrir.
    const id = requestAnimationFrame(() => caja.current?.focus());

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", alPulsarTecla);
      cancelAnimationFrame(id);
      devolverFoco.current?.focus?.();
    };
  }, [abierto, alPulsarTecla]);

  if (!abierto) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-sm"
      />

      <div
        ref={caja}
        tabIndex={-1}
        className={`relative z-10 max-h-[92vh] w-full ${ANCHOS[ancho]} overflow-y-auto rounded-xl bg-superficie shadow-2xl ring-1 ring-white/10 outline-none`}>
        {!sinEncabezado ? (
          <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
            <h2 className="text-base font-semibold">{titulo}</h2>
            <button
              type="button"
              onClick={onCerrar}
              aria-label="Cerrar"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20">
              <Icono nombre="cerrar" />
            </button>
          </header>
        ) : null}

        {children}
      </div>
    </div>,
    document.body,
  );
};

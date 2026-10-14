import type { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

/**
 * Carrusel horizontal reutilizable. Todas las filas de la home y las
 * rejillas horizontales de detalles usan este componente.
 */

type Puntos = number;

interface PropiedadesCarrusel {
  titulo?: string;
  subtitulo?: string;
  /** Acciones a la derecha del encabezado (p. ej. "Ver todo"). */
  acciones?: ReactNode;
  children: ReactNode;
  /** Cantidad de tarjetas visibles por página en pantallas grandes. */
  porPagina?: number;
  className?: string;
  /** Contenido a mostrar si la fila viene vacía. */
  vacio?: ReactNode;
  total?: number;
}

const claseFila = "carrusel-flechas pb-2";

export const Carrusel = ({
  titulo,
  subtitulo,
  acciones,
  children,
  porPagina = 6,
  className = "",
  vacio = null,
  total = 0,
}: PropiedadesCarrusel) => {
  const hayContenido = Array.isArray(children) ? children.length > 0 : Boolean(children);

  if (!hayContenido) {
    return vacio ? <section className={className}>{vacio}</section> : null;
  }

  return (
    <section className={className} aria-labelledby={titulo ? `fila-${normaliza(titulo)}` : undefined}>
      {titulo ? (
        <header className="mb-3 flex items-end justify-between gap-4 px-4 md:px-12">
          <div>
            <h2
              id={`fila-${normaliza(titulo)}`}
              className="text-lg font-bold tracking-tight sm:text-xl">
              {titulo}
            </h2>
            {subtitulo ? (
              <p className="mt-0.5 text-xs text-white/50">{subtitulo}</p>
            ) : null}
          </div>
          {acciones ? <div className="shrink-0">{acciones}</div> : null}
        </header>
      ) : null}

      <Swiper
        modules={[Navigation, Keyboard, A11y]}
        navigation
        keyboard={{ enabled: true }}
        slidesPerView={1.4}
        spaceBetween={12}
        speed={320}
        grabCursor
        watchOverflow
        breakpoints={{
          480: { slidesPerView: 2.5, spaceBetween: 14 },
          640: { slidesPerView: 3.5, spaceBetween: 16 },
          768: { slidesPerView: porPaginaDe(porPagina, 3.5), spaceBetween: 16 },
          1024: { slidesPerView: porPaginaDe(porPagina, 5.5), spaceBetween: 18 },
          1280: { slidesPerView: porPaginaDe(porPagina, 6.5), spaceBetween: 20 },
          1536: { slidesPerView: porPagina, spaceBetween: 22 },
        }}
        className={claseFila}>
        {Array.isArray(children)
          ? (children as ReactNode[]).map((hijo, i) => (
              <SwiperSlide key={i}>{hijo}</SwiperSlide>
            ))
          : <SwiperSlide>{children}</SwiperSlide>}
      </Swiper>

      {total > 0 ? (
        <span className="sr-only">{total} títulos en esta fila</span>
      ) : null}
    </section>
  );
};

/** "Top 10 en España" → "top-10-en-espana" para el id del encabezado. */
const normaliza = (texto: string): string =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const porPaginaDe = (valor: Puntos, minimo: number): number =>
  Math.max(minimo, valor - 0.5);

import type { FilaCatalogo } from "../types";

 

export const FILAS: FilaCatalogo[] = [
  {
    id: "tendencias-dia",
    titulo: "Populares hoy",
    subtitulo: "Lo más visto en las últimas 24 horas",
    tipo: "Mixto",
    medio: "all",
    ventana: "day",
  },
  {
    id: "top-peliculas",
    titulo: "Top 10 películas hoy",
    tipo: "Pelicula",
    medio: "movie",
    ventana: "day",
  },
  {
    id: "top-series",
    titulo: "Top 10 series hoy",
    tipo: "Serie",
    medio: "tv",
    ventana: "day",
  },
  {
    id: "peliculas-populares",
    titulo: "Películas más populares",
    tipo: "Pelicula",
    medio: "movie",
  },
  {
    id: "series-populares",
    titulo: "Series más populares",
    tipo: "Serie",
    medio: "tv",
  },
  {
    id: "accion",
    titulo: "Acción y aventura",
    tipo: "Pelicula",
    medio: "movie",
    conGenero: 28,
  },
  {
    id: "comedia",
    titulo: "Comedias para ver hoy",
    tipo: "Pelicula",
    medio: "movie",
    conGenero: 35,
  },
  {
    id: "ciencia-ficcion",
    titulo: "Ciencia ficción",
    tipo: "Pelicula",
    medio: "movie",
    conGenero: 878,
  },
  {
    id: "terror",
    titulo: "Noche de terror",
    tipo: "Pelicula",
    medio: "movie",
    conGenero: 27,
  },
  {
    id: "animacion",
    titulo: "Animación y familia",
    tipo: "Pelicula",
    medio: "movie",
    conGenero: 16,
  },
  {
    id: "documentales",
    titulo: "Documentales",
    tipo: "Pelicula",
    medio: "movie",
    conGenero: 99,
  },
  {
    id: "series-crimen",
    titulo: "Series de crimen",
    tipo: "Serie",
    medio: "tv",
    conGenero: 80,
  },
  {
    id: "series-fantasia",
    titulo: "Mundo de fantasía",
    tipo: "Serie",
    medio: "tv",
    conGenero: 10765,
  },
];

export const buscarFila = (id: string): FilaCatalogo | undefined =>
  FILAS.find((fila) => fila.id === id);

/** Índice de las primeras filas, que se numeran como "Top 10". */
export const FILAS_NUMERADAS = new Set(["top-peliculas", "top-series"]);

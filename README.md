# Clonvideo

Clon de Prime Video / Netflix construido con **React 19**, **TypeScript**, **Vite** y **Tailwind CSS v4**.
Los datos (fichas, imágenes, géneros y trailers) provienen de la API de [TMDB](https://www.themoviedb.org/).

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # y rellena VITE_TMDB_API_KEY
npm run dev
```

La clave se obtiene gratis en <https://www.themoviedb.org/settings/api>. **No subas tu clave al repositorio**:
`.env.local` está en `.gitignore`.

| Script          | Qué hace                                  |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Servidor de desarrollo con HMR            |
| `npm run build` | Comprobación de tipos + build de producción |
| `npm run lint`  | Análisis estático con Oxlint             |
| `npm run preview` | Sirve el build de `dist/`              |

## Variables de entorno

| Variable                 | Obligatoria | Descripción                          |
| ------------------------ | ----------- | ------------------------------------ |
| `VITE_TMDB_API_KEY`      | Sí          | Clave de la API v3 de TMDB           |
| `VITE_TMDB_API_TOKEN`    | No          | Token de lectura v4 (alternativa)    |
| `VITE_TMDB_LANGUAGE`     | No          | Idioma de las respuestas (`es-ES`)   |
| `VITE_TMDB_IMAGE_BASE`   | No          | Base de las imágenes de TMDB         |

## Funcionalidades

- **Home** con banner rotativo de los títulos más populares y 13 carruseles por género.
- **Detalle** de películas y series: sinopsis, puntuación, reparto, btn de Mi lista y reproductor de tráiler.
- **Búsqueda** en vivo con debounce, pelado por tipo/año/género y orden por popularidad, puntuación o fecha.
- **Explorar** con paginación, filtros de género y orden.
- **Mi lista** independiente por perfil.
- **Perfiles** con altas, renombrado, cambio de color, avatar por inicial y borrado.
- Estados de carga, error y vacío en todas las vistas, con reintento manual.

## Arquitectura

```
src/
├── api/          Capa de datos: cliente HTTP con caché, endpoints y configuración
│   ├── client.ts     Petición GET tipada: caché TTL, deduplicación, cancelación y errores
│   ├── TmdbApi.ts    Endpoints con nombre (tendencias, descubrir, detalle, similares...)
│   └── config.ts     Clave, idioma, base de URLs y catálogos de géneros
├── components/   Piezas reutilizables (carrusel, tarjeta, modal, botones, iconos, estados)
├── context/      Contextos de perfiles y Mi lista, con persistencia en localStorage
├── Detalles/     Banner de la home, ficha, similares y reproductor
├── Inicio/       Navbar, hero, definición de filas y sus carruseles
├── Buscador/     Campo de búsqueda y rejilla de resultados
├── pages/        Inicio, Explorar, Mi lista y 404
├── perfiles/     Selector y gestión de perfiles
├── hooks/        useApi (fetching), useDebounce y useScroll
├── types/        Tipos de TMDB y tipos de dominio
└── utils/        Formato (fechas, duraciones, urls), rutas y acceso a localStorage
```

### Decisiones de diseño

- **Ninguna vista hace `fetch` directamente.** Todo pasa por `api/client.ts`, que centraliza la caché en
  memoria, la deduplicación de peticiones simultáneas, la cancelación con `AbortController` y la traducción de
  errores a mensajes en español.
- **`useApi` encapsula el ciclo de vida.** Recibe un *fetcher* y sus dependencias, y expone
  `data` / `loading` / `error` / `reload`. `reload()` propaga un flag `forzar` que salta la caché, de modo que
  el botón "reintentar" siempre trae datos frescos.
- **Rutas perezosas.** Cada página se carga bajo demanda (`React.lazy` + `Suspense`), así el *bundle* inicial
  no incluye el detalle ni el buscador.
- **Las filas del home son datos, no componentes.** `Inicio/filas.ts` es una lista de definiciones y
  `FilaCatalogo` las resuelve contra la API. Añadir un carrusel nuevo es escribir una entrada en ese array.
- **React Compiler** está activo vía `oxc-transform-react` en `vite.config.ts`.
- **TMDB exige atribución**, por eso el pie de página enlaza a su sitio.

## Notas

- Proyecto de práctica. No reproduce contenido de vídeo: solo usa las metadatos y los tráileres oficiales
  publicados por TMDB.
- Sin persistencia en servidor: perfiles y Mi lista viven en `localStorage`."# clondeNetflixx" 

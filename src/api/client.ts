import {
  ACCESS_TOKEN,
  API_KEY,
  CACHE_TTL_MS,
  LANGUAGE,
  TMDB_BASE_URL,
} from "./config";

 

export type ParamValor = string | number | boolean | undefined | null;

export interface OpcionesPeticion {
  params?: Record<string, ParamValor>;
  signal?: AbortSignal;
 
  forzar?: boolean;
  
  ttl?: number;
  
  language?: string;
}

export class ErrorTmdb extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ErrorTmdb";
    this.status = status;
  }
}

const esErrorAbort = (error: unknown): boolean =>
  error instanceof DOMException && error.name === "AbortError";

interface EntradaCache<T> {
  valor: T;
  expira: number;
}

const cache = new Map<string, EntradaCache<unknown>>();
const enCurso = new Map<string, Promise<unknown>>();

export const limpiarCache = (): void => {
  cache.clear();
};

const construirUrl = (ruta: string, params: OpcionesPeticion["params"], language: string): string => {
  const url = new URL(`${TMDB_BASE_URL}${ruta}`);

  url.searchParams.set("language", language);

  for (const [clave, valor] of Object.entries(params ?? {})) {
    if (valor === undefined || valor === null || valor === "") continue;
    url.searchParams.set(clave, String(valor));
  }

   if (API_KEY && !ACCESS_TOKEN) {
    url.searchParams.set("api_key", API_KEY);
  }

  return url.toString();
};

const headersPeticion = (): HeadersInit => {
  if (ACCESS_TOKEN) {
    return {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      accept: "application/json",
    };
  }
  return { accept: "application/json" };
};

 const ejecutar = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
  if (!API_KEY && !ACCESS_TOKEN) {
    throw new ErrorTmdb(
      "Falta la clave de TMDB. Copia .env.example a .env.local y define VITE_TMDB_API_KEY.",
    );
  }

  let respuesta: Response;

  try {
    respuesta = await fetch(url, { headers: headersPeticion(), signal });
  } catch (error) {
    if (esErrorAbort(error)) throw error;
    throw new ErrorTmdb(
      "No se pudo conectar con TMDB. Revisa tu conexión a internet.",
    );
  }

  if (respuesta.status === 401) {
    throw new ErrorTmdb("La clave de TMDB no es válida.", 401);
  }

  if (respuesta.status === 404) {
    throw new ErrorTmdb("No encontramos ese contenido.", 404);
  }

  if (respuesta.status === 429) {
    throw new ErrorTmdb(
      "Demasiadas peticiones a TMDB. Espera unos segundos e inténtalo de nuevo.",
      429,
    );
  }

  if (!respuesta.ok) {
    throw new ErrorTmdb(
      `TMDB respondió con error ${respuesta.status}.`,
      respuesta.status,
    );
  }

  return (await respuesta.json()) as T;
};

 
export const pedir = async <T>(
  ruta: string,
  { params, signal, forzar = false, ttl = CACHE_TTL_MS, language = LANGUAGE }: OpcionesPeticion = {},
): Promise<T> => {
  const url = construirUrl(ruta, params, language);

  if (!forzar) {
    const guardado = cache.get(url) as EntradaCache<T> | undefined;
    if (guardado && guardado.expira > Date.now()) {
      return guardado.valor;
    }

    
    if (!signal) {
      const compartido = enCurso.get(url);
      if (compartido) return compartido as Promise<T>;
    }
  }

  const promesa = ejecutar<T>(url, signal);

  if (!signal) {
    enCurso.set(url, promesa as Promise<unknown>);
    promesa
      .then((valor) => {
        cache.set(url, { valor, expira: Date.now() + ttl });
      })
      .catch(() => undefined)
      .finally(() => {
        if (enCurso.get(url) === promesa) enCurso.delete(url);
      });
  }

  return promesa;
};

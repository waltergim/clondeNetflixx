import { useCallback, useEffect, useRef, useState } from "react";

 

export interface EstadoApi<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export interface OpcionesUseApi {
 
  enabled?: boolean;
}

 
export type FetcherApi<T> = (signal: AbortSignal, forzar: boolean) => Promise<T>;

 
export const mensajeError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Algo salió mal. Inténtalo de nuevo.";
};

export const useApi = <T>(
  fetcher: FetcherApi<T>,
  dependencias: readonly unknown[],
  { enabled = true }: OpcionesUseApi = {},
): EstadoApi<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  
  const refFetcher = useRef(fetcher);

  useEffect(() => {
    refFetcher.current = fetcher;
  });

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let vigente = true;

    setLoading(true);
    setError(null);

    
    refFetcher.current(controller.signal, intento > 0)
      .then((valor) => {
        if (!vigente) return;
        setData(valor);
        setLoading(false);
      })
      .catch((fallo: unknown) => {
        if (!vigente || controller.signal.aborted) return;
        setData(null);
        setError(mensajeError(fallo));
        setLoading(false);
      });

    return () => {
      vigente = false;
      controller.abort();
    };
 
  }, [enabled, intento, ...dependencias]);

  const reload = useCallback(() => setIntento((n) => n + 1), []);

  return { data, loading, error, reload };
};

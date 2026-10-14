import { useEffect, useRef, useState } from "react";

/** Retrasa la propagación de un valor para no disparar peticiones en cada tecla. */
export const useDebounce = <T>(valor: T, ms = 350): T => {
  const [diferido, setDiferido] = useState(valor);

  useEffect(() => {
    if (valor === diferido) return;
    const id = setTimeout(() => setDiferido(valor), ms);
    return () => clearTimeout(id);
  }, [valor, ms, diferido]);

  return diferido;
};

 export const useDebounceConEstado = <T>(
  valor: T,
  ms = 350,
): [T, boolean] => {
  const diferido = useDebounce(valor, ms);
  return [diferido, valor !== diferido];
};

 
export const useScroll = (umbral = 24): boolean => {
  const [paseado, setPaseado] = useState(false);
  const pendiente = useRef<number | undefined>(undefined);

  useEffect(() => {
    const alDesplazar = () => {
      if (pendiente.current) cancelAnimationFrame(pendiente.current);
      pendiente.current = requestAnimationFrame(() => {
        setPaseado(window.scrollY > umbral);
      });
    };

    window.addEventListener("scroll", alDesplazar, { passive: true });
    alDesplazar();

    return () => {
      window.removeEventListener("scroll", alDesplazar);
      if (pendiente.current) cancelAnimationFrame(pendiente.current);
    };
  }, [umbral]);

  return paseado;
};

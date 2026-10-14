import { FilaCatalogo } from "../components/FilaCatalogo";
import { buscarFila } from "./filas";

export const Tendencias = () => {
  const definicion = buscarFila("top-peliculas");

  if (!definicion) return null;
  return <FilaCatalogo definicion={definicion} numerada porPagina={6} />;
};

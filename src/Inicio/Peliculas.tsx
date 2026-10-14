import { FilaCatalogo } from "../components/FilaCatalogo";
import { buscarFila } from "./filas";

/** "Películas recomendadas": lo más popular entre películas. */
export const Peliculas = () => {
  const definicion = buscarFila("peliculas-populares");

  if (!definicion) return null;
  return <FilaCatalogo definicion={definicion} />;
};

import { FilaCatalogo } from "../components/FilaCatalogo";
import { buscarFila } from "./filas";

export const Series = () => {
  const definicion = buscarFila("series-populares");

  if (!definicion) return null;
  return <FilaCatalogo definicion={definicion} />;
};

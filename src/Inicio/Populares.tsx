import { FilaCatalogo } from "../components/FilaCatalogo";
import { buscarFila } from "./filas";

export const Populares = () => {
  const definicion = buscarFila("tendencias-dia");

  if (!definicion) return null;
  return <FilaCatalogo definicion={definicion} porPagina={7} />;
};

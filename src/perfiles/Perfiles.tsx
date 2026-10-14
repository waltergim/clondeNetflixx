import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useMiLista, usePerfil } from "../context/hooks";
import { Icono } from "../components/Icono";
import { MAX_PERFILES } from "../utils/almacen";
import { RUTAS } from "../utils/rutas";
import type { Perfil } from "../types";

const COLORES = [
  "#00a8e1",
  "#14b8a6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#22c55e",
];

export const Perfiles = () => {
  const navegar = useNavigate();
  const {
    perfiles,
    perfilActivo,
    primerUso,
    seleccionarPerfil,
    crearPerfil,
    renombrarPerfil,
    eliminarPerfil,
    colorSugerido,
  } = usePerfil();
  const { total: totalLista } = useMiLista();

  const [editando, setEditando] = useState<string | null>(null);
  const [creando, setCreando] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [colorNuevo, setColorNuevo] = useState(colorSugerido);

  const entrar = (id: string) => {
    seleccionarPerfil(id);
    navegar(RUTAS.inicio);
  };

  const confirmarNuevo = () => {
    const perfil = crearPerfil(nombreNuevo, colorNuevo);
    if (!perfil) return;

    setNombreNuevo("");
    setCreando(false);
    setEditando(perfil.id);
  };

  const alRenombrar = (id: string) => {
    const campo = document.getElementById(`nombre-${id}`);
    if (campo instanceof HTMLInputElement && campo.value.trim()) {
      renombrarPerfil(id, campo.value);
    }
    setEditando(null);
  };

  const lleno = perfiles.length >= MAX_PERFILES;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <h1 className="text-2xl font-extrabold sm:text-3xl">
        {primerUso ? "¿Quién va a ver?" : "Perfiles"}
      </h1>
      <p className="mt-2 text-center text-sm text-white/50">
        {primerUso
          ? "Cada perfil tiene su propia Mi lista."
          : "Elige un perfil para cambiar o edita los que ya existen."}
      </p>

      <ul className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {perfiles.map((perfil) => (
          <PerfilTarjeta
            key={perfil.id}
            perfil={perfil}
            activo={perfil.id === perfilActivo?.id}
            editando={editando === perfil.id}
            onEntrar={() => entrar(perfil.id)}
            onEditar={() => setEditando(perfil.id)}
            onCancelar={() => setEditando(null)}
            onGuardar={() => alRenombrar(perfil.id)}
            onEliminar={() => eliminarPerfil(perfil.id)}
            puedeEliminar={perfiles.length > 1}
          />
        ))}

        {creando ? (
          <FormularioPerfil
            nombre={nombreNuevo}
            color={colorNuevo}
            onNombre={setNombreNuevo}
            onColor={setColorNuevo}
            onCrear={confirmarNuevo}
            onCancelar={() => {
              setCreando(false);
              setNombreNuevo("");
            }}
          />
        ) : !lleno ? (
          <li>
            <button
              type="button"
              onClick={() => {
                setColorNuevo(colorSugerido());
                setCreando(true);
              }}
              className="flex w-full flex-col items-center gap-3">
              <span className="grid h-24 w-24 place-items-center rounded-lg bg-superficie text-white/40 ring-1 ring-dashed ring-white/20 transition hover:ring-primario hover:text-primario">
                <Icono nombre="mas" className="text-3xl" />
              </span>
              <span className="text-sm text-white/60">Añadir perfil</span>
            </button>
          </li>
        ) : null}
      </ul>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm">
        {primerUso && perfiles[0] ? (
          <button
            type="button"
            onClick={() => entrar(perfiles[0].id)}
            className="text-white/50 underline-offset-4 transition hover:text-primario hover:underline">
            Entrar como {perfiles[0].nombre}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navegar(RUTAS.inicio)}
            className="text-white/50 underline-offset-4 transition hover:text-primario hover:underline">
            Volver al inicio
          </button>
        )}

        {perfilActivo ? (
          <span className="text-white/30">
            {perfilActivo.nombre} · {totalLista} en Mi lista
          </span>
        ) : null}
      </div>
    </div>
  );
};

const FormularioPerfil = ({
  nombre,
  color,
  onNombre,
  onColor,
  onCrear,
  onCancelar,
}: {
  nombre: string;
  color: string;
  onNombre: (valor: string) => void;
  onColor: (valor: string) => void;
  onCrear: () => void;
  onCancelar: () => void;
}) => (
  <li className="flex flex-col items-center gap-2">
    <div
      className="grid h-24 w-24 place-items-center rounded-lg text-4xl font-bold text-white shadow-lg ring-2 ring-primario"
      style={{ backgroundColor: color }}>
      {nombre.trim().charAt(0).toUpperCase() || "+"}
    </div>

    <input
      autoFocus
      value={nombre}
      onChange={(e) => onNombre(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onCrear()}
      placeholder="Nombre del perfil"
      maxLength={20}
      aria-label="Nombre del nuevo perfil"
      className="w-32 rounded-md border border-white/15 bg-superficie px-3 py-2 text-center text-sm outline-none focus:border-primario"
    />

    <div className="flex gap-1.5">
      {COLORES.map((opcion) => (
        <button
          key={opcion}
          type="button"
          aria-label={`Elegir color ${opcion}`}
          aria-pressed={color === opcion}
          onClick={() => onColor(opcion)}
          style={{ backgroundColor: opcion }}
          className={`h-5 w-5 rounded-full transition ${
            color === opcion ? "scale-125 ring-2 ring-white" : ""
          }`}
        />
      ))}
    </div>

    <div className="flex gap-2">
      <button
        type="button"
        onClick={onCrear}
        disabled={!nombre.trim()}
        className="rounded-md bg-primario px-3 py-1.5 text-xs font-semibold transition hover:bg-primario-fuerte disabled:opacity-40">
        Crear
      </button>
      <button
        type="button"
        onClick={onCancelar}
        className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/20">
        Cancelar
      </button>
    </div>
  </li>
);

const PerfilTarjeta = ({
  perfil,
  activo,
  editando,
  onEntrar,
  onEditar,
  onCancelar,
  onGuardar,
  onEliminar,
  puedeEliminar,
}: {
  perfil: Perfil;
  activo: boolean;
  editando: boolean;
  onEntrar: () => void;
  onEditar: () => void;
  onCancelar: () => void;
  onGuardar: () => void;
  onEliminar: () => void;
  puedeEliminar: boolean;
}) => {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <li className="flex flex-col items-center gap-3 text-center">
      <span className="text-sm font-semibold">
        {editando ? (
          <input
            id={`nombre-${perfil.id}`}
            autoFocus
            defaultValue={perfil.nombre}
            maxLength={20}
            aria-label={`Nombre de ${perfil.nombre}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") onGuardar();
              if (e.key === "Escape") onCancelar();
            }}
            onBlur={onGuardar}
            className="w-32 rounded-md border border-white/15 bg-superficie px-3 py-1.5 text-center text-sm outline-none focus:border-primario"
          />
        ) : (
          <span className="block truncate px-2">{perfil.nombre}</span>
        )}
      </span>

      <div className="flex h-9 items-center gap-1">
        {editando ? (
          <>
            <BotonIcono
              etiqueta="Guardar nombre"
              onClick={onGuardar}
              fondo="bg-primario hover:bg-primario-fuerte">
              <Icono nombre="check" className="text-sm" />
            </BotonIcono>
            <BotonIcono etiqueta="Cancelar" onClick={onCancelar}>
              <Icono nombre="cerrar" className="text-sm" />
            </BotonIcono>
          </>
        ) : confirmando ? (
          <>
            <button
              type="button"
              onClick={onEliminar}
              className="rounded-md bg-red-600/80 px-3 py-1.5 text-xs font-semibold transition hover:bg-red-500">
              Sí
            </button>
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/20">
              No
            </button>
          </>
        ) : (
          <>
            <BotonIcono etiqueta={`Editar ${perfil.nombre}`} onClick={onEditar}>
              <Icono nombre="lapiz" className="text-sm" />
            </BotonIcono>
            {puedeEliminar ? (
              <BotonIcono
                etiqueta={`Eliminar ${perfil.nombre}`}
                onClick={() => setConfirmando(true)}>
                <Icono nombre="basura" className="text-sm" />
              </BotonIcono>
            ) : null}
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onEntrar}
        disabled={editando || confirmando}
        aria-label={`Entrar como ${perfil.nombre}`}
        className={`grid h-24 w-24 place-items-center rounded-lg text-4xl font-bold text-white shadow-lg transition ${
          activo ? "ring-2 ring-primario ring-offset-2 ring-offset-fondo" : ""
        } disabled:opacity-50`}
        style={{ backgroundColor: perfil.color }}>
        {perfil.avatar ?? perfil.nombre.charAt(0).toUpperCase()}
      </button>

      <span
        className={`text-[11px] uppercase tracking-wide ${
          activo ? "font-semibold text-primario" : "text-white/35"
        }`}>
        {activo ? "Activo" : "Entrar"}
      </span>
    </li>
  );
};

const BotonIcono = ({
  etiqueta,
  onClick,
  fondo = "bg-superficie/70 hover:bg-superficie",
  children,
}: {
  etiqueta: string;
  onClick: () => void;
  fondo?: string;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={etiqueta}
    title={etiqueta}
    className={`grid h-9 w-9 place-items-center rounded-full text-white/80 ring-1 ring-white/10 transition ${fondo}`}>
    {children}
  </button>
);

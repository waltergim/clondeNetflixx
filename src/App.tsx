import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Navbar } from "./Inicio/Navbar";
import { Footer } from "./components/Footer";
import { EsqueletoHero } from "./components/Estados";
import { usePerfil } from "./context/hooks";
import { RUTAS } from "./utils/rutas";
import { Inicio } from "./pages/Inicio";

const Buscador = lazy(() =>
  import("./Buscador/Buscador").then((m) => ({ default: m.Buscador })),
);
const Informacion = lazy(() =>
  import("./Detalles/Informacion").then((m) => ({ default: m.Informacion })),
);
const Explorar = lazy(() =>
  import("./pages/Explorar").then((m) => ({ default: m.Explorar })),
);
const MiLista = lazy(() =>
  import("./pages/MiLista").then((m) => ({ default: m.MiLista })),
);
const Perfiles = lazy(() =>
  import("./perfiles/Perfiles").then((m) => ({ default: m.Perfiles })),
);
const NoEncontrado = lazy(() =>
  import("./pages/NoEncontrado").then((m) => ({ default: m.NoEncontrado })),
);

export const App = () => (
  <BrowserRouter>
    <Contenido />
  </BrowserRouter>
);

const Contenido = () => {
  const location = useLocation();
  const { primerUso } = usePerfil();

  const enPerfiles = location.pathname === RUTAS.perfiles;
  const pantallaCompleta = primerUso && enPerfiles;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  if (primerUso && !enPerfiles) {
    return <Navigate to={RUTAS.perfiles} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!pantallaCompleta ? <Navbar /> : null}

      <main className="flex-1">
        <Suspense fallback={<CargandoRuta />}>
          <Routes>
            <Route path={RUTAS.inicio} element={<Inicio />} />
            <Route path={RUTAS.buscar} element={<Buscador />} />
            <Route path="/peliculas" element={<Explorar medio="movie" />} />
            <Route path="/series" element={<Explorar medio="tv" />} />
            <Route
              path="/pelicula/:id"
              element={<Informacion medio="movie" />}
            />
            <Route path="/serie/:id" element={<Informacion medio="tv" />} />
            <Route path={RUTAS.miLista} element={<MiLista />} />
            <Route path={RUTAS.perfiles} element={<Perfiles />} />
            <Route path="*" element={<NoEncontrado />} />
          </Routes>
        </Suspense>
      </main>

      {!pantallaCompleta ? <Footer /> : null}
    </div>
  );
};

const CargandoRuta = () => (
  <div className="pt-24">
    <EsqueletoHero />
  </div>
);

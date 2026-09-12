import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';

const Home = lazy(() => import('./pages/Home'));
const Learn = lazy(() => import('./pages/Learn'));
const Meditate = lazy(() => import('./pages/Meditate'));

function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />

      <ErrorBoundary key={location.pathname}>
        <Suspense
          fallback={
            <main aria-live="polite">
              Caricamento...
            </main>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meditate" element={<Meditate />} />
            <Route path="/learn" element={<Learn />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
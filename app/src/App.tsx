import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import DiagnosticsPage from './pages/DiagnosticsPage';
import LessonPage from './pages/LessonPage';
import LoginPage from './pages/LoginPage';
import ModulePage from './pages/ModulePage';
import TestPage from './pages/TestPage';
import { ProgressProvider } from './progress/ProgressContext';

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="page-transition"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          }
        />
        <Route
          path="/module/:moduleId"
          element={
            <PageTransition>
              <ModulePage />
            </PageTransition>
          }
        />
        <Route
          path="/module/:moduleId/lesson/:lessonId"
          element={
            <PageTransition>
              <LessonPage />
            </PageTransition>
          }
        />
        <Route
          path="/module/:moduleId/lesson/:lessonId/test"
          element={
            <PageTransition>
              <TestPage />
            </PageTransition>
          }
        />
        <Route
          path="/diagnostics"
          element={
            <PageTransition>
              <DiagnosticsPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

// ВРЕМЕННО: логинът не блокира достъпа до приложението — Supabase удари
// email rate limit при тестване, докато чака да се вдигне. Личните данни
// на кой да е потребител без логин просто не се пазят (ProgressContext
// изисква user, иначе не записва). LoginPage е достъпен на /#/login.
// Върни `if (!user) return <LoginPage />;` обратно, когато лимитът мине.
function AuthGate() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <ProgressProvider>
      <HashRouter>
        <NavBar />
        <AnimatedRoutes />
      </HashRouter>
    </ProgressProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

export default App;

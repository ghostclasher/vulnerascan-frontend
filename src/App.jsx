import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeContextProvider } from './context/ThemeContext';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import FileDetails from './pages/FileDetails';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { getToken } from './services/auth';
import Footer from './components/Footer';

const RENDER_BASE = import.meta.env.VITE_API_BASE_URL;
// make sure this equals: https://vulnerascan2.onrender.com

function AppRoutes() {
  const PrivateRoute = ({ children }) => {
    const token = getToken();
    return token ? children : <Navigate to="/" replace />;
  };

  return (
    <>
      <NavBar />
      <main style={{ minHeight: '100vh', paddingTop: 80 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/file/:id" element={<PrivateRoute><FileDetails /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {

  // 🔥 RENDER WARM-UP + RETRY (prevents your exact error)
  useEffect(() => {
    if (!RENDER_BASE) return;

    const wakeRender = async () => {
      try {
        // First try a light OPTIONS preflight (fast)
        await fetch(`${RENDER_BASE}/api/v1/auth/token`, {
          method: "OPTIONS",
          headers: { "Origin": window.location.origin }
        });

        // Then a tiny GET to fully wake Spring Boot
        await fetch(`${RENDER_BASE}/api/v1/auth/token`, {
          method: "GET"
        });

        console.log("Render backend warmed up ✅");
      } catch (err) {
        console.warn("Render still waking up — retrying in 5s…");

        // try again after 5 seconds (common on free tier)
        setTimeout(wakeRender, 5000);
      }
    };

    wakeRender();
  }, []);

  return (
    <ThemeContextProvider>
      <CssBaseline />
      <AppRoutes />
    </ThemeContextProvider>
  );
}


import { useState, useEffect, useRef } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ParticlesBackground from "./components/shared/ParticlesBackground";
import HomePage from "./pages/HomePage";
import GeneratorPage from "./pages/GeneratorPage";
import EditorPage from "./pages/EditorPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import { useAuth } from "./context/AuthContext";
import StripeCheckout from "./components/StripeCheckout";
import { apiUrl } from "./config/api";

export default function App() {
  const [currentSection, setCurrentSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<any>(null);
  const { isAuthenticated, usuario, logout, token, refreshUsuario } = useAuth();
  const [showStripe, setShowStripe] = useState(false);
  const stripeHandledRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('pago') !== 'exito' || stripeHandledRef.current) {
      return;
    }

    stripeHandledRef.current = true;

    const sessionId = params.get('session_id');

    const finalizarPago = async () => {
      try {
        if (sessionId && token) {
          await fetch(apiUrl(`/api/stripe/confirm?session_id=${encodeURIComponent(sessionId)}`), {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          });
          await refreshUsuario();
        }
      } catch (error) {
        console.error('No se pudo confirmar la suscripción', error);
      } finally {
        window.history.replaceState({}, '', '/');
        setShowStripe(false);
        alert('Bienvenido a Premium');
      }
    };

    void finalizarPago();
  }, [token, refreshUsuario]);

  const scrollToSection = (section: string) => {
    if (section === "generator" && !isAuthenticated) {
      setCurrentSection("auth");
      setMobileMenuOpen(false);
      return;
    }
    if (section === "profile" && !isAuthenticated) {
      setCurrentSection("auth");
      setMobileMenuOpen(false);
      return;
    }
    setCurrentSection(section);
    setMobileMenuOpen(false);
  };

  const handleGenerate = (resumeData: any) => {
  setGeneratedResume(resumeData);
  if (resumeData?.id) {
    localStorage.setItem('visume_current_cv_id', resumeData.id.toString());
  }
  setCurrentSection("editor");
};

  const handleLoginSuccess = () => {
    setCurrentSection("generator");
  };

  const handleLogout = () => {
    logout();
    setCurrentSection("home");
  };

  const handleOpenStripe = () => {
    setShowStripe(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <ParticlesBackground />
      <Navbar
        currentSection={currentSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
        isAuthenticated={isAuthenticated}
        usuario={usuario}
      />
      <main className="pt-20">
        {currentSection === "home" && <HomePage onGetStarted={() => scrollToSection("generator")} />}
        {currentSection === "generator" && (
          <GeneratorPage
            onGenerate={handleGenerate}
            onUpgrade={handleOpenStripe}
          />
        )}
        {currentSection === "editor" && <EditorPage resumeData={generatedResume} onUpgrade={handleOpenStripe} />}
        {currentSection === "auth" && <AuthPage onLoginSuccess={handleLoginSuccess} />}
        {currentSection === "profile" && <ProfilePage onNavigate={scrollToSection} onLogout={handleLogout} onUpgrade={handleOpenStripe} />}
        {currentSection === "admin" && <AdminPage />}
        {showStripe && <StripeCheckout onClose={() => setShowStripe(false)} />}
      </main>
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}
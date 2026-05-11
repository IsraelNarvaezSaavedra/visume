import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ParticlesBackground from "./components/shared/ParticlesBackground";
import HomePage from "./pages/HomePage";
import GeneratorPage from "./pages/GeneratorPage";
import EditorPage from "./pages/EditorPage";
import GalleryPage from "./pages/GalleryPage";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const [currentSection, setCurrentSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<any>(null);
  const { isAuthenticated, usuario, logout } = useAuth();

  const scrollToSection = (section: string) => {
    if (section === "generator" && !isAuthenticated) {
      setCurrentSection("auth");
      setMobileMenuOpen(false);
      return;
    }
    setCurrentSection(section);
    setMobileMenuOpen(false);
  };

  const handleGenerate = (resumeData: any) => {
    setGeneratedResume(resumeData);
    setCurrentSection("editor");
  };

  const handleLoginSuccess = () => {
    setCurrentSection("generator");
  };

  const handleLogout = () => {
    logout();
    setCurrentSection("home");
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
        onLogout={handleLogout}
      />

      <main className="pt-20">
        {currentSection === "home" && (
          <HomePage onGetStarted={() => scrollToSection("generator")} />
        )}

        {currentSection === "generator" && (
          <GeneratorPage onGenerate={handleGenerate} />
        )}

        {currentSection === "editor" && (
          <EditorPage resumeData={generatedResume} />
        )}

        {currentSection === "gallery" && <GalleryPage />}

        {currentSection === "auth" && (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        )}
      </main>

      <Footer />
    </div>
  );
}
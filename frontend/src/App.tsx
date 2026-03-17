import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ParticlesBackground from "./components/shared/ParticlesBackground";
import HomePage from "./pages/HomePage";
import GeneratorPage from "./pages/GeneratorPage";
import EditorPage from "./pages/EditorPage";
import GalleryPage from "./pages/GalleryPage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  const [currentSection, setCurrentSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<any>(null);

  const scrollToSection = (section: string) => {
    setCurrentSection(section);
    setMobileMenuOpen(false);
  };

  const handleGenerate = (resumeData: any) => {
    setGeneratedResume(resumeData);
    setCurrentSection("editor");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <ParticlesBackground />

      {/* Navegación fija */}
      <Navbar
        currentSection={currentSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
      />

      {/* Contenido principal */}
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

        {currentSection === "auth" && <AuthPage />}
      </main>

      <Footer />
    </div>
  );
}

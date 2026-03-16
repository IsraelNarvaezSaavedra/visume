import { useState } from "react";
import { motion } from "motion/react";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Generator from "./components/Generator";
import Editor from "./components/Editor";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";
import Auth from "./components/Auth";
import ParticlesBackground from "./components/ParticlesBackground";
import { Menu, X, LogIn } from "lucide-react";
import logo from "figma:asset/1d2887d0560c03701e2c49da822f19698caa5d77.png";

export default function App() {
  const [currentSection, setCurrentSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [generatedResume, setGeneratedResume] =
    useState<any>(null);

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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-cyan-500/20"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => scrollToSection("home")}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img
                  src={logo}
                  alt="Visume Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Visume
              </span>
            </motion.div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { id: "home", label: "Inicio" },
                { id: "generator", label: "Generador" },
                { id: "gallery", label: "Galería" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 transition-all ${
                    currentSection === item.id
                      ? "text-cyan-400"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                  {currentSection === item.id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-violet-500"
                    />
                  )}
                </button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("auth")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
              >
                <LogIn size={18} />
                <span>Iniciar sesión</span>
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("generator")}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all shadow-lg shadow-cyan-500/30"
              >
                Comenzar
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-cyan-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 p-4 rounded-lg bg-slate-900/90 backdrop-blur-md border border-cyan-500/20"
            >
              {[
                { id: "home", label: "Inicio" },
                { id: "generator", label: "Generador" },
                { id: "gallery", label: "Galería" },
                { id: "auth", label: "Iniciar sesión" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-all ${
                    currentSection === item.id
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-white/70 hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Contenido principal */}
      <main className="pt-20">
        {currentSection === "home" && (
          <>
            <Hero
              onGetStarted={() => scrollToSection("generator")}
            />
            <HowItWorks />
          </>
        )}

        {currentSection === "generator" && (
          <Generator onGenerate={handleGenerate} />
        )}

        {currentSection === "editor" && (
          <Editor resumeData={generatedResume} />
        )}

        {currentSection === "gallery" && <Gallery />}

        {currentSection === "auth" && <Auth />}
      </main>

      <Footer />
    </div>
  );
}
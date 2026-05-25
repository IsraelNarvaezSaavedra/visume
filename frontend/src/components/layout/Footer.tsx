import { motion } from 'motion/react';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import logo from 'figma:asset/1d2887d0560c03701e2c49da822f19698caa5d77.png';

interface FooterProps {
  onNavigate?: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleNavClick = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative mt-24 border-t border-cyan-500/20 bg-slate-950/50 backdrop-blur-md">
      {/* Efectos de neón suaves */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Logo y descripción */}
          <div className="lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 mb-4 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src={logo} alt="Visume Logo" className="w-full h-full object-contain" />
              </div>
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Visume
              </span>
            </motion.div>

            <p className="text-slate-400 mb-6">
              Transforma tu experiencia profesional en una página web interactiva y moderna con el poder de la inteligencia artificial.
            </p>
          </div>

          {/* Enlaces */}
          <div className="lg:col-span-4">
            <div>
              <h3 className="mb-4 text-sm tracking-wide text-cyan-400 uppercase">
                Navegación
              </h3>
              <ul className="space-y-3 flex flex-col">
                <li>
                  <button onClick={() => handleNavClick('home')} className="text-slate-400 hover:text-white transition-colors inline-block">
                    Inicio
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('generator')} className="text-slate-400 hover:text-white transition-colors inline-block">
                    Generador
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('profile')} className="text-slate-400 hover:text-white transition-colors inline-block">
                    Mi Perfil
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Línea divisoria con efecto neón */}
        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            © 2026 Visume. Todos los derechos reservados.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2"
          >
            <span>Hecho con</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Heart className="text-pink-500 fill-pink-500" size={16} />
            </motion.div>
            <span>e</span>
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Inteligencia Artificial
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

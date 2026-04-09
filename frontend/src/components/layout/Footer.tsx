import { motion } from 'motion/react';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import logo from 'figma:asset/1d2887d0560c03701e2c49da822f19698caa5d77.png';

export default function Footer() {
  const links = {
    producto: [
      { label: 'Características', href: '#' },
      { label: 'Precios', href: '#' },
      { label: 'Ejemplos', href: '#' },
      { label: 'Plantillas', href: '#' },
    ],
    recursos: [
      { label: 'Documentación', href: '#' },
      { label: 'Guías', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'API', href: '#' },
    ],
    empresa: [
      { label: 'Sobre nosotros', href: '#' },
      { label: 'Contacto', href: '#' },
      { label: 'Carreras', href: '#' },
      { label: 'Prensa', href: '#' },
    ],
    legal: [
      { label: 'Privacidad', href: '#' },
      { label: 'Términos', href: '#' },
      { label: 'Cookies', href: '#' },
      { label: 'Licencias', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

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

            {/* Redes sociales */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -2,
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-cyan-500/30 hover:border-cyan-500/50 flex items-center justify-center transition-all group"
                  aria-label={social.label}
                >
                  <social.icon size={18} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Enlaces */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm tracking-wide text-cyan-400 uppercase">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="text-slate-400 hover:text-white transition-colors inline-block"
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/30 backdrop-blur-sm"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="mb-3 text-xl bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Mantente actualizado
            </h3>
            <p className="mb-6 text-slate-400">
              Recibe las últimas noticias, plantillas y consejos profesionales directamente en tu correo
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-950/50 border border-cyan-500/30 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 transition-all"
              />
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all shadow-lg shadow-cyan-500/30"
              >
                Suscribirse
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Línea divisoria con efecto neón */}
        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            © 2025 Visume. Todos los derechos reservados.
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

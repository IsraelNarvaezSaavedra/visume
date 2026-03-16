import { motion } from 'motion/react';
import { Eye, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function Gallery() {
  const resumes = [
    {
      id: 1,
      name: 'Desarrollador Full Stack',
      category: 'Tecnología',
      image: 'https://images.unsplash.com/photo-1558181445-eca4774b2a37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXZlbG9wZXIlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYyMDg1MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      id: 2,
      name: 'Diseñadora Creativa',
      category: 'Diseño',
      image: 'https://images.unsplash.com/photo-1658863025658-4a259cc68fc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRlc2lnbmVyJTIwcG9ydGZvbGlvfGVufDF8fHx8MTc2MjEwNTA3OHww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-violet-500 to-purple-500',
    },
    {
      id: 3,
      name: 'Gerente de Proyectos',
      category: 'Negocios',
      image: 'https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYyMDkyOTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 4,
      name: 'Consultor Estratégico',
      category: 'Consultoría',
      image: 'https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjA3MjgzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 5,
      name: 'Artista Digital',
      category: 'Arte',
      image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwd29ya3NwYWNlfGVufDF8fHx8MTc2MjAxMzA5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 6,
      name: 'Marketing Manager',
      category: 'Marketing',
      image: 'https://images.unsplash.com/photo-1709715357519-2a84f9765e57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRpbmclMjBwcm9mZXNzaW9uYWwlMjBvZmZpY2V8ZW58MXx8fHwxNzYyMTA1MDgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <section className="relative min-h-screen py-24 px-4">
      {/* Gradiente de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Galería de Currículums
          </h2>
          <p className="text-lg text-slate-400">
            Descubre currículums creados por nuestra comunidad
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {['Todos', 'Tecnología', 'Diseño', 'Negocios', 'Marketing'].map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-lg bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all"
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid de currículums */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Efecto de brillo al hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${resume.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 group-hover:border-cyan-500/50 transition-all">
                {/* Imagen de fondo */}
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src={resume.image}
                    alt={resume.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                </div>

                {/* Overlay con información */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {/* Categoría */}
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs bg-gradient-to-r ${resume.color} shadow-lg`}>
                      {resume.category}
                    </span>
                  </div>

                  {/* Nombre */}
                  <h3 className="mb-4 text-xl text-white group-hover:text-cyan-300 transition-colors">
                    {resume.name}
                  </h3>

                  {/* Botones de acción */}
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      <span className="text-sm">Ver Currículum</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-lg bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-500/50 flex items-center justify-center transition-all"
                    >
                      <ExternalLink size={16} />
                    </motion.button>
                  </div>
                </div>

                {/* Efecto de glassmorphism en el hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botón de cargar más */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all"
          >
            Cargar más currículums
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

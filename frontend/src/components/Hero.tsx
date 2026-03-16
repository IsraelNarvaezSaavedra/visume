import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Efectos de brillo de fondo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 backdrop-blur-sm mb-8"
          >
            <Sparkles className="text-cyan-400" size={20} />
            <span className="text-sm text-cyan-300">Potenciado por Inteligencia Artificial</span>
          </motion.div>

          <h1 className="mb-6 text-5xl md:text-7xl lg:text-8xl bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
            Convierte tu currículum en una web
          </h1>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-4 text-3xl md:text-5xl lg:text-6xl bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent"
          >
            con inteligencia artificial
          </motion.h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto"
        >
          Transforma tu experiencia profesional en una página web interactiva y moderna en segundos. 
          Sin código, sin complicaciones, solo resultados impresionantes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all shadow-2xl shadow-cyan-500/40 flex items-center gap-2"
          >
            <span className="text-lg">Crea tu currículum ahora</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </motion.button>

          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'rgba(6, 182, 212, 0.1)'
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl border-2 border-cyan-500/50 hover:border-cyan-400 transition-all backdrop-blur-sm"
          >
            <span className="text-lg">Ver ejemplos</span>
          </motion.button>
        </motion.div>

        {/* Indicador visual */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 mx-auto rounded-full border-2 border-cyan-500/50 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

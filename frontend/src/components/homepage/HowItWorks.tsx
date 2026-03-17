import { motion } from 'motion/react';
import { FileText, Sparkles, Share2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: 'Describe tu perfil',
      description: 'Escribe tu información profesional de forma natural, como si hablaras con alguien.',
      color: 'from-cyan-500 to-blue-500',
      delay: 0.2,
    },
    {
      icon: Sparkles,
      title: 'Genera con IA',
      description: 'Nuestra inteligencia artificial crea una página web personalizada y optimizada para ti.',
      color: 'from-violet-500 to-purple-500',
      delay: 0.4,
    },
    {
      icon: Share2,
      title: 'Comparte tu web',
      description: 'Obtén un enlace único y comparte tu currículum profesional con el mundo.',
      color: 'from-pink-500 to-rose-500',
      delay: 0.6,
    },
  ];

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Cómo funciona
          </h2>
          <p className="text-lg text-slate-400">
            Tres pasos simples para crear tu currículum web profesional
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.delay }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="relative group"
            >
              {/* Efecto de brillo al hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 group-hover:border-cyan-500/40 transition-all">
                {/* Número del paso */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <span className="text-xl bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                    {index + 1}
                  </span>
                </div>

                {/* Icono */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${step.color} mb-6 shadow-lg`}>
                  <step.icon className="text-white" size={32} />
                </div>

                {/* Contenido */}
                <h3 className="mb-3 text-xl text-white">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>

                {/* Línea conectora (excepto el último) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-slate-400 mb-4">¿Listo para comenzar?</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 backdrop-blur-sm cursor-pointer"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Es gratis, rápido y sin registro
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

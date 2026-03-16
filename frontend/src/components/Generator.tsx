import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Crown, Check, Loader2 } from 'lucide-react';

interface GeneratorProps {
  onGenerate: (data: any) => void;
}

export default function Generator({ onGenerate }: GeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  const plans = [
    {
      id: 'free' as const,
      name: 'Versión Gratuita',
      icon: Sparkles,
      price: 'Gratis',
      features: [
        'Plantilla básica',
        'Colores limitados',
        'Sin personalización avanzada',
        'Marca de agua',
      ],
      color: 'from-cyan-500 to-blue-500',
      borderColor: 'border-cyan-500/30',
    },
    {
      id: 'premium' as const,
      name: 'Versión Premium',
      icon: Crown,
      price: '€9.99/mes',
      features: [
        'Todas las plantillas',
        'Personalización completa',
        'Dominio personalizado',
        'Sin marca de agua',
        'Analytics incluido',
        'Soporte prioritario',
      ],
      color: 'from-violet-500 to-purple-500',
      borderColor: 'border-violet-500/50',
      highlight: true,
    },
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulación de generación con IA
    setTimeout(() => {
      const generatedData = {
        prompt,
        plan: selectedPlan,
        name: 'María González',
        title: 'Desarrolladora Full Stack',
        experience: [
          { company: 'Tech Corp', role: 'Senior Developer', years: '2021-2024' },
          { company: 'StartupXYZ', role: 'Developer', years: '2019-2021' },
        ],
        skills: ['React', 'Node.js', 'TypeScript', 'Python'],
        design: selectedPlan === 'premium' ? 'modern' : 'basic',
      };

      setPreview(generatedData);
      setIsGenerating(false);
    }, 2500);
  };

  const handleUseResume = () => {
    if (preview) {
      onGenerate(preview);
    }
  };

  return (
    <section className="relative min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Generador de Currículum
          </h2>
          <p className="text-lg text-slate-400">
            Describe tu experiencia y deja que la IA cree tu página web profesional
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Panel de entrada */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Área de texto */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30">
                <label className="block mb-3 text-cyan-400 flex items-center gap-2">
                  <Sparkles size={20} />
                  <span>Cuéntanos sobre ti</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ejemplo: Soy desarrollador full stack con 5 años de experiencia en React y Node.js. He trabajado en startups y grandes empresas, liderando equipos de 3-5 personas. Me especializo en crear aplicaciones web escalables..."
                  className="w-full h-64 px-4 py-3 bg-slate-950/50 border border-cyan-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                />
                <div className="mt-3 text-sm text-slate-500">
                  {prompt.length} caracteres
                </div>
              </div>
            </div>

            {/* Selector de plan */}
            <div className="space-y-4">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative cursor-pointer group ${
                    plan.highlight ? 'lg:col-span-2' : ''
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-sm shadow-lg shadow-violet-500/30">
                      Recomendado
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className={`relative p-6 rounded-2xl backdrop-blur-md border-2 transition-all ${
                    selectedPlan === plan.id
                      ? `bg-slate-900/90 ${plan.borderColor} shadow-lg shadow-${plan.id === 'premium' ? 'violet' : 'cyan'}-500/30`
                      : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.color}`}>
                          <plan.icon className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl text-white">{plan.name}</h3>
                          <p className="text-sm bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                            {plan.price}
                          </p>
                        </div>
                      </div>
                      {selectedPlan === plan.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center"
                        >
                          <Check size={20} />
                        </motion.div>
                      )}
                    </div>

                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Botón de generar */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span className="text-lg">Generando...</span>
                </>
              ) : (
                <>
                  <Zap size={24} />
                  <span className="text-lg">Generar Currículum</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Panel de vista previa */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30">
                <h3 className="mb-4 text-xl text-cyan-400 flex items-center gap-2">
                  <Sparkles size={20} />
                  Vista Previa
                </h3>

                {!preview && !isGenerating && (
                  <div className="h-96 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
                    <div className="text-center">
                      <Sparkles className="mx-auto mb-4 text-slate-600" size={48} />
                      <p>Tu currículum aparecerá aquí</p>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-cyan-500/20 border-t-cyan-500"
                      />
                      <p className="text-cyan-400">Creando tu página web...</p>
                      <p className="text-sm text-slate-500 mt-2">Esto tomará unos segundos</p>
                    </div>
                  </div>
                )}

                {preview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-xl ${
                      selectedPlan === 'premium'
                        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-violet-500/30'
                        : 'bg-slate-950 border border-slate-700'
                    }`}
                  >
                    <div className="mb-6 pb-4 border-b border-slate-700">
                      <h4 className="text-2xl text-white mb-1">{preview.name}</h4>
                      <p className="text-cyan-400">{preview.title}</p>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-sm text-slate-500 mb-3">EXPERIENCIA</h5>
                      <div className="space-y-3">
                        {preview.experience.map((exp: any, idx: number) => (
                          <div key={idx} className="pb-3 border-b border-slate-800">
                            <p className="text-white">{exp.role}</p>
                            <p className="text-sm text-slate-400">{exp.company}</p>
                            <p className="text-xs text-slate-500">{exp.years}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm text-slate-500 mb-3">HABILIDADES</h5>
                      <div className="flex flex-wrap gap-2">
                        {preview.skills.map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              selectedPlan === 'premium'
                                ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedPlan === 'free' && (
                      <div className="mt-6 pt-4 border-t border-slate-700 text-center">
                        <p className="text-xs text-slate-600">Powered by Visume</p>
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUseResume}
                      className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all shadow-lg"
                    >
                      Editar y Personalizar
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
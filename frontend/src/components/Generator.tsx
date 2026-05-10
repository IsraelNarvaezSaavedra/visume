import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Crown, Loader2, ArrowRight, Check } from 'lucide-react';

interface GeneratorProps {
  onGenerate: (data: any) => void;
}

type Plan = 'free' | 'premium' | null;
type Phase = 'select' | 'generate';

export default function Generator({ onGenerate }: GeneratorProps) {
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedPlan, setSelectedPlan] = useState<Plan>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [streamText, setStreamText] = useState('');

  // ── Selección de plan ──────────────────────────────────────────
  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleConfirmPlan = () => {
    if (!selectedPlan) return;
    if (selectedPlan === 'premium') {
      // TODO: redirigir a Stripe cuando esté listo
      alert('Portal de pago próximamente 🚀');
      return;
    }
    setPhase('generate');
  };

  // ── Generación ─────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setPreview(null);
    setStreamText('');

    try {
      const token = localStorage.getItem('token'); // ajusta según tu auth

      const res = await fetch('http://localhost:8080/api/curriculum/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, plan: selectedPlan }),
      });

      if (!res.ok) throw new Error('Error generando curriculum');

      const data = await res.json();
      setPreview(data);
    } catch (err) {
      console.error(err);
      // TODO: mostrar toast de error
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <section className="relative min-h-screen">

      {/* FASE 1 — Selector de plan */}
      <AnimatePresence mode="wait">
        {phase === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-4">
                Elige tu plan
              </h2>
              <p className="text-slate-400 text-lg">
                Selecciona cómo quieres crear tu currículum
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mb-10">
              {/* Plan gratuito */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectPlan('free')}
                className={`relative cursor-pointer p-8 rounded-3xl border-2 transition-all duration-300 ${
                  selectedPlan === 'free'
                    ? 'bg-slate-900/90 border-cyan-500 shadow-2xl shadow-cyan-500/20'
                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
                }`}
              >
                {selectedPlan === 'free' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center"
                  >
                    <Check size={16} className="text-white" />
                  </motion.div>
                )}

                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 w-fit mb-6">
                  <Sparkles className="text-white" size={32} />
                </div>

                <h3 className="text-2xl text-white mb-2">Versión Gratuita</h3>
                <p className="text-3xl text-cyan-400 mb-6">Gratis</p>

                <ul className="space-y-3">
                  {['Plantilla básica', 'Colores limitados', 'Sin personalización avanzada', 'Marca de agua Visume'].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Plan premium */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectPlan('premium')}
                className={`relative cursor-pointer p-8 rounded-3xl border-2 transition-all duration-300 ${
                  selectedPlan === 'premium'
                    ? 'bg-slate-900/90 border-violet-500 shadow-2xl shadow-violet-500/20'
                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-sm text-white shadow-lg shadow-violet-500/30">
                  Recomendado
                </div>

                {selectedPlan === 'premium' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center"
                  >
                    <Check size={16} className="text-white" />
                  </motion.div>
                )}

                <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 w-fit mb-6">
                  <Crown className="text-white" size={32} />
                </div>

                <h3 className="text-2xl text-white mb-2">Versión Premium</h3>
                <p className="text-3xl text-violet-400 mb-6">€9.99<span className="text-lg text-slate-400">/mes</span></p>

                <ul className="space-y-3">
                  {[
                    'Todas las plantillas',
                    'Personalización completa',
                    'Dominio personalizado',
                    'Sin marca de agua',
                    'Analytics incluido',
                    'Soporte prioritario',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Botón confirmar */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: selectedPlan ? 1 : 0.4, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={selectedPlan ? { scale: 1.04, boxShadow: '0 0 40px rgba(6,182,212,0.4)' } : {}}
              whileTap={selectedPlan ? { scale: 0.97 } : {}}
              onClick={handleConfirmPlan}
              disabled={!selectedPlan}
              className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-lg disabled:cursor-not-allowed transition-all"
            >
              Continuar
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        )}

        {/* FASE 2 — Generador */}
        {phase === 'generate' && (
          <motion.div
            key="generate"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen py-24 px-4"
          >
            <div className="max-w-6xl mx-auto">
              <motion.div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm mb-6">
                  <Sparkles size={14} />
                  Plan Gratuito activo
                </div>
                <h2 className="text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-4">
                  Generador de Currículum
                </h2>
                <p className="text-slate-400 text-lg">
                  Describe tu experiencia y deja que la IA cree tu página web profesional
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Panel izquierdo */}
                <div className="space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30">
                      <label className="block mb-3 text-cyan-400 flex items-center gap-2">
                        <Sparkles size={20} />
                        Cuéntanos sobre ti
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ejemplo: Soy desarrollador full stack con 5 años de experiencia en React y Node.js. He trabajado en startups y grandes empresas, liderando equipos de 3-5 personas..."
                        className="w-full h-64 px-4 py-3 bg-slate-950/50 border border-cyan-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                      />
                      <div className="mt-3 text-sm text-slate-500">{prompt.length} caracteres</div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 text-white"
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
                </div>

                {/* Panel derecho — Vista previa */}
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-xl bg-slate-950 border border-slate-700 space-y-6"
                      >
                        {/* Nombre y título */}
                        <div className="pb-4 border-b border-slate-700">
                          <h4 className="text-2xl text-white mb-1">
                            {preview.personalInfo?.name}
                          </h4>
                          <p className="text-cyan-400">{preview.personalInfo?.title}</p>
                          <p className="text-slate-400 text-sm mt-2">{preview.personalInfo?.bio}</p>
                        </div>

                        {/* Experiencia */}
                        {preview.experience?.length > 0 && (
                          <div>
                            <h5 className="text-xs text-slate-500 mb-3 tracking-widest">EXPERIENCIA</h5>
                            <div className="space-y-3">
                              {preview.experience.map((exp: any, idx: number) => (
                                <div key={idx} className="pb-3 border-b border-slate-800 last:border-0">
                                  <p className="text-white">{exp.position}</p>
                                  <p className="text-sm text-slate-400">{exp.company}</p>
                                  <p className="text-xs text-slate-500">{exp.startDate} — {exp.endDate}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        {preview.skills?.length > 0 && (
                          <div>
                            <h5 className="text-xs text-slate-500 mb-3 tracking-widest">HABILIDADES</h5>
                            <div className="flex flex-wrap gap-2">
                              {preview.skills.map((skill: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 rounded-lg text-sm bg-slate-800 text-slate-400"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-slate-700 text-center">
                          <p className="text-xs text-slate-600">Powered by Visume</p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => onGenerate(preview)}
                          className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all text-white"
                        >
                          Editar y Personalizar
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
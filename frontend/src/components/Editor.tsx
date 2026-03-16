import { useState } from 'react';
import { motion } from 'motion/react';
import { Palette, Type, Layout, Save, Eye, Download } from 'lucide-react';

interface EditorProps {
  resumeData: any;
}

export default function Editor({ resumeData }: EditorProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout'>('colors');
  const [selectedColor, setSelectedColor] = useState('#06b6d4');
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [editedData, setEditedData] = useState(resumeData);

  const colorPresets = [
    { name: 'Cyan', value: '#06b6d4', gradient: 'from-cyan-500 to-blue-500' },
    { name: 'Violet', value: '#8b5cf6', gradient: 'from-violet-500 to-purple-500' },
    { name: 'Green', value: '#10b981', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Orange', value: '#f97316', gradient: 'from-orange-500 to-red-500' },
    { name: 'Pink', value: '#ec4899', gradient: 'from-pink-500 to-rose-500' },
  ];

  const fontOptions = [
    'Inter',
    'Roboto',
    'Poppins',
    'Montserrat',
    'Raleway',
  ];

  const tabs = [
    { id: 'colors' as const, icon: Palette, label: 'Colores' },
    { id: 'fonts' as const, icon: Type, label: 'Tipografía' },
    { id: 'layout' as const, icon: Layout, label: 'Diseño' },
  ];

  return (
    <section className="relative min-h-screen py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Editor de Diseño
          </h2>
          <p className="text-lg text-slate-400">
            Personaliza tu currículum web con un toque profesional
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
          {/* Panel de edición */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Tabs */}
            <div className="p-2 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/30'
                      : 'hover:bg-slate-800'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Panel de colores */}
            {activeTab === 'colors' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30"
              >
                <h3 className="mb-4 text-lg text-cyan-400">Paleta de Colores</h3>
                <div className="space-y-4">
                  {colorPresets.map((color) => (
                    <motion.div
                      key={color.value}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => setSelectedColor(color.value)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedColor === color.value
                          ? 'bg-slate-800 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-950/50 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color.gradient} shadow-lg`} />
                        <div>
                          <p className="text-white">{color.name}</p>
                          <p className="text-sm text-slate-500">{color.value}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800">
                  <label className="block mb-2 text-sm text-slate-400">Color personalizado</label>
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full h-12 rounded-lg cursor-pointer"
                  />
                </div>
              </motion.div>
            )}

            {/* Panel de tipografía */}
            {activeTab === 'fonts' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30"
              >
                <h3 className="mb-4 text-lg text-cyan-400">Familia Tipográfica</h3>
                <div className="space-y-3">
                  {fontOptions.map((font) => (
                    <motion.button
                      key={font}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => setSelectedFont(font)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedFont === font
                          ? 'bg-slate-800 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-950/50 border border-slate-700 hover:border-slate-600'
                      }`}
                      style={{ fontFamily: font }}
                    >
                      <p className="text-white text-lg">{font}</p>
                      <p className="text-sm text-slate-500">The quick brown fox jumps</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Panel de diseño */}
            {activeTab === 'layout' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30"
              >
                <h3 className="mb-4 text-lg text-cyan-400">Layout y Estructura</h3>
                <div className="space-y-4">
                  {['Clásico', 'Moderno', 'Minimalista'].map((layout) => (
                    <motion.button
                      key={layout}
                      whileHover={{ scale: 1.02 }}
                      className="w-full p-4 rounded-xl bg-slate-950/50 border border-slate-700 hover:border-cyan-500/50 transition-all text-left"
                    >
                      <div className="h-20 mb-3 rounded-lg bg-slate-800 border border-slate-700" />
                      <p className="text-white">{layout}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Botones de acción */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                <span>Guardar Cambios</span>
              </motion.button>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="py-3 rounded-xl bg-slate-900/70 border border-cyan-500/30 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={20} />
                  <span>Vista Previa</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="py-3 rounded-xl bg-slate-900/70 border border-cyan-500/30 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  <span>Exportar</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Vista previa en tiempo real */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="relative p-8 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 min-h-[600px]">
                {/* Efecto de reflexión al hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-500/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative">
                  <div className="mb-6 text-center pb-6 border-b" style={{ borderColor: selectedColor + '30' }}>
                    <h3 className="text-3xl text-white mb-2" style={{ fontFamily: selectedFont }}>
                      {editedData?.name || 'Nombre'}
                    </h3>
                    <p className="text-xl" style={{ color: selectedColor, fontFamily: selectedFont }}>
                      {editedData?.title || 'Título Profesional'}
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="mb-4 text-sm tracking-wide" style={{ color: selectedColor, fontFamily: selectedFont }}>
                        EXPERIENCIA PROFESIONAL
                      </h4>
                      <div className="space-y-4">
                        {editedData?.experience?.map((exp: any, idx: number) => (
                          <motion.div
                            key={idx}
                            whileHover={{ x: 5 }}
                            className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                          >
                            <p className="text-white mb-1" style={{ fontFamily: selectedFont }}>{exp.role}</p>
                            <p className="text-slate-400 text-sm">{exp.company}</p>
                            <p className="text-slate-500 text-xs">{exp.years}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-4 text-sm tracking-wide" style={{ color: selectedColor, fontFamily: selectedFont }}>
                        HABILIDADES
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {editedData?.skills?.map((skill: string, idx: number) => (
                          <motion.span
                            key={idx}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="px-4 py-2 rounded-lg border transition-all cursor-pointer"
                            style={{
                              backgroundColor: selectedColor + '20',
                              borderColor: selectedColor + '40',
                              color: selectedColor,
                              fontFamily: selectedFont,
                            }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

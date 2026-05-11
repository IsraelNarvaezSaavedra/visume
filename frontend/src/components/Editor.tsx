import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Type, Layout, Save, Download, Edit3, Check, X, Plus, Trash2 } from 'lucide-react';

// ── Componente editable FUERA del Editor para evitar re-mounts ──
interface EditableProps {
  value: string;
  onSave: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
}

function EditableText({ value, onSave, className = '', style, multiline }: EditableProps) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(value);

  if (editing) {
    return (
      <span className="inline-flex items-start gap-1 w-full">
        {multiline ? (
          <textarea autoFocus value={local} onChange={e => setLocal(e.target.value)}
            className="flex-1 bg-blue-50 border border-blue-400 rounded px-2 py-1 text-slate-800 text-sm resize-none"
            rows={3} style={style} />
        ) : (
          <input autoFocus value={local} onChange={e => setLocal(e.target.value)}
            className="flex-1 bg-blue-50 border border-blue-400 rounded px-2 py-1 text-slate-800"
            style={style} />
        )}
        <button onClick={() => { onSave(local); setEditing(false); }}
          className="text-green-600 hover:text-green-700 mt-1 flex-shrink-0"><Check size={16} /></button>
        <button onClick={() => { setLocal(value); setEditing(false); }}
          className="text-red-500 hover:text-red-600 mt-1 flex-shrink-0"><X size={16} /></button>
      </span>
    );
  }

  return (
    <span className={`group cursor-pointer relative ${className}`} style={style}
      onClick={() => { setLocal(value); setEditing(true); }}>
      {value || <span className="text-slate-400 italic text-sm">Click para editar</span>}
      <Edit3 size={11} className="inline ml-1 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </span>
  );
}

// ── Editor principal ────────────────────────────────────────────
interface EditorProps {
  resumeData: any;
}

export default function Editor({ resumeData }: EditorProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout' | 'content'>('colors');
  const [primaryColor, setPrimaryColor] = useState(resumeData?.style?.primaryColor || '#06b6d4');
  const [selectedFont, setSelectedFont] = useState(resumeData?.style?.font || 'Inter');
  const [selectedLayout, setSelectedLayout] = useState('modern');
  const [data, setData] = useState(resumeData);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const colorPresets = [
    { name: 'Cyan', value: '#06b6d4', gradient: 'from-cyan-500 to-blue-500' },
    { name: 'Violet', value: '#8b5cf6', gradient: 'from-violet-500 to-purple-500' },
    { name: 'Verde', value: '#10b981', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Naranja', value: '#f97316', gradient: 'from-orange-500 to-red-500' },
    { name: 'Rosa', value: '#ec4899', gradient: 'from-pink-500 to-rose-500' },
    { name: 'Dorado', value: '#f59e0b', gradient: 'from-yellow-500 to-orange-400' },
  ];

  const fontOptions = [
    { name: 'Inter', label: 'Inter — Moderno y limpio' },
    { name: 'Georgia', label: 'Georgia — Clásico y elegante' },
    { name: 'Courier New', label: 'Courier — Técnico' },
    { name: 'Trebuchet MS', label: 'Trebuchet — Dinámico' },
    { name: 'Palatino', label: 'Palatino — Sofisticado' },
  ];

  const layouts = [
    { id: 'modern', label: 'Moderno', desc: 'Header centrado' },
    { id: 'classic', label: 'Clásico', desc: 'Alineado a la izquierda' },
    { id: 'minimal', label: 'Minimalista', desc: 'Solo tipografía' },
  ];

  const tabs = [
    { id: 'colors' as const, icon: Palette, label: 'Colores' },
    { id: 'fonts' as const, icon: Type, label: 'Fuentes' },
    { id: 'layout' as const, icon: Layout, label: 'Layout' },
    { id: 'content' as const, icon: Edit3, label: 'Contenido' },
  ];

  const update = (path: string, value: any) => {
    const keys = path.split('.');
    setData((prev: any) => {
      const clone = JSON.parse(JSON.stringify(prev));
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setData((prev: any) => ({ ...prev, skills: [...(prev.skills || []), newSkill.trim()] }));
    setNewSkill('');
  };

  const removeSkill = (idx: number) => {
    setData((prev: any) => ({ ...prev, skills: prev.skills.filter((_: any, i: number) => i !== idx) }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // TODO: llamar al backend
  };

  const handleExport = () => {
    const nombre = data?.personalInfo?.name || 'curriculum';

    const skillsHtml = data?.skills?.map((s: string) =>
      `<span style="display:inline-block;padding:4px 12px;border-radius:999px;border:1px solid ${primaryColor};color:${primaryColor};background:${primaryColor}18;font-size:13px;margin:3px">${s}</span>`
    ).join('') || '';

    const expHtml = data?.experience?.map((exp: any) => `
      <div style="margin-bottom:16px;padding-left:12px;border-left:2px solid ${primaryColor}80">
        <div style="font-weight:600;color:#1e293b">${exp.position || ''}</div>
        <div style="color:#64748b;font-size:14px">${exp.company || ''}</div>
        <div style="color:#94a3b8;font-size:12px">${exp.startDate || ''} — ${exp.endDate || 'Actualidad'}</div>
        ${exp.description ? `<div style="color:#475569;font-size:14px;margin-top:4px">${exp.description}</div>` : ''}
      </div>`).join('') || '';

    const eduHtml = data?.education?.map((edu: any) => `
      <div style="margin-bottom:12px;padding-left:12px;border-left:2px solid ${primaryColor}80">
        <div style="font-weight:600;color:#1e293b">${edu.degree || ''}</div>
        <div style="color:#64748b;font-size:14px">${edu.institution || ''}</div>
        <div style="color:#94a3b8;font-size:12px">${edu.startDate || ''} — ${edu.endDate || ''}</div>
      </div>`).join('') || '';

    const proyHtml = data?.projects?.map((p: any) => `
      <div style="margin-bottom:12px;padding-left:12px;border-left:2px solid ${primaryColor}80">
        <div style="font-weight:600;color:#1e293b">${p.name || ''}</div>
        <div style="color:#475569;font-size:14px">${p.description || ''}</div>
        ${p.technologies?.length ? `<div style="color:#94a3b8;font-size:12px;margin-top:2px">${p.technologies.join(' · ')}</div>` : ''}
      </div>`).join('') || '';

    const contacto = [
      data?.personalInfo?.email ? `${data.personalInfo.email}` : '',
      data?.personalInfo?.phone ? `${data.personalInfo.phone}` : '',
      data?.personalInfo?.location ? `${data.personalInfo.location}` : '',
      data?.personalInfo?.linkedin ? `${data.personalInfo.linkedin}` : '',
    ].filter(Boolean).join('  |  ');

    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
    <title>${nombre}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:${selectedFont},Arial,sans-serif;color:#1e293b;background:white;padding:40px;max-width:800px;margin:auto}
      @media print{body{padding:20px}}
      .header{padding-bottom:16px;border-bottom:2px solid ${primaryColor}30;margin-bottom:16px;${selectedLayout === 'modern' ? 'text-align:center' : ''}}
      h1{font-size:28px;font-weight:700;color:#0f172a;margin-bottom:4px}
      .titulo{font-size:16px;color:${primaryColor};margin-bottom:8px}
      .contacto{font-size:13px;color:#64748b}
      .bio{font-size:14px;color:#475569;line-height:1.6;margin-bottom:20px}
      .sec{font-size:11px;letter-spacing:.12em;font-weight:700;color:${primaryColor};margin:20px 0 10px;text-transform:uppercase}
    </style></head><body>
    <div class="header">
      <h1>${nombre}</h1>
      <div class="titulo">${data?.personalInfo?.title || ''}</div>
      <div class="contacto">${contacto}</div>
    </div>
    ${data?.personalInfo?.bio ? `<div class="sec">SOBRE MÍ</div><div class="bio">${data.personalInfo.bio}</div>` : ''}
    ${expHtml ? `<div class="sec">EXPERIENCIA</div>${expHtml}` : ''}
    ${eduHtml ? `<div class="sec">EDUCACIÓN</div>${eduHtml}` : ''}
    ${skillsHtml ? `<div class="sec">HABILIDADES</div><div style="margin-bottom:20px">${skillsHtml}</div>` : ''}
    ${proyHtml ? `<div class="sec">PROYECTOS</div>${proyHtml}` : ''}
    <div style="margin-top:40px;padding-top:12px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#cbd5e1">Creado con Visume</div>
    </body></html>`;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  const isModern = selectedLayout === 'modern';
  const headerAlign = isModern ? 'text-center' : 'text-left';
  const contactAlign = isModern ? 'justify-center' : 'justify-start';

  return (
    <section className="relative min-h-screen py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="mb-4 text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Editor de Diseño
          </h2>
          <p className="text-lg text-slate-400">Personaliza tu currículum — haz click en cualquier texto para editarlo</p>
        </motion.div>

        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
          {/* Panel izquierdo */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="p-2 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 grid grid-cols-4 gap-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl transition-all text-xs ${
                    activeTab === tab.id ? 'bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg text-white' : 'hover:bg-slate-800 text-slate-400'
                  }`}>
                  <tab.icon size={18} />{tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'colors' && (
                <motion.div key="colors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30">
                  <h3 className="mb-4 text-lg text-cyan-400">Color principal</h3>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {colorPresets.map((color) => (
                      <motion.div key={color.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setPrimaryColor(color.value)}
                        className={`p-3 rounded-xl cursor-pointer text-center transition-all ${primaryColor === color.value ? 'ring-2 ring-white/50' : ''}`}>
                        <div className={`w-full h-10 rounded-lg bg-gradient-to-br ${color.gradient} mb-2`} />
                        <p className="text-xs text-slate-300">{color.name}</p>
                      </motion.div>
                    ))}
                  </div>
                  <label className="block mb-2 text-sm text-slate-400">Color personalizado</label>
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                    className="w-full h-12 rounded-lg cursor-pointer border border-slate-700 bg-transparent" />
                </motion.div>
              )}

              {activeTab === 'fonts' && (
                <motion.div key="fonts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30">
                  <h3 className="mb-4 text-lg text-cyan-400">Tipografía</h3>
                  <div className="space-y-3">
                    {fontOptions.map((font) => (
                      <motion.button key={font.name} whileHover={{ x: 4 }} onClick={() => setSelectedFont(font.name)}
                        className={`w-full p-4 rounded-xl text-left transition-all ${
                          selectedFont === font.name ? 'bg-slate-800 border-2 border-cyan-500/50' : 'bg-slate-950/50 border border-slate-700 hover:border-slate-600'
                        }`} style={{ fontFamily: font.name }}>
                        <p className="text-white text-lg mb-1">{font.name}</p>
                        <p className="text-slate-500 text-sm">{font.label}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'layout' && (
                <motion.div key="layout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30">
                  <h3 className="mb-4 text-lg text-cyan-400">Estructura</h3>
                  <div className="space-y-3">
                    {layouts.map((layout) => (
                      <motion.button key={layout.id} whileHover={{ scale: 1.02 }} onClick={() => setSelectedLayout(layout.id)}
                        className={`w-full p-4 rounded-xl text-left transition-all ${
                          selectedLayout === layout.id ? 'bg-slate-800 border-2 border-cyan-500/50' : 'bg-slate-950/50 border border-slate-700 hover:border-slate-600'
                        }`}>
                        <div className="h-16 mb-3 rounded-lg bg-slate-700 flex items-center justify-center overflow-hidden px-3">
                          {layout.id === 'modern' && (
                            <div className="w-full space-y-1 text-center">
                              <div className="h-2 bg-slate-500 rounded mx-auto w-1/2" />
                              <div className="h-1 bg-slate-600 rounded mx-auto w-1/3" />
                              <div className="h-px bg-slate-600 rounded w-full mt-1" />
                              <div className="h-1 bg-slate-600 rounded w-full" />
                            </div>
                          )}
                          {layout.id === 'classic' && (
                            <div className="w-full space-y-1">
                              <div className="h-2 bg-slate-500 rounded w-1/2" />
                              <div className="h-1 bg-slate-600 rounded w-1/3" />
                              <div className="h-px bg-slate-600 rounded w-full mt-1" />
                              <div className="h-1 bg-slate-600 rounded w-full" />
                            </div>
                          )}
                          {layout.id === 'minimal' && (
                            <div className="w-full space-y-1">
                              <div className="h-2 bg-slate-500 rounded w-1/3" />
                              <div className="h-px bg-slate-500 rounded w-full" />
                              <div className="h-1 bg-slate-600 rounded w-full" />
                              <div className="h-1 bg-slate-600 rounded w-2/3" />
                            </div>
                          )}
                        </div>
                        <p className="text-white font-medium">{layout.label}</p>
                        <p className="text-slate-500 text-sm">{layout.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'content' && (
                <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 space-y-5">
                  <h3 className="text-lg text-cyan-400">Editar contenido</h3>
                  <p className="text-slate-500 text-xs">También puedes hacer click directamente sobre el texto en la vista previa.</p>

                  {/* Campos básicos */}
                  {[
                    { label: 'Nombre', path: 'personalInfo.name' },
                    { label: 'Título profesional', path: 'personalInfo.title' },
                    { label: 'Email', path: 'personalInfo.email' },
                    { label: 'Teléfono', path: 'personalInfo.phone' },
                    { label: 'Ubicación', path: 'personalInfo.location' },
                    { label: 'LinkedIn', path: 'personalInfo.linkedin' },
                    { label: 'GitHub', path: 'personalInfo.github' },
                  ].map(field => (
                    <div key={field.path}>
                      <label className="block text-xs text-slate-500 mb-1">{field.label}</label>
                      <input value={field.path.split('.').reduce((obj: any, k) => obj?.[k] ?? '', data)}
                        onChange={e => update(field.path, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                    </div>
                  ))}

                  {/* Bio */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Sobre mí</label>
                    <textarea value={data?.personalInfo?.bio || ''}
                      onChange={e => update('personalInfo.bio', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50 resize-none" />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">Habilidades</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {data?.skills?.map((skill: string, idx: number) => (
                        <span key={idx} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs border border-slate-600 text-slate-300">
                          {skill}
                          <button onClick={() => removeSkill(idx)} className="text-red-400 hover:text-red-300 ml-1">
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addSkill()}
                        placeholder="Nueva habilidad..."
                        className="flex-1 px-3 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                      <button onClick={addSkill}
                        className="px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 transition-all">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botones */}
            <div className="space-y-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 transition-all shadow-lg flex items-center justify-center gap-2 text-white">
                {saved ? <><Check size={20} /><span>¡Guardado!</span></> : <><Save size={20} /><span>Guardar Cambios</span></>}
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleExport}
                className="w-full py-3 rounded-xl bg-slate-900/70 border border-cyan-500/30 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2 text-white">
                <Download size={20} /><span>Exportar / Imprimir</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Vista previa */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="sticky top-24">
              <div className="p-8 rounded-2xl bg-white min-h-[700px] shadow-2xl overflow-auto"
                style={{ fontFamily: selectedFont }}>

                {/* Header */}
                <div className={`pb-5 mb-6 border-b-2 ${headerAlign}`}
                  style={{ borderColor: primaryColor + '40' }}>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">
                    <EditableText value={data?.personalInfo?.name || ''} onSave={v => update('personalInfo.name', v)}
                      className="text-3xl font-bold text-slate-900" />
                  </h1>
                  <p className="text-lg mb-3">
                    <EditableText value={data?.personalInfo?.title || ''} onSave={v => update('personalInfo.title', v)}
                      style={{ color: primaryColor }} />
                  </p>
                  <div className={`flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-sm ${contactAlign}`}>
                    {data?.personalInfo?.email && <span>{data.personalInfo.email}</span>}
                    {data?.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
                    {data?.personalInfo?.location && <span>{data.personalInfo.location}</span>}
                    {data?.personalInfo?.linkedin && <span>{data.personalInfo.linkedin}</span>}
                  </div>
                </div>

                {/* Bio */}
                {data?.personalInfo?.bio && (
                  <div className="mb-6">
                    <h2 className="text-xs tracking-widest font-bold mb-2 uppercase" style={{ color: primaryColor }}>Sobre mí</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      <EditableText value={data.personalInfo.bio} onSave={v => update('personalInfo.bio', v)}
                        className="text-slate-600 text-sm leading-relaxed" multiline />
                    </p>
                  </div>
                )}

                {/* Experiencia */}
                {data?.experience?.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xs tracking-widest font-bold mb-3 uppercase" style={{ color: primaryColor }}>Experiencia</h2>
                    <div className="space-y-4">
                      {data.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="pl-3 border-l-2" style={{ borderColor: primaryColor + '60' }}>
                          <p className="font-semibold text-slate-800">
                            <EditableText value={exp.position || ''} onSave={v => {
                              const exp2 = [...data.experience]; exp2[idx] = { ...exp2[idx], position: v };
                              setData((p: any) => ({ ...p, experience: exp2 }));
                            }} />
                          </p>
                          <p className="text-slate-500 text-sm">
                            <EditableText value={exp.company || ''} onSave={v => {
                              const exp2 = [...data.experience]; exp2[idx] = { ...exp2[idx], company: v };
                              setData((p: any) => ({ ...p, experience: exp2 }));
                            }} />
                          </p>
                          <p className="text-slate-400 text-xs">{exp.startDate} — {exp.endDate || 'Actualidad'}</p>
                          {exp.description && (
                            <p className="text-slate-600 text-sm mt-1">
                              <EditableText value={exp.description} onSave={v => {
                                const exp2 = [...data.experience]; exp2[idx] = { ...exp2[idx], description: v };
                                setData((p: any) => ({ ...p, experience: exp2 }));
                              }} multiline />
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Educación */}
                {data?.education?.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xs tracking-widest font-bold mb-3 uppercase" style={{ color: primaryColor }}>Educación</h2>
                    <div className="space-y-3">
                      {data.education.map((edu: any, idx: number) => (
                        <div key={idx} className="pl-3 border-l-2" style={{ borderColor: primaryColor + '60' }}>
                          <p className="font-semibold text-slate-800">{edu.degree}</p>
                          <p className="text-slate-500 text-sm">{edu.institution}</p>
                          <p className="text-slate-400 text-xs">{edu.startDate} — {edu.endDate}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {data?.skills?.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xs tracking-widest font-bold mb-3 uppercase" style={{ color: primaryColor }}>Habilidades</h2>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill: string, idx: number) => (
                        <span key={idx} className="group relative px-3 py-1 rounded-full text-sm border"
                          style={{ borderColor: primaryColor + '60', color: primaryColor, backgroundColor: primaryColor + '10' }}>
                          {skill}
                          <button onClick={() => removeSkill(idx)}
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <X size={8} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proyectos */}
                {data?.projects?.length > 0 && (
                  <div>
                    <h2 className="text-xs tracking-widest font-bold mb-3 uppercase" style={{ color: primaryColor }}>Proyectos</h2>
                    <div className="space-y-3">
                      {data.projects.map((proj: any, idx: number) => (
                        <div key={idx} className="pl-3 border-l-2" style={{ borderColor: primaryColor + '60' }}>
                          <p className="font-semibold text-slate-800">{proj.name}</p>
                          <p className="text-slate-600 text-sm">{proj.description}</p>
                          {proj.technologies?.length > 0 && (
                            <p className="text-slate-400 text-xs mt-1">{proj.technologies.join(' · ')}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedLayout === 'minimal' && (
                  <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-300">
                    Creado con Visume
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
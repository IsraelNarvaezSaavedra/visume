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

type LayoutId = 'modern' | 'classic' | 'minimal';

function mapIncomingTemplate(t?: string): LayoutId {
  if (!t) return 'modern';
  const u = String(t).toLowerCase();
  if (u === 'minimal') return 'minimal';
  if (u === 'creative' || u === 'classic') return 'classic';
  return 'modern';
}

// ── Editor principal ────────────────────────────────────────────
interface EditorProps {
  resumeData: any;
}

export default function Editor({ resumeData }: EditorProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout' | 'content'>('colors');
  const [primaryColor, setPrimaryColor] = useState(resumeData?.style?.primaryColor || '#06b6d4');
  const [selectedFont, setSelectedFont] = useState(resumeData?.style?.font || 'Inter');
  const [selectedLayout, setSelectedLayout] = useState<LayoutId>(() => mapIncomingTemplate(resumeData?.style?.template));
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

  const layouts: { id: LayoutId; label: string; desc: string }[] = [
    { id: 'modern', label: 'Moderno', desc: 'Header centrado' },
    { id: 'classic', label: 'Clásico', desc: 'Barra lateral con contacto y habilidades' },
    { id: 'minimal', label: 'Minimalista', desc: 'Tipografía editorial y línea de tiempo' },
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

    const skillsHtmlMain = data?.skills?.map((s: string) =>
      `<span style="display:inline-block;padding:4px 12px;border-radius:999px;border:1px solid ${primaryColor};color:${primaryColor};background:${primaryColor}18;font-size:13px;margin:3px">${s}</span>`
    ).join('') || '';

    const skillsHtmlSidebar = data?.skills?.map((s: string) =>
      `<span style="display:inline-block;padding:4px 10px;border-radius:999px;border:1px solid rgba(255,255,255,0.35);color:#fff;background:rgba(255,255,255,0.1);font-size:12px;margin:3px">${s}</span>`
    ).join('') || '';

    const expHtmlDefault = data?.experience?.map((exp: any) => `
      <div style="margin-bottom:16px;padding-left:12px;border-left:2px solid ${primaryColor}80">
        <div style="font-weight:600;color:#1e293b">${exp.position || ''}</div>
        <div style="color:#64748b;font-size:14px">${exp.company || ''}</div>
        <div style="color:#94a3b8;font-size:12px">${exp.startDate || ''} — ${exp.endDate || 'Actualidad'}</div>
        ${exp.description ? `<div style="color:#475569;font-size:14px;margin-top:4px">${exp.description}</div>` : ''}
      </div>`).join('') || '';

    const expHtmlMinimal = data?.experience?.map((exp: any) => `
      <div style="display:grid;grid-template-columns:104px 1fr;gap:16px;padding:14px 0;border-bottom:1px solid #e2e8f0;align-items:start">
        <div style="font-size:11px;color:#94a3b8;line-height:1.45;text-align:right">${exp.startDate || ''} — ${exp.endDate || 'Actualidad'}</div>
        <div>
          <div style="font-weight:600;color:#1e293b">${exp.position || ''}</div>
          <div style="color:#64748b;font-size:14px">${exp.company || ''}</div>
          ${exp.description ? `<div style="color:#475569;font-size:14px;margin-top:6px">${exp.description}</div>` : ''}
        </div>
      </div>`).join('') || '';

    const eduHtml = data?.education?.map((edu: any) => `
      <div style="margin-bottom:12px;padding-left:12px;border-left:2px solid ${primaryColor}80">
        <div style="font-weight:600;color:#1e293b">${edu.degree || ''}</div>
        <div style="color:#64748b;font-size:14px">${edu.institution || ''}</div>
        <div style="color:#94a3b8;font-size:12px">${edu.startDate || ''} — ${edu.endDate || ''}</div>
      </div>`).join('') || '';

    const eduHtmlMinimal = data?.education?.map((edu: any) => `
      <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #f1f5f9">
        <div style="font-weight:600;color:#1e293b">${edu.degree || ''}</div>
        <div style="color:#64748b;font-size:14px">${edu.institution || ''}</div>
        <div style="color:#94a3b8;font-size:12px;margin-top:4px">${edu.startDate || ''} — ${edu.endDate || ''}</div>
      </div>`).join('') || '';

    const proyHtml = data?.projects?.map((p: any) => `
      <div style="margin-bottom:12px;padding-left:12px;border-left:2px solid ${primaryColor}80">
        <div style="font-weight:600;color:#1e293b">${p.name || ''}</div>
        <div style="color:#475569;font-size:14px">${p.description || ''}</div>
        ${p.technologies?.length ? `<div style="color:#94a3b8;font-size:12px;margin-top:2px">${p.technologies.join(' · ')}</div>` : ''}
      </div>`).join('') || '';

    const proyHtmlMinimal = data?.projects?.map((p: any) => `
      <div style="margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid #f1f5f9">
        <div style="font-weight:600;color:#1e293b">${p.name || ''}</div>
        <div style="color:#475569;font-size:14px;margin-top:4px">${p.description || ''}</div>
        ${p.technologies?.length ? `<div style="color:#94a3b8;font-size:12px;margin-top:4px">${p.technologies.join(' · ')}</div>` : ''}
      </div>`).join('') || '';

    const contacto = [
      data?.personalInfo?.email ? `${data.personalInfo.email}` : '',
      data?.personalInfo?.phone ? `${data.personalInfo.phone}` : '',
      data?.personalInfo?.location ? `${data.personalInfo.location}` : '',
      data?.personalInfo?.linkedin ? `${data.personalInfo.linkedin}` : '',
    ].filter(Boolean).join('  |  ');

    const contactBlocks = [
      data?.personalInfo?.email ? `<div style="font-size:13px;margin-bottom:8px;word-break:break-all;opacity:0.95">${data.personalInfo.email}</div>` : '',
      data?.personalInfo?.phone ? `<div style="font-size:13px;margin-bottom:8px;opacity:0.95">${data.personalInfo.phone}</div>` : '',
      data?.personalInfo?.location ? `<div style="font-size:13px;margin-bottom:8px;opacity:0.95">${data.personalInfo.location}</div>` : '',
      data?.personalInfo?.linkedin ? `<div style="font-size:12px;margin-bottom:8px;word-break:break-all;opacity:0.9">${data.personalInfo.linkedin}</div>` : '',
    ].filter(Boolean).join('');

    const bioBlock = data?.personalInfo?.bio
      ? `<div style="font-size:11px;letter-spacing:0.12em;font-weight:700;color:${primaryColor};margin:20px 0 10px;text-transform:uppercase">SOBRE MÍ</div><div style="font-size:14px;color:#475569;line-height:1.6;margin-bottom:20px">${data.personalInfo.bio}</div>`
      : '';

    const bioBlockMinimal = data?.personalInfo?.bio
      ? `<div style="font-size:13px;font-weight:500;color:#64748b;margin-bottom:8px">Sobre mí</div><div style="font-size:14px;color:#475569;line-height:1.65;margin-bottom:28px">${data.personalInfo.bio}</div>`
      : '';

    const sec = (label: string) => `<div style="font-size:11px;letter-spacing:0.12em;font-weight:700;color:${primaryColor};margin:20px 0 10px;text-transform:uppercase">${label}</div>`;
    const secMinimal = (label: string) => `<div style="font-size:13px;font-weight:500;color:#64748b;margin:28px 0 12px">${label}</div>`;

    let bodyInner = '';
    if (selectedLayout === 'classic') {
      bodyInner = `
        <div style="display:flex;gap:28px;align-items:flex-start">
          <aside style="width:220px;flex-shrink:0;background:${primaryColor};color:#fff;padding:24px;border-radius:14px">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.14em;opacity:0.85;margin-bottom:12px">CONTACTO</div>
            ${contactBlocks}
            ${skillsHtmlSidebar ? `<div style="font-size:10px;font-weight:700;letter-spacing:0.14em;opacity:0.85;margin:22px 0 10px">HABILIDADES</div><div>${skillsHtmlSidebar}</div>` : ''}
          </aside>
          <main style="flex:1;min-width:0">
            <div style="padding-bottom:16px;margin-bottom:20px;border-bottom:1px solid #e2e8f0">
              <h1 style="font-size:28px;font-weight:700;color:#0f172a;margin-bottom:4px">${nombre}</h1>
              <div style="font-size:16px;color:${primaryColor};margin-bottom:4px">${data?.personalInfo?.title || ''}</div>
            </div>
            ${bioBlock}
            ${expHtmlDefault ? `${sec('EXPERIENCIA')}${expHtmlDefault}` : ''}
            ${eduHtml ? `${sec('EDUCACIÓN')}${eduHtml}` : ''}
            ${proyHtml ? `${sec('PROYECTOS')}${proyHtml}` : ''}
          </main>
        </div>`;
    } else if (selectedLayout === 'minimal') {
      bodyInner = `
        <div style="padding-bottom:24px;margin-bottom:28px;border-bottom:1px solid #e2e8f0">
          <div style="display:flex;gap:24px;align-items:flex-end;flex-wrap:wrap">
            <div style="flex:1;min-width:200px">
              <h1 style="font-size:34px;font-weight:300;letter-spacing:-0.02em;color:#0f172a;margin-bottom:6px">${nombre}</h1>
              <div style="font-size:15px;color:#64748b;margin-bottom:10px">${data?.personalInfo?.title || ''}</div>
              <div style="font-size:13px;color:#94a3b8;line-height:1.5">${contacto}</div>
            </div>
          </div>
        </div>
        ${bioBlockMinimal}
        ${expHtmlMinimal ? `${secMinimal('Experiencia')}${expHtmlMinimal}` : ''}
        ${eduHtmlMinimal ? `${secMinimal('Educación')}${eduHtmlMinimal}` : ''}
        ${skillsHtmlMain ? `${secMinimal('Habilidades')}<div style="margin-bottom:8px">${skillsHtmlMain}</div>` : ''}
        ${proyHtmlMinimal ? `${secMinimal('Proyectos')}${proyHtmlMinimal}` : ''}`;
    } else {
      bodyInner = `
        <div class="header" style="text-align:center;padding-bottom:16px;border-bottom:2px solid ${primaryColor}30;margin-bottom:16px">
          <h1 style="font-size:28px;font-weight:700;color:#0f172a;margin-bottom:4px">${nombre}</h1>
          <div style="font-size:16px;color:${primaryColor};margin-bottom:8px">${data?.personalInfo?.title || ''}</div>
          <div style="font-size:13px;color:#64748b">${contacto}</div>
        </div>
        ${bioBlock}
        ${expHtmlDefault ? `${sec('EXPERIENCIA')}${expHtmlDefault}` : ''}
        ${eduHtml ? `${sec('EDUCACIÓN')}${eduHtml}` : ''}
        ${skillsHtmlMain ? `${sec('HABILIDADES')}<div style="margin-bottom:20px">${skillsHtmlMain}</div>` : ''}
        ${proyHtml ? `${sec('PROYECTOS')}${proyHtml}` : ''}`;
    }

    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
    <title>${nombre}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:${selectedFont},Arial,sans-serif;color:#1e293b;background:white;padding:40px;max-width:900px;margin:auto}
      @media print{body{padding:20px}}
    </style></head><body>
    ${bodyInner}
    <div style="margin-top:40px;padding-top:12px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#cbd5e1">Creado con Visume</div>
    </body></html>`;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  const sectionHeading = (label: string) => (
    <h2
      className={
        selectedLayout === 'minimal'
          ? 'text-sm font-medium text-slate-500 mb-4'
          : 'text-xs tracking-widest font-bold mb-3 uppercase'
      }
      style={selectedLayout === 'minimal' ? undefined : { color: primaryColor }}
    >
      {label}
    </h2>
  );

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
                            <div className="w-full flex gap-2 h-full items-stretch py-1">
                              <div className="w-1/4 rounded bg-cyan-500/80 shrink-0" />
                              <div className="flex-1 space-y-1">
                                <div className="h-2 bg-slate-500 rounded w-3/4" />
                                <div className="h-1 bg-slate-600 rounded w-1/2" />
                                <div className="h-px bg-slate-600 rounded w-full mt-1" />
                                <div className="h-1 bg-slate-600 rounded w-full" />
                              </div>
                            </div>
                          )}
                          {layout.id === 'minimal' && (
                            <div className="w-full flex gap-2 items-end py-1">
                              <div className="w-5 h-5 rounded bg-slate-500 shrink-0" />
                              <div className="flex-1 space-y-1">
                                <div className="h-2 bg-slate-500 rounded w-2/5" />
                                <div className="h-1 bg-slate-600 rounded w-full" />
                                <div className="h-1 bg-slate-600 rounded w-4/5" />
                              </div>
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
              <div
                className={`p-8 rounded-2xl bg-white min-h-[700px] shadow-2xl overflow-auto ${selectedLayout === 'minimal' ? 'border border-slate-200' : ''}`}
                style={{ fontFamily: selectedFont }}
              >
                {selectedLayout === 'classic' ? (
                  <div className="flex flex-col md:flex-row gap-8 md:items-start">
                    <aside
                      className="md:w-[220px] shrink-0 rounded-2xl p-6 text-white space-y-5 shadow-lg"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-2">Contacto</p>
                        <div className="space-y-2 text-sm text-white/95 break-words">
                          {data?.personalInfo?.email && <p>{data.personalInfo.email}</p>}
                          {data?.personalInfo?.phone && <p>{data.personalInfo.phone}</p>}
                          {data?.personalInfo?.location && <p>{data.personalInfo.location}</p>}
                          {data?.personalInfo?.linkedin && <p className="text-xs break-all opacity-90">{data.personalInfo.linkedin}</p>}
                        </div>
                      </div>
                      {data?.skills?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-2">Habilidades</p>
                          <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill: string, idx: number) => (
                              <span
                                key={idx}
                                className="group relative px-2.5 py-1 rounded-full text-xs border border-white/35 text-white bg-white/10"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => removeSkill(idx)}
                                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                  <X size={8} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </aside>
                    <div className="flex-1 min-w-0 space-y-6">
                      <div className="text-left pb-5 border-b border-slate-200">
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">
                          <EditableText
                            value={data?.personalInfo?.name || ''}
                            onSave={v => update('personalInfo.name', v)}
                            className="text-3xl font-bold text-slate-900"
                          />
                        </h1>
                        <p className="text-lg">
                          <EditableText
                            value={data?.personalInfo?.title || ''}
                            onSave={v => update('personalInfo.title', v)}
                            style={{ color: primaryColor }}
                          />
                        </p>
                      </div>
                      {data?.personalInfo?.bio && (
                        <div className="mb-2">
                          {sectionHeading('Sobre mí')}
                          <p className="text-slate-600 text-sm leading-relaxed">
                            <EditableText
                              value={data.personalInfo.bio}
                              onSave={v => update('personalInfo.bio', v)}
                              className="text-slate-600 text-sm leading-relaxed"
                              multiline
                            />
                          </p>
                        </div>
                      )}
                      {data?.experience?.length > 0 && (
                        <div>
                          {sectionHeading('Experiencia')}
                          <div className="space-y-4">
                            {data.experience.map((exp: any, idx: number) => (
                              <div key={idx} className="pl-3 border-l-2" style={{ borderColor: primaryColor + '60' }}>
                                <p className="font-semibold text-slate-800">
                                  <EditableText
                                    value={exp.position || ''}
                                    onSave={v => {
                                      const exp2 = [...data.experience];
                                      exp2[idx] = { ...exp2[idx], position: v };
                                      setData((p: any) => ({ ...p, experience: exp2 }));
                                    }}
                                  />
                                </p>
                                <p className="text-slate-500 text-sm">
                                  <EditableText
                                    value={exp.company || ''}
                                    onSave={v => {
                                      const exp2 = [...data.experience];
                                      exp2[idx] = { ...exp2[idx], company: v };
                                      setData((p: any) => ({ ...p, experience: exp2 }));
                                    }}
                                  />
                                </p>
                                <p className="text-slate-400 text-xs">
                                  {exp.startDate} — {exp.endDate || 'Actualidad'}
                                </p>
                                {exp.description && (
                                  <p className="text-slate-600 text-sm mt-1">
                                    <EditableText
                                      value={exp.description}
                                      onSave={v => {
                                        const exp2 = [...data.experience];
                                        exp2[idx] = { ...exp2[idx], description: v };
                                        setData((p: any) => ({ ...p, experience: exp2 }));
                                      }}
                                      multiline
                                    />
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {data?.education?.length > 0 && (
                        <div>
                          {sectionHeading('Educación')}
                          <div className="space-y-3">
                            {data.education.map((edu: any, idx: number) => (
                              <div key={idx} className="pl-3 border-l-2" style={{ borderColor: primaryColor + '60' }}>
                                <p className="font-semibold text-slate-800">{edu.degree}</p>
                                <p className="text-slate-500 text-sm">{edu.institution}</p>
                                <p className="text-slate-400 text-xs">
                                  {edu.startDate} — {edu.endDate}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {data?.projects?.length > 0 && (
                        <div>
                          {sectionHeading('Proyectos')}
                          <div className="space-y-4">
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
                    </div>
                  </div>
                ) : (
                  <>
                    {selectedLayout === 'minimal' ? (
                      <div className="pb-8 mb-8 border-b border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                          <div className="flex-1 min-w-0">
                            <h1 className="text-4xl font-light tracking-tight text-slate-900 mb-2">
                              <EditableText
                                value={data?.personalInfo?.name || ''}
                                onSave={v => update('personalInfo.name', v)}
                                className="text-4xl font-light tracking-tight text-slate-900"
                              />
                            </h1>
                            <p className="text-base text-slate-500 mb-3">
                              <EditableText
                                value={data?.personalInfo?.title || ''}
                                onSave={v => update('personalInfo.title', v)}
                                className="text-base text-slate-500"
                              />
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-sm">
                              {data?.personalInfo?.email && <span>{data.personalInfo.email}</span>}
                              {data?.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
                              {data?.personalInfo?.location && <span>{data.personalInfo.location}</span>}
                              {data?.personalInfo?.linkedin && <span>{data.personalInfo.linkedin}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="pb-5 mb-6 border-b-2 text-center" style={{ borderColor: primaryColor + '40' }}>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">
                          <EditableText
                            value={data?.personalInfo?.name || ''}
                            onSave={v => update('personalInfo.name', v)}
                            className="text-3xl font-bold text-slate-900"
                          />
                        </h1>
                        <p className="text-lg mb-3">
                          <EditableText
                            value={data?.personalInfo?.title || ''}
                            onSave={v => update('personalInfo.title', v)}
                            style={{ color: primaryColor }}
                          />
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-sm justify-center">
                          {data?.personalInfo?.email && <span>{data.personalInfo.email}</span>}
                          {data?.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
                          {data?.personalInfo?.location && <span>{data.personalInfo.location}</span>}
                          {data?.personalInfo?.linkedin && <span>{data.personalInfo.linkedin}</span>}
                        </div>
                      </div>
                    )}

                    {data?.personalInfo?.bio && (
                      <div className="mb-6">
                        {sectionHeading('Sobre mí')}
                        <p className="text-slate-600 text-sm leading-relaxed">
                          <EditableText
                            value={data.personalInfo.bio}
                            onSave={v => update('personalInfo.bio', v)}
                            className="text-slate-600 text-sm leading-relaxed"
                            multiline
                          />
                        </p>
                      </div>
                    )}

                    {data?.experience?.length > 0 && (
                      <div className="mb-6">
                        {sectionHeading('Experiencia')}
                        <div className={selectedLayout === 'minimal' ? 'space-y-0' : 'space-y-4'}>
                          {data.experience.map((exp: any, idx: number) => (
                            <div
                              key={idx}
                              className={
                                selectedLayout === 'minimal'
                                  ? 'grid grid-cols-1 sm:grid-cols-[6.75rem_1fr] gap-2 sm:gap-5 py-4 border-b border-slate-100 last:border-b-0'
                                  : 'pl-3 border-l-2 space-y-1'
                              }
                              style={selectedLayout === 'minimal' ? undefined : { borderColor: primaryColor + '60' }}
                            >
                              {selectedLayout === 'minimal' && (
                                <div className="text-[11px] sm:text-xs text-slate-400 sm:text-right leading-snug pt-0.5 whitespace-nowrap sm:whitespace-normal">
                                  {exp.startDate}
                                  <span className="hidden sm:inline"> — </span>
                                  <span className="sm:hidden"> </span>
                                  {exp.endDate || 'Actualidad'}
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-slate-800">
                                  <EditableText
                                    value={exp.position || ''}
                                    onSave={v => {
                                      const exp2 = [...data.experience];
                                      exp2[idx] = { ...exp2[idx], position: v };
                                      setData((p: any) => ({ ...p, experience: exp2 }));
                                    }}
                                  />
                                </p>
                                <p className="text-slate-500 text-sm">
                                  <EditableText
                                    value={exp.company || ''}
                                    onSave={v => {
                                      const exp2 = [...data.experience];
                                      exp2[idx] = { ...exp2[idx], company: v };
                                      setData((p: any) => ({ ...p, experience: exp2 }));
                                    }}
                                  />
                                </p>
                                {selectedLayout !== 'minimal' && (
                                  <p className="text-slate-400 text-xs">
                                    {exp.startDate} — {exp.endDate || 'Actualidad'}
                                  </p>
                                )}
                                {exp.description && (
                                  <p className="text-slate-600 text-sm mt-1">
                                    <EditableText
                                      value={exp.description}
                                      onSave={v => {
                                        const exp2 = [...data.experience];
                                        exp2[idx] = { ...exp2[idx], description: v };
                                        setData((p: any) => ({ ...p, experience: exp2 }));
                                      }}
                                      multiline
                                    />
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data?.education?.length > 0 && (
                      <div className="mb-6">
                        {sectionHeading('Educación')}
                        <div className="space-y-3">
                          {data.education.map((edu: any, idx: number) => (
                            <div
                              key={idx}
                              className={
                                selectedLayout === 'minimal'
                                  ? 'pb-3 border-b border-slate-100 last:border-0'
                                  : 'pl-3 border-l-2'
                              }
                              style={selectedLayout === 'minimal' ? undefined : { borderColor: primaryColor + '60' }}
                            >
                              <p className="font-semibold text-slate-800">{edu.degree}</p>
                              <p className="text-slate-500 text-sm">{edu.institution}</p>
                              <p className="text-slate-400 text-xs">
                                {edu.startDate} — {edu.endDate}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data?.skills?.length > 0 && (
                      <div className="mb-6">
                        {sectionHeading('Habilidades')}
                        <div className="flex flex-wrap gap-2">
                          {data.skills.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="group relative px-3 py-1 rounded-full text-sm border"
                              style={{
                                borderColor: primaryColor + '60',
                                color: primaryColor,
                                backgroundColor: primaryColor + '10',
                              }}
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(idx)}
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <X size={8} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {data?.projects?.length > 0 && (
                      <div>
                        {sectionHeading('Proyectos')}
                        <div className="space-y-4">
                          {data.projects.map((proj: any, idx: number) => (
                            <div
                              key={idx}
                              className={
                                selectedLayout === 'minimal'
                                  ? 'pb-4 border-b border-slate-100 last:border-0'
                                  : 'pl-3 border-l-2'
                              }
                              style={selectedLayout === 'minimal' ? undefined : { borderColor: primaryColor + '60' }}
                            >
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
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
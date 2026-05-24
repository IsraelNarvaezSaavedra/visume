
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette, Type, Layout, Edit3, Image, Download, Globe, Award, Check, X, Plus, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CurriculumFotos from "./CurriculumFotos";

// ── EditableText ────────────────────────────────────────────────
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

// ── Editor ──────────────────────────────────────────────────────
interface EditorProps {
  resumeData: any;
}

export default function Editor({ resumeData }: EditorProps) {
  const { token, plan, maxFotosCv } = useAuth();
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'layout' | 'content' | 'photos'>('colors');
  const [primaryColor, setPrimaryColor] = useState(resumeData?.style?.primaryColor || '#06b6d4');
  const [selectedFont, setSelectedFont] = useState(resumeData?.style?.font || 'Inter');
  const [selectedLayout, setSelectedLayout] = useState(resumeData?.style?.template || 'modern');
  const [data, setData] = useState(resumeData);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'technical' | 'soft' | 'tools'>('technical');
const [loading, setLoading] = useState(!!resumeData?.id);

useEffect(() => {
  // Intenta usar el id del resumeData, o el guardado en localStorage
  const id = resumeData?.id || localStorage.getItem('visume_current_cv_id');
  if (!id) return;

  setLoading(true);
  fetch(`http://localhost:8080/api/curriculum/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(loaded => {
      setData(loaded);
      setPrimaryColor(loaded?.style?.primaryColor || '#06b6d4');
      setSelectedFont(loaded?.style?.font || 'Inter');
      setSelectedLayout(loaded?.style?.template || 'modern');
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);
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
    { id: 'modern', label: 'Moderno', desc: 'Header centrado con franja de color' },
    { id: 'classic', label: 'Clásico', desc: 'Sidebar lateral con datos de contacto' },
    { id: 'minimal', label: 'Minimalista', desc: 'Tipografía limpia sin decoración' },
  ];

  const tabs = [
    { id: 'colors' as const, icon: Palette, label: 'Colores' },
    { id: 'fonts' as const, icon: Type, label: 'Fuentes' },
    { id: 'layout' as const, icon: Layout, label: 'Layout' },
    { id: 'content' as const, icon: Edit3, label: 'Contenido' },
    { id: 'photos' as const,  icon: Image,   label: 'Fotos'     },
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

  const updateExp = (idx: number, field: string, value: any) => {
    setData((prev: any) => {
      const e2 = JSON.parse(JSON.stringify(prev.experience));
      e2[idx][field] = value;
      return { ...prev, experience: e2 };
    });
  };

  const updateEdu = (idx: number, field: string, value: any) => {
    setData((prev: any) => {
      const e2 = JSON.parse(JSON.stringify(prev.education));
      e2[idx][field] = value;
      return { ...prev, education: e2 };
    });
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setData((prev: any) => ({
      ...prev,
      skills: { ...prev.skills, [newSkillCategory]: [...(prev.skills?.[newSkillCategory] || []), newSkill.trim()] }
    }));
    setNewSkill('');
  };

  const removeSkill = (category: string, idx: number) => {
    setData((prev: any) => ({
      ...prev,
      skills: { ...prev.skills, [category]: prev.skills[category].filter((_: any, i: number) => i !== idx) }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSave = {
        ...data,
        style: { ...data.style, primaryColor, font: selectedFont, template: selectedLayout }
      };
      const res = await fetch(`http://localhost:8080/api/curriculum/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(dataToSave),
      });
      if (!res.ok) throw new Error('Error guardando');
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const nombre = data?.personalInfo?.name || 'curriculum';
    const allSkills = [...(data?.skills?.technical || []), ...(data?.skills?.tools || []), ...(data?.skills?.soft || [])];

    const skillsHtml = allSkills.map((s: string) =>
      `<span style="display:inline-block;padding:4px 12px;border-radius:999px;border:1px solid ${primaryColor};color:${primaryColor};background:${primaryColor}18;font-size:13px;margin:3px">${s}</span>`
    ).join('');

    const expHtml = data?.experience?.map((exp: any) => `
      <div style="margin-bottom:20px;padding-left:12px;border-left:2px solid ${primaryColor}80">
        <div style="font-weight:600;color:#1e293b">${exp.position || ''}</div>
        <div style="color:${primaryColor};font-size:14px">${exp.company || ''}${exp.location ? ` · ${exp.location}` : ''}</div>
        <div style="color:#94a3b8;font-size:12px">${exp.startDate || ''} — ${exp.endDate || 'Actualidad'}</div>
        ${exp.description ? `<div style="color:#475569;font-size:14px;margin-top:6px;line-height:1.6">${exp.description}</div>` : ''}
        ${exp.achievements?.length ? `<ul style="margin-top:6px;padding-left:16px">${exp.achievements.map((a: string) => `<li style="color:#475569;font-size:13px;margin-bottom:3px">${a}</li>`).join('')}</ul>` : ''}
      </div>`).join('') || '';

    const eduHtml = data?.education?.map((edu: any) => `
      <div style="margin-bottom:14px;padding-left:12px;border-left:2px solid ${primaryColor}80">
        <div style="font-weight:600;color:#1e293b">${edu.degree || ''}${edu.field ? ` en ${edu.field}` : ''}</div>
        <div style="color:#64748b;font-size:14px">${edu.institution || ''}${edu.location ? ` · ${edu.location}` : ''}</div>
        <div style="color:#94a3b8;font-size:12px">${edu.startDate || ''} — ${edu.endDate || ''}</div>
        ${edu.description ? `<div style="color:#475569;font-size:13px;margin-top:4px">${edu.description}</div>` : ''}
      </div>`).join('') || '';

    const langHtml = data?.languages?.map((l: any) =>
      `<span style="display:inline-block;margin-right:16px;font-size:14px"><strong>${l.language}</strong> — ${l.level}</span>`
    ).join('') || '';

    const certHtml = data?.certifications?.map((c: any) =>
      `<div style="margin-bottom:8px;font-size:14px"><strong>${c.name}</strong>${c.issuer ? ` · ${c.issuer}` : ''}${c.date ? ` · ${c.date}` : ''}</div>`
    ).join('') || '';

    const contacto = [data?.personalInfo?.email, data?.personalInfo?.phone, data?.personalInfo?.location, data?.personalInfo?.linkedin].filter(Boolean).join('  |  ');

    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${nombre}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:${selectedFont},Arial,sans-serif;color:#1e293b;background:white;padding:40px;max-width:800px;margin:auto}
      @media print{body{padding:20px}}
      .sec{font-size:11px;letter-spacing:.12em;font-weight:700;color:${primaryColor};margin:20px 0 10px;text-transform:uppercase;border-bottom:1px solid ${primaryColor}30;padding-bottom:4px}
    </style></head><body>
    ${selectedLayout === 'modern' ? `
      <div style="background:${primaryColor};padding:32px;margin:-40px -40px 32px;text-align:center">
        <h1 style="font-size:28px;font-weight:700;color:white;margin-bottom:4px">${nombre}</h1>
        <div style="font-size:15px;color:rgba(255,255,255,0.85);margin-bottom:8px">${data?.personalInfo?.title || ''}</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.7)">${contacto}</div>
      </div>` : `
      <div style="padding-bottom:16px;border-bottom:2px solid ${primaryColor}30;margin-bottom:16px">
        <h1 style="font-size:26px;font-weight:700;color:#0f172a;margin-bottom:4px">${nombre}</h1>
        <div style="font-size:15px;color:${primaryColor};margin-bottom:8px">${data?.personalInfo?.title || ''}</div>
        <div style="font-size:12px;color:#64748b">${contacto}</div>
      </div>`}
    ${data?.personalInfo?.bio ? `<div class="sec">SOBRE MÍ</div><p style="font-size:14px;color:#475569;line-height:1.6;margin-bottom:20px">${data.personalInfo.bio}</p>` : ''}
    ${expHtml ? `<div class="sec">EXPERIENCIA PROFESIONAL</div>${expHtml}` : ''}
    ${eduHtml ? `<div class="sec">FORMACIÓN ACADÉMICA</div>${eduHtml}` : ''}
    ${skillsHtml ? `<div class="sec">HABILIDADES</div><div style="margin-bottom:20px">${skillsHtml}</div>` : ''}
    ${langHtml ? `<div class="sec">IDIOMAS</div><div style="margin-bottom:16px">${langHtml}</div>` : ''}
    ${certHtml ? `<div class="sec">CERTIFICACIONES</div>${certHtml}` : ''}
    <div style="margin-top:40px;padding-top:12px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#cbd5e1">Creado con Visume</div>
    </body></html>`;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  // ── Componente de sección ──────────────────────────────────────
  const SectionTitle = ({ children }: { children: string }) => {
    if (selectedLayout === 'minimal') {
      return <h2 className="text-xs tracking-widest font-bold mb-3 uppercase text-slate-400 mt-6">{children}</h2>;
    }
    return (
      <h2 className="text-xs tracking-widest font-bold mb-3 uppercase pb-1 border-b"
        style={{ color: primaryColor, borderColor: primaryColor + '40' }}>{children}</h2>
    );
  };

  // ── Contenido del CV ───────────────────────────────────────────
  const CVContent = () => (
    <>
      {data?.personalInfo?.bio && (
        <div className="mb-6">
          <SectionTitle>Sobre mí</SectionTitle>
          <p className="text-slate-600 text-sm leading-relaxed">
            <EditableText value={data.personalInfo.bio} onSave={v => update('personalInfo.bio', v)} multiline />
          </p>
        </div>
      )}

      {data?.experience?.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Experiencia Profesional</SectionTitle>
          <div className="space-y-5">
            {data.experience.map((exp: any, idx: number) => (
              <div key={idx} className={selectedLayout === 'minimal' ? 'mb-4' : 'pl-3 border-l-2'} style={selectedLayout !== 'minimal' ? { borderColor: primaryColor + '60' } : {}}>
                <p className="font-semibold text-slate-800">
                  <EditableText value={exp.position || ''} onSave={v => updateExp(idx, 'position', v)} />
                </p>
                <p className="text-sm" style={{ color: selectedLayout === 'minimal' ? '#64748b' : primaryColor }}>
                  <EditableText value={exp.company || ''} onSave={v => updateExp(idx, 'company', v)} />
                  {exp.location && <span className="text-slate-400"> · {exp.location}</span>}
                </p>
                <p className="text-slate-400 text-xs mb-2">{exp.startDate} — {exp.endDate || 'Actualidad'}</p>
                {exp.description && (
                  <p className="text-slate-600 text-sm leading-relaxed mb-2">
                    <EditableText value={exp.description} onSave={v => updateExp(idx, 'description', v)} multiline />
                  </p>
                )}
                {exp.achievements?.length > 0 && (
                  <ul className="space-y-1">
                    {exp.achievements.map((a: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                        <span style={{ color: primaryColor }} className="mt-1 flex-shrink-0">▸</span>
                        <EditableText value={a} onSave={v => {
                          const e2 = JSON.parse(JSON.stringify(data.experience));
                          e2[idx].achievements[i] = v;
                          setData((p: any) => ({ ...p, experience: e2 }));
                        }} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.education?.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Formación Académica</SectionTitle>
          <div className="space-y-4">
            {data.education.map((edu: any, idx: number) => (
              <div key={idx} className={selectedLayout === 'minimal' ? 'mb-3' : 'pl-3 border-l-2'} style={selectedLayout !== 'minimal' ? { borderColor: primaryColor + '60' } : {}}>
                <p className="font-semibold text-slate-800">
                  <EditableText value={edu.degree || ''} onSave={v => updateEdu(idx, 'degree', v)} />
                  {edu.field && <span className="font-normal text-slate-600"> en <EditableText value={edu.field} onSave={v => updateEdu(idx, 'field', v)} /></span>}
                </p>
                <p className="text-slate-500 text-sm">
                  <EditableText value={edu.institution || ''} onSave={v => updateEdu(idx, 'institution', v)} />
                  {edu.location && <span> · {edu.location}</span>}
                </p>
                <p className="text-slate-400 text-xs">{edu.startDate} — {edu.endDate}</p>
                {edu.description && (
                  <p className="text-slate-600 text-sm mt-1">
                    <EditableText value={edu.description} onSave={v => updateEdu(idx, 'description', v)} multiline />
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.skills && (
        <div className="mb-6">
          <SectionTitle>Habilidades</SectionTitle>
          <div className="space-y-3">
            {[{ key: 'technical', label: 'Técnicas' }, { key: 'tools', label: 'Herramientas' }, { key: 'soft', label: 'Competencias' }].map(({ key, label }) => (
              data?.skills?.[key]?.length > 0 && (
                <div key={key}>
                  <p className="text-xs text-slate-400 mb-1">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {data.skills[key].map((skill: string, idx: number) => (
                      <span key={idx} className="group relative px-3 py-1 rounded-full text-xs border"
                        style={{ borderColor: primaryColor + '60', color: primaryColor, backgroundColor: primaryColor + '10' }}>
                        {skill}
                        <button onClick={() => removeSkill(key, idx)}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <X size={8} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {data?.languages?.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Idiomas</SectionTitle>
          <div className="flex flex-wrap gap-4">
            {data.languages.map((l: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <Globe size={14} style={{ color: primaryColor }} />
                <span className="text-slate-700 text-sm font-medium">
                  <EditableText value={l.language} onSave={v => {
                    const l2 = [...data.languages]; l2[idx] = { ...l2[idx], language: v };
                    setData((p: any) => ({ ...p, languages: l2 }));
                  }} />
                </span>
                <span className="text-slate-400 text-xs">— {l.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.certifications?.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Certificaciones</SectionTitle>
          <div className="space-y-2">
            {data.certifications.map((c: any, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <Award size={14} style={{ color: primaryColor }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <EditableText value={c.name || ''} onSave={v => {
                    const c2 = [...data.certifications]; c2[idx] = { ...c2[idx], name: v };
                    setData((p: any) => ({ ...p, certifications: c2 }));
                  }} className="text-slate-800 text-sm font-medium" />
                  {c.issuer && <span className="text-slate-500 text-sm"> · {c.issuer}</span>}
                  {c.date && <span className="text-slate-400 text-xs"> · {c.date}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.projects?.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Proyectos</SectionTitle>
          <div className="space-y-3">
            {data.projects.map((proj: any, idx: number) => (
              <div key={idx} className="pl-3 border-l-2" style={{ borderColor: primaryColor + '60' }}>
                <p className="font-semibold text-slate-800">{proj.name}</p>
                <p className="text-slate-600 text-sm">{proj.description}</p>
                {proj.technologies?.length > 0 && <p className="text-slate-400 text-xs mt-1">{proj.technologies.join(' · ')}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.interests?.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Intereses</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {data.interests.map((interest: string, idx: number) => (
              <span key={idx} className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-600">{interest}</span>
            ))}
          </div>
        </div>
      )}
    </>
  );

  // ── Layouts ────────────────────────────────────────────────────
  const PreviewModern = () => (
    <div style={{ fontFamily: selectedFont }}>
      {/* Header con franja de color */}
      <div className="px-8 py-8 text-center mb-6 -mx-8 -mt-8"
        style={{ backgroundColor: primaryColor }}>
        <h1 className="text-3xl font-bold text-white mb-1">
          <EditableText value={data?.personalInfo?.name || ''} onSave={v => update('personalInfo.name', v)} className="text-white" />
        </h1>
        <p className="text-lg mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
          <EditableText value={data?.personalInfo?.title || ''} onSave={v => update('personalInfo.title', v)} style={{ color: 'rgba(255,255,255,0.85)' }} />
        </p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {data?.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data?.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {data?.personalInfo?.location && <span>{data.personalInfo.location}</span>}
          {data?.personalInfo?.linkedin && <span>{data.personalInfo.linkedin}</span>}
        </div>
      </div>
      <div className="px-2"><CVContent /></div>
    </div>
  );

  const PreviewClassic = () => (
    <div className="flex gap-0" style={{ fontFamily: selectedFont }}>
      {/* Sidebar */}
      <div className="w-48 flex-shrink-0 p-5 min-h-full" style={{ backgroundColor: primaryColor + '15' }}>
        <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white"
          style={{ backgroundColor: primaryColor }}>
          {data?.personalInfo?.name?.[0] || '?'}
        </div>
        <h1 className="text-base font-bold text-slate-900 text-center mb-1">
          <EditableText value={data?.personalInfo?.name || ''} onSave={v => update('personalInfo.name', v)} />
        </h1>
        <p className="text-xs text-center mb-4" style={{ color: primaryColor }}>
          <EditableText value={data?.personalInfo?.title || ''} onSave={v => update('personalInfo.title', v)} style={{ color: primaryColor }} />
        </p>
        <div className="space-y-2 text-xs text-slate-600 border-t pt-3" style={{ borderColor: primaryColor + '40' }}>
          {data?.personalInfo?.email && <p className="break-all">{data.personalInfo.email}</p>}
          {data?.personalInfo?.phone && <p>{data.personalInfo.phone}</p>}
          {data?.personalInfo?.location && <p>{data.personalInfo.location}</p>}
          {data?.personalInfo?.linkedin && <p className="break-all">{data.personalInfo.linkedin}</p>}
        </div>
        {data?.languages?.length > 0 && (
          <div className="mt-4 border-t pt-3" style={{ borderColor: primaryColor + '40' }}>
            <p className="text-xs font-bold uppercase mb-2" style={{ color: primaryColor }}>Idiomas</p>
            {data.languages.map((l: any, i: number) => (
              <p key={i} className="text-xs text-slate-600">{l.language} — {l.level}</p>
            ))}
          </div>
        )}
        {data?.skills?.technical?.length > 0 && (
          <div className="mt-4 border-t pt-3" style={{ borderColor: primaryColor + '40' }}>
            <p className="text-xs font-bold uppercase mb-2" style={{ color: primaryColor }}>Skills</p>
            {data.skills.technical.map((s: string, i: number) => (
              <p key={i} className="text-xs text-slate-600 mb-1">{s}</p>
            ))}
          </div>
        )}
      </div>
      {/* Contenido principal */}
      <div className="flex-1 p-5 overflow-auto"><CVContent /></div>
    </div>
  );

  const PreviewMinimal = () => (
    <div className="px-4" style={{ fontFamily: selectedFont }}>
      <div className="mb-8 pb-4" style={{ borderBottom: `1px solid ${primaryColor}` }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-1">
          <EditableText value={data?.personalInfo?.name || ''} onSave={v => update('personalInfo.name', v)} />
        </h1>
        <p className="text-lg text-slate-500 mb-3">
          <EditableText value={data?.personalInfo?.title || ''} onSave={v => update('personalInfo.title', v)} />
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-400 text-sm">
          {data?.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data?.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {data?.personalInfo?.location && <span>{data.personalInfo.location}</span>}
          {data?.personalInfo?.linkedin && <span>{data.personalInfo.linkedin}</span>}
        </div>
      </div>
      <CVContent />
    </div>
  );

  if (loading) return (
  <div className="min-h-screen flex items-center justify-center">
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500" />
  </div>
);

  return (
    <section className="relative min-h-screen py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h2 className="mb-4 text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Editor de Diseño
          </h2>
          <p className="text-lg text-slate-400">Haz click en cualquier texto para editarlo</p>
        </motion.div>

        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
          {/* Panel izquierdo */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="p-2 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30 grid grid-cols-5 gap-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl transition-all text-xs ${activeTab === tab.id ? 'bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
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
                        className={`p-3 rounded-xl cursor-pointer text-center ${primaryColor === color.value ? 'ring-2 ring-white/50' : ''}`}>
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
                        className={`w-full p-4 rounded-xl text-left transition-all ${selectedFont === font.name ? 'bg-slate-800 border-2 border-cyan-500/50' : 'bg-slate-950/50 border border-slate-700'}`}
                        style={{ fontFamily: font.name }}>
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
                        className={`w-full p-4 rounded-xl text-left transition-all ${selectedLayout === layout.id ? 'bg-slate-800 border-2 border-cyan-500/50' : 'bg-slate-950/50 border border-slate-700'}`}>
                        <div className="h-14 mb-3 rounded-lg overflow-hidden bg-slate-700">
                          {layout.id === 'modern' && (
                            <div className="h-full flex flex-col">
                              <div className="h-6 flex-shrink-0" style={{ backgroundColor: primaryColor + '80' }} />
                              <div className="flex-1 p-1 space-y-1">
                                <div className="h-1 bg-slate-500 rounded w-2/3 mx-auto" />
                                <div className="h-1 bg-slate-600 rounded w-full" />
                              </div>
                            </div>
                          )}
                          {layout.id === 'classic' && (
                            <div className="h-full flex">
                              <div className="w-10 flex-shrink-0" style={{ backgroundColor: primaryColor + '30' }} />
                              <div className="flex-1 p-1 space-y-1">
                                <div className="h-1.5 bg-slate-500 rounded w-1/2" />
                                <div className="h-1 bg-slate-600 rounded w-full" />
                                <div className="h-1 bg-slate-600 rounded w-3/4" />
                              </div>
                            </div>
                          )}
                          {layout.id === 'minimal' && (
                            <div className="h-full p-2 space-y-1">
                              <div className="h-2 bg-slate-400 rounded w-1/3" />
                              <div className="h-px rounded w-full" style={{ backgroundColor: primaryColor + '80' }} />
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
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Sobre mí</label>
                    <textarea value={data?.personalInfo?.bio || ''} onChange={e => update('personalInfo.bio', e.target.value)}
                      rows={4} className="w-full px-3 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-2">Habilidades</label>
                    <div className="flex gap-2 mb-3">
                      {(['technical', 'soft', 'tools'] as const).map(cat => (
                        <button key={cat} onClick={() => setNewSkillCategory(cat)}
                          className={`px-2 py-1 rounded text-xs transition-all ${newSkillCategory === cat ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'bg-slate-800 text-slate-400'}`}>
                          {cat === 'technical' ? 'Técnicas' : cat === 'soft' ? 'Blandas' : 'Herramientas'}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(data?.skills?.[newSkillCategory] || []).map((skill: string, idx: number) => (
                        <span key={idx} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs border border-slate-600 text-slate-300">
                          {skill}
                          <button onClick={() => removeSkill(newSkillCategory, idx)} className="text-red-400"><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="Nueva habilidad..."
                        className="flex-1 px-3 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                      <button onClick={addSkill} className="px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'photos' && (
  <motion.div key="photos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
    className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30">
    <h3 className="mb-4 text-lg text-cyan-400">Fotos del CV</h3>
    {data?.id ? (
      <CurriculumFotos
        idCurriculum={data.id}
        esPremium={plan === 'premium'}
        maxFotos={maxFotosCv}
      />
    ) : (
      <p className="text-slate-400 text-sm">Guarda el CV primero para poder añadir fotos.</p>
    )}
  </motion.div>
)}
            </AnimatePresence>

            <div className="space-y-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 transition-all shadow-lg flex items-center justify-center gap-2 text-white disabled:opacity-70">
                {saved ? <><Check size={20} /><span>¡Guardado!</span></> : saving ? <span>Guardando...</span> : <><Save size={20} /><span>Guardar Cambios</span></>}
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
              <AnimatePresence mode="wait">
                <motion.div key={selectedLayout} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="rounded-2xl bg-white shadow-2xl overflow-auto max-h-[85vh]"
                  style={{ padding: selectedLayout === 'classic' ? '0' : '2rem' }}>
                  {selectedLayout === 'modern' && <PreviewModern />}
                  {selectedLayout === 'classic' && <PreviewClassic />}
                  {selectedLayout === 'minimal' && <PreviewMinimal />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
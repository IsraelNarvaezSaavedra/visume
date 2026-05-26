import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { apiUrl } from '../../config/api';
interface CVTemplateProps {
  data: any;
  primaryColor: string;
  font: string;
}

function SlideIn({ children, from = 'left', delay = 0 }: { children: React.ReactNode; from?: 'left' | 'right' | 'bottom'; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const initial = from === 'left' ? { x: -60, opacity: 0 } : from === 'right' ? { x: 60, opacity: 0 } : { y: 60, opacity: 0 };

  return (
    <motion.div ref={ref}
      initial={initial}
      animate={inView ? { x: 0, y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

export default function BoldTemplate({ data, primaryColor, font }: CVTemplateProps) {
  return (
    <div style={{ fontFamily: font }} className="min-h-screen bg-white">

      {/* Header bold con diagonal */}
      <div className="relative overflow-hidden" style={{ backgroundColor: primaryColor, minHeight: '50vh' }}>
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-black/10" style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} />

        <div className="relative z-10 px-12 py-16">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}>
              <motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
  className="w-24 h-24 rounded-full mb-6 overflow-hidden border-4"
  style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
  {data?.fotoPrincipal ? (
    <img src={apiUrl(data.fotoPrincipal)} alt="foto" className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white"
      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
      {data?.personalInfo?.name?.[0] || '?'}
    </div>
  )}
</motion.div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-2">
              {data?.personalInfo?.name?.split(' ')[0]}
            </h1>
            <h1 className="text-6xl md:text-8xl font-black leading-none mb-6"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              {data?.personalInfo?.name?.split(' ').slice(1).join(' ')}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-block bg-white px-6 py-3 mb-8"
            style={{ color: primaryColor }}>
            <span className="font-black text-xl uppercase tracking-wider">{data?.personalInfo?.title}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-6 text-white/80 text-sm">
            {data?.personalInfo?.email && <span>{data.personalInfo.email}</span>}
            {data?.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
            {data?.personalInfo?.location && <span>{data.personalInfo.location}</span>}
            {data?.personalInfo?.linkedin && <span>{data.personalInfo.linkedin}</span>}
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-16">

        {/* Bio */}
        {data?.personalInfo?.bio && (
          <SlideIn from="left">
            <div className="mb-16 flex gap-6 items-start">
              <div className="w-2 flex-shrink-0 self-stretch rounded-full" style={{ backgroundColor: primaryColor }} />
              <p className="text-lg text-slate-600 leading-relaxed font-light">{data.personalInfo.bio}</p>
            </div>
          </SlideIn>
        )}

        <div className="grid md:grid-cols-[1fr_320px] gap-12">
          {/* Columna principal */}
          <div className="space-y-12">

            {/* Experiencia */}
            {data?.experience?.length > 0 && (
              <div>
                <SlideIn from="left">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 rounded flex items-center justify-center text-white font-black text-sm"
                      style={{ backgroundColor: primaryColor }}>E</div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Experiencia</h2>
                  </div>
                </SlideIn>
                <div className="space-y-8">
                  {data.experience.map((exp: any, idx: number) => (
                    <SlideIn key={idx} from="left" delay={idx * 0.1}>
                      <div className="group">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-black text-slate-900">{exp.position}</h3>
                            <p className="font-bold" style={{ color: primaryColor }}>{exp.company}</p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded"
                              style={{ backgroundColor: primaryColor + '15', color: primaryColor }}>
                              {exp.startDate} — {exp.endDate || 'Hoy'}
                            </span>
                          </div>
                        </div>
                        {exp.description && <p className="text-slate-600 text-sm leading-relaxed mb-2">{exp.description}</p>}
                        {exp.achievements?.length > 0 && (
                          <ul className="space-y-1">
                            {exp.achievements.map((a: string, i: number) => (
                              <li key={i} className="flex gap-2 text-slate-600 text-sm">
                                <span className="font-black" style={{ color: primaryColor }}>+</span> {a}
                              </li>
                            ))}
                          </ul>
                        )}
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-px mt-6"
                          style={{ backgroundColor: primaryColor + '20' }}
                        />
                      </div>
                    </SlideIn>
                  ))}
                </div>
              </div>
            )}

            {/* Educación */}
            {data?.education?.length > 0 && (
              <div>
                <SlideIn from="left">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 rounded flex items-center justify-center text-white font-black text-sm"
                      style={{ backgroundColor: primaryColor }}>F</div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Formación</h2>
                  </div>
                </SlideIn>
                <div className="space-y-4">
                  {data.education.map((edu: any, idx: number) => (
                    <SlideIn key={idx} from="left" delay={idx * 0.1}>
                      <div className="p-5 border-l-4" style={{ borderColor: primaryColor }}>
                        <p className="font-black text-slate-900">{edu.degree}{edu.field ? ` en ${edu.field}` : ''}</p>
                        <p className="font-medium" style={{ color: primaryColor }}>{edu.institution}</p>
                        <p className="text-sm text-slate-400">{edu.startDate} — {edu.endDate}</p>
                      </div>
                    </SlideIn>
                  ))}
                </div>
              </div>
            )}

            {/* Galería de Proyectos/Obras */}
            {data?.fotos?.length > 0 && (
              <SlideIn from="left" delay={0.2}>
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 rounded flex items-center justify-center text-white font-black text-sm"
                      style={{ backgroundColor: primaryColor }}>P</div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Proyectos & Obras</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {data.fotos.slice(0, 6).map((foto: any, idx: number) => (
                      <motion.div key={foto.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ y: -8, boxShadow: `0 20px 40px ${primaryColor}30` }}
                        className="relative overflow-hidden rounded-xl aspect-square group cursor-default border-2 shadow-md"
                        style={{ borderColor: primaryColor + '40' }}>
                        <img src={apiUrl(foto.url)} alt="proyecto" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundImage: `linear-gradient(180deg, ${primaryColor}cc 0%, transparent 60%)` }} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </SlideIn>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-10">

            {/* Skills */}
            {data?.skills && (
              <SlideIn from="right">
                <div className="p-6 rounded-2xl" style={{ backgroundColor: primaryColor + '08', border: `2px solid ${primaryColor}20` }}>
                  <h3 className="font-black text-slate-900 uppercase tracking-wider mb-4 text-sm">Skills</h3>
                  <div className="space-y-4">
                    {[...(data.skills.technical || []), ...(data.skills.tools || [])].map((s: string, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700">{s}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${75 + Math.random() * 25}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: primaryColor }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {data.skills.soft?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3">Competencias</h4>
                      <div className="flex flex-wrap gap-2">
                        {data.skills.soft.map((s: string, i: number) => (
                          <span key={i} className="px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: primaryColor }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SlideIn>
            )}

            {/* Idiomas */}
            {data?.languages?.length > 0 && (
              <SlideIn from="right" delay={0.1}>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-wider mb-4 text-sm">Idiomas</h3>
                  <div className="space-y-3">
                    {data.languages.map((l: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg"
                        style={{ backgroundColor: primaryColor + '10' }}>
                        <span className="font-bold text-slate-800">{l.language}</span>
                        <span className="text-xs font-bold px-2 py-1 rounded text-white"
                          style={{ backgroundColor: primaryColor }}>
                          {l.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </SlideIn>
            )}

            {/* Certificaciones */}
            {data?.certifications?.length > 0 && (
              <SlideIn from="right" delay={0.2}>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-wider mb-4 text-sm">Certificaciones</h3>
                  <div className="space-y-2">
                    {data.certifications.map((c: any, idx: number) => (
                      <div key={idx} className="flex gap-3 items-start p-3 rounded-lg"
                        style={{ backgroundColor: primaryColor + '08' }}>
                        <span className="text-lg flex-shrink-0">🏆</span>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                          {c.issuer && <p className="text-xs text-slate-500">{c.issuer}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SlideIn>
            )}
          </div>
        </div>

        <div className="text-center mt-16 pt-8 border-t border-slate-100">
          <p className="text-xs text-slate-200">Creado con Visume Premium</p>
        </div>
      </div>
    </div>
  );
}
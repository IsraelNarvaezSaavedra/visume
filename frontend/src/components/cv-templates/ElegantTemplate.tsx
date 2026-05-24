import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';

interface CVTemplateProps {
  data: any;
  primaryColor: string;
  font: string;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}>
      {children}
    </motion.div>
  );
}

export default function ElegantTemplate({ data, primaryColor, font }: CVTemplateProps) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div style={{ fontFamily: font }} className="min-h-screen bg-white">

      {/* Hero con parallax */}
      <div ref={heroRef} className="relative h-[70vh] overflow-hidden flex items-end"
        style={{ backgroundColor: '#0f172a' }}>
        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-px mx-auto mb-8"
              style={{ backgroundColor: primaryColor }}
            />
            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.1em' }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="text-5xl md:text-7xl font-light text-white tracking-widest uppercase mb-4">
              {data?.personalInfo?.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg tracking-widest uppercase"
              style={{ color: primaryColor }}>
              {data?.personalInfo?.title}
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="h-px mx-auto mt-8"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
        </motion.div>

        {/* Info de contacto en la parte inferior */}
        <div className="relative z-10 w-full px-12 py-6 flex flex-wrap gap-8 justify-center"
          style={{ backgroundColor: primaryColor + 'ee' }}>
          {data?.personalInfo?.email && <span className="text-white text-sm">{data.personalInfo.email}</span>}
          {data?.personalInfo?.phone && <span className="text-white text-sm">{data.personalInfo.phone}</span>}
          {data?.personalInfo?.location && <span className="text-white text-sm">{data.personalInfo.location}</span>}
          {data?.personalInfo?.linkedin && <span className="text-white text-sm">{data.personalInfo.linkedin}</span>}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-20 space-y-20">

        {/* Bio */}
        {data?.personalInfo?.bio && (
          <FadeIn>
            <div className="text-center">
              <div className="w-16 h-px mx-auto mb-8" style={{ backgroundColor: primaryColor }} />
              <p className="text-lg text-slate-500 leading-loose font-light italic">
                {data.personalInfo.bio}
              </p>
              <div className="w-16 h-px mx-auto mt-8" style={{ backgroundColor: primaryColor }} />
            </div>
          </FadeIn>
        )}

        {/* Experiencia */}
        {data?.experience?.length > 0 && (
          <FadeIn delay={0.1}>
            <div>
              <h2 className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-8 text-center">Trayectoria Profesional</h2>
              <div className="space-y-10">
                {data.experience.map((exp: any, idx: number) => (
                  <motion.div key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                    className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">{exp.startDate}</p>
                      <p className="text-slate-400 text-sm">— {exp.endDate || 'Actualidad'}</p>
                      <p className="mt-2 font-light text-sm" style={{ color: primaryColor }}>{exp.company}</p>
                    </div>
                    <div className="border-l-2 pl-8" style={{ borderColor: primaryColor + '30' }}>
                      <h3 className="font-semibold text-slate-900 text-lg mb-2">{exp.position}</h3>
                      {exp.description && <p className="text-slate-500 leading-relaxed text-sm">{exp.description}</p>}
                      {exp.achievements?.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {exp.achievements.map((a: string, i: number) => (
                            <li key={i} className="text-slate-500 text-sm flex gap-2">
                              <span style={{ color: primaryColor }}>—</span> {a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Skills elegantes */}
        {data?.skills && (
          <FadeIn delay={0.2}>
            <h2 className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-8 text-center">Competencias</h2>
            <div className="space-y-6">
              {[
                { key: 'technical', label: 'Técnicas' },
                { key: 'soft', label: 'Personales' },
                { key: 'tools', label: 'Herramientas' },
              ].map(({ key, label }) => (
                data?.skills?.[key]?.length > 0 && (
                  <div key={key} className="grid md:grid-cols-[150px_1fr] gap-4 items-start">
                    <p className="text-xs tracking-widest uppercase text-slate-400 text-right pt-1">{label}</p>
                    <div className="flex flex-wrap gap-2">
                      {data.skills[key].map((s: string, i: number) => (
                        <motion.span key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.04 }}
                          className="text-sm text-slate-600 after:content-['·'] after:ml-2 after:text-slate-300 last:after:content-none">
                          {s}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </FadeIn>
        )}

        {/* Educación */}
        {data?.education?.length > 0 && (
          <FadeIn delay={0.3}>
            <h2 className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-8 text-center">Formación</h2>
            <div className="space-y-6">
              {data.education.map((edu: any, idx: number) => (
                <div key={idx} className="grid md:grid-cols-[200px_1fr] gap-8">
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">{edu.startDate} — {edu.endDate}</p>
                  </div>
                  <div className="border-l-2 pl-8" style={{ borderColor: primaryColor + '30' }}>
                    <p className="font-semibold text-slate-900">{edu.degree}{edu.field ? ` en ${edu.field}` : ''}</p>
                    <p className="text-sm mt-1" style={{ color: primaryColor }}>{edu.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Idiomas */}
        {data?.languages?.length > 0 && (
          <FadeIn delay={0.4}>
            <h2 className="text-xs tracking-[0.3em] uppercase text-slate-400 mb-6 text-center">Idiomas</h2>
            <div className="flex justify-center gap-12">
              {data.languages.map((l: any, idx: number) => (
                <div key={idx} className="text-center">
                  <p className="font-light text-slate-900 text-lg">{l.language}</p>
                  <div className="w-12 h-px mx-auto my-2" style={{ backgroundColor: primaryColor }} />
                  <p className="text-xs tracking-widest uppercase text-slate-400">{l.level}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        <div className="text-center pt-8 border-t border-slate-100">
          <p className="text-xs tracking-widest text-slate-200 uppercase">Creado con Visume</p>
        </div>
      </div>
    </div>
  );
}
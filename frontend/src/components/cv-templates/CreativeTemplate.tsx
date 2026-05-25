import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { apiUrl } from '../../config/api';
interface CVTemplateProps {
  data: any;
  primaryColor: string;
  font: string;
}

// ── Partículas con Canvas ──
function ParticleCanvas({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    const count = 60;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r},${g},${b}`;
    };

    const rgb = hexToRgb(color.length === 7 ? color : '#06b6d4');
    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${p.opacity})`;
        ctx.fill();

        // Líneas entre partículas cercanas
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rgb},${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animId);
  }, [color]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ── Typing effect ──
function TypingText({ text, color }: { text: string; color: string }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
        style={{ color }}>|</motion.span>
    </span>
  );
}

export default function CreativeTemplate({ data, primaryColor, font }: CVTemplateProps) {
  return (
    <div className="min-h-screen" style={{ fontFamily: font, backgroundColor: '#0f172a' }}>

      {/* Hero con partículas */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <ParticleCanvas color={primaryColor} />
        <div className="relative z-10 text-center px-8">
          <motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
  className="w-32 h-32 rounded-full mx-auto mb-8 overflow-hidden border-4"
  style={{ borderColor: primaryColor }}>
  {data?.fotoPrincipal ? (
    <img src={apiUrl(data.fotoPrincipal)} alt="foto" className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-5xl font-black"
      style={{ color: primaryColor, backgroundColor: primaryColor + '20' }}>
      {data?.personalInfo?.name?.[0] || '?'}
    </div>
  )}
</motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-black text-white mb-4">
            {data?.personalInfo?.name}
          </motion.h1>

          <div className="text-2xl font-light mb-8" style={{ color: primaryColor }}>
            <TypingText text={data?.personalInfo?.title || ''} color={primaryColor} />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
            {data?.personalInfo?.email && <span>{data.personalInfo.email}</span>}
            {data?.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
            {data?.personalInfo?.location && <span>{data.personalInfo.location}</span>}
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 text-2xl">
            ↓
          </motion.div>
        </div>
      </div>

      {/* Contenido */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-8 py-16 space-y-16">

          {/* Bio */}
          {data?.personalInfo?.bio && (
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center">
              <p className="text-xl text-slate-600 leading-relaxed italic max-w-2xl mx-auto">
                "{data.personalInfo.bio}"
              </p>
            </motion.div>
          )}

          {/* Experiencia */}
          {data?.experience?.length > 0 && (
            <div>
              <motion.h2 initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="text-3xl font-black mb-8" style={{ color: primaryColor }}>
                EXPERIENCIA
              </motion.h2>
              <div className="space-y-8">
                {data.experience.map((exp: any, idx: number) => (
                  <motion.div key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-6">
                    <div className="flex-shrink-0 w-16 text-right">
                      <div className="w-4 h-4 rounded-full ml-auto mt-1" style={{ backgroundColor: primaryColor }} />
                      <div className="w-0.5 h-full bg-slate-200 ml-auto mt-1" />
                    </div>
                    <div className="pb-8">
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
                        {exp.startDate} — {exp.endDate || 'Actualidad'}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 mt-1">{exp.position}</h3>
                      <p className="text-slate-500 font-medium mb-3">{exp.company}</p>
                      {exp.description && <p className="text-slate-600 leading-relaxed">{exp.description}</p>}
                      {exp.achievements?.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {exp.achievements.map((a: string, i: number) => (
                            <li key={i} className="flex gap-2 text-slate-600 text-sm">
                              <span style={{ color: primaryColor }}>▸</span> {a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Skills como nube */}
          {data?.skills && (
            <div>
              <motion.h2 initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="text-3xl font-black mb-8" style={{ color: primaryColor }}>
                HABILIDADES
              </motion.h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {[...(data.skills.technical || []), ...(data.skills.tools || []), ...(data.skills.soft || [])].map((s: string, i: number) => (
                  <motion.span key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03, type: 'spring' }}
                    whileHover={{ scale: 1.15, rotate: [-2, 2, 0] }}
                    className="px-5 py-2 rounded-full font-semibold cursor-default"
                    style={{
                      fontSize: `${0.7 + Math.random() * 0.4}rem`,
                      backgroundColor: i % 3 === 0 ? primaryColor : i % 3 === 1 ? primaryColor + '20' : 'white',
                      color: i % 3 === 0 ? 'white' : primaryColor,
                      border: `2px solid ${primaryColor}`,
                    }}>
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Educación */}
          {data?.education?.length > 0 && (
            <div>
              <motion.h2 initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="text-3xl font-black mb-8" style={{ color: primaryColor }}>
                FORMACIÓN
              </motion.h2>
              <div className="grid md:grid-cols-2 gap-6">
                {data.education.map((edu: any, idx: number) => (
                  <motion.div key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.03 }}
                    className="p-6 rounded-2xl border-2 cursor-default"
                    style={{ borderColor: primaryColor }}>
                    <p className="font-black text-slate-900 text-lg">{edu.degree}</p>
                    {edu.field && <p className="text-slate-500 text-sm">en {edu.field}</p>}
                    <p className="font-semibold mt-2" style={{ color: primaryColor }}>{edu.institution}</p>
                    <p className="text-slate-400 text-sm">{edu.startDate} — {edu.endDate}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Idiomas */}
          {data?.languages?.length > 0 && (
            <div>
              <motion.h2 initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="text-3xl font-black mb-8" style={{ color: primaryColor }}>
                IDIOMAS
              </motion.h2>
              <div className="flex flex-wrap gap-4">
                {data.languages.map((l: any, idx: number) => (
                  <motion.div key={idx}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    className="px-6 py-4 rounded-2xl text-center"
                    style={{ backgroundColor: primaryColor, color: 'white' }}>
                    <p className="font-black text-lg">{l.language}</p>
                    <p className="text-sm opacity-80">{l.level}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center pt-8 border-t border-slate-100">
            <p className="text-xs text-slate-300">Creado con Visume Premium</p>
          </div>
        </div>
      </div>
    </div>
  );
}
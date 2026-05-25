import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { apiUrl } from "../../config/api";

interface CVTemplateProps {
  data: any;
  primaryColor: string;
  font: string;
}

// ── Animación de entrada para secciones ──
function RevealSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ── Barra de skill animada ──
function SkillBar({
  skill,
  color,
  delay,
}: {
  skill: string;
  color: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{skill}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${70 + Math.random() * 30}%` } : {}}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function ModernTemplate({
  data,
  primaryColor,
  font,
}: CVTemplateProps) {
  const gradientStyle = {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}99 50%, ${primaryColor}44 100%)`,
  };

  return (
    <div style={{ fontFamily: font }} className="min-h-screen bg-white">
      {/* Hero animado con gradiente */}
      <div className="relative overflow-hidden" style={gradientStyle}>
        {/* Círculos decorativos animados */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        />

        <div className="relative z-10 text-center py-20 px-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden shadow-2xl border-4"
            style={{ borderColor: "rgba(255,255,255,0.5)" }}
          >
            {data?.fotoPrincipal ? (
              <img
                src={apiUrl(data.fotoPrincipal)}
                alt="foto"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                {data?.personalInfo?.name?.[0] || "?"}
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3"
          >
            {data?.personalInfo?.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-white/80 mb-6"
          >
            {data?.personalInfo?.title}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 text-white/70 text-sm"
          >
            {data?.personalInfo?.email && (
              <span>✉ {data.personalInfo.email}</span>
            )}
            {data?.personalInfo?.phone && (
              <span>📞 {data.personalInfo.phone}</span>
            )}
            {data?.personalInfo?.location && (
              <span>📍 {data.personalInfo.location}</span>
            )}
            {data?.personalInfo?.linkedin && (
              <span>in {data.personalInfo.linkedin}</span>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
        {/* Bio */}
        {data?.personalInfo?.bio && (
          <RevealSection>
            <div
              className="p-6 rounded-2xl border-l-4"
              style={{
                borderColor: primaryColor,
                backgroundColor: primaryColor + "08",
              }}
            >
              <p className="text-slate-600 leading-relaxed italic">
                {data.personalInfo.bio}
              </p>
            </div>
          </RevealSection>
        )}

        {/* Experiencia */}
        {data?.experience?.length > 0 && (
          <RevealSection delay={0.1}>
            <h2
              className="text-2xl font-bold mb-6 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Experiencia Profesional
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative pl-6 border-l-2"
                  style={{ borderColor: primaryColor + "40" }}
                >
                  <div
                    className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-slate-800 text-lg">
                      {exp.position}
                    </h3>
                    <span className="text-sm text-slate-400 ml-4 flex-shrink-0">
                      {exp.startDate} — {exp.endDate || "Actualidad"}
                    </span>
                  </div>
                  <p
                    className="font-medium mb-2"
                    style={{ color: primaryColor }}
                  >
                    {exp.company}
                  </p>
                  {exp.description && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements?.length > 0 && (
                    <ul className="space-y-1">
                      {exp.achievements.map((a: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-slate-600 text-sm"
                        >
                          <span
                            style={{ color: primaryColor }}
                            className="mt-1"
                          >
                            ▸
                          </span>{" "}
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </RevealSection>
        )}

        {/* Educación */}
        {data?.education?.length > 0 && (
          <RevealSection delay={0.2}>
            <h2
              className="text-2xl font-bold mb-6 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Formación Académica
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.education.map((edu: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-5 rounded-xl border"
                  style={{
                    borderColor: primaryColor + "30",
                    backgroundColor: primaryColor + "05",
                  }}
                >
                  <p className="font-bold text-slate-800">{edu.degree}</p>
                  {edu.field && (
                    <p className="text-sm text-slate-500">en {edu.field}</p>
                  )}
                  <p className="text-sm mt-1" style={{ color: primaryColor }}>
                    {edu.institution}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {edu.startDate} — {edu.endDate}
                  </p>
                </motion.div>
              ))}
            </div>
          </RevealSection>
        )}

        {/* Skills con barras animadas */}
        {data?.skills && (
          <RevealSection delay={0.3}>
            <h2
              className="text-2xl font-bold mb-6 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Habilidades
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {data.skills.technical?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    Técnicas
                  </h3>
                  {data.skills.technical.map((s: string, i: number) => (
                    <SkillBar
                      key={i}
                      skill={s}
                      color={primaryColor}
                      delay={i * 0.1}
                    />
                  ))}
                </div>
              )}
              {data.skills.soft?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    Competencias
                  </h3>
                  {data.skills.soft.map((s: string, i: number) => (
                    <SkillBar
                      key={i}
                      skill={s}
                      color={primaryColor}
                      delay={i * 0.1}
                    />
                  ))}
                </div>
              )}
            </div>
            {data.skills.tools?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Herramientas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.tools.map((s: string, i: number) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                      className="px-4 py-2 rounded-full text-sm font-medium cursor-default"
                      style={{
                        backgroundColor: primaryColor + "15",
                        color: primaryColor,
                        border: `1px solid ${primaryColor}40`,
                      }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </RevealSection>
        )}

        {/* Idiomas */}
        {data?.languages?.length > 0 && (
          <RevealSection delay={0.4}>
            <h2
              className="text-2xl font-bold mb-6 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Idiomas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.languages.map((l: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-4 rounded-xl"
                  style={{
                    backgroundColor: primaryColor + "10",
                    border: `1px solid ${primaryColor}30`,
                  }}
                >
                  <p className="font-bold text-slate-800">{l.language}</p>
                  <p className="text-sm mt-1" style={{ color: primaryColor }}>
                    {l.level}
                  </p>
                </motion.div>
              ))}
            </div>
          </RevealSection>
        )}

        {/* Certificaciones */}
        {data?.certifications?.length > 0 && (
          <RevealSection delay={0.5}>
            <h2
              className="text-2xl font-bold mb-6 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Certificaciones
            </h2>
            <div className="space-y-3">
              {data.certifications.map((c: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{
                    backgroundColor: primaryColor + "08",
                    border: `1px solid ${primaryColor}20`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="text-white text-lg">🏆</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{c.name}</p>
                    {c.issuer && (
                      <p className="text-sm text-slate-500">
                        {c.issuer}
                        {c.date ? ` · ${c.date}` : ""}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </RevealSection>
        )}

        {/* Proyectos */}
        {data?.projects?.length > 0 && (
          <RevealSection delay={0.5}>
            <h2
              className="text-2xl font-bold mb-6 pb-2 border-b-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Proyectos
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.projects.map((p: any, idx: number) => (
                <motion.div
                  key={idx}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: `0 8px 30px ${primaryColor}20`,
                  }}
                  className="p-5 rounded-xl border transition-shadow"
                  style={{ borderColor: primaryColor + "30" }}
                >
                  <h3 className="font-bold text-slate-800 mb-2">{p.name}</h3>
                  <p className="text-slate-600 text-sm mb-3">{p.description}</p>
                  {p.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {p.technologies.map((t: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            backgroundColor: primaryColor + "15",
                            color: primaryColor,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </RevealSection>
        )}

        <div className="text-center pt-8 pb-4 border-t border-slate-100">
          <p className="text-xs text-slate-300">Creado con Visume</p>
        </div>
      </div>
    </div>
  );
}

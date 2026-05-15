import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  Briefcase,
  Calendar,
  Crown,
  Sparkles,
  Edit3,
  Save,
  X,
  Check,
  Trash2,
  LogOut,
  FileText,
  Lock,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../config/api";

interface ProfileProps {
  onNavigate: (section: string) => void;
  onLogout: () => void;
}

interface CurriculumResumen {
  id: number;
  titulo: string;
  fechaCreacion: string;
  publicado: boolean;
  urlWeb: string | null;
}

interface PerfilData {
  username: string;
  email: string;
  nombre: string;
  profesion: string | null;
  fotoUrl: string | null;
  fechaRegistro: string;
  estaPagando: boolean;
  rol: string;
  maxCurriculums: number;
  curriculums: CurriculumResumen[];
}

export default function Profile({ onNavigate, onLogout }: ProfileProps) {
  const { token } = useAuth();
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "info" | "curriculums" | "seguridad"
  >("info");
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    profesion: "",
  });
  const [passData, setPassData] = useState({
    contrasenaActual: "",
    contrasenaNueva: "",
    confirmar: "",
  });

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const res = await fetch(apiUrl("/api/perfil"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error cargando perfil");
      const data = await res.json();
      setPerfil(data);
      setFormData({
        nombre: data.nombre || "",
        email: data.email || "",
        profesion: data.profesion || "",
      });
    } catch (e) {
      setError("No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarInfo = async () => {
    setGuardando(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/perfil"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(await res.text());
      setExito("Perfil actualizado correctamente");
      setEditando(false);
      cargarPerfil();
      setTimeout(() => setExito(null), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleCambiarPassword = async () => {
    if (passData.contrasenaNueva !== passData.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/perfil"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contrasenaActual: passData.contrasenaActual,
          contrasenaNueva: passData.contrasenaNueva,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setExito("Contraseña cambiada correctamente");
      setPassData({ contrasenaActual: "", contrasenaNueva: "", confirmar: "" });
      setTimeout(() => setExito(null), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarCurriculum = async (id: number) => {
    try {
      const res = await fetch(
        apiUrl(`/api/perfil/curriculum/${id}`),
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Error eliminando curriculum");
      setExito("Curriculum eliminado");
      setConfirmDelete(null);
      cargarPerfil();
      setTimeout(() => setExito(null), 3000);
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500"
        />
      </div>
    );

  const totalCvs = perfil?.curriculums?.length || 0;
  const maxCvs = perfil?.maxCurriculums || 1;
  const lleno = totalCvs >= maxCvs;

  return (
    <section className="relative min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-6"> {/* Aumentamos el gap con el avatar */}
      
      {/* Avatar — Con un toque más pulido */}
      <div className="relative group">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-xl shadow-cyan-500/20 flex items-center justify-center transform transition-transform group-hover:scale-105">
          <User size={32} className="text-white" />
        </div>
        {/* Badge de estado absoluto para no ocupar espacio en el flujo de texto */}
        <div className="absolute -bottom-2 -right-2">
          {perfil?.estaPagando ? (
            <div className="bg-violet-600 p-1.5 rounded-lg border-2 border-slate-950 shadow-lg" title="Premium">
              <Crown size={14} className="text-white" />
            </div>
          ) : (
            <div className="bg-slate-700 p-1.5 rounded-lg border-2 border-slate-950 shadow-lg" title="Gratuito">
              <Sparkles size={14} className="text-cyan-400" />
            </div>
          )}
        </div>
      </div>

      {/* Información de usuario con mejor jerarquía */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {perfil?.nombre || perfil?.username}
          </h1>
          <span className="text-slate-500 font-medium text-sm bg-slate-800/50 px-2 py-0.5 rounded-md">
            @{perfil?.username}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-slate-400 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-cyan-500"></span>
            {perfil?.email}
          </span>
          {perfil?.profesion && (
            <span className="flex items-center gap-1.5 border-l border-slate-800 pl-4">
              {perfil.profesion}
            </span>
          )}
        </div>
      </div>
    </div>

    {/* Botón de Logout más estilizado */}
    <motion.button 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }} 
      onClick={onLogout}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 text-red-400 transition-all text-sm font-medium"
    >
      <LogOut size={16} /> 
      <span>Cerrar sesión</span>
    </motion.button>
  </div>

          {/* Barra curriculums */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Curriculums usados</span>
              <span className="text-slate-300 text-sm">
                {totalCvs} / {maxCvs}
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(totalCvs / maxCvs) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${lleno ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-cyan-500 to-violet-500"}`}
              />
            </div>
            {!perfil?.estaPagando && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => alert("Portal de pago próximamente 🚀")}
                className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-300 text-sm flex items-center justify-center gap-2 hover:from-violet-500/30 transition-all"
              >
                <Crown size={13} /> Pasar a Premium — más curriculums y
                funciones
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Feedback */}
        <AnimatePresence>
          {exito && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 flex items-center gap-2 text-sm"
            >
              <Check size={15} /> {exito}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 flex items-center gap-2 text-sm"
            >
              <X size={15} /> {error}
              <button onClick={() => setError(null)} className="ml-auto">
                <X size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 p-1 mb-8 rounded-xl bg-slate-900/50 border border-cyan-500/20">
          {[
            { id: "info" as const, icon: User, label: "Mi información" },
            {
              id: "curriculums" as const,
              icon: FileText,
              label: "Mis curriculums",
            },
            { id: "seguridad" as const, icon: Lock, label: "Seguridad" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all text-sm"
            >
              <span
                className={`relative z-10 flex items-center gap-2 ${activeTab === tab.id ? "text-white" : "text-slate-400"}`}
              >
                <tab.icon size={15} /> {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="profileTab"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Tab: Info — caja centrada y más estrecha */}
          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg text-cyan-400">
                    Información personal
                  </h2>
                  {!editando ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setEditando(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 text-xs transition-all"
                    >
                      <Edit3 size={13} /> Editar
                    </motion.button>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={handleGuardarInfo}
                        disabled={guardando}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs"
                      >
                        {guardando ? (
                          "..."
                        ) : (
                          <>
                            <Check size={13} /> Guardar
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setEditando(false)}
                        className="px-2 py-1.5 rounded-lg border border-slate-600 text-slate-400"
                      >
                        <X size={13} />
                      </motion.button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: "Nombre completo",
                      icon: User,
                      key: "nombre",
                      type: "text",
                    },
                    { label: "Email", icon: Mail, key: "email", type: "email" },
                    {
                      label: "Profesión",
                      icon: Briefcase,
                      key: "profesion",
                      type: "text",
                    },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs text-slate-500 mb-1 flex items-center gap-1">
                        <field.icon size={11} /> {field.label}
                      </label>
                      {editando ? (
                        <input
                          type={field.type}
                          value={(formData as any)[field.key]}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              [field.key]: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                        />
                      ) : (
                        <p className="px-4 py-2.5 rounded-xl bg-slate-950/30 text-slate-300 text-sm">
                          {(formData as any)[field.key] || (
                            <span className="text-slate-600 italic">
                              No especificado
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <Calendar size={11} /> Miembro desde
                    </label>
                    <p className="px-4 py-2.5 rounded-xl bg-slate-950/30 text-slate-300 text-sm">
                      {perfil?.fechaRegistro
                        ? new Date(perfil.fechaRegistro).toLocaleDateString(
                            "es-ES",
                            { year: "numeric", month: "long", day: "numeric" },
                          )
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab: Curriculums */}
          {activeTab === "curriculums" && (
            <motion.div
              key="curriculums"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Sin curriculums → cuadrado de bienvenida */}
              {totalCvs === 0 && (
                <div className="py-16 px-8 rounded-2xl bg-slate-900/70 border border-cyan-500/30 text-center">
                  <FileText className="mx-auto mb-4 text-slate-600" size={48} />
                  <p className="text-white font-medium mb-1">
                    Aún no tienes ningún currículum
                  </p>
                  <p className="text-slate-500 text-sm mb-6">
                    Crea tu primera página web profesional con IA
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate("generator")}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm"
                  >
                    Crear mi primer currículum
                  </motion.button>
                </div>
              )}

              {/* Lista de curriculums */}
              {totalCvs > 0 &&
                perfil?.curriculums?.map((cv) => (
                  <motion.div
                    key={cv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-medium mb-1">
                          {cv.titulo}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          {new Date(cv.fechaCreacion).toLocaleDateString(
                            "es-ES",
                            { year: "numeric", month: "long", day: "numeric" },
                          )}
                        </p>
                        <span
                          className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${cv.publicado ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-slate-700 text-slate-400"}`}
                        >
                          {cv.publicado ? "Publicado" : "Borrador"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onNavigate("editor")}
                          className="p-2 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 transition-all"
                        >
                          <Edit3 size={15} />
                        </motion.button>

                        {confirmDelete === cv.id ? (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                            <AlertTriangle size={13} className="text-red-400" />
                            <span className="text-red-400 text-xs">
                              ¿Eliminar?
                            </span>
                            <button
                              onClick={() => handleEliminarCurriculum(cv.id)}
                              className="text-red-400 hover:text-red-300 text-xs font-medium"
                            >
                              Sí
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-slate-400 hover:text-slate-300 text-xs"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setConfirmDelete(cv.id)}
                            className="p-2 rounded-lg border border-red-500/30 hover:border-red-500/50 text-red-400 transition-all"
                          >
                            <Trash2 size={15} />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

              {/* Botón crear nuevo — solo si no está lleno */}
              {totalCvs > 0 && !lleno && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate("generator")}
                  className="w-full py-3 rounded-xl border border-dashed border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 text-sm flex items-center justify-center gap-2 transition-all"
                >
                  + Crear nuevo currículum <ChevronRight size={15} />
                </motion.button>
              )}

              {/* Aviso si está lleno */}
              {lleno && (
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center gap-3">
                  <AlertTriangle
                    size={16}
                    className="text-orange-400 flex-shrink-0"
                  />
                  <p className="text-orange-300 text-sm">
                    Has alcanzado el límite de curriculums de tu plan. Elimina
                    uno para crear uno nuevo
                    {!perfil?.estaPagando && (
                      <>
                        , o{" "}
                        <button
                          onClick={() =>
                            alert("Portal de pago próximamente 🚀")
                          }
                          className="underline hover:text-orange-200"
                        >
                          pasa a Premium
                        </button>{" "}
                        para tener más.
                      </>
                    )}
                    .
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab: Seguridad — caja centrada y más estrecha */}
          {activeTab === "seguridad" && (
            <motion.div
              key="seguridad"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-cyan-500/30">
                <h2 className="text-lg text-cyan-400 mb-6">
                  Cambiar contraseña
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Contraseña actual", key: "contrasenaActual" },
                    { label: "Nueva contraseña", key: "contrasenaNueva" },
                    { label: "Confirmar nueva contraseña", key: "confirmar" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs text-slate-500 mb-1">
                        {field.label}
                      </label>
                      <input
                        type="password"
                        value={(passData as any)[field.key]}
                        onChange={(e) =>
                          setPassData((p) => ({
                            ...p,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                    </div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCambiarPassword}
                    disabled={guardando}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm flex items-center justify-center gap-2 mt-2"
                  >
                    {guardando ? (
                      "..."
                    ) : (
                      <>
                        <Save size={16} /> Cambiar contraseña
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

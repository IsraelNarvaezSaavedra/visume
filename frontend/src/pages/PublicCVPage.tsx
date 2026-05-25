import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";
import BoldTemplate from "../components/cv-templates/BoldTemplate";
import CreativeTemplate from "../components/cv-templates/CreativeTemplate";
import ElegantTemplate from "../components/cv-templates/ElegantTemplate";
import ModernTemplate from "../components/cv-templates/ModernTemplate";

export default function PublicCVPage() {
  const { shareCode } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareCode) {
      setError("Código compartido no válido");
      setLoading(false);
      return;
    }

    const cargarCV = async () => {
      try {
        const res = await fetch(apiUrl(`/api/curriculum/public/${shareCode}`));
        if (!res.ok) throw new Error("CV no encontrado");
        const cvData = await res.json();
        setData(cvData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error cargando el CV");
      } finally {
        setLoading(false);
      }
    };

    cargarCV();
  }, [shareCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando CV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-white mb-2">CV no encontrado</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 transition-all">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const primaryColor = data.style?.primaryColor || "#06b6d4";
  const font = data.style?.font || "Inter";
  const template = data.style?.template || "modern";

  return (
    <div>
      {template === "bold" && <BoldTemplate data={data} primaryColor={primaryColor} font={font} />}
      {template === "creative" && <CreativeTemplate data={data} primaryColor={primaryColor} font={font} />}
      {template === "elegant" && <ElegantTemplate data={data} primaryColor={primaryColor} font={font} />}
      {template === "modernpro" && <ModernTemplate data={data} primaryColor={primaryColor} font={font} />}
    </div>
  );
}

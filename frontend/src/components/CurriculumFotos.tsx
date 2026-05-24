import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

interface Foto {
  id: number;
  url: string;
  esPrincipal: boolean;
  orden: number;
}

interface Props {
  idCurriculum: number;
  esPremium: boolean;
  maxFotos: number;
}

export default function CurriculumFotos({ idCurriculum, esPremium, maxFotos }: Props) {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { token } = useAuth();

  useEffect(() => {
    cargarFotos();
  }, [idCurriculum]);

  const cargarFotos = async () => {
    const res = await fetch(`/api/files/curriculum/${idCurriculum}/fotos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setFotos(await res.json());
  };

  const subirFoto = async (file: File) => {
    if (fotos.length >= maxFotos) {
      setError(`Tu plan permite un máximo de ${maxFotos} foto${maxFotos > 1 ? "s" : ""}`);
      return;
    }

    setSubiendo(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);
    form.append("esPrincipal", String(fotos.length === 0));

    const res = await fetch(`/api/files/curriculum/${idCurriculum}/foto`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    if (res.ok) {
      await cargarFotos();
    } else {
      const data = await res.json();
      setError(data.error || "Error al subir la foto");
    }
    setSubiendo(false);
  };

  const eliminarFoto = async (idFoto: number) => {
    const res = await fetch(`/api/files/curriculum/foto/${idFoto}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setFotos((prev) => prev.filter((f) => f.id !== idFoto));
  };

  const limitAlcanzado = fotos.length >= maxFotos;

  return (
    <div className="curriculum-fotos">
      <h3>Fotos del currículum</h3>

      {/* Grid de fotos */}
      <div className="fotos-grid">
        {fotos.map((foto) => (
          <div key={foto.id} className="foto-item">
            <img src={foto.url} alt="Foto CV" />
            {foto.esPrincipal && <span className="badge-principal">Principal</span>}
            <button onClick={() => eliminarFoto(foto.id)} className="btn-eliminar">✕</button>
          </div>
        ))}

        {/* Botón añadir (si no ha llegado al límite) */}
        {!limitAlcanzado && (
          <button
            className="foto-add-btn"
            onClick={() => inputRef.current?.click()}
            disabled={subiendo}
          >
            {subiendo ? "Subiendo..." : "+ Añadir foto"}
          </button>
        )}
      </div>

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.[0]) subirFoto(e.target.files[0]);
          e.target.value = ""; // reset para poder subir la misma foto
        }}
      />

      {/* Info de límite */}
      <p className="fotos-info">
        {fotos.length}/{maxFotos} foto{maxFotos > 1 ? "s" : ""}
        {!esPremium && (
          <span className="upgrade-hint">
            {" · "}
            <a href="/planes">Hazte Premium</a> para añadir hasta 10 fotos y hacer tu CV un portfolio
          </span>
        )}
      </p>

      {error && <p className="fotos-error">{error}</p>}
    </div>
  );
}
import React, { useMemo, useState } from "react";
import styled from "styled-components";

// ✅ Ajusta estas rutas a las tuyas reales
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function toMySQLDatetime(dateStr, timeStr) {
  return `${dateStr} ${timeStr}:00`;
}

function mysqlToDate(dt) {
  const iso = dt.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

const SolicitarPlanPage = () => {
  const categorias = useMemo(
    () => [
      { value: "musica", label: "Música" },
      { value: "cultural", label: "Cultural" },
      { value: "historia", label: "Historia" },
      { value: "gastronomia", label: "Gastronomía" },
      { value: "deporte", label: "Deporte" },
      { value: "arte", label: "Arte / Exposiciones" },
      { value: "noche", label: "Noche / Fiesta" },
      { value: "familia", label: "Familia / Niños" },
      { value: "naturaleza", label: "Naturaleza" },
      { value: "cine", label: "Cine / Teatro" },
      { value: "mercado", label: "Mercados / Ferias" },
      { value: "networking", label: "Networking / Social" },
      { value: "otro", label: "Otro" },
    ],
    []
  );

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    hora_inicio: "",
    hora_fin: "",
    provincia: "Madrid",
    municipio: "",
    direccion: "",
    categoria: "musica",
    categoria_detalle: "",
    tags: "",
    imagen: "",
    imagenArchivo: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagenArchivo") {
      const file = files?.[0];

      if (!file) {
        setForm((p) => ({ ...p, imagen: "", imagenArchivo: null }));
        return;
      }

      if (file.size > MAX_IMAGE_BYTES) {
        alert("La imagen es demasiado grande. Máximo 2MB.");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((p) => ({ ...p, imagen: reader.result, imagenArchivo: file }));
      };
      reader.readAsDataURL(file);
      return;
    }

    // si escribes URL de imagen, quitamos archivo
    if (name === "imagen") {
      setForm((p) => ({ ...p, imagen: value, imagenArchivo: null }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const buildPayload = () => {
    if (!form.titulo.trim()) throw new Error("El título es obligatorio.");
    if (!form.descripcion.trim()) throw new Error("La descripción es obligatoria.");
    if (!form.fecha_inicio) throw new Error("La fecha de inicio es obligatoria.");
    if (!form.hora_inicio) throw new Error("La hora de inicio es obligatoria.");

    const start_at = toMySQLDatetime(form.fecha_inicio, form.hora_inicio);
    const end_at = toMySQLDatetime(
      form.fecha_fin || form.fecha_inicio,
      form.hora_fin || form.hora_inicio
    );

    const start = mysqlToDate(start_at);
    const end = mysqlToDate(end_at);
    if (!start || !end) throw new Error("Fecha/hora inválida.");
    if (end < start) throw new Error("La fecha/hora de fin no puede ser anterior al inicio.");

    const tagsArr = (form.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 12);

    const categoria = form.categoria;
    const detalle = form.categoria_detalle.trim() || null;

    if (categoria === "otro" && !detalle) {
      throw new Error('Si eliges "Otro", escribe un detalle.');
    }

    return {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      categoria,
      categoria_detalle: detalle,
      provincia: "Madrid",
      municipio: form.municipio.trim() || null,
      direccion: form.direccion.trim() || null,
      tags: tagsArr,
      imagen: form.imagen?.trim() || "",
      start_at,
      end_at,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const payload = buildPayload();

      // ✅ Ajusta tu endpoint real:
      const res = await fetch("http://localhost:3001/api/eventos/solicitud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = "No se pudo enviar la solicitud.";
        try {
          const data = await res.json();
          msg = data?.message || msg;
        } catch {}
        throw new Error(msg);
      }

      alert("Solicitud enviada ✅");

      setForm({
        titulo: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        hora_inicio: "",
        hora_fin: "",
        provincia: "Madrid",
        municipio: "",
        direccion: "",
        categoria: "musica",
        categoria_detalle: "",
        tags: "",
        imagen: "",
        imagenArchivo: null,
      });
    } catch (err) {
      alert(err?.message || "Error al enviar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <Header />

      <main className="solicitar-plan-container">

  <form className="solicitar-plan-form" onSubmit={handleSubmit}>

    <h1 className="solicitar-plan-title">Solicitar plan</h1>

    <p className="solicitar-plan-subtitle">
      Envíanos un evento y lo revisaremos para añadirlo.
    </p>

    <input
      type="text"
      name="titulo"
      placeholder="Título del evento"
      value={form.titulo}
      onChange={handleChange}
      required
    />

    <textarea
      name="descripcion"
      placeholder="Descripción"
      value={form.descripcion}
      onChange={handleChange}
      required
    />

    <label>Categoría</label>
    <select name="categoria" value={form.categoria} onChange={handleChange} required>
      {categorias.map((c) => (
        <option key={c.value} value={c.value}>
          {c.label}
        </option>
      ))}
    </select>

    <label>Detalle (opcional)</label>
    <input
      type="text"
      name="categoria_detalle"
      placeholder='Ej: "techno", "taller", "ruta guiada"...'
      value={form.categoria_detalle}
      onChange={handleChange}
    />

    <div className="solicitar-plan-grid">
      <div>
        <label>Fecha inicio</label>
        <input
          type="date"
          name="fecha_inicio"
          value={form.fecha_inicio}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Hora inicio *</label>
        <input
          type="time"
          name="hora_inicio"
          value={form.hora_inicio}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    <div className="solicitar-plan-grid">
      <div>
        <label>Fecha fin</label>
        <input
          type="date"
          name="fecha_fin"
          value={form.fecha_fin}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Hora fin (opcional)</label>
        <input
          type="time"
          name="hora_fin"
          value={form.hora_fin}
          onChange={handleChange}
        />
      </div>
    </div>

    <label>Municipio (opcional)</label>
    <input
      type="text"
      name="municipio"
      placeholder="Ej: Madrid, Getafe..."
      value={form.municipio}
      onChange={handleChange}
    />

    <label>Dirección (opcional)</label>
    <input
      type="text"
      name="direccion"
      placeholder="Calle, número, sala..."
      value={form.direccion}
      onChange={handleChange}
    />

    <label>Tags (opcional)</label>
    <input
      type="text"
      name="tags"
      placeholder="Ej: gratis, terraza, entrada libre"
      value={form.tags}
      onChange={handleChange}
    />

    <label>Imagen (opcional)</label>

    <div className="solicitar-plan-img-row">
      <input
        type="text"
        name="imagen"
        placeholder="URL de imagen"
        value={form.imagenArchivo ? "" : form.imagen}
        onChange={handleChange}
        disabled={!!form.imagenArchivo}
      />

      <label className="solicitar-plan-file-btn">
        Subir imagen
        <input
          type="file"
          name="imagenArchivo"
          accept="image/*"
          onChange={handleChange}
          disabled={form.imagen.trim() !== ""}
        />
      </label>
    </div>

    <button
      type="submit"
      className="solicitar-plan-submit"
      disabled={submitting}
    >
      {submitting ? "Enviando..." : "Enviar solicitud"}
    </button>

    <p className="solicitar-plan-hint">
      * Hora de inicio obligatoria
    </p>

  </form>

</main>

      <Footer />
    </Page>
  );
};

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    padding: 22px 12px;
  }

  .subtitle {
    margin: 6px 0 16px 0;
    color: #666;
    font-size: 14px;
  }

  .formulario {
    max-width: 560px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 18px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  label {
    font-size: 12px;
    font-weight: 600;
  }

  input,
  textarea,
  select {
    width: 100%;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
    outline: none;
  }

  textarea {
    min-height: 90px;
    resize: vertical;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .imgRow {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .imgRow input {
    flex: 1;
  }

  button {
    padding: 12px;
    border: none;
    border-radius: 10px;
    background: #FF751F;
    color: white;
    font-weight: 700;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  button:hover {
    background: #b14806;
  }

  .fileBtn {
    position: relative;
    background: #FF751F;
    color: #fff;
    font-weight: 700;
    border-radius: 10px;
    padding: 10px 12px;
    cursor: pointer;
    white-space: nowrap;
  }

  .fileBtn:hover {
    background: #b14806;
  }

  .fileBtn input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .hint {
    margin: 0;
    font-size: 12px;
    color: #666;
  }

  @media (max-width: 560px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .imgRow {
      flex-direction: column;
      align-items: stretch;
    }
  }
`;

export default SolicitarPlanPage;
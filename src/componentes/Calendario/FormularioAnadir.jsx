import React, { useMemo, useState } from "react";
import styled from "styled-components";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB

function toMySQLDatetime(dateStr, timeStr) {
  return `${dateStr} ${timeStr}:00`;
}

function mysqlToDate(dt) {
  const iso = dt.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

const FormularioAnadir = ({ onSubmit, onClose }) => {
  // Categorías temáticas (IA-friendly)
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

    // ✅ provincia fija
    provincia: "Madrid",
    municipio: "",
    direccion: "",

    // ✅ IA: categoría temática + detalle
    categoria: "musica",
    categoria_detalle: "", // ej: "techno", "flamenco", "museo", "ruta guiada"

    tags: "",

    imagen: "",
    imagenArchivo: null,
  });

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
    if (!form.fecha_fin) throw new Error("La fecha de fin es obligatoria.");
    if (!form.hora_inicio) throw new Error("La hora de inicio es obligatoria.");

    const fi = form.fecha_inicio;
    const ff = form.fecha_fin || form.fecha_inicio;

    const hi = form.hora_inicio;
    const hf = form.hora_fin || form.hora_inicio;

    const start_at = toMySQLDatetime(fi, hi);
    const end_at = toMySQLDatetime(ff, hf);

    const start = mysqlToDate(start_at);
    const end = mysqlToDate(end_at);
    if (!start || !end) throw new Error("Fecha/hora inválida.");
    if (end < start) throw new Error("La fecha/hora de fin no puede ser anterior al inicio.");

    const tagsArr = (form.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 12);

    const imagen = form.imagen?.trim() || "";

    // ✅ categoría: si es "otro", obliga a detalle mínimo
    const categoria = form.categoria;
    const detalle = form.categoria_detalle.trim() || null;
    if (categoria === "otro" && !detalle) {
      throw new Error('Si eliges "Otro", escribe un detalle (ej: "ruta guiada", "taller", etc.)');
    }

    return {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),

      // ✅ IA-friendly
      categoria,
      categoria_detalle: detalle,

      provincia: "Madrid",
      municipio: form.municipio.trim() || null,
      direccion: form.direccion.trim() || null,

      tags: tagsArr,
      imagen,

      start_at,
      end_at,
    };
  };

  return (
    <StyledWrapper onClick={onClose}>
      <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
        <form
          className="formulario-evento"
          onSubmit={(e) => {
            e.preventDefault();
            try {
              onSubmit(buildPayload());
            } catch (err) {
              alert(err.message || "Revisa los datos del formulario.");
            }
          }}
        >
          <button className="cerrar-btn" type="button" onClick={onClose}>
            ✖
          </button>

          <h2>Solicitar plan</h2>

          <input
            type="text"
            name="titulo"
            placeholder="Título (ej: Concierto techno en Malasaña)"
            value={form.titulo}
            onChange={handleChange}
            required
          />

          <textarea
            className="descripcion"
            name="descripcion"
            placeholder="Descripción (ambiente, precio, requisitos...)"
            value={form.descripcion}
            onChange={handleChange}
            required
          />

          <label>Categoría (temática)</label>
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
            placeholder='Ej: "techno", "flamenco", "ruta guiada", "museo"...'
            value={form.categoria_detalle}
            onChange={handleChange}
          />

          <div className="grid2">
            <div>
              <label>Fecha de inicio</label>
              <input type="date" name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange} required />
            </div>
            <div>
              <label>Hora de inicio *</label>
              <input type="time" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid2">
            <div>
              <label>Fecha de fin</label>
              <input type="date" name="fecha_fin" value={form.fecha_fin} onChange={handleChange} required />
            </div>
            <div>
              <label>Hora de fin (opcional)</label>
              <input type="time" name="hora_fin" value={form.hora_fin} onChange={handleChange} />
            </div>
          </div>

          <div className="grid2">
            <div>
              <label>Provincia</label>
              <input type="text" value="Madrid" disabled />
            </div>
            <div>
              <label>Ciudad / Municipio</label>
              <input
                type="text"
                name="municipio"
                placeholder="Ej: Madrid, Alcalá, Getafe..."
                value={form.municipio}
                onChange={handleChange}
              />
            </div>
          </div>

          <label>Dirección (opcional)</label>
          <input
            type="text"
            name="direccion"
            placeholder="Calle, número, sala / punto de encuentro..."
            value={form.direccion}
            onChange={handleChange}
          />

          <label>Tags (opcional)</label>
          <input
            type="text"
            name="tags"
            placeholder="Ej: gratis, turistas, terraza, entrada libre (separa por comas)"
            value={form.tags}
            onChange={handleChange}
          />

          <div className="imagen-inputs">
            <input
              type="text"
              name="imagen"
              placeholder="URL de imagen (opcional)"
              value={form.imagenArchivo ? "" : form.imagen}
              onChange={handleChange}
              disabled={!!form.imagenArchivo}
            />

            <label className="file-btn" title="Máximo 2MB">
              Subir imagen (máx 2MB)
              <input
                type="file"
                name="imagenArchivo"
                accept="image/*"
                onChange={handleChange}
                disabled={form.imagen.trim() !== ""}
              />
            </label>
          </div>

          <button type="submit" className="btn-enviar">
            Enviar solicitud
          </button>

          <p className="hint">
            * Hora de inicio obligatoria para que el calendario y recomendaciones funcionen bien.
          </p>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .modal-inner {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 12px;
  }

  .formulario-evento {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #fff;
    padding: 24px 20px;
    width: 100%;
    max-width: 460px;
    border-radius: 18px;
    max-height: 88vh;
    overflow-y: auto;
  }

  .cerrar-btn {
    position: absolute;
    right: 15px;
    top: 18px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }

  label {
    font-size: 12px;
    font-weight: 600;
  }

  input,
  textarea,
  select {
    height: 42px;
    padding: 10px;
    width: 100%;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    outline: none;
    box-sizing: border-box;
  }

  textarea {
    min-height: 90px;
    resize: vertical;
  }

  .grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .imagen-inputs {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .imagen-inputs input {
    flex: 1;
  }

  .btn-enviar,
  .file-btn {
    background-color: #a7c4b2;
    color: white;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    border: none;
    text-align: center;
  }

  .btn-enviar:hover,
  .file-btn:hover {
    background-color: #8cab99;
  }

  .file-btn {
    position: relative;
    white-space: nowrap;
  }

  .file-btn input[type="file"] {
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

  @media (max-width: 520px) {
    .grid2 {
      grid-template-columns: 1fr;
    }
  }
`;

export default FormularioAnadir;

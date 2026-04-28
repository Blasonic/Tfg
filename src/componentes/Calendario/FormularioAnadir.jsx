import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const categorias = useMemo(
    () => [
      { value: "musica", label: t("addEvent.categories.music") },
      { value: "cultural", label: t("addEvent.categories.cultural") },
      { value: "historia", label: t("addEvent.categories.history") },
      { value: "gastronomia", label: t("addEvent.categories.gastronomy") },
      { value: "deporte", label: t("addEvent.categories.sport") },
      { value: "arte", label: t("addEvent.categories.art") },
      { value: "noche", label: t("addEvent.categories.nightlife") },
      { value: "familia", label: t("addEvent.categories.family") },
      { value: "naturaleza", label: t("addEvent.categories.nature") },
      { value: "cine", label: t("addEvent.categories.cinema") },
      { value: "mercado", label: t("addEvent.categories.markets") },
      { value: "networking", label: t("addEvent.categories.networking") },
      { value: "otro", label: t("addEvent.categories.other") },
    ],
    [t]
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagenArchivo") {
      const file = files?.[0];

      if (!file) {
        setForm((p) => ({ ...p, imagen: "", imagenArchivo: null }));
        return;
      }

      if (file.size > MAX_IMAGE_BYTES) {
        alert(t("addEvent.errors.imageTooLarge"));
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
    if (!form.titulo.trim()) throw new Error(t("addEvent.errors.titleRequired"));
    if (!form.descripcion.trim()) throw new Error(t("addEvent.errors.descriptionRequired"));
    if (!form.fecha_inicio) throw new Error(t("addEvent.errors.startDateRequired"));
    if (!form.fecha_fin) throw new Error(t("addEvent.errors.endDateRequired"));
    if (!form.hora_inicio) throw new Error(t("addEvent.errors.startTimeRequired"));

    const fi = form.fecha_inicio;
    const ff = form.fecha_fin || form.fecha_inicio;

    const hi = form.hora_inicio;
    const hf = form.hora_fin || form.hora_inicio;

    const start_at = toMySQLDatetime(fi, hi);
    const end_at = toMySQLDatetime(ff, hf);

    const start = mysqlToDate(start_at);
    const end = mysqlToDate(end_at);

    if (!start || !end) throw new Error(t("addEvent.errors.invalidDateTime"));
    if (end < start) throw new Error(t("addEvent.errors.endBeforeStart"));

    const tagsArr = (form.tags || "")
      .split(",")
      .map((tTag) => tTag.trim())
      .filter(Boolean)
      .slice(0, 12);

    const imagen = form.imagen?.trim() || "";

    const categoria = form.categoria;
    const detalle = form.categoria_detalle.trim() || null;

    if (categoria === "otro" && !detalle) {
      throw new Error(t("addEvent.errors.otherNeedsDetail"));
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
              alert(err.message || t("addEvent.errors.checkForm"));
            }
          }}
        >
          <button className="cerrar-btn" type="button" onClick={onClose}>
            ✖
          </button>

          <h2>{t("addEvent.title")}</h2>

          <input
            type="text"
            name="titulo"
            placeholder={t("addEvent.placeholders.title")}
            value={form.titulo}
            onChange={handleChange}
            required
          />

          <textarea
            className="descripcion"
            name="descripcion"
            placeholder={t("addEvent.placeholders.description")}
            value={form.descripcion}
            onChange={handleChange}
            required
          />

          <label>{t("addEvent.labels.category")}</label>
          <select name="categoria" value={form.categoria} onChange={handleChange} required>
            {categorias.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <label>{t("addEvent.labels.detail")}</label>
          <input
            type="text"
            name="categoria_detalle"
            placeholder={t("addEvent.placeholders.detail")}
            value={form.categoria_detalle}
            onChange={handleChange}
          />

          <div className="grid2">
            <div>
              <label>{t("addEvent.labels.startDate")}</label>
              <input
                type="date"
                name="fecha_inicio"
                value={form.fecha_inicio}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>{t("addEvent.labels.startTime")}</label>
              <input
                type="time"
                name="hora_inicio"
                value={form.hora_inicio}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid2">
            <div>
              <label>{t("addEvent.labels.endDate")}</label>
              <input
                type="date"
                name="fecha_fin"
                value={form.fecha_fin}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>{t("addEvent.labels.endTime")}</label>
              <input
                type="time"
                name="hora_fin"
                value={form.hora_fin}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid2">
            <div>
              <label>{t("addEvent.labels.province")}</label>
              <input type="text" value="Madrid" disabled />
            </div>
            <div>
              <label>{t("addEvent.labels.city")}</label>
              <input
                type="text"
                name="municipio"
                placeholder={t("addEvent.placeholders.city")}
                value={form.municipio}
                onChange={handleChange}
              />
            </div>
          </div>

          <label>{t("addEvent.labels.address")}</label>
          <input
            type="text"
            name="direccion"
            placeholder={t("addEvent.placeholders.address")}
            value={form.direccion}
            onChange={handleChange}
          />

          <label>{t("addEvent.labels.tags")}</label>
          <input
            type="text"
            name="tags"
            placeholder={t("addEvent.placeholders.tags")}
            value={form.tags}
            onChange={handleChange}
          />

          <div className="imagen-inputs">
            <input
              type="text"
              name="imagen"
              placeholder={t("addEvent.placeholders.imageUrl")}
              value={form.imagenArchivo ? "" : form.imagen}
              onChange={handleChange}
              disabled={!!form.imagenArchivo}
            />

            <label className="file-btn" title={t("addEvent.imageMax")}>
              {t("addEvent.uploadButton")}
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
            {t("addEvent.submit")}
          </button>

          <p className="hint">{t("addEvent.hint")}</p>
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
    background-color: #FF751F;
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
    background-color: #ba4a04;
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
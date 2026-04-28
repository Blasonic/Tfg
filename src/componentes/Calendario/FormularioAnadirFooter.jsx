import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();

  const categorias = useMemo(
    () => [
      { value: "musica", label: t("requestPlan.categories.music") },
      { value: "cultural", label: t("requestPlan.categories.cultural") },
      { value: "historia", label: t("requestPlan.categories.history") },
      { value: "gastronomia", label: t("requestPlan.categories.gastronomy") },
      { value: "deporte", label: t("requestPlan.categories.sport") },
      { value: "arte", label: t("requestPlan.categories.art") },
      { value: "noche", label: t("requestPlan.categories.nightlife") },
      { value: "familia", label: t("requestPlan.categories.family") },
      { value: "naturaleza", label: t("requestPlan.categories.nature") },
      { value: "cine", label: t("requestPlan.categories.cinema") },
      { value: "mercado", label: t("requestPlan.categories.markets") },
      { value: "networking", label: t("requestPlan.categories.networking") },
      { value: "otro", label: t("requestPlan.categories.other") },
    ],
    [t, i18n.language]
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
        alert(t("requestPlan.errors.imageTooLarge"));
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
    if (!form.titulo.trim()) throw new Error(t("requestPlan.errors.titleRequired"));
    if (!form.descripcion.trim()) throw new Error(t("requestPlan.errors.descriptionRequired"));
    if (!form.fecha_inicio) throw new Error(t("requestPlan.errors.startDateRequired"));
    if (!form.hora_inicio) throw new Error(t("requestPlan.errors.startTimeRequired"));

    const start_at = toMySQLDatetime(form.fecha_inicio, form.hora_inicio);
    const end_at = toMySQLDatetime(
      form.fecha_fin || form.fecha_inicio,
      form.hora_fin || form.hora_inicio
    );

    const start = mysqlToDate(start_at);
    const end = mysqlToDate(end_at);

    if (!start || !end) throw new Error(t("requestPlan.errors.invalidDateTime"));
    if (end < start) throw new Error(t("requestPlan.errors.endBeforeStart"));

    const tagsArr = (form.tags || "")
      .split(",")
      .map((tTag) => tTag.trim())
      .filter(Boolean)
      .slice(0, 12);

    const categoria = form.categoria;
    const detalle = form.categoria_detalle.trim() || null;

    if (categoria === "otro" && !detalle) {
      throw new Error(t("requestPlan.errors.otherNeedsDetail"));
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

      const res = await fetch("http://localhost:3001/api/eventos/solicitud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": i18n.language,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = t("requestPlan.errors.submitFailed");
        try {
          const data = await res.json();
          msg = data?.message || msg;
        } catch {}
        throw new Error(msg);
      }

      alert(t("requestPlan.success.sent"));

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
      alert(err?.message || t("requestPlan.errors.sendError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <Header />

      <main className="solicitar-plan-container">
        <form className="solicitar-plan-form" onSubmit={handleSubmit}>
          <h1 className="solicitar-plan-title">{t("requestPlan.title")}</h1>

          <p className="solicitar-plan-subtitle">
            {t("requestPlan.subtitle")}
          </p>

          <input
            type="text"
            name="titulo"
            placeholder={t("requestPlan.placeholders.title")}
            value={form.titulo}
            onChange={handleChange}
            required
          />

          <textarea
            name="descripcion"
            placeholder={t("requestPlan.placeholders.description")}
            value={form.descripcion}
            onChange={handleChange}
            required
          />

          <label>{t("requestPlan.labels.category")}</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            required
          >
            {categorias.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <label>{t("requestPlan.labels.detail")}</label>
          <input
            type="text"
            name="categoria_detalle"
            placeholder={t("requestPlan.placeholders.detail")}
            value={form.categoria_detalle}
            onChange={handleChange}
          />

          <div className="solicitar-plan-grid">
            <div>
              <label>{t("requestPlan.labels.startDate")}</label>
              <input
                type="date"
                name="fecha_inicio"
                value={form.fecha_inicio}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>{t("requestPlan.labels.startTime")}</label>
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
              <label>{t("requestPlan.labels.endDate")}</label>
              <input
                type="date"
                name="fecha_fin"
                value={form.fecha_fin}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>{t("requestPlan.labels.endTime")}</label>
              <input
                type="time"
                name="hora_fin"
                value={form.hora_fin}
                onChange={handleChange}
              />
            </div>
          </div>

          <label>{t("requestPlan.labels.municipality")}</label>
          <input
            type="text"
            name="municipio"
            placeholder={t("requestPlan.placeholders.municipality")}
            value={form.municipio}
            onChange={handleChange}
          />

          <label>{t("requestPlan.labels.address")}</label>
          <input
            type="text"
            name="direccion"
            placeholder={t("requestPlan.placeholders.address")}
            value={form.direccion}
            onChange={handleChange}
          />

          <label>{t("requestPlan.labels.tags")}</label>
          <input
            type="text"
            name="tags"
            placeholder={t("requestPlan.placeholders.tags")}
            value={form.tags}
            onChange={handleChange}
          />

          <label>{t("requestPlan.labels.image")}</label>

          <div className="solicitar-plan-img-row">
            <input
              type="text"
              name="imagen"
              placeholder={t("requestPlan.placeholders.imageUrl")}
              value={form.imagenArchivo ? "" : form.imagen}
              onChange={handleChange}
              disabled={!!form.imagenArchivo}
            />

            <label className="solicitar-plan-file-btn">
              {t("requestPlan.buttons.uploadImage")}
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
            {submitting
              ? t("requestPlan.buttons.sending")
              : t("requestPlan.buttons.submit")}
          </button>

          <p className="solicitar-plan-hint">
            {t("requestPlan.hint")}
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
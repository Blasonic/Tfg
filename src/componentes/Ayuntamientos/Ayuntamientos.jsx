import React, { useEffect, useState } from "react";
import "./Ayuntamientos.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  listarAyuntamientos,
  listarPlanesPorMunicipio,
} from "../../ServiciosBack/ayuntamientosService";

function buildAyuntamientoMapsQuery(ayuntamiento) {
  return [
    ayuntamiento.direccion,
    ayuntamiento.municipio,
    ayuntamiento.provincia || "Madrid",
  ]
    .filter(Boolean)
    .join(", ");
}

function getAyuntamientoImage(ayuntamiento) {
  return ayuntamiento?.imagen || "/imagenes/default-ayuntamiento.jpg";
}

function getLocalizedField(item, field, language) {
  if (!item) return "";

  if (language === "en") {
    return item[`${field}_en`] || item[field] || "";
  }

  return item[`${field}_es`] || item[field] || "";
}

const Ayuntamientos = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("common");
  const language = i18n.language?.startsWith("en") ? "en" : "es";

  const camposInfo = [
    ["datos_clave", t("ayuntamientos.campos.datosClave")],
    ["entorno_natural", t("ayuntamientos.campos.entornoNatural")],
    [
      "patrimonio_arquitectura",
      t("ayuntamientos.campos.patrimonioArquitectura"),
    ],
    [
      "turismo_historia_actividades",
      t("ayuntamientos.campos.turismoHistoriaActividades"),
    ],
    ["vida_local", t("ayuntamientos.campos.vidaLocal")],
    ["vida_local_tradiciones", t("ayuntamientos.campos.vidaLocalTradiciones")],
    ["economia_turismo", t("ayuntamientos.campos.economiaTurismo")],
  ];

  const [ayuntamientos, setAyuntamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [planesAbiertos, setPlanesAbiertos] = useState({});
  const [planesPorMunicipio, setPlanesPorMunicipio] = useState({});
  const [loadingPlanes, setLoadingPlanes] = useState({});

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await listarAyuntamientos();
        setAyuntamientos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  const togglePlanes = async (municipio) => {
    if (planesAbiertos[municipio]) {
      setPlanesAbiertos((prev) => ({
        ...prev,
        [municipio]: false,
      }));
      return;
    }

    setPlanesAbiertos((prev) => ({
      ...prev,
      [municipio]: true,
    }));

    if (planesPorMunicipio[municipio]) return;

    setLoadingPlanes((prev) => ({
      ...prev,
      [municipio]: true,
    }));

    try {
      const data = await listarPlanesPorMunicipio(municipio);

      setPlanesPorMunicipio((prev) => ({
        ...prev,
        [municipio]: Array.isArray(data) ? data : [],
      }));
    } catch (error) {
      console.error(error);
      setPlanesPorMunicipio((prev) => ({
        ...prev,
        [municipio]: [],
      }));
    } finally {
      setLoadingPlanes((prev) => ({
        ...prev,
        [municipio]: false,
      }));
    }
  };

  return (
    <>
      <Header />

      <main className="ayuntamientos-page">
        <section className="ayuntamientos-hero">
          <h1>{t("ayuntamientos.titulo")}</h1>
          <p>{t("ayuntamientos.descripcion")}</p>
        </section>

        <section className="ayuntamientos-grid">
          {loading ? (
            <p className="ayuntamientos-info">
              {t("ayuntamientos.cargando")}
            </p>
          ) : ayuntamientos.length === 0 ? (
            <p className="ayuntamientos-info">
              {t("ayuntamientos.sinAyuntamientos")}
            </p>
          ) : (
            ayuntamientos.map((item) => (
              <article key={item.id} className="ayuntamiento-card">
                <div className="ayuntamiento-info">
                  <h3>{item.municipio}</h3>

                  {item.zona && (
                    <span className="ayuntamiento-zona">{item.zona}</span>
                  )}

                  <p className="ayuntamiento-desc">
                    {getLocalizedField(item, "descripcion", language)}
                  </p>

                  <div className="ayuntamiento-actions">
                    <button type="button" onClick={() => setSelected(item)}>
                      {t("ayuntamientos.verInformacion")}
                    </button>

                    <button
                      type="button"
                      onClick={() => togglePlanes(item.municipio)}
                    >
                      {planesAbiertos[item.municipio]
                        ? t("ayuntamientos.ocultarPlanes")
                        : t("ayuntamientos.verPlanes")}
                    </button>
                  </div>

                  {planesAbiertos[item.municipio] && (
                    <div className="ayuntamiento-planes">
                      {loadingPlanes[item.municipio] ? (
                        <p className="ayuntamiento-planes-info">
                          {t("ayuntamientos.cargandoPlanes")}
                        </p>
                      ) : planesPorMunicipio[item.municipio]?.length > 0 ? (
                        planesPorMunicipio[item.municipio].map((plan) => (
                          <div key={plan.id} className="ayuntamiento-plan-item">
                            <div>
                              <h4>
                                {getLocalizedField(plan, "titulo", language)}
                              </h4>

                              {plan.start_at && (
                                <p>
                                  {new Date(plan.start_at).toLocaleString(
                                    language === "en" ? "en-GB" : "es-ES"
                                  )}
                                </p>
                              )}

                              {plan.categoria && (
                                <p>
                                  {plan.categoria}
                                  {plan.categoria_detalle
                                    ? ` · ${plan.categoria_detalle}`
                                    : ""}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              className="btn-nuevo-evento"
                              onClick={() =>
                                navigate(
                                  `/CalendarioGlobal?eventoId=${plan.id}`
                                )
                              }
                            >
                              {t("ayuntamientos.verEvento")}
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="ayuntamiento-planes-info">
                          {t("ayuntamientos.sinPlanesMunicipio")}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="ayuntamiento-img">
                  <img
                    src={getAyuntamientoImage(item)}
                    alt={item.municipio}
                    onError={(e) => {
                      e.currentTarget.src =
                        "/imagenes/default-ayuntamiento.jpg";
                    }}
                  />
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      {selected && (
        <div
          className="ayuntamiento-modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="ayuntamiento-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="ayuntamiento-modal-close"
              onClick={() => setSelected(null)}
              type="button"
              aria-label={t("ayuntamientos.cerrar")}
            >
              ✖
            </button>

            <div className="ayuntamiento-modal-grid">
              <div className="ayuntamiento-modal-img">
                <img
                  src={getAyuntamientoImage(selected)}
                  alt={selected.municipio}
                  onError={(e) => {
                    e.currentTarget.src =
                      "/imagenes/default-ayuntamiento.jpg";
                  }}
                />
              </div>

              <div className="ayuntamiento-modal-content">
                <h2>{selected.municipio}</h2>

                {selected.zona && (
                  <span className="ayuntamiento-pill">{selected.zona}</span>
                )}

                <p className="ayuntamiento-modal-desc">
                  {getLocalizedField(selected, "descripcion", language)}
                </p>

                <div className="ayuntamiento-section">
                  <h4>{t("ayuntamientos.ubicacion")}</h4>

                  <p>📍 {buildAyuntamientoMapsQuery(selected)}</p>

                  <div className="ayuntamiento-map">
                    <iframe
                      title={t("ayuntamientos.mapaDe", {
                        municipio: selected.municipio,
                      })}
                      width="100%"
                      height="240"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        buildAyuntamientoMapsQuery(selected)
                      )}&output=embed`}
                    />
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      buildAyuntamientoMapsQuery(selected)
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-nuevo-evento ayuntamiento-maps-link"
                  >
                    {t("ayuntamientos.verGoogleMaps")}
                  </a>
                </div>

                {camposInfo.map(([key, label]) => {
                  const value = getLocalizedField(selected, key, language);

                  return value ? (
                    <div className="ayuntamiento-section" key={key}>
                      <h4>{label}</h4>
                      <p>{value}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Ayuntamientos;
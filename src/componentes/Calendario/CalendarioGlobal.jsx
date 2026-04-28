import React, { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendario.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import FormularioAnadir from "../Calendario/FormularioAnadir";
import EventoCard from "./EventoCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { listarFiestasPublicadas, crearFiesta } from "../../ServiciosBack/eventsService";
import { auth } from "../../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function mysqlToDate(dt) {
  if (!dt) return null;
  const iso = dt.includes("T") ? dt : dt.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function ymd(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const CalendarioGlobal = () => {
  const { t } = useTranslation();

  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const eventoId = queryParams.get("eventoId");

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("user");
        setUsuario(raw ? JSON.parse(raw) : null);
      } catch {
        setUsuario(null);
      }
    };

    load();
    window.addEventListener("user-updated", load);
    window.addEventListener("storage", load);

    return () => {
      window.removeEventListener("user-updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const cargarEventos = async () => {
    setLoading(true);
    try {
      const data = await listarFiestasPublicadas();

      const normalizados = (Array.isArray(data) ? data : [])
        .map((ev) => {
          const start = mysqlToDate(ev.start_at);
          const end = mysqlToDate(ev.end_at) || start;
          return { ...ev, start, end };
        })
        .filter((ev) => ev.start);

      normalizados.sort((a, b) => (a.titulo || "").localeCompare(b.titulo || ""));
      setEventos(normalizados);
    } catch (e) {
      console.error(e);
      toast.error(t("calendar.errors.loadEvents"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  useEffect(() => {
    if (!eventoId || eventos.length === 0) return;

    const evento = eventos.find((e) => String(e.id) === String(eventoId));

    if (evento) {
      setFechaSeleccionada(new Date(evento.start));

      setTimeout(() => {
        const btn = document.querySelector(`[data-evento-id="${evento.id}"]`);
        if (btn) btn.click();
      }, 300);

      navigate("/CalendarioGlobal", { replace: true });
    }
  }, [eventoId, eventos, navigate]);

  const eventosDelDia = useMemo(() => {
    const dia = ymd(fechaSeleccionada);
    return eventos
      .filter((ev) => {
        const ini = ymd(ev.start);
        const fin = ymd(ev.end || ev.start);
        return dia >= ini && dia <= fin;
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [eventos, fechaSeleccionada]);

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dia = ymd(date);
    const tiene = eventos.some((ev) => {
      const ini = ymd(ev.start);
      const fin = ymd(ev.end || ev.start);
      return dia >= ini && dia <= fin;
    });
    return tiene ? <div className="dot"></div> : null;
  };

  return (
    <>
      <Header />

      <div className="calendario-container">
        <div className="calendario-panel">
          <Calendar
            onClickDay={setFechaSeleccionada}
            tileContent={tileContent}
            value={fechaSeleccionada}
          />
        </div>

        <div className="eventos-panel">
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <h3 style={{ textAlign: "center", margin: 0 }}>
              {t("calendar.title")}
            </h3>

            {(usuario || auth.currentUser) && (
              <button
                onClick={() => setMostrarFormulario(true)}
                className="btn-nuevo-evento"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {t("calendar.addEvent")}
              </button>
            )}
          </div>

          {loading ? (
            <p>{t("calendar.loading")}</p>
          ) : eventosDelDia.length === 0 ? (
            <p>{t("calendar.noEventsForDay")}</p>
          ) : (
            eventosDelDia.map((ev) => (
              <EventoCard key={ev.id} evento={ev} />
            ))
          )}
        </div>
      </div>

      {mostrarFormulario && (
        <FormularioAnadir
          onClose={() => setMostrarFormulario(false)}
          onSubmit={async (payload) => {
            try {
              await crearFiesta(payload);
              toast.success(t("calendar.success.eventSubmitted"));
              setMostrarFormulario(false);
              await cargarEventos();
            } catch (e) {
              toast.error(e.message || t("calendar.errors.submitEvent"));
            }
          }}
        />
      )}

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      <Footer />
    </>
  );
};

export default CalendarioGlobal;
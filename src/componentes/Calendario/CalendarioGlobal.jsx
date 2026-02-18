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
import { auth } from "../../firebase"; // ajusta ruta

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
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);

  const usuario = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
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
      toast.error("Error al cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

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
          <Calendar onClickDay={setFechaSeleccionada} tileContent={tileContent} value={fechaSeleccionada} />
        </div>

        <div className="eventos-panel">
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <h3 style={{ textAlign: "center", margin: 0 }}>Planes</h3>

            {(usuario || auth.currentUser) && (
              <button
                onClick={() => setMostrarFormulario(true)}
                className="btn-nuevo-evento"
                style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
              >
                Añadir evento
              </button>
            )}
          </div>

          {loading ? (
            <p>Cargando eventos...</p>
          ) : eventosDelDia.length === 0 ? (
            <p>No hay eventos para este día.</p>
          ) : (
            eventosDelDia.map((ev) => <EventoCard key={ev.id} evento={ev} />)
          )}
        </div>
      </div>

      {mostrarFormulario && (
        <FormularioAnadir
          onClose={() => setMostrarFormulario(false)}
          onSubmit={async (payload) => {
            try {
              await crearFiesta(payload);
              toast.success("🎉 Evento enviado correctamente.");
              setMostrarFormulario(false);
              await cargarEventos();
            } catch (e) {
              toast.error(e.message || "Error al enviar el evento");
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

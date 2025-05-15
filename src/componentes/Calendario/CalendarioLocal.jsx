import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import EventoCard from './EventoCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CalendarioLocal = () => {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const cargarEventos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/fiestas/aceptadas');
      const data = await res.json();
      const filtrados = data.filter(ev => ev.tipo === 'local');
      const ordenados = filtrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
      setEventos(ordenados);
    } catch (error) {
      console.error('Error cargando eventos:', error);
      toast.error('Error al cargar los eventos');
    }
  };

  useEffect(() => {
    cargarEventos();
    const interval = setInterval(() => {
      cargarEventos();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatearFecha = (fecha) => {
    const d = new Date(fecha);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const obtenerEventosDelDia = (date) => {
    const dia = formatearFecha(date);
    return eventos.filter(ev => {
      const inicio = formatearFecha(ev.fecha_inicio);
      const fin = formatearFecha(ev.fecha_fin);
      return dia >= inicio && dia <= fin;
    }).sort((a, b) => (a.hora_inicio || '').localeCompare(b.hora_inicio || ''));
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month' && obtenerEventosDelDia(date).length > 0) {
      return <div className="dot"></div>;
    }
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
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <h3 style={{ textAlign: 'center', margin: 0 }}>Planes hoy</h3>
          </div>

          {fechaSeleccionada ? (() => {
            const eventosDia = obtenerEventosDelDia(fechaSeleccionada);
            if (eventosDia.length === 0) return <p>No hay eventos para este día.</p>;

            return eventosDia.map(ev => (
              <EventoCard key={ev.id} evento={ev} />
            ));
          })() : <p>Selecciona un día para ver los eventos.</p>}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
      <Footer />
    </>
  );
};

export default CalendarioLocal;

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import FormularioAnadir from '../Calendario/FormularioAnadir';
import EventoCard from './EventoCard';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CalendarioGlobal = () => {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('user'));

  const cargarEventosAceptados = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/fiestas/aceptadas');
      const data = await res.json();
      const eventosOrdenados = data.sort((a, b) => a.titulo.localeCompare(b.titulo));
      setEventos(eventosOrdenados);
    } catch (error) {
      console.error('Error cargando eventos:', error);
      toast.error('Error al cargar los eventos');
    }
  };

  useEffect(() => {
    cargarEventosAceptados();
    const interval = setInterval(() => {
      cargarEventosAceptados();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatearFecha = (fecha) => {
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const obtenerEventosDelDia = (date) => {
    const diaSeleccionado = formatearFecha(date);

    return eventos
      .filter(ev => {
        const inicio = formatearFecha(ev.fecha_inicio);
        const fin = formatearFecha(ev.fecha_fin);
        return diaSeleccionado >= inicio && diaSeleccionado <= fin;
      })
      .sort((a, b) => {
        const horaA = a.hora_inicio ? 0 : 1;
        const horaB = b.hora_inicio ? 0 : 1;
        if (horaA !== horaB) return horaA - horaB;
        const horaTextoA = a.hora_inicio || '';
        const horaTextoB = b.hora_inicio || '';
        return horaTextoA.localeCompare(horaTextoB);
      });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const tieneEventos = obtenerEventosDelDia(date).length > 0;
      return tieneEventos ? <div className="dot"></div> : null;
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
          {/* Título centrado con botón a la derecha */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <h3 style={{ textAlign: 'center', margin: 0 }}>Planes</h3>
            {usuario && (
              <button
                onClick={() => setMostrarFormulario(true)}
                className="btn-nuevo-evento"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              >
                Añadir evento
              </button>
            )}
          </div>

          {fechaSeleccionada ? (() => {
            const eventosDelDia = obtenerEventosDelDia(fechaSeleccionada);

            if (eventosDelDia.length === 0) {
              return <p>No hay eventos para este día.</p>;
            }

            return (
  <>
    {eventosDelDia.map((ev) => (
      <EventoCard key={ev.id} evento={ev} />
    ))}
  </>
);

          })() : (
            <p>Selecciona un día para ver los eventos.</p>
          )}
        </div>
      </div>

      {mostrarFormulario && (
        <FormularioAnadir
          onSubmit={async (data) => {
            if (!data) {
              setMostrarFormulario(false);
              return;
            }

            try {
              const token = localStorage.getItem('token');
              const res = await fetch('http://localhost:3000/api/fiestas/solicitar', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
              });

              const respuesta = await res.json();

              if (res.ok) {
                toast.success('🎉 Evento enviado correctamente para revisión.');
                setMostrarFormulario(false);
              } else {
                toast.error(`❌ Error: ${respuesta.message}`);
              }
            } catch (err) {
              console.error('❌ Error al enviar el evento:', err);
              toast.error('Error al enviar el evento.');
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

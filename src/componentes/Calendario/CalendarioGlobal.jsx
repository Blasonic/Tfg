import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';
import Eventos from './Eventos';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import FormularioAnadir from '../Calendario/FormularioAnadir';

const CalendarioGlobal = () => {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('user'));

  // 🔁 Función para cargar eventos aceptados
  const cargarEventosAceptados = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/fiestas/aceptadas');
      const data = await res.json();
      const eventosOrdenados = data.sort((a, b) => a.titulo.localeCompare(b.titulo));
      setEventos(eventosOrdenados);
    } catch (error) {
      console.error('Error cargando eventos:', error);
    }
  };

  // 🕒 Cargar eventos al montar y luego cada 10 segundos
  useEffect(() => {
    cargarEventosAceptados();

    const interval = setInterval(() => {
      cargarEventosAceptados();
    }, 10000); // cada 10 segundos

    return () => clearInterval(interval); // limpiar al desmontar
  }, []);

  const obtenerEventosDelDia = (date) => {
    const dia = date.toISOString().split('T')[0];
    return eventos
      .filter(ev => ev.fecha === dia)
      .sort((a, b) => a.hora.localeCompare(b.hora));
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
          />
        </div>

        <div className="eventos-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Eventos del día</h3>
            {usuario && (
              <button onClick={() => setMostrarFormulario(true)} className="btn-nuevo-evento">
                Añadir evento
              </button>
            )}
          </div>

          {fechaSeleccionada && (
            <Eventos
              fecha={fechaSeleccionada}
              eventos={obtenerEventosDelDia(fechaSeleccionada)}
              onClose={() => setFechaSeleccionada(null)}
            />
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
                alert('🎉 Evento enviado correctamente para revisión.');
                setMostrarFormulario(false);
              } else {
                alert(`❌ Error: ${respuesta.message}`);
              }
            } catch (err) {
              console.error('❌ Error al enviar el evento:', err);
              alert('Error al enviar el evento.');
            }
          }}
        />
      )}

      <Footer />
    </>
  );
};

export default CalendarioGlobal;

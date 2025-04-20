import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css';
import Eventos from './Eventos';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import FormularioAnadir from './FormularioAnadir';

const CalendarioGlobal = () => {
  const [eventos, setEventos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch('http://localhost:3000/api/fiestas/aceptadas')
      .then(res => res.json())
      .then(data => {
        setEventos(data);
      })
      .catch(error => {
        console.error('Error cargando eventos:', error);
      });
  }, []);

  const obtenerEventosDelDia = (date) => {
    const dia = date.toISOString().split('T')[0];
    return eventos.filter(ev => ev.fecha === dia);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <h2>Calendario Global</h2>
            {usuario && (
              <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="btn-nuevo-evento">
                {mostrarFormulario ? 'Cerrar' : 'Añadir evento'}
              </button>
            )}
          </div>

          <Calendar
            onClickDay={setFechaSeleccionada}
            tileContent={tileContent}
          />

          {mostrarFormulario && (
            <FormularioAnadir
              onSubmit={(data) => {
                console.log("📨 Evento enviado:", data);
                setMostrarFormulario(false);
              }}
            />
          )}
        </div>

        <div className="eventos-panel">
          <h3>Eventos del día</h3>
          {fechaSeleccionada && (
            <Eventos
              fecha={fechaSeleccionada}
              eventos={obtenerEventosDelDia(fechaSeleccionada)}
              onClose={() => setFechaSeleccionada(null)}
            />
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CalendarioGlobal;

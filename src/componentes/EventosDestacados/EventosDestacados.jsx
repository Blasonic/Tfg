import React, { useEffect, useMemo, useState } from "react";
import "./EventosDestacados.css";
import EventoDestacadoCard from "./EventoDestacadoCard";

const EventosDestacados = ({ eventos = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPorVista, setCardsPorVista] = useState(4);

  useEffect(() => {
    const actualizarCardsPorVista = () => {
      if (window.innerWidth <= 640) {
        setCardsPorVista(1);
      } else if (window.innerWidth <= 1024) {
        setCardsPorVista(2);
      } else {
        setCardsPorVista(4);
      }
    };

    actualizarCardsPorVista();
    window.addEventListener("resize", actualizarCardsPorVista);

    return () => window.removeEventListener("resize", actualizarCardsPorVista);
  }, []);

  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const anioActual = hoy.getFullYear();

  const nombreMes = hoy
    .toLocaleDateString("es-ES", { month: "long" })
    .toUpperCase();

  const eventosDestacados = useMemo(() => {
    const inicioMes = new Date(anioActual, mesActual, 1, 0, 0, 0);
    const finMes = new Date(anioActual, mesActual + 1, 0, 23, 59, 59);

    return [...eventos]
      .filter((evento) => {
        if (!evento.start) return false;

        const inicioEvento = new Date(evento.start);
        const finEvento = evento.end ? new Date(evento.end) : inicioEvento;

        return inicioEvento <= finMes && finEvento >= inicioMes;
      })
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);
  }, [eventos, anioActual, mesActual]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [eventosDestacados.length, cardsPorVista]);

  const maxIndex = Math.max(0, eventosDestacados.length - cardsPorVista);

  const siguiente = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const anterior = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const puedeIrIzquierda = currentIndex > 0;
  const puedeIrDerecha = currentIndex < maxIndex;

  if (!eventosDestacados.length) {
    return (
      <section className="eventos-destacados">
        <div className="eventos-destacados__container">
          <div className="eventos-destacados__header">
            <h2>{nombreMes}</h2>
            <p>No hay eventos destacados para este mes.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="eventos-destacados">
      <div className="eventos-destacados__container">
        <div className="eventos-destacados__header">
          <h2>{nombreMes}</h2>
          <p>
            Descubre los eventos mejor valorados de este mes y encuentra los
            planes más destacados.
          </p>
        </div>

        <div className="eventos-destacados__divider"></div>

        <div className="eventos-destacados__slider-wrapper">
          <button
            className={`eventos-destacados__arrow ${
              !puedeIrIzquierda ? "disabled" : ""
            }`}
            onClick={anterior}
            disabled={!puedeIrIzquierda}
            aria-label="Ver eventos anteriores"
          >
            &#10094;
          </button>

          <div className="eventos-destacados__viewport">
            <div
              className="eventos-destacados__track"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / cardsPorVista)
                }%)`,
              }}
            >
              {eventosDestacados.map((evento) => (
                <div
                  key={evento.id}
                  className="eventos-destacados__slide"
                  style={{ flex: `0 0 ${100 / cardsPorVista}%` }}
                >
                  <EventoDestacadoCard evento={evento} />
                </div>
              ))}
            </div>
          </div>

          <button
            className={`eventos-destacados__arrow ${
              !puedeIrDerecha ? "disabled" : ""
            }`}
            onClick={siguiente}
            disabled={!puedeIrDerecha}
            aria-label="Ver eventos siguientes"
          >
            &#10095;
          </button>
        </div>

        <div className="eventos-destacados__dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`eventos-destacados__dot ${
                i === currentIndex ? "active" : ""
              }`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Ir a la posición ${i + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventosDestacados;
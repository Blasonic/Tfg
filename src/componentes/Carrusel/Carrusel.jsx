import { useState, useEffect } from "react";
import "./Carrusel.css";

const images = [
  "/imagenes/carrusel1.jpg",
  "/imagenes/carrusel2.jpg",
  "/imagenes/carrusel3.jpg",
  "/imagenes/carrusel4.jpg",
  "/imagenes/carrusel5.jpg",
  "/imagenes/carrusel6.jpg",
  "/imagenes/carrusel7.jpg",
  "/imagenes/carrusel8.jpg",
  "/imagenes/carrusel9.jpg",
];

function Carrusel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Cambiar cada 2 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <img src={images[index]} alt="Carousel" className="carousel-image" />
    </div>
  );
}

export default Carrusel;

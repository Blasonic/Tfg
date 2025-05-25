import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Ayuda.css';

function Ayuda() {
    const faqData = [
        {
            category: 'Añadir Eventos',
            questions: [
                { 
                    question: '¿Cómo sé cuál es mi talla correcta?',
                    answer: 'Puedes usar nuestra guía de tallas, disponible en la página de cada producto. También te recomendamos medir tu pie para mayor precisión.'
                },
                { 
                    question: '¿Tienen tallas para niños o tallas especiales?',
                    answer: 'Sí, contamos con una amplia gama de tallas, incluyendo tallas para niños y opciones de ancho especial.'
                },
                { 
                    question: '¿Cómo puedo verificar la disponibilidad de un modelo en mi talla?',
                    answer: 'Puedes seleccionar tu talla en la página del producto, y te indicaremos si está disponible o no.'
                },
                { 
                    question: '¿Cómo sé si el producto que quiero está disponible?',
                    answer: 'Los productos disponibles estarán marcados como “En stock”. Si no está disponible, podrás registrarte para recibir una notificación cuando vuelva a estar disponible.'
                },
                { 
                    question: '¿Cómo puedo ver las características y materiales de las zapatillas?',
                    answer: 'Cada producto tiene una sección donde podrás ver todos los detalles, materiales, características técnicas y más.'
                },
            ],
        },
        {
            category: 'Soporte',
            questions: [
                { 
                    question: '¿Hacen envíos internacionales?',
                    answer: 'Sí, realizamos envíos a la mayoría de los países. Los costos y tiempos de entrega varían según la ubicación.'
                },
                { 
                    question: '¿Qué hago si mi pedido no llega?',
                    answer: 'Por favor, contáctanos a través de nuestro formulario de soporte para que podamos rastrear tu pedido y resolver cualquier problema.'
                },
                { 
                    question: '¿El envío tiene algún costo?',
                    answer: 'El envío es gratuito para pedidos superiores a 50€. Para pedidos menores, el costo se calcula al finalizar la compra.'
                },
                { 
                    question: '¿Cómo puedo hacer un seguimiento de mi pedido?',
                    answer: 'Te proporcionamos un número de seguimiento para que puedas ver el estado de tu envío en tiempo real desde la página de seguimiento.'
                },
                { 
                    question: '¿Cómo devuelvo un producto?',
                    answer: 'Si no estás satisfecho con tu compra, puedes devolver el producto dentro de los 30 días posteriores a la compra. Asegúrate de que esté en su estado original.'
                },
                { 
                    question: '¿Puedo cambiar un producto por otro?',
                    answer: 'Sí, puedes realizar un cambio siempre que el producto no haya sido usado y se encuentre en su embalaje original.'
                },
            ],
        },
        {
            category: 'Comentarios',
            questions: [
                { 
                    question: '¿Es seguro comprar en su tienda?',
                    answer: 'Sí, nuestra tienda utiliza cifrado SSL para proteger tus datos y garantizar una experiencia de compra segura.'
                },
                { 
                    question: '¿Ofrecen opciones de financiamiento o pago a plazos?',
                    answer: 'Sí, ofrecemos la opción de pagar a plazos a través de nuestros socios financieros. Consulta los detalles al finalizar la compra.'
                },
                { 
                    question: '¿Puedo pagar contra reembolso?',
                    answer: 'Actualmente no ofrecemos la opción de pago contra reembolso.'
                },
                { 
                    question: '¿Cuáles son los métodos de pago aceptados?',
                    answer: 'Aceptamos tarjetas de crédito y débito, PayPal, y otros métodos de pago como Stripe.'
                },
                { 
                    question: '¿Se puede aplicar un cupón de descuento en la compra?',
                    answer: 'Sí, si tienes un código de descuento, puedes ingresarlo en la sección de pago para obtener el descuento en tu pedido.'
                },
            ],
        },
        {
            category: 'Iicio de sesión y Cuenta',
            questions: [
                { 
                    question: '¿Cómo puedo crear una cuenta?',
                    answer: 'Puedes crear una cuenta fácilmente haciendo clic en “Crear cuenta” en la parte superior derecha de la página y completando los campos necesarios.'
                },
                { 
                    question: '¿Cómo restablezco mi contraseña?',
                    answer: 'Si olvidaste tu contraseña, ve a la sección de “Olvidé mi contraseña” en la página de inicio de sesión y sigue las instrucciones para restablecerla.'
                },
                { 
                    question: '¿Puedo eliminar mi cuenta?',
                    answer: 'Sí, si deseas eliminar tu cuenta, puedes ponerte en contacto con nuestro equipo de soporte para que lo gestionen.'
                },
            ],
        },
        
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            <Header />
            <div className="ayuda-container">
                <h1>Centro de Ayuda</h1>
                {faqData.map((section, index) => (
                    <div key={index} className="faq-section">
                        <h2>{section.category}</h2>
                        <ul>
                            {section.questions.map((q, idx) => (
                                <li key={idx} className="faq-item">
                                    <div 
                                        className="faq-question" 
                                        onClick={() => toggleAnswer(idx)}
                                    >
                                        <h3>{q.question}</h3>
                                    </div>
                                    {openIndex === idx && (
                                        <div className="faq-answer">
                                            <p>{q.answer}</p>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default Ayuda;

import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Ayuda.css';

function Ayuda() {
    const faqData = [
        {
            category: 'Eventos',
            questions: [
                {
                    question: '¿Cómo puedo añadir un nuevo evento?',
                    answer: 'Haz clic en "Añadir evento" en la página principal del calendario. Completa el formulario con los datos del evento y envíalo para su revisión.'
                },
                {
                    question: '¿Por qué mi evento no aparece de inmediato?',
                    answer: 'Todos los eventos enviados deben ser aprobados por un moderador. Una vez aprobado, se mostrará en el calendario.'
                },
                {
                    question: '¿Cómo puedo ver los detalles de un evento?',
                    answer: 'Haz clic en un día del calendario. Aparecerán los eventos programados para ese día y podrás ver sus detalles.'
                },
                {
                    question: '¿Puedo editar o eliminar un evento que creé?',
                    answer: 'Por el momento, no es posible editar o eliminar eventos desde la interfaz. Contacta con el soporte si necesitas hacer cambios.'
                }
            ]
        },
        {
            category: 'Cuenta de Usuario',
            questions: [
                {
                    question: '¿Necesito estar registrado para ver los eventos?',
                    answer: 'No, puedes ver los eventos sin registrarte. Sin embargo, necesitas una cuenta para añadir eventos o comentar.'
                },
                {
                    question: '¿Cómo me registro?',
                    answer: 'Haz clic en "Crear cuenta" en la parte superior del sitio y completa el formulario de registro.'
                },
                {
                    question: '¿Qué pasa si olvido mi contraseña?',
                    answer: 'En la página de inicio de sesión, haz clic en “¿Olvidaste tu contraseña?” y sigue las instrucciones para restablecerla.'
                }
            ]
        },
        {
            category: 'Comentarios',
            questions: [
                {
                    question: '¿Cómo puedo dejar un comentario en un evento?',
                    answer: 'Haz clic en el evento y luego en "Comentar este evento". Selecciona una puntuación y escribe tu opinión.'
                },
                {
                    question: '¿Puedo editar o borrar mi comentario?',
                    answer: 'Actualmente no es posible editar ni eliminar comentarios una vez enviados.'
                },
                {
                    question: '¿Por qué no puedo comentar en algunos eventos?',
                    answer: 'Solo los usuarios registrados pueden comentar. Además, no puedes comentar en eventos que tú mismo creaste.'
                }
            ]
        },
        {
            category: 'Problemas Técnicos',
            questions: [
                {
                    question: 'El calendario no carga, ¿qué hago?',
                    answer: 'Asegúrate de tener conexión a internet. Si el problema persiste, intenta recargar la página o borrar la caché del navegador.'
                },
                {
                    question: 'No se envía el formulario del evento, ¿qué puede estar mal?',
                    answer: 'Verifica que todos los campos obligatorios estén completos y que tengas sesión iniciada. Si el error persiste, contacta con soporte.'
                }
            ]
        },
        {
            category: 'Privacidad y Seguridad',
            questions: [
                {
                    question: '¿Qué datos míos son públicos al crear un evento?',
                    answer: 'Solo se muestra tu nombre y foto de perfil. Tu dirección de correo y otros datos personales no son visibles públicamente.'
                },
                {
                    question: '¿Cómo puedo eliminar mi cuenta?',
                    answer: 'Para eliminar tu cuenta, contacta con nuestro equipo de soporte indicando tu nombre de usuario y correo registrado.'
                },
                {
                    question: '¿Mis comentarios pueden ser vistos por otros usuarios?',
                    answer: 'Sí, los comentarios son públicos y visibles para cualquier persona que acceda al evento.'
                }
            ]
        }
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
                                        onClick={() => toggleAnswer(index + '-' + idx)}
                                    >
                                        <h3>{q.question}</h3>
                                    </div>
                                    {openIndex === index + '-' + idx && (
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

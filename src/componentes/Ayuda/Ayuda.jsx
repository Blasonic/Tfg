import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Ayuda.css";
import { useTranslation } from "react-i18next";

function Ayuda() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = t("help.sections", { returnObjects: true });

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <Header />
      <div className="ayuda-container">
        <h1>{t("help.title")}</h1>

        {faqData.map((section, index) => (
          <div key={index} className="faq-section">
            <h2>{section.category}</h2>
            <ul>
              {section.questions.map((q, idx) => (
                <li key={idx} className="faq-item">
                  <div
                    className="faq-question"
                    onClick={() => toggleAnswer(`${index}-${idx}`)}
                  >
                    <h3>{q.question}</h3>
                  </div>

                  {openIndex === `${index}-${idx}` && (
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
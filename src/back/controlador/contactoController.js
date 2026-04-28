const transporter = require("../configuracion/email");

function getLang(req) {
  return req.headers["accept-language"]?.startsWith("en") ? "en" : "es";
}

const messages = {
  es: {
    required: "Nombre, email y mensaje obligatorios",
    generalSubject: "Mensaje general",
    noPhone: "No proporcionado",
    clientSubject: "Mensaje recibido",
    success: "Mensaje enviado correctamente",
    emailError: "Error enviando correo",
    adminFrom: "Contacto Web",
    adminSubjectPrefix: "📧 CONTACTO WEB",
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    message: "Mensaje",
    clientHtml: (name) =>
      `<p>Hola ${name}, hemos recibido tu mensaje. Responderemos lo antes posible.</p>`,
  },
  en: {
    required: "Name, email, and message are required",
    generalSubject: "General message",
    noPhone: "Not provided",
    clientSubject: "Message received",
    success: "Message sent successfully",
    emailError: "Error sending email",
    adminFrom: "Website Contact",
    adminSubjectPrefix: "📧 WEBSITE CONTACT",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    clientHtml: (name) =>
      `<p>Hello ${name}, we have received your message. We will reply as soon as possible.</p>`,
  },
};

function t(req, key) {
  const lang = getLang(req);
  return messages[lang][key] || messages.es[key] || key;
}

const enviarContacto = async (req, res) => {
  const { name, email, message, phone, subject } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: t(req, "required"),
    });
  }

  const cleanMessage = String(message).replace(/\n/g, "<br>");
  const selectedSubject = subject || t(req, "generalSubject");

  const mailOptionsToRestaurant = {
    from: `"${t(req, "adminFrom")}" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACTO_EMAIL,
    replyTo: email,
    subject: `${t(req, "adminSubjectPrefix")} - ${selectedSubject} - ${name}`,
    html: `
      <p><b>${t(req, "name")}:</b> ${name}</p>
      <p><b>${t(req, "email")}:</b> ${email}</p>
      <p><b>${t(req, "phone")}:</b> ${phone || t(req, "noPhone")}</p>
      <p><b>${t(req, "message")}:</b></p>
      <p>${cleanMessage}</p>
    `,
  };

  const mailOptionsToClient = {
    from: `"${t(req, "adminFrom")}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: t(req, "clientSubject"),
    html: t(req, "clientHtml")(name),
  };

  try {
    await transporter.sendMail(mailOptionsToRestaurant);
    await transporter.sendMail(mailOptionsToClient);

    res.json({
      message: t(req, "success"),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: t(req, "emailError"),
    });
  }
};

module.exports = { enviarContacto };
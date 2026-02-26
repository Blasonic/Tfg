const transporter = require("../configuracion/email");

const enviarContacto = async (req, res) => {
  const { name, email, message, phone, subject } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Nombre, email y mensaje obligatorios" });
  }

  const mailOptionsToRestaurant = {
    from: `"Contacto Web" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACTO_EMAIL,
    replyTo: email,
    subject: `📧 CONTACTO WEB - ${subject || "Mensaje general"} - ${name}`,
    html: `
      <p><b>Nombre:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Teléfono:</b> ${phone || "No proporcionado"}</p>
      <p><b>Mensaje:</b></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  };

  const mailOptionsToClient = {
    from: `"Contacto Web" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Mensaje recibido",
    html: `<p>Hola ${name}, hemos recibido tu mensaje. Responderemos lo antes posible.</p>`,
  };

  try {
    await transporter.sendMail(mailOptionsToRestaurant);
    await transporter.sendMail(mailOptionsToClient);
    res.json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error enviando correo" });
  }
};

module.exports = { enviarContacto };
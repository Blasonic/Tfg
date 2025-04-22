const express = require("express");
const cors = require("cors");
const conectarDB = require("./configuracion/db"); 
require("dotenv").config();

const app = express();

// 🔹 Configurar CORS
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());


conectarDB();


const authRoutes = require("./ruta/routes");
app.use("/api/auth", authRoutes);



// 🔹 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en el puerto ${PORT}`));







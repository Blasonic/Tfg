const express = require("express");
const cors = require("cors");
const conectarDB = require("./configuracion/db"); 
require("dotenv").config();

const app = express();

// 🔹 Configurar CORS
app.use(cors({
  origin: "*", // puedes poner el frontend o el backend de fiestas si quieres limitarlo
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
}));

app.use(express.json());

// 🔹 Conectar a MongoDB
conectarDB();

// 🔹 Importar rutas y montarlas en /api
const userRoutes = require("./ruta/routes");
app.use("/api", userRoutes); // ✅ Aquí se monta el prefijo /api para todas las rutas

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Backend de usuarios corriendo en http://localhost:${PORT}`));

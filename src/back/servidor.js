const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
  })
);

app.use(express.json());

// ✅ Rutas
const userRoutes = require("./ruta/routes");
app.use("/api", userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));

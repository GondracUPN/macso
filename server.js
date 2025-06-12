const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Usar el puerto que proporciona Cloud Run o 8080 en local
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Conectar a MongoDB y arrancar servidor SOLO si conecta bien
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("🔥 Conectado a MongoDB");

  // Rutas de API
  const authRoutes = require("./routes/authRoutes");
  app.use("/api/auth", authRoutes);

  const productRoutes = require("./routes/product");
  app.use("/api/producto", productRoutes);

  const expenseRoutes = require("./routes/gastos");
app.use("/api/gastos", expenseRoutes);

  app.get("/api/mensaje", (req, res) => {
    res.json({ mensaje: "Hola desde el backend!" });
  });

  // Servir el frontend en producción
  app.use(express.static(path.join(__dirname, "frontend", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });

  // Arrancar el servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT} (o en Google Cloud Run)`);

  });
})
.catch((err) => {
  console.error("❌ Error al conectar a MongoDB:", err);
});

// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./capa-presentacion/routes");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/", routes);

// Error handler simple (dev)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gym_reservas";
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conectado a MongoDB:", MONGO_URI);
    app.listen(PORT, () => {
      console.log(`API escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  });

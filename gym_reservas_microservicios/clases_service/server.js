const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./capa-presentacion/routes");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/", routes);

// Error handler global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servicio de clases" });
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/clases_service";
const PORT = process.env.PORT || 3002;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongo conectado:", MONGO_URI);
    app.listen(PORT, () => console.log(`Clases service en puerto ${PORT}`));
  })
  .catch(err => {
    console.error("Error conectando Mongo:", err);
    process.exit(1);
  });

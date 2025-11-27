const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./capa-presentacion/routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", routes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servicio de reservas" });
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/reservas_service";
const PORT = process.env.PORT || 3003;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Reservas DB conectado:", MONGO_URI);
    app.listen(PORT, () => console.log(`Reservas service en puerto ${PORT}`));
  })
  .catch(err => {
    console.error("Error conectando a Mongo (reservas):", err);
    process.exit(1);
  });

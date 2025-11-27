// reservas_service/capa-datos/models/reservation.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  usuarioId: { type: String, required: true },
  usuarioNombre: { type: String, required: true },
  claseId: { type: String, required: true },
  claseNombre: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true }
}, { timestamps: true });

reservationSchema.index({ claseId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Reservation", reservationSchema);

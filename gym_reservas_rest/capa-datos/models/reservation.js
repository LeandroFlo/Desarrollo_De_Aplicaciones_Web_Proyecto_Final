// capa-datos/models/reservation.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  usuario: { type: Schema.Types.ObjectId, ref: "User", required: true },
  claseId: { type: Number, required: true },
  claseNombre: { type: String, required: true },
  date: { type: String, required: true }, // formato AAAA-MM-DD
  time: { type: String, required: true }  // formato HH:MM
}, { timestamps: true });

reservationSchema.index({ claseId: 1, date: 1, time: 1 }, { unique: true }); // protección adicional a nivel BD

module.exports = mongoose.model("Reservation", reservationSchema);

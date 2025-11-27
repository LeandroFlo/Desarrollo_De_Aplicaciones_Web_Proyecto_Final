const mongoose = require("mongoose");

const ClaseSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  profesor: { type: String, required: true, trim: true },
  cupo: { type: Number, required: true, min: 1 }
}, { timestamps: true });

module.exports = mongoose.model("Clase", ClaseSchema);

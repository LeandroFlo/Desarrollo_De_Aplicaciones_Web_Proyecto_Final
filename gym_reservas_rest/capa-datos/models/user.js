// capa-datos/models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

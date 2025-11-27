// capa-datos/repositories/reservationRepo.js
const Reservation = require("../models/reservation");

async function create(data) {
  const r = new Reservation(data);
  return r.save();
}

async function findAll() {
  return Reservation.find().populate("usuario", "nombre").exec();
}

async function findById(id) {
  return Reservation.findById(id).populate("usuario", "nombre").exec();
}

async function findDuplicate(claseId, date, time) {
  return Reservation.findOne({ claseId, date, time }).exec();
}
async function updateById(id, data) {
  return Reservation.findByIdAndUpdate(id, data, { new: true }).exec();
}


async function removeById(id) {
  return Reservation.findByIdAndDelete(id).exec();
}

module.exports = { create, findAll, findById, findDuplicate,updateById, removeById };

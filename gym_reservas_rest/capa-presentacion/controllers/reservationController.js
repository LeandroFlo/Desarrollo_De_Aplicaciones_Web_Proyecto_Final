// capa-presentacion/controllers/reservationController.js
const reservationService = require("../../capa-logica/services/reservationService");

async function createReservation(req, res, next) {
  try {
    const payload = req.body;
    const created = await reservationService.crearReserva(payload);
    return res.status(201).json(created);
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ error: err.error });
    next(err);
  }
}

async function listReservations(req, res, next) {
  try {
    const list = await reservationService.listarReservas();
    return res.json(list);
  } catch (err) {
    next(err);
  }
}

async function getReservation(req, res, next) {
  try {
    const { id } = req.params;
    const r = await reservationService.obtenerReservaPorId(id);
    return res.json(r);
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ error: err.error });
    next(err);
  }
}
async function updateReservation(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await reservationService.actualizarReserva(id, req.body);
    return res.json(updated);
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ error: err.error });
    next(err);
  }
}


async function deleteReservation(req, res, next) {
  try {
    const { id } = req.params;
    const r = await reservationService.eliminarReserva(id);
    return res.json(r);
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ error: err.error });
    next(err);
  }
}

module.exports = { createReservation, listReservations, getReservation,updateReservation, deleteReservation };

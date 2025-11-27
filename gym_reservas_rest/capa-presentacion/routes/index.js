// capa-presentacion/routes/index.js
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const reservationController = require("../controllers/reservationController");
const clasesController = require("../controllers/clasesController");

// Usuarios
router.post("/usuarios", userController.createUser);
router.get("/usuarios", userController.listUsers);

// Clases (static)
router.get("/clases", clasesController.listClases);

// Reservas
router.post("/reservas", reservationController.createReservation);
router.get("/reservas", reservationController.listReservations);
router.get("/reservas/:id", reservationController.getReservation);
router.put("/reservas/:id", reservationController.updateReservation);
router.delete("/reservas/:id", reservationController.deleteReservation);

module.exports = router;

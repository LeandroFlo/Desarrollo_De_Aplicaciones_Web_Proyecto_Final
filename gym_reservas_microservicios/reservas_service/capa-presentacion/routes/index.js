const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

router.post("/reservas", reservationController.createReservation);
router.get("/reservas", reservationController.listReservations);
router.get("/reservas/:id", reservationController.getReservation);
router.delete("/reservas/:id", reservationController.deleteReservation);
router.put("/reservas/:id", reservationController.updateReservation);


module.exports = router;

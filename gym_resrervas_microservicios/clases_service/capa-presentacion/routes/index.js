const express = require("express");
const router = express.Router();
const claseController = require("../controllers/claseController");

router.get("/clases", claseController.list);
router.get("/clases/:id", claseController.get);
router.post("/clases", claseController.create);
router.put("/clases/:id", claseController.update);
router.delete("/clases/:id", claseController.remove);

module.exports = router;

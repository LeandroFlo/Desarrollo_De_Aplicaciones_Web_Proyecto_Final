const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Public
router.post("/usuarios", userController.createUser);
router.get("/usuarios", userController.listUsers);

// Internal for other services
router.post("/usuarios/internal/getOrCreate", userController.getOrCreateInternal);

module.exports = router;

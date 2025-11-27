// capa-presentacion/controllers/userController.js
const userService = require("../../capa-logica/services/userService");

async function createUser(req, res, next) {
  try {
    const { nombre } = req.body;
    const user = await userService.createUser(nombre);
    return res.status(201).json(user);
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ error: err.error || "Error" });
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    return res.json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { createUser, listUsers };

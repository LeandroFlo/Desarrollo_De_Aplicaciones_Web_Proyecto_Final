const userService = require("../../capa-logica/services/userService");

// Endpoint público: crear usuario
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

// Endpoint público: listar
async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    return res.json(users);
  } catch (err) {
    next(err);
  }
}

// Endpoint *interno* para uso por otros microservicios:
// POST /usuarios/internal/getOrCreate  { nombre }
// Devuelve el documento user (creado o existente)
async function getOrCreateInternal(req, res, next) {
  try {
    const { nombre } = req.body;
    const user = await userService.getOrCreateUserByName(nombre);
    return res.json(user);
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ error: err.error });
    next(err);
  }
}

module.exports = { createUser, listUsers, getOrCreateInternal };

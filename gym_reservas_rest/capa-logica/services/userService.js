const userRepo = require("../../capa-datos/repositories/userRepo");


async function getOrCreateUserByName(nombre) {
  nombre = String(nombre || "").trim();
  if (!nombre) throw { status: 400, error: "Nombre inválido." };

  const existing = await userRepo.findByName(nombre);
  if (existing) return existing;

  const created = await userRepo.create({ nombre });
  return created;
}

async function createUser(nombre) {
  nombre = String(nombre || "").trim();
  if (!nombre) throw { status: 400, error: "Nombre inválido." };

  const existing = await userRepo.findByName(nombre);
  if (existing) throw { status: 409, error: "Usuario ya existe." };

  const created = await userRepo.create({ nombre });
  return created;
}

async function listUsers() {
  return userRepo.findAll();
}

module.exports = { getOrCreateUserByName, createUser, listUsers };

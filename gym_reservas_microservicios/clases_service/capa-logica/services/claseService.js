const claseRepo = require("../../capa-datos/repositories/claseRepo");

function validar(payload) {
  const nombre = String(payload.nombre || "").trim();
  const profesor = String(payload.profesor || "").trim();
  const cupo = Number(payload.cupo);

  if (!nombre) return { ok: false, msg: "El nombre es obligatorio." };
  if (!profesor) return { ok: false, msg: "El profesor es obligatorio." };
  if (!cupo || cupo < 1) return { ok: false, msg: "El cupo debe ser mayor a 0." };

  return { ok: true };
}

async function listar() {
  return claseRepo.findAll();
}

async function obtener(id) {
  const c = await claseRepo.findById(id);
  if (!c) throw { status: 404, error: "Clase no encontrada." };
  return c;
}

async function crear(payload) {
  const v = validar(payload);
  if (!v.ok) throw { status: 400, error: v.msg };

  return claseRepo.create(payload);
}

async function actualizar(id, payload) {
  const v = validar(payload);
  if (!v.ok) throw { status: 400, error: v.msg };

  const c = await claseRepo.update(id, payload);
  if (!c) throw { status: 404, error: "Clase no encontrada." };
  return c;
}

async function eliminar(id) {
  const r = await claseRepo.removeById(id);
  if (!r) throw { status: 404, error: "Clase no encontrada." };
  return { ok: true };
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar
};

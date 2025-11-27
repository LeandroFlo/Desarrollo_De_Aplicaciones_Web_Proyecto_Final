const reservationRepo = require("../../capa-datos/repositories/reservationRepo");
const axios = require("axios");

// Configurables por env
const USERS_URL = process.env.USERS_URL || "http://localhost:3001";
const CLASES_URL = process.env.CLASES_URL || "http://localhost:3002";

/* Validaciones */
function validarFechaString(date) {
  if (typeof date !== "string") return { ok: false, msg: "Formato inválido. Usa AAAA-MM-DD." };
  const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
  if (!regexFecha.test(date)) return { ok: false, msg: "Formato inválido. Usa AAAA-MM-DD." };

  const [anio, mes, dia] = date.split("-").map(Number);
  const fechaObj = new Date(anio, mes - 1, dia);

  if (
    fechaObj.getFullYear() !== anio ||
    fechaObj.getMonth() + 1 !== mes ||
    fechaObj.getDate() !== dia
  ) {
    return { ok: false, msg: "Fecha inexistente." };
  }
  return { ok: true };
}

function validarHoraString(time) {
  if (typeof time !== "string") return { ok: false, msg: "Formato de hora inválido." };
  const regexHora = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (!regexHora.test(time)) return { ok: false, msg: "Formato de hora inválido." };
  return { ok: true };
}

/* Helpers que llaman otros servicios */

// Consulta a clases_service para obtener clase por id
async function getClaseFromClasesService(claseId) {
  try {
    const resp = await axios.get(`${CLASES_URL}/clases/${claseId}`, { timeout: 3000 });
    return resp.data;
  } catch (err) {
    // si 404 -> clase no existe
    if (err.response && err.response.status === 404) {
      throw { status: 400, error: "Clase inválida." };
    }
    console.error("Error consultando clases_service:", err.message || err);
    throw { status: 500, error: "No se pudo validar la clase (error inter-servicios)." };
  }
}

// Llama a users_service para getOrCreate
async function getOrCreateUser(nombre) {
  try {
    const resp = await axios.post(`${USERS_URL}/usuarios/internal/getOrCreate`, { nombre }, { timeout: 3000 });
    return resp.data;
  } catch (err) {
    console.error("Error consultando usuarios_service:", err.message || err);
    throw { status: 500, error: "No se pudo crear/obtener usuario (error inter-servicios)." };
  }
}

/* Lógica principal */
async function crearReserva(payload) {
  // payload: { nombre, claseId, date, time }
  const nombre = String(payload.nombre || "").trim();
  const claseId = String(payload.claseId || "").trim();
if (!claseId) throw { status: 400, error: "Clase inválida." };

// validación simple de ObjectId (24 hex chars)
const oidRegex = /^[0-9a-fA-F]{24}$/;
if (!oidRegex.test(claseId)) throw { status: 400, error: "ClaseId con formato inválido." };
  const date = String(payload.date || "").trim();
  const time = String(payload.time || "").trim();

  // validar fecha y hora
  const vf = validarFechaString(date);
  if (!vf.ok) throw { status: 400, error: vf.msg };
  const vh = validarHoraString(time);
  if (!vh.ok) throw { status: 400, error: vh.msg };

  // validar clase consultando clases_service
  const clase = await getClaseFromClasesService(claseId);
  // clase debe contener nombre, id, etc.

  // crear o conseguir usuario llamando a usuarios_service
  const user = await getOrCreateUser(nombre);
  // user debe tener _id y nombre

  // verificar duplicado
  const dup = await reservationRepo.findDuplicate(claseId, date, time);
  if (dup) throw { status: 409, error: "Reserva duplicada (misma clase, fecha y hora)." };

  // crear reserva (denormalizamos nombre e id de usuario)
  const nueva = {
    usuarioId: String(user._id),
    usuarioNombre: String(user.nombre),
    claseId,
    claseNombre: clase.nombre,
    date,
    time
  };

  try {
    const created = await reservationRepo.create(nueva);
    const full = await reservationRepo.findById(created._id);
    return full;
  } catch (err) {
    if (err && err.code === 11000) {
      throw { status: 409, error: "Reserva duplicada (misma clase, fecha y hora)." };
    }
    console.error("Error creando reserva:", err);
    throw { status: 500, error: "Error guardando la reserva." };
  }
}

async function listarReservas() {
  return reservationRepo.findAll();
}

async function obtenerReservaPorId(id) {
  const r = await reservationRepo.findById(id);
  if (!r) throw { status: 404, error: "Reserva no encontrada." };
  return r;
}
async function actualizarReserva(id, data) {
  const r = await reservationRepo.updateById(id, data);
  if (!r) throw { status: 404, error: "Reserva no encontrada." };
  return r;
}

async function eliminarReserva(id) {
  const removed = await reservationRepo.removeById(id);
  if (!removed) throw { status: 404, error: "Reserva no encontrada." };
  return { ok: true };
}

module.exports = {
  crearReserva,
  listarReservas,
  obtenerReservaPorId,
  eliminarReserva,
  actualizarReserva
};

// capa-logica/services/reservationService.js
const reservationRepo = require("../../capa-datos/repositories/reservationRepo");
const profesores = [
  { id: 1, nombre: "Yoga" },
  { id: 2, nombre: "Profesor de Gym" },
  { id: 3, nombre: "Pilates" }
];

const userService = require("./userService");

// Validaciones (mismas que en tu monolito)
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

function getProfesorById(claseId) {
  return profesores.find(p => p.id === Number(claseId));
}

async function crearReserva(payload) {
  // payload: { nombre, claseId, date, time }
  const nombre = String(payload.nombre || "").trim();
  const claseId = Number(payload.claseId);
  const date = String(payload.date || "").trim();
  const time = String(payload.time || "").trim();

  // validar clase
  const profesor = getProfesorById(claseId);
  if (!profesor) throw { status: 400, error: "Clase inválida." };

  // validar fecha
  const vf = validarFechaString(date);
  if (!vf.ok) throw { status: 400, error: vf.msg };

  // validar hora
  const vh = validarHoraString(time);
  if (!vh.ok) throw { status: 400, error: vh.msg };

  // crear o conseguir usuario
  const user = await userService.getOrCreateUserByName(nombre);

  // verificar duplicado
  const dup = await reservationRepo.findDuplicate(claseId, date, time);
  if (dup) throw { status: 409, error: "Reserva duplicada (misma clase, fecha y hora)." };

  // crear reserva
  const nueva = {
    usuario: user._id,
    claseId,
    claseNombre: profesor.nombre,
    date,
    time
  };

  try {
    const created = await reservationRepo.create(nueva);
    // populate usuario nombre for response
    const full = await reservationRepo.findById(created._id);
    return full;
  } catch (err) {
    // Manejar error por índice único (por si concurre)
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

async function eliminarReserva(id) {
  const removed = await reservationRepo.removeById(id);
  if (!removed) throw { status: 404, error: "Reserva no encontrada." };
  return { ok: true };
}
async function actualizarReserva(id, payload) {
  const nombre = String(payload.nombre || "").trim();
  const claseId = Number(payload.claseId);
  const date = String(payload.date || "").trim();
  const time = String(payload.time || "").trim();

  // validar clase
  const profesor = getProfesorById(claseId);
  if (!profesor) throw { status: 400, error: "Clase inválida." };

  // validar fecha
  const vf = validarFechaString(date);
  if (!vf.ok) throw { status: 400, error: vf.msg };

  // validar hora
  const vh = validarHoraString(time);
  if (!vh.ok) throw { status: 400, error: vh.msg };

  // crear o conseguir usuario
  const user = await userService.getOrCreateUserByName(nombre);

  // verificar duplicado (excepto si es la misma reserva)
  const dup = await reservationRepo.findDuplicate(claseId, date, time);
  if (dup && dup._id.toString() !== id) {
    throw { status: 409, error: "Reserva duplicada (misma clase, fecha y hora)." };
  }

  const data = {
    usuario: user._id,
    claseId,
    claseNombre: profesor.nombre,
    date,
    time
  };

  const updated = await reservationRepo.updateById(id, data);
  if (!updated) throw { status: 404, error: "Reserva no encontrada." };

  // devolver populada
  const full = await reservationRepo.findById(id);
  return full;
}


module.exports = {
  crearReserva,
  listarReservas,
  obtenerReservaPorId,
  eliminarReserva,
  actualizarReserva
};

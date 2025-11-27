const reservasRepo = require("../../capa-datos/repositories/reserRepo");
const profesoresRepo = require("../../capa-datos/repositories/profRepo");

function validarFechaString(date) {
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
  const regexHora = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (!regexHora.test(time)) return { ok: false, msg: "Formato de hora inválido." };
  return { ok: true };
}

function crearReserva(usuarioId, claseId, date, time) {
  // sanitizar entradas
  date = String(date).trim();
  time = String(time).trim();

  // validar clase
  const profesores = profesoresRepo.read();
  const profesor = profesores.find(p => p.id === Number(claseId));
  if (!profesor) return { error: "Clase inválida." };

  // validar fecha
  const validoFecha = validarFechaString(date);
  if (!validoFecha.ok) return { error: validoFecha.msg };

  // validar hora
  const validoHora = validarHoraString(time);
  if (!validoHora.ok) return { error: validoHora.msg };

  // leer reservas y chequear duplicado
  const reservas = reservasRepo.read();
  const duplicada = reservas.find(r =>
    r.claseId === Number(claseId) && r.date === date && r.time === time
  );

  if (duplicada) return { error: "Reserva duplicada (misma clase, fecha y hora)." };

  const nueva = {
    id: reservas.length ? reservas[reservas.length - 1].id + 1 : 1,
    usuarioId,
    claseId: Number(claseId),
    profesor: profesor.nombre,
    date,
    time
  };

  reservas.push(nueva);
  reservasRepo.write(reservas);

  return nueva;
}

function listarReservas() {
  return reservasRepo.read();
}

function cancelarReserva(id) {
  let reservas = reservasRepo.read();
  const existe = reservas.find(r => r.id === Number(id));
  if (!existe) return { error: "No existe la reserva" };

  reservas = reservas.filter(r => r.id !== Number(id));
  reservasRepo.write(reservas);

  return { ok: true };
}

module.exports = { crearReserva, listarReservas, cancelarReserva };

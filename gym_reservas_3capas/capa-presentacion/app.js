const readline = require("readline");

const userService = require("../capa-logica/services/userService");
const reservationService = require("../capa-logica/services/reservationService");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("=== Sistema de Reservas - 3 Capas Distribuidas ===");

function pregunta(q) {
  return new Promise(resolve => rl.question(q, ans => resolve(ans)));
}

(async () => {
  try {
    const nombreRaw = await pregunta("\nIngrese su nombre: ");
    const nombre = String(nombreRaw || "").trim();
    if (!nombre) {
      console.log("Nombre inválido.");
      rl.close();
      return;
    }

    const user = userService.getOrCreateUser(nombre);
    if (!user) {
      console.log("Error creando/obteniendo usuario.");
      rl.close();
      return;
    }

    console.log("\nClases disponibles:");
    console.log("1) Yoga");
    console.log("2) Profesor de Gym");
    console.log("3) Pilates");

    const claseRaw = await pregunta("\nElija clase (1-3): ");
    const claseId = Number(String(claseRaw || "").trim());
    if (!claseId) {
      console.log("Clase inválida.");
      rl.close();
      return;
    }

    const dateRaw = await pregunta("Fecha (AAAA-MM-DD): ");
    const date = String(dateRaw || "").trim();

    const timeRaw = await pregunta("Hora (HH:MM, 24h): ");
    const time = String(timeRaw || "").trim();

    const res = reservationService.crearReserva(user.id, claseId, date, time);

    if (res && res.error) console.log("\n❌ ERROR:", res.error);
    else console.log("\n✔ Reserva creada:", res);

    console.log("\nReservas actuales:");
    console.table(reservationService.listarReservas());
  } catch (err) {
    console.error("Error inesperado:", err);
  } finally {
    rl.close();
  }
})();

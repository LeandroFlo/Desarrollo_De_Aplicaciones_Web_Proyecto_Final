const fs = require("fs");
const readline = require("readline");

const RESERVAS_FILE = "reservas.json";

function cargarReservas() {
  if (!fs.existsSync(RESERVAS_FILE)) {
    fs.writeFileSync(RESERVAS_FILE, "[]");
  }
  return JSON.parse(fs.readFileSync(RESERVAS_FILE, "utf8"));
}

function guardarReservas(reservas) {
  fs.writeFileSync(RESERVAS_FILE, JSON.stringify(reservas, null, 2));
}

let reservas = cargarReservas();

const clases = [
  { id: 1, nombre: "Yoga" },
  { id: 2, nombre: "Profesor de Gym" },
  { id: 3, nombre: "Pilates" }
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("=== Sistema de Reservas (Monolito simple) ===\n");

clases.forEach(c => console.log(`${c.id}) ${c.nombre}`));

rl.question("\nElegí la clase (1-3): ", claseId => {
  const clase = clases.find(c => c.id == claseId);

  if (!clase) {
    console.log("Clase inválida.");
    rl.close();
    return;
  }

  rl.question("Fecha (AAAA-MM-DD): ", date => {
    date = date.trim();

    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(date)) {
      console.log("Formato inválido. Usa AAAA-MM-DD.");
      rl.close();
      return;
    }

    const [anio, mes, dia] = date.split("-").map(Number);
    const fechaObj = new Date(anio, mes - 1, dia);

    if (
      fechaObj.getFullYear() !== anio ||
      fechaObj.getMonth() + 1 !== mes ||
      fechaObj.getDate() !== dia
    ) {
      console.log("Fecha inexistente.");
      rl.close();
      return;
    }

    rl.question("Hora (HH:MM, 24h): ", time => {
      time = time.trim();

      const regexHora = /^([01]\d|2[0-3]):[0-5]\d$/;
      if (!regexHora.test(time)) {
        console.log("Formato de hora inválido.");
        rl.close();
        return;
      }

      rl.question("Nombre de la persona: ", nombre => {
        nombre = nombre.trim();

        const existe = reservas.find(r =>
          r.claseId == clase.id &&
          r.date === date &&
          r.time === time
        );

        if (existe) {
          console.log("\n❌ Esa reserva ya existe (misma clase, fecha y hora).");
          rl.close();
          return;
        }

        const nuevaReserva = {
          id: reservas.length + 1,
          claseId: clase.id,
          claseNombre: clase.nombre,
          date,
          time,
          nombre
        };

        reservas.push(nuevaReserva);
        guardarReservas(reservas);

        console.log("\n✔ Reserva creada con éxito:");
        console.log(nuevaReserva);

        rl.close();
      });
    });
  });
});

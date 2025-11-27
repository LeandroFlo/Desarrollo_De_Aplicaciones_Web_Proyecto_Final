
const clases = [
  { id: 1, nombre: "Yoga" },
  { id: 2, nombre: "Profesor de Gym" },
  { id: 3, nombre: "Pilates" }
];

function listClases(req, res) {
  res.json(clases);
}

module.exports = { listClases };

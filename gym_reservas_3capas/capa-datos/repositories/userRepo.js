const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../data/usuarios.json");

function read() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]");
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function write(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

module.exports = { read, write };

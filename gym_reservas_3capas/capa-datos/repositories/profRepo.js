const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../data/profesores.json");

function read() {
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

module.exports = { read };

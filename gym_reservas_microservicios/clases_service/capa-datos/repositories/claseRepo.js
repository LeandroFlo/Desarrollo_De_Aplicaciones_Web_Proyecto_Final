const Clase = require("../models/clase");

async function findAll() {
  return Clase.find().exec();
}

async function findById(id) {
  return Clase.findById(id).exec();
}

async function create(data) {
  const c = new Clase(data);
  return c.save();
}

async function update(id, data) {
  return Clase.findByIdAndUpdate(id, data, { new: true }).exec();
}

async function removeById(id) {
  return Clase.findByIdAndDelete(id).exec();
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  removeById
};

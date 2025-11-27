const User = require("../models/user");

async function create(userData) {
  const user = new User(userData);
  return user.save();
}

async function findByName(nombre) {
  return User.findOne({ nombre: nombre.trim() }).exec();
}

async function findById(id) {
  return User.findById(id).exec();
}

async function findAll() {
  return User.find().exec();
}

module.exports = { create, findByName, findById, findAll };

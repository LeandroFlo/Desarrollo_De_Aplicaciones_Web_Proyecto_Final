const userRepo = require("../../capa-datos/repositories/userRepo");

function getOrCreateUser(nombre) {
  nombre = String(nombre || "").trim();
  if (!nombre) {
   
    return null;
  }

  const users = userRepo.read();
  let user = users.find(u => u.nombre === nombre);

  if (!user) {
    user = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      nombre
    };
    users.push(user);
    userRepo.write(users);
  }

  return user;
}

module.exports = { getOrCreateUser };

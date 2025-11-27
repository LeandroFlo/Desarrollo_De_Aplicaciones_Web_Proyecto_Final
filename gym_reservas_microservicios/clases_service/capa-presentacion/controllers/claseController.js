const claseService = require("../../capa-logica/services/claseService");

async function list(req, res, next) {
  try {
    const list = await claseService.listar();
    return res.json(list);
  } catch (err) { next(err); }
}

async function get(req, res, next) {
  try {
    const c = await claseService.obtener(req.params.id);
    return res.json(c);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error });
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const created = await claseService.crear(req.body);
    return res.status(201).json(created);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error });
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const c = await claseService.actualizar(req.params.id, req.body);
    return res.json(c);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error });
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const r = await claseService.eliminar(req.params.id);
    return res.json(r);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.error });
    next(err);
  }
}

module.exports = { list, get, create, update, remove };

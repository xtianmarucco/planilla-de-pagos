import * as SucursalService from '../services/sucursal.service.js';
import { success } from '../utils/response.js';

export const getByClient = async (req, res, next) => {
  try {
    success(res, await SucursalService.getSucursalesByClient(parseInt(req.query.client_id)));
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    success(res, await SucursalService.createSucursal(req.body), 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    success(res, await SucursalService.updateSucursal(parseInt(req.params.id), req.body));
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await SucursalService.deleteSucursal(parseInt(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

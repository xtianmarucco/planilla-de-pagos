import * as ClientService from "../services/client.service.js";
import { success } from "../utils/response.js";

export const getAll = async (req, res, next) => {
  try {
    const clients = await ClientService.getActiveClients();
    success(res, clients);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const client = await ClientService.createClient(req.body);
    success(res, client, 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const client = await ClientService.updateClient(
      parseInt(req.params.id),
      req.body,
    );
    success(res, client);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await ClientService.deleteClient(parseInt(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

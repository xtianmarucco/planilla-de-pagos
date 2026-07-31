import * as UserService from "../services/user.service.js";
import { success } from "../utils/response.js";

export const getAll = async (req, res, next) => {
  try {
    const users = await UserService.getUsers();
    success(res, users);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const user = await UserService.createUser(req.body);
    success(res, user, 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const user = await UserService.updateUser(parseInt(req.params.id), req.body);
    success(res, user);
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = await UserService.updateUserPassword(
      parseInt(req.params.id),
      req.body.password,
    );
    success(res, user);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await UserService.deleteUser(parseInt(req.params.id), req.session.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

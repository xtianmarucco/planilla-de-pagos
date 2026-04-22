import * as PaymentService from '../services/payment.service.js';
import { success } from '../utils/response.js';

export const getAll = async (req, res, next) => {
  try {
    const { client_id, from, to } = req.query;
    success(res, await PaymentService.getPayments({ client_id, from, to }));
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    success(res, await PaymentService.createPayment(req.body, req.session.userId), 201);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    success(res, await PaymentService.updatePayment(parseInt(req.params.id), req.body));
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await PaymentService.deletePayment(parseInt(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

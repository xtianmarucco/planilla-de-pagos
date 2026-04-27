import prisma from '../lib/prisma.js';
import { toPaymentDate } from '../utils/paymentDate.js';

const include = {
  client:   { select: { id: true, name: true, type: true } },
  sucursal: { select: { id: true, name: true } },
};

export const findAll = ({ client_id, sucursal_id, status, client_type, client_name, amount, from, to } = {}) => {
  const where = {};

  if (client_id)   where.client_id   = client_id;
  if (sucursal_id) where.sucursal_id = sucursal_id;
  if (status)      where.status      = status;
  if (amount)      where.amount      = amount;

  if (client_name || client_type) {
    where.client = {};
    if (client_name) where.client.name = { contains: client_name, mode: 'insensitive' };
    if (client_type) where.client.type = client_type;
  }

  if (from || to) {
    where.payment_date = {};
    if (from) where.payment_date.gte = toPaymentDate(from);
    if (to)   where.payment_date.lte = toPaymentDate(to);
  }

  return prisma.payments.findMany({ where, include, orderBy: { payment_date: 'desc' } });
};

export const findById = (id) =>
  prisma.payments.findUnique({ where: { id }, include });

export const create = (data) =>
  prisma.payments.create({ data, include });

export const update = (id, data) =>
  prisma.payments.update({ where: { id }, data, include });

export const updateStatus = (id, status) =>
  prisma.payments.update({ where: { id }, data: { status }, include });

export const remove = (id) =>
  prisma.payments.delete({ where: { id } });

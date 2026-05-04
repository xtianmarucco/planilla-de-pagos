import prisma from '../lib/prisma.js';
import { toPaymentDate } from '../utils/paymentDate.js';

const buildWhere = (from, to, { client_id, client_type } = {}) => {
  const where = {};

  const payment_date = {};
  if (from) payment_date.gte = toPaymentDate(from);
  if (to)   payment_date.lte = toPaymentDate(to);
  if (Object.keys(payment_date).length) where.payment_date = payment_date;

  if (client_id) {
    where.client_id = client_id;
  } else if (client_type) {
    where.client = { type: client_type };
  }

  return where;
};

export const getTotals = (from, to, filters) =>
  prisma.payments.aggregate({
    where: buildWhere(from, to, filters),
    _count: { id: true },
    _sum:   { amount: true },
  });

export const getByStatus = (from, to, filters) =>
  prisma.payments.groupBy({
    by:    ['status'],
    where: buildWhere(from, to, filters),
    _count: { id: true },
    _sum:   { amount: true },
  });

export const getByMethod = (from, to, filters) =>
  prisma.payments.groupBy({
    by:    ['payment_method'],
    where: buildWhere(from, to, filters),
    _count: { id: true },
    _sum:   { amount: true },
  });

export const getPayments = (from, to, filters) =>
  prisma.payments.findMany({
    where:   buildWhere(from, to, filters),
    include: {
      client:   { select: { id: true, name: true, type: true } },
      sucursal: { select: { id: true, name: true } },
    },
    orderBy: { payment_date: 'desc' },
  });

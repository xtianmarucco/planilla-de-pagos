import prisma from '../lib/prisma.js';
import { toPaymentDate } from '../utils/paymentDate.js';

const buildWhere = (from, to) => {
  const payment_date = {};
  if (from) payment_date.gte = toPaymentDate(from);
  if (to)   payment_date.lte = toPaymentDate(to);
  return Object.keys(payment_date).length ? { payment_date } : {};
};

export const getTotals = (from, to) =>
  prisma.payments.aggregate({
    where: buildWhere(from, to),
    _count: { id: true },
    _sum:   { amount: true },
  });

export const getByStatus = (from, to) =>
  prisma.payments.groupBy({
    by:    ['status'],
    where: buildWhere(from, to),
    _count: { id: true },
    _sum:   { amount: true },
  });

export const getByMethod = (from, to) =>
  prisma.payments.groupBy({
    by:    ['payment_method'],
    where: buildWhere(from, to),
    _count: { id: true },
    _sum:   { amount: true },
  });

export const getPayments = (from, to) =>
  prisma.payments.findMany({
    where:   buildWhere(from, to),
    include: {
      client:   { select: { id: true, name: true, type: true } },
      sucursal: { select: { id: true, name: true } },
    },
    orderBy: { payment_date: 'desc' },
  });

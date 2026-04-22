import prisma from "../lib/prisma.js";
import { toPaymentDate } from "../utils/paymentDate.js";

const clientSelect = { select: { id: true, name: true, type: true } };

export const findAll = ({ client_id, from, to } = {}) => {
  const where = {};

  if (client_id) where.client_id = client_id;

  if (from || to) {
    where.payment_date = {};
    if (from) where.payment_date.gte = toPaymentDate(from);
    if (to) where.payment_date.lte = toPaymentDate(to);
  }

  return prisma.payments.findMany({
    where,
    include: { client: clientSelect },
    orderBy: { payment_date: "desc" },
  });
};

export const findById = (id) =>
  prisma.payments.findUnique({
    where: { id },
    include: { client: clientSelect },
  });

export const create = (data) =>
  prisma.payments.create({
    data,
    include: { client: clientSelect },
  });

export const update = (id, data) =>
  prisma.payments.update({
    where: { id },
    data,
    include: { client: clientSelect },
  });

export const remove = (id) => prisma.payments.delete({ where: { id } });

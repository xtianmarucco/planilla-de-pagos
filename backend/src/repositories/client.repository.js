import prisma from "../lib/prisma.js";

export const findAllActive = () =>
  prisma.clients.findMany({
    where: { is_active: true },
    orderBy: { name: "asc" },
  });

export const findById = (id) => prisma.clients.findUnique({ where: { id } });

export const create = (data) => prisma.clients.create({ data });

export const update = (id, data) =>
  prisma.clients.update({ where: { id }, data });

export const softDelete = (id) =>
  prisma.clients.update({ where: { id }, data: { is_active: false } });

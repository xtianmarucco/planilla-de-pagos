import prisma from '../lib/prisma.js';

export const findByClient = (client_id) =>
  prisma.sucursales.findMany({
    where: { client_id, is_active: true },
    orderBy: { name: 'asc' },
  });

export const findById = (id) =>
  prisma.sucursales.findUnique({ where: { id } });

export const create = (data) => prisma.sucursales.create({ data });

export const update = (id, data) =>
  prisma.sucursales.update({ where: { id }, data });

export const softDelete = (id) =>
  prisma.sucursales.update({ where: { id }, data: { is_active: false } });

import prisma from "../lib/prisma.js";

const publicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  is_active: true,
  created_at: true,
};

export const findAllActive = () =>
  prisma.users.findMany({
    where: { is_active: true },
    select: publicSelect,
    orderBy: { name: "asc" },
  });

export const findById = (id) =>
  prisma.users.findUnique({ where: { id }, select: publicSelect });

export const findByEmail = (email) => prisma.users.findUnique({ where: { email } });

export const create = (data) =>
  prisma.users.create({ data, select: publicSelect });

export const update = (id, data) =>
  prisma.users.update({ where: { id }, data, select: publicSelect });

export const updatePassword = (id, password_hash) =>
  prisma.users.update({ where: { id }, data: { password_hash }, select: publicSelect });

export const softDelete = (id) =>
  prisma.users.update({
    where: { id },
    data: { is_active: false },
    select: publicSelect,
  });

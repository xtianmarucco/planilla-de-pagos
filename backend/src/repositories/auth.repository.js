import prisma from "../lib/prisma.js";

export const findByEmail = (email) =>
  prisma.users.findUnique({ where: { email } });

export const findById = (id) =>
  prisma.users.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, created_at: true },
  });

import bcrypt from "bcrypt";
import * as UserRepository from "../repositories/user.repository.js";
import { AppError } from "../utils/AppError.js";

const SALT_ROUNDS = 10;

export const getUsers = () => UserRepository.findAllActive();

export const getUserById = async (id) => {
  const user = await UserRepository.findById(id);
  if (!user || !user.is_active)
    throw new AppError("Usuario no encontrado", 404, "NOT_FOUND");
  return user;
};

const assertEmailAvailable = async (email, excludeId = null) => {
  const existing = await UserRepository.findByEmail(email);
  if (existing && existing.id !== excludeId)
    throw new AppError("Ya existe un usuario con ese email", 400, "VALIDATION_ERROR");
};

export const createUser = async (data) => {
  const email = data.email.trim().toLowerCase();
  await assertEmailAvailable(email);

  const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);
  return UserRepository.create({
    name: data.name.trim(),
    email,
    password_hash,
    role: data.role,
  });
};

export const updateUser = async (id, data) => {
  await getUserById(id);
  const email = data.email.trim().toLowerCase();
  await assertEmailAvailable(email, id);

  return UserRepository.update(id, {
    name: data.name.trim(),
    email,
    role: data.role,
  });
};

export const updateUserPassword = async (id, password) => {
  await getUserById(id);
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  return UserRepository.updatePassword(id, password_hash);
};

export const deleteUser = async (id, callerId) => {
  if (id === callerId)
    throw new AppError("No podés desactivar tu propia cuenta", 400, "VALIDATION_ERROR");
  await getUserById(id);
  return UserRepository.softDelete(id);
};

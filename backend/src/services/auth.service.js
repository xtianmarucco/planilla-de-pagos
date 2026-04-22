import bcrypt from 'bcrypt';
import * as AuthRepository from '../repositories/auth.repository.js';
import { AppError } from '../utils/AppError.js';

export const login = async (email, password) => {
  const user = await AuthRepository.findByEmail(email);
  if (!user) throw new AppError('Credenciales incorrectas', 401);

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new AppError('Credenciales incorrectas', 401);

  return { id: user.id, name: user.name, email: user.email };
};

export const getById = (id) => AuthRepository.findById(id);

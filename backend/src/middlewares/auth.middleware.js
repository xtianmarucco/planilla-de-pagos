import { AppError } from '../utils/AppError.js';

export const requireAuth = (req, res, next) => {
  if (!req.session?.userId) return next(new AppError('No autorizado', 401));
  next();
};

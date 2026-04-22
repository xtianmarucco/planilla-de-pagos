import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import * as AuthController from '../controllers/auth.controller.js';

const router = Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
  ],
  validate,
  AuthController.login,
);

router.post('/logout', requireAuth, AuthController.logout);

router.get('/me', requireAuth, AuthController.me);

export default router;

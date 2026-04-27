import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import * as SucursalController from '../controllers/sucursal.controller.js';

const router = Router();
router.use(requireAuth);

const bodyRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('address')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede superar los 200 caracteres'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 30 })
    .withMessage('El teléfono no puede superar los 30 caracteres'),
];

router.get(
  '/',
  [query('client_id').isInt({ min: 1 }).toInt().withMessage('client_id es requerido')],
  validate,
  SucursalController.getByClient,
);

router.post(
  '/',
  [body('client_id').isInt({ min: 1 }).toInt().withMessage('client_id es requerido'), ...bodyRules],
  validate,
  SucursalController.create,
);

router.patch(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt().withMessage('ID inválido'), ...bodyRules],
  validate,
  SucursalController.update,
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt().withMessage('ID inválido')],
  validate,
  SucursalController.remove,
);

export default router;

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import * as PaymentController from '../controllers/payment.controller.js';

const router = Router();

const updateBodyRules = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser mayor a 0'),
  body('payment_date')
    .isISO8601()
    .withMessage('La fecha es requerida y debe tener formato YYYY-MM-DD'),
  body('payment_method')
    .isIn(['EFECTIVO', 'TRANSFERENCIA', 'OTRO'])
    .withMessage('El método de pago debe ser EFECTIVO, TRANSFERENCIA u OTRO'),
  body('notes')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden superar 500 caracteres'),
];

const createBodyRules = [
  body('client_id')
    .isInt({ min: 1 })
    .withMessage('Seleccioná un cliente válido')
    .toInt(),
  ...updateBodyRules,
];

router.get(
  '/',
  [
    query('client_id').optional().isInt({ min: 1 }).toInt(),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
  ],
  validate,
  PaymentController.getAll,
);

router.post('/', createBodyRules, validate, PaymentController.create);

router.put(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt(), ...updateBodyRules],
  validate,
  PaymentController.update,
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  PaymentController.remove,
);

export default router;

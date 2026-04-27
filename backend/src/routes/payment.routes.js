import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import * as PaymentController from '../controllers/payment.controller.js';

const router = Router();
router.use(requireAuth);

const PAYMENT_METHODS = ['EFECTIVO', 'TRANSFERENCIA', 'CUENTA_CORRIENTE', 'OTRO'];
const PAYMENT_STATUSES = ['PAGADO', 'PENDIENTE'];
const CLIENT_TYPES    = ['MAYORISTA', 'VIABANA'];

const paymentBodyRules = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser mayor a 0'),
  body('payment_date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('La fecha es requerida y debe tener formato YYYY-MM-DD'),
  body('payment_method')
    .isIn(PAYMENT_METHODS)
    .withMessage(`El método de pago debe ser ${PAYMENT_METHODS.join(', ')}`),
  body('sucursal_id')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .toInt()
    .withMessage('sucursal_id debe ser un entero válido'),
  body('notes')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden superar 500 caracteres'),
];

const createBodyRules = [
  body('client_id').isInt({ min: 1 }).toInt().withMessage('Seleccioná un cliente válido'),
  ...paymentBodyRules,
];

router.get(
  '/',
  [
    query('client_id').optional().isInt({ min: 1 }).toInt(),
    query('sucursal_id').optional().isInt({ min: 1 }).toInt(),
    query('status').optional().isIn(PAYMENT_STATUSES).withMessage(`status debe ser ${PAYMENT_STATUSES.join(' o ')}`),
    query('client_type').optional().isIn(CLIENT_TYPES).withMessage(`client_type debe ser ${CLIENT_TYPES.join(' o ')}`),
    query('client_name').optional({ checkFalsy: true }).trim().isLength({ min: 2, max: 100 }),
    query('amount').optional({ checkFalsy: true }).isFloat({ min: 0.01 }),
    query('from').optional().matches(/^\d{4}-\d{2}-\d{2}$/),
    query('to').optional().matches(/^\d{4}-\d{2}-\d{2}$/),
  ],
  validate,
  PaymentController.getAll,
);

router.post('/', createBodyRules, validate, PaymentController.create);

router.put(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt(), ...paymentBodyRules],
  validate,
  PaymentController.update,
);

router.patch(
  '/:id/status',
  [
    param('id').isInt({ min: 1 }).toInt(),
    body('status').isIn(PAYMENT_STATUSES).withMessage(`status debe ser ${PAYMENT_STATUSES.join(' o ')}`),
  ],
  validate,
  PaymentController.updateStatus,
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).toInt()],
  validate,
  PaymentController.remove,
);

export default router;

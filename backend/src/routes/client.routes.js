import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import * as ClientController from '../controllers/client.controller.js';

const router = Router();

const bodyRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('type')
    .isIn(['MAYORISTA', 'VIABANA'])
    .withMessage('El tipo debe ser MAYORISTA o VIABANA'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 30 })
    .withMessage('El teléfono no puede superar los 30 caracteres'),
  body('address')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('La dirección no puede superar los 200 caracteres'),
];

router.use(requireAuth);

router.get('/', ClientController.getAll);

router.post('/', bodyRules, validate, ClientController.create);

router.put(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('ID inválido'), ...bodyRules],
  validate,
  ClientController.update
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('ID inválido')],
  validate,
  ClientController.remove
);

export default router;

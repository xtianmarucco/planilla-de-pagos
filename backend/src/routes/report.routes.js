import { Router } from 'express';
import { query } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import * as ReportController from '../controllers/report.controller.js';

const router = Router();
router.use(requireAuth);

router.get(
  '/summary',
  [
    query('from')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('from debe tener formato YYYY-MM-DD'),
    query('to')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('to debe tener formato YYYY-MM-DD'),
  ],
  validate,
  ReportController.getSummary,
);

export default router;

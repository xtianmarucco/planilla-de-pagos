import { Router } from "express";
import { body, param, query } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import * as PaymentController from "../controllers/payment.controller.js";

const router = Router();

router.use(requireAuth);

const updateBodyRules = [
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("El monto debe ser mayor a 0"),
  body("payment_date")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("La fecha es requerida y debe tener formato YYYY-MM-DD"),
  body("payment_method")
    .isIn(["EFECTIVO", "TRANSFERENCIA", "OTRO"])
    .withMessage("El método de pago debe ser EFECTIVO, TRANSFERENCIA u OTRO"),
  body("notes")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las observaciones no pueden superar 500 caracteres"),
];

const createBodyRules = [
  body("client_id")
    .isInt({ min: 1 })
    .withMessage("Seleccioná un cliente válido")
    .toInt(),
  ...updateBodyRules,
];

router.get(
  "/",
  [
    query("client_id").optional().isInt({ min: 1 }).toInt(),
    query("client_name")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("El nombre del cliente debe tener entre 2 y 100 caracteres"),
    query("amount")
      .optional({ checkFalsy: true })
      .isFloat({ min: 0.01 })
      .withMessage("El monto debe ser mayor a 0"),
    query("from")
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/),
    query("to")
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/),
  ],
  validate,
  PaymentController.getAll,
);

router.post("/", createBodyRules, validate, PaymentController.create);

router.put(
  "/:id",
  [param("id").isInt({ min: 1 }).toInt(), ...updateBodyRules],
  validate,
  PaymentController.update,
);

router.delete(
  "/:id",
  [param("id").isInt({ min: 1 }).toInt()],
  validate,
  PaymentController.remove,
);

export default router;

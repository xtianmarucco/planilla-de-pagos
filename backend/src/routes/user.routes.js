import { Router } from "express";
import { body, param } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import * as UserController from "../controllers/user.controller.js";

const router = Router();

const idRule = param("id").isInt({ min: 1 }).withMessage("ID inválido");

const dataRules = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("email").trim().isEmail().withMessage("Email inválido"),
  body("role")
    .isIn(["ADMIN", "USER"])
    .withMessage("El rol debe ser ADMIN o USER"),
];

const passwordRule = body("password")
  .isLength({ min: 8 })
  .withMessage("La contraseña debe tener al menos 8 caracteres");

router.use(requireAuth, requireAdmin);

router.get("/", UserController.getAll);

router.post(
  "/",
  [...dataRules, passwordRule],
  validate,
  UserController.create,
);

router.put("/:id", [idRule, ...dataRules], validate, UserController.update);

router.put(
  "/:id/password",
  [idRule, passwordRule],
  validate,
  UserController.updatePassword,
);

router.delete("/:id", [idRule], validate, UserController.remove);

export default router;

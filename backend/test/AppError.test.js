import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/utils/AppError.js";

test("assigns stable API error codes from HTTP status", () => {
  assert.equal(new AppError("No autorizado", 401).code, "UNAUTHORIZED");
  assert.equal(new AppError("No encontrado", 404).code, "NOT_FOUND");
  assert.equal(new AppError("No valido", 400).code, "VALIDATION_ERROR");
});

test("allows explicit API error codes", () => {
  const error = new AppError("Custom", 409, "CONFLICT");

  assert.equal(error.code, "CONFLICT");
  assert.equal(error.isOperational, true);
});

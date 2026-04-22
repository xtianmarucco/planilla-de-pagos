import test from "node:test";
import assert from "node:assert/strict";
import {
  formatPaymentDate,
  toDateInputValue,
} from "../src/utils/paymentDate.js";

test("formats backend payment dates without constructing local Date objects", () => {
  assert.equal(formatPaymentDate("2026-04-22T00:00:00.000Z"), "22/04/2026");
  assert.equal(formatPaymentDate("2026-04-22"), "22/04/2026");
});

test("normalizes backend payment dates for date inputs", () => {
  assert.equal(toDateInputValue("2026-04-22T00:00:00.000Z"), "2026-04-22");
  assert.equal(toDateInputValue(null), "");
});

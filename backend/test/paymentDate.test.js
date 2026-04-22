import test from "node:test";
import assert from "node:assert/strict";
import { isPaymentDate, toPaymentDate } from "../src/utils/paymentDate.js";

test("validates YYYY-MM-DD payment dates only", () => {
  assert.equal(isPaymentDate("2026-04-22"), true);
  assert.equal(isPaymentDate("2026-04-22T00:00:00.000Z"), false);
  assert.equal(isPaymentDate("22/04/2026"), false);
});

test("converts payment dates without local timezone drift", () => {
  const date = toPaymentDate("2026-04-22");

  assert.equal(date.toISOString(), "2026-04-22T12:00:00.000Z");
});

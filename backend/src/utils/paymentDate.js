const PAYMENT_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const isPaymentDate = (value) =>
  typeof value === "string" && PAYMENT_DATE_PATTERN.test(value);

export const toPaymentDate = (value) => {
  if (!isPaymentDate(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
};

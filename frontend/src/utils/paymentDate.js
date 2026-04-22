const PAYMENT_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;

const pad = (value) => String(value).padStart(2, "0");

export const todayInputValue = () => {
  const today = new Date();
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
};

export const toDateInputValue = (value) => {
  if (!value || typeof value !== "string") return "";
  const match = value.match(PAYMENT_DATE_PATTERN);
  return match ? match[0] : "";
};

export const formatPaymentDate = (value) => {
  const date = toDateInputValue(value);
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

import { get, post, put, patch, del } from "./api.js";

export const fetchPayments = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v != null),
  );
  return get("/payments", Object.keys(clean).length ? clean : undefined);
};

export const createPayment = (data) => post("/payments", data);
export const updatePayment = (id, data) => put(`/payments/${id}`, data);
export const updatePaymentStatus = (id, status) => patch(`/payments/${id}/status`, { status });
export const deletePayment = (id) => del(`/payments/${id}`);

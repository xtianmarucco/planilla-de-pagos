import { defineStore } from "pinia";
import { ref } from "vue";
import * as PaymentService from "@/services/payment.service.js";

export const usePaymentStore = defineStore("payment", () => {
  const payments = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);

  const fetchPayments = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await PaymentService.fetchPayments(filters);
      payments.value = res.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createPayment = async (data) => {
    saving.value = true;
    try {
      const res = await PaymentService.createPayment(data);
      payments.value.unshift(res.data);
      return res.data;
    } finally {
      saving.value = false;
    }
  };

  const updatePayment = async (id, data) => {
    saving.value = true;
    try {
      const res = await PaymentService.updatePayment(id, data);
      const idx = payments.value.findIndex((p) => p.id === id);
      if (idx !== -1) payments.value[idx] = res.data;
      return res.data;
    } finally {
      saving.value = false;
    }
  };

  const updatePaymentStatus = async (id, status) => {
    saving.value = true;
    try {
      const res = await PaymentService.updatePaymentStatus(id, status);
      const idx = payments.value.findIndex((p) => p.id === id);
      if (idx !== -1) payments.value[idx] = res.data;
      return res.data;
    } finally {
      saving.value = false;
    }
  };

  const deletePayment = async (id) => {
    saving.value = true;
    try {
      await PaymentService.deletePayment(id);
      payments.value = payments.value.filter((p) => p.id !== id);
    } finally {
      saving.value = false;
    }
  };

  return {
    payments,
    loading,
    saving,
    error,
    fetchPayments,
    createPayment,
    updatePayment,
    updatePaymentStatus,
    deletePayment,
  };
});

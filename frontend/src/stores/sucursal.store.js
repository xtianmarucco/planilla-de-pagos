import { defineStore } from "pinia";
import { ref } from "vue";
import * as SucursalService from "@/services/sucursal.service.js";

export const useSucursalStore = defineStore("sucursal", () => {
  const sucursales = ref([]);
  const loading = ref(false);
  const saving = ref(false);

  const fetchSucursales = async (client_id) => {
    loading.value = true;
    try {
      const res = await SucursalService.fetchSucursales(client_id);
      sucursales.value = res.data;
    } finally {
      loading.value = false;
    }
  };

  const createSucursal = async (data) => {
    saving.value = true;
    try {
      const res = await SucursalService.createSucursal(data);
      sucursales.value.push(res.data);
      return res.data;
    } finally {
      saving.value = false;
    }
  };

  const updateSucursal = async (id, data) => {
    saving.value = true;
    try {
      const res = await SucursalService.updateSucursal(id, data);
      const idx = sucursales.value.findIndex((s) => s.id === id);
      if (idx !== -1) sucursales.value[idx] = res.data;
      return res.data;
    } finally {
      saving.value = false;
    }
  };

  const deleteSucursal = async (id) => {
    saving.value = true;
    try {
      await SucursalService.deleteSucursal(id);
      sucursales.value = sucursales.value.filter((s) => s.id !== id);
    } finally {
      saving.value = false;
    }
  };

  const clear = () => {
    sucursales.value = [];
  };

  return { sucursales, loading, saving, fetchSucursales, createSucursal, updateSucursal, deleteSucursal, clear };
});

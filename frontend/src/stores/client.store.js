import { defineStore } from "pinia";
import { ref } from "vue";
import * as ClientService from "@/services/client.service.js";

export const useClientStore = defineStore("client", () => {
  const clients = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);

  const fetchClients = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await ClientService.fetchClients();
      clients.value = res.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createClient = async (data) => {
    saving.value = true;
    try {
      const res = await ClientService.createClient(data);
      clients.value.push(res.data);
      clients.value.sort((a, b) => a.name.localeCompare(b.name));
      return res.data;
    } finally {
      saving.value = false;
    }
  };

  const updateClient = async (id, data) => {
    saving.value = true;
    try {
      const res = await ClientService.updateClient(id, data);
      const idx = clients.value.findIndex((c) => c.id === id);
      if (idx !== -1) clients.value[idx] = res.data;
      clients.value.sort((a, b) => a.name.localeCompare(b.name));
      return res.data;
    } finally {
      saving.value = false;
    }
  };

  const deleteClient = async (id) => {
    saving.value = true;
    try {
      await ClientService.deleteClient(id);
      clients.value = clients.value.filter((c) => c.id !== id);
    } finally {
      saving.value = false;
    }
  };

  return {
    clients,
    loading,
    saving,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
});

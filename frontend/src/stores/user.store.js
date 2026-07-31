import { defineStore } from "pinia";
import { ref } from "vue";
import * as UserService from "@/services/user.service.js";

export const useUserStore = defineStore("user", () => {
  const users = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref(null);

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await UserService.fetchUsers();
      users.value = res.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (data) => {
    saving.value = true;
    try {
      const res = await UserService.createUser(data);
      users.value.push(res.data);
      users.value.sort((a, b) => a.name.localeCompare(b.name));
      return res.data;
    } finally {
      saving.value = false;
    }
  };

  const updateUser = async (id, data) => {
    saving.value = true;
    try {
      const res = await UserService.updateUser(id, data);
      const idx = users.value.findIndex((u) => u.id === id);
      if (idx !== -1) users.value[idx] = res.data;
      users.value.sort((a, b) => a.name.localeCompare(b.name));
      return res.data;
    } finally {
      saving.value = false;
    }
  };

  const updateUserPassword = async (id, password) => {
    saving.value = true;
    try {
      return await UserService.updateUserPassword(id, password);
    } finally {
      saving.value = false;
    }
  };

  const deleteUser = async (id) => {
    saving.value = true;
    try {
      await UserService.deleteUser(id);
      users.value = users.value.filter((u) => u.id !== id);
    } finally {
      saving.value = false;
    }
  };

  return {
    users,
    loading,
    saving,
    error,
    fetchUsers,
    createUser,
    updateUser,
    updateUserPassword,
    deleteUser,
  };
});

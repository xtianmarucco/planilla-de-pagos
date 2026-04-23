import { defineStore } from "pinia";
import { ref } from "vue";
import * as authService from "@/services/auth.service.js";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(false);
  const initialized = ref(false);

  const init = async () => {
    if (initialized.value) return;
    try {
      const res = await authService.fetchCurrentUser();
      user.value = res.data;
    } catch {
      user.value = null;
    } finally {
      initialized.value = true;
    }
  };

  const login = async (email, password) => {
    loading.value = true;
    try {
      const res = await authService.login(email, password);
      user.value = res.data;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    await authService.logout();
    user.value = null;
    initialized.value = false;
  };

  return { user, loading, initialized, init, login, logout };
});

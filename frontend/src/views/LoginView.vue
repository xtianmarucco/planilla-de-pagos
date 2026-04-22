<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <!-- Logo / brand -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4 shadow-btn"
        >
          <svg
            class="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
            />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-brand-text">Planilla de Pagos</h1>
        <p class="text-sm text-gray-400 mt-1">
          Ingresá tus credenciales para continuar
        </p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-3xl shadow-card p-8">
        <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
          <!-- Email -->
          <div>
            <label class="block text-xs font-semibold text-brand-text mb-1.5"
              >Email</label
            >
            <BaseInput
              v-model="form.email"
              type="email"
              placeholder="tu@email.com"
              :class="
                errors.email
                  ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
                  : ''
              "
              autocomplete="email"
            />
            <p v-if="errors.email" class="text-xs text-red-500 mt-1">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-semibold text-brand-text mb-1.5"
              >Contraseña</label
            >
            <BaseInput
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              :class="
                errors.password
                  ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
                  : ''
              "
              autocomplete="current-password"
            />
            <p v-if="errors.password" class="text-xs text-red-500 mt-1">
              {{ errors.password }}
            </p>
          </div>

          <!-- Server error -->
          <div
            v-if="serverError"
            class="bg-red-50 border border-red-200 rounded-xl px-4 py-3"
          >
            <p class="text-sm text-red-600">{{ serverError }}</p>
          </div>

          <!-- Submit -->
          <BaseButton
            type="submit"
            class="w-full justify-center"
            :disabled="authStore.loading"
          >
            {{ authStore.loading ? "Ingresando..." : "Ingresar" }}
          </BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";

const authStore = useAuthStore();
const router = useRouter();
const serverError = ref("");

const form = reactive({ email: "", password: "" });
const errors = reactive({ email: "", password: "" });

const validate = () => {
  errors.email = "";
  errors.password = "";

  if (!form.email) {
    errors.email = "El email es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Ingresá un email válido";
  }

  if (!form.password) {
    errors.password = "La contraseña es requerida";
  }

  return !errors.email && !errors.password;
};

const handleSubmit = async () => {
  serverError.value = "";
  if (!validate()) return;

  try {
    await authStore.login(form.email, form.password);
    router.push("/");
  } catch (err) {
    serverError.value =
      err.message || "Credenciales incorrectas. Intentá de nuevo.";
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-4">
    <!-- Nombre -->
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">
        Nombre <span class="text-red-500">*</span>
      </label>
      <BaseInput
        v-model="form.name"
        :error="!!errors.name"
        placeholder="Nombre del usuario"
        maxlength="100"
      />
      <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
    </div>

    <!-- Email -->
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">
        Email <span class="text-red-500">*</span>
      </label>
      <BaseInput
        v-model="form.email"
        type="email"
        :error="!!errors.email"
        placeholder="usuario@empresa.com"
      />
      <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
    </div>

    <!-- Rol -->
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">
        Rol <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.role"
        class="w-full rounded-xl border px-4 py-2.5 text-sm text-brand-text bg-white transition-all duration-200 focus:outline-none focus:ring-2"
        :class="
          errors.role
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-gray-200 focus:border-primary focus:ring-primary/10'
        "
      >
        <option value="">Seleccionar rol...</option>
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <p v-if="errors.role" class="mt-1 text-xs text-red-500">{{ errors.role }}</p>
    </div>

    <!-- Password (solo alta) -->
    <div v-if="!isEditing">
      <label class="block text-xs font-semibold text-brand-text mb-1.5">
        Contraseña <span class="text-red-500">*</span>
      </label>
      <BaseInput
        v-model="form.password"
        type="password"
        :error="!!errors.password"
        placeholder="Mínimo 8 caracteres"
      />
      <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-2">
      <BaseButton variant="ghost" type="button" @click="$emit('cancel')" :disabled="saving">
        Cancelar
      </BaseButton>
      <BaseButton variant="primary" type="submit" :disabled="saving">
        {{ saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear usuario" }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, computed } from "vue";
import BaseInput from "./BaseInput.vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps({
  initialData: { type: Object, default: null },
  saving: { type: Boolean, default: false },
});

const emit = defineEmits(["submit", "cancel"]);

const form = reactive({ name: "", email: "", role: "", password: "" });
const errors = reactive({ name: "", email: "", role: "", password: "" });

const isEditing = computed(() => !!props.initialData);

watch(
  () => props.initialData,
  (val) => {
    form.name = val?.name ?? "";
    form.email = val?.email ?? "";
    form.role = val?.role ?? "";
    form.password = "";
    errors.name = errors.email = errors.role = errors.password = "";
  },
  { immediate: true },
);

const validate = () => {
  errors.name = errors.email = errors.role = errors.password = "";
  let valid = true;

  if (!form.name.trim()) {
    errors.name = "El nombre es obligatorio.";
    valid = false;
  } else if (form.name.trim().length < 2) {
    errors.name = "Mínimo 2 caracteres.";
    valid = false;
  }

  if (!form.email.trim()) {
    errors.email = "El email es obligatorio.";
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Email inválido.";
    valid = false;
  }

  if (!form.role) {
    errors.role = "Seleccioná un rol.";
    valid = false;
  }

  if (!isEditing.value) {
    if (!form.password) {
      errors.password = "La contraseña es obligatoria.";
      valid = false;
    } else if (form.password.length < 8) {
      errors.password = "Mínimo 8 caracteres.";
      valid = false;
    }
  }

  return valid;
};

const handleSubmit = () => {
  if (!validate()) return;
  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    role: form.role,
  };
  if (!isEditing.value) payload.password = form.password;
  emit("submit", payload);
};
</script>

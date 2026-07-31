<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-4">
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">
        Nueva contraseña <span class="text-red-500">*</span>
      </label>
      <BaseInput
        v-model="form.password"
        type="password"
        :error="!!errors.password"
        placeholder="Mínimo 8 caracteres"
      />
      <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
    </div>

    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">
        Confirmar contraseña <span class="text-red-500">*</span>
      </label>
      <BaseInput
        v-model="form.confirm"
        type="password"
        :error="!!errors.confirm"
        placeholder="Repetí la contraseña"
      />
      <p v-if="errors.confirm" class="mt-1 text-xs text-red-500">{{ errors.confirm }}</p>
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <BaseButton variant="ghost" type="button" @click="$emit('cancel')" :disabled="saving">
        Cancelar
      </BaseButton>
      <BaseButton variant="primary" type="submit" :disabled="saving">
        {{ saving ? "Guardando..." : "Cambiar contraseña" }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { reactive } from "vue";
import BaseInput from "./BaseInput.vue";
import BaseButton from "./BaseButton.vue";

defineProps({
  saving: { type: Boolean, default: false },
});

const emit = defineEmits(["submit", "cancel"]);

const form = reactive({ password: "", confirm: "" });
const errors = reactive({ password: "", confirm: "" });

const validate = () => {
  errors.password = errors.confirm = "";
  let valid = true;

  if (!form.password) {
    errors.password = "La contraseña es obligatoria.";
    valid = false;
  } else if (form.password.length < 8) {
    errors.password = "Mínimo 8 caracteres.";
    valid = false;
  }

  if (form.confirm !== form.password) {
    errors.confirm = "Las contraseñas no coinciden.";
    valid = false;
  }

  return valid;
};

const handleSubmit = () => {
  if (!validate()) return;
  emit("submit", form.password);
};
</script>

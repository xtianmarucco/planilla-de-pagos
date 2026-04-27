<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-3">
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">
        Nombre <span class="text-red-500">*</span>
      </label>
      <BaseInput
        v-model="form.name"
        :error="!!errors.name"
        placeholder="Ej: Sucursal Centro"
      />
      <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
    </div>

    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">Dirección</label>
      <BaseInput v-model="form.address" placeholder="Opcional" />
    </div>

    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">Teléfono</label>
      <BaseInput v-model="form.phone" placeholder="Opcional" />
    </div>

    <div class="flex justify-end gap-2 pt-1">
      <BaseButton variant="ghost" type="button" @click="$emit('cancel')" :disabled="saving">
        Cancelar
      </BaseButton>
      <BaseButton variant="primary" type="submit" :disabled="saving">
        {{ saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Agregar sucursal" }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { reactive, computed, watch } from "vue";
import BaseInput from "./BaseInput.vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps({
  initialData: { type: Object, default: null },
  saving: { type: Boolean, default: false },
});

const emit = defineEmits(["submit", "cancel"]);

const isEditing = computed(() => !!props.initialData);

const form = reactive({ name: "", address: "", phone: "" });
const errors = reactive({ name: "" });

watch(
  () => props.initialData,
  (val) => {
    form.name    = val?.name    ?? "";
    form.address = val?.address ?? "";
    form.phone   = val?.phone   ?? "";
    errors.name  = "";
  },
  { immediate: true },
);

const handleSubmit = () => {
  errors.name = "";
  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres.";
    return;
  }
  emit("submit", {
    name:    form.name.trim(),
    address: form.address.trim() || null,
    phone:   form.phone.trim()   || null,
  });
};
</script>

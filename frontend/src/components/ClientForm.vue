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
        placeholder="Nombre del cliente"
        maxlength="100"
      />
      <p v-if="errors.name" class="mt-1 text-xs text-red-500">
        {{ errors.name }}
      </p>
    </div>

    <!-- Tipo -->
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">
        Tipo <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.type"
        class="w-full rounded-xl border px-4 py-2.5 text-sm text-brand-text bg-white transition-all duration-200 focus:outline-none focus:ring-2"
        :class="
          errors.type
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-gray-200 focus:border-primary focus:ring-primary/10'
        "
      >
        <option value="">Seleccionar tipo...</option>
        <option value="MAYORISTA">MAYORISTA</option>
        <option value="VIABANA">VIABANA</option>
      </select>
      <p v-if="errors.type" class="mt-1 text-xs text-red-500">
        {{ errors.type }}
      </p>
    </div>

    <!-- Teléfono -->
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5"
        >Teléfono</label
      >
      <BaseInput
        v-model="form.phone"
        :error="!!errors.phone"
        placeholder="Ej: 3624000001"
        maxlength="30"
      />
      <p v-if="errors.phone" class="mt-1 text-xs text-red-500">
        {{ errors.phone }}
      </p>
    </div>

    <!-- Dirección -->
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5"
        >Dirección</label
      >
      <BaseInput
        v-model="form.address"
        :error="!!errors.address"
        placeholder="Ej: Av. Colón 123"
        maxlength="200"
      />
      <p v-if="errors.address" class="mt-1 text-xs text-red-500">
        {{ errors.address }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-2">
      <BaseButton
        variant="ghost"
        type="button"
        @click="$emit('cancel')"
        :disabled="saving"
      >
        Cancelar
      </BaseButton>
      <BaseButton variant="primary" type="submit" :disabled="saving">
        {{
          saving
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear cliente"
        }}
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

const form = reactive({ name: "", type: "", phone: "", address: "" });
const errors = reactive({ name: "", type: "", phone: "", address: "" });

const isEditing = computed(() => !!props.initialData);

watch(
  () => props.initialData,
  (val) => {
    form.name = val?.name ?? "";
    form.type = val?.type ?? "";
    form.phone = val?.phone ?? "";
    form.address = val?.address ?? "";
    errors.name = errors.type = errors.phone = errors.address = "";
  },
  { immediate: true },
);

const validate = () => {
  errors.name = errors.type = errors.phone = errors.address = "";
  let valid = true;

  if (!form.name.trim()) {
    errors.name = "El nombre es obligatorio.";
    valid = false;
  } else if (form.name.trim().length < 2) {
    errors.name = "Mínimo 2 caracteres.";
    valid = false;
  }

  if (!form.type) {
    errors.type = "Seleccioná un tipo.";
    valid = false;
  }

  if (form.phone && form.phone.trim().length > 30) {
    errors.phone = "Máximo 30 caracteres.";
    valid = false;
  }

  if (form.address && form.address.trim().length > 200) {
    errors.address = "Máximo 200 caracteres.";
    valid = false;
  }

  return valid;
};

const handleSubmit = () => {
  if (!validate()) return;
  emit("submit", {
    name: form.name.trim(),
    type: form.type,
    phone: form.phone.trim() || null,
    address: form.address.trim() || null,
  });
};
</script>

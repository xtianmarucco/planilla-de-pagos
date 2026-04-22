<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-4">
    <!-- Cliente -->
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">
        Cliente <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.client_id"
        :disabled="isEditing"
        class="w-full rounded-xl border px-4 py-2.5 text-sm text-brand-text bg-white transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
        :class="
          errors.client_id
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-gray-200 focus:border-primary focus:ring-primary/10'
        "
      >
        <option value="">Seleccionar cliente...</option>
        <option v-for="c in clients" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
      <p v-if="errors.client_id" class="mt-1 text-xs text-red-500">
        {{ errors.client_id }}
      </p>
    </div>

    <!-- Fecha -->
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">
        Fecha <span class="text-red-500">*</span>
      </label>
      <BaseInput
        v-model="form.payment_date"
        :error="!!errors.payment_date"
        type="date"
      />
      <p v-if="errors.payment_date" class="mt-1 text-xs text-red-500">
        {{ errors.payment_date }}
      </p>
    </div>

    <!-- Monto -->
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">
        Monto <span class="text-red-500">*</span>
      </label>
      <BaseInput
        v-model="form.amount"
        :error="!!errors.amount"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
      />
      <p v-if="errors.amount" class="mt-1 text-xs text-red-500">
        {{ errors.amount }}
      </p>
    </div>

    <!-- Método de pago -->
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5">
        Método de pago <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.payment_method"
        class="w-full rounded-xl border px-4 py-2.5 text-sm text-brand-text bg-white transition-all duration-200 focus:outline-none focus:ring-2"
        :class="
          errors.payment_method
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-gray-200 focus:border-primary focus:ring-primary/10'
        "
      >
        <option value="">Seleccionar método...</option>
        <option value="EFECTIVO">EFECTIVO</option>
        <option value="TRANSFERENCIA">TRANSFERENCIA</option>
        <option value="OTRO">OTRO</option>
      </select>
      <p v-if="errors.payment_method" class="mt-1 text-xs text-red-500">
        {{ errors.payment_method }}
      </p>
    </div>

    <!-- Observaciones -->
    <div>
      <label class="block text-xs font-semibold text-brand-text mb-1.5"
        >Observaciones</label
      >
      <textarea
        v-model="form.notes"
        rows="3"
        maxlength="500"
        placeholder="Opcional..."
        class="w-full rounded-xl border px-4 py-2.5 text-sm text-brand-text bg-white transition-all duration-200 focus:outline-none focus:ring-2 resize-none placeholder-gray-400"
        :class="
          errors.notes
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-gray-200 focus:border-primary focus:ring-primary/10'
        "
      ></textarea>
      <p v-if="errors.notes" class="mt-1 text-xs text-red-500">
        {{ errors.notes }}
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
              : "Registrar pago"
        }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, computed } from "vue";
import BaseInput from "./BaseInput.vue";
import BaseButton from "./BaseButton.vue";
import { todayInputValue, toDateInputValue } from "@/utils/paymentDate.js";

const props = defineProps({
  initialData: { type: Object, default: null },
  clients: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false },
});

const emit = defineEmits(["submit", "cancel"]);

const today = todayInputValue();

const form = reactive({
  client_id: "",
  payment_date: today,
  amount: "",
  payment_method: "",
  notes: "",
});

const errors = reactive({
  client_id: "",
  payment_date: "",
  amount: "",
  payment_method: "",
  notes: "",
});

const isEditing = computed(() => !!props.initialData);

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      form.client_id = val.client_id;
      form.payment_date = toDateInputValue(val.payment_date) || today;
      form.amount = val.amount ?? "";
      form.payment_method = val.payment_method ?? "";
      form.notes = val.notes ?? "";
    } else {
      form.client_id = "";
      form.payment_date = today;
      form.amount = "";
      form.payment_method = "";
      form.notes = "";
    }
    Object.keys(errors).forEach((k) => (errors[k] = ""));
  },
  { immediate: true },
);

const validate = () => {
  Object.keys(errors).forEach((k) => (errors[k] = ""));
  let valid = true;

  if (!form.client_id) {
    errors.client_id = "Seleccioná un cliente.";
    valid = false;
  }

  if (!form.payment_date) {
    errors.payment_date = "La fecha es obligatoria.";
    valid = false;
  }

  const amount = parseFloat(form.amount);
  if (!form.amount || isNaN(amount) || amount <= 0) {
    errors.amount = "El monto debe ser mayor a 0.";
    valid = false;
  }

  if (!form.payment_method) {
    errors.payment_method = "Seleccioná un método de pago.";
    valid = false;
  }

  if (form.notes && form.notes.trim().length > 500) {
    errors.notes = "Máximo 500 caracteres.";
    valid = false;
  }

  return valid;
};

const handleSubmit = () => {
  if (!validate()) return;
  emit("submit", {
    client_id: parseInt(form.client_id),
    payment_date: form.payment_date,
    amount: parseFloat(form.amount),
    payment_method: form.payment_method,
    notes: form.notes.trim() || null,
  });
};
</script>

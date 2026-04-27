<template>
  <BaseTable
    :headers="['Cliente', 'Sucursal', 'Monto', 'Método', 'Estado', 'Fecha', 'Obs.', '']"
    :is-empty="!payments.length"
    empty-text="No hay pagos registrados."
  >
    <tr
      v-for="payment in paged"
      :key="payment.id"
      class="border-b border-gray-50 hover:bg-brand-bg transition-colors duration-150"
    >
      <!-- Cliente -->
      <td class="px-6 py-4 font-semibold text-brand-text text-sm whitespace-nowrap">
        {{ payment.client.name }}
      </td>

      <!-- Sucursal -->
      <td class="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
        {{ payment.sucursal?.name || "—" }}
      </td>

      <!-- Monto -->
      <td class="px-6 py-4 text-sm font-bold text-brand-text tabular-nums whitespace-nowrap">
        {{ formatCurrency(payment.amount) }}
      </td>

      <!-- Método -->
      <td class="px-6 py-4 whitespace-nowrap">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
          :class="methodClass(payment.payment_method)"
        >
          {{ methodLabel(payment.payment_method) }}
        </span>
      </td>

      <!-- Estado -->
      <td class="px-6 py-4 whitespace-nowrap">
        <button
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:opacity-80"
          :class="
            payment.status === 'PAGADO'
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          "
          :disabled="toggling === payment.id"
          @click="$emit('toggle-status', payment)"
        >
          {{ payment.status === "PAGADO" ? "Pagado" : "Pendiente" }}
        </button>
      </td>

      <!-- Fecha -->
      <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {{ formatPaymentDate(payment.payment_date) }}
      </td>

      <!-- Observaciones -->
      <td class="px-6 py-4 text-sm text-gray-400 max-w-[140px] truncate">
        {{ payment.notes || "—" }}
      </td>

      <!-- Acciones -->
      <td class="px-6 py-4 text-right whitespace-nowrap">
        <button
          class="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-xl hover:bg-primary hover:text-white transition-all duration-200 mr-2"
          @click="$emit('edit', payment)"
        >
          Editar
        </button>
        <button
          class="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
          @click="$emit('delete', payment)"
        >
          Eliminar
        </button>
      </td>
    </tr>

    <template #footer>
      <BasePagination
        v-if="payments.length > pageSize"
        v-model="page"
        :total="payments.length"
        :page-size="pageSize"
      />
    </template>
  </BaseTable>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import BaseTable from "./BaseTable.vue";
import BasePagination from "./BasePagination.vue";
import { formatPaymentDate } from "@/utils/paymentDate.js";

const props = defineProps({
  payments: { type: Array,  default: () => [] },
  toggling: { type: Number, default: null },
});

defineEmits(["edit", "delete", "toggle-status"]);

const PAGE_SIZE = 15;
const pageSize  = PAGE_SIZE;
const page      = ref(1);

watch(() => props.payments, () => { page.value = 1; });

const paged = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE;
  return props.payments.slice(start, start + PAGE_SIZE);
});

const formatCurrency = (val) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(val);

const methodLabel = (m) =>
  ({ EFECTIVO: "Efectivo", TRANSFERENCIA: "Transferencia", CUENTA_CORRIENTE: "Cta. Corriente", OTRO: "Otro" }[m] ?? m);

const methodClass = (m) => ({
  EFECTIVO:         "bg-green-100 text-green-700",
  TRANSFERENCIA:    "bg-primary/10 text-primary",
  CUENTA_CORRIENTE: "bg-amber-100 text-amber-700",
  OTRO:             "bg-purple-100 text-purple-700",
}[m] ?? "bg-gray-100 text-gray-600");
</script>

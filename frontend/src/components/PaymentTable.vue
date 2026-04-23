<template>
  <BaseTable
    :headers="['Cliente', 'Monto', 'Método', 'Fecha', 'Observaciones', '']"
    :is-empty="!payments.length"
    empty-text="No hay pagos registrados."
  >
    <tr
      v-for="payment in payments"
      :key="payment.id"
      class="border-b border-gray-50 hover:bg-brand-bg transition-colors duration-150"
    >
      <td class="px-6 py-4 font-semibold text-brand-text text-sm">
        {{ payment.client.name }}
      </td>
      <td class="px-6 py-4 text-sm font-bold text-brand-text tabular-nums">
        {{ formatCurrency(payment.amount) }}
      </td>
      <td class="px-6 py-4">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
          :class="{
            'bg-green-100 text-green-700':
              payment.payment_method === 'EFECTIVO',
            'bg-primary/10 text-primary':
              payment.payment_method === 'TRANSFERENCIA',
            'bg-purple-100 text-purple-700': payment.payment_method === 'OTRO',
          }"
        >
          {{ payment.payment_method }}
        </span>
      </td>
      <td class="px-6 py-4 text-sm text-gray-500">
        {{ formatPaymentDate(payment.payment_date) }}
      </td>
      <td class="px-6 py-4 text-sm text-gray-400 max-w-[180px] truncate">
        {{ payment.notes || "—" }}
      </td>
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
  </BaseTable>
</template>

<script setup>
import BaseTable from "./BaseTable.vue";
import { formatPaymentDate } from "@/utils/paymentDate.js";

defineProps({ payments: { type: Array, default: () => [] } });
defineEmits(["edit", "delete"]);

const formatCurrency = (val) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    val,
  );
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold text-brand-text">Dashboard</h1>
      <p class="text-sm text-gray-400 mt-1">Resumen general del negocio</p>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <BaseCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-start justify-between">
          <div class="space-y-3">
            <p
              class="text-xs font-semibold text-gray-400 uppercase tracking-wider m-0"
            >
              {{ stat.label }}
            </p>
            <p class="text-3xl font-bold text-brand-text m-0">
              {{ stat.value }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            :class="stat.iconBg"
          >
            <svg
              class="w-6 h-6"
              :class="stat.iconColor"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="stat.icon"
              />
            </svg>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { usePaymentStore } from "@/stores/payment.store.js";
import { useClientStore } from "@/stores/client.store.js";
import BaseCard from "@/components/BaseCard.vue";

const paymentStore = usePaymentStore();
const clientStore = useClientStore();

const totalCobrado = computed(() =>
  paymentStore.payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
);

const totalCobradoFmt = computed(() =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    totalCobrado.value,
  ),
);

const stats = computed(() => [
  {
    label: "Clientes activos",
    value: clientStore.clients.length,
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Pagos registrados",
    value: paymentStore.payments.length,
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Total cobrado",
    value: totalCobradoFmt.value,
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
]);

onMounted(() => {
  clientStore.fetchClients();
  paymentStore.fetchPayments();
});
</script>

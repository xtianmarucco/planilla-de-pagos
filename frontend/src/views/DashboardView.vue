<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-2xl font-bold text-brand-text">Dashboard</h1>
      <p class="text-sm text-gray-400 mt-1">Resumen general del negocio</p>
    </div>

    <DashboardStatsSection
      title="Mayoristas"
      subtitle="Resumen de pagos y clientes mayoristas"
      :stats="mayoristaStats"
    />

    <DashboardStatsSection
      title="Viabana"
      subtitle="Resumen de pagos y clientes Viabana"
      :stats="viabanaStats"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { usePaymentStore } from "@/stores/payment.store.js";
import { useClientStore } from "@/stores/client.store.js";
import DashboardStatsSection from "@/components/DashboardStatsSection.vue";

const paymentStore = usePaymentStore();
const clientStore = useClientStore();

const CLIENT_TYPES = {
  mayorista: "MAYORISTA",
  viabana: "VIABANA",
};

const statIcons = {
  clients:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  payments:
    "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  total:
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(
    value,
  );

const clientsByType = (type) =>
  clientStore.clients.filter((client) => client.type === type);

const paymentsByType = (type) =>
  paymentStore.payments.filter((payment) => payment.client?.type === type);

const totalPayments = (payments) =>
  payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);

const buildStats = (type) => {
  const clients = clientsByType(type);
  const payments = paymentsByType(type);

  return [
    {
      label: "Clientes activos",
      value: clients.length,
      icon: statIcons.clients,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Pagos registrados",
      value: payments.length,
      icon: statIcons.payments,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "Total cobrado",
      value: formatCurrency(totalPayments(payments)),
      icon: statIcons.total,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];
};

const mayoristaStats = computed(() => buildStats(CLIENT_TYPES.mayorista));
const viabanaStats = computed(() => buildStats(CLIENT_TYPES.viabana));

onMounted(() => {
  clientStore.fetchClients();
  paymentStore.fetchPayments();
});
</script>

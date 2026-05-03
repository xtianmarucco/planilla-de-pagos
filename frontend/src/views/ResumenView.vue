<template>
  <div class="space-y-6">
    <AppToast :show="toast.show" :message="toast.message" :type="toast.type" />

    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-brand-text">Resumen</h1>
      <p class="text-sm text-gray-400 mt-1">Totales y detalle de pagos por período</p>
    </div>

    <!-- Date range -->
    <BaseCard>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1.5">Desde</label>
          <BaseInput v-model="from" type="date" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1.5">Hasta</label>
          <BaseInput v-model="to" type="date" />
        </div>
        <BaseButton :disabled="!from || !to || loading" @click="fetchData">
          {{ loading ? "Cargando..." : "Consultar" }}
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16 text-sm text-gray-400">
      Cargando...
    </div>

    <!-- Empty state -->
    <div v-else-if="!summary" class="flex items-center justify-center py-16 text-sm text-gray-400">
      Seleccioná un rango de fechas y hacé clic en Consultar.
    </div>

    <template v-else>
      <!-- Stat cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <BaseCard>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total pagos</p>
          <p class="text-3xl font-bold text-brand-text">{{ summary.totals.count }}</p>
        </BaseCard>
        <BaseCard>
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total recibido</p>
          <p class="text-2xl font-bold text-brand-text leading-tight">{{ formatCurrency(summary.totals.amount) }}</p>
        </BaseCard>
        <BaseCard>
          <p class="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Pagado</p>
          <p class="text-2xl font-bold text-brand-text leading-tight">{{ formatCurrency(byStatusMap.PAGADO?.amount ?? 0) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ byStatusMap.PAGADO?.count ?? 0 }} pagos</p>
        </BaseCard>
        <BaseCard>
          <p class="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Pendiente</p>
          <p class="text-2xl font-bold text-brand-text leading-tight">{{ formatCurrency(byStatusMap.PENDIENTE?.amount ?? 0) }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ byStatusMap.PENDIENTE?.count ?? 0 }} pagos</p>
        </BaseCard>
      </div>

      <!-- By method + by client type -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Por método -->
        <BaseCard>
          <h3 class="text-sm font-bold text-brand-text mb-4">Por método de pago</h3>
          <div class="space-y-3">
            <div
              v-for="row in summary.by_method"
              :key="row.method"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="methodClass(row.method)"
                >
                  {{ methodLabel(row.method) }}
                </span>
                <span class="text-xs text-gray-400">{{ row.count }} pagos</span>
              </div>
              <span class="text-sm font-bold text-brand-text tabular-nums">
                {{ formatCurrency(row.amount) }}
              </span>
            </div>
            <p v-if="!summary.by_method.length" class="text-sm text-gray-400">Sin datos.</p>
          </div>
        </BaseCard>

        <!-- Por tipo de cliente -->
        <BaseCard>
          <h3 class="text-sm font-bold text-brand-text mb-4">Por tipo de cliente</h3>
          <div class="space-y-3">
            <div
              v-for="row in summary.by_client_type"
              :key="row.type"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="row.type === 'MAYORISTA' ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-700'"
                >
                  {{ row.type }}
                </span>
                <span class="text-xs text-gray-400">{{ row.count }} pagos</span>
              </div>
              <span class="text-sm font-bold text-brand-text tabular-nums">
                {{ formatCurrency(row.amount) }}
              </span>
            </div>
            <p v-if="!summary.by_client_type.length" class="text-sm text-gray-400">Sin datos.</p>
          </div>
        </BaseCard>
      </div>

      <!-- Payment table -->
      <PaymentTable
        :payments="summary.payments"
        :toggling="null"
        @edit="() => {}"
        @delete="() => {}"
        @toggle-status="() => {}"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import * as ReportService from "@/services/report.service.js";
import PaymentTable from "@/components/PaymentTable.vue";
import AppToast from "@/components/AppToast.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseCard from "@/components/BaseCard.vue";
import BaseInput from "@/components/BaseInput.vue";

// ── Defaults: primer día del mes actual → hoy ───────────
const today = new Date();
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const fmt = (d) => d.toISOString().slice(0, 10);

const from    = ref(fmt(firstOfMonth));
const to      = ref(fmt(today));
const loading = ref(false);
const summary = ref(null);

// ── Toast ────────────────────────────────────────────────
const toast = reactive({ show: false, message: "", type: "success" });
let toastTimer = null;
const showToast = (message, type = "error") => {
  clearTimeout(toastTimer);
  Object.assign(toast, { message, type, show: true });
  toastTimer = setTimeout(() => { toast.show = false; }, 3500);
};

// ── Fetch ────────────────────────────────────────────────
const fetchData = async () => {
  if (!from.value || !to.value) return;
  loading.value = true;
  try {
    const res = await ReportService.fetchSummary(from.value, to.value);
    summary.value = res.data;
  } catch (err) {
    showToast(err.message || "No se pudo cargar el resumen.");
  } finally {
    loading.value = false;
  }
};

// Pre-carga al entrar a la vista
fetchData();

// ── Helpers ──────────────────────────────────────────────
const byStatusMap = computed(() =>
  Object.fromEntries((summary.value?.by_status ?? []).map((r) => [r.status, r])),
);

const formatCurrency = (val) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(val ?? 0);

const methodLabel = (m) =>
  ({ EFECTIVO: "Efectivo", TRANSFERENCIA: "Transferencia", CUENTA_CORRIENTE: "Cta. Corriente", OTRO: "Otro" }[m] ?? m);

const methodClass = (m) => ({
  EFECTIVO:         "bg-green-100 text-green-700",
  TRANSFERENCIA:    "bg-primary/10 text-primary",
  CUENTA_CORRIENTE: "bg-amber-100 text-amber-700",
  OTRO:             "bg-purple-100 text-purple-700",
}[m] ?? "bg-gray-100 text-gray-600");
</script>

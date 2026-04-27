<template>
  <div class="space-y-6">
    <AppToast :show="toast.show" :message="toast.message" :type="toast.type" />

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-brand-text">Pagos</h1>
        <p class="text-sm text-gray-400 mt-1">Registros y filtros de pagos</p>
      </div>
      <BaseButton @click="openCreate">+ Nuevo pago</BaseButton>
    </div>

    <!-- Filters -->
    <BaseCard>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 items-end">
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1.5">Buscar cliente</label>
          <BaseInput v-model="filters.client_name" placeholder="Nombre del cliente" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1.5">Cliente</label>
          <select
            v-model="filters.client_id"
            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-brand-text bg-white focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/10 transition-all"
          >
            <option value="">Todos los clientes</option>
            <option v-for="c in clientStore.clients" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1.5">Tipo de cliente</label>
          <select
            v-model="filters.client_type"
            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-brand-text bg-white focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/10 transition-all"
          >
            <option value="">Todos los tipos</option>
            <option value="MAYORISTA">Mayorista</option>
            <option value="VIABANA">Viabana</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1.5">Estado</label>
          <select
            v-model="filters.status"
            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-brand-text bg-white focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/10 transition-all"
          >
            <option value="">Todos los estados</option>
            <option value="PAGADO">Pagado</option>
            <option value="PENDIENTE">Pendiente</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1.5">Monto</label>
          <BaseInput v-model="filters.amount" type="number" step="0.01" min="0.01" placeholder="0.00" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1.5">Desde</label>
          <BaseInput v-model="filters.from" type="date" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1.5">Hasta</label>
          <BaseInput v-model="filters.to" type="date" />
        </div>
        <div class="flex gap-2 items-end">
          <BaseButton @click="applyFilters">Filtrar</BaseButton>
          <BaseButton variant="ghost" @click="clearFilters">Limpiar</BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Content -->
    <div v-if="paymentStore.loading" class="flex items-center justify-center py-16 text-sm text-gray-400">
      Cargando...
    </div>
    <div v-else-if="paymentStore.error" class="bg-red-50 text-red-600 rounded-2xl p-4 text-sm">
      {{ paymentStore.error }}
    </div>
    <PaymentTable
      v-else
      :payments="paymentStore.payments"
      :toggling="toggling"
      @edit="openEdit"
      @delete="openConfirmDelete"
      @toggle-status="handleToggleStatus"
    />

    <!-- Modal pago -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="modal.open" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="closeModal">
          <div class="bg-white rounded-3xl shadow-card w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-6 pb-0">
              <h2 class="text-lg font-bold text-brand-text">
                {{ modal.editing ? "Editar pago" : "Nuevo pago" }}
              </h2>
              <button class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" @click="closeModal">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-6">
              <PaymentForm
                :initial-data="modal.data"
                :clients="clientStore.clients"
                :sucursales="sucursales"
                :saving="paymentStore.saving"
                @submit="handleFormSubmit"
                @cancel="closeModal"
                @client-change="handleClientChange"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Confirmación de eliminación -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="confirmDelete.open" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="closeConfirmDelete">
          <div class="bg-white rounded-3xl shadow-card w-full max-w-sm p-6 space-y-5">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-brand-text">Eliminar pago</h2>
              <button class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" @click="closeConfirmDelete">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-500 leading-relaxed">
              ¿Estás seguro que querés eliminar el pago de
              <strong class="text-brand-text">{{ confirmDelete.payment?.client?.name }}</strong>
              por <strong class="text-brand-text">{{ formatCurrency(confirmDelete.payment?.amount) }}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" @click="closeConfirmDelete" :disabled="paymentStore.saving">Cancelar</BaseButton>
              <BaseButton variant="danger" @click="handleDelete" :disabled="paymentStore.saving">
                {{ paymentStore.saving ? "Eliminando..." : "Sí, eliminar" }}
              </BaseButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { usePaymentStore } from "@/stores/payment.store.js";
import { useClientStore } from "@/stores/client.store.js";
import * as SucursalService from "@/services/sucursal.service.js";
import PaymentTable from "@/components/PaymentTable.vue";
import PaymentForm from "@/components/PaymentForm.vue";
import AppToast from "@/components/AppToast.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseCard from "@/components/BaseCard.vue";
import BaseInput from "@/components/BaseInput.vue";

const paymentStore = usePaymentStore();
const clientStore  = useClientStore();

// ── Toast ───────────────────────────────────────────────
const toast = reactive({ show: false, message: "", type: "success" });
let toastTimer = null;
const showToast = (message, type = "success") => {
  clearTimeout(toastTimer);
  Object.assign(toast, { message, type, show: true });
  toastTimer = setTimeout(() => { toast.show = false; }, 3500);
};

// ── Sucursales (for payment form) ───────────────────────
const sucursales = ref([]);
const handleClientChange = async (clientId) => {
  if (!clientId) { sucursales.value = []; return; }
  const client = clientStore.clients.find((c) => c.id === clientId);
  if (client?.type !== "MAYORISTA") { sucursales.value = []; return; }
  try {
    const res = await SucursalService.fetchSucursales(clientId);
    sucursales.value = res.data;
  } catch {
    sucursales.value = [];
  }
};

// ── Filtros ─────────────────────────────────────────────
const filters = reactive({ client_name: "", client_id: "", client_type: "", status: "", amount: "", from: "", to: "" });
const applyFilters = () => paymentStore.fetchPayments({ ...filters });
const clearFilters = () => {
  Object.assign(filters, { client_name: "", client_id: "", client_type: "", status: "", amount: "", from: "", to: "" });
  paymentStore.fetchPayments();
};

// ── Modal pago ──────────────────────────────────────────
const modal = reactive({ open: false, editing: false, data: null });

const openCreate = () => {
  sucursales.value = [];
  modal.data = null;
  modal.editing = false;
  modal.open = true;
};

const openEdit = async (payment) => {
  sucursales.value = [];
  if (payment.client?.type === "MAYORISTA") {
    try {
      const res = await SucursalService.fetchSucursales(payment.client_id);
      sucursales.value = res.data;
    } catch { /* silent */ }
  }
  modal.data = { ...payment };
  modal.editing = true;
  modal.open = true;
};

const closeModal = () => { modal.open = false; };

const handleFormSubmit = async (formData) => {
  try {
    if (modal.editing) {
      await paymentStore.updatePayment(modal.data.id, formData);
      showToast("Pago actualizado correctamente.");
    } else {
      await paymentStore.createPayment(formData);
      showToast("Pago registrado correctamente.");
    }
    closeModal();
  } catch (err) {
    showToast(err.message || "Ocurrió un error. Intentá de nuevo.", "error");
  }
};

// ── Toggle status ────────────────────────────────────────
const toggling = ref(null);
const handleToggleStatus = async (payment) => {
  toggling.value = payment.id;
  try {
    const newStatus = payment.status === "PAGADO" ? "PENDIENTE" : "PAGADO";
    await paymentStore.updatePaymentStatus(payment.id, newStatus);
    showToast(`Pago marcado como ${newStatus === "PAGADO" ? "pagado" : "pendiente"}.`);
  } catch (err) {
    showToast(err.message || "No se pudo actualizar el estado.", "error");
  } finally {
    toggling.value = null;
  }
};

// ── Eliminar ─────────────────────────────────────────────
const confirmDelete = reactive({ open: false, payment: null });
const openConfirmDelete = (payment) => { confirmDelete.payment = payment; confirmDelete.open = true; };
const closeConfirmDelete = () => { confirmDelete.open = false; };
const handleDelete = async () => {
  try {
    await paymentStore.deletePayment(confirmDelete.payment.id);
    closeConfirmDelete();
    showToast("El pago fue eliminado.");
  } catch (err) {
    showToast(err.message || "No se pudo eliminar el pago.", "error");
  }
};

const formatCurrency = (val) =>
  val != null ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(val) : "";

// ── Init ─────────────────────────────────────────────────
onMounted(() => {
  clientStore.fetchClients();
  paymentStore.fetchPayments();
});
</script>

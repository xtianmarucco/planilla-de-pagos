<template>
  <div class="space-y-6">
    <AppToast :show="toast.show" :message="toast.message" :type="toast.type" />

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-brand-text">Clientes</h1>
        <p class="text-sm text-gray-400 mt-1">Gestioná los clientes del negocio</p>
      </div>
      <BaseButton @click="openCreate">+ Nuevo cliente</BaseButton>
    </div>

    <!-- Filters -->
    <BaseCard>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1.5">Buscar por nombre</label>
          <BaseInput v-model="filters.name" placeholder="Nombre del cliente" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-brand-text mb-1.5">Tipo de cliente</label>
          <select
            v-model="filters.type"
            class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-brand-text bg-white focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/10 transition-all"
          >
            <option value="">Todos los tipos</option>
            <option value="MAYORISTA">Mayorista</option>
            <option value="VIABANA">Viabana</option>
          </select>
        </div>
      </div>
    </BaseCard>

    <!-- Content -->
    <div v-if="clientStore.loading" class="flex items-center justify-center py-16 text-sm text-gray-400">
      Cargando...
    </div>
    <div v-else-if="clientStore.error" class="bg-red-50 text-red-600 rounded-2xl p-4 text-sm">
      {{ clientStore.error }}
    </div>
    <ClientTable
      v-else
      :clients="filteredClients"
      @edit="openEdit"
      @delete="openConfirmDelete"
      @manage-sucursales="openSucursales"
    />

    <!-- Modal cliente -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="modal.open" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="closeModal">
          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100">
            <div v-if="modal.open" class="bg-white rounded-3xl shadow-card w-full max-w-md">
              <div class="flex items-center justify-between p-6 pb-0">
                <h2 class="text-lg font-bold text-brand-text">
                  {{ modal.editing ? "Editar cliente" : "Nuevo cliente" }}
                </h2>
                <button class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" @click="closeModal">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="p-6">
                <ClientForm :initial-data="modal.data" :saving="clientStore.saving" @submit="handleFormSubmit" @cancel="closeModal" />
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal sucursales -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="sucursalModal.open" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="closeSucursales">
          <div class="bg-white rounded-3xl shadow-card w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 class="text-lg font-bold text-brand-text">Sucursales</h2>
                <p class="text-xs text-gray-400 mt-0.5">{{ sucursalModal.client?.name }}</p>
              </div>
              <button class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" @click="closeSucursales">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-6">
              <SucursalPanel
                v-if="sucursalModal.open"
                :client-id="sucursalModal.client.id"
                @toast="(msg, type) => showToast(msg, type)"
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
              <h2 class="text-lg font-bold text-brand-text">Eliminar cliente</h2>
              <button class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" @click="closeConfirmDelete">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-500 leading-relaxed">
              ¿Estás seguro que querés eliminar a
              <strong class="text-brand-text">{{ confirmDelete.client?.name }}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" @click="closeConfirmDelete" :disabled="clientStore.saving">Cancelar</BaseButton>
              <BaseButton variant="danger" @click="handleDelete" :disabled="clientStore.saving">
                {{ clientStore.saving ? "Eliminando..." : "Sí, eliminar" }}
              </BaseButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import { useClientStore } from "@/stores/client.store.js";
import ClientTable from "@/components/ClientTable.vue";
import ClientForm from "@/components/ClientForm.vue";
import SucursalPanel from "@/components/SucursalPanel.vue";
import AppToast from "@/components/AppToast.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseCard from "@/components/BaseCard.vue";
import BaseInput from "@/components/BaseInput.vue";

const clientStore = useClientStore();

// ── Filtros ─────────────────────────────────────────────
const filters = reactive({ name: "", type: "" });
const filteredClients = computed(() => {
  let list = clientStore.clients;
  if (filters.type) list = list.filter((c) => c.type === filters.type);
  if (filters.name.trim()) {
    const q = filters.name.trim().toLowerCase();
    list = list.filter((c) => c.name.toLowerCase().includes(q));
  }
  return list;
});

// ── Toast ───────────────────────────────────────────────
const toast = reactive({ show: false, message: "", type: "success" });
let toastTimer = null;
const showToast = (message, type = "success") => {
  clearTimeout(toastTimer);
  Object.assign(toast, { message, type, show: true });
  toastTimer = setTimeout(() => { toast.show = false; }, 3500);
};

// ── Modal cliente ───────────────────────────────────────
const modal = reactive({ open: false, editing: false, data: null });
const openCreate = () => { modal.data = null; modal.editing = false; modal.open = true; };
const openEdit = (client) => { modal.data = { ...client }; modal.editing = true; modal.open = true; };
const closeModal = () => { modal.open = false; };

const handleFormSubmit = async (formData) => {
  try {
    if (modal.editing) {
      await clientStore.updateClient(modal.data.id, formData);
      showToast("Cliente actualizado correctamente.");
    } else {
      await clientStore.createClient(formData);
      showToast("Cliente creado correctamente.");
    }
    closeModal();
  } catch (err) {
    showToast(err.message || "Ocurrió un error. Intentá de nuevo.", "error");
  }
};

// ── Modal sucursales ────────────────────────────────────
const sucursalModal = reactive({ open: false, client: null });
const openSucursales = (client) => { sucursalModal.client = client; sucursalModal.open = true; };
const closeSucursales = () => { sucursalModal.open = false; };

// ── Eliminar cliente ────────────────────────────────────
const confirmDelete = reactive({ open: false, client: null });
const openConfirmDelete = (client) => { confirmDelete.client = client; confirmDelete.open = true; };
const closeConfirmDelete = () => { confirmDelete.open = false; };

const handleDelete = async () => {
  try {
    const name = confirmDelete.client.name;
    await clientStore.deleteClient(confirmDelete.client.id);
    closeConfirmDelete();
    showToast(`"${name}" fue eliminado.`);
  } catch (err) {
    showToast(err.message || "No se pudo eliminar el cliente.", "error");
  }
};

onMounted(() => clientStore.fetchClients());
</script>

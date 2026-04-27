<template>
  <div class="space-y-4">
    <!-- List -->
    <div v-if="sucursalStore.loading" class="text-sm text-gray-400 py-4 text-center">
      Cargando...
    </div>
    <div v-else-if="sucursalStore.sucursales.length === 0 && !showForm" class="text-sm text-gray-400 py-4 text-center">
      Este cliente aún no tiene sucursales.
    </div>
    <ul v-else class="divide-y divide-gray-100">
      <li
        v-for="s in sucursalStore.sucursales"
        :key="s.id"
        class="flex items-center justify-between py-3"
      >
        <div v-if="editingId !== s.id">
          <p class="text-sm font-semibold text-brand-text">{{ s.name }}</p>
          <p v-if="s.address || s.phone" class="text-xs text-gray-400 mt-0.5">
            {{ [s.address, s.phone].filter(Boolean).join(" · ") }}
          </p>
        </div>
        <div v-else class="flex-1 mr-4">
          <SucursalForm
            :initial-data="s"
            :saving="sucursalStore.saving"
            @submit="(data) => handleUpdate(s.id, data)"
            @cancel="editingId = null"
          />
        </div>
        <div v-if="editingId !== s.id" class="flex gap-2 shrink-0">
          <button
            class="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
            @click="editingId = s.id"
          >
            Editar
          </button>
          <button
            class="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
            @click="handleDelete(s)"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>

    <!-- Add form -->
    <div v-if="showForm" class="border-t border-gray-100 pt-4">
      <p class="text-xs font-semibold text-brand-text mb-3">Nueva sucursal</p>
      <SucursalForm
        :saving="sucursalStore.saving"
        @submit="handleCreate"
        @cancel="showForm = false"
      />
    </div>

    <div v-if="!showForm" class="pt-1">
      <BaseButton variant="ghost" @click="showForm = true">+ Agregar sucursal</BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSucursalStore } from "@/stores/sucursal.store.js";
import SucursalForm from "./SucursalForm.vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps({
  clientId: { type: Number, required: true },
});

const emit = defineEmits(["toast"]);

const sucursalStore = useSucursalStore();
const showForm  = ref(false);
const editingId = ref(null);

onMounted(() => sucursalStore.fetchSucursales(props.clientId));

const handleCreate = async (data) => {
  try {
    await sucursalStore.createSucursal({ ...data, client_id: props.clientId });
    showForm.value = false;
    emit("toast", "Sucursal creada correctamente.");
  } catch (err) {
    emit("toast", err.message || "No se pudo crear la sucursal.", "error");
  }
};

const handleUpdate = async (id, data) => {
  try {
    await sucursalStore.updateSucursal(id, data);
    editingId.value = null;
    emit("toast", "Sucursal actualizada.");
  } catch (err) {
    emit("toast", err.message || "No se pudo actualizar.", "error");
  }
};

const handleDelete = async (s) => {
  if (!confirm(`¿Eliminar "${s.name}"?`)) return;
  try {
    await sucursalStore.deleteSucursal(s.id);
    emit("toast", `"${s.name}" fue eliminada.`);
  } catch (err) {
    emit("toast", err.message || "No se pudo eliminar.", "error");
  }
};
</script>

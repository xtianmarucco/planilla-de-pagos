<template>
  <BaseTable
    :headers="['Nombre', 'Email', 'Rol', 'Estado', '']"
    :is-empty="!users.length"
    empty-text="No hay usuarios registrados."
  >
    <tr
      v-for="user in paged"
      :key="user.id"
      class="border-b border-gray-50 hover:bg-brand-bg transition-colors duration-150"
    >
      <td class="px-6 py-4 font-semibold text-brand-text text-sm">{{ user.name }}</td>
      <td class="px-6 py-4 text-sm text-gray-500">{{ user.email }}</td>
      <td class="px-6 py-4">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
          :class="user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'"
        >
          {{ user.role }}
        </span>
      </td>
      <td class="px-6 py-4">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
          :class="user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'"
        >
          {{ user.is_active ? "Activo" : "Inactivo" }}
        </span>
      </td>
      <td class="px-6 py-4 text-right whitespace-nowrap">
        <button
          class="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-xl hover:bg-primary hover:text-white transition-all duration-200 mr-2"
          @click="$emit('edit', user)"
        >
          Editar
        </button>
        <button
          class="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl hover:bg-amber-500 hover:text-white transition-all duration-200 mr-2"
          @click="$emit('change-password', user)"
        >
          Contraseña
        </button>
        <button
          v-if="user.id !== currentUserId"
          class="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
          @click="$emit('delete', user)"
        >
          Desactivar
        </button>
      </td>
    </tr>

    <template #footer>
      <BasePagination
        v-if="users.length > pageSize"
        v-model="page"
        :total="users.length"
        :page-size="pageSize"
      />
    </template>
  </BaseTable>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import BaseTable from "./BaseTable.vue";
import BasePagination from "./BasePagination.vue";

const props = defineProps({
  users: { type: Array, default: () => [] },
  currentUserId: { type: Number, default: null },
});
defineEmits(["edit", "change-password", "delete"]);

const PAGE_SIZE = 10;
const pageSize = PAGE_SIZE;
const page = ref(1);

watch(() => props.users, () => { page.value = 1; });

const paged = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE;
  return props.users.slice(start, start + PAGE_SIZE);
});
</script>

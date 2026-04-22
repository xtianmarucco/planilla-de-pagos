<template>
  <BaseTable
    :headers="['Nombre', 'Tipo', 'Teléfono', 'Dirección', '']"
    :is-empty="!clients.length"
    empty-text="No hay clientes registrados."
  >
    <tr
      v-for="client in clients"
      :key="client.id"
      class="border-b border-gray-50 hover:bg-brand-bg transition-colors duration-150"
    >
      <td class="px-6 py-4 font-semibold text-brand-text text-sm">
        {{ client.name }}
      </td>
      <td class="px-6 py-4">
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
          :class="
            client.type === 'MAYORISTA'
              ? 'bg-primary/10 text-primary'
              : 'bg-green-100 text-green-700'
          "
        >
          {{ client.type }}
        </span>
      </td>
      <td class="px-6 py-4 text-sm text-gray-500">{{ client.phone || "—" }}</td>
      <td class="px-6 py-4 text-sm text-gray-500">
        {{ client.address || "—" }}
      </td>
      <td class="px-6 py-4 text-right whitespace-nowrap">
        <button
          class="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-xl hover:bg-primary hover:text-white transition-all duration-200 mr-2"
          @click="$emit('edit', client)"
        >
          Editar
        </button>
        <button
          class="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
          @click="$emit('delete', client)"
        >
          Eliminar
        </button>
      </td>
    </tr>
  </BaseTable>
</template>

<script setup>
import BaseTable from "./BaseTable.vue";

defineProps({ clients: { type: Array, default: () => [] } });
defineEmits(["edit", "delete"]);
</script>

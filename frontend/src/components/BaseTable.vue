<template>
  <BaseCard no-padding class="overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th
              v-for="header in headers"
              :key="header"
              class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              :class="header === '' ? '' : 'text-brand-text/50'"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <slot />
          <tr v-if="isEmpty">
            <td
              :colspan="headers.length"
              class="px-6 py-16 text-center text-sm text-gray-400"
            >
              {{ emptyText }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="$slots.footer" class="border-t border-gray-100 px-6 py-3">
      <slot name="footer" />
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from "./BaseCard.vue";

defineProps({
  headers: { type: Array, default: () => [] },
  isEmpty: { type: Boolean, default: false },
  emptyText: { type: String, default: "No hay datos." },
});
</script>

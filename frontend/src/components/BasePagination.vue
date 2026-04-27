<template>
  <div class="flex items-center justify-between gap-4">
    <p class="text-xs text-gray-400 shrink-0">
      {{ from }}–{{ to }} de {{ total }}
    </p>

    <div class="flex items-center gap-1">
      <button
        class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-500"
        :disabled="modelValue === 1"
        @click="$emit('update:modelValue', modelValue - 1)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <template v-for="p in pages" :key="p">
        <span v-if="p === '...'" class="w-7 h-7 flex items-center justify-center text-xs text-gray-400">…</span>
        <button
          v-else
          class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors"
          :class="p === modelValue ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-500'"
          @click="$emit('update:modelValue', p)"
        >
          {{ p }}
        </button>
      </template>

      <button
        class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-500"
        :disabled="modelValue === totalPages"
        @click="$emit('update:modelValue', modelValue + 1)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: Number, required: true },
  total:      { type: Number, required: true },
  pageSize:   { type: Number, default: 15 },
});

defineEmits(["update:modelValue"]);

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const from       = computed(() => props.total === 0 ? 0 : (props.modelValue - 1) * props.pageSize + 1);
const to         = computed(() => Math.min(props.modelValue * props.pageSize, props.total));

const pages = computed(() => {
  const total = totalPages.value;
  const cur   = props.modelValue;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 4)   return [1, 2, 3, 4, 5, "...", total];
  if (cur >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", cur - 1, cur, cur + 1, "...", total];
});
</script>

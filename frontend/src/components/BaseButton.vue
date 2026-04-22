<template>
  <button
    v-bind="$attrs"
    class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none"
    :class="[variantClasses, sizeClasses]"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size:    { type: String, default: 'md' },
});

const variantClasses = computed(() => ({
  primary:   'bg-primary text-white rounded-2xl shadow-btn hover:bg-[#0f6ae0] active:bg-[#0a5bc4]',
  secondary: 'bg-gray-100 text-brand-text rounded-2xl hover:bg-gray-200',
  outline:   'border-2 border-primary text-primary bg-transparent rounded-2xl hover:bg-primary hover:text-white',
  ghost:     'text-gray-500 border border-gray-200 bg-transparent rounded-2xl hover:bg-gray-50 hover:text-brand-text',
  danger:    'bg-red-500 text-white rounded-2xl hover:bg-red-600 active:bg-red-700',
}[props.variant]));

const sizeClasses = computed(() => ({
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
}[props.size]));
</script>

<template>
  <input
    v-bind="$attrs"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full rounded-xl border px-4 py-2.5 text-sm text-brand-text bg-white transition-all duration-200 focus:outline-none focus:ring-2 placeholder-gray-400"
    :class="error
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
      : 'border-gray-200 focus:border-primary focus:ring-primary/10'"
  />
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  error:      { type: Boolean, default: false },
});
defineEmits(['update:modelValue']);
</script>

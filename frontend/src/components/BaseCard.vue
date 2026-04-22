<template>
  <div
    class="bg-white rounded-3xl shadow-card"
    :class="noPadding ? '' : 'p-6'"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  noPadding: { type: Boolean, default: false },
});
</script>

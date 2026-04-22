<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="show"
        role="alert"
        class="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-card min-w-[260px] max-w-sm"
        :class="type === 'success'
          ? 'bg-white border-l-4 border-green-500'
          : 'bg-white border-l-4 border-red-500'"
      >
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          :class="type === 'success' ? 'bg-green-100' : 'bg-red-100'"
        >
          <svg
            class="w-4 h-4"
            :class="type === 'success' ? 'text-green-600' : 'text-red-500'"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              :d="type === 'success'
                ? 'M5 13l4 4L19 7'
                : 'M6 18L18 6M6 6l12 12'"
            />
          </svg>
        </div>
        <p class="text-sm font-medium text-brand-text m-0">{{ message }}</p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show:    { type: Boolean, default: false },
  message: { type: String,  default: '' },
  type:    { type: String,  default: 'success' },
});
</script>

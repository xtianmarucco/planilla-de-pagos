<template>
  <section class="space-y-3">
    <div>
      <h2 class="text-lg font-bold text-brand-text">{{ title }}</h2>
      <p class="text-sm text-gray-400 mt-1">{{ subtitle }}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <BaseCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-3 min-w-0">
            <p
              class="text-xs font-semibold text-gray-400 uppercase tracking-wider m-0"
            >
              {{ stat.label }}
            </p>
            <p class="text-3xl font-bold text-brand-text m-0 break-words">
              {{ stat.value }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            :class="stat.iconBg"
          >
            <svg
              class="w-6 h-6"
              :class="stat.iconColor"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="stat.icon"
              />
            </svg>
          </div>
        </div>
      </BaseCard>
    </div>
  </section>
</template>

<script setup>
import BaseCard from "@/components/BaseCard.vue";

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  stats: { type: Array, required: true },
});
</script>

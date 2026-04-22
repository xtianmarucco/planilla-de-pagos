<template>
  <div class="flex min-h-screen bg-brand-bg">

    <!-- Desktop sidebar -->
    <AppSidebar class="hidden md:flex" />

    <!-- Mobile sidebar overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 bg-black/40 z-40 md:hidden"
        @click="mobileMenuOpen = false"
      />
    </Transition>

    <!-- Mobile sidebar drawer -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div v-if="mobileMenuOpen" class="fixed inset-y-0 left-0 z-50 md:hidden">
        <AppSidebar />
      </div>
    </Transition>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-h-screen min-w-0">

      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-6 flex-shrink-0 shadow-card-sm">
        <!-- Hamburger (mobile only) -->
        <button
          class="md:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors"
          @click="mobileMenuOpen = true"
          aria-label="Abrir menú"
        >
          <svg class="w-5 h-5 text-brand-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Page title -->
        <span class="font-semibold text-brand-text text-sm md:text-base">{{ currentPageTitle }}</span>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 md:p-6">
        <router-view />
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from '@/components/AppSidebar.vue';

const route          = useRoute();
const mobileMenuOpen = ref(false);

const pageTitles = {
  '/':         'Dashboard',
  '/clients':  'Clientes',
  '/payments': 'Pagos',
};

const currentPageTitle = computed(() => pageTitles[route.path] ?? 'Planilla de Pagos');
</script>

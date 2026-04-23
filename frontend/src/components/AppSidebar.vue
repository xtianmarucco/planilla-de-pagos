<template>
  <aside
    class="flex flex-col w-[240px] min-h-screen bg-white shadow-sidebar flex-shrink-0 py-6 px-4 gap-8"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-2">
      <div
        class="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-btn flex-shrink-0"
      >
        <svg
          class="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div>
        <p class="font-bold text-brand-text text-sm leading-tight m-0">
          Planilla
        </p>
        <p class="text-xs text-gray-400 leading-tight m-0">de Pagos</p>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex flex-col gap-1 flex-1">
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigate(item.path)"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-left"
        :class="
          isActive(item)
            ? 'bg-primary/10 text-primary'
            : 'text-gray-500 hover:bg-gray-50 hover:text-brand-text'
        "
      >
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
          :class="
            isActive(item)
              ? 'bg-primary text-white shadow-btn'
              : 'bg-gray-100 text-gray-500'
          "
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="item.icon"
            />
          </svg>
        </div>
        <span class="text-sm font-medium">{{ item.label }}</span>
      </button>
    </nav>

    <!-- User + logout -->
    <div class="border-t border-gray-100 pt-4">
      <div class="flex items-center gap-2 px-2 mb-3">
        <div
          class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
        >
          <span class="text-xs font-bold text-primary">{{ userInitial }}</span>
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold text-brand-text truncate m-0">
            {{ authStore.user?.name }}
          </p>
          <p class="text-[11px] text-gray-400 truncate m-0">
            {{ authStore.user?.email }}
          </p>
        </div>
      </div>
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors text-sm"
      >
        <svg
          class="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Cerrar sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";

const authStore = useAuthStore();
const userInitial = computed(
  () => authStore.user?.name?.[0]?.toUpperCase() ?? "?",
);

const route = useRoute();
const router = useRouter();

const navItems = [
  {
    path: "/",
    label: "Dashboard",
    exact: true,
    icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
  },
  {
    path: "/clients",
    label: "Clientes",
    exact: false,
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    path: "/payments",
    label: "Pagos",
    exact: false,
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
];

const isActive = (item) =>
  item.exact ? route.path === item.path : route.path.startsWith(item.path);

const navigate = (path) => router.push(path);

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>

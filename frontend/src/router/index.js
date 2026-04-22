import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';
import DashboardLayout from '@/layouts/DashboardLayout.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
      },
      {
        path: 'payments',
        name: 'Payments',
        component: () => import('@/views/PaymentsView.vue'),
      },
      {
        path: 'clients',
        name: 'Clients',
        component: () => import('@/views/ClientsView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  await authStore.init();

  if (!authStore.user && to.name !== 'Login') {
    return { name: 'Login' };
  }

  if (authStore.user && to.name === 'Login') {
    return { name: 'Dashboard' };
  }
});

export default router;

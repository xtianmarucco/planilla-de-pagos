<template>
  <div class="space-y-6">
    <AppToast :show="toast.show" :message="toast.message" :type="toast.type" />

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-brand-text">Usuarios</h1>
        <p class="text-sm text-gray-400 mt-1">Administrá las cuentas del sistema</p>
      </div>
      <BaseButton @click="openCreate">+ Nuevo usuario</BaseButton>
    </div>

    <!-- Content -->
    <div v-if="userStore.loading" class="flex items-center justify-center py-16 text-sm text-gray-400">
      Cargando...
    </div>
    <div v-else-if="userStore.error" class="bg-red-50 text-red-600 rounded-2xl p-4 text-sm">
      {{ userStore.error }}
    </div>
    <UserTable
      v-else
      :users="userStore.users"
      :current-user-id="authStore.user?.id"
      @edit="openEdit"
      @change-password="openChangePassword"
      @delete="openConfirmDelete"
    />

    <!-- Modal usuario -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="modal.open" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="closeModal">
          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100">
            <div v-if="modal.open" class="bg-white rounded-3xl shadow-card w-full max-w-md">
              <div class="flex items-center justify-between p-6 pb-0">
                <h2 class="text-lg font-bold text-brand-text">
                  {{ modal.editing ? "Editar usuario" : "Nuevo usuario" }}
                </h2>
                <button class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" @click="closeModal">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="p-6">
                <UserForm :initial-data="modal.data" :saving="userStore.saving" @submit="handleFormSubmit" @cancel="closeModal" />
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal cambiar contraseña -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="passwordModal.open" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="closeChangePassword">
          <div class="bg-white rounded-3xl shadow-card w-full max-w-md">
            <div class="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 class="text-lg font-bold text-brand-text">Cambiar contraseña</h2>
                <p class="text-xs text-gray-400 mt-0.5">{{ passwordModal.user?.name }}</p>
              </div>
              <button class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" @click="closeChangePassword">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-6">
              <ChangePasswordForm :saving="userStore.saving" @submit="handleChangePassword" @cancel="closeChangePassword" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Confirmación de desactivación -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="confirmDelete.open" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="closeConfirmDelete">
          <div class="bg-white rounded-3xl shadow-card w-full max-w-sm p-6 space-y-5">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-brand-text">Desactivar usuario</h2>
              <button class="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" @click="closeConfirmDelete">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-500 leading-relaxed">
              ¿Estás seguro que querés desactivar a
              <strong class="text-brand-text">{{ confirmDelete.user?.name }}</strong>?
              No va a poder iniciar sesión hasta que lo reactives.
            </p>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" @click="closeConfirmDelete" :disabled="userStore.saving">Cancelar</BaseButton>
              <BaseButton variant="danger" @click="handleDelete" :disabled="userStore.saving">
                {{ userStore.saving ? "Desactivando..." : "Sí, desactivar" }}
              </BaseButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useUserStore } from "@/stores/user.store.js";
import { useAuthStore } from "@/stores/auth.store.js";
import UserTable from "@/components/UserTable.vue";
import UserForm from "@/components/UserForm.vue";
import ChangePasswordForm from "@/components/ChangePasswordForm.vue";
import AppToast from "@/components/AppToast.vue";
import BaseButton from "@/components/BaseButton.vue";

const userStore = useUserStore();
const authStore = useAuthStore();

// ── Toast ───────────────────────────────────────────────
const toast = reactive({ show: false, message: "", type: "success" });
let toastTimer = null;
const showToast = (message, type = "success") => {
  clearTimeout(toastTimer);
  Object.assign(toast, { message, type, show: true });
  toastTimer = setTimeout(() => { toast.show = false; }, 3500);
};

// ── Modal usuario ───────────────────────────────────────
const modal = reactive({ open: false, editing: false, data: null });
const openCreate = () => { modal.data = null; modal.editing = false; modal.open = true; };
const openEdit = (user) => { modal.data = { ...user }; modal.editing = true; modal.open = true; };
const closeModal = () => { modal.open = false; };

const handleFormSubmit = async (formData) => {
  try {
    if (modal.editing) {
      await userStore.updateUser(modal.data.id, formData);
      showToast("Usuario actualizado correctamente.");
    } else {
      await userStore.createUser(formData);
      showToast("Usuario creado correctamente.");
    }
    closeModal();
  } catch (err) {
    showToast(err.message || "Ocurrió un error. Intentá de nuevo.", "error");
  }
};

// ── Modal cambiar contraseña ────────────────────────────
const passwordModal = reactive({ open: false, user: null });
const openChangePassword = (user) => { passwordModal.user = user; passwordModal.open = true; };
const closeChangePassword = () => { passwordModal.open = false; };

const handleChangePassword = async (password) => {
  try {
    await userStore.updateUserPassword(passwordModal.user.id, password);
    showToast("Contraseña actualizada correctamente.");
    closeChangePassword();
  } catch (err) {
    showToast(err.message || "No se pudo cambiar la contraseña.", "error");
  }
};

// ── Desactivar usuario ──────────────────────────────────
const confirmDelete = reactive({ open: false, user: null });
const openConfirmDelete = (user) => { confirmDelete.user = user; confirmDelete.open = true; };
const closeConfirmDelete = () => { confirmDelete.open = false; };

const handleDelete = async () => {
  try {
    const name = confirmDelete.user.name;
    await userStore.deleteUser(confirmDelete.user.id);
    closeConfirmDelete();
    showToast(`"${name}" fue desactivado.`);
  } catch (err) {
    showToast(err.message || "No se pudo desactivar el usuario.", "error");
  }
};

onMounted(() => userStore.fetchUsers());
</script>

import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token") || null);

  const isAuthenticated = computed(() => !!token.value);

  function login(userData, accessToken) {
    user.value = userData;
    token.value = accessToken;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function loadFromStorage() {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser);
      token.value = savedToken;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    loadFromStorage,
  };
});

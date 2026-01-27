<script setup lang="ts">
import { ref, computed } from 'vue'

// const routes = {
//   '/': Home,
//   '/games': Games
// }

// const currentPath = ref(window.location.hash)

// window.addEventListener('hashchange', () => {
//   currentPath.value = window.location.hash
// })

// const currentView = computed(() => {
//   return routes[currentPath.value.slice(1) || '/'] || NotFound
// })
</script>

<template>
  <main>
    <nav class="flex flex-row justify-between bg-gray-900 fixed top-0 right-0 left-0 p-4">
      <div class="text-gray-100 font-bold text-2xl">
        96 Online Casino
      </div>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/games">Games</RouterLink>
 
    </nav>
     <!-- <component :is="currentView" /> -->
    <RouterView />
  </main>

</template>

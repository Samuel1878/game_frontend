<script setup lang="ts">
const year = new Date().getFullYear()

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Games", path: "/games" },
  { name: "Deposit", path: "/deposit" },
  { name: "Withdraw", path: "/withdrawal" },
]

const supportLinks = [
  { name: "Help Center", path: "/help" },
  { name: "Terms & Conditions", path: "/terms" },
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Responsible Gaming", path: "/responsible" },
]
</script>

<template>
  <footer class="bg-slate-950 text-gray-400 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-3 py-12 grid gap-10 md:grid-cols-4">

      <!-- Brand -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-white">999 Casino</h2>
        <p class="text-sm text-gray-500">
          Play your favorite casino games anytime, anywhere. 
          Fast payouts, secure gaming, and exciting bonuses.
        </p>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="text-white font-semibold mb-4">Products</h3>
        <ul class="space-y-2">
          <li v-for="link in quickLinks" :key="link.name">
            <router-link
              :to="link.path"
              class="hover:text-sky-400 transition"
            >
              {{ link.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Support -->
      <div>
        <h3 class="text-white font-semibold mb-4">Support</h3>
        <ul class="space-y-2">
          <li v-for="link in supportLinks" :key="link.name">
            <router-link
              :to="link.path"
              class="hover:text-sky-400 transition"
            >
              {{ link.name }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Payment & Social -->
      <div class="space-y-4">
        <h3 class="text-white font-semibold">Payment Methods</h3>
        <div class="flex flex-wrap gap-3 text-sm text-gray-500">
          <span class="bg-slate-800 px-3 py-1 rounded">KBZ pay</span>
          <span class="bg-slate-800 px-3 py-1 rounded">Wave Money</span>
          <span class="bg-slate-800 px-3 py-1 rounded">AYA pay</span>
        </div>

        <div>
          <h3 class="text-white font-semibold mt-6 mb-3">Follow Us</h3>
          <div class="flex gap-4 text-lg">
            <a href="#" class="hover:text-sky-400">Telegram</a>
            <a href="#" class="hover:text-sky-400">Viber</a>
            <a href="#" class="hover:text-sky-400">Twitter</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-slate-800 py-4 text-center text-sm text-gray-500">
      © {{ year }} 999 Casino. All rights reserved.
    </div>
  </footer>
</template>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center px-6">
      <h1 class="text-9xl font-extrabold text-gray-800 tracking-widest">404</h1>

      <div class="bg-indigo-600 px-4 py-2 text-sm rounded rotate-12 inline-block text-white mt-4">
        Page Not Found
      </div>

      <p class="mt-6 text-gray-600 text-lg">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>

      <div class="mt-8 flex justify-center gap-4">
        <!-- <router-link
          to="/"
          class="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Go Home
        </router-link> -->
        <button  class="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
            Go Home
        </button>
        <button
        
          class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<!-- <script setup>
// No logic needed
</script> -->
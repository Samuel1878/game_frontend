<script setup lang="ts">
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import NotificationPanel from "@/components/notifications/NotificationPanel.vue";
</script>

<template>
  <main class="flex min-h-dvh w-full flex-col bg-gray-900">
    <CustomNavBar title="notifications.title" back-to="/user/profile">
      <template #right>
        <LanguageBtn />
      </template>
    </CustomNavBar>
    <div class="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col py-2">
      <NotificationPanel />
    </div>
  </main>
</template>

<script setup lang="ts">
import type { SidebarProps } from ".";
import { cn } from "@/lib/utils";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_MOBILE, useSidebar } from "./utils";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SidebarProps>(), {
  side: "left",
  variant: "sidebar",
  collapsible: "offcanvas",
});

const { isMobile, open, openMobile, setOpenMobile } = useSidebar();
</script>

<template>
  <aside
    v-if="!isMobile && (collapsible === 'none' || open)"
    data-slot="sidebar"
    data-sidebar="sidebar"
    :data-variant="variant"
    :data-side="side"
    :style="{ width: SIDEBAR_WIDTH }"
    :class="cn('hidden md:flex shrink-0 flex-col bg-gray-900 text-white', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </aside>

  <Teleport to="body">
    <div
      v-if="isMobile && openMobile"
      class="fixed inset-0 z-50 md:hidden"
      data-slot="sidebar-mobile"
      role="presentation"
    >
      <button
        type="button"
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close menu"
        @click="setOpenMobile(false)"
      />
      <aside
        data-slot="sidebar"
        data-sidebar="sidebar"
        data-mobile="true"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        :style="{ width: SIDEBAR_WIDTH_MOBILE }"
        :class="cn(
          'fixed top-0 bottom-0 z-10 flex max-w-[86vw] flex-col bg-gray-900 text-white shadow-2xl transition-transform',
          side === 'right' ? 'right-0' : 'left-0',
          props.class,
        )"
        v-bind="$attrs"
      >
        <slot />
      </aside>
    </div>
  </Teleport>
</template>

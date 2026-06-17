<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useEventListener, useMediaQuery } from "@vueuse/core";
import { cn } from "@/lib/utils";
import {
  provideSidebarContext,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
} from "./utils";

const props = withDefaults(defineProps<{
  defaultOpen?: boolean;
  open?: boolean;
  class?: HTMLAttributes["class"];
}>(), {
  defaultOpen: undefined,
  open: undefined,
});

const emit = defineEmits<{
  "update:open": [open: boolean];
}>();

const readInitialOpen = () => {
  if (typeof props.open === "boolean") return props.open;
  if (typeof props.defaultOpen === "boolean") return props.defaultOpen;
  if (typeof document === "undefined") return true;

  return !document.cookie.includes(`${SIDEBAR_COOKIE_NAME}=false`);
};

const isMobile = useMediaQuery("(max-width: 768px)");
const openMobile = ref(false);
const open = ref(readInitialOpen());
const state = computed(() => (open.value ? "expanded" : "collapsed"));

const setOpen = (value: boolean) => {
  open.value = value;
  emit("update:open", value);

  if (typeof document !== "undefined") {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }
};

const setOpenMobile = (value: boolean) => {
  openMobile.value = value;
};

const toggleSidebar = () => {
  if (isMobile.value) {
    setOpenMobile(!openMobile.value);
  } else {
    setOpen(!open.value);
  }
};

watch(
  () => props.open,
  (value) => {
    if (typeof value === "boolean") open.value = value;
  },
);

watch(isMobile, (value) => {
  if (!value) openMobile.value = false;
});

watch(openMobile, (value) => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = value ? "hidden" : "";
  }
});

useEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Escape" && openMobile.value) {
    setOpenMobile(false);
    return;
  }

  if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    toggleSidebar();
  }
});

onMounted(() => {
  open.value = readInitialOpen();
});

onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});

provideSidebarContext({
  state,
  open,
  setOpen,
  isMobile,
  openMobile,
  setOpenMobile,
  toggleSidebar,
});
</script>

<template>
  <div
    data-slot="sidebar-wrapper"
    :style="{
      '--sidebar-width': SIDEBAR_WIDTH,
      '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
    }"
    :class="cn('flex min-h-svh w-full', props.class)"
  >
    <slot />
  </div>
</template>

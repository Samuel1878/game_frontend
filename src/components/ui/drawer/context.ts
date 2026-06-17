import type { InjectionKey, Ref } from "vue";

export type DrawerContext = {
  open: Ref<boolean>;
  setOpen: (value: boolean) => void;
};

export const drawerContextKey: InjectionKey<DrawerContext> = Symbol("Drawer");

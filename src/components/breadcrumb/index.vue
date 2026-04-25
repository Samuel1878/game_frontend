<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
const {t} = useI18n();
export type Crumb = {
  label?: string | any;
  to?: string; // if no "to" → it's current page
};

const props = defineProps<{
  items: Crumb[];
}>();
</script>

<template>
  <Breadcrumb class="py-2 px-4">
    <BreadcrumbList class="text-sm text-sky-500">
      
      <template v-for="(item, index) in items" :key="index">
        
        <BreadcrumbItem>
          
          <!-- If route exists → clickable -->
          <BreadcrumbLink
            v-if="item.to && index !== items.length - 1"
            as-child
            class="hover:text-primary font-bold transition-colors text-sky-500"
          >
            <RouterLink :to="item.to">
              {{ t(item.label) }}
            </RouterLink>
          </BreadcrumbLink>

          <!-- Last item (current page) -->
          <BreadcrumbPage
            v-else
            class="font-medium text-sky-100"
          >
            {{ t(item.label) }}
          </BreadcrumbPage>

        </BreadcrumbItem>

        <!-- Separator (not after last item) -->
        <BreadcrumbSeparator
          v-if="index !== items.length - 1"
          class="text-muted-foreground"
        />
        
      </template>

    </BreadcrumbList>
  </Breadcrumb>
</template>
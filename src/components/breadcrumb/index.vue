<script setup lang="ts">
import { SlashIcon } from 'lucide-vue-next'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
defineProps<{
  payment?: string

}>()
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink as-child>
          <a href="/games">game</a>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <!-- <SlashIcon /> -->
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbLink as-child>
          <a href="/deposit">deposit</a>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <!-- <SlashIcon /> -->
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbPage>{{ payment }}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>

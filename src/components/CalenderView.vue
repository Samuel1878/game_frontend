<script setup lang="ts">
import type { DateValue } from "@internationalized/date"
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date"
import { CalendarIcon } from "lucide-vue-next"
import { ref, type Ref, watch } from "vue"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const props = defineProps<{
  modelValue?: DateValue
  placeholder?: string
}>()

const emit = defineEmits(["update:modelValue"])

const date = ref(props.modelValue) as Ref<DateValue | undefined>

const df = new DateFormatter("en-US", {
  dateStyle: "long",
})

watch(date, (val) => {
  emit("update:modelValue", val)
})

const defaultPlaceholder = today(getLocalTimeZone())
</script>

<template>
  <Popover v-slot="{ close }">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn('w-1/2 glass-bg hover:text-gray-50 text-gray-50 hover:bg-gray-700 justify-start text-left font-normal', !date && 'text-muted-foreground')"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />

        {{ date
          ? df.format(date.toDate(getLocalTimeZone()))
          : placeholder || "Pick a date" }}
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-auto p-0" align="start">
      <Calendar
        v-model="date"
        :default-placeholder="defaultPlaceholder"
        layout="month-and-year"
        initial-focus
        @update:model-value="close"
      />
    </PopoverContent>
  </Popover>
</template>
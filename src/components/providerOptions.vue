<script setup lang="ts">
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { slotGameProviders } from '@/consts'

const open = ref(false)
const value = ref('')
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class=" justify-between bg-slate-800 border-0 ring-0"
      >
        {{
          value
            ? slotGameProviders.find(framework => framework.name === value)?.name
            : 'Providers'
        }}
        <ChevronsUpDownIcon class="ml-1 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0 bg-slate-900 border-0">
      <Command class="bg-slate-900">
        <CommandInput placeholder="Search Provider..." class="text-md"/>
        <CommandList>
          <CommandEmpty>No game found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="framework in slotGameProviders"
              :key="framework.name"
              :value="framework.name"
              class="text-sky-100 text-lg"
              @select="() => {
                value = value === framework.name ? '' : framework.name
                open = false
              }"
            >
              <CheckIcon
                :class="['mr-2 h-4 w-4', value === framework.name ? 'opacity-100' : 'opacity-0']"
              />
              {{framework.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

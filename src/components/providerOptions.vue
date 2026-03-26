<script setup lang="ts">
import { CheckCircle, ChevronsUpDownIcon } from 'lucide-vue-next'
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
const props = defineProps<{
  providerName?:string;
  GpId?:number;
  setValue:(name:string, GpId:number)=>void
}>()
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
          GpId
            ? slotGameProviders.find(framework => framework.GpId === GpId)?.name
            : 'All Provider'
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
                :class="['text-lg', providerName===framework.name ? 'text-sky-500 bg-slate-800':'text-sky-50 bg-slate-900']"
              @select="() => {
                setValue(framework.name, framework.GpId)
                open = false
                
              }"
            >
              <CheckCircle
                :class="['mr-2 h-4 w-4', providerName === framework.name ? 'opacity-100 text-sky-600' : 'opacity-0']"
              />
              {{framework.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

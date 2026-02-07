<script lang="ts" setup>
import { Input } from '@/components/ui/input';
defineProps<{
    payment_method:string
}>()



</script>

<template>
    <main class="text-gray-100 bg-gray-900 p-2">
       <section class="p-4">
        <form class="flex flex-col gap-4">
            <Input placeholder="Phone Number" class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"/>
           
            <Input placeholder="User Name" class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"/>
           
            <Input type="number" placeholder="Amount" class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"/>
            <div>

            </div>
            <button class="mt-6 bg-amber-300 h-12 text-gray-950 w-full rounded-2xl flex justify-center items-center">
                Submit
            </button>
        </form>
        </section>
    </main>           
</template>



<script setup lang="ts">
import { paymentMethod } from "@/consts";
import { toast } from 'vue-sonner'
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useClipboard } from "@vueuse/core";
import { Copy } from "lucide-vue-next";
import breadcrumb from '@/components/breadcrumb/index.vue'
const source = ref("09883370394");
const name = ref("SARMWELA");
const { text, copy, isSupported } = useClipboard({ source });
const route = useRoute();
const form = ref({
  name: "",
  last5Digit: "",
  amount: "",
});
console.log(route);
const submit = () => {};
// watchEffect(()=>{

// })
const payment = computed(
  () => paymentMethod.filter((e) => e.value === route.params.payment_method)[0],
);
const copyHandler = () => {
copy()
toast("Copied sucessfully! ")
}
</script>
<template>
  <main class="bg-gray-900">
    <breadcrumb :payment="payment?.value"/>
    <section class="p-4">
      <header class="flex gap-2 items-center justify-between">
      
        
      </header>
      <form class="flex flex-col justify-between" @submit.prevent="submit">
        <div class="flex flex-col gap-4 py-4 my-2">
          <div id="payments" class="flex flex-col">
            <div class="flex items-center flex-col">
 <img :src="payment?.icon" class=" rounded-4xl w-30 h-15 overflow-hidden" />
 <p>{{ payment?.label }}</p>
            </div>
             
            <div v-if="isSupported" class="flex justify-between my-2">
              <p class="text-lg"> 
               <code >{{ text || source }}</code>
              </p>
              <button @click="copyHandler" class="cursor-pointer">
                <!-- <span v-if="!copied">Copy Source</span>
                <span v-else>Copied!</span> -->
                <Copy />
              </button>
            </div>
            <div class="my-2">
              {{ name }}
            </div>
          </div>
          <div class="space-y-2">
            <p>Last 5 digit of the transaction</p>
            <input
              :value="form.last5Digit"
              class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"
              placeholder="5 digit"
            />
          </div>
          <div class="space-y-2">
            <p>Name</p>
            <input
              :value="form.name"
              class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"
              placeholder=""
            />
          </div>
        </div>
        <div class="flex">
          <button
            type="submit"
          
            class="bg-amber-300 h-12 text-gray-950 w-full rounded-2xl flex justify-center items-center"
          >
          Submit
        </button>
        </div>
      </form>
    </section>
  </main>
</template>

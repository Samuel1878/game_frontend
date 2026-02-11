<script lang="ts" setup>
import { Input } from '@/components/ui/input';
import { paymentMethod } from '@/consts';
import { withdrawalHandlerAPI } from '@/services/transactionAPI';
import { useAuthStore } from '@/stores/auth';
import type { withdrawalInfo, withdrawParamType } from '@/utils/types';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
defineProps<{
    payment_method:string
}>()
const route = useRoute();
const payment = computed(
  () => paymentMethod.filter((e) => e.value === route.params.payment_method)[0],
);

const withdraw_name = ref<string>("");
const authStore = useAuthStore();

const withdraw_no = ref<string>("");
const amount = ref<number>(0);
const submit = async ()=> {
    if (!authStore.isLoggedIn || !authStore.user)return toast("Login first");
     if (!payment) {
    toast.error("Invalid payment method");
    return;
  } else if (
    !amount.value || 
    !withdraw_name.value ||
    !withdraw_no.value 
  ) {
    toast.error("Please fill in all fields");
    return;
  } else if (isNaN(parseFloat(amount.value.toString()))) {
    toast.error("Amount must be a number");
    return;
  }
  const data:withdrawalInfo = {
    withdraw_name:withdraw_name.value,
    withdraw_no:withdraw_no.value,
    amount:amount.value,
    payment_method:payment.value?.value,
    
  }
  const param:withdrawParamType = {
    user_id:authStore.user.id,
    uuid:authStore.user.uid
  }
    const response =  await withdrawalHandlerAPI(data, param);
    if (response){
        toast("Withdrawal form submitted successfully!");
        return
    }
    toast("Internal error!")

}


</script>

<template>
    <main class="text-gray-100 bg-gray-900 p-2">
       <section class="p-4">
        <form class="flex flex-col gap-4" v-on:submit.prevent="submit">
            <Input v-model="withdraw_no" placeholder="Phone Number" class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"/>
           
            <Input v-model="withdraw_name" placeholder="User Name" class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"/>
           
            <Input v-model="amount" type="number" placeholder="Amount" class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"/>
            <div>

            </div>
            <button class="mt-6 bg-amber-300 h-12 text-gray-950 w-full rounded-2xl flex justify-center items-center">
                Submit
            </button>
        </form>
        </section>
    </main>           
</template>



<script lang="ts" setup>
import Button from "@/components/ui/button/Button.vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import ApplyBreadCrumb from "@/components/breadcrumb/index.vue";
import { paymentMethod } from "@/consts";
import router from "@/router";
import { withdrawalHandlerAPI } from "@/services/transactionAPI";
import { useAuthStore } from "@/stores/auth";
import { discord, telegram, viber } from "@/utils";
import type {
  BankAccount,
  withdrawalInfo,
  withdrawParamType,
} from "@/utils/types";
import { CreditCard, Headset, User2 } from "lucide-vue-next";
import moment from "moment";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";
import { useBankStore } from "@/stores/bank";
import { storeToRefs } from "pinia";
const bankThemes: Record<string, string> = {
  kbzPay: "from-white/50 via-blue-500 to-blue-400/20",
  wavePay: "from-yellow-500/90 via-yellow-500/80 to-yellow-400/100",
  ayaPay: "from-orange-600/40 via-red-500 to-red-400/10",
  cbPay: "from-red-600 via-rose-500 to-pink-500",
};
defineProps<{
  payment_method: string;
}>();
const { t } = useI18n();
const route = useRoute();
const bankStore = useBankStore()
const { accounts } = storeToRefs(bankStore)
const payment = computed(
  () => paymentMethod.filter((e) => e.value === route.params.payment_method)[0],
);
const withdraw_no = ref<string>("");
const { amount } = route.query;
const withdraw_name = ref<string>("");
const authStore = useAuthStore();
const chooseAccount = (acc: BankAccount) => {
  withdraw_name.value = acc.account_name;
  withdraw_no.value = acc.account_number;
}

// const amount = ref<number>(0);
const submit = async () => {
  if (!authStore.accessToken || !authStore.user) return toast("Login first");
  if (!payment) {
    toast.error("Invalid payment method");
    return;
  } else if (!amount || !withdraw_name.value || !withdraw_no.value) {
    toast.error("Please fill in all fields");
    return;
  } else if (!amount) {
    toast.error("Amount must be a number");
    return;
  }
  const data: withdrawalInfo = {
    withdraw_name: withdraw_name.value,
    withdraw_no: withdraw_no.value,
    amount: parseFloat(amount as string),
    payment_method: payment.value?.value,
  };
  const param: withdrawParamType = {
    user_id: authStore.user.id,
    uuid: authStore.user.uid,
  };
  const response = await withdrawalHandlerAPI(data, param);
  if (response) {
    toast("Withdrawal form submitted successfully!");
    router.back();
    return;
  }
  toast("Internal error!");
  router.back();
};
const breadcrumbs = [
  { label: "Withdraw", to: "/withdraw" },
  { label: payment?.value?.label },
];
onMounted(()=>{
  bankStore.fetchAccounts()
})
</script>

<template>
  <main class="text-gray-100 bg-gray-950 p-4 w-full">
    <div class="w-full">
      <ApplyBreadCrumb :items="breadcrumbs" />
    </div>
    <section
      class="p-4 relative rounded-2xl bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
    >
      <div
        class="w-full flex  rounded-t-2xl gap-2 items-center justify-between"
      >
      <div class="px-3 py-1 backdrop-blur-2xl border-white/30 border 2xl">
<img
          :src="payment?.icon"
          alt="logo"
          class="rounded-lg object-cover w-12 h-12 overflow-hidden"
        />
      </div>
        
        <p class="font-bold text-center text-2xl">{{ amount }} MMK</p>
      </div>

      <div
        class="flex flex-col gap-4 w-full py-4 rounded-b-2xl"
       
      >
        <div class="space-y-2">
          <label for="account_name" class="text-gray-400 font-semibold"
          > {{ t("account_name") }}
          </label>
          <InputGroup
            class="h-12 rounded-lg font-bold border border-gray-700 ring-sky-500 ring-0 bg-gray-900"
          >
            <InputGroupAddon>
              <User2 />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              name="account_name"
              v-model="withdraw_name"
            />
           
          </InputGroup>
        </div>
        <div class="space-y-2">
          <label for="account_name" class="text-gray-400 font-semibold"
            >{{ t("account_number") }}
          </label>
          <InputGroup
            class="h-12 rounded-lg font-bold border border-gray-700 ring-sky-500 ring-0 bg-gray-900"
          >
            <InputGroupAddon>
              <CreditCard />
            </InputGroupAddon>
            <InputGroupInput
              type="number"
              name="account_number"
              v-model="withdraw_no"
            />
            
          </InputGroup>
        </div>
        <Button
          @click="submit"
          class="mt-6 bg-sky-600 h-12 text-gray-50 font-bold w-full rounded-xl flex justify-center items-center"
        >
    {{ t('submit') }}
        </Button>
      </div>
    </section>
    <section>
      <div class="flex">
        <div>
          <div class="text-white font-bold">
            {{ t("choose_withdraw_account") }}
          </div>
        </div>
        <div></div>
      </div>
      <div class="flex gap-2 overflow-x-scroll py-2 no-scrollbar" v-if="accounts">
        <div
          v-for="acc in accounts"
          :key="acc.id"
          @click="chooseAccount(acc)"
          :class="[
            'p-5 min-w-xs rounded-2xl shadow-xl bg-linear-to-bl text-white relative overflow-hidden transition hover:scale-[1.02] ',
            bankThemes[acc.value] || ' from-gray-600 via-white/10 to-gray-800',
            acc.is_available
              ? 'shadow-green-500/30 shadow-lg'
              : 'shadow-red-500/20 shadow-inner',
          ]"
        >
          <!-- Glass effect -->
          <div class="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>
          <!-- Chip -->
          <div
            class="w-10 h-7 rounded mb-4"
            :class="acc.value === 'wavePay' ? 'bg-sky-500' : 'bg-yellow-500'"
          ></div>
          <div class="relative z-10 space-y-3">
            <p class="text-xs opacity-70 uppercase tracking-widest">
              {{ acc.label }}
            </p>
            <p class="text-xl tracking-widest font-semibold">
              **** **** **** {{ acc.account_number?.slice(-4) }}
            </p>
            <div class="flex justify-between items-end">
              <p class="text-sm">{{ acc.account_name }}</p>
              <p class="text-xs opacity-70">
                {{ moment(acc.created_at).format("MM/YY") }}
              </p>
            </div>
            <div class="flex gap-2 mt-4">
            </div>
          </div>
          <div class="absolute top-3 right-3">
            <span
              class="text-xs px-2 py-1 rounded-full font-semibold"
              :class="acc.is_available ? 'bg-green-500/80' : 'bg-red-500/80'"
            >
              {{ acc.is_available ? "Active" : "Disabled" }}
            </span>
          </div>
        </div>
      </div>
    </section>
     <section
        class="mt-6 p-4 rounded-2xl bg-linear-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl"
      >
        <p class="text-center font-semibold mb-4">
          {{ t("need_help") }}
        </p>

        <div class="flex justify-center gap-5">
          <!-- Support -->
          <div
            class="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shadow-md"
          >
            <Headset class="text-black" />
          </div>

          <!-- Socials -->
          <img
            :src="viber"
            class="w-10 h-10 hover:scale-110 transition cursor-pointer"
          />
          <img
            :src="telegram"
            class="w-10 h-10 hover:scale-110 transition cursor-pointer"
          />
          <img
            :src="discord"
            class="w-10 h-10 hover:scale-110 transition cursor-pointer"
          />
        </div>
      </section>
  </main>
</template>
<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useBankStore } from "@/stores/bank";
import { storeToRefs } from "pinia";
import Button from "@/components/ui/button/Button.vue";
import moment from "moment";
import type { BankAccountPros } from "@/utils/types";
import { Headset, PlusIcon } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";
import { paymentMethod, paymentMethodOption } from "@/consts";
import { useClipboard } from "@vueuse/core";
import { toast } from "vue-sonner";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { bankThemes, openChat } from "@/utils";
import LanguageBtn from "@/components/languageBtn.vue";
import BankAccountDrawer from "@/components/bankAccountDrawer.vue";

const { copy } = useClipboard();
const copyAccount = (num: string) => {
  copy(num);
  toast.success(t("copied: ") + num);
};
const bankStore = useBankStore();
const { filteredAccounts, loading, selectedPayment } = storeToRefs(bankStore);

const showDialog = ref(false);
const isEdit = ref(false);
const selectedId = ref<number | null>(null);

const form = ref<BankAccountPros>({
  label: "",
  value: "",
  tag: 1,
  account_number: "",
  account_name: "",
  is_available: true,
});

onMounted(() => {
  bankStore.fetchAccounts();
});

const openAdd = () => {
  isEdit.value = false;
  showDialog.value = true;
  form.value = {
    label: "",
    value: "",
    tag: 1,
    account_number: "",
    account_name: "",
    is_available: true,
  };
};
const getPaymentIcon = (accountName: string) => {
  return paymentMethod.find((e) => e.value === accountName);
};
const openEdit = (acc: any) => {
  isEdit.value = true;
  selectedId.value = acc.id;
  form.value = { ...acc };
  showDialog.value = true;
};

const saveAccount = async () => {
  if (isEdit.value && selectedId.value) {
    await bankStore.updateAccount(selectedId.value, form.value);
  } else {
    if (form.value.account_number.length < 5) {
      toast.error("Account number must be at least 5 characters long");
      return;
    }
    if (form.value.account_name.length < 3) {
      toast.error("Account name must be at least 3 characters long");
      return;
    }
    if (!form.value.value) {
      toast.error("Please select a payment method");
      return;
    }
    await bankStore.addAccount(form.value);
  }
  showDialog.value = false;
};
const { t } = useI18n();
const deleteAccount = async (id: number) => {
  if (!confirm("Are you sure you want to delete this account?")) return;
  await bankStore.deleteAccount(id);
};
</script>

<template>
  <main class="w-full bg-gray-900 min-h-screen text-white">
    <CustomNavBar title="bank_accounts" backTo="/user/profile">
      <template #right>
        <button @click="openChat">
          <Headset class="w-6 h-6" />
        </button>
        <LanguageBtn />
      </template>
    </CustomNavBar>
    <aside class="py-2">
      <div
        class="w-full p-2 relative flex justify-between gap-2 overflow-x-auto no-scrollbar scroll-smoot"
      >
        <div v-for="payment in paymentMethodOption" class="relative">
          <div
            @click="bankStore.setFilter(payment.value)"
            class="px-3 h-10 rounded-full flex items-center justify-center border cursor-pointer"
            :class="
              payment.value === selectedPayment
                ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                : 'bg-gray-800/20 border-gray-700/50 text-gray-300 '
            "
          >
            <p
              class="text-nowrap font-bold active-button text-md capitalize"
            >
              {{ payment.label }}
            </p>
          </div>
        </div>
      </div>
    </aside>
    <section class="max-w-6xl w-full px-4">
      <template v-if="loading" class="text-center text-gray-500">
        <Skeleton class="h-6 w-1/3 mx-auto mb-4" />
        <Skeleton class="h-40 w-full mb-4" />
        <Skeleton class="h-40 w-full mb-4" />
        <Skeleton class="h-40 w-full mb-4" />
      </template>
      <template v-else class="">
        <div class="grid md:grid-cols-3 gap-5" v-if="filteredAccounts">
          <div
            v-for="acc in filteredAccounts"
            :key="acc.id"
            :class="[
              'p-5 rounded-2xl shadow-xl bg-linear-to-bl text-white relative overflow-hidden transition hover:scale-[1.02] ',
              bankThemes[acc.value] ||
                ' from-gray-600 via-white/10 to-gray-800',
             
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
              <p
                class="text-xl tracking-widest font-semibold"
                @click="copyAccount(acc.account_number)"
              >
                **** **** **** {{ acc.account_number.slice(-4) }}
              </p>
              <div class="flex justify-between items-end">
                <p class="text-sm">{{ acc.account_name }}</p>
                <p class="text-xs opacity-70">
                  {{ moment(acc.created_at).format("MM/YY") }}
                </p>
              </div>
              <div class="flex justify-between items-center mt-4">
                <div class="flex gap-2">
                  <Button
                    size="sm"
                    class="bg-white text-black"
                    @click="openEdit(acc)"
                  >
                    {{ t("edit") }}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    @click="deleteAccount(acc.id)"
                  >
                    {{ t("delete") }}
                  </Button>
                </div>
              </div>
            </div>
           <div
                class="absolute top-3 right-3 overflow-hidden rounded-lg p-2 bg-white/10 backdrop-blur-2xl"
              >
                <img
                  class="w-8 h-8 rounded-sm"
                  :src="getPaymentIcon(acc.value)?.icon"
                  :alt="acc.label"
                />
              </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 mt-10">
          <p class="text-lg">{{ t("no_bank_accounts") }}</p>
        </div>
        <div class="w-full my-10">
          <div
            @click="openAdd"
            class="border-2 border-gray-500/20 h-40 cursor-pointer w-full flex flex-col justify-center items-center rounded-2xl shadow-inner text-white relative overflow-hidden bg-gray-800/20"
          >
            <PlusIcon class="w-16 h-16" />
             <p class="text-lg text-gray-300 font-semibold">{{ t("add_bank_account") }}</p>
          </div>
        </div>
      </template>
    </section>
    <!-- <div class="fixed bottom-0 right-0 left-0 bg-gray-900/20 backdrop-blur-2xl p-4">
      <button class="gold-bg w-full">

      </button>
    </div> -->
    <BankAccountDrawer
      v-model:open="showDialog"
      v-model:modelValue="form"
      :isEdit="isEdit"
      @save="saveAccount"
    />
  </main>
</template>

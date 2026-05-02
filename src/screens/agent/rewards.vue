<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';
import { getAllTransactionsByUserId } from '../../services/transactionAPI';
import DatePicker from "@/components/CalenderView.vue";
import type { Transaction } from '@/utils/types';
import moment from 'moment';
import { useI18n } from 'vue-i18n';
import CustomNavBar from '@/components/layout/customNavBar.vue';
import { openChat } from '@/utils';
import LanguageBtn from '@/components/languageBtn.vue';
import Button from '@/components/ui/button/Button.vue';
import { Headset, SearchIcon } from 'lucide-vue-next';
const authStore = useAuthStore();
const transactions_local = ref<Transaction[]>([]);
const loading = ref(true);
const page = ref(1);
const limit = 20;
const totalPages = ref(1);
const transactionType = ref("bonus");
const startDate = ref();
const {t} = useI18n();
const endDate = ref();
const fetchTransaction = async () => {
        if (!authStore.user?.agent_id){
        // toast.error("ERROR")
        return 
    }
    loading.value = true
    
    const res = await getAllTransactionsByUserId({
        page: page.value,
        limit,
        type: transactionType.value || 'all',
        startDate:startDate.value,
        endDate:endDate.value,
        user_id:authStore.user?.id
    });
    console.log("res", res.data);
    transactions_local.value = res?.data;
    totalPages.value = res.totalPages;
    loading.value = false
};
onMounted(() => {
    fetchTransaction()
});

</script>
<template>
        <CustomNavBar title="reward_center" backTo="/user/profile">
    <template #right>

      <button
        v-on:click="openChat">
        <Headset class="w-6 h-6 text-yellow-400" />
      </button>
      <LanguageBtn/>
    </template>
  </CustomNavBar>
  <div class="space-y-4 p-4 w-full min-h-screen">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold tracking-wide">
        {{ t('rewards') }}
      </h1>

      <span class="text-sm text-gray-400">
        {{ t("page") }} {{ page }} / {{ totalPages }}
      </span>
    </div>

    <!-- Filters -->
    <div class="bg-[#0f172a] border glass-bg border-white/5 rounded-2xl p-4 space-y-3">

      <!-- Date Range -->
      <div class="flex gap-2 justify-center">
         <DatePicker v-model="startDate" :placeholder="t('start_date')" />
        <DatePicker v-model="endDate" :placeholder="t('end_date')" />
         
      </div>
       <Button :disabled="!startDate || !endDate" @click="startDate && endDate && fetchTransaction()"
                        class="w-full flex items-center justify-center h-8 rounded-lg text-lg gold-bg active-button text-gray-900 hover:bg-amber-400">
                        <SearchIcon/>
                        <p>{{ t('search') }}</p>
        </Button>
      <!-- Type Filter -->
      

    </div>

    <!-- Transaction List -->
    <div class="bg-[#0f172a] glass-bg border border-white/5 rounded-2xl overflow-hidden">

      <div
        v-for="tx in transactions_local"
        :key="tx.id"
        class="flex items-center justify-between px-4 py-4 border-b border-white/5 last:border-none hover:bg-white/5 transition"
      >

        <!-- Left -->
        <div class="flex items-center gap-3">

          <!-- Icon -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
            :class="tx.type === 'deposit'||tx.type==='bonus'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'"
          >
            {{ tx.type === 'deposit'|| tx.type ==='bonus' ? '+' : '-' }}
          </div>

          <!-- Info -->
          <div class="flex flex-col">
            <span class="text-xs font-medium">{{ tx.txn_id }}</span>
            <span class="text-xs text-gray-400 capitalize">
              {{ t(tx.type) }}
            </span>
          </div>

        </div>

        <!-- Right -->
        <div class="text-right">
          <div
            class="text-md font-semibold"
            :class="tx.type === 'deposit' || tx.type==='bonus' ? 'text-green-400' : 'text-red-400'"
          >
            {{ tx.type === 'deposit' || tx.type==='bonus'? '+' : '-' }}{{ tx.amount }}
          </div>

          <div class="text-xs text-gray-400">
           {{ moment(tx.created_at).format("DD/MM/YY hh:mm A") }}
          </div>
        </div>

      </div>

    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center text-sm text-gray-400">
      <button class="pagination-btn">{{ t('prev') }}</button>
      <button class="pagination-btn">{{ t('next') }}</button>
    </div>

  </div>
</template>
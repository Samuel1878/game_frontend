<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useBankStore } from '@/stores/bank'
import { storeToRefs } from 'pinia'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import Button from '@/components/ui/button/Button.vue'
import moment from 'moment'
import type { BankAccountPros } from '@/utils/types'
import { ChevronDown, CreditCard, PlusIcon, UserLockIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import InputGroup from '@/components/ui/input-group/InputGroup.vue'
import InputGroupInput from '@/components/ui/input-group/InputGroupInput.vue'
import InputGroupAddon from '@/components/ui/input-group/InputGroupAddon.vue'
import InputGroupText from '@/components/ui/input-group/InputGroupText.vue'
import { paymentMethod } from '@/consts'
import { useClipboard } from "@vueuse/core";
import { toast } from 'vue-sonner'
const bankThemes: Record<string, string> = {
    kbzPay: "from-white/50 via-blue-500 to-blue-400/20",
    wavePay: "from-yellow-500/90 via-yellow-500/80 to-yellow-400/100",
    ayaPay: "from-orange-600/40 via-red-500 to-red-400/10",
    cbPay: "from-red-600 via-rose-500 to-pink-500",
};
const { copy } = useClipboard();

const copyAccount = (num: string) => {
    copy(num);
    toast.success("Copied!");
};
const bankStore = useBankStore()
const { accounts, loading } = storeToRefs(bankStore)

const showDialog = ref(false)
const isEdit = ref(false)
const selectedId = ref<number | null>(null)

const form = ref<BankAccountPros>({
    label: '',
    value: '',
    tag: 1,
    account_number: '',
    account_name: '',
    is_available: true
})

onMounted(() => {
    bankStore.fetchAccounts()
})

const openAdd = () => {
    isEdit.value = false
    showDialog.value = true
    form.value = { label: '', value: '', tag: 1, account_number: '', account_name: '', is_available: true }
}

const openEdit = (acc: any) => {
    isEdit.value = true
    selectedId.value = acc.id
    form.value = { ...acc }
    showDialog.value = true
}

const saveAccount = async () => {
    if (isEdit.value && selectedId.value) {
        await bankStore.updateAccount(selectedId.value, form.value)
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
        await bankStore.addAccount(form.value)
    }
    showDialog.value = false
}
const { t } = useI18n()
const deleteAccount = async (id: number) => {
    if (!confirm("Are you sure you want to delete this account?")) return;
    await bankStore.deleteAccount(id);
};
watch(() => form.value.value, (val) => {
    const found = paymentMethod.find(p => p.value === val);
    if (found) {
        form.value.label = found.label;
    }
});
</script>

<template>
    <main class="w-full bg-gray-950 min-h-screen text-white ">
        <div class="flex justify-between max-w-6xl w-full items-center my-6 px-4">
            <h1
                class="text-2xl font-bold text-transparent bg-linear-to-tl from-gray-800 via-sky-300 to-gray-900 bg-clip-text">
                {{ t('bank_accounts') }}</h1>
            <Button @click="openAdd">

                {{ t('add_account') }}
                <PlusIcon class="text-white" />
            </Button>
        </div>

        <!-- Cards -->
        <section class="max-w-6xl w-full px-4">
            <template v-if="loading" class="text-center text-gray-500">
                <Skeleton class="h-6 w-1/3 mx-auto mb-4" />
                <Skeleton class="h-40 w-full mb-4" />
                <Skeleton class="h-40 w-full mb-4" />
                <Skeleton class="h-40 w-full mb-4" />
            </template>
            <template v-else class="">
                <div class="grid md:grid-cols-3 gap-5" v-if="accounts">
                    <div v-for="acc in accounts" :key="acc.id" :class="[
                        'p-5 rounded-2xl shadow-xl bg-linear-to-bl text-white relative overflow-hidden transition hover:scale-[1.02] ',
                        bankThemes[acc.value] || ' from-gray-600 via-white/10 to-gray-800',
                        acc.is_available
                            ? 'shadow-green-500/30 shadow-lg'
                            : 'shadow-red-500/20 shadow-inner'

                    ]">
                        <!-- Glass effect -->
                        <div class="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>
                        <!-- Chip -->
                        <div class="w-10 h-7 rounded mb-4" :class="acc.value==='wavePay'?'bg-sky-500':'bg-yellow-500'">
                            
                        </div> 
                        <div class="relative z-10 space-y-3">
                            <p class="text-xs opacity-70 uppercase tracking-widest">
                                {{ acc.label }}
                            </p>
                            <p class="text-xl tracking-widest font-semibold" @click="copyAccount(acc.account_number)">
                                **** **** **** {{ acc.account_number?.slice(-4) }}
                            </p>
                            <div class="flex justify-between items-end">
                                <p class="text-sm">{{ acc.account_name }}</p>
                                <p class="text-xs opacity-70">
                                    {{ moment(acc.created_at).format("MM/YY") }}
                                </p>
                            </div>
                            <div class="flex gap-2 mt-4">
                                <Button size="sm" class="bg-sky-400" @click="openEdit(acc)">
                                    Edit
                                </Button>
                                <Button size="sm" variant="destructive" @click="deleteAccount(acc.id)">
                                    Delete
                                </Button>
                            </div>
                        </div>
                        <div class="absolute top-3 right-3">
                            <span class="text-xs px-2 py-1 rounded-full font-semibold"
                                :class="acc.is_available ? 'bg-green-500/80' : 'bg-red-500/80'">
                                {{ acc.is_available ? 'Active' : 'Disabled' }}
                            </span>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center text-gray-500 mt-10">
                    <p class="text-lg">{{ t('no_bank_accounts') }}</p>
                </div>
                <div class="w-full mt-10">
                    <div @click="openAdd" class="border-2 border-gray-600 h-40 cursor-pointer w-full flex justify-center items-center rounded-2xl shadow-inner text-white relative overflow-hidden
                        bg-linear-to-tl from-gray-800/10 via-gray-700/10 to-gray-800/10">
                        <PlusIcon class="w-16 h-16" />
                    </div>

                </div>

            </template>

        </section>
        <!-- Dialog -->
        <Dialog v-model:open="showDialog">
            <DialogContent
                class="p-6 bg-gray-900 
        bg-linear-to-br from-white/5 via-white/10 to-white/5
        backdrop-blur-2xl border-2 border-white/10
        shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-white rounded-3xl w-full max-w-sm">
                <DialogHeader>
                    <DialogTitle>
                        {{ isEdit ? t('edit_bank_account') : t('add_bank_account') }}
                    </DialogTitle>
                </DialogHeader>

                <div class="space-y-3 mt-4">
                    <Select v-model="form.value">
                        <SelectTrigger
                            class="w-full h-12 text-md py-6 rounded-lg font-bold border border-gray-700 ring-sky-400 ring-0 bg-gray-700/50">
                            <SelectValue :placeholder="t('choose_payment_method')" />
                            <ChevronDown />
                        </SelectTrigger>
                        <SelectContent class="bg-gray-700">
                            <SelectGroup>
                                <SelectLabel>{{ t('payment_method') }}</SelectLabel>
                                <SelectItem v-for="item in paymentMethod" :key="item.id" :value="item.value">
                                    <div class="flex items-center gap-2 py-2">
                                        <img :src="item.icon" alt="logo" class="w-8 h-8 object-cover rounded-full" />
                                        <span>{{ item.label }}</span>
                                    </div>
                                </SelectItem>

                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <InputGroup
                        class="h-12 rounded-lg w-full font-bold border border-gray-700 ring-sky-400 ring-0 bg-gray-700/50">
                        <InputGroupAddon>
                            <CreditCard class="text-gray-300" />
                        </InputGroupAddon>
                        <InputGroupInput class="w-full" v-model="form.account_number" type="text"
                            :placeholder="t('account_number')" />
                        <InputGroupAddon align="inline-end">
                            <InputGroupText class="text-gray-100"></InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                    <InputGroup
                        class="h-12 rounded-lg w-full font-bold border border-gray-700 ring-sky-400 ring-0 bg-gray-700/50">
                        <InputGroupAddon>
                            <UserLockIcon class="text-gray-300" />
                        </InputGroupAddon>
                        <InputGroupInput class="w-full" v-model="form.account_name" type="text"
                            :placeholder="t('account_name')" />
                        <InputGroupAddon align="inline-end">
                            <InputGroupText class="text-gray-100"></InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                    <div class="flex items-center justify-between mt-2">
                        <span class="text-sm text-gray-300">
                            {{ t('account_active') }}
                        </span>

                        <button type="button" @click="form.is_available = !form.is_available"
                            class="w-12 h-6 rounded-full transition relative"
                            :class="form.is_available ? 'bg-green-500' : 'bg-gray-600'">
                            <span class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition"
                                :class="form.is_available ? 'translate-x-6' : ''" />
                        </button>
                    </div>
                </div>

                <DialogFooter class="mt-4">
                    <Button @click="showDialog=false">Cancel</Button>
                    <Button class="bg-sky-400 h-12 rounded-lg font-bold" @click="saveAccount">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </main>
</template>

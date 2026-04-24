<script setup lang="ts">
import { ref } from "vue";
import { bindPhone, requestOTP, verifyOTP } from "@/services/authAPI";
import ApplyBreadCrumb from "@/components/breadcrumb/index.vue"
import { useI18n } from "vue-i18n";
import InputGroup from "@/components/ui/input-group/InputGroup.vue";
import InputGroupAddon from "@/components/ui/input-group/InputGroupAddon.vue";
import InputGroupInput from "@/components/ui/input-group/InputGroupInput.vue";
import InputGroupText from "@/components/ui/input-group/InputGroupText.vue";
import { PhoneCallIcon, PhoneIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";
import Label from "@/components/ui/label/Label.vue";
import Button from "@/components/ui/button/Button.vue";
import InputOTP from "@/components/ui/input-otp/InputOTP.vue";
import InputOTPGroup from "@/components/ui/input-otp/InputOTPGroup.vue";
import InputOTPSlot from "@/components/ui/input-otp/InputOTPSlot.vue";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "vue-input-otp";

const { t } = useI18n();
const phone = ref("");
const emit = defineEmits(["success"]);
const props = defineProps<{ phone: string }>();
const code = ref("");

const isSent = ref(false);
const backHandler = () => {
  isSent.value = false;
}
const sendOTP = async () => {
  const response = await requestOTP(phone.value);
  if (response) {
    isSent.value = true
    toast.success(t("we_have_sent_otp_code_to_your_phone_number"));
    return
  } 
  toast.error(response?.message || t("something_went_wrong"))
};
const onVerified = async () => {
  await bindPhone(phone.value);
  toast.success("Phone verified!");
};
const submit = async () => {
 const response = await verifyOTP(phone.value, code.value);
  if (response) await onVerified();
};
const breadcrumbs = [
  { label: "profile", to: "/user/profile" },
  { label: "phone_verification" },
];
</script>

<template>
  <main class="p-4 min-h-screen w-full">
    <ApplyBreadCrumb :items="breadcrumbs" />
    <div class="flex flex-col justify-between w-full">
      <section
        class="p-4 gap-4 w-full flex flex-col rounded-2xl bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">


        <div class="flex justify-center items-center  flex-col h-20 border border-sky-400/10 rounded-2xl">
          <PhoneCallIcon :size="40" />
        </div>
        <div v-if="!isSent">
          <div class="space-y-2">
            <Label>
              {{ t('enter_phone_number') }}
            </Label>
            <InputGroup
              class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-sky-400 ring-0 bg-gray-700/50">

              <InputGroupAddon>
                <PhoneIcon />
              </InputGroupAddon>

              <InputGroupInput class="w-full" v-model="phone" type="text" placeholder="09xxxxxxxxx" />
              <InputGroupAddon align="inline-end">
                <InputGroupText class="text-gray-100"></InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>

        </div>
        <div v-else>
          <div class="space-y-2">
            <Label>
              {{ t("enter_otp") }}
            </Label>
            <InputOTP :maxlength="4" :pattern="REGEXP_ONLY_DIGITS_AND_CHARS" v-model="code">
              <InputOTPGroup class="w-full flex font-extrabold text-2xl text-sky-300 ">
                <InputOTPSlot :index="0" class="flex-1 h-12" />
                <InputOTPSlot :index="1" class="flex-1 h-12" />
                <InputOTPSlot :index="2" class="flex-1 h-12" />
                <InputOTPSlot :index="3" class="flex-1 h-12" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div class="flex justify-between items-center">
            <!-- <Button>

            </Button> -->
          </div>
        </div>
        
      </section>
      <div class="fixed bottom-0 right-0 left-0 p-4">
        <div class="space-y-4" v-if="isSent">
           <Button @click="backHandler"
          class="w-full h-12 rounded-xl bg-linear-to-r from-sky-400/20 to-sky-600/20 border border-sky-500/30 text-sky-400 font-semibold hover:from-sky-500/30 hover:to-sky-600/30 active:scale-[0.98] transition flex items-center justify-center gap-2">
          {{ t("back") }}
        </Button>
 <Button @click="submit"
         
          class="w-full h-12 rounded-xl bg-linear-to-r from-sky-400/20 to-sky-600/20 border border-sky-500/30 text-sky-400 font-semibold hover:from-sky-500/30 hover:to-sky-600/30 active:scale-[0.98] transition flex items-center justify-center gap-2">
          {{ t("submit") }}
        </Button>
        </div>
        
        <Button @click="sendOTP"
          v-else
          class="w-full h-12 rounded-xl bg-linear-to-r from-sky-400/20 to-sky-600/20 border border-sky-500/30 text-sky-400 font-semibold hover:from-sky-500/30 hover:to-sky-600/30 active:scale-[0.98] transition flex items-center justify-center gap-2">
          {{ t("next") }}
        </Button>
      </div>

    </div>

  </main>
</template>
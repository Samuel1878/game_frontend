<!-- <script setup lang="ts">
import { reactive, ref } from 'vue'
import { login, register } from '../services/authAPI'
import { useRouter } from 'vue-router'
import { Input } from '../components/ui/input'

const router = useRouter()

const isLogin = ref(true)
const error = ref('')

const form = reactive({
  username: '',
  password: '',
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  form.username = ''
  form.password = ''
}

const handleSubmit = async () => {
  error.value = ''

  try {
    if (isLogin.value) {
      const res = await login(form)
      localStorage.setItem('token', res.token)
      router.push('/')
    } else {
      await register(form)
      isLogin.value = true
    }
  } catch (err: any) {
    error.value =
      err.response?.data?.message || 'Authentication failed'
  }
}
</script> -->
<!-- <script setup lang="ts">
import { ref } from 'vue'

// shadcn/vue components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const isLogin = ref(true)

const form = ref({
  username: '',
  email: '',
  password: '',
})

const submit = () => {
  if (isLogin.value) {
    // LOGIN API
    console.log('Login', form.value)
  } else {
    // REGISTER API
    console.log('Register', form.value)
  }
}
</script> -->
<!-- <template>
  <div class="flex min-h-screen justify-center bg-gray-950 px-4">
    <Card class="w-full max-w-md bg-gray-900 text-gray-100 border-gray-800">
      <CardHeader class="space-y-1 text-center">
        <CardTitle class="text-2xl font-bold text-yellow-400">
          🎰 96 Online Casino
        </CardTitle>
        <CardDescription class="text-gray-400">
          {{ isLogin ? 'Sign in to your account' : 'Create a new account' }}
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <form @submit.prevent="submit" class="space-y-4">
          
 
          <div v-if="!isLogin" class="space-y-1">
            <Label for="username">Username</Label>
            <Input
              id="username"
              v-model="form.username"
              placeholder="yourname"
            />
          </div>


          <div class="space-y-1">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              v-model="form.email"
              placeholder="you@email.com"
              required
            />
          </div>


          <div class="space-y-1">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              v-model="form.password"
              placeholder="••••••••"
              required
            />
          </div>

  
          <Button type="submit" class="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-400">
            {{ isLogin ? 'Login' : 'Register' }}
          </Button>
        </form>


        <div class="text-center text-sm text-gray-400">
          <span>
            {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
          </span>
          <button
            type="button"
            class="ml-1 text-yellow-400 hover:underline"
            @click="isLogin = !isLogin"
          >
            {{ isLogin ? 'Register' : 'Login' }}
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
</template> -->
<!-- <script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const auth = useAuthStore()

const open = ref(false)
const isLogin = ref(true)

const form = ref({
  username: '',
  email: '',
  phone: '',
  password: '',
})

const submit = async () => {
  if (isLogin.value) {
    await auth.login({
      email: form.value.email || undefined,
      phone: form.value.phone || undefined,
      password: form.value.password,
    })
  } else {
    await auth.register({
      username: form.value.username,
      email: form.value.email || undefined,
      phone: form.value.phone || undefined,
      password: form.value.password,
    })
  }
  open.value = false
}
</script>

<template>
  <Dialog v-model:open="open">
    <Button @click="open = true" variant="outline">
      {{ auth.isLoggedIn ? 'Account' : 'Login / Register' }}
    </Button>

    <DialogContent class="bg-gray-900 border-gray-800 text-gray-100">
      <DialogHeader>
        <DialogTitle class="text-yellow-400">
          {{ isLogin ? 'Login' : 'Register' }}
        </DialogTitle>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="submit">
        <div v-if="!isLogin">
          <Label>Username</Label>
          <Input v-model="form.username" />
        </div>

        <div>
          <Label>Email (optional)</Label>
          <Input v-model="form.email" type="email" />
        </div>

        <div>
          <Label>Phone (optional)</Label>
          <Input v-model="form.phone" />
        </div>

        <div>
          <Label>Password</Label>
          <Input v-model="form.password" type="password" required />
        </div>

        <Button class="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-400">
          {{ isLogin ? 'Login' : 'Register & Login' }}
        </Button>
      </form>

      <div class="text-center text-sm text-gray-400">
        {{ isLogin ? "Don't have an account?" : 'Already have one?' }}
        <button class="text-yellow-400 ml-1" @click="isLogin = !isLogin">
          {{ isLogin ? 'Register' : 'Login' }}
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template> -->
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
import { useRouter } from "vue-router";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref } from "vue";
// import { Tabs } from "@/components/ui/tabs";
import { X } from "lucide-vue-next";
const auth = useAuthStore();
const ui = useUIStore();
const router = useRouter();

const { authModalOpen, redirectAfterAuth } = storeToRefs(ui);
const isLogin = ref(true);
const form = ref({
  username: "",
  // email: "",
  // phone: "",
  password: "",
  conPassword: "",
});

const submit = async () => {
  if (isLogin.value) {
    await auth.login({
      name:form.value.username,
      password: form.value.password,
    });
  } else {
    await auth.register({
      name: form.value.username,
      password: form.value.password,
    });
  }

  ui.closeAuthModal();

  // 🔁 Resume original navigation
  if (redirectAfterAuth.value) {
    router.push(redirectAfterAuth.value);
  }
};
</script>

<template>
  <Dialog v-model:open="authModalOpen">
    <DialogContent :show-close-button="false" class="bg-gray-900 border-gray-800 text-gray-100 rounded-2xl">
      <DialogHeader>
        <DialogTitle class="text-gray-100 my-4">
          {{ isLogin ? "Login" : "Register" }}
        </DialogTitle>
        <button class="absolute right-5 top-5 cursor-pointer"  @click="ui.closeAuthModal()">
          <X/>
        </button>
      </DialogHeader>
      <!-- <Tabs default-value="userName"> -->
        <!-- <TabsList class="bg-gray-900 w-full h-12 rounded-full border-3 overflow-hidden border-gray-800">
          <TabsTrigger value="userName"  class="bg-gray-800 h-12 cursor-pointer text-amber-300 rounded-l-full"> User Name </TabsTrigger>
          <TabsTrigger value="phone" class="cursor-pointer w-full h-12 bg-gray-800 text-amber-300"> Phone </TabsTrigger>
          <TabsTrigger value="email" class="cursor-pointer ring-0 h-12 w-full bg-gray-800 text-amber-300 rounded-r-full outline-0">Email</TabsTrigger>
        </TabsList> -->

        <form class="space-y-4" @submit.prevent="submit">
          <!-- <TabsContent value="userName" class="space-y-2"> -->
            <Label>Username</Label>
            <Input v-model="form.username" class="ring-0 rounded-3xl h-12  " />
          <!-- </TabsContent> -->

          <!-- <TabsContent value="email" class="space-y-2 ">
            <Label>Email</Label>
            <Input v-model="form.email" class="rounded-3xl h-12  "/>
          </TabsContent>

          <TabsContent value="phone" class="space-y-2">
            <Label>Phone</Label>
            <Input v-model="form.phone" class="rounded-3xl h-12  "/>
          </TabsContent> -->

          <div  class="space-y-2">
            <Label>Password</Label>
            <Input type="password" v-model="form.password" required class="rounded-3xl h-12  "/>
          </div>
          <div v-show="!isLogin"  class="space-y-2">
            <Label>Confirm password</Label>
            <Input type="conPassword" v-model="form.conPassword" class="rounded-3xl h-12  "/>
          </div>

          <Button
            class="w-full bg-red-600 mt-4 text-gray-100 cursor-pointer rounded-3xl h-12 hover:bg-red-600"
          >
            {{ isLogin ? "Login" : "Register" }}
          </Button>
        </form>

        <div class="text-center text-sm text-gray-400">
          {{ isLogin ? "Don't have an account?" : "Already have one?" }}
          <button class="ml-1 text-red-600 cursor-pointer" @click="isLogin = !isLogin">
            {{ isLogin ? "Register" : "Login" }}
          </button>
        </div>
      <!-- </Tabs> -->
    </DialogContent>
  </Dialog>
</template>

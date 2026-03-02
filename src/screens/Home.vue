<script lang="ts" setup>
import type { Game } from "@/utils/types";
import { computed, ref, watch } from "vue";
import type { CarouselApi } from "@/components/ui/carousel";
import { refDebounced } from "@vueuse/core";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth";
import {
  gameOption,
  gameProviders,
  homeSlide,
  hotGames,
  RTPGames,
  topGames,
  topTableGames,
} from "@/consts";
import { sboGames } from "@/consts/sboGames";
import {
  ArrowLeft,
  ArrowRight,
  Coins,
  CrownIcon,
  GoalIcon,
  SearchIcon,
  Users2Icon,
} from "lucide-vue-next";
import ScrollViews from "@/components/scrollViews.vue";
import { arcadeGames } from "@/consts/games";
import GameViews from "@/components/gameViews.vue";
import { pragmaticPlayGames } from "@/consts/pragmaticGames";
import ProviderOptions from "@/components/providerOptions.vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from "vue-sonner";
import { gameStore } from "@/stores/game";
import { africanBuffaloSlots } from "@/consts/afbGames";
import { enterGameAPI } from "@/services/gameAPI";
import CarouselPrevious from "@/components/ui/carousel/CarouselPrevious.vue";
import CarouselNext from "@/components/ui/carousel/CarouselNext.vue";
import Button from "@/components/ui/button/Button.vue";
import Footer from "@/components/footer.vue";
import router from "@/router";

const gameType = ref<string>("lobby");
  const searchQuery = ref<string>("");
const debouncedSearch = refDebounced(searchQuery, 300);
const selectedProvider = ref<{name:string, GpId:number}>({name:"", GpId:0});
const authStore = useAuthStore();
const useGameStore = gameStore();
let games = ref<Game[] | null>(sboGames);
const api = ref<CarouselApi | null>(null);
const current = ref(0);
const totalCount = ref(0);
const plugin = Autoplay({
  delay: 3000,
  stopOnMouseEnter: true,
  stopOnInteraction: false,
})
function setApi(val: CarouselApi) {
  api.value = val;
}
const filteredSlotGames = computed(() => {
  const search = debouncedSearch.value.toLowerCase();
  return gameProviders
    .filter(provider =>
      provider.GpId === selectedProvider.value.GpId
    )
    .flatMap(provider =>
      provider.game.filter(game =>
        !search ||
        game.gameInfos[0]?.gameName.toLowerCase().includes(search)
      )
    ).sort((a, b)=>a.rank - b.rank);
});
watch(
  api,
  (embla) => {
    if (!embla) return;

    totalCount.value = embla.scrollSnapList().length;
    current.value = embla.selectedScrollSnap() + 1;

    const onSelect = () => {
      current.value = embla.selectedScrollSnap() + 1;
    };

    embla.on("select", onSelect);

    // Cleanup when component unmounts
    return () => {
      embla.off("select", onSelect);
    };
  },
  { immediate: true },
);
console.log("user", authStore.user);
watch(api, (val) => {
  console.log("Embla API:", val);
});
const enterGame = async (game: Game) => {
  if (!game) return;

  if (!authStore.isLoggedIn || !authStore.user) {
    toast("Please login to enter the game");
    // ui.openAuthModal("/");
    return;
  }

  try {
    const data = await enterGameAPI({
      userName: authStore.user.name ?? "",
      gameId: game.gameID,
      gpId: game.gameProviderId,
    });

    if (!data?.url) {
      toast("Failed to launch game");
      return;
    }

    useGameStore.setGames(game);

    const launchUrl =
      `${data.url}` +
      `&gpid=${game.gameProviderId}` +
      `&gameid=${game.gameID}` +
      `&lang=en&device=m&betCode=`;

    // External redirect
    window.location.href = launchUrl;

  } catch (error) {
    console.error(error);
    toast("Something went wrong");
  }
};
const setProvider = (name:string, GpId:number)=>{
    selectedProvider.value.name=name ; 
    selectedProvider.value.GpId=GpId
}

const chooseOption = (value: string) => (gameType.value = value);

const scrollEl = ref<HTMLElement | null>(null);

const scroll = (dir: "left" | "right") => {
  if (!scrollEl.value) return;

  const amount = 200;
  scrollEl.value.scrollBy({
    left: dir === "left" ? -amount : amount,
    behavior: "smooth",
  });
};

</script>
<template>
  <main class="bg-slate-950 max-w-6xl w-full flex justify-between flex-col">
    <div>
      <div>
        <div class="w-full px-2">
          <Carousel
            class="relative w-full min-h-65 overflow-hidden"
            @init-api="setApi"
            :opts="{loop:true, align: 'start'}"
            :plugins="[plugin]"
            @mouseenter="plugin.stop"
            @mouseleave="[plugin.reset(), plugin.play(), console.log('Running')];"
          >
            <CarouselContent class="flex h-full">
              <CarouselItem
                v-for="(slide, index) in homeSlide"
                :key="index"
                class="h-60"
              >
                <Card
                  class="border-0 rounded-2xl bg-slate-900 h-full p-0 overflow-hidden"
                >
                  <CardContent
                    class="relative flex items-center justify-center h-full"
                    :style="{
                      backgroundImage: `url(${slide.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }"
                  >
                    <!-- <div class="absolute bottom-4 left-4 space-y-4">
                      <p class="text-sky-500 font-bold text-4xl">
                        {{ slide.title }}
                      </p>
                      <p class="text-gray-300 font-medium text-2xl">
                        {{ slide.description }}
                      </p>
                      <button
                        @click="claimBonus"
                        class="mt-6 h-10 px-4 bg-sky-600 rounded-lg text-white capitalize"
                      >
                        {{ slide.button }}
                      </button>
                    </div> -->
                  </CardContent>
                   <CarouselPrevious />
    <CarouselNext />
                </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      <div v-if="games" class="flex items-center w-full flex-col lg:grid">
        <div class="relative w-full mt-1 pl-2 pr-2 md:pl-10 flex">
          <!-- Left Arrow -->
          <button
            @click="scroll('left')"
            class="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-transparent hover:bg-slate-700/80 px-2 h-8 rounded-sm shadow-lg transition"
          >
            <ArrowLeft class="w-5 h-5 text-sky-400" />
          </button>

          <!-- Scroll Container -->
          <div
            ref="scrollEl"
            class="flex gap-2 bg-slate-950 items-center w-full overflow-x-auto no-scrollbar scroll-smooth"
          >
            <button
              v-for="(option, index) in gameOption"
              :key="index"
              @click="chooseOption(option.value)"
              class="shrink-0 flex flex-col peer-last:mr-4 gap-2 justify-center items-center text-sm whitespace-nowrap"
            >
              <Card
                class="border-0 bg-gray-800 px-2 py-2 hover:bg-gray-700 transition rounded-sm"
              >
                <CardContent class="flex items-center justify-center">
                  <span class="`text-xs font-semibold text-slate-200`">
                    {{ option.label }}
                  </span>
                </CardContent>
              </Card>
            </button>
          </div>

          <!-- Right Arrow -->
          <button
            @click="scroll('right')"
            class="absolute right-1 top-1/2 -translate-y-1/2 z-10 hover:bg-slate-700/70 bg-transparent p-2 rounded-sm shadow-lg transition"
          >
            <ArrowRight class="w-5 h-5 text-sky-400" />
          </button>
        </div>

        <section
          class="w-full h-full p-2"
          id="lobby"
          v-if="gameType === 'lobby'"
        >
          <ScrollViews
            :game-data="hotGames"
            header="Hot Games"
            :icon="CrownIcon"
            :handler="enterGame"
          />
          <ScrollViews
            :game-data="topGames"
            header="Top Picks"
            :icon="Users2Icon"
            :handler="enterGame"
          />
          <ScrollViews
            :game-data="RTPGames"
            header="Most Wins"
            :icon="Coins"
            :handler="enterGame"
          />
          <div class="w-full mt-4 rounded-sm bg-gray-800 h-25 flex justify-center items-center flex-col gap-2">
            <p>Get earn today</p>
            <Button class="bg-sky-500" @click="router.push('/deposit')">
              Deposit Now
            </Button>
          </div>
        </section>

        <section v-else-if="gameType === 'slots'" class="w-full h-full p-2">
          <aside class="flex justify-between items-center gap-2">
            <InputGroup class="border-sky-500 ring-sky-500 ring-0">
              <InputGroupInput placeholder="Search..." v-model="searchQuery" />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
           <ProviderOptions :provider-name="selectedProvider.name" :-gp-id="selectedProvider.GpId" :set-value="setProvider"/>
          </aside>

          <!-- <ScrollViews
            :game-data="topSlotGames"
            header="Top Slots"
            :icon="CrownIcon"
          /> -->
          <GameViews
            header="All Slots"
            :game-data="filteredSlotGames"
            :handler="enterGame"
          />
        </section>

        <section
          v-else-if="gameType === 'tableGames'"
          class="w-full h-full p-2"
        >
          <ScrollViews
            :game-data="topTableGames"
            header="Top Games"
            :icon="CrownIcon"
            :handler="enterGame"
          />
          <GameViews
            header="All Games"
            :game-data="pragmaticPlayGames"
            :handler="enterGame"
          />
        </section>
        <section
          v-else-if="gameType === 'arcadeGames'"
          class="w-full h-full p-2"
        >
          <!-- <ScrollViews
            :game-data="topTableGames"
            header="Top Games"
            :icon="CrownIcon"
          /> -->
          <GameViews
            header="Arcade Games"
            :game-data="arcadeGames"
            :handler="enterGame"
          />
        </section>
        <section class="w-full px-2">
                 <ScrollViews
            :game-data="africanBuffaloSlots"
            header="Best Provider"
            :icon="GoalIcon"
            :handler="enterGame"
          />
        </section>
        
      </div>
      <div v-else class="flex items-center flex-col lg:grid">
        <div
          class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4"
        >
          <div
            id="skeleton"
            class="w-full"
            v-for="(_, index) in 25"
            :key="index"
          >
            <Skeleton class="w-30 sm:35 h-45 rounded-2xl bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </main>
</template>
<style lang="css">
/* hide scrollbar but allow scroll */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

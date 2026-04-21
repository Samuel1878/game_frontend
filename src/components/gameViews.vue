<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue"
import type { Game } from "@/utils/types"
import type { Component } from "vue"

const props = defineProps<{
  header?: string
  gameData?: Game[]
  handler?: (game: Game) => void
  icon?: Component
}>()

/* --------------------------
   1️⃣ Sort only once (computed)
---------------------------*/
const sortedGames = computed(() =>
  (props.gameData ?? [])
    .slice()
    .sort((a, b) => (a?.rank ?? 0) - (b?.rank ?? 0))
)

/* --------------------------
   2️⃣ Lazy chunk rendering
---------------------------*/
const chunkSize = 30
const visibleCount = ref(chunkSize)

const visibleGames = computed(() =>
  sortedGames.value.slice(0, visibleCount.value)
)

const loadMore = () => {
  if (visibleCount.value < sortedGames.value.length) {
    visibleCount.value += chunkSize
  }
}

/* --------------------------
   3️⃣ Intersection Observer
---------------------------*/
const loadTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver

onMounted(() => {
  observer = new IntersectionObserver(entries => {
    if (entries[0]?.isIntersecting) {
      loadMore()
    }
  })

  if (loadTrigger.value) {
    observer.observe(loadTrigger.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
function getGameIcon(game: Game): string | undefined {
  const en = game.gameInfos[0];
  if (en?.gameIconUrl) return en.gameIconUrl

  const zh = game.gameInfos[1]
  return zh?.gameIconUrl
}
</script>
<template>
  <article class="px-2">
   
    <div class="grid grid-cols-3 md:flex flex-wrap gap-1.5 my-2">

<button
  v-for="(game, index) in visibleGames"
  :key="game?.gameID ?? index"
  class="relative overflow-hidden rounded-lg border border-white/20 group
         hover:-translate-y-1 transition-all duration-300"
  @click="handler?.(game)"
>
  <!-- Glass reflection (auto slow) -->
  <div class="glass absolute inset-0"></div>

  <!-- Shine flash (on hover only) -->
  <div class="shine absolute inset-0"></div>
<div class="absolute inset-0 bg-black/10 rounded-lg"></div>
  <img
    v-if="getGameIcon(game)"
    :src="getGameIcon(game)"
    class="min-w-22 h-36 rounded-lg object-cover
           transition-transform duration-300 group-hover:scale-105"
  />
</button>
      
    </div>

    <!-- invisible trigger -->
    <div ref="loadTrigger" class="h-10"></div>
  </article>
</template>

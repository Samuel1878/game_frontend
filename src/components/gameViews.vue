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
const chunkSize = 40
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
  <article>
   
    <div class="grid grid-cols-3 md:flex flex-wrap gap-1.5 my-2">
      <button
        v-for="(game, index) in visibleGames"
        :key="game?.gameID ?? index"
        class="w-auto cursor-pointer overflow-hidden rounded-lg"
        @click="handler?.(game)"
      >
        <img
          v-if="getGameIcon(game)"
          :src="getGameIcon(game)"
          alt="game thumbnail"
          class="min-w-22 w-auto h-36 object-fit rounded-lg"
        />
        
      </button>
    </div>

    <!-- invisible trigger -->
    <div ref="loadTrigger" class="h-10"></div>
  </article>
</template>

// import { onMounted, onUnmounted } from "vue";

// export function useReturnRefresh(callback?: () => void, cooldown = 5000) {
//   let lastCall = 0;

//   const safeCall = () => {
//     const now = Date.now();
//     if (now - lastCall < cooldown) return;

//     lastCall = now;

//     if (callback) callback();
//     else window.location.reload();
//   };

//   const onVisibilityChange = () => {
//     if (document.visibilityState === "visible") {
//       safeCall();
//     }
//   };

//   const onPageShow = (event: PageTransitionEvent) => {
//     if (event.persisted) {
//       safeCall();
//     }
//   };

//   onMounted(() => {
//     document.addEventListener("visibilitychange", onVisibilityChange);
//     window.addEventListener("pageshow", onPageShow);
//   });

//   onUnmounted(() => {
//     document.removeEventListener("visibilitychange", onVisibilityChange);
//     window.removeEventListener("pageshow", onPageShow);
//   });
// }
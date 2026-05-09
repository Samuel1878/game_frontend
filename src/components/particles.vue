<template>
  <div class="relative min-h-screen w-full z-0 overflow-hidden">
    <!-- Particles as a background layer -->
    <vue-particles
      id="tsparticles"
      class="absolute inset-0 z-50 pointer-events-none"
      :options="particlesOptions"
    />
    
    <!-- Your content on top -->
    <div class="z-0 relative min-h-screen w-full">
     <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
// const particlesOptions = {
//   fullScreen: {
//     enable: false
//   },

//   background: {
//     color: { value: "transparent" }
//   },

//   fpsLimit: 60,

//   particles: {
//     number: {
//       value: 80,
//       density: {
//         enable: true,
//         area: 800
//       }
//     },

//     color: {
//       value: [
//         "#ffb7c5",
//         "#ff9eb5",
//         "#ffd1dc",
//         "#f8a8c1",
//         "#ffcad4"
//       ]
//     },

//     shape: {
//       type: "circle",
//       options: {
//         polygon: {
//           sides: 5
//         }
//       }
//     },

//     opacity: {
//       value: 0.8,
//       random: true,
//       animation: {
//         enable: true,
//         speed: 0.6,
//         minimumValue: 0.3,
//         sync: false
//       }
//     },

//     size: {
//       value: { min: 3, max: 8 },
//       random: true,
//       animation: {
//         enable: true,
//         speed: 1,
//         minimumValue: 2,
//         sync: false
//       }
//     },

//     move: {
//       enable: true,

//       // 🌬 wind + gravity mix (key for realism)
//       direction: "bottom",

//       speed: {
//         min: 0.5,
//         max: 1.5
//       },

//       outModes: {
//         default: "out"
//       },

//       gravity: {
//         enable: true,
//         acceleration: 0.15
//       },

//       drift: {
//         min: -1,
//         max: 1
//       },

//       random: true,
//       straight: false
//     },

//     rotate: {
//       value: {
//         min: 0,
//         max: 360
//       },
//       direction: "random",
//       animation: {
//         enable: true,
//         speed: 2,
//         sync: false
//       }
//     },

//     wobble: {
//       enable: true,
//       distance: 10,
//       speed: {
//         min: -2,
//         max: 2
//       }
//     }
//   },

//   detectRetina: true
// };
const particlesOptions = {
  background: {
    color: { value: "transparent" }, // Let Tailwind handle the background color
  },
  fpsLimit: 120,
    fullScreen: {
    enable: true,
    zIndex: 100 // This moves the particles behind all other content
  },

  "particles": {
    "number": {
      "value": 100,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": ["#fff",  "#ffb7c5",
        "#ff9eb5",
        "#ffd1dc",
        "#f8a8c1",
         "#ffcad4", "#ff6b87", "#ff5675"]
    },
    "shape": {
      type: "polygon",
      "stroke": {
        "width": 2,
        "color": "#fff"
      },
      options: {
        polygon: {
          sides: 11
        }
      }
      // "type": "circle",
      // "stroke": {
      //   "width": 0,
      //   "color": "#000000"
      // },
      // "polygon": {
      //   "nb_sides": 10
      // }
    },
    shadow: {
    enable: true,
    blur: 10,
    color: "#ffffff"
    },
    "opacity": {
      "value": 0.8,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": { min: 4, max: 8 },
      "random": true,
      "anim": {
        "enable": true,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 500,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 2
    },
    "move": {
      "enable": true,
      "speed": 3,
      "direction": "bottom",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": true,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble"
      },
      "onclick": {
        "enable": true,
        "mode": "repulse"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 0.5
        }
      },
      "bubble": {
        "distance": 400,
        "size": 4,
        "duration": 0.3,
        "opacity": 1,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true

};
</script>

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
      "value": 200,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": ["#fff", "#a0c8ff", "#ffb3c1", "#b3fff5", "#EFBF04"]
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      }
    },
    shadow: {
    enable: true,
    blur: 10,
    color: "#ffffff"
    },
    "opacity": {
      "value": 0.3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 0.2,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 6,
      "random": true,
      "anim": {
        "enable": false,
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
      "speed": 6,
      "direction": "bottom",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
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

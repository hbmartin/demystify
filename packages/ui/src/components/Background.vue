<script lang="ts" setup>
</script>

<template>
  <div class="absolute z-0 h-screen w-screen">
    <svg
      id="visual"
      viewBox="0 0 900 600"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      preserveAspectRatio="none"
      class="w-full h-full"
    >
      <rect x="0" y="0" width="900" height="600" fill="#001220"></rect>
      <defs>
        <linearGradient id="grad1_0" x1="33.3%" y1="0%" x2="100%" y2="100%">
          <stop offset="20%" stop-color="#001220" stop-opacity="1"></stop>
          <stop offset="80%" stop-color="#001220" stop-opacity="1"></stop>
        </linearGradient>
      </defs>
      <defs>
        <linearGradient id="grad2_0" x1="0%" y1="0%" x2="66.7%" y2="100%">
          <stop offset="20%" stop-color="#001220" stop-opacity="1"></stop>
          <stop offset="80%" stop-color="#001220" stop-opacity="1"></stop>
        </linearGradient>
      </defs>
      <g transform="translate(900, 0)">
        <path
          d="M0 486.7C-63.9 473 -127.9 459.2 -177.6 428.7C-227.2 398.1 -262.7 350.7 -310.4 310.4C-358.2 270.1 -418.3 236.8 -449.7 186.3C-481.1 135.7 -483.9 67.9 -486.7 0L0 0Z"
          fill="#0C80E4"
        ></path>
      </g>
      <g transform="translate(0, 600)">
        <path
          d="M0 -486.7C62.6 -477.8 125.2 -468.9 185.2 -447.2C245.2 -425.4 302.7 -390.9 344.2 -344.2C385.7 -297.4 411.3 -238.5 432.4 -179.1C453.5 -119.7 470.1 -59.8 486.7 0L0 0Z"
          fill="#00E4C5"
        ></path>
      </g>
    </svg>
  </div>
</template>

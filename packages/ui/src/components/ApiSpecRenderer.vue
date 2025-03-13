<script lang="ts" setup>
import { ApiReference } from "@scalar/api-reference";
import "@scalar/api-reference/style.css";
import BackButton from "./BackButton.vue";

const props = defineProps<{
  spec: Object;
  onClickBack: () => void;
  disableApiRequests: boolean;
  onLoadedSpec?: () => void;
}>();
</script>

<template>
  <!-- Props https://github.com/scalar/scalar/blob/main/documentation/configuration.md -->
  <ApiReference
    :configuration="{
      spec: {
        content: spec,
      },
      hideClientButton: true,
      authentication: {},
      darkMode: false,
      forceDarkModeState: 'light',
      hideDarkModeToggle: true,
      hideTestRequestButton: disableApiRequests,
      onLoaded() {
        props.onLoadedSpec?.();
      },
    }"
  />
  <div
    class="z-50 flex justify-center items-center bottom-0 fixed left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px]"
  >
    <BackButton :onClickBack="() => props.onClickBack()" />
  </div>
</template>

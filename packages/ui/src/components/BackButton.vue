<script lang="ts" setup>
import { Button } from "./ui/button";
import { CircleArrowLeft } from "lucide-vue-next";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./ui/tooltip";

const props = defineProps({
  onClickBack: {
    type: Function,
    required: true
  },
});
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <div
          class="w-12 h-12 flex justify-center items-center rounded-full"
        >
            <Button v-on:click="() => props.onClickBack()" variant="ghost" class="hover:bg-transparent">
            <CircleArrowLeft class="min-w-12 min-h-12 stroke-[#e7]" />
            </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent>Go back</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

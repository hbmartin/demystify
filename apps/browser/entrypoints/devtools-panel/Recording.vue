<script lang="ts" setup>
import { BotMessageSquare } from "lucide-vue-next";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div class="flex items-center gap-2 fill-red-500">
          <BotMessageSquare />
          <p>Recording API requests...</p>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        The extension receives a copy of each API request made by the browser
        <br />
        and generates API specifications in real time.
        <br />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

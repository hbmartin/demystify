<script setup lang="ts">
import { useToast, Toaster } from "@/components/ui/toast";
import { type HarEntry } from "demystify-lib";
import { selectFile } from "@demystify/helpers";
import { App } from "@demystify/ui";
import { ref } from "vue";
import Link from "./Link.vue";

const { toast } = useToast();

const har = ref<HarEntry[]>([]);

const onSelectFiles = selectFile((entries) => (har.value = entries), toast);
</script>

<template>
  <Toaster />
  <main>
    <App
      :har="har"
      :onClickSelectHar="onSelectFiles"
      :disable-api-requests="true"
    >
      <Link />
    </App>
  </main>
</template>

<style scoped></style>

<script lang="ts" setup>
import { ref, onUnmounted } from "vue";
import { App } from "@demystify/ui";
import { requestToHar } from "./request-to-har";
import { HarEntry } from "demystify-lib";
import { selectFile } from "@demystify/helpers";
import copy from "copy-to-clipboard";
import { useToast, Toaster } from "@/components/ui/toast";
import Recording from "./Recording.vue";

const { toast } = useToast();

const har = ref<HarEntry[]>([]);

const listener = async (request: chrome.devtools.network.Request) => {
  const harFromRequest = await requestToHar(request);
  har.value = [harFromRequest];
};

browser.devtools.network.onRequestFinished.addListener(listener);

onUnmounted(() => {
  browser.devtools.network.onRequestFinished.removeListener(listener);
});

// Workaround: cannot access clipboard in devtools, as protocol is e.g. chrome:// which is considered insecure
window.navigator.clipboard.writeText = async (text: string) => {
  copy(text);
};

const onClickSave = (data: string) => {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "demystify.json";
  a.click();
  URL.revokeObjectURL(url);
};

const onSelectFiles = selectFile((entries) => (har.value = entries), toast);
</script>

<template>
  <Toaster />
  <main>
    <App
      :har="har"
      :onClickSelectHar="onSelectFiles"
      :onClickSave="onClickSave"
    >
      <Recording />
    </App>
  </main>
</template>

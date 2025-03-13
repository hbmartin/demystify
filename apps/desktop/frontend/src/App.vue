<script lang="ts" setup>
import { ref } from "vue";
import { App } from "@demystify/ui";
import { useToast, Toaster } from "@/components/ui/toast/index";
import ProxyComponent from "./Proxy.vue";
import { File } from "../bindings/demystify/index.js";
import { Events } from "@wailsio/runtime";
import { Entry } from "har-format";
import { Representor } from "demystify-lib";

const { toast } = useToast();

const har = ref<Entry[]>([]);

const onSelectFile = async () => {
  const resp = await File.OpenFile();
  try {
    const json = JSON.parse(resp);
    if (json.log.entries) {
      har.value = json.log.entries;
    } else {
      toast({
        title: "Error",
        description: "Invalid HAR file",
        duration: 5000,
      });
    }
  } catch {
    toast({
      title: "Error",
      description: "Failed to open file",
      duration: 5000,
    });
  }
};

const onSave = async (str: string): Promise<void> => {
  const result = await File.SaveFile(str);
  if (result) {
    toast({
      title: "Success",
      description: "File saved to " + result,
      duration: 2000,
    });
  } else {
    toast({
      title: "Error",
      description: "Failed to save file",
      duration: 5000,
    });
  }
};

// Listen for new har entries from the backend
Events.On("proxy:har_entries", (event) => {
  const harEntries: Array<Entry> = event.data.flat();
  if (Array.isArray(harEntries) && harEntries.length > 0) {
    har.value = harEntries;
  }
});

// Notify user about proxy errors
Events.On("proxy:error", (event) => {
  const description = event.data?.[0];
  if (!description) return;
  toast({
    title: "Error",
    description,
    duration: 5000,
  });
});

// The download button has class .download-button
// So when the spec loads, attach a listener that saves the spec
// As the Wails app cannot open the file dialog on the frontend
const onLoadedSpec = (rep: Representor) => (hostnames: Array<string>) => {
  const downloadButton = document.querySelector(".download-button");
  if (downloadButton) {
    downloadButton.addEventListener("click", () => {
      File.SaveFile(rep.rest.generate(hostnames).getSpecAsJson());
    });
  }
};
</script>

<template>
  <Toaster />
  <main>
    <App
      :har="har"
      :onClickSelectHar="onSelectFile"
      :onClickSave="onSave"
      v-on:loaded-spec="onLoadedSpec"
      :read-from-file="File.OpenFile"
      :disableApiRequests="true"
    >
      <ProxyComponent />
    </App>
  </main>
</template>

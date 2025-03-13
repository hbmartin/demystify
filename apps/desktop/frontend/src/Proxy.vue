<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { Proxy } from "../bindings/demystify";
import { ref } from "vue";
import { Input } from "@/components/ui/input";
import { Play, CircleStop, ArrowBigRight } from "lucide-vue-next";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

enum Mode {
  Recording = 0,
  NotRecording,
}

const upstreamPort = ref(
  localStorage.getItem("demystify:proxy:upstreamPort") || ""
);
const downstreamUrl = ref(
  localStorage.getItem("demystify:proxy:downstreamUrl") || ""
);
const mode = ref<Mode>(Mode.NotRecording);

// On initialisation, verify that the proxy is not running (should never be)
Proxy.IsActive().then((active) => {
  if (active) {
    mode.value = Mode.Recording;
  }
});

const onChangePort = (e: Event) => {
  const target = e.target as HTMLInputElement;
  upstreamPort.value = target.value;
  localStorage.setItem("demystify:proxy:upstreamPort", upstreamPort.value);
};

const onChangeUrl = (e: Event) => {
  const target = e.target as HTMLInputElement;
  downstreamUrl.value = target.value.toLowerCase();
  localStorage.setItem("demystify:proxy:downstreamUrl", downstreamUrl.value);
};

const isInvalid = () => {
  const textUpstreamHasNonNumeric = upstreamPort.value.match(/\D/) !== null;
  const upstreamAsInt = parseInt(upstreamPort.value);
  const upstreadPortIsValid = upstreamAsInt > 0 && upstreamAsInt <= 65535;
  const upstreamIsValid = !textUpstreamHasNonNumeric && upstreadPortIsValid;
  try {
    // Both http: and http:// are valid, but martian doesn't like the former
    const protocolHasSlashes = ["http://", "https://"].some((val) =>
      downstreamUrl.value.startsWith(val)
    );
    const url = new URL(downstreamUrl.value);
    // The url should be valid at this stage, below is an additional check
    const urlProtocolValid =
      url.protocol === "http:" || url.protocol === "https:";
    return !protocolHasSlashes || !upstreamIsValid || !urlProtocolValid;
  } catch {
    return true;
  }
};

const onClickStart = () => {
  if (isInvalid()) return;
  mode.value = Mode.Recording;
  Proxy.Start({
    UpstreamPort: parseInt(upstreamPort.value),
    DownstreamURL: downstreamUrl.value,
  });
};

const onClickStop = () => {
  mode.value = Mode.NotRecording;
  upstreamPort.value = "";
  downstreamUrl.value = "";
  Proxy.Stop();
};
</script>

<template>
  <TooltipProvider>
    <Tooltip v-if="mode === Mode.NotRecording">
      <TooltipTrigger className="cursor-not-allowed self-end">
        <Button
          variant="secondary"
          @click="onClickStart"
          :disabled="isInvalid()"
          class="flex items-center gap-2"
        >
          <Play />
          Proxy
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          Generate API specifications in real time via a proxy from a localhost
          port to a URL
          <br />
          <br />
          Select a local port to listen to and a URL to send requests to, which
          may also be localhost:{port}
          <br />
          <br />
          The proxy will forward requests while generating live documentation
        </p>
      </TooltipContent>
    </Tooltip>

    <div v-else-if="mode === Mode.Recording" class="flex items-center gap-2">
      <Button variant="destructive" @click="onClickStop">
        <CircleStop />
        Stop Recording
      </Button>
      <p class="flex flex-row items-center gap-1">
        <Tooltip>
          <TooltipTrigger>
            <span
              class="text-ellipsis overflow-hidden max-w-[80px] cursor-default"
            >
              :<b>
                {{ upstreamPort }}
              </b>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {{ upstreamPort }}
            </p>
          </TooltipContent>
        </Tooltip>
        <span>
          <ArrowBigRight />
        </span>
        <Tooltip>
          <TooltipTrigger>
            <span
              class="text-ellipsis overflow-hidden max-w-[180px] cursor-default"
            >
              <b>
                {{ downstreamUrl }}
              </b>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {{ downstreamUrl }}
            </p>
          </TooltipContent>
        </Tooltip>
      </p>
    </div>
    <Tooltip>
      <TooltipTrigger>
        <span
          class="text-ellipsis overflow-hidden max-w-[180px] cursor-default"
        >
          <Input
            :defaultValue="upstreamPort"
            class="w-[125px]"
            type="text"
            placeholder="Listen to port..."
            @input="onChangePort"
            v-if="mode === Mode.NotRecording"
            v-on:keyup.native.enter="onClickStart"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Listen on port 1-65535 for requests, such as localhost:3000</p>
      </TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger>
        <span
          class="text-ellipsis overflow-hidden max-w-[180px] cursor-default"
        >
          <Input
            :defaultValue="downstreamUrl"
            type="text"
            placeholder="Send to host..."
            @input="onChangeUrl"
            v-if="mode === Mode.NotRecording"
            v-on:keyup.native.enter="onClickStart"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          Forward requests to this host, such as http://myapi.com, or
          http://localhost:8080
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped></style>

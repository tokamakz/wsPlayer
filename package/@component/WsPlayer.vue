<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import WsPlayer from "../@runtime-core/player";
import PlayProgress from "./PlayProgress.vue";
import PlayButton from "./PlayButton.vue";
interface Props {
  url?: string;
}
const props = withDefaults(defineProps<Props>(), {
  url: ""
});
const ws = new WsPlayer("wsp", props.url);
ws.open();
console.log(ws);
</script>

<template>
  <div class="ws-player">
    <div class="wsp-container">
      <div class="wsp-video-container">
        <video id="wsp" muted autoplay class="wsp-video" />
      </div>
      <div class="wsp-control-bottom">
        <div class="wsp-progress-bar-container" />
        <div class="wsp-controls">
          <div class="wsp-left-controls">
            <!-- 播放按钮 -->
            <PlayButton />
            <!-- 播放进度条 -->
            <PlayProgress />
          </div>
          <div class="wsp-right-controls" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../@scss/index.scss";
</style>

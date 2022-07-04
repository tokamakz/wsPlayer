
<script lang="ts" setup>
import PlayProgress from './PlayProgress.vue';
import PlayButton from './PlayButton.vue';
import { ref } from 'vue';
import { number } from 'yargs';

interface Props {
  url?: string
}
const wsOptions = {}
const props = withDefaults(defineProps<Props>(), {
  url: '',
})
const percent = ref<number>(10);
let timer: NodeJS.Timer | number = -99999;
timer && clearInterval(timer)
// timer = setInterval(() => {
//   percent.value += 10;
// }, 1000)
</script>

<template>
  <div class="ws-player">
    <div class="wsp-container">
      <div class="wsp-video-container">
        <video id="wsp-api-flush" tabindex="-1" :autoplay="false" muted class="wsp-video">
          <source :src="props.url" type="video/mp4">
        </video>
      </div>
      <div class="wsp-control-bottom">
        <div class="wsp-progress-bar-container" />
        <div class="wsp-controls">
          <div class="wsp-left-controls">
            <!-- 播放按钮 -->
            <PlayButton />
            <!-- 播放进度条 -->
            <PlayProgress :percent='percent'/>
          </div>
          <div class="wsp-right-controls" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../@scss/index.scss';
</style>

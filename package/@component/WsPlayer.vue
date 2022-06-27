<script lang="ts" setup>
</script>

<template>
  <div class="ws-player">
    <div class="wsp-container">
      <div class="wsp-video-container">
        <video id="wsp-api-flush" tabindex="-1" :autoplay="true" muted class="wsp-video">
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
            <PlayProgress />
          </div>
          <div class="wsp-right-controls" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import PlayButton from './PlayButton.vue'
import PlayProgress from './PlayProgress.vue'
const wsOptions = {}
const props = withDefaults(defineProps<Props>(), {
  url: '',
})

interface Props {
  url?: string
}
</script>
<style lang="scss" scoped>
@import '../@scss/index.scss';
</style>

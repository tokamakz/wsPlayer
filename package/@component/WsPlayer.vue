<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue-demi'
const wsOptions = {}
const props = withDefaults(defineProps<Props>(), {
  url: '',
})
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
            <button class="wsp-button wsp-play-button" title="播放" aria-label="暂停">
              <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                <use class="wsp-svg-shadow" xlink:href="#wsp-id-01" />
                <path id="ytp-id-84" class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" />
              </svg>
            </button>
          </div>
          <div class="wsp-right-controls" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
interface Props {
  url?: string
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PlayButton',
})
</script>

<template>
  <button class="wsp-button wsp-play-button" title="播放" aria-label="暂停">
    <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
      <use class="wsp-svg-shadow" xlink:href="#wsp-id-01" />
      <path id="ytp-id-84" class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" />
    </svg>
  </button>
</template>
<style lang='scss' scoped>
@import '../@scss/button.scss';
@import '../@scss/playButton.scss';
</style>

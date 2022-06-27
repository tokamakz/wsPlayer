<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PlayProgress',
})
</script>

<template>
  <div class="wsp-progress-bar" tabindex="-1" role="slider" aria-label="播放滑块" aria-valuemin="0" aria-valuemax="120"
    aria-valuenow="4" aria-valuetext="0 分钟 7 秒/0 分钟 57 秒">
    <div class="wsp-chapters-container" style="height: 7px;">
      <div class="wsp-chapter-hover-container" style="width: 100%;">
        <div class="wsp-progress-bar-padding" />
        <div class="wsp-progress-list">
          <div class="wsp-play-progress wsp-swatch-background-color" style="left: 0px; transform: scaleX(0.137041);" />
          <div class="wsp-progress-linear-live-buffer" />
          <div class="wsp-load-progress" style="left: 0px; transform: scaleX(1);" />
          <div class="wsp-hover-progress" style="left: 0.417px; transform: scaleX(0);" />
          <div class="wsp-ad-progress-list" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
@mixin position {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wsp-progress-bar {
  @include position();
  z-index: 31;
  outline: none;

  .wsp-chapters-container {
    width: 100%;
    z-index: 32;
    position: relative;
    left: 0;
    height: 100%;

    .wsp-chapter-hover-container {
      z-index: 32;
      position: relative;
      left: 0;
      height: 100%;
      float: left;

      .wsp-progress-bar-padding {
        position: absolute;
        width: 100%;
        height: 16px;
        bottom: 0;
        z-index: 28;
      }

      .wsp-progress-list {
        z-index: 39;
        background: rgba(255, 255, 255, .2);
        height: 100%;
        transform: scaleY(0.6);
        transition: transform .1s cubic-bezier(0.4, 0, 1, 1), -webkit-transform .1s cubic-bezier(0.4, 0, 1, 1);
        position: relative;

        .wsp-play-progress {
          z-index: 34;
        }

        .wsp-swatch-background-color {
          background: #f00;
          @include position();
        }

        .wsp-progress-linear-live-buffer {
          z-index: 45;
          background: #c00;
          opacity: 0;
          transform-origin: 0 0;
          @include position();
        }

        .wsp-load-progress {
          @include position();
          z-index: 33;
          background: rgba(255, 255, 255, .4);
          transform-origin: 0 0;
          left: 0px;
          transform: scaleX(0.703556);
        }

        .wsp-hover-progress {
          @include position();
          z-index: 35;
          background: rgba(0, 0, 0, .125);
          opacity: 0;
          transition: opacity .25s cubic-bezier(0, 0, 0.2, 1);
        }

        .wsp-ad-progress-list {
          display: none;
        }
      }
    }
  }
}
</style>

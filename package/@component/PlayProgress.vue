<!-- 需求：根据传入的值动态修改进度条；根据是否可以拖动修改当前播放参数，并传出 -->
<script lang="ts" setup>
import { type } from 'os';
import { onMounted, ref, nextTick, toRefs, watch, reactive, onBeforeUnmount } from 'vue';
interface Props {
  percent?: Number | String,
  percentProgress?: Number | String,
  disabled?: Boolean
}
type RefElement = HTMLElement | null;
const dotWidth = 10;
// the progress $refs, modify the width or left
const progressRefs = ref<RefElement>(null);
// the scrubber $refs,modify the width
const scrubberRefs = ref<RefElement>(null);
const listRefs = ref<RefElement>(null);
const width = ref<number>(0)
const props = defineProps<Props>()
const emit = defineEmits(['change', 'delete'])
const moveReact = reactive({
  status: false,
  scaleX: 0,
  left: 0
})

watch(() => props.percent, (value, preValue) => {
  console.log('⚽︎⚽︎⚽︎', value, preValue);
  // scrubberRefs.value.style.transform = `translateX(${value}px)`;
})
watch(() => moveReact.status, (value, preValue) => {
  if (value) {
    _bindEvents();
  } else {
    _removeEvents();
  }
})

onMounted(() => {
  nextTick(() => {
    console.log(listRefs.value!.getBoundingClientRect());
  })
});

onBeforeUnmount(() => {
  _removeEvents()
})

const handleScrubberDown = ($event) => {
  console.log('鼠标按下事件', $event);
}

const handleScrubberMover = ($event) => {
  moveReact.status = true;
  const scrubberButtonRefs = scrubberRefs.value!.getBoundingClientRect().width / 2
  moveReact.scaleX = $event.layerX - scrubberButtonRefs;
  width.value = listRefs.value!.getBoundingClientRect().width;
  console.log(scrubberButtonRefs)
  if (moveReact.scaleX >= width.value) {
    scrubberRefs.value!.style.transform = `translateX(${width.value}px)`;
  } else if (moveReact.scaleX < -scrubberButtonRefs) {
    scrubberRefs.value!.style.transform = `translateX(${-scrubberButtonRefs}px)`;
  } else {
    scrubberRefs.value!.style.transform = `translateX(${moveReact.scaleX}px)`;
  }
  console.log('dragstart', moveReact.scaleX,width.value);
}

const handleScrubberUp = ($event) => {
  moveReact.status = false;
  console.log('drop', $event);
}

// 添加绑定事件
const _bindEvents = () => {
  document.addEventListener('mousemove', handleScrubberMover)
  document.addEventListener('mouseup', handleScrubberUp)
  document.addEventListener('touchmove', handleScrubberMover)
  document.addEventListener('touchend', handleScrubberUp)
}
// 移除绑定事件
const _removeEvents = () => {
  document.removeEventListener('mousemove', handleScrubberMover)
  document.removeEventListener('mouseup', handleScrubberUp)
  document.removeEventListener('touchmove', handleScrubberMover)
  document.removeEventListener('touchend', handleScrubberUp)
}
</script>

<template>
  <div class="wsp-progress-bar" tabindex="-1" role="slider" aria-label="播放滑块" aria-valuemin="0" aria-valuemax="120"
    aria-valuenow="4" aria-valuetext="0 分钟 7 秒/0 分钟 57 秒">
    <div class="wsp-chapters-container" style="height: 7px;">
      <div class="wsp-chapter-hover-container" style="width: 100%;">
        <div class="wsp-progress-bar-padding" />
        <div class="wsp-progress-list" ref='listRefs'>
          <!-- 已播放区 -->
          <div class="wsp-play-progress wsp-swatch-background-color" ref='progressRefs'
            style="left: 0px; transform: scaleX(0);" />
          <div class="wsp-progress-linear-live-buffer" />
          <!-- 缓冲区 -->
          <div class="wsp-load-progress" style="left: 0px; transform: scaleX(1);" />
          <div class="wsp-hover-progress" style="left: 0px; transform: scaleX(0);" />
          <div class="wsp-ad-progress-list" />
        </div>
      </div>
    </div>
    <!-- 播放指示器 -->
    <div class="wsp-scrubber-container" ref='scrubberRefs'>
      <div class="wsp-scrubber-button wsp-swatch-background-color" @mousedown.prevent='handleScrubberMover'
        @drop='handleScrubberUp'>
        <div class="wsp-scrubber-pull-indicator"></div>
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

      &:hover {
        .wsp-progress-list {
          transform: scaleY(0.8);
        }
      }

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
        transition: transform .1s cubic-bezier(0.4, 0, 1, 1);
        position: relative;

        .wsp-play-progress {
          z-index: 34;
          width: 100%;
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
          transition: transform .1s cubic-bezier(0.4, 0, 1, 1);
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

  .wsp-scrubber-container {
    position: absolute;
    top: -4px;
    left: -6.5px;
    z-index: 43;
    transition: transform linear 0s;

    .wsp-scrubber-button {
      height: 13px;
      width: 13px;
      border-radius: 6.5px;
      cursor: pointer;

      .wsp-scrubber-pull-indicator {
        position: absolute;
        z-index: 42;
        bottom: 16.9px;
        left: 6.5px;
        transform: rotate(45deg);

        &::before,
        &::after {
          transition: all .2s;
          display: block;
          position: absolute;
          content: "";
          top: 0;
          left: 0;
          opacity: 0;
          width: 6.5px;
          height: 6.5px;
          border-style: solid;
          border-width: 2px 0 0 2px;
          border-color: #eaeaea;
        }
      }
    }
  }

  .wsp-swatch-background-color {
    background-color: #f00;
  }
}
</style>

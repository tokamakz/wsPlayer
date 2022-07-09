<template>
  <h2>外层指定高度</h2>
  <div style="width: 1080px; height: 728px">
    <WsPlayer url="https://ckplayer-video.oss-cn-shanghai.aliyuncs.com/mp4/1_1920x1080.mp4" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WsPlayer from '../package/@component/WsPlayer.vue'
export default defineComponent({
  name: 'App',
  components: {
    WsPlayer,
  },
})
</script>

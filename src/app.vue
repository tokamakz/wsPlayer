<template>
  <WsPlayer />
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

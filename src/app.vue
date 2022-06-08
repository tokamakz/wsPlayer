<template>
  <WsPlayer />
</template>

<script lang="ts">
import WsPlayer from '/package/@conponent/WsPlayer.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
  components: {
    WsPlayer,
  },
})
</script>

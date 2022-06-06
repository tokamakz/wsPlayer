<script setup lang="ts">

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
});

const urlProp = ref(toString(props.url));

</script>

<template>
<p>This is a video attr</p>
<video :url='urlProp'></video>
</template>

<style>
video {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
}
</style>

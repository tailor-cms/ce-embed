<template>
  <div class="tce-root">
    <iframe
      :height="data.height"
      :src="data.url"
      class="d-block w-100"
      frameborder="0"
      title="PDF Viewer"
      @load="submit"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ElementData } from '@tailor-cms/ce-embed-manifest';

const props = defineProps<{ id: number; data: ElementData; userState: any }>();
const emit = defineEmits(['interaction']);

const submit = () => emit('interaction', { id: props.id });
</script>

<style lang="scss" scoped>
.tce-root {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}
</style>

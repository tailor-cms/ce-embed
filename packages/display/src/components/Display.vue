<template>
  <div class="tce-embed-root">
    <iframe
      :height="element.data.height"
      :src="element.data.url"
      class="d-block w-100"
      frameborder="0"
      title="PDF Viewer"
      @load="submit"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { Element } from '@tailor-cms/ce-embed-manifest';

const props = defineProps<{ element: Element; userState: any }>();
const emit = defineEmits(['interaction']);

const submit = () => emit('interaction', { id: props.element.id });
</script>

<style scoped>
.tce-embed-root {
}
</style>

<template>
  <div class="tce-embed-root">
    <iframe
      :height="element.data.height"
      :src="element.data.url"
      class="d-block w-100"
      frameborder="0"
      title="PDF Viewer"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import type { Element } from '@tailor-cms/ce-embed-manifest';

defineProps<{ element: Element; userState: any }>();
</script>

<style scoped>
.tce-embed-root {
}
</style>

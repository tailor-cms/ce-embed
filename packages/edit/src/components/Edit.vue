<template>
  <div class="tce-embed">
    <VSheet
      v-if="!element.data.url"
      class="d-flex justify-center align-center my-2 text-h6"
      height="15.5rem"
    >
      <VIcon :icon="manifest.ui.icon" start />
      {{ manifest.name }} placeholder
    </VSheet>
    <iframe
      v-else
      :height="element.data.height"
      :src="element.data.url"
      class="d-block w-100"
      frameborder="0"
      sandbox="allow-forms allow-same-origin allow-scripts"
      title="PDF Viewer"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';
import type { Element } from '@tailor-cms/ce-embed-manifest';
import manifest from '@tailor-cms/ce-embed-manifest';

defineEmits(['save']);
defineProps<{ element: Element; isFocused: boolean; isDisabled: boolean }>();
</script>

<style lang="scss" scoped>
.tce-embed {
  text-align: left;
}
</style>

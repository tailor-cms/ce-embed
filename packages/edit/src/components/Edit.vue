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
    <div v-else>
      <VOverlay
        :model-value="!isFocused && !isDisabled"
        class="align-center justify-center"
        opacity="0.9"
        scrim="primary-darken-4"
        z-index="99"
        close-on-content-click
        contained
      >
        <button class="text-white text-h6 px-2">Click to preview</button>
      </VOverlay>
      <iframe
        :height="element.data.height"
        :src="element.data.url"
        class="d-block w-100"
        frameborder="0"
        sandbox="allow-forms allow-same-origin allow-scripts"
        title="PDF Viewer"
      ></iframe>
    </div>
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
  position: relative;
}
</style>

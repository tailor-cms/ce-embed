<template>
  <div class="tce-embed">
    <ElementPlaceholder
      v-if="!element.data.url"
      :icon="manifest.ui.icon"
      :is-disabled="isReadonly"
      :is-focused="isFocused"
      :name="`${manifest.name} component`"
      active-icon="mdi-arrow-up"
      active-placeholder="Use toolbar to enter the url"
    />
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
import type { Element } from '@tailor-cms/ce-embed-manifest';
import { ElementPlaceholder } from '@tailor-cms/core-components';
import manifest from '@tailor-cms/ce-embed-manifest';

defineProps<{
  element: Element;
  isDragged: boolean;
  isFocused: boolean;
  isReadonly: boolean;
}>();
defineEmits(['save']);
</script>

<style lang="scss" scoped>
.tce-embed {
  text-align: left;
}
</style>

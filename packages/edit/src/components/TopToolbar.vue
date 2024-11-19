<template>
  <div class="d-flex align-center justify-center flex-fill ga-4">
    <VTextField
      :model-value="element.data.height"
      class="required"
      hide-details="auto"
      label="Height"
      max-width="224"
      prepend-inner-icon="mdi-arrow-expand-vertical"
      suffix="px"
      type="number"
      variant="outlined"
      @update:model-value="$emit('save', { ...element.data, height: $event })"
    />
    <VTextField
      :model-value="element.data.url"
      hide-details="auto"
      label="URL"
      max-width="600"
      prepend-inner-icon="mdi-link-variant"
      variant="outlined"
      @update:model-value="$emit('save', { ...element.data, url: $event })"
    />
  </div>
</template>

<script setup lang="ts">
import type { Element } from '@tailor-cms/ce-embed-manifest';

defineProps<{ element: Element }>();
defineEmits(['save']);
</script>

<style scoped></style>

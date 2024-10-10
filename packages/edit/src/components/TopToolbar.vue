<template>
  <div class="d-flex align-center justify-center flex-fill ga-4">
    <VTextField
      :model-value="element.data.height"
      class="required"
      density="comfortable"
      hide-details="auto"
      label="Height"
      max-width="14rem"
      prepend-inner-icon="mdi-resize"
      suffix="px"
      type="number"
      @update:model-value="$emit('save', { ...element.data, height: $event })"
    />
    <VTextField
      :model-value="element.data.url"
      density="comfortable"
      hide-details="auto"
      label="URL"
      max-width="37.5rem"
      prepend-inner-icon="mdi-link"
      @update:model-value="$emit('save', { ...element.data, url: $event })"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';
import type { Element } from '@tailor-cms/ce-embed-manifest';

defineProps<{ element: Element }>();
defineEmits(['save']);
</script>

<style scoped></style>

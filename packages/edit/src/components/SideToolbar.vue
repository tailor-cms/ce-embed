<template>
  <VForm ref="form" validate-on="submit">
    <VTextField
      v-model="height"
      :rules="rules"
      class="required"
      hide-details="auto"
      label="Height"
      prepend-inner-icon="mdi-arrow-expand-vertical"
      suffix="px"
      type="number"
      variant="outlined"
    />
  </VForm>
</template>

<script lang="ts" setup>
import type { Element, ElementData } from '@tailor-cms/ce-embed-manifest';
import { ref, watch } from 'vue';
import { debounce } from 'lodash-es';

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 3000;

const rules = [
  (v: number | string) => !!v || 'Height is required',
  (v: number | string) =>
    Number(v) >= MIN_HEIGHT || `Height must be at least ${MIN_HEIGHT}px`,
  (v: number | string) =>
    Number(v) <= MAX_HEIGHT || `Height must be at most ${MAX_HEIGHT}px`,
];

const props = defineProps<{ element: Element }>();
const emit = defineEmits<{ save: [data: ElementData] }>();

const form = ref();
const height = ref<number | string>(props.element.data.height);

watch(
  () => props.element.data.height,
  (value) => {
    if (value === Number(height.value)) return;
    height.value = value;
  },
);

watch(
  height,
  debounce(async () => {
    if (!form.value) return;
    const { valid } = await form.value.validate();
    if (!valid) return;
    emit('save', { ...props.element.data, height: Number(height.value) });
  }, 500),
);
</script>

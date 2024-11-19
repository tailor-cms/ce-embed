<template>
  <VForm ref="form" validate-on="submit" @submit.prevent="save">
    <VToolbarItems class="ga-2">
      <VTextField
        v-model="elementData.height"
        :disabled="!isEditing"
        :rules="[rules.required]"
        class="required"
        hide-details="auto"
        label="Height"
        min-width="200"
        prepend-inner-icon="mdi-arrow-expand-vertical"
        suffix="px"
        type="number"
        variant="outlined"
      />
      <VTextField
        v-model="elementData.url"
        :disabled="!isEditing"
        :rules="[rules.required, rules.url]"
        hide-details="auto"
        label="URL"
        min-width="400"
        prepend-inner-icon="mdi-link-variant"
        variant="outlined"
      />
      <VBtn v-if="!isEditing" @click="isEditing = true">Edit</VBtn>
      <template v-else-if="isDirty">
        <VBtn @click="save">Save</VBtn>
        <VBtn @click="cancel">Cancel</VBtn>
      </template>
    </VToolbarItems>
  </VForm>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { Element, ElementData } from '@tailor-cms/ce-embed-manifest';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isURL from 'validator/lib/isURL';

const rules = {
  required: (val: string) => !!val || 'The field is required.',
  url: (val: string) =>
    isURL(val, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
    }) || 'URL is not valid.',
};

const props = defineProps<{ element: Element }>();
const emit = defineEmits(['save']);

const isEditing = ref(false);
const form = ref<HTMLFormElement>();
const elementData = reactive<ElementData>(cloneDeep(props.element.data));

const isDirty = computed(() => !isEqual(elementData, props.element.data));

const save = async () => {
  const { valid } = await form.value?.validate();
  if (!valid) return;
  emit('save', elementData);
  isEditing.value = false;
};

const cancel = () => {
  Object.assign(elementData, cloneDeep(props.element.data));
  form.value?.resetValidation();
  isEditing.value = false;
};
</script>

<style scoped></style>

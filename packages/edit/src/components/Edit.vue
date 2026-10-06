<template>
  <div class="tce-embed text-left">
    <TailorElementPlaceholder
      v-if="!element.data.url && isReadonly"
      :icon="manifest.ui.icon"
      :name="`${manifest.name} component`"
      is-readonly
    />
    <div
      v-else-if="!element.data.url"
      class="d-flex flex-column align-center text-center pa-6"
    >
      <VAvatar size="x-large" variant="tonal">
        <VIcon :icon="manifest.ui.icon" size="28" />
      </VAvatar>
      <div class="mt-4 mb-1 font-weight-medium text-title-large">
        Add an embed
      </div>
      <div class="text-body-medium text-medium-emphasis">
        Show a page or widget inside this block
      </div>
      <VBtn
        class="mt-4"
        color="primary"
        prepend-icon="mdi-link-variant"
        text="Enter URL"
        variant="tonal"
        @click="openDialog"
      />
    </div>
    <template v-else>
      <iframe
        :height="element.data.height"
        :src="element.data.url"
        class="d-block w-100"
        frameborder="0"
        sandbox="allow-forms allow-same-origin allow-scripts"
        title="Embedded page"
      ></iframe>
      <!-- Editor-only source row, mirroring the media elements' file row -->
      <VExpandTransition>
        <div
          v-if="isFocused && !isReadonly"
          class="position-sticky bottom-0 pa-3 mb-n3 bg-surface-raised"
        >
          <div class="d-flex align-center ga-2">
            <VIcon icon="mdi-link-variant" size="small" />
            <span class="text-body-small text-medium-emphasis text-truncate">
              {{ element.data.url }}
            </span>
            <VSpacer />
            <div class="d-flex align-center mr-n3">
              <VBtn
                prepend-icon="mdi-pencil-outline"
                size="small"
                text="Change URL"
                variant="text"
                @click="openDialog"
              />
              <VBtn
                color="error"
                prepend-icon="mdi-trash-can-outline"
                size="small"
                text="Remove"
                variant="text"
                @click="remove"
              />
            </div>
          </div>
        </div>
      </VExpandTransition>
    </template>
    <TailorDialog
      v-model="isDialogOpen"
      :header-icon="manifest.ui.icon"
      :title="element.data.url ? 'Change URL' : 'Add an embed'"
      width="500"
      @after-enter="focusUrl"
    >
      <template #body>
        <VForm
          ref="dialogForm"
          class="pt-2"
          validate-on="submit"
          @submit.prevent="save(dialogForm)"
        >
          <VTextField
            ref="urlField"
            v-model="url"
            :rules="[rules.required, rules.url]"
            hide-details="auto"
            label="URL"
            placeholder="https://"
            prepend-inner-icon="mdi-link-variant"
            variant="outlined"
          />
        </VForm>
      </template>
      <template #actions>
        <VBtn text="Cancel" variant="text" @click="isDialogOpen = false" />
        <VBtn
          :text="element.data.url ? 'Save' : 'Submit'"
          class="ml-2 px-4"
          color="primary"
          variant="flat"
          @click="save(dialogForm)"
        />
      </template>
    </TailorDialog>
  </div>
</template>

<script lang="ts" setup>
import type { Element, ElementData } from '@tailor-cms/ce-embed-manifest';
import isURL from 'validator/lib/isURL';
import manifest from '@tailor-cms/ce-embed-manifest';
import { ref } from 'vue';

const rules = {
  required: (val: string) => !!val?.trim() || 'Enter a URL.',
  url: (val: string) =>
    isURL(val, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
    }) || 'URL is not valid.',
};

const props = defineProps<{
  element: Element;
  isDragged: boolean;
  isFocused: boolean;
  isReadonly: boolean;
}>();
const emit = defineEmits<{ save: [data: ElementData] }>();

const dialogForm = ref();
const urlField = ref();
const url = ref(props.element.data.url ?? '');
const isDialogOpen = ref(false);

const save = async (form: any) => {
  const { valid } = await form.validate();
  if (!valid) return;
  emit('save', { ...props.element.data, url: url.value.trim() });
  isDialogOpen.value = false;
};

const openDialog = () => {
  url.value = props.element.data.url ?? '';
  dialogForm.value?.resetValidation();
  isDialogOpen.value = true;
};

const focusUrl = () => urlField.value?.focus();

const remove = () => {
  url.value = '';
  emit('save', { ...props.element.data, url: undefined });
};
</script>

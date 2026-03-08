<template>
  <NcModal
    :show="visible"
    :name="t('transfer', 'Upload by link')"
    size="normal"
    @close="close"
    @update:show="visible = $event">

    <div class="modal-content">
      <NcTextField
        v-model="url"
        :label="t('transfer', 'Link')"
        :label-visible="true"
        placeholder="https://example.com/file.txt" />

      <div class="row">
        <NcTextField
          v-model="chosenName"
          :label="t('transfer', 'File name')"
          :label-visible="true"
          :placeholder="defaults.name" />
        <span class="separator">.</span>
        <NcTextField
          class="short"
          v-model="chosenExtension"
          :label="t('transfer', 'Extension')"
          :label-visible="true"
          :placeholder="defaults.extension" />
      </div>

      <NcNoteCard type="info">
        <p>{{ t('transfer', 'Some websites provide a checksum in addition to the file. This is used after the transfer to verify that the file is not corrupted.') }}</p>
      </NcNoteCard>

      <div class="row">
        <NcSelect
          v-model="hashAlgo"
          class="short"
          input-id="hashAlgo"
          :placeholder="t('transfer', 'Hash algorithm')"
          :clearable="true"
          :options="hashOptions" />

        <NcTextField
          v-model="hash"
          :label="t('transfer', 'Checksum')"
          :label-visible="true" />
      </div>

      <div class="buttons">
        <NcButton
          type="primary"
          native-type="submit"
          :disabled="!isValid"
          @click="submit">
          <template #icon>
            <NcIconSvgWrapper :svg="TransferSvg" />
          </template>
          {{ t('transfer', 'Upload') }}
        </NcButton>
      </div>
    </div>
  </NcModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NcButton, NcIconSvgWrapper, NcModal, NcNoteCard, NcSelect, NcTextField } from '@nextcloud/vue'
import { translate as t } from '@nextcloud/l10n'
import { basename, extname, join } from '@nextcloud/paths'
import TransferSvg from '@mdi/svg/svg/cloud-upload.svg'
import { enqueueTransfer } from './ajax.js'

// State
const visible = ref(false)
const url = ref('')
const chosenName = ref('')
const chosenExtension = ref('')
const hashAlgo = ref(null)
const hash = ref('')
const currentDirectory = ref(null)

const hashOptions = ['md5', 'sha1', 'sha256', 'sha512']

// Computed
const defaults = computed(() => {
  try {
    const parsed = new URL(url.value)
    const pathname = parsed.pathname
    const ext = extname(pathname).replace(/^\./, '')
    const name = basename(pathname, extname(pathname))
    return { name, extension: ext }
  } catch {
    return { name: '', extension: '' }
  }
})

const finalName = computed(() => chosenName.value || defaults.value.name)
const finalExtension = computed(() => chosenExtension.value || defaults.value.extension)

const isValid = computed(() => {
  try {
    new URL(url.value)
  } catch {
    return false
  }
  return !!(finalName.value && finalExtension.value)
})

// Methods
function open(context) {
  url.value = ''
  chosenName.value = ''
  chosenExtension.value = ''
  hashAlgo.value = null
  hash.value = ''
  // context is an IFolder — use .path getter
  currentDirectory.value = context.path
  visible.value = true
}

function close() {
  visible.value = false
}

function submit() {
  const fullName = `${finalName.value}.${finalExtension.value}`
  const filePath = join(currentDirectory.value, fullName)
  enqueueTransfer(filePath, url.value, hashAlgo.value || '', hash.value)
  close()
}

// Expose open() so main.js can call it via mounted instance
defineExpose({ open })
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: calc(var(--default-grid-baseline) * 4);
  margin: calc(var(--default-grid-baseline) * 4);
}

.row {
  display: flex;
  align-items: flex-end;
  gap: calc(var(--default-grid-baseline) * 2);
}

.row .short {
  width: 10em;
  flex-shrink: 0;
}

.separator {
  padding-bottom: calc(var(--default-grid-baseline) * 1.5);
  font-weight: bold;
  line-height: 1;
}

.buttons {
  display: flex;
  justify-content: flex-end;
}
</style>

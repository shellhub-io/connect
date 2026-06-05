<template>
  <v-dialog v-model="show" width="400" @click:outside="close">
    <v-card class="bg-v-theme-surface">
      <v-card-title class="text-h5 pa-5 bg-primary"> Add Instance </v-card-title>
      <v-divider />
      <v-form class="ma-2" @submit.prevent="addInstance">
        <v-col>
          <v-text-field
            v-model="name"
            :error-messages="nameError"
            color="primary"
            prepend-inner-icon="mdi-text-box-outline"
            autofocus
            label="Name"
            variant="outlined"
            @blur="handleChange"
          />

          <v-text-field
            v-model="url"
            color="primary"
            :error-messages="urlError"
            prepend-inner-icon="mdi-link"
            label="URL"
            required
            variant="outlined"
          />
          <v-card-actions class="justify-center pa-0">
            <v-btn :disabled="hasError" color="primary" block type="submit" variant="flat">
              SAVE
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useAppStore } from '@renderer/stores'
import { computed, ref } from 'vue'
import * as yup from 'yup'
import { useField } from 'vee-validate'
import { InstanceService } from '@bindings'

const props = defineProps({
  value: {
    type: Boolean
  }
})

const emit = defineEmits(['update'])
const requestError = ref(false)
const store = useAppStore()
const showDialog = ref(false)

const {
  value: name,
  errorMessage: nameError,
  handleChange
} = useField<string>('name', yup.string().required().min(1), {
  initialValue: ''
})

const { value: url, errorMessage: urlError } = useField<string>(
  'url',
  yup.string().required().url(),
  {
    initialValue: 'https://'
  }
)

const show = computed({
  get: () => props.value,
  set: (val) => {
    showDialog.value = val
  }
})

const hasError = computed(() => {
  return !!urlError.value || !!nameError.value
})

// Validates the instance server-side (Go fetches /info — no CORS) and adds it.
const addInstance = async () => {
  if (hasError.value) {
    return
  }

  try {
    const info = await InstanceService.Validate(url.value)

    store.appendInstance({
      name: name.value,
      url: url.value,
      version: info.version,
      permanent: false
    })

    store.selectInstance(store.instances[store.instances.length - 1])

    close()
  } catch {
    requestError.value = true
    urlError.value =
      "An error occurred while validating the URL, indicating it isn't from a real ShellHub instance"
  }
}

const close = () => {
  emit('update')
}
</script>

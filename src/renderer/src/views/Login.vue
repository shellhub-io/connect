<template>
  <v-main class="d-flex">
    <v-container
      class="full-height d-flex justify-center align-center"
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
          xl="3"
        >
          <transition
            name="bounce"
            appear
            @after-leave="openWebView"
          >
            <v-card
              v-if="show"
              theme="dark"
              class="pa-6 bg-v-theme-surface"
              rounded="lg"
            >
              <v-card-title class="d-flex justify-center align-center mt-4">
                <v-img
                  :src="Logo"
                  max-width="220"
                  alt="ShellHub logo, a cloud with a shell in your base write ShellHub in the right side"
                />
              </v-card-title>
              <p class="text-caption text-center text-md font-weight-bolad">Desktop Application
              </p>

              <v-container>
                <v-slide-y-reverse-transition>
                  <v-alert
                    v-model="showError"
                    type="error"
                    closable
                    variant="tonal"
                    class="mb-4"
                  >
                    <strong>Invalid login credentials:</strong>
                    Your password is incorrect or this account doesn't exists.
                  </v-alert>
                </v-slide-y-reverse-transition>

                <v-dialog
                  v-model="showDialog"
                  width="400"
                >
                  <v-card
                    class="bg-v-theme-surface"
                    data-test="deviceRename-card"
                  >
                    <v-card-title class="text-h5 pa-5 bg-primary">
                      Add Instance
                    </v-card-title>
                    <v-divider />
                    <v-form
                      @submit.prevent="addInstance"
                      class="ma-2"
                    >
                      <v-col>
                        <v-text-field
                          v-model="newInstanceForm.name"
                          color="primary"
                          prepend-inner-icon="mdi-text-box-outline"
                          required
                          label="Name"
                          variant="outlined"
                        />

                        <v-text-field
                          v-model="newInstanceForm.url"
                          color="primary"
                          prepend-inner-icon="mdi-link"
                          label="URL"
                          required
                          variant="outlined"
                          data-test="password-text"
                        />
                        <v-card-actions class="justify-center pa-0">
                          <v-btn
                            color="primary"
                            block
                            type="submit"
                            variant="flat"
                          >
                            SAVE
                          </v-btn>
                        </v-card-actions>

                      </v-col>
                    </v-form>
                  </v-card>
                </v-dialog>

                <v-form
                  v-model="validForm"
                  @submit.prevent="login"
                >
                  <v-col>
                    <v-combobox
                      v-model="instance"
                      label="Select an ShellHub instance"
                      prepend-inner-icon="mdi-server"
                      variant="outlined"
                      item-title="name"
                      item-value="url"
                      :items="items"
                    >
                      <template #item="{ item, index, props }">
                        <v-list-item
                          :value="item.value"
                          lines="two"
                          v-bind="props"
                        >
                          <v-list-item-subtitle>
                            {{ item.raw.url }}
                          </v-list-item-subtitle>

                          <template #prepend>
                            <div class="mr-4">
                              <v-chip
                                size="x-small"
                                color="primary"
                              >v0.13.0</v-chip>
                            </div>
                          </template>
                          <template #append>
                            <v-btn
                              :disabled="item.raw.permanent"
                              icon="mdi-delete"
                              variant="plain"
                              @click.stop="removeInstance(index)"
                            ></v-btn>
                          </template>
                        </v-list-item>
                      </template>

                      <template #append-item>
                        <v-divider></v-divider>
                        <v-btn
                          block
                          prepend-icon="mdi-plus-box"
                          variant="text"
                          class="mt-2"
                          @click="showDialog = true"
                        >Add Custom Instance</v-btn>
                      </template>
                    </v-combobox>

                    <v-card-actions class="justify-center pa-0">
                      <v-btn
                        :disabled="!validForm"
                        color="primary"
                        :variant="validForm ? 'elevated' : 'tonal'"
                        block
                        type="submit"
                      >
                        Choose this Instance
                      </v-btn>
                    </v-card-actions>

                    <v-progress-linear
                      v-show="connecting"
                      indeterminate
                      class="mt-2"
                    />
                  </v-col>
                </v-form>
              </v-container>
            </v-card>
          </transition>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script setup lang="ts">
import { reactive, computed } from "vue";
import { ref } from "vue";
import { useRouter } from 'vue-router'
import { useAppStore, Instance } from '../stores'

import Logo from "../assets/logo-inverted.png"
import { onMounted } from "vue";

const store = useAppStore()
const router = useRouter()
const validForm = ref(false)
const showError = ref(false)
const connecting = ref(false)
const showDialog = ref(false)
const newInstanceForm = reactive({ name: '', url: '' })
const show = ref(true)

const items = store.instances;
const instance = computed({
  get(): Instance {
    return store.selectedInstance
  },
  set(v: Instance) {
    store.selectInstance(v)
  }
})

const openWebView = () => {
  router.push({ name: 'WebView' })
}

const login = async () => {
  connecting.value = !connecting.value
  store.setActiveInstance(store.selectedInstance)
  show.value = false
}

const addInstance = () => {
  store.appendInstance({
    name: newInstanceForm.name,
    url: newInstanceForm.url,
    permanent: false
  })

  // Reset form fields used in new instance form
  newInstanceForm.name = ''
  newInstanceForm.url = ''

  showDialog.value = false

  // Select the newly added instance
  store.selectInstance(store.instances[store.instances.length - 1])
}

const removeInstance = (index: number) => {
  // If the element is currently selected, select the previous element
  if (store.instances[index] === store.selectedInstance) {
    store.selectInstance(store.instances[index - 1])
  }

  store.deleteInstance(index)
}

onMounted(() => {
  //show.value = true
})
</script>
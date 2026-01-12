<template>
  <v-app>
    <v-app-bar color="primary" style="-webkit-app-region: drag">
      <template #prepend>
        <v-app-bar-nav-icon variant="text" style="-webkit-app-region: no-drag" @click="showMenu">
          <v-icon>mdi-menu</v-icon>
        </v-app-bar-nav-icon>
      </template>

      <v-select
        ref="selectRef"
        v-model="selectedInstance"
        :items="instances"
        item-title="name"
        item-value="url"
        variant="outlined"
        density="comfortable"
        hide-details
        return-object
        prepend-inner-icon="mdi-cloud"
        :menu-props="{ contentClass: 'rounded border', offset: 14, scrim: true, width: menuWidth }"
        class="flex-grow-0 flex-shrink-0"
        style="-webkit-app-region: no-drag"
      >
        <template #item="{ item, index }">
          <v-list-item
            :value="item.value"
            lines="two"
            :disabled="item.raw.version === 'UNREACHABLE'"
            class="px-4"
            @click="selectInstance(item.raw)"
          >
            <template #prepend>
              <v-avatar size="32" class="mr-3">
                <v-icon>mdi-cloud</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ item.raw.name }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-caption mt-1">
              {{ item.raw.url }}
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex align-center ga-2">
                <v-btn
                  v-if="!item.raw.permanent"
                  icon="mdi-pencil"
                  variant="text"
                  size="x-small"
                  @click.stop="editInstance(index)"
                />

                <v-btn
                  v-if="!item.raw.permanent"
                  icon="mdi-delete"
                  variant="text"
                  size="x-small"
                  color="error"
                  @click.stop="removeInstance(index)"
                />
              </div>
            </template>
          </v-list-item>
        </template>

        <template #append-item>
          <v-divider />
          <div class="pa-2">
            <v-btn
              block
              prepend-icon="mdi-cloud-plus"
              variant="tonal"
              color="primary"
              @click="toggleNewInstance"
            >
              Add Instance
            </v-btn>
          </div>
        </template>
      </v-select>

      <v-text-field
        v-model="url"
        readonly
        hide-details
        single-line
        variant="solo"
        density="comfortable"
        :loading="isLoading"
        class="flex-grow-1"
        style="-webkit-app-region: no-drag"
      >
        <template #prepend-inner>
          <v-icon :color="url.startsWith('https') ? 'success' : 'error'">
            {{ url.startsWith('https') ? 'mdi-lock' : 'mdi-lock-off' }}
          </v-icon>
        </template>
      </v-text-field>

      <v-btn class="ml-2" variant="text" icon="mdi-refresh" size="small" style="-webkit-app-region: no-drag" @click="reload" />

      <v-btn variant="text" icon="mdi-window-minimize" size="small" style="-webkit-app-region: no-drag" @click="minimizeWindow" />
      <v-btn variant="text" icon="mdi-window-maximize" size="small" style="-webkit-app-region: no-drag" @click="maximizeWindow" />
      <v-btn variant="text" icon="mdi-close" size="small" style="-webkit-app-region: no-drag" @click="closeWindow" />
    </v-app-bar>

    <v-main>
      <webview ref="webViewRef" style="flex: 1" class="fill-height" />
    </v-main>

    <NewInstanceDialog :value="newInstance" @update="toggleNewInstance" />
  </v-app>
</template>

<style scoped>
:deep(.v-select .v-field__outline) {
  display: none;
}

:deep(.v-select .v-field) {
  border: none !important;
}
</style>

<script setup lang="ts">
import { WebviewTag, DidStartNavigationEvent } from 'electron'
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useAppStore, Instance } from '../stores'
import { useDisplay } from 'vuetify'
import NewInstanceDialog from '../components/Auth/NewInstanceDialog.vue'

const store = useAppStore()
const { thresholds } = useDisplay()

const menuWidth = computed(() => thresholds.value.sm / 1.5)
const webViewRef = ref<WebviewTag>()
const selectRef = ref<any>(null)
const url = ref('')
const isLoading = ref(true)
const instances = ref(store.instances)
const newInstance = ref(false)

const selectedInstance = ref<Instance>(store.selectedInstance)

const showMenu = () => {
  window.api.showAppMenu()
}

const selectInstance = (instance: Instance) => {
  selectedInstance.value = instance
  selectRef.value?.blur() // Fecha o menu
}

const toggleNewInstance = () => {
  newInstance.value = !newInstance.value
}

const editInstance = (index: number) => {
  // TODO: Implementar dialog de edição
  console.log('Edit instance:', index, store.instances[index])
  toggleNewInstance()
}

const removeInstance = (index: number) => {
  if (store.instances[index] === selectedInstance.value) {
    selectedInstance.value = store.instances[index - 1]
  }
  store.deleteInstance(index)
}

const reload = () => {
  webViewRef.value?.reload()
}

const minimizeWindow = () => {
  window.api.minimizeWindow()
}

const maximizeWindow = () => {
  window.api.maximizeWindow()
}

const closeWindow = () => {
  window.api.closeWindow()
}

const beforeLoading = (e: DidStartNavigationEvent) => {
  if (!e.isInPlace) isLoading.value = true
  if (e.isMainFrame) url.value = e.url
}

const afterLoading = () => {
  isLoading.value = false
}

// Watch for instance changes and reload webview
watch(selectedInstance, (newVal) => {
  store.selectInstance(newVal)
  store.setActiveInstance(newVal)

  const webView = webViewRef.value
  if (webView) {
    webView.src = newVal.url
  }
})

type requestData = {
  version: string
  endpoints: {
    api: string
    ssh: string
  }
}

onMounted(async () => {
  // Validate instances
  for (const item of instances.value) {
    try {
      const req = await fetch(`${item.url}/info`, { method: 'GET' })
      const res: requestData = await req.json()
      item.version = res.version
    } catch (error) {
      item.version = 'UNREACHABLE'
    }
  }

  // Setup webview
  const webView = webViewRef.value as WebviewTag
  webView.src = selectedInstance.value.url
  webView.addEventListener('did-start-navigation', beforeLoading)
  webView.addEventListener('did-stop-loading', afterLoading)
})

onBeforeUnmount(() => {
  const webView = webViewRef.value as WebviewTag
  webView.removeEventListener('did-start-navigation', beforeLoading)
  webView.removeEventListener('did-stop-loading', afterLoading)
})
</script>

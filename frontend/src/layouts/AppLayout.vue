<template>
  <v-app>
    <v-app-bar color="primary" style="--wails-draggable: drag">
      <template #prepend>
        <v-menu location="bottom start">
          <template #activator="{ props: menuProps }">
            <v-app-bar-nav-icon variant="text" style="--wails-draggable: no-drag" v-bind="menuProps">
              <v-icon>mdi-menu</v-icon>
            </v-app-bar-nav-icon>
          </template>
          <v-list density="compact">
            <v-list-item prepend-icon="mdi-refresh" title="Reload" @click="reload" />
            <v-list-item prepend-icon="mdi-fullscreen" title="Toggle Fullscreen" @click="toggleFullscreen" />
            <v-divider />
            <v-list-item prepend-icon="mdi-book-open-variant" title="Documentation" @click="openDocs" />
            <v-list-item prepend-icon="mdi-github" title="GitHub" @click="openGitHub" />
            <v-divider />
            <v-list-item prepend-icon="mdi-power" title="Quit" @click="closeWindow" />
          </v-list>
        </v-menu>
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
        style="--wails-draggable: no-drag"
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
        style="--wails-draggable: no-drag"
      >
        <template #prepend-inner>
          <v-icon :color="url.startsWith('https') ? 'success' : 'error'">
            {{ url.startsWith('https') ? 'mdi-lock' : 'mdi-lock-off' }}
          </v-icon>
        </template>
      </v-text-field>

      <v-btn class="ml-2" variant="text" icon="mdi-refresh" size="small" style="--wails-draggable: no-drag" @click="reload" />

      <v-btn variant="text" icon="mdi-window-minimize" size="small" style="--wails-draggable: no-drag" @click="minimizeWindow" />
      <v-btn variant="text" icon="mdi-window-maximize" size="small" style="--wails-draggable: no-drag" @click="maximizeWindow" />
      <v-btn variant="text" icon="mdi-close" size="small" style="--wails-draggable: no-drag" @click="closeWindow" />
    </v-app-bar>

    <v-main>
      <iframe
        ref="webViewRef"
        :src="proxyUrl"
        class="fill-height"
        style="flex: 1; width: 100%; border: none"
        @load="afterLoading"
      />
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
import { ref, onMounted, watch, computed } from 'vue'
import { useAppStore, Instance } from '../stores'
import { useDisplay } from 'vuetify'
import { Window, Browser } from '@wailsio/runtime'
import { InstanceService } from '@bindings'
import NewInstanceDialog from '../components/Auth/NewInstanceDialog.vue'

const store = useAppStore()
const { thresholds } = useDisplay()

const menuWidth = computed(() => thresholds.value.sm / 1.5)
const webViewRef = ref<HTMLIFrameElement>()
const selectRef = ref<{ blur: () => void } | null>(null)
const url = ref('')
const isLoading = ref(true)
const proxyUrl = ref('')
const instances = ref(store.instances)
const newInstance = ref(false)

const selectedInstance = ref<Instance>(store.selectedInstance)

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

// Points the Go reverse proxy at `instance` and loads it in the iframe.
const loadInstance = async (instance: Instance) => {
  isLoading.value = true
  url.value = instance.url
  proxyUrl.value = await InstanceService.SetActiveInstance(instance.url)
  // Force the iframe to (re)load the proxy now that the target changed.
  const iframe = webViewRef.value
  if (iframe) iframe.src = proxyUrl.value
}

const reload = () => {
  const iframe = webViewRef.value
  if (iframe) {
    isLoading.value = true
    // Reassigning src reliably reloads a cross-origin iframe.
    iframe.src = proxyUrl.value
  }
}

const toggleFullscreen = () => Window.ToggleFullscreen()
const openDocs = () => Browser.OpenURL('https://docs.shellhub.io')
const openGitHub = () => Browser.OpenURL('https://github.com/shellhub-io/desktop')

const minimizeWindow = () => Window.Minimise()
const maximizeWindow = () => Window.ToggleMaximise()
const closeWindow = () => Window.Close()

const afterLoading = () => {
  isLoading.value = false
}

// Reload the iframe whenever the selected instance changes.
watch(selectedInstance, async (newVal) => {
  store.selectInstance(newVal)
  store.setActiveInstance(newVal)
  await loadInstance(newVal)
})

onMounted(async () => {
  // Validate instances server-side (no CORS, unlike a renderer fetch).
  for (const item of instances.value) {
    try {
      const info = await InstanceService.Validate(item.url)
      item.version = info.version
    } catch {
      item.version = 'UNREACHABLE'
    }
  }

  await loadInstance(selectedInstance.value)
})
</script>

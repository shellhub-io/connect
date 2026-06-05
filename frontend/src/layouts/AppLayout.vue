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
        class="fill-height"
        style="flex: 1; width: 100%; border: none"
        @load="afterLoading"
        @error="afterLoading"
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
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
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
    selectedInstance.value = store.instances[Math.max(0, index - 1)]
  }
  store.deleteInstance(index)
}

// Loading-state helpers: a single @load can never fire (slow/errored/non-document
// response), so back it with a timeout so the spinner can't get stuck on forever.
let loadTimer: ReturnType<typeof setTimeout> | undefined
const startLoading = () => {
  isLoading.value = true
  if (loadTimer) clearTimeout(loadTimer)
  loadTimer = setTimeout(() => (isLoading.value = false), 20000)
}
const afterLoading = () => {
  isLoading.value = false
  if (loadTimer) clearTimeout(loadTimer)
}

// Points the Go reverse proxy at `instance` and loads it in the iframe.
const loadInstance = async (instance: Instance) => {
  url.value = instance.url
  const iframe = webViewRef.value
  // Tear the old document down first so its in-flight requests are aborted before
  // the proxy target is swapped — otherwise they'd be forwarded to the new instance.
  if (iframe) iframe.src = 'about:blank'
  try {
    proxyUrl.value = await InstanceService.SetActiveInstance(instance.url)
  } catch (err) {
    console.error('failed to set active instance:', err)
    return
  }
  if (iframe) {
    startLoading()
    iframe.src = proxyUrl.value
  }
}

const reload = () => {
  const iframe = webViewRef.value
  if (iframe && proxyUrl.value) {
    startLoading()
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

// Reload the iframe whenever the selected instance changes.
watch(selectedInstance, async (newVal) => {
  store.selectInstance(newVal)
  store.setActiveInstance(newVal)
  await loadInstance(newVal)
})

// Open external links from inside the iframe (target=_blank / window.open to a
// different origin) in the system browser. The proxy injects a script that posts
// the URL here (see internal/proxy externalLinkScript).
const onExternalLink = (event: MessageEvent) => {
  const iframe = webViewRef.value
  if (!iframe || event.source !== iframe.contentWindow) return
  const data = event.data as { __shellhubOpenExternal?: unknown }
  const target = data?.__shellhubOpenExternal
  if (typeof target === 'string' && /^https?:\/\//i.test(target)) {
    Browser.OpenURL(target)
  }
}

onMounted(() => {
  window.addEventListener('message', onExternalLink)

  // Load the selected instance immediately; don't gate it on validation.
  loadInstance(selectedInstance.value)

  // Validate all instances in parallel (server-side, no CORS) so a slow/unreachable
  // one doesn't serialize startup behind the others' 10s timeouts.
  void Promise.all(
    instances.value.map(async (item) => {
      try {
        item.version = (await InstanceService.Validate(item.url)).version
      } catch {
        item.version = 'UNREACHABLE'
      }
    })
  )
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onExternalLink)
})
</script>

<template>
  <transition name="fade" appear>
    <v-app-bar color="primary">
      <template #prepend>
        <v-menu>
          <template #activator="{ props }">
            <v-app-bar-nav-icon v-bind="props" variant="text">
              <v-icon>mdi-server</v-icon>
            </v-app-bar-nav-icon>
          </template>
          <v-list v-model:selected="instance" class="pa-0">
            <ServerListItem
              v-for="(item, index) in items"
              :key="index"
              :index="index"
              :item="item"
            ></ServerListItem>
          </v-list>
        </v-menu>
      </template>

      <v-card-title class="pl-0 ml-2">{{ store.selectedInstance.name }}</v-card-title>
      <v-text-field
        v-model="url"
        readonly
        hide-details
        single-line
        variant="solo"
        density="comfortable"
        :loading="isLoading"
      >
        <template #prepend-inner>
          <v-icon :color="url.startsWith('https') ? 'success' : 'error'">
            {{ url.startsWith('https') ? 'mdi-lock' : 'mdi-lock-off' }}
          </v-icon>
        </template>
      </v-text-field>

      <v-btn class="ml-2" variant="text" icon="mdi-refresh" @click="reload"></v-btn>
    </v-app-bar>
  </transition>
  <v-main>
    <v-window v-model="window" class="fill-height" direction="vertical">
      <v-window-item
        v-for="(item, index) in items"
        :key="item.url"
        class="flex-fill fill-height"
        :eager="true"
      >
        <webview
          :key="item.url"
          :src="item.url"
          ref="list"
          class="flex-fill fill-height"
        ></webview>
      </v-window-item>
    </v-window>
  </v-main>
</template>

<script setup lang="ts">
import { DidStartNavigationEvent } from 'electron'
import { ref, onMounted, onBeforeUnmount, computed, Ref  } from 'vue'
import { Instance, useAppStore } from '../stores'
import ServerListItem from '@renderer/components/ServerListItem.vue'
import { useRefreshableComputed } from '@renderer/lib/useRefreshable'

const store = useAppStore()

const webViewRef = computed<Electron.WebviewTag>(() => list.value[window.value])

const items = ref(store.instances)
const instance = computed({
  get(): Array<Instance> {
    return [store.selectedInstance]
  },
  set(v: Array<Instance>) {
    if (v[0]) store.selectInstance(v[0])
  }
})

const { computed: url, refresh: refreshURL } = useRefreshableComputed<string>(() => {
  return webViewRef.value?.getAttribute('url') || ''
})

const { computed: isLoading, refresh: refreshLoading } = useRefreshableComputed<boolean>(() => {
  return webViewRef.value?.getAttribute('loading') == 'true' || false
})

const window = computed({
  get() {
    return items.value.indexOf(instance.value[0])
  },
  set(v) {
    instance.value = [items.value[v]]
  }
})

const reload = () => {
  webViewRef.value?.reload()
}

const beforeLoading = (e: DidStartNavigationEvent) => {
  const webView = e.target as Electron.WebviewTag

  if (!e.isInPlace) {
    webView.setAttribute('loading', 'true')
    refreshLoading()
  }

  if (e.isMainFrame) {
    webView.setAttribute('url', e.url)
    refreshURL()
  }
}

const afterLoading = (e: Event) => {
  const webView = e.target as Electron.WebviewTag
  webView.setAttribute('loading', 'false')
  refreshLoading()
}

const list: Ref<Electron.WebviewTag[]> = ref([])

onMounted(() => {
  list.value.forEach((webView) => {
    webView.addEventListener('did-start-navigation', beforeLoading)
    webView.addEventListener('did-finish-load', afterLoading)
  })

  instance.value[0] = items.value[0]
})

</script>

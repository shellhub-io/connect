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
          :ref="(el: Electron.WebviewTag) => setWebViewRef(el, index)"
          class="flex-fill fill-height"
        ></webview>
      </v-window-item>
    </v-window>
  </v-main>
</template>

<script setup lang="ts">
import { WebviewTag, DidStartNavigationEvent } from 'electron'
import { ref, onMounted, onBeforeUnmount, computed, Ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Instance, useAppStore } from '../stores'
import ServerListItem from '@renderer/components/ServerListItem.vue'

const store = useAppStore()
const router = useRouter()

const webViewRef = ref<WebviewTag>()

const items = ref(store.instances)
const instance = computed({
  get(): Array<Instance> {
    return [store.selectedInstance]
  },
  set(v: Array<Instance>) {
    if (v[0]) store.selectInstance(v[0])
  }
})
const url = ref('')
const isLoading = ref(true)

const setWebViewRef = (el: Electron.WebviewTag, idx: number) => {
  if (!el) return
  console.log(el)
  if (el) {
    if (!list.value[idx]) {
      list.value[idx] = { ref: el, name: 'ae' }
      el.src = items.value[idx].url
    }
  }
}

const window = ref(0);

const goBack = () => {
  router.push({ name: 'Login' })
}

const reload = () => {
  if (window.value == 1)
  window.value = 0
else if (window.value == 0)
window.value = 1
  
  //webViewRef.value?.reload()
}

const beforeLoading = (e: DidStartNavigationEvent) => {
  if (!e.isInPlace) isLoading.value = true
  if (e.isMainFrame) url.value = e.url
}

const afterLoading = () => {
  isLoading.value = false
}

interface Nada {
  name: string,
  ref: WebviewTag
};

const list: Ref<Nada[]> = ref([])

onMounted(() => {
  //alert(items.value.length)
  //const webView = webViewRef.value as WebviewTag

  //webView.src = store.selectedInstance.url

  //webView.addEventListener('did-start-navigation', beforeLoading)
  //webView.addEventListener('did-stop-loading', afterLoading)
  
  console.log('deu')
})

onBeforeUnmount(() => {
  //const webView = webViewRef.value as WebviewTag

  //webView.removeEventListener('did-start-navigation', beforeLoading)
  //webView.removeEventListener('did-stop-loading', afterLoading)
})
</script>

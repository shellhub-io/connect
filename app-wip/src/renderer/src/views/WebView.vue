<template>
  <transition
    name="fade"
    appear
  >

    <v-app-bar color="primary">
      <template #prepend>
        <v-app-bar-nav-icon
          variant="text"
          @click="goBack"
        >
          <v-icon>mdi-server</v-icon>
        </v-app-bar-nav-icon>
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

      <v-btn
        class="ml-2"
        variant="text"
        icon="mdi-refresh"
        @click="reload"
      ></v-btn>
    </v-app-bar>
  </transition>
  <v-main>
    <webview
      ref="webViewRef"
      style="flex: 1"
      class="fill-height"
    ></webview>
  </v-main>
</template>

<script setup lang="ts">
import { WebviewTag, DidStartNavigationEvent } from 'electron'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores'

const store = useAppStore()
const router = useRouter()

const webViewRef = ref<WebviewTag>()

const url = ref('')
const isLoading = ref(true)

const goBack = () => {
  router.push({ name: 'Login' })
}

const reload = () => {
  webViewRef.value?.reload()
}

const beforeLoading = (e: DidStartNavigationEvent) => {
  if (!e.isInPlace) isLoading.value = true
  url.value = e.url
}

const afterLoading = () => {
  isLoading.value = false
}

onMounted(() => {
  const webView = webViewRef.value as WebviewTag

  webView.src = store.selectedInstance.url

  webView.addEventListener('did-start-navigation', beforeLoading)
  webView.addEventListener('did-stop-loading', afterLoading)
})

onBeforeUnmount(() => {
  const webView = webViewRef.value as WebviewTag

  webView.removeEventListener('did-start-navigation', beforeLoading)
  webView.removeEventListener('did-stop-loading', afterLoading)
})
</script>

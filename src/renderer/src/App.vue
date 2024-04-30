<template>
  <v-app>
    <component :is="layout" />
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppLayout from './layouts/AppLayout.vue'

import './assets/global.css'

const components = {
  AppLayout
}

const layout = computed(() => components['AppLayout'])
</script>

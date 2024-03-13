<template>
  <v-app>
              <router-view :key="currentRoute.value.path" />
    
  </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from 'vue-router'

const router = useRouter();
const currentRoute = computed(() => router.currentRoute);
</script>

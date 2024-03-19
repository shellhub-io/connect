<template>
  <v-list-item :key="index" :value="item" lines="two" v-bind="props">
    <v-list-item-subtitle>
      {{ item.url }}
    </v-list-item-subtitle>

    <template #prepend>
      <div class="mr-4">
        <v-chip size="x-small" color="primary">v0.13.0</v-chip>
      </div>
    </template>
    <template #append>
      <v-btn
        :disabled="item.permanent"
        icon="mdi-delete"
        variant="plain"
        @click.stop="removeInstance(index)"
      ></v-btn>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { useAppStore, Instance } from '../stores'

const store = useAppStore()

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  item: {
    type: Object as PropType<Instance>,
    required: true
  },
});

const removeInstance = (index: number) => {
  // If the element is currently selected, select the previous element
  if (store.instances[index] === store.selectedInstance) {
    store.selectInstance(store.instances[index - 1])
  }

  store.deleteInstance(index)
}
</script>

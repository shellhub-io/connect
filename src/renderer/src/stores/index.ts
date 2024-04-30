import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export type Instance = {
  name: string
  url: string
  version: string
  permanent: boolean
}

const permanentInstance: Instance = {
  name: 'ShellHub Cloud',
  url: 'https://cloud.shellhub.io',
  version: '',
  permanent: true
}

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      layout: 'LoginLayout',
      url: '',
      instances: useStorage('instances', [permanentInstance], localStorage, {
        mergeDefaults: true,
        listenToStorageChanges: true
      }),
      selectedInstance: useStorage('default_instance', permanentInstance, localStorage, {
        mergeDefaults: true
      }),
      activeInstance: useStorage('active_instance', {} as Instance, localStorage, {
        mergeDefaults: true
      })
    }
  },

  actions: {
    setActiveInstance(instance: Instance) {
      this.activeInstance = instance
    },

    selectInstance(instance: Instance) {
      this.selectedInstance = instance
    },

    appendInstance(instance: Instance) {
      this.instances.push(instance)
    },

    deleteInstance(index: number) {
      this.instances.splice(index, 1)
    }
  }
})

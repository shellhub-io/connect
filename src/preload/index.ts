import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import {
  SSH,
  SSHConnection,
  SSHConnectionLocalPortForward,
  SSHConnectionDynamicPortForward
} from './index.d'

// Custom APIs for renderer
const api = {}

const ssh: SSH = {
  localPortForward: (settings: any): SSHConnection => {
    const localPortForwardInstance = new SSHConnectionLocalPortForward(settings)

    return {
      events: localPortForwardInstance.events,
      client: localPortForwardInstance.client,
      connect: localPortForwardInstance.connect.bind(localPortForwardInstance),
      disconnect: localPortForwardInstance.disconnect.bind(localPortForwardInstance),
      onAuth: localPortForwardInstance.onAuth.bind(localPortForwardInstance),
      onConnect: localPortForwardInstance.onConnect.bind(localPortForwardInstance),
      onError: localPortForwardInstance.onError.bind(localPortForwardInstance),
      onDisconnect: localPortForwardInstance.onDisconnect.bind(localPortForwardInstance)
    }
  },
  dynamicPortForward: (settings: any): SSHConnection => {
    const dynamicPortForwardInstance = new SSHConnectionDynamicPortForward(settings)

    return {
      events: dynamicPortForwardInstance.events,
      client: dynamicPortForwardInstance.client,
      connect: dynamicPortForwardInstance.connect.bind(dynamicPortForwardInstance),
      disconnect: dynamicPortForwardInstance.disconnect.bind(dynamicPortForwardInstance),
      onAuth: dynamicPortForwardInstance.onAuth.bind(dynamicPortForwardInstance),
      onConnect: dynamicPortForwardInstance.onConnect.bind(dynamicPortForwardInstance),
      onError: dynamicPortForwardInstance.onError.bind(dynamicPortForwardInstance),
      onDisconnect: dynamicPortForwardInstance.onDisconnect.bind(dynamicPortForwardInstance)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('ssh', ssh)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.ssh = ssh
}

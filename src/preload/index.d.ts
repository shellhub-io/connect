export * from './ssh/index.d'

import { ElectronAPI } from '@electron-toolkit/preload'
import EventEmitter from 'events'

export interface SSH {
  localPortForward(settings: any): SSHConnection
  dynamicPortForward(settings: any): SSHConnection
}

declare global {
  interface Window {
    ssh: SSH
    electron: ElectronAPI
    api: unknown
  }
}

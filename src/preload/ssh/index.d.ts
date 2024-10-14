import EventEmitter from 'node:events'
import ssh2 from 'ssh2'

export enum SSHEvent {
  Auth = 'auth',
  Connect = 'connect',
  Error = 'error',
  Disconnect = 'disconnect'
}

export class SSHEmitter extends EventEmitter {}

export type SSHPassword = {
  password: string
}

export type SSHPrivateKey = {
  privateKey: string | Buffer
}

export type SSHConnectionCreds = {
  host: string
  username: string
  namespace: string
  device: string
}

export type SSHLocalPortForwardSettings = {
  sourceAddr: string
  sourcePort: number
  destinationAddr: string
  destinationPort: number
}

export type SSHDynamicPortForwardSettings = {
  destinationAddr: string
  destinationPort: number
}

export interface SSHConnection {
  events: SSHEmitter
  client: ssh2.Client
  connect(creds: SSHConnectionCreds, auth: SSHPassword | SSHPrivateKey): void
  disconnect(): void
  onAuth(callback: any): void
  onConnect(callback: any): void
  onError(callback: any): void
  onDisconnect(callback: any): void
}

export * from './ssh'

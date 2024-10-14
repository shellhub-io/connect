import { Stream } from 'node:stream'
import net from 'node:net'
import {
  SSHConnection,
  SSHEvent,
  SSHEmitter,
  SSHConnectionCreds,
  SSHPassword,
  SSHPrivateKey
} from './index.d'
import socks from 'socksv5'
import ssh2 from 'ssh2'

export class SSHConnectionPortForward implements SSHConnection {
  client: any
  events: SSHEmitter

  constructor(_: any) {
    this.client = new ssh2.Client()
    this.events = new SSHEmitter()
  }

  connect(creds: SSHConnectionCreds, auth: SSHPassword | SSHPrivateKey) {
    try {
      this.client.connect({
        host: creds.host,
        username: `${creds.username}@${creds.namespace}.${creds.device}`,
        ...auth
      })
    } catch (err: unknown) {
      console.error('SSH client throw a expection', err)

      this.events.emit(SSHEvent.Error, err)
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end()
    }
  }

  onAuth(callback: any) {
    this.events.on(SSHEvent.Auth, callback)
  }

  onConnect(callback: any) {
    this.events.on(SSHEvent.Connect, callback)
  }

  onError(callback: any) {
    this.events.on(SSHEvent.Error, callback)
  }

  onDisconnect(callback: any) {
    this.events.on(SSHEvent.Disconnect, callback)
  }
}

export class SSHConnectionLocalPortForward extends SSHConnectionPortForward {
  constructor(settings: any) {
    super(settings)

    const server = net.createServer((socket: net.Socket) => {
      this.client.forwardOut(
        settings.sourceAddr,
        settings.sourcePort,
        settings.destinationAddr,
        settings.destinationPort,
        (err: Error, channel: any) => {
          try {
            if (err) {
              this.events.emit(SSHEvent.Error, err)

              return
            }

            channel.on('close', () => {
              console.debug('channel closed')
            })

            channel.on('error', (err: Error) => {
              console.debug('channel error', err)
            })

            socket.pipe(channel).pipe(socket)
          } catch (err: unknown) {
            console.debug('SSH channel throw an exception', err)
          }
        }
      )
    })

    server.on('close', () => {
      console.log('Local port forward closed')
    })

    server.on('error', (err: Error) => {
      console.debug('error called on server', err)
    })

    this.client.on('ready', () => {
      try {
        console.info('SSH connection authenticated')
        this.events.emit(SSHEvent.Auth)

        server.listen(settings.sourcePort, settings.sourceAddr, () => {
          console.log(
            `Local port forward started from ${settings.sourceAddr}:${settings.sourcePort} to ${settings.destinationAddr}:${settings.destinationPort}.`
          )

          this.events.emit(SSHEvent.Connect, settings.sourcePort, settings.sourceAddr)
        })
      } catch (err: unknown) {
        console.error('SSH ready throw an exception', err)

        server.close()
        this.events.emit(SSHEvent.Error, err)
      }
    })

    this.client.on('close', () => {
      console.debug('close called on client')

      server.close()
      this.events.emit(SSHEvent.Disconnect)
    })

    this.client.on('error', (err: unknown) => {
      console.error('error called on client', err)

      server.close()
      this.events.emit(SSHEvent.Error, err)
    })
  }
}

type Info = {
  srcAddr: string
  srcPort: number
  dstAddr: string
  dstPort: number
}

export class SSHConnectionDynamicPortForward extends SSHConnectionPortForward {
  constructor(settings: any) {
    super(settings)

    const server = socks.createServer(
      (info: Info, accept: (_: boolean) => any, deny: () => void) => {
        this.client.forwardOut(
          info.srcAddr,
          info.srcPort,
          info.dstAddr,
          info.dstPort,
          (err: Error, channel: Stream) => {
            try {
              if (err) {
                console.debug('SSH forwarding error:', err)
                this.events.emit(SSHEvent.Error, err)
                deny()

                return
              }

              channel.on('close', () => {
                console.debug('channel closed')
              })

              channel.on('error', (err: Error) => {
                console.debug('channel error', err)
              })

              const client = accept(true)
              channel.pipe(client).pipe(channel)
            } catch (err: unknown) {
              console.debug('SSH channel throw an exception', err)
            }
          }
        )
      }
    )

    server.on('close', () => {
      console.log('Dynamic port forward closed')
    })

    server.on('error', (err: Error) => {
      console.log('error called on server', err)
    })

    server.useAuth(socks.auth.None())

    this.client.on('ready', () => {
      try {
        console.info('SSH connection established')
        this.events.emit(SSHEvent.Auth)

        server.listen(settings.destinationPort, settings.destinationAddr, () => {
          console.log(
            `Dynamic port forward started from ${settings.destinationAddr}:${settings.destinationPort}.`
          )

          this.events.emit(SSHEvent.Connect, settings.destinationPort, settings.destinationAddr)
        })
      } catch (err: unknown) {
        console.error('SSH ready throw an exception', err)

        server.close()
        this.events.emit(SSHEvent.Error, err)
      }
    })

    this.client.on('close', () => {
      console.debug('close called on client')

      server.close()
      this.events.emit(SSHEvent.Disconnect)
    })

    this.client.on('error', (err: unknown) => {
      console.error('error called on client', err)

      server.close()
      this.events.emit(SSHEvent.Error, err)
    })
  }
}

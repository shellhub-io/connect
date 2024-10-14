import { describe, it, beforeEach, vi, expect } from 'vitest'
import { SSHConnectionCreds } from './index.d'
import {
  SSHConnectionPortForward,
  SSHConnectionLocalPortForward,
  SSHConnectionDynamicPortForward
} from './ssh'

import net from 'node:net'
import socks from 'socksv5'
import ssh2 from 'ssh2'

vi.mock('node:net')
vi.mock('socksv5')
vi.mock('ssh2')

let clientMock: any
let serverMock: any

beforeEach(() => {
  clientMock = {
    connect: vi.fn(),
    end: vi.fn(),
    forwardOut: vi.fn(),
    on: vi.fn()
  }

  serverMock = {
    listen: vi.fn(),
    on: vi.fn(),
    close: vi.fn(),
    useAuth: vi.fn()
  }

  vi.spyOn(ssh2, 'Client').mockImplementation(() => clientMock)
  vi.spyOn(net, 'createServer').mockReturnValue(serverMock as any)
  vi.spyOn(socks, 'createServer').mockReturnValue(serverMock as any)
})

describe('SSHConnectionPortForward', () => {
  it('should connect using provided auth', () => {
    const sshConnection = new SSHConnectionPortForward({})
    const creds: SSHConnectionCreds = {
      host: 'localhost',
      username: 'user',
      namespace: 'namespace',
      device: 'device'
    }

    sshConnection.connect(creds, {
      password: 'pass'
    })

    expect(clientMock.connect).toHaveBeenCalledWith({
      host: 'localhost',
      username: 'user@namespace.device',
      password: 'pass'
    })
  })

  it('should emit error event on connection error', () => {
    const sshConnection = new SSHConnectionPortForward({})

    const errorCallback = vi.fn()
    sshConnection.onError(errorCallback)

    const error = new Error('Connection failed')
    clientMock.connect.mockImplementation(() => {
      throw error
    })

    sshConnection.connect(
      {
        host: 'localhost',
        username: 'user',
        namespace: 'ns',
        device: 'dev'
      },
      {
        password: 'pass'
      }
    )

    expect(errorCallback).toHaveBeenCalledWith(error)
  })
})

describe('SSHConnectionLocalPortForward', () => {
  it('should start local port forwarding', () => {
    const settings = {
      sourceAddr: '127.0.0.1',
      sourcePort: 8000,
      destinationAddr: '192.168.1.10',
      destinationPort: 8080
    }

    new SSHConnectionLocalPortForward(settings)
    clientMock.on.mock.calls.find((call) => call[0] === 'ready')[1]()

    expect(serverMock.listen).toHaveBeenCalledWith(
      settings.sourcePort,
      settings.sourceAddr,
      expect.any(Function)
    )
  })
})

describe('SSHConnectionDynamicPortForward', () => {
  it('should start dynamic port forwarding', () => {
    const settings = {
      destinationAddr: '127.0.0.1',
      destinationPort: 1080
    }

    new SSHConnectionDynamicPortForward(settings)
    clientMock.on.mock.calls.find((call) => call[0] === 'ready')[1]()

    expect(serverMock.listen).toHaveBeenCalledWith(
      settings.destinationPort,
      settings.destinationAddr,
      expect.any(Function)
    )
  })

  it('should handle socks authentication', () => {
    const settings = {
      destinationAddr: '127.0.0.1',
      destinationPort: 1080
    }

    new SSHConnectionDynamicPortForward(settings)

    expect(serverMock.useAuth).toHaveBeenCalledWith(socks.auth.None())
  })
})

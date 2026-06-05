// Native capability bridge (chrome side).
//
// The embedded ShellHub web UI runs in an <iframe> served from the local reverse
// proxy (a different origin from this Vue chrome, which is served from wails://).
// Because of that origin boundary the iframe cannot call Wails/Go directly.
//
// Instead, the web UI posts a message to this chrome, and we relay the call to a
// whitelisted Go binding (or Wails runtime function), then post the result back.
// This is the only place that decides what the embedded UI is allowed to do.
//
// Wire protocol (window.postMessage), both directions tagged `__shellhubBridge`:
//
//   web UI  -> chrome : { __shellhubBridge: 'call', id, method, args }
//   chrome  -> web UI : { __shellhubBridge: 'result', id, result }
//                     | { __shellhubBridge: 'error',  id, error  }
//
// SECURITY: every message is checked against the active instance's proxy origin,
// and only methods present in HANDLERS can be invoked. Private SSH key material
// never crosses the bridge — SSHService.Sign signs in Go behind a native consent
// dialog and returns only the signature.

import { Browser, Window } from '@wailsio/runtime'
import { InstanceService, SSHService } from '@bindings'

type Handler = (...args: unknown[]) => unknown | Promise<unknown>

// The allow-list. Add a line here to expose a new native capability to the web UI.
const HANDLERS: Record<string, Handler> = {
  // Window controls
  'window.minimise': () => Window.Minimise(),
  'window.toggleMaximise': () => Window.ToggleMaximise(),
  'window.close': () => Window.Close(),
  'window.fullscreen': () => Window.ToggleFullscreen(),

  // OS integration
  'browser.openURL': (url) => Browser.OpenURL(String(url)),

  // Instance management
  'instance.validate': (url) => InstanceService.Validate(String(url)),

  // SSH (mini ssh-agent — private keys never leave Go)
  'ssh.listPublicKeys': () => SSHService.ListPublicKeys(),
  'ssh.sign': (keyName, dataB64) => SSHService.Sign(String(keyName), String(dataB64))
}

interface BridgeCall {
  __shellhubBridge: 'call'
  id: string
  method: string
  args?: unknown[]
}

function isBridgeCall(value: unknown): value is BridgeCall {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, unknown>).__shellhubBridge === 'call' &&
    typeof (value as Record<string, unknown>).id === 'string' &&
    typeof (value as Record<string, unknown>).method === 'string'
  )
}

/**
 * Installs the postMessage relay.
 *
 * @param getIframe        returns the live iframe element (or undefined)
 * @param getAllowedOrigin returns the origin currently allowed to call the bridge
 *                         (the active instance's proxy origin)
 */
export function installNativeBridge(
  getIframe: () => HTMLIFrameElement | undefined,
  getAllowedOrigin: () => string
): () => void {
  const onMessage = async (event: MessageEvent) => {
    const iframe = getIframe()
    if (!iframe || event.source !== iframe.contentWindow) return

    const allowed = getAllowedOrigin()
    if (!allowed || event.origin !== allowed) return

    if (!isBridgeCall(event.data)) return
    const { id, method, args = [] } = event.data

    const post = (payload: Record<string, unknown>) =>
      iframe.contentWindow?.postMessage(
        { __shellhubBridge: payload.error !== undefined ? 'error' : 'result', id, ...payload },
        event.origin
      )

    const handler = HANDLERS[method]
    if (!handler) {
      post({ error: `method not allowed: ${method}` })
      return
    }

    try {
      post({ result: await handler(...args) })
    } catch (err) {
      post({ error: err instanceof Error ? err.message : String(err) })
    }
  }

  window.addEventListener('message', onMessage)
  return () => window.removeEventListener('message', onMessage)
}

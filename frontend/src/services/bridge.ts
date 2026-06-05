// Native capability bridge — EXAMPLE / TEMPLATE (not currently wired).
//
// This is a working reference for letting the embedded ShellHub web UI invoke
// native (Go/Wails) capabilities. It is intentionally NOT installed today: the
// real ShellHub web UI does not call anything in the desktop shell yet. It is
// kept here as the canonical example so the bridge can be turned on later
// without rediscovering the design.
//
// Why a bridge is needed at all: the instance's web UI runs in an <iframe>
// served from the local reverse proxy (a different origin from this Vue chrome,
// which is served from wails://). Because of that origin boundary the iframe
// cannot call Wails/Go directly. Instead it posts a message to this chrome, and
// the chrome relays the call to a whitelisted Go binding / runtime function and
// posts the result back.
//
// Wire protocol (window.postMessage), both directions tagged `__shellhubBridge`:
//   web UI  -> chrome : { __shellhubBridge: 'call', id, method, args }
//   chrome  -> web UI : { __shellhubBridge: 'result', id, result }
//                     | { __shellhubBridge: 'error',  id, error  }
//
// To enable it: import { installNativeBridge } in AppLayout's onMounted and call
//   installNativeBridge(() => webViewRef.value,
//                       () => proxyUrl.value ? new URL(proxyUrl.value).origin : '')
// then call its returned disposer in onBeforeUnmount.
//
// SECURITY when enabling: the iframe loads remote (potentially untrusted)
// content laundered through the loopback proxy origin, so the origin check alone
// is NOT a trust boundary — every method added to HANDLERS is reachable by
// whatever the active instance serves. Keep the whitelist minimal, and gate any
// sensitive capability (e.g. signing with a local SSH key) behind an explicit
// per-call native consent prompt. See docs/native-bridge.md.

import { Browser, Window } from '@wailsio/runtime'
import { InstanceService } from '@bindings'

type Handler = (...args: unknown[]) => unknown | Promise<unknown>

// Example allow-list. Add a line here to expose a native capability to the web UI.
const HANDLERS: Record<string, Handler> = {
  'window.minimise': () => Window.Minimise(),
  'window.toggleMaximise': () => Window.ToggleMaximise(),
  'window.close': () => Window.Close(),
  'browser.openURL': (url) => Browser.OpenURL(String(url)),
  'instance.validate': (url) => InstanceService.Validate(String(url))
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
 * Installs the postMessage relay. Currently unused — see the file header.
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

# Native Capability Bridge — Protocol

> **Status: not wired today.** The ShellHub web UI does not call anything in the
> desktop shell yet, so the bridge is kept as a dormant **example/template** in
> [`frontend/src/services/bridge.ts`](../frontend/src/services/bridge.ts) (it is not
> installed). This document is the reference for turning it on later. An earlier
> SSH proof-of-concept (`ssh.listPublicKeys` / `ssh.sign` + a Go `SSHService`) was
> removed; it lives on here only as a worked example of a *sensitive* capability.

The desktop app embeds the ShellHub web UI of the **active instance** inside an
`<iframe>`. The iframe is served from a local reverse proxy (`http://127.0.0.1:<port>`),
which is a **different origin** from the Vue chrome that hosts it (served from
`wails://`). Because of that origin boundary, code running inside the embedded web
UI **cannot call Wails/Go directly** — the Wails runtime only works same-origin.

To still give the (first-party) web UI access to native capabilities — e.g. reading
the user's local SSH keys — the chrome exposes a **postMessage bridge**: the web UI
posts a request, the chrome relays it to a whitelisted Go binding, and posts the
result back.

```
 iframe: ShellHub web UI            chrome: Vue (wails://)            Go (Wails services)
 (http://127.0.0.1:<port>)
        │  postMessage(call)  ───────────►  origin + whitelist check
        │                                   └─ Wails binding call  ───►  service method
        │  ◄───────── postMessage(result/error) ◄────────────────────  return / error
```

The chrome side lives in [`frontend/src/services/bridge.ts`](../frontend/src/services/bridge.ts).
This document specifies the wire protocol so the **web SDK** (to be added to the
`shellhub` / `cloud` web frontend) can be implemented against it.

## Transport

`window.postMessage`. The web UI posts to `window.parent`; the chrome posts back to
`iframe.contentWindow`. Every message carries a `__shellhubBridge` discriminator.

## Messages

### Request (web UI → chrome)

```ts
{
  __shellhubBridge: 'call',
  id: string,        // unique per call (e.g. crypto.randomUUID())
  method: string,    // a whitelisted method name (see below)
  args?: unknown[]    // positional arguments
}
```

### Response (chrome → web UI)

```ts
// success
{ __shellhubBridge: 'result', id: string, result: unknown }
// failure
{ __shellhubBridge: 'error',  id: string, error: string }
```

`id` echoes the request so the SDK can match concurrent calls.

## Security model

- **Origin check.** The chrome only accepts messages whose `event.origin` equals the
  active instance's proxy origin, and whose `event.source` is the embedded iframe.
- **Whitelist.** Only method names present in `HANDLERS` (in `bridge.ts`) are callable.
  Anything else returns `error: "method not allowed: …"`.
- **No private key exfiltration.** Operations that touch private key material run
  entirely in Go and are gated behind a **native consent dialog**. The private key
  never crosses the bridge — callers receive signatures, not keys.

## Example whitelist (in `bridge.ts`)

These are the example handlers currently defined in the (dormant) `bridge.ts`:

| Method                  | Args               | Returns | Notes |
|-------------------------|--------------------|---------|-------|
| `window.minimise`       | —                  | `void`  | |
| `window.toggleMaximise` | —                  | `void`  | |
| `window.close`          | —                  | `void`  | |
| `browser.openURL`       | `(url: string)`    | `void`  | opens in system browser |
| `instance.validate`     | `(url: string)`    | `Info`  | server-side `/info` fetch (`InstanceService`) |

`Info` is the Go model in [`internal/services`](../internal/services) (generated TS in
`frontend/bindings`).

### Future example: a *sensitive* capability (SSH signing)

A removed proof-of-concept exposed local SSH keys. If reintroduced, it is the model for a
sensitive capability: a Go `SSHService` with `ListPublicKeys()` (free) and
`Sign(keyName, dataB64)` gated behind a **native consent dialog**, where the **private key never
crosses the bridge** — callers receive a signature, not the key. Note the consent dialog must be
implemented so it actually blocks until the user answers (Wails v3 `Dialog.Question().Show()` does
not block on its own — use a channel around the button `OnClick` callbacks).

## Reference web SDK (to implement later in the web repo)

```ts
const PENDING = new Map<string, { resolve: (v: unknown) => void; reject: (e: unknown) => void }>()

window.addEventListener('message', (e) => {
  const m = e.data
  if (!m || (m.__shellhubBridge !== 'result' && m.__shellhubBridge !== 'error')) return
  const p = PENDING.get(m.id)
  if (!p) return
  PENDING.delete(m.id)
  m.__shellhubBridge === 'result' ? p.resolve(m.result) : p.reject(new Error(m.error))
})

export function callNative<T = unknown>(method: string, ...args: unknown[]): Promise<T> {
  const id = crypto.randomUUID()
  return new Promise<T>((resolve, reject) => {
    PENDING.set(id, { resolve: resolve as (v: unknown) => void, reject })
    window.parent.postMessage({ __shellhubBridge: 'call', id, method, args }, '*')
  })
}

// Detect we're running inside the desktop shell (refine with a handshake if needed).
export const isDesktop = window.parent !== window

// Example: pick a local key and sign a challenge without ever seeing the private key.
export async function signWithLocalKey(keyName: string, challenge: Uint8Array) {
  const dataB64 = btoa(String.fromCharCode(...challenge))
  return callNative<string>('ssh.sign', keyName, dataB64)
}
```

## Adding a new capability

1. Add (or reuse) a method on a Go service in `internal/services`.
2. `wails3 generate bindings` (or it regenerates on `wails3 dev` / build).
3. Add one line to `HANDLERS` in `frontend/src/services/bridge.ts`.
4. Document it in the table above.

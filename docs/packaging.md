# Packaging & CI notes

The app is built with Wails v3. CI (`.github/workflows/build.yml`) builds on each platform's
native runner:

| Platform | Artifact(s) | Tooling |
|----------|-------------|---------|
| Linux    | `.AppImage`, `.deb`, `.rpm` | `wails3 task linux:create:*` (AppImage via linuxdeploy; deb/rpm via nfpm) |
| Windows  | `.exe` (NSIS installer) | `wails3 task package` (needs NSIS on the runner) |
| macOS    | `.app` (zipped) | `wails3 task package` (ad-hoc signed; notarization not set up) |

## GTK4 vs GTK3 (important)

The toolchain currently targets **GTK4 / WebKitGTK 6.0** (the Wails v3 default). The Linux package
dependencies in `build/linux/nfpm/nfpm.yaml` (`libgtk-4-1`, `libwebkitgtk-6.0-4`, `gtk4`,
`webkitgtk6.0`) match this.

- **Pro:** modern, future-proof webview.
- **Con:** WebKitGTK 6.0 only exists on recent distros (Ubuntu 24.04+, Fedora recent, Arch).

A **GTK3 / WebKitGTK 4.1** build is also possible via the `gtk3` build tag
(`wails3 task ... EXTRA_TAGS=gtk3`), which runs on far more distros (Ubuntu 22.04+). If you switch,
you must **also** update `nfpm.yaml` to depend on `libgtk-3-0` / `libwebkit2gtk-4.1-0` (and the
rpm/arch equivalents), and build the Linux CI job on `ubuntu-22.04`. Keep the build tag and the
package dependencies consistent.

## AppImage: it bundles libs — but the BUILD HOST must have them

`wails3 generate appimage` uses `linuxdeploy` + its GTK plugin, which copies the needed shared
libraries **into** the AppImage so the result is self-contained. The catch: linuxdeploy can only
bundle a library that exists **on the build host**. If a referenced lib is missing on the builder, it
fails with `Could not find dependency: <lib>` — this is a *build-host* problem, not a runtime one.

Two libs commonly trip this on modern/dev machines:
- **`libcroco-0.6.so.3`** — the GTK plugin still references this obsolete lib. Removed from Arch and
  recent Ubuntu. Fix: install it on the builder so it gets bundled (CI installs `libcroco3`, falling
  back to the archived `.deb`).
- **`libffi.so.7`** — only seen locally on a dev box where VMware ships its own
  `/usr/lib/vmware/lib/libgobject-2.0.so.0` (linked against the old libffi) and pollutes library
  resolution. This is host contamination, **not** an app dependency, and does not occur on clean CI
  runners.

So: on a clean Ubuntu runner with `libcroco3` present, the AppImage bundles everything and is fully
self-contained. The CI guarantees `libcroco` and isolates the AppImage step (`continue-on-error`) so a
host hiccup never drops the `.deb` / `.rpm` (those use nfpm and never invoke linuxdeploy).

If you'd rather avoid this entirely, build the Linux job with the **GTK3** stack on `ubuntu-22.04`
(where libcroco is available) — but then update `nfpm.yaml` to the GTK3 dependencies to stay
consistent.

## Local commands

```bash
wails3 task linux:create:deb        # -> bin/<name>.deb   (reliable)
wails3 task linux:create:rpm        # -> bin/<name>.rpm   (reliable)
wails3 task linux:create:appimage   # -> bin/<name>.AppImage (needs libcroco on host)
wails3 task package                 # all of the above for the current OS
```

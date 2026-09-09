# polyfill

`navigator.kindle` polyfill for running [PED](https://github.com/einkdisplay/ped) pages in a normal browser/dev environment.

## Usage

```html
<script src="./index.js"></script>
```

The script installs `navigator.kindle` automatically when it does not already exist.

## Behavior

- `navigator.kindle.screen.width/height`: report the current browser viewport size.
- `navigator.kindle.device.network()` / `navigator.kindle.device.battery()`: return fixed mock values.
- Screen refresh APIs (`refreshNow`, `beginRefresh`, `setAutoRefresh`) simulate behavior in JavaScript and print logs to `console`.

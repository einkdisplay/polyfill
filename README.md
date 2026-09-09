# `potatoeinkdisplay-polyfill`

Browser/dev polyfill for [PED](https://github.com/einkdisplay/ped)'s
`navigator.kindle` API.

On a real Kindle, PED provides `navigator.kindle` natively. This package
installs a compatible mock so the same pages can run in a normal browser.

TypeScript definitions are provided via
[`potatoeinkdisplay-types`](https://www.npmjs.com/package/potatoeinkdisplay-types).

## Install

```sh
pnpm add potatoeinkdisplay-polyfill
# or: npm / yarn equivalent
```

## Usage

### ESM / bundler

```ts
import "potatoeinkdisplay-polyfill";

await navigator.kindle.screen.refreshNow({ waveform: "quality" });
const battery = await navigator.kindle.device.battery();
```

### Script tag

```html
<script type="module" src="./node_modules/potatoeinkdisplay-polyfill/index.js"></script>
```

The script installs `navigator.kindle` automatically when it does not already
exist. Existing native implementations are left untouched.

## TypeScript

Importing the package pulls in ambient `navigator.kindle` types from
`potatoeinkdisplay-types`:

```ts
import "potatoeinkdisplay-polyfill";

navigator.kindle.screen.width;
```

You can also reference the types package directly:

```ts
/// <reference types="potatoeinkdisplay-types" />
```

## Behavior

- `navigator.kindle.screen.width` / `height`: current browser viewport size
- `navigator.kindle.device.network()` / `battery()`: fixed mock values
- Screen refresh APIs (`refreshNow`, `beginRefresh`, `setAutoRefresh`): simulated
  in JavaScript and logged to `console`

## License

Unlicense (public domain). See `LICENSE`.

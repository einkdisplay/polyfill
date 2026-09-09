/**
 * Side-effect browser polyfill for PED's `navigator.kindle` API.
 *
 * Importing this module installs `navigator.kindle` when it is missing.
 * Type definitions come from `potatoeinkdisplay-types`.
 *
 * @example
 * ```ts
 * import "potatoeinkdisplay-polyfill";
 *
 * await navigator.kindle.screen.refreshNow({ waveform: "quality" });
 * ```
 */
/// <reference types="potatoeinkdisplay-types" />

export {};

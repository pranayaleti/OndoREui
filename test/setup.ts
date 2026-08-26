import React from "react";
import "@testing-library/jest-dom/vitest";

(globalThis as unknown as { React: typeof React }).React = React;

// jsdom does not implement ResizeObserver. Radix UI primitives (RadioGroup,
// Popover, Select…) load @radix-ui/react-use-size which touches it during
// layout effects. A no-op polyfill is enough for component tests.
if (typeof globalThis.ResizeObserver === "undefined") {
  class ResizeObserverPolyfill {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver =
    ResizeObserverPolyfill;
}

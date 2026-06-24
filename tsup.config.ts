import { defineConfig } from "tsup"

// @luxwallet/ui ships compiled JS so consumers (extension webpack, desktop ERB,
// mobile metro) need no special transpile config. @hanzo/gui + react +
// react-native + react-native-svg stay EXTERNAL (peers) — the consumer supplies
// them, and @hanzo/gui's own precompiled output handles web (react-native-web)
// vs native. react-native-svg resolves to the web shim on web and the native
// module on RN, so the ChainIcon paints cross-target with no bundled platform
// dep. The component tree is platform-neutral (one source), so the
// react-native and browser export conditions both point at the same ESM build.
export default defineConfig({
  entry: {
    index: "src/index.ts",
    theme: "src/theme/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["@hanzo/gui", "react", "react-dom", "react-native", "react-native-web", "react-native-svg"],
  outExtension({ format }) {
    return { js: format === "esm" ? ".mjs" : ".cjs" }
  },
})

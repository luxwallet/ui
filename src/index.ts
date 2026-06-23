/**
 * @luxwallet/ui — the shared, cross-target Lux Wallet UI component library.
 *
 * One component tree renders on web (via react-native-web), the browser
 * extension, the desktop app, and native React Native, because everything
 * here builds on @hanzo/gui (a peer dependency) and inherits its
 * `react-native` / `browser` export conditions.
 *
 * Layers:
 *   - provider  : WalletUIProvider (wraps @hanzo/gui's GuiProvider)
 *   - brand     : white-label copy + theme flow in via prop, read via context
 *   - theme     : default brand tokens + runtime white-label applier
 *   - components: thin primitives over @hanzo/gui
 *   - screens   : prop-driven screen shells (no @luxwallet/sdk coupling)
 *
 * Decoupling rule: this library is PURE PRESENTATION. It takes data and
 * callbacks via props and never imports @luxwallet/sdk, performs RPC, or
 * signs. The core (built in parallel) wires data in.
 */

// Provider
export { WalletUIProvider } from "./WalletUIProvider"
export type { WalletUIProviderProps } from "./WalletUIProvider"

// Brand context (white-label copy + theme flow in via prop, read via context)
export { BrandProvider, useBrand } from "./brand"
export type { WalletBrand } from "./brand"

// Theme
export {
  type WalletThemeTokens,
  type WalletColorScheme,
  luxDark,
  luxLight,
  walletThemes,
  cssVarName,
  applyBrandTheme,
} from "./theme"

// Chains (presentation metadata for the 5 login ecosystems)
export {
  type ChainKind,
  type ChainMeta,
  LOGIN_CHAINS,
  shortenAddress,
} from "./chains"

// Primitives
export * from "./components"

// Screens
export * from "./screens"

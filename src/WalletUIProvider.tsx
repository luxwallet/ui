/**
 * WalletUIProvider — the single provider a wallet app mounts.
 *
 * It wraps @hanzo/gui's `GuiProvider` (so apps don't mount two providers)
 * and applies the Lux brand tokens. White-label deployments pass `tokens`
 * to override colors at runtime; on web these become CSS variables, on
 * native they are available via the theme exports.
 *
 * Cross-target: this file is plain React + @hanzo/gui. It compiles to both
 * the web (`browser`) and native (`react-native`) builds unchanged —
 * @hanzo/gui resolves the right target underneath via its own export
 * conditions, so there is exactly ONE provider component for all platforms.
 */
import { useEffect, type ReactNode } from "react"
import { GuiProvider } from "@hanzo/gui"
import { applyBrandTheme } from "./theme/applyBrandTheme"
import type { WalletColorScheme, WalletThemeTokens } from "./theme/tokens"

export interface WalletUIProviderProps {
  children: ReactNode
  /** Active color scheme. Wallet is dark-first. */
  scheme?: WalletColorScheme
  /** Runtime brand token overrides (white-label). Partial — merged over defaults. */
  tokens?: Partial<WalletThemeTokens>
  /** Pre-built @hanzo/gui config from `createGui()`, if the app has one. */
  guiConfig?: unknown
}

export function WalletUIProvider({
  children,
  scheme = "dark",
  tokens,
  guiConfig,
}: WalletUIProviderProps): React.JSX.Element {
  // Push brand tokens to CSS vars on web; no-op on native. Runs on every
  // scheme/token change so white-label swaps take effect without remount.
  useEffect(() => {
    applyBrandTheme(tokens ?? {}, scheme)
  }, [tokens, scheme])

  return (
    <GuiProvider defaultTheme={scheme} config={guiConfig}>
      {children}
    </GuiProvider>
  )
}

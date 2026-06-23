/**
 * WalletUIProvider — the single provider a wallet app mounts.
 *
 * It wraps @hanzo/gui's `GuiProvider` (so apps don't mount two providers),
 * applies brand theme tokens at runtime, and exposes the brand to components
 * via context. White-label deployments pass a `brand` (or fine-grained
 * `tokens`) to override colors and copy WITHOUT forking; on web token values
 * become CSS variables, on native they are available via the theme exports.
 *
 * Brand-neutral by construction: this provider has NO hardcoded org name and
 * does NOT import @luxwallet/brand. The app supplies the brand object (any
 * shape that satisfies `WalletBrand` — a full BrandConfig does).
 *
 * Cross-target: this file is plain React + @hanzo/gui. It compiles to both
 * the web (`browser`) and native (`react-native`) builds unchanged —
 * @hanzo/gui resolves the right target underneath via its own export
 * conditions, so there is exactly ONE provider component for all platforms.
 */
import { useEffect, useMemo, type ReactNode } from "react"
import { GuiProvider } from "@hanzo/gui"
import { applyBrandTheme } from "./theme/applyBrandTheme"
import type { WalletColorScheme, WalletThemeTokens } from "./theme/tokens"
import { BrandProvider, type WalletBrand } from "./brand"

export interface WalletUIProviderProps {
  children: ReactNode
  /**
   * Active brand (white-label). Supplies copy (shortName/name) and theme
   * tokens. A full @luxwallet/brand BrandConfig satisfies the shape. Omit for
   * brand-neutral defaults.
   */
  brand?: WalletBrand
  /** Active color scheme. Wallet is dark-first. */
  scheme?: WalletColorScheme
  /**
   * Fine-grained brand token overrides. Merged OVER `brand.theme` so an app
   * can tweak individual tokens on top of its brand.
   */
  tokens?: Partial<WalletThemeTokens>
  /** Pre-built @hanzo/gui config from `createGui()`, if the app has one. */
  guiConfig?: unknown
}

export function WalletUIProvider({
  children,
  brand,
  scheme = "dark",
  tokens,
  guiConfig,
}: WalletUIProviderProps): React.JSX.Element {
  // brand.theme first, explicit tokens win — both optional.
  const resolvedTokens = useMemo<Partial<WalletThemeTokens>>(
    () => ({ ...brand?.theme, ...tokens }),
    [brand?.theme, tokens],
  )

  // Push brand tokens to CSS vars on web; no-op on native. Runs on every
  // scheme/token change so white-label swaps take effect without remount.
  useEffect(() => {
    applyBrandTheme(resolvedTokens, scheme)
  }, [resolvedTokens, scheme])

  return (
    <BrandProvider value={brand}>
      <GuiProvider defaultTheme={scheme} config={guiConfig}>
        {children}
      </GuiProvider>
    </BrandProvider>
  )
}

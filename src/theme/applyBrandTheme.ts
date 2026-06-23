/**
 * Runtime white-label theming.
 *
 * Web/extension: writes the token set as CSS custom properties on
 * `:root` so the brand can be swapped at runtime from a `brand.json`
 * overlay WITHOUT rebuilding. Native: no-ops gracefully (no `document`);
 * native apps pass tokens straight into the @hanzo/gui config instead.
 *
 * This is the "white-label via runtime tokens, not forks" rule made real.
 */
import { cssVarName, walletThemes, type WalletColorScheme, type WalletThemeTokens } from "./tokens"

/**
 * Apply a token set as CSS variables on the document root (web only).
 * Returns the resolved tokens that were applied (useful for SSR/testing).
 */
export function applyBrandTheme(
  tokens: Partial<WalletThemeTokens>,
  scheme: WalletColorScheme = "dark",
): WalletThemeTokens {
  const resolved: WalletThemeTokens = { ...walletThemes[scheme], ...tokens }

  if (typeof document !== "undefined") {
    const root = document.documentElement
    for (const key of Object.keys(resolved) as Array<keyof WalletThemeTokens>) {
      root.style.setProperty(cssVarName(key), resolved[key])
    }
  }

  return resolved
}

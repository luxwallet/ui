/**
 * Lux Wallet brand tokens.
 *
 * These extend the @hanzo/gui theme with wallet-specific, brand-aware color
 * tokens. They are PLAIN VALUES (not a fork of the gui theme) — apps merge
 * them into their @hanzo/gui config or expose them as CSS variables.
 *
 * WHITE-LABEL: every value here is a default. Deployments (Lux, Zoo, Pars,
 * white-labels) override at RUNTIME via `applyBrandTheme()` (CSS vars on web)
 * or by passing overrides to `<WalletUIProvider tokens={...}>` — NEVER by
 * forking this file. The token *names* are the stable contract; the *values*
 * are swappable per brand.
 *
 * Token shape intentionally mirrors the wallet runtime brand-theme contract
 * (accent/surface/neutral/status families) so the same `brand.json` overlay
 * that a deployment ships can drive both the wallet core and this UI library.
 */

/** The brand-aware color token contract. Stable names; swappable values. */
export interface WalletThemeTokens {
  /** Primary accent — buttons, links, active states. */
  accent1: string
  accent1Hovered: string
  accent2: string
  /** App background surfaces, from base to raised. */
  surface1: string
  surface2: string
  surface3: string
  /** Text/foreground, from highest to lowest emphasis. */
  neutral1: string
  neutral2: string
  neutral3: string
  /** Contrast color drawn ON an accent fill. */
  neutralContrast: string
  background: string
  /** Status colors for finality, validation, risk. */
  statusSuccess: string
  statusCritical: string
  statusWarning: string
  /** Modal scrim. */
  scrim: string
}

/** Lux dark theme (default — wallet is dark-first). Monochrome Lux brand. */
export const luxDark: WalletThemeTokens = {
  accent1: "#FFFFFF",
  accent1Hovered: "#E4E4E7",
  accent2: "#A3A3A3",
  surface1: "#000000",
  surface2: "#0A0A0A",
  surface3: "#1A1A1A",
  neutral1: "#FFFFFF",
  neutral2: "rgba(255, 255, 255, 0.65)",
  neutral3: "rgba(255, 255, 255, 0.40)",
  neutralContrast: "#000000",
  background: "#000000",
  statusSuccess: "#22C55E",
  statusCritical: "#EF4444",
  statusWarning: "#F59E0B",
  scrim: "rgba(0, 0, 0, 0.6)",
}

/** Lux light theme. */
export const luxLight: WalletThemeTokens = {
  accent1: "#000000",
  accent1Hovered: "#131313",
  accent2: "#52525B",
  surface1: "#FFFFFF",
  surface2: "#F9F9F9",
  surface3: "#F1F1F1",
  neutral1: "#131313",
  neutral2: "rgba(19, 19, 19, 0.63)",
  neutral3: "rgba(19, 19, 19, 0.40)",
  neutralContrast: "#FFFFFF",
  background: "#FFFFFF",
  statusSuccess: "#16A34A",
  statusCritical: "#DC2626",
  statusWarning: "#D97706",
  scrim: "rgba(0, 0, 0, 0.4)",
}

export type WalletColorScheme = "light" | "dark"

export const walletThemes: Record<WalletColorScheme, WalletThemeTokens> = {
  dark: luxDark,
  light: luxLight,
}

/** CSS custom-property name for a token, e.g. `accent1` -> `--lw-accent1`. */
export function cssVarName(token: keyof WalletThemeTokens): string {
  return `--lw-${token}`
}

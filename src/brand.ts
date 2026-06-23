/**
 * Brand context for @luxwallet/ui.
 *
 * The UI library is PURE PRESENTATION and stays brand-NEUTRAL: it has NO
 * hardcoded org name and does NOT depend on @luxwallet/brand. Instead an app
 * passes a brand object into `WalletUIProvider`; components read the parts they
 * need (short name for labels, theme tokens) from context.
 *
 * `WalletBrand` is the minimal structural shape the UI consumes — a superset
 * `BrandConfig` from @luxwallet/brand satisfies it, so the app can pass its
 * full brand straight through without any adapter.
 */
import { createContext, useContext } from "react"
import type { WalletThemeTokens } from "./theme/tokens"

/** The minimal brand shape the UI reads. A full BrandConfig satisfies this. */
export interface WalletBrand {
  /** Display name, e.g. "Lux Wallet". Used in titles. */
  name: string
  /** Short name, e.g. "Lux". Used in compact labels ("Continue with Lux"). */
  shortName: string
  /** Theme token overrides applied at runtime (CSS vars on web). */
  theme?: Partial<WalletThemeTokens>
}

const BrandContext = createContext<WalletBrand | undefined>(undefined)

export const BrandProvider = BrandContext.Provider

/**
 * Read the active brand, or `undefined` if no brand was provided. Components
 * MUST tolerate `undefined` (brand-neutral by default) and fall back to
 * generic copy — never to a hardcoded org name.
 */
export function useBrand(): WalletBrand | undefined {
  return useContext(BrandContext)
}

/**
 * Default IAM button label for a brand. `Continue with <shortName>`, or a
 * generic "Continue" with NO org name when no brand is set. Pure (no React)
 * so it is unit-testable and reused by ConnectWallet.
 */
export function brandIamLabel(brand?: WalletBrand): string {
  return brand ? `Continue with ${brand.shortName}` : "Continue"
}

/** IAM helper subtext for a brand. Brand-neutral when no brand is set. */
export function brandIamSubtext(brand?: WalletBrand): string {
  return brand
    ? `Google, GitHub, email, or password — secured by ${brand.shortName} IAM.`
    : "Google, GitHub, email, or password."
}

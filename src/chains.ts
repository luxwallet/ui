/**
 * Chain kinds the wallet UI knows how to render. Matches the five
 * ecosystems supported by @luxwallet/connect (SIWx multi-chain login):
 * EVM, Solana, Bitcoin, TON, XRP.
 *
 * This is a PRESENTATION enum only — address formats, RPC, and signing live
 * in @luxwallet/sdk. The UI uses `ChainKind` purely to pick an icon, a label,
 * and an address-shortening style. No business logic here.
 */
export type ChainKind = "evm" | "solana" | "bitcoin" | "ton" | "xrp"

export interface ChainMeta {
  kind: ChainKind
  /** Human label for the wallet picker / chain badge. */
  label: string
  /** Single-glyph mark used when no logo asset is supplied. */
  glyph: string
}

/** The canonical five login chains, in display order. */
export const LOGIN_CHAINS: readonly ChainMeta[] = [
  { kind: "evm", label: "EVM", glyph: "◆" },
  { kind: "solana", label: "Solana", glyph: "◎" },
  { kind: "bitcoin", label: "Bitcoin", glyph: "₿" },
  { kind: "ton", label: "TON", glyph: "💎" },
  { kind: "xrp", label: "XRP", glyph: "✕" },
] as const

/**
 * Shorten an address for display, e.g. `0xA1B2…3F4E`. Pure formatting; the
 * UI never validates — validation is the SDK's job and arrives via props.
 */
export function shortenAddress(address: string, lead = 6, tail = 4): string {
  if (address.length <= lead + tail + 1) return address
  return `${address.slice(0, lead)}…${address.slice(-tail)}`
}

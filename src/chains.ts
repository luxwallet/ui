/**
 * Chain kinds the wallet UI knows how to render. Matches the seven
 * ecosystems supported by @luxwallet/connect (SIWx multi-chain login):
 * EVM, Solana, Bitcoin, TON, XRP, Polkadot, Cardano.
 *
 * This is a PRESENTATION enum only — address formats, RPC, and signing live
 * in @luxwallet/sdk. The UI uses `ChainKind` purely to pick an icon, a label,
 * and an address-shortening style. No business logic here.
 */
export type ChainKind = "evm" | "solana" | "bitcoin" | "ton" | "xrp" | "polkadot" | "cardano"

export interface ChainMeta {
  kind: ChainKind
  /** Human label for the wallet picker / chain badge. */
  label: string
  /**
   * Single-glyph fallback mark used when the SVG `ChainIcon` can't render
   * (or a host opts out). The real logo is `ChainIcon kind={kind}`.
   */
  glyph: string
}

/**
 * The canonical seven login chains, in display order — the exact set
 * @luxwallet/connect verifies (evm/solana/bitcoin/ton/xrp/polkadot/cardano).
 * Each carries a glyph FALLBACK; the primary mark is the SVG `ChainIcon`.
 */
export const LOGIN_CHAINS: readonly ChainMeta[] = [
  { kind: "evm", label: "Ethereum / EVM", glyph: "◆" },
  { kind: "solana", label: "Solana", glyph: "◎" },
  { kind: "bitcoin", label: "Bitcoin", glyph: "₿" },
  { kind: "ton", label: "TON", glyph: "💎" },
  { kind: "xrp", label: "XRP", glyph: "✕" },
  { kind: "polkadot", label: "Polkadot", glyph: "⬡" },
  { kind: "cardano", label: "Cardano", glyph: "₳" },
] as const

/**
 * Shorten an address for display, e.g. `0xA1B2…3F4E`. Pure formatting; the
 * UI never validates — validation is the SDK's job and arrives via props.
 */
export function shortenAddress(address: string, lead = 6, tail = 4): string {
  if (address.length <= lead + tail + 1) return address
  return `${address.slice(0, lead)}…${address.slice(-tail)}`
}

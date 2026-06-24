/**
 * ChainBadge — a compact pill showing a chain's logo + label. Pure
 * presentation; the chain kind/label come from props (the SDK decides which
 * chain is active). Used by TokenRow, ConnectWallet, Receive, Bridge.
 *
 * The mark is the real `ChainIcon` SVG (cross-target) when `kind` is a known
 * login chain; the single-glyph `glyph` is kept only as a fallback for
 * free-form ecosystem chains (e.g. "Lux C-Chain") that have no ChainIcon.
 */
import { XStack, Text } from "@hanzo/gui"
import type { ChainKind } from "../chains"
import { LOGIN_CHAINS } from "../chains"
import { ChainIcon } from "./ChainIcon"

export interface ChainBadgeProps {
  /** Known login-chain kind, or a free-form label for ecosystem chains. */
  kind?: ChainKind
  /** Explicit label override (e.g. "Lux C-Chain", "Zoo L1"). */
  label?: string
  glyph?: string
}

export function ChainBadge({ kind, label, glyph }: ChainBadgeProps): React.JSX.Element {
  const meta = kind ? LOGIN_CHAINS.find((c) => c.kind === kind) : undefined
  const text = label ?? meta?.label ?? "Chain"
  // Real SVG mark for known chains; glyph fallback only when there's no kind.
  const fallbackGlyph = glyph ?? meta?.glyph ?? "●"

  return (
    <XStack
      alignItems="center"
      gap="$1"
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$10"
      backgroundColor="$surface3"
    >
      {kind ? <ChainIcon kind={kind} size={14} /> : <Text fontSize={12}>{fallbackGlyph}</Text>}
      <Text fontSize={12} color="$neutral2">
        {text}
      </Text>
    </XStack>
  )
}

/**
 * ChainBadge — a compact pill showing a chain's glyph + label. Pure
 * presentation; the chain kind/label come from props (the SDK decides which
 * chain is active). Used by TokenRow, ConnectWallet, Receive, Bridge.
 */
import { XStack, Text } from "@hanzo/gui"
import type { ChainKind } from "../chains"
import { LOGIN_CHAINS } from "../chains"

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
  const mark = glyph ?? meta?.glyph ?? "●"

  return (
    <XStack
      alignItems="center"
      gap="$1"
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$10"
      backgroundColor="$surface3"
    >
      <Text fontSize={12}>{mark}</Text>
      <Text fontSize={12} color="$neutral2">
        {text}
      </Text>
    </XStack>
  )
}

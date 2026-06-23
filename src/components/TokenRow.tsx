/**
 * TokenRow — one asset line in the portfolio or an asset picker: symbol,
 * optional sub-label (the chain or source), the balance, and an optional USD
 * value. Tapping it fires `onPress`. The `confidential` flag renders the
 * balance as a ciphertext indicator (F-Chain privacy mode) — the actual
 * decrypted value is never computed here.
 */
import { XStack, YStack, Text, ListItem } from "@hanzo/gui"
import type { ReactNode } from "react"
import { ChainBadge } from "./ChainBadge"
import type { ChainKind } from "../chains"

export interface TokenRowProps {
  symbol: string
  /** Pre-formatted balance, e.g. "1,250.00". Ignored when `confidential`. */
  balance: string
  /** Pre-formatted USD value, e.g. "$42,718.93". */
  usdValue?: string
  /** Secondary label under the symbol, e.g. "C-Chain" or "Hanzo earnings". */
  subLabel?: ReactNode
  chainKind?: ChainKind
  chainLabel?: string
  /** Render balance as ●●●●●● (privacy mode). */
  confidential?: boolean
  onPress?: () => void
}

export function TokenRow({
  symbol,
  balance,
  usdValue,
  subLabel,
  chainKind,
  chainLabel,
  confidential,
  onPress,
}: TokenRowProps): React.JSX.Element {
  return (
    <ListItem
      onPress={onPress}
      pressTheme={Boolean(onPress)}
      hoverTheme={Boolean(onPress)}
      borderRadius="$4"
      padding="$3"
      testID={`token-row-${symbol}`}
    >
      <XStack flex={1} alignItems="center" justifyContent="space-between" gap="$3">
        <YStack gap="$1">
          <XStack alignItems="center" gap="$2">
            <Text fontSize={15} fontWeight="600" color="$neutral1">
              {symbol}
            </Text>
            {chainKind || chainLabel ? (
              <ChainBadge kind={chainKind} label={chainLabel} />
            ) : null}
          </XStack>
          {subLabel ? (
            <Text fontSize={12} color="$neutral2">
              {subLabel}
            </Text>
          ) : null}
        </YStack>
        <YStack alignItems="flex-end" gap="$1">
          <Text fontSize={15} color="$neutral1">
            {confidential ? "●●●●●●" : balance}
          </Text>
          {usdValue ? (
            <Text fontSize={12} color="$neutral2">
              {usdValue}
            </Text>
          ) : null}
        </YStack>
      </XStack>
    </ListItem>
  )
}

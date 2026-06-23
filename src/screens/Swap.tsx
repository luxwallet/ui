/**
 * Swap screen shell (SCREENS.md §3 — DEX Swap).
 *
 * From/To token panels, a route selector, slippage + price-impact readout, a
 * fee line, and a Review button. PURE PRESENTATION: the router (best route,
 * quote, price impact) is @luxwallet/sdk's job; results arrive via props.
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { AmountInput } from "../components/AmountInput"
import { Button } from "../components/Button"
import { ScreenScaffold } from "../components/ScreenScaffold"

export interface SwapProps {
  /** Active route label, e.g. "Zoo L1 (Zoo DEX V3)". */
  routeLabel: string
  onSelectRoute?: () => void

  fromSymbol: string
  fromAmount: string
  onChangeFromAmount: (next: string) => void
  fromBalanceLabel?: string
  onMaxFrom?: () => void

  toSymbol: string
  /** Quoted output amount (read-only, from the router). */
  toAmount: string
  toUsdQuote?: string

  /** Pre-formatted, e.g. "0.5%". */
  slippageLabel?: string
  /** Pre-formatted, e.g. "0.02%". */
  priceImpactLabel?: string
  /** Pre-formatted, e.g. "30 bps". */
  poolFeeLabel?: string
  feeLabel?: string

  canReview: boolean
  onReview: () => void
  onBack?: () => void
}

export function Swap(props: SwapProps): React.JSX.Element {
  const {
    routeLabel,
    onSelectRoute,
    fromSymbol,
    fromAmount,
    onChangeFromAmount,
    fromBalanceLabel,
    onMaxFrom,
    toSymbol,
    toAmount,
    toUsdQuote,
    slippageLabel,
    priceImpactLabel,
    poolFeeLabel,
    feeLabel,
    canReview,
    onReview,
    onBack,
  } = props

  return (
    <ScreenScaffold
      title="Swap"
      onBack={onBack}
      footer={
        <Button disabled={!canReview} onPress={onReview}>
          Review swap
        </Button>
      }
    >
      <Card title="Route">
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize={14} color="$neutral1">
            {routeLabel}
          </Text>
          <Button tone="secondary" full={false} size="$2" onPress={onSelectRoute}>
            Change
          </Button>
        </XStack>
      </Card>

      <Card title="From">
        <AmountInput
          value={fromAmount}
          onChange={onChangeFromAmount}
          symbol={fromSymbol}
          balanceLabel={fromBalanceLabel}
          onMax={onMaxFrom}
        />
      </Card>

      <XStack justifyContent="center">
        <Text fontSize={18} color="$neutral2">
          ⇅
        </Text>
      </XStack>

      <Card title="To">
        <AmountInput
          value={toAmount}
          onChange={() => undefined}
          symbol={toSymbol}
          usdQuote={toUsdQuote}
          disabled
        />
      </Card>

      <Card>
        {slippageLabel || priceImpactLabel ? (
          <XStack justifyContent="space-between">
            <Text fontSize={13} color="$neutral2">
              Slippage {slippageLabel ?? "—"}
            </Text>
            <Text fontSize={13} color="$neutral2">
              Price impact {priceImpactLabel ?? "—"}
            </Text>
          </XStack>
        ) : null}
        {poolFeeLabel ? (
          <XStack justifyContent="space-between">
            <Text fontSize={13} color="$neutral2">
              Pool fee tier
            </Text>
            <Text fontSize={13} color="$neutral1">
              {poolFeeLabel}
            </Text>
          </XStack>
        ) : null}
        {feeLabel ? (
          <XStack justifyContent="space-between">
            <Text fontSize={13} color="$neutral2">
              Network fee
            </Text>
            <Text fontSize={13} color="$neutral1">
              {feeLabel}
            </Text>
          </XStack>
        ) : null}
      </Card>
    </ScreenScaffold>
  )
}

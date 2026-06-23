/**
 * Bridge screen shell (SCREENS.md §5 — Bridge).
 *
 * Source/destination chain selectors, asset + amount, recipient, a route
 * preview (lock → threshold-sign → mint) with ETA, and a Confirm button.
 * PURE PRESENTATION: supported destinations, route steps, and fees come from
 * @luxwallet/sdk via props.
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { AmountInput } from "../components/AmountInput"
import { Button } from "../components/Button"
import { ScreenScaffold } from "../components/ScreenScaffold"
import { shortenAddress } from "../chains"

export interface BridgeRouteStep {
  /** Pre-formatted step, e.g. "Lock on Zoo L1". */
  label: string
}

export interface BridgeProps {
  fromChainLabel: string
  onSelectFromChain?: () => void
  toChainLabel: string
  onSelectToChain?: () => void

  assetSymbol: string
  amount: string
  onChangeAmount: (next: string) => void
  amountError?: string
  onMax?: () => void

  /** Recipient address (defaults to the user's own wallet). */
  recipient: string
  /** Open recipient editor (app warns on change). */
  onEditRecipient?: () => void

  /** Ordered route steps shown in the preview. */
  routeSteps?: BridgeRouteStep[]
  /** Pre-formatted ETA, e.g. "~30 seconds". */
  etaLabel?: string
  /** Pre-formatted bridge fee, e.g. "0.5 ZOO". */
  feeLabel?: string

  canConfirm: boolean
  submitting?: boolean
  onConfirm: () => void
  onBack?: () => void
}

export function Bridge(props: BridgeProps): React.JSX.Element {
  const {
    fromChainLabel,
    onSelectFromChain,
    toChainLabel,
    onSelectToChain,
    assetSymbol,
    amount,
    onChangeAmount,
    amountError,
    onMax,
    recipient,
    onEditRecipient,
    routeSteps,
    etaLabel,
    feeLabel,
    canConfirm,
    submitting,
    onConfirm,
    onBack,
  } = props

  return (
    <ScreenScaffold
      title="Bridge"
      onBack={onBack}
      footer={
        <Button disabled={!canConfirm || submitting} onPress={onConfirm}>
          {submitting ? "Bridging…" : "Confirm bridge"}
        </Button>
      }
    >
      <Card>
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize={13} color="$neutral2">
            From
          </Text>
          <Button tone="secondary" full={false} size="$2" onPress={onSelectFromChain}>
            {fromChainLabel}
          </Button>
        </XStack>
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize={13} color="$neutral2">
            To
          </Text>
          <Button tone="secondary" full={false} size="$2" onPress={onSelectToChain}>
            {toChainLabel}
          </Button>
        </XStack>
      </Card>

      <Card title="Asset">
        <AmountInput
          value={amount}
          onChange={onChangeAmount}
          symbol={assetSymbol}
          onMax={onMax}
          error={amountError}
        />
      </Card>

      <Card title="Recipient">
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize={13} color="$neutral1">
            {shortenAddress(recipient)}
          </Text>
          <Button tone="secondary" full={false} size="$2" onPress={onEditRecipient}>
            Change
          </Button>
        </XStack>
      </Card>

      {routeSteps && routeSteps.length > 0 ? (
        <Card title="Bridge route">
          {routeSteps.map((step, i) => (
            <Text key={step.label} fontSize={13} color="$neutral1">
              {i + 1}. {step.label}
            </Text>
          ))}
          {etaLabel ? (
            <Text fontSize={12} color="$neutral2">
              ETA: {etaLabel}
            </Text>
          ) : null}
        </Card>
      ) : null}

      {feeLabel ? (
        <XStack justifyContent="space-between">
          <Text fontSize={13} color="$neutral2">
            Bridge fee
          </Text>
          <Text fontSize={13} color="$neutral1">
            {feeLabel}
          </Text>
        </XStack>
      ) : null}
    </ScreenScaffold>
  )
}

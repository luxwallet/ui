/**
 * Send screen shell (SCREENS.md §2 — Send).
 *
 * Form: source asset, recipient address, amount, fee preview, privacy toggle,
 * and a triple-consensus finality preview. PURE PRESENTATION: validation
 * results (`addressError`, `amountError`), fee strings, and the USD quote are
 * computed by @luxwallet/sdk and passed in; `canSubmit` gates the button.
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { AddressField } from "../components/AddressField"
import { AmountInput } from "../components/AmountInput"
import { Button } from "../components/Button"
import { ChainBadge } from "../components/ChainBadge"
import { ScreenScaffold } from "../components/ScreenScaffold"
import type { ChainKind } from "../chains"

/** One step of the triple-consensus finality preview. */
export interface FinalityStep {
  label: string
  /** "done" = ✓, "pending" = ⏱. */
  state: "done" | "pending"
}

export interface SendProps {
  /** Source asset symbol, e.g. "$ZOO". */
  symbol: string
  /** Source chain label, e.g. "Zoo L1". */
  chainLabel: string
  chainKind?: ChainKind
  /** Pre-formatted balance line, e.g. "Balance: 95,000 ZOO". */
  balanceLabel: string

  toAddress: string
  onChangeToAddress: (next: string) => void
  addressError?: string
  onScanAddress?: () => void

  amount: string
  onChangeAmount: (next: string) => void
  amountError?: string
  usdQuote?: string
  onMax?: () => void

  /** Pre-formatted network fee, e.g. "0.0042 ZOO  (~$0.001)". */
  feeLabel?: string

  privacyOn?: boolean
  onTogglePrivacy?: () => void

  /** Triple-consensus preview rows (BLS / Corona / ML-DSA). */
  finality?: FinalityStep[]

  canSubmit: boolean
  submitting?: boolean
  onSubmit: () => void
  onBack?: () => void
}

export function Send(props: SendProps): React.JSX.Element {
  const {
    symbol,
    chainLabel,
    chainKind,
    balanceLabel,
    toAddress,
    onChangeToAddress,
    addressError,
    onScanAddress,
    amount,
    onChangeAmount,
    amountError,
    usdQuote,
    onMax,
    feeLabel,
    privacyOn,
    onTogglePrivacy,
    finality,
    canSubmit,
    submitting,
    onSubmit,
    onBack,
  } = props

  return (
    <ScreenScaffold
      title="Send"
      onBack={onBack}
      footer={
        <Button disabled={!canSubmit || submitting} onPress={onSubmit}>
          {submitting ? "Signing…" : "Sign & Send"}
        </Button>
      }
    >
      <Card>
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize={15} fontWeight="600" color="$neutral1">
            From: {symbol}
          </Text>
          <ChainBadge kind={chainKind} label={chainLabel} />
        </XStack>
        <Text fontSize={12} color="$neutral2">
          {balanceLabel}
        </Text>
      </Card>

      <Card title="To">
        <AddressField
          value={toAddress}
          onChange={onChangeToAddress}
          error={addressError}
          onScan={onScanAddress}
        />
      </Card>

      <Card title="Amount">
        <AmountInput
          value={amount}
          onChange={onChangeAmount}
          symbol={symbol}
          usdQuote={usdQuote}
          onMax={onMax}
          error={amountError}
        />
      </Card>

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

      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={13} color="$neutral2">
          Privacy
        </Text>
        <Button tone="secondary" full={false} size="$2" onPress={onTogglePrivacy}>
          {privacyOn ? "on" : "off"}
        </Button>
      </XStack>

      {finality && finality.length > 0 ? (
        <Card title="Finality">
          {finality.map((step) => (
            <XStack key={step.label} gap="$2" alignItems="center">
              <Text fontSize={13} color={step.state === "done" ? "$statusSuccess" : "$neutral2"}>
                {step.state === "done" ? "✓" : "⏱"}
              </Text>
              <Text fontSize={13} color="$neutral1">
                {step.label}
              </Text>
            </XStack>
          ))}
        </Card>
      ) : null}
    </ScreenScaffold>
  )
}

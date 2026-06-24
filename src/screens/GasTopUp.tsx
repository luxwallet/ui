/**
 * GasTopUp screen shell (SCREENS.md — Gas Top-Up).
 *
 * Buy the native gas token on a selected chain by paying with a stablecoin or
 * token held in another balance: pick the chain, pick the pay token, enter an
 * amount, read the receive + fee quote, then confirm. PURE PRESENTATION: the
 * pay-token list, the receive estimate, the fee, and the `canSubmit` gate are
 * all computed by @luxwallet/sdk and arrive via props. No quoting, no RPC, no
 * signing here.
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { AmountInput } from "../components/AmountInput"
import { Button } from "../components/Button"
import { ChainBadge } from "../components/ChainBadge"
import { TokenRow } from "../components/TokenRow"
import { ScreenScaffold } from "../components/ScreenScaffold"
import type { ChainKind } from "../chains"

/** A token the user can spend to buy gas. */
export interface GasPayToken {
  id: string
  symbol: string
  /** Pre-formatted balance line, e.g. "Balance 1,250.00". */
  balanceLabel?: string
}

export interface GasTopUpProps {
  /** Destination chain label, e.g. "Lux C-Chain" — gas is bought here. */
  chainLabel: string
  chainKind?: ChainKind
  /** Open the chain picker. Omit to lock the destination chain. */
  onSelectChain?: () => void

  /** Tokens available to pay with (other balances). */
  payTokens: GasPayToken[]
  selectedPayTokenId?: string
  onSelectPayToken: (id: string) => void

  amount: string
  onChangeAmount: (next: string) => void
  amountError?: string

  /** Pre-formatted gas the user receives, e.g. "≈ 0.0125 LUX". */
  receiveLabel?: string
  /** Pre-formatted network fee, e.g. "0.40 USDC  (~$0.40)". */
  feeLabel?: string

  canSubmit: boolean
  submitting?: boolean
  onSubmit: () => void
  onBack?: () => void
}

export function GasTopUp(props: GasTopUpProps): React.JSX.Element {
  const {
    chainLabel,
    chainKind,
    onSelectChain,
    payTokens,
    selectedPayTokenId,
    onSelectPayToken,
    amount,
    onChangeAmount,
    amountError,
    receiveLabel,
    feeLabel,
    canSubmit,
    submitting,
    onSubmit,
    onBack,
  } = props

  const selectedToken = payTokens.find((t) => t.id === selectedPayTokenId)

  return (
    <ScreenScaffold
      title="Gas Top-Up"
      onBack={onBack}
      footer={
        <Button disabled={!canSubmit || submitting} onPress={onSubmit}>
          {submitting ? "Buying…" : "Buy gas"}
        </Button>
      }
    >
      <Card title="Buy gas on">
        <XStack alignItems="center" justifyContent="space-between">
          <ChainBadge kind={chainKind} label={chainLabel} />
          {onSelectChain ? (
            <Button tone="secondary" full={false} size="$2" onPress={onSelectChain}>
              Change
            </Button>
          ) : null}
        </XStack>
      </Card>

      <Card title="Pay with">
        {payTokens.map((token) => {
          const selected = token.id === selectedPayTokenId
          return (
            <YStack
              key={token.id}
              borderRadius="$4"
              borderWidth={1}
              borderColor={selected ? "$accent1" : "transparent"}
              backgroundColor={selected ? "$surface3" : "transparent"}
            >
              <TokenRow
                symbol={token.symbol}
                balance=""
                subLabel={token.balanceLabel}
                onPress={() => onSelectPayToken(token.id)}
              />
            </YStack>
          )
        })}
      </Card>

      <Card title="Amount">
        <AmountInput
          value={amount}
          onChange={onChangeAmount}
          symbol={selectedToken?.symbol ?? ""}
          balanceLabel={selectedToken?.balanceLabel}
          error={amountError}
        />
      </Card>

      {receiveLabel || feeLabel ? (
        <Card>
          {receiveLabel ? (
            <XStack justifyContent="space-between">
              <Text fontSize={13} color="$neutral2">
                You receive
              </Text>
              <Text fontSize={13} color="$neutral1">
                {receiveLabel}
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
      ) : null}
    </ScreenScaffold>
  )
}

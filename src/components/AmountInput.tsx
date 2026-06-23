/**
 * AmountInput — numeric amount entry with a token symbol, an optional USD
 * quote line, and a Max button. Pure presentation: the parsed value, USD
 * quote, and balance all come from props; this component just emits the raw
 * string via `onChange` and fires `onMax`.
 */
import { XStack, YStack, Input, Text, Button } from "@hanzo/gui"

export interface AmountInputProps {
  value: string
  onChange: (next: string) => void
  /** Token symbol shown inside the field, e.g. "ZOO". */
  symbol: string
  /** Pre-formatted USD quote, e.g. "≈ $245.00 USD". */
  usdQuote?: string
  /** Pre-formatted available balance line, e.g. "Balance 95,000". */
  balanceLabel?: string
  onMax?: () => void
  error?: string
  disabled?: boolean
}

export function AmountInput({
  value,
  onChange,
  symbol,
  usdQuote,
  balanceLabel,
  onMax,
  error,
  disabled,
}: AmountInputProps): React.JSX.Element {
  return (
    <YStack gap="$1">
      <XStack gap="$2" alignItems="center">
        <Input
          flex={1}
          value={value}
          onChangeText={onChange}
          placeholder="0.00"
          keyboardType="decimal-pad"
          editable={!disabled}
          testID="amount-input"
        />
        <Text fontSize={15} fontWeight="600" color="$neutral1">
          {symbol}
        </Text>
        {onMax ? (
          <Button size="$2" chromeless onPress={onMax} testID="amount-max">
            Max
          </Button>
        ) : null}
      </XStack>
      <XStack justifyContent="space-between">
        {usdQuote ? (
          <Text fontSize={12} color="$neutral2">
            {usdQuote}
          </Text>
        ) : (
          <Text fontSize={12}> </Text>
        )}
        {balanceLabel ? (
          <Text fontSize={12} color="$neutral2">
            {balanceLabel}
          </Text>
        ) : null}
      </XStack>
      {error ? (
        <Text fontSize={12} color="$statusCritical">
          {error}
        </Text>
      ) : null}
    </YStack>
  )
}

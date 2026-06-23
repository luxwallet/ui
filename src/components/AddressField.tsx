/**
 * AddressField — recipient address input with paste/scan affordances and an
 * inline validation hint. The component does NOT validate; it renders the
 * `error` string the SDK passes back. `onScan` is a callback (the QR scanner
 * lives in the app/SDK layer, not in this pure-UI library).
 */
import { XStack, YStack, Input, Text, Button } from "@hanzo/gui"

export interface AddressFieldProps {
  value: string
  onChange: (next: string) => void
  placeholder?: string
  /** Validation message from the SDK; rendered in the critical color. */
  error?: string
  /** Invoked when the user taps the QR/scan button (app opens scanner). */
  onScan?: () => void
  disabled?: boolean
}

export function AddressField({
  value,
  onChange,
  placeholder = "Recipient address or *.lux name",
  error,
  onScan,
  disabled,
}: AddressFieldProps): React.JSX.Element {
  return (
    <YStack gap="$1">
      <XStack gap="$2" alignItems="center">
        <Input
          flex={1}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          disabled={disabled}
          testID="address-field-input"
        />
        {onScan ? (
          <Button size="$3" onPress={onScan} testID="address-field-scan">
            QR
          </Button>
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

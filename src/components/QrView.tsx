/**
 * QrView — the framed container for a QR code on the Receive screen.
 *
 * It does NOT generate the QR matrix: encoding (and the choice of QR library
 * per platform — SVG on native, canvas on web) belongs to the app/SDK layer.
 * The caller renders the actual code into `children`; this component owns only
 * the white card, sizing, and the address caption beneath. Keeping generation
 * out of this library is what lets the same UI ship to web + native without a
 * platform-specific QR dependency leaking in.
 */
import { YStack, Text } from "@hanzo/gui"
import type { ReactNode } from "react"

export interface QrViewProps {
  /** The rendered QR element (canvas/svg/img) supplied by the app. */
  children?: ReactNode
  /** Pre-formatted address shown under the code. */
  address: string
  size?: number
}

export function QrView({ children, address, size = 220 }: QrViewProps): React.JSX.Element {
  return (
    <YStack alignItems="center" gap="$3">
      <YStack
        width={size}
        height={size}
        alignItems="center"
        justifyContent="center"
        backgroundColor="#FFFFFF"
        borderRadius="$6"
        padding="$3"
        testID="qr-view-frame"
      >
        {children ?? (
          <Text color="#000000" fontSize={12}>
            QR
          </Text>
        )}
      </YStack>
      <Text fontSize={13} color="$neutral2" textAlign="center">
        {address}
      </Text>
    </YStack>
  )
}

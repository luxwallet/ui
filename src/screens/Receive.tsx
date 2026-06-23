/**
 * Receive screen shell (SCREENS.md §2 — Receive).
 *
 * Shows the account's receive address as a QR plus copy/share actions and a
 * chain selector. The QR element itself is supplied by the app via `qr`
 * (encoding is a runtime/platform concern — see QrView). PURE PRESENTATION.
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import type { ReactNode } from "react"
import { Card } from "../components/Card"
import { QrView } from "../components/QrView"
import { Button } from "../components/Button"
import { ChainBadge } from "../components/ChainBadge"
import { ScreenScaffold } from "../components/ScreenScaffold"
import type { ChainKind } from "../chains"

export interface ReceiveProps {
  accountName: string
  address: string
  /** Rendered QR node from the app (svg/canvas). Optional — falls back to a frame. */
  qr?: ReactNode
  /** Currently selected receive chain. */
  chainLabel: string
  chainKind?: ChainKind
  onCopy?: () => void
  onShare?: () => void
  /** Open the chain switcher (app owns the chain list / routing). */
  onSwitchChain?: () => void
  onBack?: () => void
}

export function Receive({
  accountName,
  address,
  qr,
  chainLabel,
  chainKind,
  onCopy,
  onShare,
  onSwitchChain,
  onBack,
}: ReceiveProps): React.JSX.Element {
  return (
    <ScreenScaffold title="Receive" onBack={onBack}>
      <Card>
        <Text fontSize={15} fontWeight="600" color="$neutral1">
          {accountName}
        </Text>
        <QrView address={address}>{qr}</QrView>
        <XStack gap="$2" justifyContent="center">
          <Button full={false} flex={1} onPress={onCopy}>
            Copy address
          </Button>
          <Button tone="secondary" full={false} flex={1} onPress={onShare}>
            Share
          </Button>
        </XStack>
      </Card>

      <Card title="Chain">
        <XStack alignItems="center" justifyContent="space-between">
          <ChainBadge kind={chainKind} label={chainLabel} />
          <Button tone="secondary" full={false} size="$2" onPress={onSwitchChain}>
            Switch chain
          </Button>
        </XStack>
      </Card>
    </ScreenScaffold>
  )
}

/**
 * Portfolio screen shell (SCREENS.md §1 — Account / Portfolio View).
 *
 * Top-level dashboard: account header, total value, grouped asset rows, and
 * the primary action bar. PURE PRESENTATION — every value (balances, USD
 * total, confidential flags) arrives via props from the app's portfolio
 * context, which is fed by @luxwallet/sdk. No fetching, no math here.
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { TokenRow } from "../components/TokenRow"
import { Button } from "../components/Button"
import { ScreenScaffold } from "../components/ScreenScaffold"
import { shortenAddress, type ChainKind } from "../chains"

export interface PortfolioAsset {
  symbol: string
  balance: string
  usdValue?: string
  subLabel?: string
  chainKind?: ChainKind
  chainLabel?: string
  confidential?: boolean
}

export interface PortfolioSection {
  title: string
  assets: PortfolioAsset[]
}

export interface PortfolioProps {
  /** Account display name, e.g. "zach.lux". */
  accountName: string
  address: string
  /** Pre-formatted total, e.g. "$42,718.93". */
  totalUsd: string
  /** Pre-formatted 24h change, e.g. "▲ 2.4% 24h". */
  changeLabel?: string
  /** Whether privacy mode is on (controls the header toggle copy). */
  privacyOn?: boolean
  sections: PortfolioSection[]
  onCopyAddress?: () => void
  onShowReceiveQr?: () => void
  onTogglePrivacy?: () => void
  onSelectAsset?: (asset: PortfolioAsset) => void
  onSend?: () => void
  onReceive?: () => void
  onSwap?: () => void
  onStake?: () => void
  onBridge?: () => void
  onOpenSettings?: () => void
}

export function Portfolio({
  accountName,
  address,
  totalUsd,
  changeLabel,
  privacyOn,
  sections,
  onCopyAddress,
  onShowReceiveQr,
  onTogglePrivacy,
  onSelectAsset,
  onSend,
  onReceive,
  onSwap,
  onStake,
  onBridge,
  onOpenSettings,
}: PortfolioProps): React.JSX.Element {
  return (
    <ScreenScaffold
      title="Lux Wallet"
      headerRight={
        <Button tone="secondary" full={false} size="$2" onPress={onOpenSettings}>
          ⚙
        </Button>
      }
      footer={
        <XStack gap="$2" justifyContent="space-between">
          <Button full={false} flex={1} onPress={onSend}>
            Send
          </Button>
          <Button full={false} flex={1} onPress={onReceive}>
            Receive
          </Button>
          <Button full={false} flex={1} onPress={onSwap}>
            Swap
          </Button>
          <Button full={false} flex={1} onPress={onStake}>
            Stake
          </Button>
          <Button full={false} flex={1} onPress={onBridge}>
            Bridge
          </Button>
        </XStack>
      }
    >
      <Card>
        <Text fontSize={15} fontWeight="600" color="$neutral1">
          {accountName}
        </Text>
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize={13} color="$neutral2">
            {shortenAddress(address)}
          </Text>
          <XStack gap="$2">
            <Button tone="secondary" full={false} size="$2" onPress={onCopyAddress}>
              Copy
            </Button>
            <Button tone="secondary" full={false} size="$2" onPress={onShowReceiveQr}>
              QR
            </Button>
          </XStack>
        </XStack>
      </Card>

      <Card title="Total value (USD)">
        <XStack alignItems="baseline" justifyContent="space-between">
          <Text fontSize={28} fontWeight="700" color="$neutral1">
            {totalUsd}
          </Text>
          {changeLabel ? (
            <Text fontSize={13} color="$statusSuccess">
              {changeLabel}
            </Text>
          ) : null}
        </XStack>
      </Card>

      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={13} color="$neutral2">
          Assets
        </Text>
        <Button tone="secondary" full={false} size="$2" onPress={onTogglePrivacy}>
          {privacyOn ? "Privacy: on" : "Privacy: off"}
        </Button>
      </XStack>

      {sections.map((section) => (
        <Card key={section.title} title={section.title}>
          {section.assets.map((asset) => (
            <TokenRow
              key={`${section.title}:${asset.symbol}:${asset.subLabel ?? ""}`}
              symbol={asset.symbol}
              balance={asset.balance}
              usdValue={asset.usdValue}
              subLabel={asset.subLabel}
              chainKind={asset.chainKind}
              chainLabel={asset.chainLabel}
              confidential={asset.confidential}
              onPress={onSelectAsset ? () => onSelectAsset(asset) : undefined}
            />
          ))}
        </Card>
      ))}
    </ScreenScaffold>
  )
}

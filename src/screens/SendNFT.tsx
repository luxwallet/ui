/**
 * SendNFT screen shell (SCREENS.md — Send NFT / Collectible).
 *
 * Transfer a single NFT/collectible: asset preview, recipient address with
 * inline validation, and a gas/fee preview before signing. PURE PRESENTATION —
 * address validation (`addressError`), the fee string, and the `canSubmit`
 * gate are all computed by @luxwallet/sdk and passed in. No fetching, no
 * signing, no math here.
 *
 * Forked from Send.tsx: same ScreenScaffold + Card section layout, swapping the
 * fungible From/Amount block for a non-fungible asset preview and dropping the
 * privacy/finality controls (an NFT transfer is a single indivisible move).
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { AddressField } from "../components/AddressField"
import { Button } from "../components/Button"
import { ChainBadge } from "../components/ChainBadge"
import { ScreenScaffold } from "../components/ScreenScaffold"
import type { ChainKind } from "../chains"

/** The collectible being transferred. Pre-formatted by the SDK/app layer. */
export interface SendNftAsset {
  /** Token name, e.g. "Lux Genesis #128". */
  name: string
  /** Artwork URL. Surfaced as the preview's accessible label (no Image atom
   *  exists in this lib yet — see `notes`); the app may render the bitmap. */
  imageUrl?: string
  /** Collection / series name, e.g. "Lux Genesis". */
  collectionName?: string
  /** Chain the token lives on, used to pick the badge glyph/label. */
  chainKind?: ChainKind
  /** Quantity for semi-fungible (ERC-1155) tokens, e.g. "3". Omit for 1-of-1. */
  amount?: string
}

export interface SendNFTProps {
  /** The collectible being sent. */
  nft: SendNftAsset

  toAddress: string
  onChangeToAddress: (next: string) => void
  addressError?: string
  onScanAddress?: () => void

  /** Pre-formatted network fee, e.g. "0.0042 LUX  (~$0.001)". */
  feeLabel?: string

  canSubmit: boolean
  submitting?: boolean
  onSubmit: () => void
  onBack?: () => void
}

/** First letter of the name (uppercased) for the artwork fallback monogram. */
function nftMonogram(name: string): string {
  const ch = name.trim().charAt(0)
  return ch ? ch.toUpperCase() : "?"
}

export function SendNFT(props: SendNFTProps): React.JSX.Element {
  const {
    nft,
    toAddress,
    onChangeToAddress,
    addressError,
    onScanAddress,
    feeLabel,
    canSubmit,
    submitting,
    onSubmit,
    onBack,
  } = props

  return (
    <ScreenScaffold
      title="Send NFT"
      onBack={onBack}
      footer={
        <Button
          disabled={!canSubmit || submitting}
          onPress={onSubmit}
          testID="send-nft-submit"
        >
          {submitting ? "Signing…" : "Sign & Send"}
        </Button>
      }
    >
      <Card>
        <XStack alignItems="center" gap="$3">
          {/* Artwork preview. No Avatar/Image primitive exists in this lib
              yet, so we render a monogram tile as the fallback (matching
              ApproveConnection's glyph-fallback approach). imageUrl is
              surfaced as the accessible label until an Image atom lands —
              see `notes`. */}
          <YStack
            width={64}
            height={64}
            borderRadius="$4"
            backgroundColor="$surface3"
            alignItems="center"
            justifyContent="center"
            testID="send-nft-preview"
            aria-label={nft.imageUrl ? `${nft.name} artwork` : undefined}
          >
            <Text fontSize={24} fontWeight="700" color="$neutral1">
              {nftMonogram(nft.name)}
            </Text>
          </YStack>
          <YStack flex={1} gap="$1">
            <Text fontSize={16} fontWeight="600" color="$neutral1">
              {nft.name}
            </Text>
            {nft.collectionName ? (
              <Text fontSize={13} color="$neutral2">
                {nft.collectionName}
              </Text>
            ) : null}
            <XStack alignItems="center" gap="$2">
              {nft.chainKind ? <ChainBadge kind={nft.chainKind} /> : null}
              {nft.amount ? (
                <Text fontSize={12} color="$neutral2">
                  ×{nft.amount}
                </Text>
              ) : null}
            </XStack>
          </YStack>
        </XStack>
      </Card>

      <Card title="To">
        <AddressField
          value={toAddress}
          onChange={onChangeToAddress}
          error={addressError}
          onScan={onScanAddress}
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
    </ScreenScaffold>
  )
}

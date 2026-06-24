/**
 * NFTGallery screen shell (SCREENS.md — Collectibles).
 *
 * Collectibles view: a grid of NFT collections, each holding its items, with an
 * all/starred filter, loading + empty states, and per-item actions (open detail,
 * toggle star, send). PURE PRESENTATION — the collections array, the loading
 * flag, and every action are supplied by props from the app's collectibles
 * context (fed by @luxwallet/sdk). No fetching, no signing, and no filtering
 * math beyond the trivial starred view here.
 *
 * Fork mapping: NFTView/NFT → this shell; CollectionCard → the per-collection
 * Card section; NFTModal → deferred to the app (we emit `onSelectItem`; the app
 * owns the detail sheet, the same split QrView/AddressField use for their
 * platform-specific concerns).
 *
 * Artwork: like SendNFT.tsx, this renders a monogram tile rather than an
 * <Image> — no Avatar/Image primitive exists in this lib yet, and keeping image
 * decoding out of the shared UI is what lets the same screen ship to web +
 * native without a platform-specific bitmap dependency leaking in. `imageUrl`
 * is surfaced as the tile's accessible label until an Image atom lands.
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ChainBadge } from "../components/ChainBadge"
import { ScreenScaffold } from "../components/ScreenScaffold"
import type { ChainKind } from "../chains"

/** A single collectible within a collection. */
export interface NFTItem {
  id: string
  name: string
  /** Artwork URL. Surfaced as the tile's accessible label (no Image atom exists
   *  in this lib yet — see the file header); the app may render the bitmap. */
  imageUrl?: string
  /** Whether the user has starred (favorited) this item. */
  starred?: boolean
}

/** A grouping of collectibles by collection/contract. */
export interface NFTCollection {
  id: string
  name: string
  /** Chain the collection lives on; drives the ChainBadge glyph + label. */
  chainKind?: ChainKind
  items: NFTItem[]
}

export interface NFTGalleryProps {
  /** Active filter tab; defaults to "all". */
  tab?: "all" | "starred"
  onChangeTab?: (t: "all" | "starred") => void
  /** Collections to render; items are filtered to starred when `tab` is "starred". */
  collections: NFTCollection[]
  /** True while collectibles are loading; shows a placeholder. */
  loading?: boolean
  /** Open the detail view for an item (the app owns the modal/sheet). */
  onSelectItem?: (id: string) => void
  onToggleStar?: (id: string) => void
  onSendItem?: (id: string) => void
  onBack?: () => void
}

const TABS: ReadonlyArray<{ key: "all" | "starred"; label: string }> = [
  { key: "all", label: "All" },
  { key: "starred", label: "Starred" },
]

/** First letter of the name (uppercased) for the artwork fallback monogram. */
function nftMonogram(name: string): string {
  const ch = name.trim().charAt(0)
  return ch ? ch.toUpperCase() : "?"
}

export function NFTGallery({
  tab = "all",
  onChangeTab,
  collections,
  loading,
  onSelectItem,
  onToggleStar,
  onSendItem,
  onBack,
}: NFTGalleryProps): React.JSX.Element {
  const showStarred = tab === "starred"

  // Trivial view filter only — keep collections whose items survive the tab.
  const visible = collections
    .map((collection) => ({
      ...collection,
      items: showStarred ? collection.items.filter((item) => item.starred) : collection.items,
    }))
    .filter((collection) => collection.items.length > 0)

  const isEmpty = visible.length === 0

  return (
    <ScreenScaffold title="Collectibles" onBack={onBack}>
      <XStack gap="$2">
        {TABS.map((t) => (
          <Button
            key={t.key}
            tone={tab === t.key ? "primary" : "secondary"}
            full={false}
            flex={1}
            size="$3"
            onPress={onChangeTab ? () => onChangeTab(t.key) : undefined}
            testID={`nft-tab-${t.key}`}
          >
            {t.label}
          </Button>
        ))}
      </XStack>

      {isEmpty ? (
        <Card>
          <Text fontSize={13} color="$neutral2" textAlign="center">
            {loading ? "Loading…" : showStarred ? "No starred collectibles." : "No collectibles yet."}
          </Text>
        </Card>
      ) : (
        visible.map((collection) => (
          <Card key={collection.id}>
            <XStack alignItems="center" justifyContent="space-between" gap="$2">
              <Text fontSize={15} fontWeight="600" color="$neutral1">
                {collection.name}
              </Text>
              {collection.chainKind ? <ChainBadge kind={collection.chainKind} /> : null}
            </XStack>
            <Text fontSize={12} color="$neutral2">
              {collection.items.length} {collection.items.length === 1 ? "item" : "items"}
            </Text>

            <XStack flexWrap="wrap" gap="$3">
              {collection.items.map((item) => (
                <NFTTile
                  key={item.id}
                  item={item}
                  onSelect={onSelectItem}
                  onToggleStar={onToggleStar}
                  onSend={onSendItem}
                />
              ))}
            </XStack>
          </Card>
        ))
      )}
    </ScreenScaffold>
  )
}

interface NFTTileProps {
  item: NFTItem
  onSelect?: (id: string) => void
  onToggleStar?: (id: string) => void
  onSend?: (id: string) => void
}

/**
 * One collectible card in the grid: a monogram artwork tile (matching
 * SendNFT.tsx's glyph-fallback approach), the name, and inline star/send
 * affordances. Local to this screen — not promoted to a shared primitive until
 * a second surface needs it.
 */
function NFTTile({ item, onSelect, onToggleStar, onSend }: NFTTileProps): React.JSX.Element {
  return (
    <YStack
      width={148}
      gap="$2"
      padding="$2"
      borderRadius="$6"
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor="$surface3"
      onPress={onSelect ? () => onSelect(item.id) : undefined}
      pressStyle={onSelect ? { opacity: 0.85 } : undefined}
      hoverStyle={onSelect ? { backgroundColor: "$surface2" } : undefined}
      testID={`nft-tile-${item.id}`}
    >
      <YStack
        width="100%"
        height={132}
        borderRadius="$4"
        backgroundColor="$surface1"
        alignItems="center"
        justifyContent="center"
        aria-label={item.imageUrl ? `${item.name} artwork` : undefined}
        testID={`nft-art-${item.id}`}
      >
        <Text fontSize={32} fontWeight="700" color="$neutral2">
          {nftMonogram(item.name)}
        </Text>
      </YStack>

      <XStack alignItems="center" justifyContent="space-between" gap="$1">
        <Text fontSize={13} fontWeight="600" color="$neutral1" numberOfLines={1} flex={1}>
          {item.name}
        </Text>
        {onToggleStar ? (
          <Button
            tone="secondary"
            full={false}
            size="$1"
            chromeless
            onPress={() => onToggleStar(item.id)}
            testID={`nft-star-${item.id}`}
          >
            {item.starred ? "★" : "☆"}
          </Button>
        ) : null}
      </XStack>

      {onSend ? (
        <Button
          tone="secondary"
          size="$2"
          onPress={() => onSend(item.id)}
          testID={`nft-send-${item.id}`}
        >
          Send
        </Button>
      ) : null}
    </YStack>
  )
}

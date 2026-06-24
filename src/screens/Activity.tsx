/**
 * Activity screen shell (SCREENS.md §8 — History / Activity).
 *
 * The wallet's history view: a segmented control switches between signed
 * transactions and signed messages, each item shows its status (or origin)
 * with a timestamp, and an optional mainnet/testnet filter sits in the header.
 * Tapping an item fires `onSelectItem` (the app opens the explorer / detail).
 *
 * PURE PRESENTATION: every list, label, status, and the explorer link itself
 * are produced by @luxwallet/sdk's history indexer and passed in via props.
 * This component never fetches, decodes, paginates, or signs anything — it
 * only renders what it is given and routes taps back through callbacks.
 *
 * (Fork: Activities, wrapping TransactionHistory + SignedTextHistory + History.)
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ChainBadge } from "../components/ChainBadge"
import { ScreenScaffold } from "../components/ScreenScaffold"
import type { ChainKind } from "../chains"

/** Which history list is currently shown. */
export type ActivityTab = "transactions" | "messages"

/** Network filter — the chain environment the history is scoped to. */
export type ActivityNet = "mainnet" | "testnet"

/** Lifecycle of a signed transaction, as resolved by the SDK indexer. */
export type ActivityStatus = "pending" | "completed" | "failed"

/** One signed-transaction row. */
export interface ActivityTransaction {
  id: string
  /** Primary line, e.g. "Send ZOO" or "Swap on Zoo DEX". */
  title: string
  /** Secondary line, e.g. counterparty or chain context. */
  subtitle?: string
  /** Pre-formatted amount, e.g. "−250 ZOO" or "+0.5 LUX". */
  amountLabel?: string
  /** Pre-formatted timestamp, e.g. "2m ago" or "Jun 23, 14:02". */
  timeLabel: string
  status: ActivityStatus
  chainKind?: ChainKind
}

/** One signed-message (off-chain signature) row. */
export interface ActivityMessage {
  id: string
  /** Origin that requested the signature, e.g. a dapp host. */
  origin?: string
  /** Pre-formatted, truncated message preview. */
  preview: string
  /** Pre-formatted timestamp. */
  timeLabel: string
}

export interface ActivityProps {
  /** Active tab. */
  tab: ActivityTab
  onChangeTab: (t: ActivityTab) => void

  /** Active network filter. When `onChangeNet` is omitted the filter is hidden. */
  net?: ActivityNet
  onChangeNet?: (n: ActivityNet) => void

  /** Signed transactions for the active network (newest first). */
  transactions: ActivityTransaction[]
  /** Signed messages for the active network (newest first). */
  messages: ActivityMessage[]

  /** True while a page is loading; shows a placeholder line. */
  loading?: boolean

  /** Open an item's detail / explorer link. */
  onSelectItem?: (id: string) => void
  /** Fetch the next page; renders a "Load more" action when provided. */
  onLoadMore?: () => void

  onBack?: () => void
}

const TABS: readonly { key: ActivityTab; label: string }[] = [
  { key: "transactions", label: "Transactions" },
  { key: "messages", label: "Messages" },
]

const NETS: readonly { key: ActivityNet; label: string }[] = [
  { key: "mainnet", label: "Mainnet" },
  { key: "testnet", label: "Testnet" },
]

/** Status glyph + theme token per transaction lifecycle state. */
const statusMeta: Record<ActivityStatus, { glyph: string; color: string; label: string }> = {
  pending: { glyph: "⏱", color: "$statusWarning", label: "Pending" },
  completed: { glyph: "✓", color: "$statusSuccess", label: "Completed" },
  failed: { glyph: "✕", color: "$statusCritical", label: "Failed" },
}

export function Activity({
  tab,
  onChangeTab,
  net,
  onChangeNet,
  transactions,
  messages,
  loading,
  onSelectItem,
  onLoadMore,
  onBack,
}: ActivityProps): React.JSX.Element {
  const showTransactions = tab === "transactions"
  const isEmpty = showTransactions ? transactions.length === 0 : messages.length === 0

  return (
    <ScreenScaffold
      title="Activity"
      onBack={onBack}
      headerRight={
        onChangeNet ? (
          <XStack gap="$1">
            {NETS.map((n) => (
              <Button
                key={n.key}
                tone={net === n.key ? "primary" : "secondary"}
                full={false}
                size="$2"
                onPress={() => onChangeNet(n.key)}
                testID={`activity-net-${n.key}`}
              >
                {n.label}
              </Button>
            ))}
          </XStack>
        ) : null
      }
      footer={
        onLoadMore ? (
          <Button
            tone="secondary"
            disabled={loading}
            onPress={onLoadMore}
            testID="activity-load-more"
          >
            {loading ? "Loading…" : "Load more"}
          </Button>
        ) : undefined
      }
    >
      <XStack gap="$2">
        {TABS.map((t) => (
          <Button
            key={t.key}
            tone={tab === t.key ? "primary" : "secondary"}
            full={false}
            flex={1}
            size="$3"
            onPress={() => onChangeTab(t.key)}
            testID={`activity-tab-${t.key}`}
          >
            {t.label}
          </Button>
        ))}
      </XStack>

      {isEmpty ? (
        <Card>
          <Text fontSize={13} color="$neutral2" textAlign="center">
            {loading
              ? "Loading…"
              : showTransactions
                ? "No transactions yet."
                : "No signed messages yet."}
          </Text>
        </Card>
      ) : showTransactions ? (
        <Card>
          {transactions.map((tx) => {
            const meta = statusMeta[tx.status]
            return (
              <XStack
                key={tx.id}
                alignItems="center"
                justifyContent="space-between"
                gap="$3"
                padding="$3"
                borderRadius="$4"
                hoverStyle={onSelectItem ? { backgroundColor: "$surface3" } : undefined}
                pressStyle={onSelectItem ? { opacity: 0.85 } : undefined}
                onPress={onSelectItem ? () => onSelectItem(tx.id) : undefined}
                testID={`activity-tx-${tx.id}`}
              >
                <YStack gap="$1" flex={1}>
                  <XStack alignItems="center" gap="$2">
                    <Text fontSize={15} fontWeight="600" color="$neutral1">
                      {tx.title}
                    </Text>
                    {tx.chainKind ? <ChainBadge kind={tx.chainKind} /> : null}
                  </XStack>
                  {tx.subtitle ? (
                    <Text fontSize={12} color="$neutral2">
                      {tx.subtitle}
                    </Text>
                  ) : null}
                  <XStack alignItems="center" gap="$2">
                    <Text fontSize={12} color={meta.color}>
                      {meta.glyph} {meta.label}
                    </Text>
                    <Text fontSize={12} color="$neutral2">
                      · {tx.timeLabel}
                    </Text>
                  </XStack>
                </YStack>
                <YStack alignItems="flex-end" gap="$1">
                  {tx.amountLabel ? (
                    <Text fontSize={15} color="$neutral1">
                      {tx.amountLabel}
                    </Text>
                  ) : null}
                  {onSelectItem ? (
                    <Text fontSize={12} color="$neutral2">
                      View ↗
                    </Text>
                  ) : null}
                </YStack>
              </XStack>
            )
          })}
        </Card>
      ) : (
        <Card>
          {messages.map((msg) => (
            <XStack
              key={msg.id}
              alignItems="center"
              justifyContent="space-between"
              gap="$3"
              padding="$3"
              borderRadius="$4"
              hoverStyle={onSelectItem ? { backgroundColor: "$surface3" } : undefined}
              pressStyle={onSelectItem ? { opacity: 0.85 } : undefined}
              onPress={onSelectItem ? () => onSelectItem(msg.id) : undefined}
              testID={`activity-msg-${msg.id}`}
            >
              <YStack gap="$1" flex={1}>
                <Text fontSize={14} color="$neutral1" numberOfLines={2}>
                  {msg.preview}
                </Text>
                <XStack alignItems="center" gap="$2">
                  {msg.origin ? (
                    <Text fontSize={12} color="$neutral2">
                      {msg.origin}
                    </Text>
                  ) : null}
                  <Text fontSize={12} color="$neutral2">
                    {msg.origin ? "· " : ""}
                    {msg.timeLabel}
                  </Text>
                </XStack>
              </YStack>
              {onSelectItem ? (
                <Text fontSize={14} color="$neutral2">
                  ›
                </Text>
              ) : null}
            </XStack>
          ))}
        </Card>
      )}
    </ScreenScaffold>
  )
}

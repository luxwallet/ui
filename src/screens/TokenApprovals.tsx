/**
 * TokenApprovals screen shell (SCREENS.md — Approvals / Allowance Manager).
 *
 * Review and revoke outstanding spending allowances granted to contracts and
 * spenders: a segmented control switches between fungible token approvals and
 * NFT (collection/operator) approvals, a search filter narrows the list, each
 * row shows the asset, the spender, the granted amount, and a risk flag, and a
 * multi-select drives a single batch "Revoke" action.
 *
 * PURE PRESENTATION: the approvals list, the pre-formatted amount labels, the
 * risk assessment, and the spender labels are all produced by @luxwallet/sdk
 * (it reads on-chain allowances and scores spenders) and passed in via props.
 * Search is controlled by `query`/`onChangeQuery`; selection is controlled by
 * `selectedIds`/`onToggleSelect`. This component never reads chain state,
 * filters, scores risk, builds calldata, or signs — it renders what it is
 * given and routes every interaction back through callbacks.
 *
 * (Fork: TokenApproval + NFTApproval, wrapping ApprovalManagePage +
 * RevokeApprovalModal.)
 */
import { XStack, YStack, Text, Input } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ChainBadge } from "../components/ChainBadge"
import { ScreenScaffold } from "../components/ScreenScaffold"
import { shortenAddress, type ChainKind } from "../chains"

/** Which approvals list is currently shown. */
export type ApprovalTab = "tokens" | "nfts"

/** Spender risk assessment from the SDK's allowance scorer. */
export type ApprovalRisk = "low" | "medium" | "high"

/** One outstanding allowance row (a token allowance or an NFT operator grant). */
export interface TokenApproval {
  id: string
  /** Asset name/symbol the allowance is on, e.g. "USDC" or "Lux Genesis". */
  assetLabel: string
  /** Asset artwork/logo URL. Surfaced as the icon tile's accessible label —
   *  no Image atom exists in this lib yet (see `notes`); a monogram tile is
   *  rendered as the fallback. */
  assetIconUrl?: string
  /** Human label for the spender, e.g. "Uniswap V3 Router" or "Unknown". */
  spenderLabel: string
  /** Full spender address; shortened for display via `shortenAddress`. */
  spenderAddress: string
  /** Pre-formatted granted amount, e.g. "Unlimited", "1,250 USDC", or "All". */
  amountLabel?: string
  /** Chain the allowance lives on, used to pick the badge glyph/label. */
  chainKind?: ChainKind
  /** Risk flag for the spender. */
  risk?: ApprovalRisk
}

export interface TokenApprovalsProps {
  /** Active tab. */
  tab: ApprovalTab
  onChangeTab: (t: ApprovalTab) => void

  /** Controlled search text (the app does the filtering). When `onChangeQuery`
   *  is omitted the search field is hidden. */
  query?: string
  onChangeQuery?: (q: string) => void

  /** Outstanding allowances for the active tab (highest risk first by
   *  convention — the SDK decides ordering). */
  approvals: TokenApproval[]

  /** Controlled selection set (the app owns the state). */
  selectedIds?: string[]
  /** Toggle one row's membership in the selection. When omitted, rows are not
   *  selectable and the footer falls back to single-row revoke buttons. */
  onToggleSelect?: (id: string) => void

  /** True while a revoke transaction is in flight; disables the action. */
  revoking?: boolean
  /** Revoke the given allowance ids (one signed batch). */
  onRevoke: (ids: string[]) => void

  /** True while the allowance list is loading; shows a placeholder line. */
  loading?: boolean

  onBack?: () => void
}

const TABS: readonly { key: ApprovalTab; label: string }[] = [
  { key: "tokens", label: "Tokens" },
  { key: "nfts", label: "NFTs" },
]

/** Risk glyph + theme token per assessed level (matches Signing.tsx). */
const riskMeta: Record<ApprovalRisk, { color: string; label: string }> = {
  low: { color: "$statusSuccess", label: "Low risk" },
  medium: { color: "$statusWarning", label: "Medium risk" },
  high: { color: "$statusCritical", label: "High risk" },
}

/** First letter of the asset label (uppercased) for the icon fallback. */
function assetMonogram(label: string): string {
  const ch = label.trim().charAt(0)
  return ch ? ch.toUpperCase() : "?"
}

export function TokenApprovals(props: TokenApprovalsProps): React.JSX.Element {
  const {
    tab,
    onChangeTab,
    query,
    onChangeQuery,
    approvals,
    selectedIds,
    onToggleSelect,
    revoking,
    onRevoke,
    loading,
    onBack,
  } = props

  const selectable = !!onToggleSelect
  const selected = selectedIds ?? []
  const isSelected = (id: string): boolean => selected.includes(id)
  const isEmpty = approvals.length === 0
  const noun = tab === "tokens" ? "token approvals" : "NFT approvals"

  return (
    <ScreenScaffold
      title="Approvals"
      onBack={onBack}
      footer={
        selectable && selected.length > 0 ? (
          <Button
            tone="danger"
            disabled={revoking}
            onPress={() => onRevoke(selected)}
            testID="approvals-revoke-selected"
          >
            {revoking
              ? "Revoking…"
              : `Revoke ${selected.length} selected`}
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
            testID={`approvals-tab-${t.key}`}
          >
            {t.label}
          </Button>
        ))}
      </XStack>

      {onChangeQuery ? (
        <Input
          value={query ?? ""}
          onChangeText={onChangeQuery}
          placeholder="Search by asset or spender"
          testID="approvals-search"
        />
      ) : null}

      {isEmpty ? (
        <Card>
          <Text fontSize={13} color="$neutral2" textAlign="center">
            {loading
              ? "Loading…"
              : query
                ? `No ${noun} match your search.`
                : `No ${noun} found. Spenders you approve will appear here.`}
          </Text>
        </Card>
      ) : (
        <Card>
          {approvals.map((approval) => {
            const meta = approval.risk ? riskMeta[approval.risk] : undefined
            const checked = isSelected(approval.id)
            return (
              <XStack
                key={approval.id}
                alignItems="center"
                gap="$3"
                padding="$3"
                borderRadius="$4"
                backgroundColor={checked ? "$surface3" : "transparent"}
                borderWidth={1}
                borderColor={checked ? "$borderColor" : "transparent"}
                testID={`approval-row-${approval.id}`}
              >
                {selectable ? (
                  <Button
                    chromeless
                    full={false}
                    size="$2"
                    onPress={() => onToggleSelect(approval.id)}
                    aria-label={checked ? "Deselect approval" : "Select approval"}
                    testID={`approval-select-${approval.id}`}
                  >
                    {checked ? "☑" : "☐"}
                  </Button>
                ) : null}

                {/* Asset icon. No Avatar/Image primitive exists in this lib yet,
                    so we render a monogram tile as the fallback (matching
                    SendNFT's glyph-fallback approach). assetIconUrl is surfaced
                    as the accessible label until an Image atom lands — see
                    `notes`. */}
                <YStack
                  width={40}
                  height={40}
                  borderRadius="$4"
                  backgroundColor="$surface3"
                  alignItems="center"
                  justifyContent="center"
                  aria-label={approval.assetIconUrl ? `${approval.assetLabel} icon` : undefined}
                >
                  <Text fontSize={16} fontWeight="700" color="$neutral1">
                    {assetMonogram(approval.assetLabel)}
                  </Text>
                </YStack>

                <YStack flex={1} gap="$1">
                  <XStack alignItems="center" gap="$2" flexWrap="wrap">
                    <Text fontSize={15} fontWeight="600" color="$neutral1">
                      {approval.assetLabel}
                    </Text>
                    {approval.chainKind ? <ChainBadge kind={approval.chainKind} /> : null}
                  </XStack>
                  <Text fontSize={12} color="$neutral2">
                    {approval.spenderLabel} · {shortenAddress(approval.spenderAddress)}
                  </Text>
                  {meta ? (
                    <Text fontSize={12} color={meta.color}>
                      ● {meta.label}
                    </Text>
                  ) : null}
                </YStack>

                <YStack alignItems="flex-end" gap="$2">
                  {approval.amountLabel ? (
                    <Text fontSize={13} color="$neutral1" textAlign="right">
                      {approval.amountLabel}
                    </Text>
                  ) : null}
                  {/* Per-row revoke. Always available so a single allowance can
                      be revoked without entering multi-select; in selectable
                      mode the footer additionally batches the whole selection. */}
                  <Button
                    tone="danger"
                    full={false}
                    size="$2"
                    disabled={revoking}
                    onPress={() => onRevoke([approval.id])}
                    testID={`approval-revoke-${approval.id}`}
                  >
                    Revoke
                  </Button>
                </YStack>
              </XStack>
            )
          })}
        </Card>
      )}
    </ScreenScaffold>
  )
}

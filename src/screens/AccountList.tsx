/**
 * AccountList screen shell (SCREENS.md — Accounts / Address Management).
 *
 * Manage and switch between accounts/addresses: grouped by source (seed,
 * imported, hardware, watch-only), with pin/favorite, a search filter,
 * per-account balances, and an aggregate bundle total. Forked from the
 * legacy AddressManagement / ManageAddress / SelectAddress / Bundle screens.
 *
 * PURE PRESENTATION: groups, balances, the bundle total, and the active flag
 * all arrive via props (the app derives them from @luxwallet/sdk). This
 * component owns no state — search is controlled by `query`/`onChangeQuery`,
 * and every interaction (select, pin, open detail, add) is a callback. No
 * fetching, no filtering math, no signing here.
 */
import { XStack, YStack, Text, Input } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ChainBadge } from "../components/ChainBadge"
import { ScreenScaffold } from "../components/ScreenScaffold"
import { shortenAddress, type ChainKind } from "../chains"

/** One account/address row within a source group. */
export interface AccountItem {
  id: string
  /** Display name, e.g. "zach.lux" or "Trading 2". */
  label: string
  /** Full address; shortened for display via `shortenAddress`. */
  address: string
  /** Pre-formatted balance line, e.g. "$12,480.50" or "1,250 LUX". */
  balanceLabel?: string
  chainKind?: ChainKind
  /** Pinned/favorited — surfaced with a filled star affordance. */
  pinned?: boolean
  /** The currently-selected account — highlighted and marked. */
  active?: boolean
}

/** A group of accounts sharing a source, e.g. "Seed phrase" or "Hardware". */
export interface AccountGroup {
  /** Source heading, e.g. "Seed phrase", "Imported", "Hardware", "Watch-only". */
  sourceLabel: string
  accounts: AccountItem[]
}

export interface AccountListProps {
  groups: AccountGroup[]
  /** Controlled search text (the app does the filtering). */
  query?: string
  onChangeQuery?: (q: string) => void
  /** Pre-formatted bundle total across all accounts, e.g. "$58,201.33". */
  totalBalanceLabel?: string
  /** Switch to the tapped account. */
  onSelect: (id: string) => void
  /** Toggle pin/favorite for an account. */
  onTogglePin?: (id: string) => void
  /** Open the detail/edit view (rename, export, remove) for an account. */
  onOpenDetail?: (id: string) => void
  /** Start the add-account flow (create, import, connect hardware, watch). */
  onAddAccount?: () => void
  onBack?: () => void
}

export function AccountList({
  groups,
  query,
  onChangeQuery,
  totalBalanceLabel,
  onSelect,
  onTogglePin,
  onOpenDetail,
  onAddAccount,
  onBack,
}: AccountListProps): React.JSX.Element {
  const isEmpty = groups.every((g) => g.accounts.length === 0)

  return (
    <ScreenScaffold
      title="Accounts"
      onBack={onBack}
      headerRight={
        onAddAccount ? (
          <Button full={false} size="$2" onPress={onAddAccount} testID="account-add">
            + Add
          </Button>
        ) : null
      }
      footer={
        onAddAccount ? (
          <Button onPress={onAddAccount} testID="account-add-footer">
            Add account
          </Button>
        ) : null
      }
    >
      {totalBalanceLabel ? (
        <Card title="Bundle total">
          <Text fontSize={28} fontWeight="700" color="$neutral1">
            {totalBalanceLabel}
          </Text>
        </Card>
      ) : null}

      {onChangeQuery ? (
        <Input
          value={query ?? ""}
          onChangeText={onChangeQuery}
          placeholder="Search accounts or addresses"
          testID="account-search"
        />
      ) : null}

      {isEmpty ? (
        <Card>
          <Text fontSize={13} color="$neutral2" textAlign="center">
            {query ? "No accounts match your search." : "No accounts yet."}
          </Text>
        </Card>
      ) : (
        groups.map((group) =>
          group.accounts.length === 0 ? null : (
            <Card key={group.sourceLabel} title={group.sourceLabel}>
              {group.accounts.map((account) => (
                <XStack
                  key={account.id}
                  alignItems="center"
                  justifyContent="space-between"
                  gap="$3"
                  padding="$3"
                  borderRadius="$4"
                  backgroundColor={account.active ? "$surface3" : "transparent"}
                  borderWidth={1}
                  borderColor={account.active ? "$borderColor" : "transparent"}
                  testID={`account-row-${account.id}`}
                >
                  {/* Tappable info block selects the account. Kept as its own
                      press target (not the whole row) so the trailing pin /
                      detail controls own their taps without overlap. */}
                  <XStack
                    flex={1}
                    alignItems="center"
                    gap="$3"
                    hoverStyle={{ opacity: 0.85 }}
                    pressStyle={{ opacity: 0.7 }}
                    onPress={() => onSelect(account.id)}
                    testID={`account-select-${account.id}`}
                  >
                    <YStack flex={1} gap="$1">
                      <XStack alignItems="center" gap="$2" flexWrap="wrap">
                        <Text fontSize={15} fontWeight="600" color="$neutral1">
                          {account.label}
                        </Text>
                        {account.chainKind ? <ChainBadge kind={account.chainKind} /> : null}
                        {account.active ? (
                          <Text fontSize={12} color="$statusSuccess">
                            ✓ active
                          </Text>
                        ) : null}
                      </XStack>
                      <Text fontSize={12} color="$neutral2">
                        {shortenAddress(account.address)}
                      </Text>
                    </YStack>
                    {account.balanceLabel ? (
                      <Text fontSize={15} color="$neutral1">
                        {account.balanceLabel}
                      </Text>
                    ) : null}
                  </XStack>

                  <XStack gap="$1" alignItems="center">
                    {onTogglePin ? (
                      <Button
                        chromeless
                        full={false}
                        size="$2"
                        onPress={() => onTogglePin(account.id)}
                        testID={`account-pin-${account.id}`}
                      >
                        {account.pinned ? "★" : "☆"}
                      </Button>
                    ) : null}
                    {onOpenDetail ? (
                      <Button
                        chromeless
                        full={false}
                        size="$2"
                        onPress={() => onOpenDetail(account.id)}
                        testID={`account-detail-${account.id}`}
                      >
                        ⋯
                      </Button>
                    ) : null}
                  </XStack>
                </XStack>
              ))}
            </Card>
          ),
        )
      )}
    </ScreenScaffold>
  )
}

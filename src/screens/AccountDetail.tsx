/**
 * AccountDetail screen shell (single-account management).
 *
 * Forked from the legacy AddressDetail + AddressBackup / AddressInfo /
 * AddressDelete / AliasName surfaces, collapsed into one screen: rename the
 * account alias, view + copy the address (with a QR affordance), back up the
 * seed phrase, export the private key, and delete the account.
 *
 * PURE PRESENTATION: every value (label, address, balance line) and every
 * action (copy, QR, backup, export, delete) arrives via props. The app +
 * @luxwallet/sdk own all key material, clipboard, navigation, and the
 * destructive-confirm flow. Nothing here touches RPC, signing, secrets, or
 * react-native — the alias edit is local draft state lifted to the caller.
 */
import { XStack, YStack, Input, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ScreenScaffold } from "../components/ScreenScaffold"
import { shortenAddress } from "../chains"

export interface AccountDetailProps {
  /** Account display name / alias, e.g. "zach.lux". */
  label: string
  /** Full account address; shown shortened, copyable in full via onCopyAddress. */
  address: string
  /** Optional provenance line, e.g. "Imported · Ledger" or "Seed phrase". */
  sourceLabel?: string
  /** Optional pre-formatted balance line, e.g. "95,000 ZOO  (~$1,234)". */
  balanceLabel?: string

  /** When true, the alias row swaps the label for an editable input. */
  editingAlias?: boolean
  /** Draft alias text while editing (controlled by the caller). */
  aliasDraft?: string
  /** Begin editing / type into the alias field. Presence enables the Rename action. */
  onChangeAlias?: (next: string) => void
  /** Commit the alias draft (caller persists + exits edit mode). */
  onSaveAlias?: () => void

  onCopyAddress?: () => void
  onShowQr?: () => void

  onBackupSeed?: () => void
  onExportPrivateKey?: () => void

  /** Gate the destructive Delete action (e.g. false for the last/active account). */
  canDelete?: boolean
  onDelete?: () => void

  onBack?: () => void
}

export function AccountDetail({
  label,
  address,
  sourceLabel,
  balanceLabel,
  editingAlias,
  aliasDraft,
  onChangeAlias,
  onSaveAlias,
  onCopyAddress,
  onShowQr,
  onBackupSeed,
  onExportPrivateKey,
  canDelete,
  onDelete,
  onBack,
}: AccountDetailProps): React.JSX.Element {
  return (
    <ScreenScaffold title="Account" onBack={onBack}>
      <Card title="Name">
        {editingAlias ? (
          <XStack gap="$2" alignItems="center">
            <Input
              flex={1}
              value={aliasDraft ?? ""}
              onChangeText={onChangeAlias}
              placeholder="Account name"
              testID="account-detail-alias-input"
            />
            <Button full={false} size="$3" onPress={onSaveAlias}>
              Save
            </Button>
          </XStack>
        ) : (
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontSize={15} fontWeight="600" color="$neutral1">
              {label}
            </Text>
            {onChangeAlias ? (
              <Button
                tone="secondary"
                full={false}
                size="$2"
                onPress={() => onChangeAlias(label)}
                testID="account-detail-rename"
              >
                Rename
              </Button>
            ) : null}
          </XStack>
        )}
        {sourceLabel ? (
          <Text fontSize={12} color="$neutral2">
            {sourceLabel}
          </Text>
        ) : null}
      </Card>

      <Card title="Address">
        <XStack alignItems="center" justifyContent="space-between" gap="$2">
          <Text fontSize={13} color="$neutral1" flex={1}>
            {shortenAddress(address)}
          </Text>
          <XStack gap="$2">
            <Button tone="secondary" full={false} size="$2" onPress={onCopyAddress}>
              Copy
            </Button>
            <Button tone="secondary" full={false} size="$2" onPress={onShowQr}>
              QR
            </Button>
          </XStack>
        </XStack>
        {balanceLabel ? (
          <Text fontSize={12} color="$neutral2">
            {balanceLabel}
          </Text>
        ) : null}
      </Card>

      <Card title="Security">
        <Button tone="secondary" onPress={onBackupSeed} testID="account-detail-backup-seed">
          Back up seed phrase
        </Button>
        <Button
          tone="secondary"
          onPress={onExportPrivateKey}
          testID="account-detail-export-key"
        >
          Export private key
        </Button>
      </Card>

      {canDelete ? (
        <Card title="Danger zone">
          <Button tone="danger" onPress={onDelete} testID="account-detail-delete">
            Delete account
          </Button>
          <Text fontSize={12} color="$neutral2">
            Make sure you have backed up the seed phrase or private key. This cannot be undone.
          </Text>
        </Card>
      ) : null}
    </ScreenScaffold>
  )
}

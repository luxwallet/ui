/**
 * ConnectHardware screen shell (SCREENS.md — hardware / air-gapped signer).
 *
 * Fork of ImportHardware/* + HDManager: pick a hardware or air-gapped signer
 * (Ledger, Keystone/QR, Trezor, OneKey, GridPlus, BitBox02, imKey), connect it,
 * then choose which HD-derivation accounts to add.
 *
 * PURE PRESENTATION: device discovery, the USB/HID/QR transport handshake, HD
 * path derivation, address/balance lookups, and the actual import all live in
 * @luxwallet/sdk and are passed in via props. This component only renders the
 * device list, the connection status, the derivation-path control, and the
 * account picker, firing the callbacks the app supplies. No RPC, no signing,
 * no transport code, no @luxwallet/sdk import, no direct react-native import.
 */
import { XStack, YStack, Text, ListItem } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ScreenScaffold } from "../components/ScreenScaffold"
import { shortenAddress } from "../chains"

/** A discoverable hardware / air-gapped signer offered by @luxwallet/sdk. */
export interface HardwareDevice {
  id: string
  name: string
  /**
   * Optional brand icon URL. This pure-UI library renders a text glyph rather
   * than an <Image> so the same screen ships to web + native without a
   * platform image dependency leaking in (same rationale as QrView); apps that
   * want a logo can wrap/replace this screen. The field is accepted so the
   * device shape matches the SDK and a future Image atom can consume it.
   */
  iconUrl?: string
}

/** One HD-derivation account the device exposes, with add/remove state. */
export interface HardwareAccount {
  /** Derivation index along the active HD path (e.g. account 0, 1, 2…). */
  index: number
  address: string
  /** Pre-formatted balance, e.g. "1.25 ETH" — computed by the SDK. */
  balanceLabel?: string
  /** Whether this account is already selected for import. */
  added: boolean
}

/** Connection lifecycle for the selected device. */
export type HardwareStatus = "idle" | "connecting" | "connected" | "error"

export interface ConnectHardwareProps {
  /** Discoverable signers (from @luxwallet/sdk's device registry). */
  devices: HardwareDevice[]
  /** Currently highlighted device, if any. */
  selectedDeviceId?: string
  /** Fired when a device is chosen — app starts the transport handshake. */
  onSelectDevice: (id: string) => void

  /** Connection lifecycle of the selected device. */
  status: HardwareStatus
  /** Optional human-readable status / error copy from the SDK. */
  statusMessage?: string

  /** Active HD path label, e.g. "Ledger Live  ·  m/44'/60'/0'/0/x". */
  hdPathLabel?: string
  /** Fired when the user wants to change the derivation path/standard. */
  onChangeHdPath?: () => void

  /** Derived accounts to choose from (populated once connected). */
  accounts?: HardwareAccount[]
  /** Toggle an account's add/remove state. */
  onToggleAccount?: (index: number) => void
  /** Derive the next page of accounts. */
  onLoadMoreAccounts?: () => void

  /** True while the selected accounts are being imported. */
  importing?: boolean
  /** Confirm and add the selected accounts. */
  onConfirm: () => void
  onBack?: () => void
}

const statusColor: Record<HardwareStatus, string> = {
  idle: "$neutral2",
  connecting: "$statusWarning",
  connected: "$statusSuccess",
  error: "$statusCritical",
}

const statusGlyph: Record<HardwareStatus, string> = {
  idle: "○",
  connecting: "◌",
  connected: "●",
  error: "⚠",
}

const defaultStatusMessage: Record<HardwareStatus, string> = {
  idle: "Select a device to connect.",
  connecting: "Unlock the device and open the app to continue…",
  connected: "Connected. Choose the accounts to add.",
  error: "Couldn't connect. Reconnect the device and try again.",
}

export function ConnectHardware({
  devices,
  selectedDeviceId,
  onSelectDevice,
  status,
  statusMessage,
  hdPathLabel,
  onChangeHdPath,
  accounts,
  onToggleAccount,
  onLoadMoreAccounts,
  importing,
  onConfirm,
  onBack,
}: ConnectHardwareProps): React.JSX.Element {
  const message = statusMessage ?? defaultStatusMessage[status]
  const addedCount = accounts?.reduce((n, a) => n + (a.added ? 1 : 0), 0) ?? 0
  const canConfirm = status === "connected" && addedCount > 0 && !importing

  return (
    <ScreenScaffold
      title="Connect hardware"
      onBack={onBack}
      footer={
        <Button disabled={!canConfirm} onPress={onConfirm} testID="hardware-confirm">
          {importing
            ? "Adding…"
            : addedCount > 0
              ? `Add ${addedCount} account${addedCount === 1 ? "" : "s"}`
              : "Add accounts"}
        </Button>
      }
    >
      <Card title="Device">
        {devices.length === 0 ? (
          <Text fontSize={13} color="$neutral2">
            No hardware signers detected. Plug in or pair a device to begin.
          </Text>
        ) : (
          devices.map((device) => {
            const active = device.id === selectedDeviceId
            const glyph = device.iconUrl ? "▣" : "▢"
            return (
              <ListItem
                key={device.id}
                onPress={() => onSelectDevice(device.id)}
                pressStyle={{ opacity: 0.85 }}
                hoverStyle={{ backgroundColor: "$surface2" }}
                backgroundColor={active ? "$surface3" : undefined}
                borderWidth={1}
                borderColor={active ? "$borderColor" : "transparent"}
                borderRadius="$4"
                padding="$3"
                testID={`hardware-device-${device.id}`}
              >
                <XStack flex={1} alignItems="center" gap="$3">
                  <Text fontSize={16}>{glyph}</Text>
                  <Text fontSize={15} fontWeight="600" color="$neutral1" flex={1}>
                    {device.name}
                  </Text>
                  {active ? (
                    <Text fontSize={13} color="$neutral2">
                      Selected
                    </Text>
                  ) : null}
                </XStack>
              </ListItem>
            )
          })
        )}
      </Card>

      <Card title="Status">
        <XStack alignItems="center" gap="$2">
          <Text fontSize={13} color={statusColor[status]}>
            {statusGlyph[status]}
          </Text>
          <Text fontSize={13} color={statusColor[status]}>
            {message}
          </Text>
        </XStack>
      </Card>

      {hdPathLabel ? (
        <Card title="Derivation path">
          <XStack alignItems="center" justifyContent="space-between" gap="$3">
            <Text fontSize={13} color="$neutral1" flex={1}>
              {hdPathLabel}
            </Text>
            {onChangeHdPath ? (
              <Button
                tone="secondary"
                full={false}
                size="$2"
                onPress={onChangeHdPath}
                testID="hardware-change-path"
              >
                Change
              </Button>
            ) : null}
          </XStack>
        </Card>
      ) : null}

      {accounts && accounts.length > 0 ? (
        <Card title="Accounts">
          {accounts.map((account) => (
            <ListItem
              key={account.index}
              onPress={onToggleAccount ? () => onToggleAccount(account.index) : undefined}
              pressStyle={onToggleAccount ? { opacity: 0.85 } : undefined}
              hoverStyle={onToggleAccount ? { backgroundColor: "$surface2" } : undefined}
              borderRadius="$4"
              padding="$3"
              testID={`hardware-account-${account.index}`}
            >
              <XStack flex={1} alignItems="center" justifyContent="space-between" gap="$3">
                <YStack gap="$1" flex={1}>
                  <Text fontSize={15} fontWeight="600" color="$neutral1">
                    {shortenAddress(account.address)}
                  </Text>
                  <Text fontSize={12} color="$neutral2">
                    #{account.index}
                    {account.balanceLabel ? `  ·  ${account.balanceLabel}` : ""}
                  </Text>
                </YStack>
                <Text
                  fontSize={13}
                  color={account.added ? "$statusSuccess" : "$neutral2"}
                >
                  {account.added ? "✓ Added" : "Add"}
                </Text>
              </XStack>
            </ListItem>
          ))}

          {onLoadMoreAccounts ? (
            <Button
              tone="secondary"
              full={false}
              size="$2"
              onPress={onLoadMoreAccounts}
              testID="hardware-load-more"
            >
              Load more
            </Button>
          ) : null}
        </Card>
      ) : null}
    </ScreenScaffold>
  )
}

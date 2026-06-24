/**
 * ImportWallet screen shell (SCREENS.md — Import existing account).
 *
 * Brings an existing account into the wallet via one of four methods: seed
 * phrase, private key, keystore JSON (+ password), or a watch-only address.
 * Shows inline validation and, for the seed method, an HD account picker so
 * the user can choose which derived addresses to import.
 *
 * PURE PRESENTATION: parsing, validation (`error`), HD derivation, and the
 * discovered-account balances all happen in @luxwallet/sdk and arrive via
 * props. This component only renders choices and the raw input string, then
 * fires callbacks. `canSubmit` gates the action; no signing, RPC, or crypto
 * lives here. (Fork of ImportMnemonics / ImportPrivateKey / ImportJson /
 * ImportWatchAddress + the Import flow.)
 */
import { XStack, YStack, Input, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ScreenScaffold } from "../components/ScreenScaffold"
import { shortenAddress } from "../chains"

/** How the account is being brought in. */
export type ImportMethod = "seed" | "privateKey" | "json" | "watch"

/** One HD-derived account offered to the user (seed method only). */
export interface DiscoveredAccount {
  address: string
  /** Pre-formatted balance line, e.g. "1.25 LUX". */
  balanceLabel?: string
  selected: boolean
}

export interface ImportWalletProps {
  /** The active import method (controls which input is shown). */
  method: ImportMethod
  onChangeMethod: (m: ImportMethod) => void

  /**
   * Raw input for the active method: the seed phrase, the private key, the
   * keystore JSON text, or the watch-only address. Echoed verbatim — the SDK
   * trims/normalizes.
   */
  value: string
  onChangeValue: (next: string) => void

  /** Password for the keystore JSON (json method only). */
  jsonPassword?: string
  onChangeJsonPassword?: (next: string) => void

  /** Validation message from the SDK; rendered in the critical color. */
  error?: string

  /**
   * HD accounts derived from the seed (seed method only). When present, the
   * user picks which to import via `onToggleAccount`.
   */
  discoveredAccounts?: DiscoveredAccount[]
  onToggleAccount?: (address: string) => void

  /** Gates the import action (the SDK decides when input is valid + complete). */
  canSubmit: boolean
  /** True while the account is being imported. */
  importing?: boolean
  onSubmit: () => void
  onBack?: () => void
}

/** Method picker metadata — label + the section/placeholder copy per method. */
interface MethodMeta {
  label: string
  glyph: string
  sectionTitle: string
  placeholder: string
}

/** Keyed by method so the active lookup is total (no find/fallback). */
const METHOD_META: Record<ImportMethod, MethodMeta> = {
  seed: {
    label: "Seed phrase",
    glyph: "✍",
    sectionTitle: "Seed phrase",
    placeholder: "Enter your 12 / 24-word recovery phrase, separated by spaces",
  },
  privateKey: {
    label: "Private key",
    glyph: "🔑",
    sectionTitle: "Private key",
    placeholder: "0x… private key",
  },
  json: {
    label: "Keystore",
    glyph: "🗎",
    sectionTitle: "Keystore JSON",
    placeholder: "Paste the keystore (UTC / v3 JSON) file contents",
  },
  watch: {
    label: "Watch-only",
    glyph: "👁",
    sectionTitle: "Watch address",
    placeholder: "Address or *.lux name to watch",
  },
}

/** Render order for the method picker pills. */
const METHOD_ORDER: ImportMethod[] = ["seed", "privateKey", "json", "watch"]

export function ImportWallet({
  method,
  onChangeMethod,
  value,
  onChangeValue,
  jsonPassword,
  onChangeJsonPassword,
  error,
  discoveredAccounts,
  onToggleAccount,
  canSubmit,
  importing,
  onSubmit,
  onBack,
}: ImportWalletProps): React.JSX.Element {
  const active = METHOD_META[method]

  return (
    <ScreenScaffold
      title="Import wallet"
      onBack={onBack}
      footer={
        <Button
          disabled={!canSubmit || importing}
          onPress={onSubmit}
          testID="import-submit"
        >
          {importing ? "Importing…" : method === "watch" ? "Add watch-only" : "Import"}
        </Button>
      }
    >
      <Card title="Import method">
        <XStack gap="$2" flexWrap="wrap">
          {METHOD_ORDER.map((m) => {
            const meta = METHOD_META[m]
            const isActive = m === method
            return (
              <Button
                key={m}
                tone={isActive ? "primary" : "secondary"}
                full={false}
                size="$3"
                onPress={() => onChangeMethod(m)}
                testID={`import-method-${m}`}
              >
                {meta.glyph} {meta.label}
              </Button>
            )
          })}
        </XStack>
      </Card>

      <Card title={active.sectionTitle}>
        <Input
          value={value}
          onChangeText={onChangeValue}
          placeholder={active.placeholder}
          inputMode="text"
          testID="import-value-input"
        />

        {method === "json" ? (
          <Input
            value={jsonPassword ?? ""}
            onChangeText={onChangeJsonPassword}
            placeholder="Keystore password"
            inputMode="text"
            testID="import-json-password"
          />
        ) : null}

        {error ? (
          <Text fontSize={12} color="$statusCritical" testID="import-error">
            {error}
          </Text>
        ) : null}
      </Card>

      {method === "seed" && discoveredAccounts && discoveredAccounts.length > 0 ? (
        <Card title="Select accounts to import">
          {discoveredAccounts.map((acct) => (
            <XStack
              key={acct.address}
              alignItems="center"
              justifyContent="space-between"
              gap="$3"
              padding="$3"
              borderRadius="$4"
              backgroundColor="$surface3"
            >
              <YStack gap="$1" flex={1}>
                <Text fontSize={14} color="$neutral1">
                  {shortenAddress(acct.address)}
                </Text>
                {acct.balanceLabel ? (
                  <Text fontSize={12} color="$neutral2">
                    {acct.balanceLabel}
                  </Text>
                ) : null}
              </YStack>
              <Button
                tone={acct.selected ? "primary" : "secondary"}
                full={false}
                size="$2"
                onPress={onToggleAccount ? () => onToggleAccount(acct.address) : undefined}
                testID={`import-account-${acct.address}`}
              >
                {acct.selected ? "✓ Selected" : "Select"}
              </Button>
            </XStack>
          ))}
        </Card>
      ) : null}
    </ScreenScaffold>
  )
}

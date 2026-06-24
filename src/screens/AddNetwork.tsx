/**
 * AddNetwork screen shell (SCREENS.md — Networks / custom RPC).
 *
 * Add or edit a custom RPC / testnet chain (name, RPC URL, chain ID, currency
 * symbol, block explorer) with inline validation, plus enable/disable the
 * already-known chains.
 *
 * PURE PRESENTATION: every value is controlled from outside and every action
 * is a callback. Validation results arrive via `errors` (a list of
 * `{ field, message }`) and the in-flight RPC probe via `validating`;
 * `canSubmit` gates the action. NO RPC, NO chainId probing, NO signing, NO
 * @luxwallet/sdk import, NO direct react-native import — the SDK does all of
 * that and feeds this shell. (Fork of CustomTestnet / CustomRPC +
 * ChainManagement.)
 */
import { XStack, YStack, Input, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ChainBadge } from "../components/ChainBadge"
import { ScreenScaffold } from "../components/ScreenScaffold"
import type { ChainKind } from "../chains"

/** A single field-level validation message from the SDK. */
export interface FieldError {
  /** Which input the message belongs to (one of {@link AddNetworkField}). */
  field: string
  message: string
}

/** The editable fields of the custom-network form (for `errors[].field`). */
export type AddNetworkField =
  | "name"
  | "rpcUrl"
  | "chainId"
  | "symbol"
  | "explorerUrl"

/** A known chain the user can toggle on/off in the network list. */
export interface KnownChain {
  /** Stable id used as the React key and passed to `onToggleChain`. */
  id: string
  /** Display name, e.g. "Lux C-Chain". */
  name: string
  /** Optional pre-formatted detail line, e.g. "EVM · chainId 96369". */
  subLabel?: string
  chainKind?: ChainKind
  chainLabel?: string
  /** Whether the chain is currently enabled in the wallet. */
  enabled: boolean
}

export interface AddNetworkProps {
  // --- Custom network form (controlled) ---
  /** Human-readable network name. */
  name: string
  onChangeName: (next: string) => void

  /** RPC endpoint URL. */
  rpcUrl: string
  onChangeRpcUrl: (next: string) => void

  /** Chain ID, as a raw string (the SDK parses / normalizes). */
  chainId: string
  onChangeChainId: (next: string) => void

  /** Native currency symbol, e.g. "LUX". */
  symbol: string
  onChangeSymbol: (next: string) => void

  /** Optional block-explorer base URL. */
  explorerUrl?: string
  onChangeExplorerUrl?: (next: string) => void

  /** Field-level validation messages from the SDK, matched by `field`. */
  errors?: FieldError[]
  /** True while the SDK is probing the RPC / confirming the chain ID. */
  validating?: boolean
  /** Gates the submit action (the SDK decides when the form is valid). */
  canSubmit: boolean
  onSubmit: () => void

  // --- Optional editing affordance ---
  /**
   * When true the screen frames itself as editing an existing network
   * (title + submit copy). Defaults to add-mode.
   */
  editing?: boolean

  // --- Optional known-chain management ---
  /**
   * The already-known chains, rendered as a toggle list below the form. When
   * omitted the list section is hidden and the screen is form-only.
   */
  knownChains?: KnownChain[]
  /** Fired when a known chain's enable toggle is tapped. */
  onToggleChain?: (id: string) => void

  onBack?: () => void
}

/** Per-field input row metadata, in display order. */
const FIELDS: {
  field: AddNetworkField
  label: string
  placeholder: string
  optional?: boolean
}[] = [
  { field: "name", label: "Network name", placeholder: "e.g. Lux C-Chain" },
  { field: "rpcUrl", label: "RPC URL", placeholder: "https://…" },
  { field: "chainId", label: "Chain ID", placeholder: "e.g. 96369" },
  { field: "symbol", label: "Currency symbol", placeholder: "e.g. LUX" },
  {
    field: "explorerUrl",
    label: "Block explorer URL",
    placeholder: "https://… (optional)",
    optional: true,
  },
]

export function AddNetwork(props: AddNetworkProps): React.JSX.Element {
  const {
    name,
    onChangeName,
    rpcUrl,
    onChangeRpcUrl,
    chainId,
    onChangeChainId,
    symbol,
    onChangeSymbol,
    explorerUrl,
    onChangeExplorerUrl,
    errors,
    validating,
    canSubmit,
    onSubmit,
    editing,
    knownChains,
    onToggleChain,
    onBack,
  } = props

  // Map each field's controlled value + setter so the form renders in one loop.
  const valueFor: Record<AddNetworkField, string> = {
    name,
    rpcUrl,
    chainId,
    symbol,
    explorerUrl: explorerUrl ?? "",
  }
  const setterFor: Record<AddNetworkField, ((next: string) => void) | undefined> = {
    name: onChangeName,
    rpcUrl: onChangeRpcUrl,
    chainId: onChangeChainId,
    symbol: onChangeSymbol,
    explorerUrl: onChangeExplorerUrl,
  }
  const errorFor = (field: AddNetworkField): string | undefined =>
    errors?.find((e) => e.field === field)?.message

  return (
    <ScreenScaffold
      title={editing ? "Edit network" : "Add network"}
      onBack={onBack}
      footer={
        <Button
          disabled={!canSubmit || validating}
          onPress={onSubmit}
          testID="add-network-submit"
        >
          {validating
            ? "Validating…"
            : editing
              ? "Save network"
              : "Add network"}
        </Button>
      }
    >
      <Card title="Custom network">
        {FIELDS.map(({ field, label, placeholder, optional }) => {
          // The explorer field is only rendered when a setter is supplied
          // (it's the one optional callback in the contract).
          if (field === "explorerUrl" && !onChangeExplorerUrl) return null
          const fieldError = errorFor(field)
          return (
            <YStack key={field} gap="$1">
              <XStack alignItems="center" justifyContent="space-between">
                <Text fontSize={13} color="$neutral2" fontWeight="600">
                  {label}
                </Text>
                {optional ? (
                  <Text fontSize={12} color="$neutral2">
                    optional
                  </Text>
                ) : null}
              </XStack>
              <Input
                value={valueFor[field]}
                onChangeText={setterFor[field]}
                placeholder={placeholder}
                inputMode={field === "chainId" ? "numeric" : undefined}
                testID={`add-network-${field}`}
              />
              {fieldError ? (
                <Text
                  fontSize={12}
                  color="$statusCritical"
                  testID={`add-network-${field}-error`}
                >
                  {fieldError}
                </Text>
              ) : null}
            </YStack>
          )
        })}

        {validating ? (
          <Text fontSize={12} color="$neutral2" testID="add-network-validating">
            Checking the RPC endpoint…
          </Text>
        ) : null}
      </Card>

      {knownChains && knownChains.length > 0 ? (
        <Card title="Known chains">
          {knownChains.map((chain) => (
            <XStack
              key={chain.id}
              alignItems="center"
              justifyContent="space-between"
              gap="$3"
              padding="$3"
              borderRadius="$4"
              backgroundColor="$surface3"
              testID={`add-network-chain-${chain.id}`}
            >
              <YStack gap="$1" flex={1}>
                <XStack alignItems="center" gap="$2">
                  <Text fontSize={14} color="$neutral1">
                    {chain.name}
                  </Text>
                  {chain.chainKind || chain.chainLabel ? (
                    <ChainBadge kind={chain.chainKind} label={chain.chainLabel} />
                  ) : null}
                </XStack>
                {chain.subLabel ? (
                  <Text fontSize={12} color="$neutral2">
                    {chain.subLabel}
                  </Text>
                ) : null}
              </YStack>
              <Button
                tone={chain.enabled ? "primary" : "secondary"}
                full={false}
                size="$2"
                onPress={onToggleChain ? () => onToggleChain(chain.id) : undefined}
                testID={`add-network-toggle-${chain.id}`}
              >
                {chain.enabled ? "On" : "Off"}
              </Button>
            </XStack>
          ))}
        </Card>
      ) : null}
    </ScreenScaffold>
  )
}

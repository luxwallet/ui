/**
 * SignMessage screen shell (SCREENS.md — off-chain signature request).
 *
 * The confirmation surface for OFF-CHAIN signatures: `personal_sign` plain text
 * (variant "text") and EIP-712 typed data (variant "typedData"). It shows the
 * requesting origin, the signing account, the decoded message body, an optional
 * risk indicator, and sign/reject actions. Forked from Approval/SignText +
 * Approval/SignTypedData.
 *
 * PURE PRESENTATION: the decoded message text, the typed-data domain/rows, the
 * risk level, and the request origin are produced by @luxwallet/sdk and passed
 * in. This component never decodes payloads, talks to a provider, or signs —
 * it only renders what it's given and fires `onSign` / `onReject`.
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ScreenScaffold } from "../components/ScreenScaffold"
import { shortenAddress } from "../chains"

export type SignMessageVariant = "text" | "typedData"

export type RiskLevel = "low" | "medium" | "high"

/** A single label/value pair in the EIP-712 domain or message body. */
export interface TypedDataRow {
  label: string
  value: string
}

/** Decoded EIP-712 payload, split into domain separator and message fields. */
export interface TypedDataView {
  /** Domain separator fields (name, version, chainId, verifyingContract, …). */
  domain: TypedDataRow[]
  /** Flattened message fields, already decoded to display strings. */
  rows: TypedDataRow[]
}

/** The account that will produce the signature. */
export interface SignMessageAccount {
  /** Display name, e.g. "zach.lux". */
  label: string
  address: string
}

export interface SignMessageProps {
  /** "text" → personal_sign plain text; "typedData" → EIP-712 typed data. */
  variant: SignMessageVariant
  /** Origin requesting the signature, e.g. a dapp host. */
  origin?: string
  /** Favicon / logo URL for the requesting site (rendered as a small chip). */
  siteIconUrl?: string
  /** The signing account. */
  account: SignMessageAccount
  /** Decoded plain-text message body — used when `variant` is "text". */
  messageText?: string
  /** Decoded typed-data view — used when `variant` is "typedData". */
  typedData?: TypedDataView
  /** Risk assessment from the decoder. */
  risk?: RiskLevel
  /** Risk explanation copy. */
  riskReason?: string
  /** True while the signature is being produced (disables the Sign button). */
  signing?: boolean
  onSign: () => void
  onReject: () => void
}

const riskColor: Record<RiskLevel, string> = {
  low: "$statusSuccess",
  medium: "$statusWarning",
  high: "$statusCritical",
}

/** Initial used for the site-icon fallback chip (no image atom yet — see notes). */
function originInitial(origin?: string): string {
  const c = origin?.trim().replace(/^https?:\/\//, "")[0]
  return c ? c.toUpperCase() : "?"
}

/** One label/value line, matching the Signing screen's detail rows. */
function DetailRow({ label, value }: TypedDataRow): React.JSX.Element {
  return (
    <XStack justifyContent="space-between" gap="$3">
      <Text fontSize={13} color="$neutral2">
        {label}
      </Text>
      <Text fontSize={13} color="$neutral1" textAlign="right">
        {value}
      </Text>
    </XStack>
  )
}

export function SignMessage({
  variant,
  origin,
  siteIconUrl,
  account,
  messageText,
  typedData,
  risk,
  riskReason,
  signing,
  onSign,
  onReject,
}: SignMessageProps): React.JSX.Element {
  const title = variant === "typedData" ? "Sign typed data" : "Sign message"

  return (
    <ScreenScaffold
      title={title}
      footer={
        <XStack gap="$2">
          <Button tone="secondary" full={false} flex={1} onPress={onReject}>
            Reject
          </Button>
          <Button tone="primary" full={false} flex={1} disabled={signing} onPress={onSign}>
            {signing ? "Signing…" : "Sign"}
          </Button>
        </XStack>
      }
    >
      {origin ? (
        <Card>
          <Text fontSize={13} color="$neutral2">
            Requested by
          </Text>
          <XStack alignItems="center" gap="$2">
            {/* Site-icon fallback chip; `siteIconUrl` carried for a future image atom (see notes). */}
            <YStack
              width={20}
              height={20}
              borderRadius="$10"
              backgroundColor="$surface1"
              borderWidth={1}
              borderColor="$borderColor"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={11} color="$neutral2">
                {originInitial(origin)}
              </Text>
            </YStack>
            <Text fontSize={14} color="$neutral1">
              {origin}
            </Text>
          </XStack>
        </Card>
      ) : null}

      <Card>
        <XStack justifyContent="space-between" gap="$3" alignItems="center">
          <Text fontSize={13} color="$neutral2">
            Signing with
          </Text>
          <YStack alignItems="flex-end">
            <Text fontSize={14} color="$neutral1">
              {account.label}
            </Text>
            <Text fontSize={12} color="$neutral2">
              {shortenAddress(account.address)}
            </Text>
          </YStack>
        </XStack>
      </Card>

      {variant === "typedData" ? (
        <>
          {typedData && typedData.domain.length > 0 ? (
            <Card title="Domain">
              {typedData.domain.map((row) => (
                <DetailRow key={row.label} label={row.label} value={row.value} />
              ))}
            </Card>
          ) : null}

          <Card title="Message">
            {typedData && typedData.rows.length > 0 ? (
              typedData.rows.map((row) => (
                <DetailRow key={row.label} label={row.label} value={row.value} />
              ))
            ) : (
              <Text fontSize={13} color="$neutral2">
                No fields to display.
              </Text>
            )}
          </Card>
        </>
      ) : (
        <Card title="Message">
          <Text fontSize={13} color="$neutral1">
            {messageText && messageText.length > 0 ? messageText : "(empty message)"}
          </Text>
        </Card>
      )}

      {risk ? (
        <Card>
          <XStack alignItems="center" gap="$2">
            <Text fontSize={13} color={riskColor[risk]}>
              ● Risk: {risk}
            </Text>
          </XStack>
          {riskReason ? (
            <Text fontSize={12} color="$neutral2">
              {riskReason}
            </Text>
          ) : null}
        </Card>
      ) : null}
    </ScreenScaffold>
  )
}

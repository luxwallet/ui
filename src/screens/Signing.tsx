/**
 * Signing screen shell (SCREENS.md §7 / signing modal — TxSummary +
 * RiskIndicator). The confirmation surface shown before any transaction is
 * signed: a human-readable summary, a risk indicator, and approve/reject.
 *
 * PURE PRESENTATION: the decoded summary rows, risk level, and request origin
 * are produced by @luxwallet/sdk's transaction decoder and passed in. This
 * component never inspects calldata or signs anything.
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ScreenScaffold } from "../components/ScreenScaffold"

export type RiskLevel = "low" | "medium" | "high"

export interface SummaryRow {
  label: string
  value: string
}

export interface SigningProps {
  /** What is being signed, e.g. "Approve transaction" / "Sign message". */
  title?: string
  /** Origin requesting the signature, e.g. a dapp host. */
  origin?: string
  /** Decoded, human-readable summary rows. */
  summary: SummaryRow[]
  /** Risk assessment from the decoder. */
  risk?: RiskLevel
  /** Risk explanation copy. */
  riskReason?: string
  approving?: boolean
  onApprove: () => void
  onReject: () => void
}

const riskColor: Record<RiskLevel, string> = {
  low: "$statusSuccess",
  medium: "$statusWarning",
  high: "$statusCritical",
}

export function Signing({
  title = "Confirm transaction",
  origin,
  summary,
  risk,
  riskReason,
  approving,
  onApprove,
  onReject,
}: SigningProps): React.JSX.Element {
  return (
    <ScreenScaffold
      title={title}
      footer={
        <XStack gap="$2">
          <Button tone="secondary" full={false} flex={1} onPress={onReject}>
            Reject
          </Button>
          <Button tone="primary" full={false} flex={1} disabled={approving} onPress={onApprove}>
            {approving ? "Signing…" : "Approve"}
          </Button>
        </XStack>
      }
    >
      {origin ? (
        <Card>
          <Text fontSize={13} color="$neutral2">
            Requested by
          </Text>
          <Text fontSize={14} color="$neutral1">
            {origin}
          </Text>
        </Card>
      ) : null}

      <Card title="Details">
        {summary.map((row) => (
          <XStack key={row.label} justifyContent="space-between" gap="$3">
            <Text fontSize={13} color="$neutral2">
              {row.label}
            </Text>
            <Text fontSize={13} color="$neutral1" textAlign="right">
              {row.value}
            </Text>
          </XStack>
        ))}
      </Card>

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

/**
 * ApproveConnection screen shell — the dapp connection-request approval
 * surface. Shown when a website asks to connect to the wallet: it presents the
 * requesting site (logo + origin host), the chain the dapp wants to use, which
 * account will be exposed, a security-engine risk verdict, and approve/reject.
 *
 * This is DISTINCT from ConnectWallet: ConnectWallet is the wallet-side
 * connector picker (which chain ecosystem / which injected wallet to sign in
 * with). ApproveConnection is the dapp-side consent prompt — the user has a
 * wallet already and is deciding whether to grant a site access to it.
 *
 * PURE PRESENTATION: the origin, resolved chain, selected account, and the risk
 * assessment are produced by @luxwallet/sdk (its security engine + connection
 * manager) and passed in. This component performs NO RPC, NO signing, and never
 * inspects the request — it only renders choices and fires callbacks.
 *
 * SPDX-License-Identifier: MIT
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ChainBadge } from "../components/ChainBadge"
import { ScreenScaffold } from "../components/ScreenScaffold"
import { shortenAddress, type ChainKind } from "../chains"

/** Security-engine risk verdict for the requesting origin. */
export type ConnectionRisk = "low" | "medium" | "high"

export interface ApproveConnectionProps {
  /** Full origin requesting the connection, e.g. "https://app.uniswap.org". */
  origin: string
  /** Human display name for the site, when the SDK can resolve one. */
  siteName?: string
  /** Site favicon / logo URL; falls back to a monogram when absent. */
  siteIconUrl?: string

  /** Pre-formatted chain label the dapp wants to use, e.g. "Lux C-Chain". */
  chainLabel: string
  /** Known chain kind, used by ChainBadge to pick a glyph. */
  chainKind?: ChainKind

  /** The account that will be exposed to the site if approved. */
  account: { label: string; address: string }

  /** Risk level from the security engine. */
  risk?: ConnectionRisk
  /** Risk explanation copy from the security engine. */
  riskReason?: string

  /** Fired when the user taps "Change" on the chain row (app opens a picker). */
  onSelectChain?: () => void
  /** Fired when the user taps "Change" on the account row. */
  onSelectAccount?: () => void

  /** True while the connection is being established. */
  approving?: boolean
  onApprove: () => void
  onReject: () => void
}

/** Risk → token color, matching the Signing screen's risk indicator. */
const riskColor: Record<ConnectionRisk, string> = {
  low: "$statusSuccess",
  medium: "$statusWarning",
  high: "$statusCritical",
}

/**
 * Best-effort host extraction for the header line, purely cosmetic. Never
 * throws: an unparseable origin is shown verbatim. (No validation here — the
 * SDK already vetted the request; this is display only.)
 */
function originHost(origin: string): string {
  const stripped = origin.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "")
  const host = stripped.split("/")[0] ?? stripped
  return host || origin
}

/** First letter of the site name (or host) for the monogram fallback. */
function siteMonogram(siteName: string | undefined, host: string): string {
  const source = (siteName ?? host).trim()
  const ch = source.charAt(0)
  return ch ? ch.toUpperCase() : "●"
}

export function ApproveConnection(props: ApproveConnectionProps): React.JSX.Element {
  const {
    origin,
    siteName,
    siteIconUrl,
    chainLabel,
    chainKind,
    account,
    risk,
    riskReason,
    onSelectChain,
    onSelectAccount,
    approving,
    onApprove,
    onReject,
  } = props

  const host = originHost(origin)
  const title = siteName ?? host

  return (
    <ScreenScaffold
      title="Connection request"
      footer={
        <XStack gap="$2">
          <Button tone="secondary" full={false} flex={1} onPress={onReject} testID="approve-reject">
            Reject
          </Button>
          <Button
            tone={risk === "high" ? "danger" : "primary"}
            full={false}
            flex={1}
            disabled={approving}
            onPress={onApprove}
            testID="approve-connect"
          >
            {approving ? "Connecting…" : "Connect"}
          </Button>
        </XStack>
      }
    >
      <Card>
        <XStack alignItems="center" gap="$3">
          {/* Site logo. No Avatar/Image primitive exists in this lib yet, so we
              render a monogram circle as the fallback (matching ChainBadge's
              glyph-fallback approach). siteIconUrl is surfaced as the
              accessible label until an Image atom lands — see `notes`. */}
          <YStack
            width={44}
            height={44}
            borderRadius="$10"
            backgroundColor="$surface3"
            alignItems="center"
            justifyContent="center"
            testID="approve-site-icon"
            aria-label={siteIconUrl ? `${title} logo` : undefined}
          >
            <Text fontSize={18} fontWeight="700" color="$neutral1">
              {siteMonogram(siteName, host)}
            </Text>
          </YStack>
          <YStack flex={1} gap="$1">
            <Text fontSize={16} fontWeight="600" color="$neutral1">
              {title}
            </Text>
            <Text fontSize={12} color="$neutral2">
              {host}
            </Text>
          </YStack>
        </XStack>
        <Text fontSize={13} color="$neutral2">
          wants to connect to your wallet
        </Text>
      </Card>

      <Card title="Network">
        <XStack alignItems="center" justifyContent="space-between" gap="$3">
          <ChainBadge kind={chainKind} label={chainLabel} />
          {onSelectChain ? (
            <Button
              tone="secondary"
              full={false}
              size="$2"
              onPress={onSelectChain}
              testID="approve-change-chain"
            >
              Change
            </Button>
          ) : null}
        </XStack>
      </Card>

      <Card title="Account">
        <XStack alignItems="center" justifyContent="space-between" gap="$3">
          <YStack gap="$1">
            <Text fontSize={15} fontWeight="600" color="$neutral1">
              {account.label}
            </Text>
            <Text fontSize={12} color="$neutral2">
              {shortenAddress(account.address)}
            </Text>
          </YStack>
          {onSelectAccount ? (
            <Button
              tone="secondary"
              full={false}
              size="$2"
              onPress={onSelectAccount}
              testID="approve-change-account"
            >
              Change
            </Button>
          ) : null}
        </XStack>
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

      <Text fontSize={12} color="$neutral2">
        Connecting lets this site see your address and request approvals. It
        cannot move funds without a separate confirmation.
      </Text>
    </ScreenScaffold>
  )
}

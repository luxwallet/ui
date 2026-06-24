/**
 * ConnectedSites screen shell — the dapp-permission manager. Lists every site
 * that currently holds a connection grant to this wallet, with the chain each
 * one is bound to, a pin/favorite affordance, a per-site disconnect, and a
 * "Disconnect all" sweep. Forked from the legacy ConnectedSites surface and
 * shaped to match AccountList (grouped/per-row controls + empty state) and
 * ApproveConnection (site logo + origin presentation).
 *
 * This is the inverse of ApproveConnection: ApproveConnection grants a new
 * connection; ConnectedSites reviews and revokes existing ones.
 *
 * PURE PRESENTATION: the site list (origins, names, icons, resolved chain
 * labels, pin state) is produced by @luxwallet/sdk's connection manager and
 * passed in. This component performs NO RPC, NO signing, and never inspects or
 * mutates the permission store — it only renders rows and fires callbacks.
 *
 * SPDX-License-Identifier: MIT
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ChainBadge } from "../components/ChainBadge"
import { ScreenScaffold } from "../components/ScreenScaffold"

/** One dapp that currently holds a connection grant. */
export interface ConnectedSite {
  /** Full origin holding the grant, e.g. "https://app.uniswap.org". Unique key. */
  origin: string
  /** Human display name for the site, when the SDK can resolve one. */
  name?: string
  /** Site favicon / logo URL; falls back to a monogram when absent. */
  iconUrl?: string
  /** Pre-formatted chain label the site is bound to, e.g. "Lux C-Chain". */
  chainLabel?: string
  /** Pinned/favorited — surfaced with a filled star affordance. */
  pinned?: boolean
}

export interface ConnectedSitesProps {
  /** Sites currently granted permission to this wallet. */
  sites: ConnectedSite[]
  /** Revoke the grant for a single site. */
  onDisconnect: (origin: string) => void
  /** Toggle pin/favorite for a site. */
  onTogglePin?: (origin: string) => void
  /** Revoke every grant at once. */
  onDisconnectAll?: () => void
  /** Copy shown when no sites are connected. */
  emptyHint?: string
  onBack?: () => void
}

/**
 * Best-effort host extraction for the row title, purely cosmetic. Never throws:
 * an unparseable origin is shown verbatim. (No validation here — the SDK owns
 * the permission store; this is display only.)
 */
function originHost(origin: string): string {
  const stripped = origin.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "")
  const host = stripped.split("/")[0] ?? stripped
  return host || origin
}

/** First letter of the site name (or host) for the monogram fallback. */
function siteMonogram(name: string | undefined, host: string): string {
  const source = (name ?? host).trim()
  const ch = source.charAt(0)
  return ch ? ch.toUpperCase() : "●"
}

export function ConnectedSites(props: ConnectedSitesProps): React.JSX.Element {
  const { sites, onDisconnect, onTogglePin, onDisconnectAll, emptyHint, onBack } = props

  const isEmpty = sites.length === 0

  return (
    <ScreenScaffold
      title="Connected sites"
      onBack={onBack}
      headerRight={
        onDisconnectAll && !isEmpty ? (
          <Button
            tone="secondary"
            full={false}
            size="$2"
            onPress={onDisconnectAll}
            testID="connected-disconnect-all"
          >
            Disconnect all
          </Button>
        ) : null
      }
    >
      {isEmpty ? (
        <Card>
          <Text fontSize={13} color="$neutral2" textAlign="center">
            {emptyHint ?? "No sites are connected to your wallet."}
          </Text>
        </Card>
      ) : (
        <Card title={`${sites.length} ${sites.length === 1 ? "site" : "sites"} connected`}>
          {sites.map((site) => {
            const host = originHost(site.origin)
            const title = site.name ?? host

            return (
              <XStack
                key={site.origin}
                alignItems="center"
                justifyContent="space-between"
                gap="$3"
                padding="$3"
                borderRadius="$4"
                testID={`connected-row-${site.origin}`}
              >
                <XStack flex={1} alignItems="center" gap="$3">
                  {/* Site logo. No Avatar/Image primitive exists in this lib
                      yet, so we render a monogram circle as the fallback
                      (matching ApproveConnection). iconUrl is surfaced as the
                      accessible label until an Image atom lands — see `notes`. */}
                  <YStack
                    width={36}
                    height={36}
                    borderRadius="$10"
                    backgroundColor="$surface3"
                    alignItems="center"
                    justifyContent="center"
                    testID={`connected-icon-${site.origin}`}
                    aria-label={site.iconUrl ? `${title} logo` : undefined}
                  >
                    <Text fontSize={15} fontWeight="700" color="$neutral1">
                      {siteMonogram(site.name, host)}
                    </Text>
                  </YStack>
                  <YStack flex={1} gap="$1">
                    <XStack alignItems="center" gap="$2" flexWrap="wrap">
                      <Text fontSize={15} fontWeight="600" color="$neutral1">
                        {title}
                      </Text>
                      {site.chainLabel ? <ChainBadge label={site.chainLabel} /> : null}
                    </XStack>
                    <Text fontSize={12} color="$neutral2">
                      {host}
                    </Text>
                  </YStack>
                </XStack>

                <XStack gap="$1" alignItems="center">
                  {onTogglePin ? (
                    <Button
                      chromeless
                      full={false}
                      size="$2"
                      onPress={() => onTogglePin(site.origin)}
                      testID={`connected-pin-${site.origin}`}
                    >
                      {site.pinned ? "★" : "☆"}
                    </Button>
                  ) : null}
                  <Button
                    tone="danger"
                    full={false}
                    size="$2"
                    onPress={() => onDisconnect(site.origin)}
                    testID={`connected-disconnect-${site.origin}`}
                  >
                    Disconnect
                  </Button>
                </XStack>
              </XStack>
            )
          })}
        </Card>
      )}
    </ScreenScaffold>
  )
}

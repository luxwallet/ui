/**
 * ConnectWallet screen shell — the SIWx (Sign-In With X) login surface.
 *
 * Presents the five chain ecosystems supported by @luxwallet/connect
 * (EVM / Solana / Bitcoin / TON / XRP). For the chosen chain it lists the
 * available connectors (injected wallets, WalletConnect, etc.) passed by the
 * app. PURE PRESENTATION: connector discovery, the SIWx challenge, and the
 * signature all happen in @luxwallet/connect + @luxwallet/sdk. This component
 * only renders choices and fires `onSelectConnector`.
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ChainBadge } from "../components/ChainBadge"
import { ScreenScaffold } from "../components/ScreenScaffold"
import { LOGIN_CHAINS, type ChainKind } from "../chains"

export interface WalletConnector {
  id: string
  name: string
  /** Whether this connector is detected/available right now. */
  ready?: boolean
}

export interface ConnectWalletProps {
  /** Currently selected chain ecosystem. */
  selectedChain: ChainKind
  onSelectChain: (kind: ChainKind) => void
  /** Connectors for the selected chain (from @luxwallet/connect). */
  connectors: WalletConnector[]
  /** Fired when a connector is chosen — app starts the SIWx flow. */
  onSelectConnector: (connector: WalletConnector) => void
  /** True while a SIWx challenge is being signed. */
  connecting?: boolean
  /** Error from the connect/SIWx flow, rendered inline. */
  error?: string
  /** Optional product/brand title. */
  title?: string
  /**
   * Primary unified-auth action — Hanzo IAM (social / email / password) via
   * @hanzo/iam (HIP-0111). When provided, rendered as the top CTA above the
   * wallet chain picker. Omit to show wallet-only login.
   */
  onIamLogin?: () => void
  /** Label for the IAM button. */
  iamLabel?: string
}

export function ConnectWallet({
  selectedChain,
  onSelectChain,
  connectors,
  onSelectConnector,
  connecting,
  error,
  title = "Connect a wallet",
  onIamLogin,
  iamLabel = "Continue with Hanzo",
}: ConnectWalletProps): React.JSX.Element {
  return (
    <ScreenScaffold title={title}>
      {onIamLogin ? (
        <Card title="Sign in">
          <Button tone="primary" size="$4" onPress={onIamLogin} testID="connect-iam">
            {iamLabel}
          </Button>
          <Text fontSize={12} color="$neutral2" marginTop="$2">
            Google, GitHub, email, or password — secured by Hanzo IAM.
          </Text>
        </Card>
      ) : null}

      <Card title="Chain">
        <XStack gap="$2" flexWrap="wrap">
          {LOGIN_CHAINS.map((chain) => {
            const active = chain.kind === selectedChain
            return (
              <Button
                key={chain.kind}
                tone={active ? "primary" : "secondary"}
                full={false}
                size="$3"
                onPress={() => onSelectChain(chain.kind)}
                testID={`connect-chain-${chain.kind}`}
              >
                {chain.glyph} {chain.label}
              </Button>
            )
          })}
        </XStack>
      </Card>

      <Card title="Wallet">
        {connectors.length === 0 ? (
          <Text fontSize={13} color="$neutral2">
            No wallets detected for <ChainBadge kind={selectedChain} />. Install one or use
            WalletConnect.
          </Text>
        ) : (
          connectors.map((c) => (
            <Button
              key={c.id}
              tone="secondary"
              disabled={connecting || c.ready === false}
              onPress={() => onSelectConnector(c)}
              testID={`connect-connector-${c.id}`}
            >
              {c.name}
              {c.ready === false ? " (not detected)" : ""}
            </Button>
          ))
        )}
      </Card>

      {connecting ? (
        <Text fontSize={13} color="$neutral2" textAlign="center">
          Sign the message in your wallet to continue…
        </Text>
      ) : null}

      {error ? (
        <Text fontSize={13} color="$statusCritical" textAlign="center">
          {error}
        </Text>
      ) : null}
    </ScreenScaffold>
  )
}

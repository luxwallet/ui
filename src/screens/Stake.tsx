/**
 * Stake screen shell (SCREENS.md §4 — Staking).
 *
 * Network selector, current-stake summary with claimable rewards, and a
 * validator list (APR, uptime, slash risk) each with a Delegate action. PURE
 * PRESENTATION: validator data + reward math come from @luxwallet/sdk.
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ScreenScaffold } from "../components/ScreenScaffold"

export interface Validator {
  id: string
  name: string
  /** Pre-formatted, e.g. "8.2M ZOO". */
  stakeLabel: string
  /** Pre-formatted, e.g. "99.97%". */
  uptimeLabel: string
  /** Pre-formatted, e.g. "8.4% APR". */
  rewardLabel: string
  /** Pre-formatted, e.g. "low". */
  slashRiskLabel: string
  /** Disable Delegate (e.g. at capacity / slashed). */
  disabled?: boolean
  /** Optional badge text, e.g. "At capacity". */
  badge?: string
}

export interface StakeProps {
  networkLabel: string
  onSelectNetwork?: () => void

  /** Pre-formatted current stake, e.g. "12,500 ZOO". */
  stakeLabel: string
  /** Pre-formatted delegation count, e.g. "3 validators". */
  delegationsLabel?: string
  /** Pre-formatted pending rewards, e.g. "142 ZOO". */
  pendingRewardsLabel?: string
  canClaim?: boolean
  onClaim?: () => void

  validators: Validator[]
  onDelegate?: (validator: Validator) => void
  onBack?: () => void
}

export function Stake({
  networkLabel,
  onSelectNetwork,
  stakeLabel,
  delegationsLabel,
  pendingRewardsLabel,
  canClaim,
  onClaim,
  validators,
  onDelegate,
  onBack,
}: StakeProps): React.JSX.Element {
  return (
    <ScreenScaffold title="Staking" onBack={onBack}>
      <Card title="Network">
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize={14} color="$neutral1">
            {networkLabel}
          </Text>
          <Button tone="secondary" full={false} size="$2" onPress={onSelectNetwork}>
            Change
          </Button>
        </XStack>
      </Card>

      <Card title="Your stake">
        <XStack alignItems="baseline" gap="$2">
          <Text fontSize={20} fontWeight="700" color="$neutral1">
            {stakeLabel}
          </Text>
          {delegationsLabel ? (
            <Text fontSize={13} color="$neutral2">
              {delegationsLabel}
            </Text>
          ) : null}
        </XStack>
        {pendingRewardsLabel ? (
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontSize={13} color="$neutral2">
              Pending rewards: {pendingRewardsLabel}
            </Text>
            <Button tone="secondary" full={false} size="$2" disabled={!canClaim} onPress={onClaim}>
              Claim
            </Button>
          </XStack>
        ) : null}
      </Card>

      <Card title="Active validators">
        {validators.map((v) => (
          <YStack
            key={v.id}
            gap="$1"
            padding="$3"
            borderRadius="$4"
            backgroundColor="$surface3"
          >
            <XStack alignItems="center" justifyContent="space-between">
              <Text fontSize={14} fontWeight="600" color="$neutral1">
                {v.name}
              </Text>
              {v.badge ? (
                <Text fontSize={12} color="$statusWarning">
                  {v.badge}
                </Text>
              ) : null}
            </XStack>
            <Text fontSize={12} color="$neutral2">
              Stake {v.stakeLabel} • Uptime {v.uptimeLabel}
            </Text>
            <Text fontSize={12} color="$neutral2">
              Reward {v.rewardLabel} • Slash risk: {v.slashRiskLabel}
            </Text>
            <Button
              tone="secondary"
              full={false}
              size="$2"
              disabled={v.disabled}
              onPress={onDelegate ? () => onDelegate(v) : undefined}
            >
              Delegate
            </Button>
          </YStack>
        ))}
      </Card>
    </ScreenScaffold>
  )
}

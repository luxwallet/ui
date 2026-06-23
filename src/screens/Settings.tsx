/**
 * Settings screen shell (SCREENS.md §10 — Settings).
 *
 * A grouped list of settings entries. PURE PRESENTATION: the entries (label,
 * optional value, action) are declared by the app; this renders the tree and
 * routes taps back via each entry's `onPress`. Theme/network/backup logic all
 * live in the app + @luxwallet/sdk.
 */
import { XStack, YStack, Text } from "@hanzo/gui"
import { Card } from "../components/Card"
import { ScreenScaffold } from "../components/ScreenScaffold"

export interface SettingsEntry {
  id: string
  label: string
  /** Optional trailing value, e.g. current theme "Auto" or version "3.0.0". */
  value?: string
  onPress?: () => void
}

export interface SettingsGroup {
  title: string
  entries: SettingsEntry[]
}

export interface SettingsProps {
  groups: SettingsGroup[]
  onBack?: () => void
}

export function Settings({ groups, onBack }: SettingsProps): React.JSX.Element {
  return (
    <ScreenScaffold title="Settings" onBack={onBack}>
      {groups.map((group) => (
        <Card key={group.title} title={group.title}>
          {group.entries.map((entry) => (
            <XStack
              key={entry.id}
              alignItems="center"
              justifyContent="space-between"
              padding="$3"
              borderRadius="$4"
              backgroundColor="$surface3"
              onPress={entry.onPress}
              testID={`settings-${entry.id}`}
            >
              <Text fontSize={14} color="$neutral1">
                {entry.label}
              </Text>
              <XStack alignItems="center" gap="$2">
                {entry.value ? (
                  <Text fontSize={13} color="$neutral2">
                    {entry.value}
                  </Text>
                ) : null}
                <Text fontSize={14} color="$neutral2">
                  ›
                </Text>
              </XStack>
            </XStack>
          ))}
        </Card>
      ))}
    </ScreenScaffold>
  )
}

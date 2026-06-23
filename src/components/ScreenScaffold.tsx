/**
 * ScreenScaffold — shared screen chrome: a back button + title header and a
 * scrollable body. Every screen shell composes this so headers/padding are
 * defined in exactly one place. Pure layout; `onBack` is a callback.
 */
import { XStack, YStack, ScrollView, Text, Button } from "@hanzo/gui"
import type { ReactNode } from "react"

export interface ScreenScaffoldProps {
  title: string
  children: ReactNode
  onBack?: () => void
  /** Optional element pinned to the top-right of the header (e.g. settings). */
  headerRight?: ReactNode
  /** Optional sticky footer (e.g. the primary action bar). */
  footer?: ReactNode
}

export function ScreenScaffold({
  title,
  children,
  onBack,
  headerRight,
  footer,
}: ScreenScaffoldProps): React.JSX.Element {
  return (
    <YStack flex={1} backgroundColor="$surface1">
      <XStack
        alignItems="center"
        justifyContent="space-between"
        padding="$3"
        gap="$2"
      >
        <XStack alignItems="center" gap="$2" flex={1}>
          {onBack ? (
            <Button size="$2" chromeless onPress={onBack} testID="screen-back">
              ←
            </Button>
          ) : null}
          <Text fontSize={18} fontWeight="700" color="$neutral1">
            {title}
          </Text>
        </XStack>
        {headerRight ?? null}
      </XStack>

      <ScrollView flex={1}>
        <YStack padding="$3" gap="$3">
          {children}
        </YStack>
      </ScrollView>

      {footer ? (
        <YStack padding="$3" gap="$2">
          {footer}
        </YStack>
      ) : null}
    </YStack>
  )
}

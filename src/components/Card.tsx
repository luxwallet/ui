/**
 * Card — bordered surface used by every screen section. Wraps @hanzo/gui's
 * Card with the wallet's standard padding/radius and an optional title row.
 */
import { Card as GuiCard, YStack, Text, type CardProps as GuiCardProps } from "@hanzo/gui"
import type { ReactNode } from "react"

export interface CardProps extends GuiCardProps {
  /** Optional section heading rendered at the top of the card. */
  title?: ReactNode
}

export function Card({ title, children, ...rest }: CardProps): React.JSX.Element {
  return (
    <GuiCard
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor="$surface2"
      borderRadius="$6"
      padding="$4"
      gap="$3"
      {...rest}
    >
      {title ? (
        <Text fontSize={13} color="$neutral2" fontWeight="600">
          {title}
        </Text>
      ) : null}
      <YStack gap="$2">{children}</YStack>
    </GuiCard>
  )
}

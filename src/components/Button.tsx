/**
 * Button — thin wrapper over @hanzo/gui's Button with wallet defaults
 * (full-width primary action by default; `tone` maps to brand themes).
 * No behavior of its own beyond passing the press handler through.
 */
import { Button as GuiButton, type ButtonProps as GuiButtonProps } from "@hanzo/gui"

export type ButtonTone = "primary" | "secondary" | "danger"

export interface ButtonProps extends Omit<GuiButtonProps, "theme" | "variant"> {
  tone?: ButtonTone
  /** Stretch to fill the container width (default true — wallet CTAs). */
  full?: boolean
}

const toneTheme: Record<ButtonTone, string | undefined> = {
  primary: "accent",
  secondary: undefined,
  danger: "red",
}

export function Button({
  tone = "primary",
  full = true,
  ...rest
}: ButtonProps): React.JSX.Element {
  return (
    <GuiButton
      theme={toneTheme[tone]}
      variant={tone === "secondary" ? "outlined" : undefined}
      width={full ? "100%" : undefined}
      {...rest}
    />
  )
}

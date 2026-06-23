/**
 * Ambient fallback declaration for `@hanzo/gui`.
 *
 * WHY THIS EXISTS
 * ---------------
 * `@hanzo/gui` is a PEER dependency of `@luxwallet/ui`. In the standalone
 * scaffold sandbox it is intentionally NOT installed (it drags in the full
 * Tamagui + react-native native toolchain, which we never build here — see
 * LLM.md "Verification"). This file gives `tsc --noEmit` a faithful-enough
 * surface of the @hanzo/gui primitives we consume so the library typechecks
 * in isolation.
 *
 * When a consumer (web/extension/desktop/native app) installs the real
 * `@hanzo/gui`, its own `types/index.d.ts` is the resolved declaration for
 * the package; this ambient shim is overridden by the real package types
 * present in `node_modules`. Nothing here is shipped as runtime code — the
 * components are imported, never re-implemented.
 *
 * The surface mirrors the most-used exports observed in the @hanzo/gui
 * kitchen-sink: YStack, XStack, Button, Text, Paragraph, SizableText, Input,
 * Card, ScrollView, Separator, Label, ListItem, Image, Spinner, Theme,
 * Progress, and the GuiProvider.
 */
declare module "@hanzo/gui" {
  import type { ComponentType, ReactNode, Ref } from "react"

  /** Tamagui-style space/size/color token reference, e.g. "$4" or "$accent1". */
  export type Token = string

  /** Common style props shared by every @hanzo/gui primitive (subset). */
  export interface StackStyleProps {
    flex?: number
    width?: number | string | Token
    height?: number | string | Token
    minWidth?: number | string | Token
    maxWidth?: number | string | Token
    padding?: number | Token
    paddingHorizontal?: number | Token
    paddingVertical?: number | Token
    margin?: number | Token
    marginTop?: number | Token
    marginBottom?: number | Token
    gap?: number | Token
    borderRadius?: number | Token
    borderWidth?: number | Token
    borderColor?: Token
    backgroundColor?: Token
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline"
    justifyContent?:
      | "flex-start"
      | "center"
      | "flex-end"
      | "space-between"
      | "space-around"
      | "space-evenly"
    opacity?: number
    overflow?: "visible" | "hidden" | "scroll"
    position?: "relative" | "absolute" | "static"
    flexWrap?: "wrap" | "nowrap" | "wrap-reverse"
    flexDirection?: "row" | "column" | "row-reverse" | "column-reverse"
  }

  export interface BaseProps extends StackStyleProps {
    children?: ReactNode
    testID?: string
    onPress?: () => void
    /** Tamagui theme key applied to subtree. */
    theme?: string
    key?: string | number
  }

  export type StackProps = BaseProps
  export const YStack: ComponentType<StackProps>
  export const XStack: ComponentType<StackProps>
  export const ZStack: ComponentType<StackProps>
  export const View: ComponentType<StackProps>
  export const ScrollView: ComponentType<StackProps & { horizontal?: boolean }>
  export const Separator: ComponentType<StackProps & { vertical?: boolean }>
  export const Spacer: ComponentType<{ size?: number | Token; flex?: number }>

  export interface TextProps extends BaseProps {
    color?: Token
    fontSize?: number | Token
    fontWeight?: string | number
    textAlign?: "left" | "center" | "right"
    numberOfLines?: number
    ellipse?: boolean
  }
  export const Text: ComponentType<TextProps>
  export const Paragraph: ComponentType<TextProps>
  export const SizableText: ComponentType<TextProps & { size?: Token }>
  export const Label: ComponentType<TextProps & { htmlFor?: string }>
  export const H1: ComponentType<TextProps>
  export const H2: ComponentType<TextProps>
  export const H3: ComponentType<TextProps>
  export const H4: ComponentType<TextProps>

  export interface ButtonProps extends BaseProps {
    disabled?: boolean
    size?: Token
    variant?: "outlined" | undefined
    chromeless?: boolean
    icon?: ReactNode | ComponentType
    iconAfter?: ReactNode | ComponentType
    circular?: boolean
  }
  export const Button: ComponentType<ButtonProps>

  export interface InputProps extends StackStyleProps {
    value?: string
    defaultValue?: string
    placeholder?: string
    onChangeText?: (text: string) => void
    keyboardType?: "default" | "numeric" | "decimal-pad" | "email-address"
    secureTextEntry?: boolean
    autoFocus?: boolean
    disabled?: boolean
    editable?: boolean
    size?: Token
    multiline?: boolean
    ref?: Ref<unknown>
    testID?: string
    onSubmitEditing?: () => void
  }
  export const Input: ComponentType<InputProps>
  export const TextArea: ComponentType<InputProps>

  export interface CardProps extends BaseProps {
    bordered?: boolean
    elevate?: boolean
    size?: Token
  }
  export const Card: ComponentType<CardProps> & {
    Header: ComponentType<BaseProps>
    Footer: ComponentType<BaseProps>
    Background: ComponentType<BaseProps>
  }

  export interface ImageProps extends StackStyleProps {
    source: { uri: string } | number
    accessibilityLabel?: string
    testID?: string
  }
  export const Image: ComponentType<ImageProps>

  export const Spinner: ComponentType<{ size?: "small" | "large"; color?: Token }>

  export interface ProgressProps extends StackStyleProps {
    value?: number
    max?: number
  }
  export const Progress: ComponentType<ProgressProps> & {
    Indicator: ComponentType<StackStyleProps & { animation?: string }>
  }

  export interface ThemeProps {
    name?: string
    children?: ReactNode
  }
  export const Theme: ComponentType<ThemeProps>
  export type ThemeName = string

  export interface ListItemProps extends BaseProps {
    title?: ReactNode
    subTitle?: ReactNode
    icon?: ReactNode | ComponentType
    iconAfter?: ReactNode | ComponentType
    hoverTheme?: boolean
    pressTheme?: boolean
  }
  export const ListItem: ComponentType<ListItemProps>

  /** Root provider — wraps the app with the active theme + config. */
  export interface GuiProviderProps {
    children?: ReactNode
    /** Theme key, e.g. "dark" | "light". */
    defaultTheme?: string
    /** Disable injecting reset CSS (web). */
    disableInjectCSS?: boolean
    /** Optional pre-built config from createGui(). */
    config?: unknown
  }
  export const GuiProvider: ComponentType<GuiProviderProps>

  /** Build/extend a Tamagui-style config (themes, tokens, fonts). */
  export function createGui(config: unknown): unknown
  export const styled: <P>(Component: ComponentType<P>, config: object) => ComponentType<P>
}

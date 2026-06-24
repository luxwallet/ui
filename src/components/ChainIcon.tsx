/**
 * ChainIcon — the cross-target chain logo mark.
 *
 * Renders the 7 login-chain logos (EVM / Solana / Bitcoin / TON / XRP /
 * Polkadot / Cardano) as inline SVG via `react-native-svg`, so the SAME
 * component paints on web (react-native-web), the extension, desktop, and
 * native React Native. Geometry is the shared, dependency-free
 * `CHAIN_ICON_PATHS` (ONE source of truth, also mirrorable by web-only hosts).
 *
 * Monochrome by default: `color` defaults to `currentColor`, so the mark
 * inherits the Lux/Hanzo monochrome theme (white on dark, black on light)
 * while each chain keeps its own silhouette. Pass an explicit `color` to tint.
 *
 * react-native-svg is a PEER dependency (like react-native itself): the host
 * app already ships it for @hanzo/gui, so the icon adds no new platform dep.
 */
import { Svg, Path } from "react-native-svg"
import type { ChainKind } from "../chains"
import { CHAIN_ICON_PATHS } from "../chain-icon-paths"

export interface ChainIconProps {
  /** Which chain mark to render. */
  kind: ChainKind
  /** Square size in px (width = height). Default 20. */
  size?: number
  /**
   * Fill/stroke color. Default "currentColor" so the mark inherits the
   * surrounding text color (monochrome theme). Pass a hex to tint.
   */
  color?: string
  /** Accessibility label; defaults to the kind. */
  title?: string
}

export function ChainIcon({
  kind,
  size = 20,
  color = "currentColor",
  title,
}: ChainIconProps): React.JSX.Element {
  const geom = CHAIN_ICON_PATHS[kind]
  return (
    <Svg
      width={size}
      height={size}
      viewBox={geom.viewBox}
      accessibilityLabel={title ?? kind}
      testID={`chain-icon-${kind}`}
    >
      {geom.paths.map((p, i) =>
        p.fill === "none" ? (
          <Path
            key={i}
            d={p.d}
            fill="none"
            stroke={color}
            strokeWidth={p.strokeWidth ?? 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <Path key={i} d={p.d} fill={color} fillRule={p.fillRule ?? "nonzero"} />
        ),
      )}
    </Svg>
  )
}

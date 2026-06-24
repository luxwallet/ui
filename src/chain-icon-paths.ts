/**
 * Chain logo geometry — the ONE source of truth for the 7 login-chain marks.
 *
 * Pure data: each entry is a 0..24 viewBox plus one or more SVG path `d`
 * strings. No React, no platform deps — so it is consumed unchanged by the
 * cross-target `ChainIcon` (react-native-svg, renders web + native) AND can be
 * mirrored verbatim by any web-only `<svg>` renderer (e.g. Hanzo IAM web).
 *
 * Marks are our own simplified, recognizable renderings of each ecosystem's
 * identity (NOT trademarked asset files) — monochrome `currentColor` so they
 * inherit the Lux/Hanzo monochrome theme, while each silhouette keeps the
 * chain unmistakable. MIT, ship-anywhere.
 *
 * Geometry conventions:
 *   - viewBox is always "0 0 24 24".
 *   - `paths[].d`     the path data.
 *   - `paths[].fill`  "solid" → filled with currentColor (default);
 *                     "none"  → stroked outline (uses stroke=currentColor).
 *   - `paths[].fillRule` optional even-odd for cut-outs.
 */

import type { ChainKind } from "./chains"

export interface ChainIconPath {
  d: string
  /** "solid" fills with currentColor; "none" strokes the outline. */
  fill?: "solid" | "none"
  fillRule?: "evenodd" | "nonzero"
  /** Stroke width for outline ("none") paths. */
  strokeWidth?: number
}

export interface ChainIconGeometry {
  /** Always "0 0 24 24". */
  viewBox: string
  paths: ChainIconPath[]
}

/**
 * The 7 chain marks, keyed by ChainKind. Display order matches LOGIN_CHAINS.
 *
 *  - evm      Ethereum diamond (two stacked tetrahedra)
 *  - solana   three slanted parallel bars
 *  - bitcoin  the ₿ glyph in a roundel
 *  - ton      faceted gem / crystal
 *  - xrp      the X-ledger interlock (four arcs to a center)
 *  - polkadot six dots around a center (the dot ring)
 *  - cardano  ADA atom — central node ringed by orbiting satellites
 */
export const CHAIN_ICON_PATHS: Record<ChainKind, ChainIconGeometry> = {
  // Ethereum / EVM — the canonical diamond: upper + lower faceted halves.
  evm: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 2 L12 9.7 L18.5 12.6 Z", fill: "solid" },
      { d: "M12 2 L5.5 12.6 L12 9.7 Z", fill: "solid" },
      { d: "M12 16.1 L12 22 L18.5 13.8 Z", fill: "solid" },
      { d: "M12 22 L12 16.1 L5.5 13.8 Z", fill: "solid" },
      { d: "M12 14.9 L18.5 12.6 L12 9.7 Z", fill: "solid", fillRule: "evenodd" },
      { d: "M5.5 12.6 L12 14.9 L12 9.7 Z", fill: "solid", fillRule: "evenodd" },
    ],
  },

  // Solana — three left-slanted bars (top/mid/bottom), the signature wordmark.
  solana: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M6.5 5.2 H19 a0.6 0.6 0 0 1 0.42 1.02 l-1.9 1.9 a1.2 1.2 0 0 1-0.85 0.35 H4.6 a0.6 0.6 0 0 1-0.42-1.02 l1.9-1.9 a1.2 1.2 0 0 1 0.85-0.35 Z", fill: "solid" },
      { d: "M6.5 10.5 H19 a0.6 0.6 0 0 1 0.42 1.02 l-1.9 1.9 a1.2 1.2 0 0 1-0.85 0.35 H4.6 a0.6 0.6 0 0 1-0.42-1.02 l1.9-1.9 a1.2 1.2 0 0 1 0.85-0.35 Z", fill: "solid" },
      { d: "M6.5 15.8 H19 a0.6 0.6 0 0 1 0.42 1.02 l-1.9 1.9 a1.2 1.2 0 0 1-0.85 0.35 H4.6 a0.6 0.6 0 0 1-0.42-1.02 l1.9-1.9 a1.2 1.2 0 0 1 0.85-0.35 Z", fill: "solid" },
    ],
  },

  // Bitcoin — roundel with the double-barred B (₿).
  bitcoin: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 2 a10 10 0 1 0 0 20 a10 10 0 0 0 0-20 Z M12 4 a8 8 0 1 1 0 16 a8 8 0 0 1 0-16 Z", fill: "solid", fillRule: "evenodd" },
      { d: "M10.2 6.6 v1.4 M13.0 6.6 v1.4 M10.2 16 v1.4 M13.0 16 v1.4", fill: "none", strokeWidth: 1.3 },
      { d: "M8.6 8 H13.4 a2.1 2.1 0 0 1 0 4.2 H8.6 Z M8.6 12 H13.8 a2.1 2.1 0 0 1 0 4.2 H8.6 Z M8.6 8 V16.2 M8.6 8 H7.4 M8.6 16.2 H7.4", fill: "none", strokeWidth: 1.3 },
    ],
  },

  // TON — faceted gem: top edge, two side facets, converging point.
  ton: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 2 a10 10 0 1 0 0 20 a10 10 0 0 0 0-20 Z M12 4 a8 8 0 1 1 0 16 a8 8 0 0 1 0-16 Z", fill: "solid", fillRule: "evenodd" },
      { d: "M7.5 8.2 H16.5 L12 17.2 Z M12 8.2 V17.2", fill: "none", strokeWidth: 1.4 },
    ],
  },

  // XRP — the interlocked X: four strokes meeting at center (Ripple mark).
  xrp: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M4 5 h3.2 a2.2 2.2 0 0 1 1.7 0.82 L12 9.7 l3.1-3.88 A2.2 2.2 0 0 1 16.8 5 H20", fill: "none", strokeWidth: 1.9 },
      { d: "M4 19 h3.2 a2.2 2.2 0 0 0 1.7-0.82 L12 14.3 l3.1 3.88 A2.2 2.2 0 0 0 16.8 19 H20", fill: "none", strokeWidth: 1.9 },
    ],
  },

  // Polkadot — the dot ring: six satellites around a hub.
  polkadot: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 3.2 a2 2.6 0 1 0 0.001 0 Z", fill: "solid" },
      { d: "M12 18.2 a2 2.6 0 1 0 0.001 0 Z", fill: "solid" },
      { d: "M5.5 6.9 a2 2.6 0 1 0 0.001 0 Z", fill: "solid" },
      { d: "M18.5 6.9 a2 2.6 0 1 0 0.001 0 Z", fill: "solid" },
      { d: "M5.5 14.5 a2 2.6 0 1 0 0.001 0 Z", fill: "solid" },
      { d: "M18.5 14.5 a2 2.6 0 1 0 0.001 0 Z", fill: "solid" },
    ],
  },

  // Cardano — ADA atom: central node + ring of orbiting satellites.
  cardano: {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 9.4 a2.6 2.6 0 1 0 0.001 0 Z", fill: "solid" },
      { d: "M12 2.6 a1.5 1.5 0 1 0 0.001 0 Z", fill: "solid" },
      { d: "M12 19.9 a1.5 1.5 0 1 0 0.001 0 Z", fill: "solid" },
      { d: "M4.1 7.1 a1.5 1.5 0 1 0 0.001 0 Z", fill: "solid" },
      { d: "M19.9 7.1 a1.5 1.5 0 1 0 0.001 0 Z", fill: "solid" },
      { d: "M4.1 16.4 a1.5 1.5 0 1 0 0.001 0 Z", fill: "solid" },
      { d: "M19.9 16.4 a1.5 1.5 0 1 0 0.001 0 Z", fill: "solid" },
    ],
  },
}

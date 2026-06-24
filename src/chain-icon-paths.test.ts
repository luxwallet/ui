import { describe, expect, it } from "vitest"
import { CHAIN_ICON_PATHS } from "./chain-icon-paths"
import { LOGIN_CHAINS, type ChainKind } from "./chains"

// The 7 login chains @luxwallet/connect verifies. ChainIcon must have a mark
// for every one (and only these), so the picker never shows a chain with no
// logo nor a logo with no chain.
const EXPECTED: ChainKind[] = ["evm", "solana", "bitcoin", "ton", "xrp", "polkadot", "cardano"]

describe("@luxwallet/ui chain logo geometry", () => {
  it("LOGIN_CHAINS covers exactly the 7 verified ecosystems", () => {
    expect(LOGIN_CHAINS.map((c) => c.kind).sort()).toEqual([...EXPECTED].sort())
  })

  it("has a logo mark for every login chain", () => {
    for (const kind of EXPECTED) {
      expect(CHAIN_ICON_PATHS[kind], `missing icon for ${kind}`).toBeDefined()
    }
    // No extra marks beyond the known chains.
    expect(Object.keys(CHAIN_ICON_PATHS).sort()).toEqual([...EXPECTED].sort())
  })

  it("every mark is a 0..24 viewBox with at least one non-empty path", () => {
    for (const kind of EXPECTED) {
      const geom = CHAIN_ICON_PATHS[kind]
      expect(geom.viewBox, `${kind} viewBox`).toBe("0 0 24 24")
      expect(geom.paths.length, `${kind} has paths`).toBeGreaterThan(0)
      for (const p of geom.paths) {
        const d = p.d.trim()
        expect(d.length, `${kind} path 'd' non-empty`).toBeGreaterThan(0)
        // d must start with a moveto.
        expect(d.charAt(0).toUpperCase(), `${kind} path starts with M`).toBe("M")
      }
    }
  })

  it("every login chain still carries a single-glyph fallback", () => {
    for (const c of LOGIN_CHAINS) {
      expect(c.glyph.length, `${c.kind} glyph`).toBeGreaterThan(0)
    }
  })
})

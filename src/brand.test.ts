import { describe, expect, it } from "vitest"
import { brandIamLabel, brandIamSubtext, type WalletBrand } from "./brand"

const lux: WalletBrand = { name: "Lux Wallet", shortName: "Lux" }
const acme: WalletBrand = { name: "Acme Wallet", shortName: "Acme" }

describe("@luxwallet/ui brand copy helpers", () => {
  it("derives the IAM label from the brand short name", () => {
    expect(brandIamLabel(lux)).toBe("Continue with Lux")
    expect(brandIamLabel(acme)).toBe("Continue with Acme")
  })

  it("is brand-neutral (no org name) when no brand is set", () => {
    expect(brandIamLabel(undefined)).toBe("Continue")
    expect(brandIamSubtext(undefined)).toBe("Google, GitHub, email, or password.")
  })

  it("names the brand in the IAM subtext when set", () => {
    expect(brandIamSubtext(lux)).toBe(
      "Google, GitHub, email, or password — secured by Lux IAM.",
    )
  })
})

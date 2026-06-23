# @luxwallet/ui

Shared, **cross-target** UI component library for the Lux Wallet. One component
tree renders everywhere:

- **Web** (wallet.lux.network) via `react-native-web`
- **Browser extension**
- **Desktop** (Lux Desktop app)
- **Native mobile** (React Native — iOS / Android), wired later

Built on [`@hanzo/gui`](https://github.com/hanzoai/gui) (a Tamagui-architecture
universal UI kit). `@luxwallet/ui` is a thin, brand-aware layer on top:
primitives, screen shells, theme tokens, and one provider.

> **MIT licensed.** No GPL dependencies. Pure presentation — **no signing, no
> RPC, no business logic.** Data and callbacks come in via props so the UI
> stays fully decoupled from `@luxwallet/sdk` (built in parallel).

## Install

```sh
pnpm add @luxwallet/ui @hanzo/gui react
# native targets additionally:
pnpm add react-native
```

`@hanzo/gui`, `react`, and `react-native` are **peer dependencies** — the app
owns those versions; this library does not bundle them.

## Usage

```tsx
import { WalletUIProvider, Portfolio } from "@luxwallet/ui"

export function App() {
  return (
    <WalletUIProvider scheme="dark">
      <Portfolio
        accountName="zach.lux"
        address="0xA1B2C3D4E5F60000000000000000000000003F4E"
        totalUsd="$42,718.93"
        changeLabel="▲ 2.4% 24h"
        sections={[
          {
            title: "Assets",
            assets: [
              { symbol: "$LUX", balance: "1,250.00", usdValue: "$8,120.00" },
              { symbol: "$ZOO", balance: "100,000.00", subLabel: "Zoo L1 native" },
            ],
          },
        ]}
        onSend={() => navigate("/send")}
        onReceive={() => navigate("/receive")}
      />
    </WalletUIProvider>
  )
}
```

Mount **one** provider (`WalletUIProvider` wraps `@hanzo/gui`'s `GuiProvider`),
then render any screen shell and feed it data + callbacks from your app's state
(which is sourced from `@luxwallet/sdk`).

## What's inside

```
src/
  WalletUIProvider.tsx     one provider; wraps @hanzo/gui GuiProvider
  chains.ts                ChainKind + the 5 login ecosystems + shortenAddress
  theme/                   Lux brand tokens (extend @hanzo/gui) + runtime white-label
  components/              thin primitives over @hanzo/gui
    Button, Card, AddressField, AmountInput, TokenRow,
    ChainBadge, QrView, ScreenScaffold
  screens/                 prop-driven screen shells (no @luxwallet/sdk import)
    Portfolio, Send, Receive, Swap, Stake, Bridge,
    Signing, Settings, ConnectWallet
```

Screen shells map 1:1 to the wallet UX spec
([`lux/wallet/SCREENS.md`](https://github.com/luxfi/wallet)).

## Cross-target: how it works

The `exports` map in `package.json` declares `react-native` and
`browser`/`import` conditions — **identical in shape to `@hanzo/gui`**:

```jsonc
".": {
  "types":        "./dist/types/index.d.ts",
  "react-native": "./dist/esm/index.native.js",  // native RN bundlers
  "browser":      "./dist/esm/index.mjs",         // web / extension / desktop
  "import":       "./dist/esm/index.mjs",
  "default":      "./dist/esm/index.mjs"
}
```

A native bundler (Metro/Expo) picks the `react-native` build of both
`@luxwallet/ui` *and* `@hanzo/gui`; a web bundler picks `browser`. Same source,
two outputs — no per-platform component forks.

## White-label theming

Brand colors are **runtime tokens**, never forks. Override per deployment
(Lux / Zoo / Pars / white-labels):

```tsx
import { WalletUIProvider } from "@luxwallet/ui"

<WalletUIProvider scheme="dark" tokens={{ accent1: "#7C3AED", surface1: "#0B0B0F" }}>
  {/* ... */}
</WalletUIProvider>
```

On web these become CSS variables (`--lw-accent1`, …); on native they flow
through the theme exports. See `src/theme/`.

## Develop

```sh
pnpm install --no-frozen-lockfile
pnpm typecheck     # tsc --noEmit (strict)
pnpm build         # emit .d.ts
```

## License

MIT © Lux Industries Inc.

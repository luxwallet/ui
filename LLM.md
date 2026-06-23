# LLM.md — @luxwallet/ui

Guidance for AI agents working in this repo. Read before editing.

## What this is

`@luxwallet/ui` is the **single, cross-target UI component library** for the
Lux Wallet. One component tree → web, browser extension, desktop, and native
React Native. It is a thin, brand-aware layer over **`@hanzo/gui`** (peer dep,
Tamagui architecture). MIT. No GPL deps.

Consumers (now and planned):

| Target            | Status   | How it resolves `@luxwallet/ui`        |
|-------------------|----------|----------------------------------------|
| Web (wallet SPA)  | now      | `browser`/`import` condition (RN-web)  |
| Browser extension | now      | `browser`/`import` condition           |
| Desktop app       | now      | `browser`/`import` condition           |
| Native mobile (RN)| later    | `react-native` condition (Metro/Expo)  |

## Hard rules (do not violate)

1. **Pure presentation.** No business logic, no signing, no RPC, no network.
   Components take **data + callbacks via props**. This is what decouples the
   UI from `@luxwallet/sdk` (built in parallel) — there is **no import of
   `@luxwallet/sdk` anywhere in `src/`**. Keep it that way.
2. **`@hanzo/gui` is a PEER, never bundled.** Same for `react` /
   `react-native`. The app owns those versions.
3. **No GPL.** `@luxfi/wallet-brand` is GPL-3 — do **not** depend on it. We
   mirror only its *token shape* (accent/surface/neutral/status) in our own
   MIT `src/theme/tokens.ts`.
4. **White-label = runtime tokens, never forks.** Override colors via
   `WalletUIProvider tokens={…}` (CSS vars on web, theme on native). Never
   fork a component for a brand.
5. **TS strict.** `pnpm typecheck` (tsc --noEmit) must stay green.
6. **One way.** Screens compose primitives; primitives wrap `@hanzo/gui`.
   Don't reach past a primitive to raw gui inside a screen unless the
   primitive genuinely doesn't cover it.

## Architecture

```
src/
  index.ts                 barrel (provider, theme, chains, components, screens)
  WalletUIProvider.tsx     ONE provider — wraps @hanzo/gui GuiProvider + applies brand tokens
  chains.ts                ChainKind ('evm'|'solana'|'bitcoin'|'ton'|'xrp'), LOGIN_CHAINS, shortenAddress
  theme/
    tokens.ts              WalletThemeTokens contract + luxDark/luxLight (Lux monochrome)
    applyBrandTheme.ts     runtime white-label → CSS vars on web, no-op on native
    index.ts               theme barrel (also exported via "@luxwallet/ui/theme" subpath)
  components/              thin primitives over @hanzo/gui:
    Button  Card  AddressField  AmountInput  TokenRow  ChainBadge  QrView  ScreenScaffold
  screens/                prop-driven shells (1:1 with SCREENS.md):
    Portfolio  Send  Receive  Swap  Stake  Bridge  Signing  Settings  ConnectWallet
types/
  hanzo-gui.d.ts           ambient FALLBACK for @hanzo/gui (see "Verification")
```

### Screen ↔ spec map (`lux/wallet/SCREENS.md`)

| Screen          | Spec § | Notes |
|-----------------|--------|-------|
| `Portfolio`     | §1     | account header, total, grouped TokenRows, action bar, confidential indicator |
| `Send`          | §2     | address + amount + fee + privacy toggle + triple-consensus finality preview |
| `Receive`       | §2     | QrView (app supplies the QR node) + copy/share + chain selector |
| `Swap`          | §3     | route selector, from/to AmountInputs, slippage/impact, fee |
| `Stake`         | §4     | network selector, stake summary, validator list w/ Delegate |
| `Bridge`        | §5     | from/to chains, asset, recipient, lock→sign→mint route preview, ETA |
| `Signing`       | §7+    | decoded TxSummary rows + RiskIndicator + approve/reject |
| `Settings`      | §10    | grouped settings entries |
| `ConnectWallet` | login  | SIWx multi-chain picker — the 5 chains from @luxwallet/connect |

AI Inference (§6), Privacy Mode detail (§7), and the desktop Validator Operator
pane (§9) are not yet scaffolded — add as new shells under `src/screens/` when
those surfaces are prioritized, following the same prop-driven pattern.

## Cross-target mechanism (the important part)

The `exports` map mirrors `@hanzo/gui` exactly: `types` → `react-native` →
`browser` → `module`/`import` → `require` → `default`. A native bundler
(Metro/Expo) resolves the `react-native` build of **both** this lib and gui; a
web bundler resolves `browser`. Same source compiles to `dist/esm/index.mjs`
(web) and `dist/esm/index.native.js` (native). Build is `tsc` for types here;
the JS dual-build is produced by the consuming app's bundler / the gui build
toolchain when this package is wired into the gui monorepo build (see below).

## Verification

```sh
pnpm install --no-frozen-lockfile
pnpm build       # tsc -p tsconfig.build.json — emits dist/types, src vs REAL gui
pnpm typecheck   # tsc --noEmit — src + the ambient shim; MUST also be green
```

Run **both**. They check different things and a primitive can pass one and fail
the other (this bit us once — see below):
- `pnpm build` (`tsconfig.build.json`) **excludes `types/`**, so it typechecks
  `src/` against the **real `@hanzo/gui@7.3.0`** prop types (resolved into
  `node_modules` — Tamagui fork, `@hanzogui/*` packages). This is the
  authoritative gate and it emits `dist/types/`.
- `pnpm typecheck` (`tsconfig.json`) **includes `types/hanzo-gui.d.ts`**, the
  ambient `declare module "@hanzo/gui"` fallback for offline environments where
  the real package (full Tamagui+RN toolchain) isn't installed.

The two are kept consistent: the shim is a SUPERSET fallback, but the props
`src/` actually uses must exist in BOTH the real gui types and the shim, with the
same names. The real Tamagui API is the source of truth — when they disagree, fix
`src/` to the real API and align the shim, never the reverse.

Real-vs-shim drift fixed (the props the scaffold used did NOT exist on real
Tamagui; the permissive shim hid it from `typecheck`, and `build` was never run):
- `Input`: `editable` / `keyboardType` are RN-only and omitted by this web-first
  fork → use `disabled` and `inputMode="decimal"`.
- `Card`: no `bordered` variant → use `borderWidth={1}` (+ existing `borderColor`).
- `ListItem`: no `pressTheme` / `hoverTheme` booleans → use the real `pressStyle`
  / `hoverStyle` pseudo-style props (applied only when `onPress` is set).
- `WalletUIProvider.guiConfig`: typed `GuiInternalConfig` (the real type of
  `GuiProviderProps.config`), not `unknown`.
The shim (`types/hanzo-gui.d.ts`) gained `inputMode`, `pressStyle`/`hoverStyle`,
and a `GuiInternalConfig` export to match.

### What still needs `@hanzo/gui` fully linked to verify
- A real **native (RN/Metro) build** and a real **web (rn-web) build** — we do
  **not** run those here (per task: scaffold only, no native build). The
  exports shape is correct and matches gui; the dual JS artifacts get produced
  when this package is built inside the gui/turbo toolchain or bundled by a
  consuming app.
- Runtime theme application on a real device (CSS vars are web-only; native
  reads tokens through the theme exports).

## Toolchain

- Node 20+ (`.nvmrc`), pnpm.
- `tsconfig.json` — strict, `moduleResolution: Bundler`, `jsx: react-jsx`,
  `noEmit` (typecheck). `tsconfig.build.json` emits `.d.ts` to `dist/types`.

## Conventions

- One file per primitive / screen; export via the local `index.ts` barrel,
  re-exported from `src/index.ts`.
- Props interfaces are exported alongside each component (apps need them).
- Pre-format display strings in the **app/SDK** (USD quotes, balances, fees)
  and pass them in — the UI does not do math or i18n number formatting.
- Callbacks are optional where the element can be read-only; required where the
  screen's core action depends on them (e.g. `Send.onSubmit`).

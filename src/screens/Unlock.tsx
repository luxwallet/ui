/**
 * Unlock screen shell (SCREENS.md — Unlock).
 *
 * Password gate shown on launch and after an idle-lock: the user re-enters the
 * local unlock password to decrypt the keyring before any wallet action is
 * possible. A hard gate — there is no back button; the only ways out are a
 * successful unlock or the "Forgot password?" recovery path.
 *
 * PURE PRESENTATION. The typed password is held by the app (`password` /
 * `onChangePassword`), the verify result is handed back as `error`, and the
 * in-flight state arrives as `unlocking`. This component never decrypts the
 * keyring, hashes, or verifies anything — it only renders and fires callbacks.
 */
import { XStack, YStack, Text, Input } from "@hanzo/gui"
import { Card } from "../components/Card"
import { Button } from "../components/Button"
import { ScreenScaffold } from "../components/ScreenScaffold"

export interface UnlockProps {
  /** Current value of the password field (controlled by the app). */
  password: string
  onChangePassword: (next: string) => void
  /** Verification message from the SDK (e.g. "Incorrect password"); rendered in the critical color. */
  error?: string
  /** True while the keyring is being decrypted — disables the field and shows progress copy. */
  unlocking?: boolean
  /** Fired when the user submits the password (button press or Enter). */
  onUnlock: () => void
  /** Optional recovery path — when omitted, the link is hidden. */
  onForgotPassword?: () => void
  /** Header/brand title; defaults to "Lux Wallet" to match the Portfolio shell. */
  brandLabel?: string
}

export function Unlock({
  password,
  onChangePassword,
  error,
  unlocking,
  onUnlock,
  onForgotPassword,
  brandLabel = "Lux Wallet",
}: UnlockProps): React.JSX.Element {
  const canSubmit = password.length > 0 && !unlocking

  return (
    <ScreenScaffold
      title={brandLabel}
      footer={
        <YStack gap="$2">
          <Button disabled={!canSubmit} onPress={onUnlock} testID="unlock-submit">
            {unlocking ? "Unlocking…" : "Unlock"}
          </Button>
          {onForgotPassword ? (
            <Button
              tone="secondary"
              chromeless
              onPress={onForgotPassword}
              disabled={unlocking}
              testID="unlock-forgot"
            >
              Forgot password?
            </Button>
          ) : null}
        </YStack>
      }
    >
      <Card title="Unlock wallet">
        <Text fontSize={13} color="$neutral2">
          Enter your password to decrypt this wallet on this device. Your keys
          stay encrypted until you unlock.
        </Text>
        <YStack gap="$1">
          <Text fontSize={12} color="$neutral2">
            Password
          </Text>
          <Input
            value={password}
            onChangeText={onChangePassword}
            placeholder="Enter your password"
            secureTextEntry
            disabled={unlocking}
            onSubmitEditing={canSubmit ? onUnlock : undefined}
            testID="unlock-password"
          />
          {error ? (
            <Text fontSize={12} color="$statusCritical">
              {error}
            </Text>
          ) : null}
        </YStack>
      </Card>
    </ScreenScaffold>
  )
}

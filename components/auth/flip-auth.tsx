"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useRef } from "react"

import { AUTH_TEXTS } from "@/components/auth/texts"
import { authClient } from "@/lib/auth-client"
import { localePath, type Locale } from "@/lib/i18n"
import { safeNext } from "@/lib/safe-path"
import { Auth011 } from "@/registry/blocks/auth/auth-011/auth-011"

/**
 * Вход и регистрация сайта на блоке auth-011: одна карточка-перевёртыш вместо
 * двух страниц. Адрес при перевороте меняется на /signin или /signup без
 * перехода, чтобы ссылка и кнопка «назад» вели на ту же сторону.
 */
export function FlipAuth({
  locale,
  side,
}: {
  locale: Locale
  side: "login" | "signup"
}) {
  const t = AUTH_TEXTS[locale]
  const router = useRouter()
  // Адрес письма нужен странице подтверждения, а переход идёт уже после анимации.
  const signupEmail = useRef("")
  const params = useSearchParams()

  // Адрес уже абсолютный (`/en/...`), языковой префикс к нему не добавляется.
  const next = safeNext(params.get("next"), localePath(locale, "/account"))
  const afterReset = params.get("reset") === "done"

  return (
    <Auth011
      initialSide={side}
      onSideChange={(value) => {
        const path = localePath(
          locale,
          value === "login" ? "/signin" : "/signup",
        )
        const query = params.toString()
        window.history.replaceState(null, "", query ? `${path}?${query}` : path)
      }}
      style={{ colorScheme: "dark" }}
      loginTitle={t.signInTitle}
      loginLead={t.signInHint}
      loginSubmit={t.enter}
      signupTitle={t.signUpTitle}
      signupLead={t.signUpLead}
      signupSubmit={t.create}
      nameLabel={t.name}
      emailLabel={t.email}
      passwordLabel={t.password}
      confirmLabel={t.confirmPassword}
      rememberLabel={t.remember}
      forgot={t.forgot}
      forgotHref={localePath(locale, "/reset")}
      toSignup={t.noAccount}
      toLogin={t.haveAccount}
      showPasswordLabel={t.showPassword}
      mismatchLabel={t.passwordMismatch}
      emailMissingLabel={t.emailMissing}
      emailInvalidLabel={t.emailInvalid}
      passwordMissingLabel={t.passwordMissing}
      passwordShortLabel={t.passwordShort}
      pendingLabel={t.wait}
      successLabel="✓"
      nameRequired={false}
      passwordMinLength={10}
      loginNotice={afterReset ? t.resetDone : undefined}
      onLogin={async ({ email, password, remember }) => {
        try {
          const { error } = await authClient.signIn.email({
            email,
            password,
            rememberMe: remember,
          })

          if (error) {
            // Неподтверждённая почта — единственная причина, которую можно
            // назвать: человек уже доказал знание пароля. Остальные отказы
            // объединены, иначе форма отвечает, кто здесь зарегистрирован.
            if (error.status === 403) {
              return (
                <>
                  {t.notVerified}{" "}
                  <Link
                    href={`${localePath(locale, "/verify")}?email=${encodeURIComponent(email)}`}
                  >
                    {t.resend}
                  </Link>
                </>
              )
            }

            return error.status === 429 ? t.tooMany : t.signInFailed
          }
        } catch {
          return t.offline
        }

        // Кабинет грузится, пока играет анимация успеха.
        router.prefetch(next)
      }}
      onSignup={async ({ name, email, password }) => {
        try {
          const { error } = await authClient.signUp.email({
            name,
            email,
            password,
            // Письма уходят позже, из фоновых задач: язык страницы известен
            // только здесь, и дальше его помнит сам аккаунт.
            locale,
            callbackURL: `${localePath(locale, "/verify")}?state=done&next=${encodeURIComponent(next)}`,
          })

          if (error) {
            return error.status === 422
              ? t.emailTaken
              : error.status === 429
                ? t.tooMany
                : t.signUpFailed
          }
        } catch {
          return t.offline
        }

        signupEmail.current = email
      }}
      onSuccess={(side) => {
        if (side === "login") {
          router.push(next)
          router.refresh()
          return
        }

        router.push(
          `${localePath(locale, "/verify")}?email=${encodeURIComponent(signupEmail.current)}&next=${encodeURIComponent(next)}`,
        )
      }}
    />
  )
}

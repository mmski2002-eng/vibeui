import type { Locale } from "@/lib/i18n"

/**
 * Подписи форм входа. Держим рядом с самими формами, а не в общем словаре
 * каталога: этих строк два десятка, они не переиспользуются нигде больше, и
 * в общем словаре их пришлось бы искать среди сотни чужих.
 */
export const AUTH_TEXTS = {
  ru: {
    back: "← На витрину",
    signInTitle: "Вход",
    signInHint: "Аккаунт хранит избранное, лимит копирований и подписку.",
    signUpTitle: "Регистрация",
    signUpHint: "Бесплатно: 100 компонентов в месяц, избранное и история.",
    resetTitle: "Восстановление пароля",
    resetHint: "Пришлём ссылку на почту, по которой можно задать новый пароль.",
    newPasswordTitle: "Новый пароль",
    name: "Имя",
    email: "Почта",
    password: "Пароль",
    newPassword: "Новый пароль",
    passwordHint: "Не короче 10 символов",
    enter: "Войти",
    entering: "Входим…",
    create: "Создать аккаунт",
    creating: "Создаём…",
    send: "Прислать ссылку",
    sending: "Отправляем…",
    save: "Задать пароль",
    saving: "Сохраняем…",
    forgot: "Забыли пароль?",
    noAccount: "Нет аккаунта?",
    createShort: "Создать",
    haveAccount: "Уже есть аккаунт?",
    enterShort: "Войти",
    consent: "Соглашаюсь с",
    offer: "офертой",
    consentAnd: "и",
    privacy: "обработкой персональных данных",
    verifySent:
      "Письмо со ссылкой отправлено. Откройте её, чтобы подтвердить адрес и войти. Ссылка действует 30 минут.",
    resetSent:
      "Если такой адрес зарегистрирован, письмо со ссылкой уже отправлено. Ссылка действует 30 минут.",
    linkBroken:
      "Ссылка неполная или устарела. Запросите новое письмо на странице восстановления.",
    linkExpired: "Ссылка устарела. Запросите новое письмо.",
    signInFailed: "Не удалось войти. Проверьте адрес и пароль.",
    notVerified: "Почта не подтверждена. Проверьте письмо со ссылкой.",
    emailTaken: "Такая почта уже зарегистрирована.",
    signUpFailed: "Не удалось зарегистрироваться. Попробуйте ещё раз.",
  },
  en: {
    back: "← Back to catalog",
    signInTitle: "Sign in",
    signInHint: "An account keeps your favourites, monthly limit and plan.",
    signUpTitle: "Create account",
    signUpHint: "Free: 100 components a month, favourites and history.",
    resetTitle: "Reset password",
    resetHint: "We will email a link for setting a new password.",
    newPasswordTitle: "New password",
    name: "Name",
    email: "Email",
    password: "Password",
    newPassword: "New password",
    passwordHint: "At least 10 characters",
    enter: "Sign in",
    entering: "Signing in…",
    create: "Create account",
    creating: "Creating…",
    send: "Send link",
    sending: "Sending…",
    save: "Set password",
    saving: "Saving…",
    forgot: "Forgot password?",
    noAccount: "No account yet?",
    createShort: "Create one",
    haveAccount: "Already have an account?",
    enterShort: "Sign in",
    consent: "I agree to the",
    offer: "terms",
    consentAnd: "and",
    privacy: "processing of personal data",
    verifySent:
      "The link is on its way. Open it to confirm your address and sign in. It expires in 30 minutes.",
    resetSent:
      "If that address is registered, the link is already on its way. It expires in 30 minutes.",
    linkBroken:
      "The link is incomplete or expired. Request a new one on the reset page.",
    linkExpired: "The link has expired. Request a new one.",
    signInFailed: "Could not sign in. Check the address and password.",
    notVerified: "Email is not confirmed yet. Check the letter with the link.",
    emailTaken: "That email is already registered.",
    signUpFailed: "Could not create the account. Please try again.",
  },
} satisfies Record<Locale, Record<string, string>>

export type AuthText = (typeof AUTH_TEXTS)["ru"]

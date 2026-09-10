import type { Locale } from "@/lib/i18n"

/**
 * Подписи форм входа. Держим рядом с самими формами, а не в общем словаре
 * каталога: этих строк два десятка, они не переиспользуются нигде больше, и
 * в общем словаре их пришлось бы искать среди сотни чужих.
 */
export const AUTH_TEXTS = {
  ru: {
    back: "← На витрину",
    signInTitle: "Вернитесь к своей библиотеке",
    signInHint: "Аккаунт хранит избранное, лимит копирований и подписку.",
    signUpTitle: "Соберите свою библиотеку дизайна",
    signUpHint: "100 компонентов в месяц, избранное и история — бесплатно.",
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
    spamHint:
      "Письма нет через минуту — загляните в «Спам» и «Промоакции». Мы молодой отправитель, и почтовые службы иногда перестраховываются.",
    showcaseTitle: "Выбери дизайн. Отдай ИИ. Получи сайт.",
    showcaseNote:
      "Полторы тысячи готовых компонентов и секций. Аккаунт хранит избранное, историю и лимит копирований.",
    verifyExisting:
      "Если аккаунт с этим адресом уже есть, письма не будет — войдите или восстановите пароль.",
    verifyTitle: "Подтвердите почту",
    verifyLead: (email: string) =>
      `Письмо со ссылкой отправлено на ${email}. Ссылка действует 30 минут.`,
    verifyWrong: "Ошиблись в адресе? Зарегистрируйтесь заново — старая заявка ничего не занимает.",
    resend: "Отправить письмо ещё раз",
    resending: "Отправляем…",
    resent: "Письмо отправлено",
    resendLimit: "Слишком часто. Подождите пару минут и попробуйте снова.",
    verifyDone: "Почта подтверждена",
    verifyDoneLead: "Аккаунт готов. Можно возвращаться к работе.",
    verifyExpired: "Ссылка устарела",
    verifyExpiredLead:
      "Ссылка действует 30 минут и открывается один раз. Запросите новое письмо.",
    verifyUsed: "Ссылка уже использована",
    verifyUsedLead: "Адрес подтверждён раньше. Просто войдите.",
    continueTo: "Продолжить",
    toSignIn: "К входу",
    tooMany: "Слишком много попыток. Попробуйте через несколько минут.",
    offline: "Не получилось связаться с сервером. Проверьте соединение.",
    consentRequired: "Отметьте согласие с условиями, чтобы продолжить.",
    resetDone: "Пароль обновлён. Войдите с новым паролем.",
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
    signInTitle: "Back to your library",
    signInHint: "An account keeps your favourites, monthly limit and plan.",
    signUpTitle: "Build your design library",
    signUpHint: "100 components a month, favourites and history — free.",
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
    spamHint:
      "Nothing after a minute — check Spam and Promotions. We are a young sender, and mail services sometimes play it safe.",
    showcaseTitle: "Pick a design. Hand it to AI. Ship the page.",
    showcaseNote:
      "Fifteen hundred ready components and sections. An account keeps your favourites, history and monthly limit.",
    verifyExisting:
      "If an account with this address already exists, no letter will arrive — sign in or reset your password.",
    verifyTitle: "Confirm your email",
    verifyLead: (email: string) =>
      `A letter with the link went to ${email}. The link works for 30 minutes.`,
    verifyWrong:
      "Typo in the address? Sign up again — the old attempt holds nothing.",
    resend: "Send the letter again",
    resending: "Sending…",
    resent: "The letter is on its way",
    resendLimit: "Too often. Wait a couple of minutes and try again.",
    verifyDone: "Email confirmed",
    verifyDoneLead: "The account is ready. Back to work.",
    verifyExpired: "The link has expired",
    verifyExpiredLead:
      "A link works for 30 minutes and opens once. Request a new letter.",
    verifyUsed: "The link was already used",
    verifyUsedLead: "The address is confirmed. Just sign in.",
    continueTo: "Continue",
    toSignIn: "To sign in",
    tooMany: "Too many attempts. Try again in a few minutes.",
    offline: "Could not reach the server. Check the connection.",
    consentRequired: "Tick the consent box to continue.",
    resetDone: "Password updated. Sign in with the new one.",
    linkBroken:
      "The link is incomplete or expired. Request a new one on the reset page.",
    linkExpired: "The link has expired. Request a new one.",
    signInFailed: "Could not sign in. Check the address and password.",
    notVerified: "Email is not confirmed yet. Check the letter with the link.",
    emailTaken: "That email is already registered.",
    signUpFailed: "Could not create the account. Please try again.",
  },
} satisfies Record<Locale, unknown>

export type AuthText = (typeof AUTH_TEXTS)["ru"]

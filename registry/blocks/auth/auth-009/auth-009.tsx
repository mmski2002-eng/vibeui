"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth009Props = {
  title?: string
  lead?: string
  submit?: string
  terms?: string
  marketing?: string
  nameLabel?: string
  namePlaceholder?: string
  companyLabel?: string
  companyPlaceholder?: string
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  /** Подпись раскрывающегося блока с полным текстом условий. */
  detailsSummary?: string
  detailsText?: string
  /** Подсказка под выключенной кнопкой. */
  requiredHint?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: регистрация, где согласие — осознанное действие, а не мелкий
// текст под кнопкой. Обязательный чекбокс один, и пока он не отмечен, кнопка
// выключена: человек не может «случайно согласиться». Необязательная рассылка
// вынесена отдельной строкой и по умолчанию выключена — предвыбранная галочка
// рассылки незаконна в ЕС и просто нечестна. Полный текст условий раскрывается
// прямо здесь через <details>, чтобы не уводить со страницы регистрации:
// уход по ссылке на условия — это потерянная форма с уже введёнными данными.
//
// Демонстрация интерфейса: форма ничего не отправляет и не хранит.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не выкладывает под себя плашку — подложка приходит
// пропом background.
const STYLES = `
:where([data-vibeui-block="auth-009"]){
--vibeui-auth-009-bg:transparent;
--vibeui-auth-009-card:light-dark(oklch(1 0 0),oklch(0.22 0.013 265));
--vibeui-auth-009-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-auth-009-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.013 265));
--vibeui-auth-009-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.011 265));
--vibeui-auth-009-accent:light-dark(oklch(0.55 0.16 200),oklch(0.76 0.13 200));
--vibeui-auth-009-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-auth-009-well:light-dark(oklch(0.55 0.02 265 / 4%),oklch(0.85 0.02 265 / 7%));
--vibeui-auth-009-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-009"]{color-scheme:dark}
[data-vibeui-block="auth-009"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-009-bg);color:var(--vibeui-auth-009-fg);
font-family:var(--vibeui-auth-009-sans);
}
[data-vibeui-block="auth-009"] *{box-sizing:border-box}
[data-vibeui-block="auth-009"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-009-card);
border:1px solid var(--vibeui-auth-009-border);border-radius:1rem;
}
@container (min-width: 42rem){
[data-vibeui-block="auth-009"] [data-part="shell"]{max-width:26rem;padding:2rem}
[data-vibeui-block="auth-009"] [data-part="pair"]{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
}
[data-vibeui-block="auth-009"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-009"] [data-part="lead"]{margin:0 0 1.125rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-009-muted)}
[data-vibeui-block="auth-009"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.75rem}
[data-vibeui-block="auth-009"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-009"] input[type="text"],
[data-vibeui-block="auth-009"] input[type="email"],
[data-vibeui-block="auth-009"] input[type="password"]{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-009-border);border-radius:0.625rem;
background:var(--vibeui-auth-009-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-009"] input:focus-visible{outline:2px solid var(--vibeui-auth-009-accent);outline-offset:1px;border-color:var(--vibeui-auth-009-accent)}
[data-vibeui-block="auth-009"] [data-part="consents"]{
display:flex;flex-direction:column;gap:0.625rem;
margin:1rem 0;padding:0.875rem;
border:1px solid var(--vibeui-auth-009-border);border-radius:0.75rem;
background:var(--vibeui-auth-009-well);
}
[data-vibeui-block="auth-009"] [data-part="consent"]{display:flex;gap:0.5rem;font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="auth-009"] [data-part="consent"] input{flex:none;width:1.0625rem;height:1.0625rem;margin-top:0.0625rem;accent-color:var(--vibeui-auth-009-accent)}
[data-vibeui-block="auth-009"] [data-part="consent"] a{color:var(--vibeui-auth-009-accent);font-weight:600}
[data-vibeui-block="auth-009"] [data-part="req"]{color:var(--vibeui-auth-009-accent);font-weight:700}
[data-vibeui-block="auth-009"] details{border-top:1px dashed var(--vibeui-auth-009-border);padding-top:0.625rem}
[data-vibeui-block="auth-009"] summary{cursor:pointer;font-size:0.75rem;font-weight:650;color:var(--vibeui-auth-009-accent)}
[data-vibeui-block="auth-009"] summary:focus-visible{outline:2px solid var(--vibeui-auth-009-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="auth-009"] details p{margin:0.5rem 0 0;font-size:0.75rem;line-height:1.55;color:var(--vibeui-auth-009-muted)}
[data-vibeui-block="auth-009"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.625rem;padding:0.375rem 1rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-009-accent);color:var(--vibeui-auth-009-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="auth-009"] [data-part="submit"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="auth-009"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-009-accent);outline-offset:2px}
[data-vibeui-block="auth-009"] [data-part="why"]{margin:0.625rem 0 0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-auth-009-muted);text-align:center;min-height:1.0625rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-009"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Регистрация с явным согласием: кнопка ждёт обязательной галочки,
 * рассылка отключена по умолчанию. Один файл, ноль зависимостей.
 */
export function Auth009({
  title = "Создать аккаунт",
  lead = "Бесплатный тариф, карта не нужна. Отменить можно в любой момент.",
  submit = "Создать аккаунт",
  terms = "Я принимаю условия использования и политику конфиденциальности",
  marketing = "Присылать письма о новых блоках — не чаще раза в месяц",
  nameLabel = "Имя",
  namePlaceholder = "Анна",
  companyLabel = "Компания",
  companyPlaceholder = "Мера",
  emailLabel = "Рабочая почта",
  emailPlaceholder = "name@company.ru",
  passwordLabel = "Пароль",
  detailsSummary = "Что именно я принимаю",
  detailsText = "Хранение почты и имени для доступа к аккаунту, историю установленных блоков и технические письма о работе сервиса. Рекламные письма — только по отдельной галочке выше.",
  requiredHint = "Отметьте обязательное согласие, чтобы продолжить.",
  background = "",
  accent,
  className,
  style,
}: Auth009Props) {
  const [agreed, setAgreed] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-auth-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-009"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <form
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <div data-part="pair">
              <div data-part="field">
                <label htmlFor="vibeui-auth-009-name">{nameLabel}</label>
                <input
                  id="vibeui-auth-009-name"
                  name="name"
                  type="text"
                  autoComplete="given-name"
                  placeholder={namePlaceholder}
                />
              </div>
              <div data-part="field">
                <label htmlFor="vibeui-auth-009-company">{companyLabel}</label>
                <input
                  id="vibeui-auth-009-company"
                  name="organization"
                  type="text"
                  autoComplete="organization"
                  placeholder={companyPlaceholder}
                />
              </div>
            </div>

            <div data-part="field">
              <label htmlFor="vibeui-auth-009-email">{emailLabel}</label>
              <input
                id="vibeui-auth-009-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder={emailPlaceholder}
                required
              />
            </div>

            <div data-part="field">
              <label htmlFor="vibeui-auth-009-password">{passwordLabel}</label>
              <input
                id="vibeui-auth-009-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>

            <fieldset data-part="consents">
              <label data-part="consent">
                <input
                  type="checkbox"
                  name="terms"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                />
                <span>
                  {terms} <span data-part="req">*</span>
                </span>
              </label>
              <label data-part="consent">
                <input type="checkbox" name="marketing" />
                <span>{marketing}</span>
              </label>
              <details>
                <summary>{detailsSummary}</summary>
                <p>{detailsText}</p>
              </details>
            </fieldset>

            <button type="submit" data-part="submit" disabled={!agreed}>
              {submit}
            </button>
            <p data-part="why" role="status">
              {agreed ? "" : requiredHint}
            </p>
          </form>
        </div>
      </section>
    </>
  )
}

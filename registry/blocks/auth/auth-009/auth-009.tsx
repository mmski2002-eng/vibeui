"use client"

import { useState } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Checkbox001 } from "@/registry/components/checkbox/checkbox-001/checkbox-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"
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
--vibeui-auth-009-card:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-auth-009-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-auth-009-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-auth-009-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-auth-009-accent:light-dark(oklch(0.287 0 0),oklch(0.906 0 0));
--vibeui-auth-009-on-accent:oklch(from var(--vibeui-auth-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-auth-009-well:light-dark(oklch(0.55 0 265 / 4%),oklch(0.85 0 265 / 7%));
--vibeui-auth-009-dur-2:180ms;
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
[data-vibeui-block="auth-009"] [data-part="heading"]{margin-bottom:0.25rem}
[data-vibeui-block="auth-009"] form{display:grid;gap:0.75rem}
[data-vibeui-block="auth-009"] [data-part="submit"]{width:100%}
[data-vibeui-block="auth-009"] [data-part="shell"]{
width:100%;max-width:24rem;margin:0 auto;padding:1.5rem;
background:var(--vibeui-auth-009-card);
border:1px solid var(--vibeui-auth-009-border);border-radius:1rem;
}
@container (min-width: 42rem){
[data-vibeui-block="auth-009"] [data-part="shell"]{max-width:26rem;padding:2rem}
[data-vibeui-block="auth-009"] [data-part="pair"]{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
}
[data-vibeui-block="auth-009"] [data-part="lead"]{margin:0 0 1.125rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-009-muted)}
[data-vibeui-block="auth-009"] label:not([data-slot] *){font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-009"] [data-part="consents"]{
display:flex;flex-direction:column;gap:0.625rem;
margin:1rem 0;padding:0.875rem;
border:1px solid var(--vibeui-auth-009-border);border-radius:0.75rem;
background:var(--vibeui-auth-009-well);
}
[data-vibeui-block="auth-009"] details{border-top:1px dashed var(--vibeui-auth-009-border);padding-top:0.625rem}
[data-vibeui-block="auth-009"] summary{cursor:pointer;font-size:0.75rem;font-weight:650;color:var(--vibeui-auth-009-accent)}
[data-vibeui-block="auth-009"] summary:focus-visible{outline:2px solid var(--vibeui-auth-009-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="auth-009"] details p{margin:0.5rem 0 0;font-size:0.75rem;line-height:1.55;color:var(--vibeui-auth-009-muted)}
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
  companyLabel = "Компания",
  emailLabel = "Рабочая почта",
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
          <Heading001
            data-part="heading"
            title={title}
            size="xs"
            accent={accent}
          />
          <p data-part="lead">{lead}</p>

          <form
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <div data-part="pair">
              <Input001
                name="name"
                type="text"
                autoComplete="given-name"
                label={nameLabel}
                accent={accent}
              />
              <Input001
                name="organization"
                type="text"
                autoComplete="organization"
                label={companyLabel}
                accent={accent}
              />
            </div>

            <Input001
              name="email"
              type="email"
              autoComplete="username"
              required
              label={emailLabel}
              accent={accent}
            />

            <Input001
              name="password"
              type="password"
              autoComplete="new-password"
              required
              label={passwordLabel}
              accent={accent}
            />

            <fieldset data-part="consents">
              <Checkbox001
                name="terms"
                required
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                label={`${terms} *`}
                description=""
                accent={accent}
              />
              <Checkbox001 name="marketing" label={marketing} description="" accent={accent} />
              <details>
                <summary>{detailsSummary}</summary>
                <p>{detailsText}</p>
              </details>
            </fieldset>

            <Button001 type="submit" data-part="submit" size="lg" accent={accent}>
              {submit}
            </Button001>
            <p data-part="why" role="status">
              {agreed ? "" : requiredHint}
            </p>
          </form>
        </div>
      </section>
    </>
  )
}

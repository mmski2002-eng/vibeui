"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth026Country = {
  code: string
  label: string
  mask: string
}

export type Auth026Props = {
  title?: string
  lead?: string
  countries?: Auth026Country[]
  submit?: string
  /** Сколько цифр в коде из сообщения. */
  codeLength?: number
  /** Подпись поля номера. */
  phoneLabel?: string
  /** Подпись списка кодов стран для скринридера. */
  countryLabel?: string
  /** Заголовок второго шага. */
  codeTitle?: string
  /** Подзаголовок второго шага; {length} подставляется числом цифр. */
  codeLead?: string
  /** Кнопка возврата к номеру. */
  changeText?: string
  /** Подпись поля кода. */
  codeLabel?: string
  /** Кнопка на втором шаге. */
  codeSubmit?: string
  /** Сноска под кнопкой первого шага. */
  hintText?: string
  /** Ссылка на вход по почте. */
  emailLinkText?: string
  /** Сноска под кнопкой второго шага. */
  resendText?: string
  /** Ссылка на звонок с кодом. */
  resendLinkText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: вход по номеру телефона с кодом из SMS. Код страны вынесен в
// отдельный select, а не спрятан в маску: человек с зарубежной картой иначе
// не понимает, куда девать свой номер, и уходит. Номер набирается в поле
// с inputMode="tel" — на телефоне это цифровая клавиатура, а не буквенная.
// На втором шаге номер показан рядом с кнопкой «изменить»: главная ошибка
// такого входа — опечатка в номере, и обнаруживается она ровно тогда, когда
// SMS не пришла. Возврат назад сохраняет уже введённые цифры.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственной подложки.
//
// Демонстрация интерфейса: SMS не отправляются, код не проверяется.
const STYLES = `
:where([data-vibeui-block="auth-026"]){
--vibeui-auth-026-bg:transparent;
--vibeui-auth-026-card:light-dark(oklch(1 0 0),oklch(0.22 0 235));
--vibeui-auth-026-fg:light-dark(oklch(0.22 0.014 210),oklch(0.94 0 230));
--vibeui-auth-026-muted:light-dark(oklch(0.54 0.014 210),oklch(0.71 0 230));
--vibeui-auth-026-border:light-dark(oklch(0.9 0.008 210),oklch(0.36 0 230));
--vibeui-auth-026-accent:light-dark(oklch(0.52 0.16 235),oklch(0.76 0.13 240));
--vibeui-auth-026-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 240));
--vibeui-auth-026-soft:light-dark(oklch(0.55 0.02 210 / 7%),oklch(0.82 0 230 / 10%));
--vibeui-auth-026-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-auth-026-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-026"]{color-scheme:dark}
[data-vibeui-block="auth-026"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1.5rem 1rem;
background:var(--vibeui-auth-026-bg);color:var(--vibeui-auth-026-fg);
font-family:var(--vibeui-auth-026-sans);
}
[data-vibeui-block="auth-026"] *{box-sizing:border-box}
[data-vibeui-block="auth-026"] [data-part="shell"]{
width:100%;max-width:23rem;margin:0 auto;padding:1.75rem 1.5rem;
background:var(--vibeui-auth-026-card);
border:1px solid var(--vibeui-auth-026-border);border-radius:1.125rem;
}
@container (min-width: 40rem){
[data-vibeui-block="auth-026"] [data-part="shell"]{max-width:25rem;padding:2.25rem 2rem}
[data-vibeui-block="auth-026"] [data-part="code"]{height:3.25rem;font-size:1.5rem}
}
[data-vibeui-block="auth-026"] h2{margin:0 0 0.375rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="auth-026"] [data-part="lead"]{margin:0 0 1.125rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-026-muted)}
[data-vibeui-block="auth-026"] label{display:block;margin-bottom:0.3125rem;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-026"] [data-part="phone"]{display:flex;gap:0.5rem;margin-bottom:0.875rem}
[data-vibeui-block="auth-026"] select{
flex:none;width:7.5rem;height:2.625rem;padding:0 0.5rem;
border:1px solid var(--vibeui-auth-026-border);border-radius:0.625rem;
background:var(--vibeui-auth-026-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-026"] input{
width:100%;height:2.625rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-026-border);border-radius:0.625rem;
background:var(--vibeui-auth-026-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-026"] select:focus-visible,
[data-vibeui-block="auth-026"] input:focus-visible{outline:2px solid var(--vibeui-auth-026-accent);outline-offset:1px;border-color:var(--vibeui-auth-026-accent)}
[data-vibeui-block="auth-026"] [data-part="code"]{
height:3rem;font-family:var(--vibeui-auth-026-mono);font-size:1.375rem;font-weight:700;
letter-spacing:0.4em;text-align:center;text-indent:0.4em;margin-bottom:0.875rem;
}
[data-vibeui-block="auth-026"] [data-part="sent"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
margin:0 0 1rem;padding:0.625rem 0.75rem;border-radius:0.625rem;
background:var(--vibeui-auth-026-soft);font-size:0.8125rem;
}
[data-vibeui-block="auth-026"] [data-part="number"]{font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="auth-026"] [data-part="change"]{
margin-left:auto;appearance:none;border:0;background:none;cursor:pointer;padding:0;
color:var(--vibeui-auth-026-accent);font:inherit;font-size:0.75rem;font-weight:650;text-decoration:underline;
}
[data-vibeui-block="auth-026"] [data-part="change"]:focus-visible{outline:2px solid var(--vibeui-auth-026-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="auth-026"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.375rem 1rem;
border:0;border-radius:0.75rem;
background:var(--vibeui-auth-026-accent);color:var(--vibeui-auth-026-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="auth-026"] [data-part="submit"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="auth-026"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-026-accent);outline-offset:2px}
[data-vibeui-block="auth-026"] [data-part="hint"]{margin:0.75rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-auth-026-muted)}
[data-vibeui-block="auth-026"] [data-part="hint"] a{color:var(--vibeui-auth-026-accent);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-026"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COUNTRIES: Auth026Country[] = [
  { code: "+7", label: "+7 Россия", mask: "900 000-00-00" },
  { code: "+375", label: "+375 Беларусь", mask: "29 000-00-00" },
  { code: "+7 KZ", label: "+7 Казахстан", mask: "700 000-00-00" },
  { code: "+995", label: "+995 Грузия", mask: "555 00-00-00" },
]

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
 * Вход по телефону: код страны отдельным списком, затем код из SMS
 * с возможностью поправить номер. Один файл, ноль зависимостей.
 */
export function Auth026({
  title = "Вход по номеру",
  lead = "Пришлём код в SMS. Пароль не понадобится.",
  countries = DEFAULT_COUNTRIES,
  submit = "Получить код",
  codeLength = 4,
  phoneLabel = "Номер телефона",
  countryLabel = "Код страны",
  codeTitle = "Код из SMS",
  codeLead = "Сообщение идёт до минуты. Код состоит из {length} цифр.",
  changeText = "Изменить номер",
  codeLabel = "Код из сообщения",
  codeSubmit = "Войти",
  hintText = "Отправляя номер, вы соглашаетесь получить одно служебное SMS. Есть почта?",
  emailLinkText = "Войти по почте",
  resendText = "SMS не пришла? Проверьте номер выше, а через минуту",
  resendLinkText = "закажите звонок с кодом",
  background = "",
  accent,
  className,
  style,
}: Auth026Props) {
  const [country, setCountry] = useState(countries[0]?.code ?? "")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"phone" | "code">("phone")

  const picked = countries.find((item) => item.code === country) ?? countries[0]

  const palette = {
    ...(accent ? { "--vibeui-auth-026-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-026-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-026" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-026"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          {step === "phone" ? (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                setStep("code")
              }}
            >
              <h2>{title}</h2>
              <p data-part="lead">{lead}</p>

              <label htmlFor="vibeui-auth-026-phone">{phoneLabel}</label>
              <div data-part="phone">
                <select
                  name="country"
                  aria-label={countryLabel}
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                >
                  {countries.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <input
                  id="vibeui-auth-026-phone"
                  name="tel"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder={picked?.mask}
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value.replace(/[^\d\s-]/g, ""))
                  }
                />
              </div>

              <button
                type="submit"
                data-part="submit"
                disabled={phone.replace(/\D/g, "").length < 6}
              >
                {submit}
              </button>

              <p data-part="hint">
                {hintText} <a href="#">{emailLinkText}</a>
              </p>
            </form>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault()
              }}
            >
              <h2>{codeTitle}</h2>
              <p data-part="lead">
                {codeLead.replace("{length}", String(codeLength))}
              </p>

              <p data-part="sent">
                <span data-part="number">
                  {country.replace(" KZ", "")} {phone}
                </span>
                <button
                  type="button"
                  data-part="change"
                  onClick={() => setStep("phone")}
                >
                  {changeText}
                </button>
              </p>

              <label htmlFor="vibeui-auth-026-code">{codeLabel}</label>
              <input
                id="vibeui-auth-026-code"
                data-part="code"
                name="one-time-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={codeLength}
                value={code}
                onChange={(event) =>
                  setCode(
                    event.target.value.replace(/\D/g, "").slice(0, codeLength),
                  )
                }
              />

              <button
                type="submit"
                data-part="submit"
                disabled={code.length < codeLength}
              >
                {codeSubmit}
              </button>

              <p data-part="hint">
                {resendText} <a href="#">{resendLinkText}</a>.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

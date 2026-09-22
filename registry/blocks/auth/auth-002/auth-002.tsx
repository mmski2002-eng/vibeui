"use client"

import { useState } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"
import type { CSSProperties } from "react"

export type Auth002Props = {
  title?: string
  lead?: string
  submit?: string
  terms?: string
  switchText?: string
  switchLink?: string
  nameLabel?: string
  nameValue?: string
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  showLabel?: string
  hideLabel?: string
  /** Четыре оценки по возрастанию: компонент несёт русские. */
  verdicts?: string[]
  /** Строка вердикта; {verdict} подставляется из verdicts. */
  verdictTemplate?: string
  /** Три требования в том же порядке, что и проверки в score. */
  ruleLabels?: string[]
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: регистрация с честной оценкой пароля. Оценка считается по длине
// и разнообразию символов и показывается полосой и словом — полоса без слова
// не говорит, что именно исправить. Требования перечислены заранее, а не
// выскакивают после ошибки: список видно до первого нажатия. Поле повтора
// пароля намеренно отсутствует — оно не ловит опечатки, а мешает менеджерам
// паролей; вместо него есть показ введённого.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="auth-002"]){
--vibeui-auth-002-bg:transparent;
--vibeui-auth-002-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-auth-002-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-auth-002-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-auth-002-track:light-dark(oklch(0.93 0 265),oklch(0.3 0 265));
--vibeui-auth-002-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-auth-002-on-accent:oklch(from var(--vibeui-auth-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-auth-002-weak:light-dark(oklch(0.6 0.19 25),oklch(0.71 0.16 25));
--vibeui-auth-002-mid:light-dark(oklch(0.72 0.15 75),oklch(0.79 0.13 75));
--vibeui-auth-002-good:light-dark(oklch(0.58 0.14 152),oklch(0.72 0.13 152));
--vibeui-auth-002-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-002"]{color-scheme:dark}
[data-vibeui-block="auth-002"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:23rem;margin-inline:auto;box-sizing:border-box;padding:1.25rem;
background:var(--vibeui-auth-002-bg);
border:1px solid var(--vibeui-auth-002-border);border-radius:1rem;
font-family:var(--vibeui-auth-002-sans);color:var(--vibeui-auth-002-fg);
}
[data-vibeui-block="auth-002"] *{box-sizing:border-box}
[data-vibeui-block="auth-002"] [data-part="heading"]{margin-bottom:0.25rem}
[data-vibeui-block="auth-002"] form{display:grid;gap:0.75rem}
[data-vibeui-block="auth-002"] [data-part="submit"]{width:100%;margin-top:0.875rem}
[data-vibeui-block="auth-002"] [data-part="lead"]{margin:0 0 1rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-auth-002-muted)}
[data-vibeui-block="auth-002"] label:not([data-slot] *){font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-002"] [data-part="pass"]{position:relative;display:flex}
[data-vibeui-block="auth-002"] [data-part="pass"] input{padding-right:5rem}
[data-vibeui-block="auth-002"] [data-part="peek"]{
position:absolute;right:0.3125rem;top:0.3125rem;
appearance:none;border:0;background:none;cursor:pointer;
height:1.875rem;padding:0 0.5rem;border-radius:0.4375rem;
color:var(--vibeui-auth-002-accent);font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="auth-002"] [data-part="peek"]:focus-visible{outline:2px solid var(--vibeui-auth-002-accent);outline-offset:1px}
/* Оценка полосой и словом: полоса без слова не говорит, что исправить. */
[data-vibeui-block="auth-002"] [data-part="meter"]{
display:flex;gap:0.25rem;margin-top:0.375rem;
}
[data-vibeui-block="auth-002"] [data-part="seg"]{
flex:1 1 0;height:0.25rem;border-radius:9999px;background:var(--vibeui-auth-002-track);
}
[data-vibeui-block="auth-002"] [data-score="1"] [data-part="seg"]:nth-child(1){background:var(--vibeui-auth-002-weak)}
[data-vibeui-block="auth-002"] [data-score="2"] [data-part="seg"]:nth-child(-n+2){background:var(--vibeui-auth-002-mid)}
[data-vibeui-block="auth-002"] [data-score="3"] [data-part="seg"]:nth-child(-n+3){background:var(--vibeui-auth-002-good)}
[data-vibeui-block="auth-002"] [data-part="verdict"]{
margin:0.3125rem 0 0;font-size:0.6875rem;font-weight:650;color:var(--vibeui-auth-002-muted);
}
/* Требования показаны заранее, а не после ошибки. */
[data-vibeui-block="auth-002"] ul{
list-style:none;margin:0.375rem 0 0;padding:0;
display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;
font-size:0.6875rem;color:var(--vibeui-auth-002-muted);
}
[data-vibeui-block="auth-002"] li{display:flex;align-items:center;gap:0.25rem}
[data-vibeui-block="auth-002"] [data-ok="true"]{color:var(--vibeui-auth-002-fg)}
[data-vibeui-block="auth-002"] [data-part="terms"]{
margin:0.625rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-auth-002-muted);text-align:center;
}
[data-vibeui-block="auth-002"] [data-part="switch"]{
margin:0.75rem 0 0;text-align:center;font-size:0.8125rem;color:var(--vibeui-auth-002-muted);
}
[data-vibeui-block="auth-002"] a{color:var(--vibeui-auth-002-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-002"] *{animation:none!important;transition:none!important}}
`

const VERDICTS = ["слишком простой", "простой", "сойдёт", "надёжный"]

const RULE_LABELS = [
  "от 10 символов",
  "буквы и цифры",
  "спецсимвол или от 16 символов",
]

function score(value: string) {
  let points = 0
  if (value.length >= 10) points += 1
  if (/[a-zа-яё]/i.test(value) && /\d/.test(value)) points += 1
  if (/[^\wа-яё]/i.test(value) || value.length >= 16) points += 1
  return points
}

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
 * Регистрация: честная оценка пароля словом и требования, показанные заранее.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Auth002({
  title = "Создать аккаунт",
  lead = "Одна учётная запись на все проекты команды.",
  submit = "Создать аккаунт",
  terms = "Создавая аккаунт, вы соглашаетесь с условиями сервиса и политикой обработки данных.",
  switchText = "Уже есть аккаунт?",
  switchLink = "Войти",
  nameLabel = "Имя",
  nameValue = "Анна Реброва",
  emailLabel = "Рабочая почта",
  emailPlaceholder = "name@company.ru",
  passwordLabel = "Пароль",
  showLabel = "Показать",
  hideLabel = "Скрыть",
  verdicts = VERDICTS,
  verdictTemplate = "Пароль {verdict}",
  ruleLabels = RULE_LABELS,
  background = "",
  accent,
  className,
  style,
}: Auth002Props) {
  const [password, setPassword] = useState("vibeui2026")
  const [shown, setShown] = useState(false)
  const points = score(password)

  const rules = [
    password.length >= 10,
    /[a-zа-яё]/i.test(password) && /\d/.test(password),
    /[^\wа-яё]/i.test(password) || password.length >= 16,
  ].map((ok, index) => ({ text: ruleLabels[index] ?? RULE_LABELS[index], ok }))

  const palette = {
    ...(accent ? { "--vibeui-auth-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-002"
        className={className}
        style={palette}
        aria-label={title}
      >
        <Heading001
          data-part="heading"
          title={title}
          size="xs"
          accent={accent}
        />
        <p data-part="lead">{lead}</p>

        <form>
          <Input001
            key={nameValue}
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={nameValue}
            label={nameLabel}
            accent={accent}
          />

          <Input001
            name="email"
            type="email"
            autoComplete="username"
            required
            label={emailLabel}
            accent={accent}
          />

          <div data-part="form-field" data-score={points}>
            <label htmlFor="vibeui-auth-002-password">{passwordLabel}</label>
            <span data-part="pass">
              <input
                id="vibeui-auth-002-password"
                name="password"
                type={shown ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-describedby="vibeui-auth-002-verdict"
                required
              />
              <button
                type="button"
                data-part="peek"
                onClick={() => setShown((current) => !current)}
              >
                {shown ? hideLabel : showLabel}
              </button>
            </span>

            <span data-part="meter" aria-hidden="true">
              <span data-part="seg" />
              <span data-part="seg" />
              <span data-part="seg" />
            </span>
            <p
              id="vibeui-auth-002-verdict"
              data-part="verdict"
              aria-live="polite"
            >
              {verdictTemplate.replace(
                "{verdict}",
                verdicts[points] ?? VERDICTS[points],
              )}
            </p>

            <ul>
              {rules.map((rule) => (
                <li key={rule.text} data-ok={rule.ok ? "true" : "false"}>
                  <span data-part="mark" aria-hidden="true">
                    {rule.ok ? "✓" : null}
                  </span>
                  {rule.text}
                </li>
              ))}
            </ul>
          </div>

          <Button001 type="submit" data-part="submit" size="lg" accent={accent}>
            {submit}
          </Button001>
        </form>

        <p data-part="terms">{terms}</p>
        <p data-part="switch">
          {switchText} <a href="#">{switchLink}</a>
        </p>
      </section>
    </>
  )
}

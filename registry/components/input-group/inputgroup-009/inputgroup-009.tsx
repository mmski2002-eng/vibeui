import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup009Props = Omit<ComponentProps<"div">, "children"> & {
  name?: string
  label?: string
  error?: string
  domains?: string[]
  /** Подпись списка доменов для чтения вслух. */
  domainLabel?: string
  /** Имя пользователя в поле по умолчанию. */
  user?: string
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: ошибка принадлежит сцепке целиком, а не одной её половине.
// Логин без домена и домен без логина — одна и та же неправильная почта, и
// подчёркивать красным только левую часть значит врать. Поэтому красная
// рамка ставится на группу, aria-invalid — на оба поля, а aria-describedby
// у обоих указывает на одно сообщение: озвучено оно будет один раз, с какой
// бы половины ни начали.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="inputgroup-009"]){
--vibeui-inputgroup-009-surface:transparent;
--vibeui-inputgroup-009-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-inputgroup-009-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-009-muted:color-mix(in oklab,var(--vibeui-inputgroup-009-fg) 68%,transparent);
--vibeui-inputgroup-009-field:light-dark(oklch(0.99 0 265),oklch(0.27 0 265));
--vibeui-inputgroup-009-fixed:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-inputgroup-009-border:light-dark(oklch(0.86 0 265),oklch(0.44 0 265));
--vibeui-inputgroup-009-accent:light-dark(oklch(0.52 0.17 265),oklch(0.72 0.15 265));
--vibeui-inputgroup-009-bad:light-dark(oklch(0.55 0.2 25),oklch(0.72 0.17 25));
--vibeui-inputgroup-009-radius:0.75rem;
--vibeui-inputgroup-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-009"]{color-scheme:dark}
[data-vibeui-block="inputgroup-009"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-009-surface);
border:1px solid var(--vibeui-inputgroup-009-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-009-font);color:var(--vibeui-inputgroup-009-fg);
}
[data-vibeui-block="inputgroup-009"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-009"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-009"] [data-part="group"]{
display:flex;align-items:stretch;border-radius:var(--vibeui-inputgroup-009-radius);
}
[data-vibeui-block="inputgroup-009"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-009-border);
border-radius:0;margin-left:-1px;font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="inputgroup-009"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-009-radius) 0 0 var(--vibeui-inputgroup-009-radius);
}
[data-vibeui-block="inputgroup-009"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-009-radius) var(--vibeui-inputgroup-009-radius) 0;
}
[data-vibeui-block="inputgroup-009"] [data-part="group"] > *:focus{
z-index:2;outline:2px solid var(--vibeui-inputgroup-009-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-009-accent);
}
/* Ошибка красит всю сцепку, а не половину: значение неверно целиком.
   Кольцо рисуется на группе, поэтому его не режет граница соседа. */
[data-vibeui-block="inputgroup-009"] [data-part="group"][data-bad="1"]{
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-inputgroup-009-bad) 16%,transparent);
}
[data-vibeui-block="inputgroup-009"] [data-part="group"][data-bad="1"] > *{
border-color:var(--vibeui-inputgroup-009-bad);
}
[data-vibeui-block="inputgroup-009"] [data-part="group"][data-bad="1"] > *:focus{
outline-color:var(--vibeui-inputgroup-009-bad);
}
[data-vibeui-block="inputgroup-009"] input{
flex:1;min-width:0;padding:0 0.75rem;background:var(--vibeui-inputgroup-009-field);
}
[data-vibeui-block="inputgroup-009"] [data-part="at"]{
flex:none;display:grid;place-items:center;width:2rem;
background:var(--vibeui-inputgroup-009-fixed);
color:var(--vibeui-inputgroup-009-muted);font-weight:600;
}
[data-vibeui-block="inputgroup-009"] select{
appearance:none;flex:none;width:10ch;padding:0 1.375rem 0 0.625rem;cursor:pointer;
background:var(--vibeui-inputgroup-009-fixed);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 0.9rem) 50%,calc(100% - 0.6rem) 50%;
background-size:0.3rem 0.3rem,0.3rem 0.3rem;
background-repeat:no-repeat;
}
[data-vibeui-block="inputgroup-009"] [data-part="error"]{
display:flex;align-items:flex-start;gap:0.375rem;margin:0;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-009-bad);
}
[data-vibeui-block="inputgroup-009"] [data-part="error"] svg{
flex:none;width:0.875rem;height:0.875rem;margin-top:0.0625rem;display:block;
}
[data-vibeui-block="inputgroup-009"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-009"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Сцепка с ошибкой на всей группе: красная рамка и одно сообщение на два поля.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup009({
  name = "corporate",
  label = "Корпоративная почта",
  error = "Такой почты нет в вашей организации — проверьте имя и домен.",
  domains = ["vibeui.ru", "vibeui.com", "team.local"],
  domainLabel = "Домен",
  user = "anna.orlova",
  hint = "Имя и домен уходят двумя полями формы.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup009Props) {
  const palette = {
    ...(accent ? { "--vibeui-inputgroup-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-009-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const bad = Boolean(error)
  const described = bad ? `${name}-error` : `${name}-hint`

  return (
    <>
      <style href="vibeui-inputgroup-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-009"
        className={className}
        style={palette}
      >
        <label htmlFor={`${name}-user`}>{label}</label>
        <div data-part="group" data-bad={bad ? "1" : "0"}>
          <input
            id={`${name}-user`}
            name={`${name}-user`}
            type="text"
            autoComplete="username"
            spellCheck={false}
            placeholder={user}
            defaultValue={user}
            aria-invalid={bad}
            aria-describedby={described}
          />
          <span data-part="at" aria-hidden="true">
            @
          </span>
          <select
            name={`${name}-domain`}
            aria-label={domainLabel}
            defaultValue={domains[0]}
            aria-invalid={bad}
            aria-describedby={described}
          >
            {domains.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>
        {bad ? (
          <p data-part="error" id={`${name}-error`} role="alert">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="6.25" />
              <path d="M8 4.75v4" strokeLinecap="round" />
              <circle
                cx="8"
                cy="11"
                r="0.75"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            {error}
          </p>
        ) : (
          <p data-part="hint" id={`${name}-hint`}>
            {hint}
          </p>
        )}
      </div>
    </>
  )
}

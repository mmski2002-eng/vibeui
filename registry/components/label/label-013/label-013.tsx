import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Label013Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  legend?: string
  error?: string
  firstLabel?: string
  secondLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пароль и подтверждение пароля — два разных поля, но
// ошибка у них одна на двоих («не совпадают»), а не своя у каждого. Дублировать
// её под обоими полями — шум и путаница, какое из двух неверно. Поэтому
// сообщение одно, стоит сразу под заголовком группы, и связано через
// aria-describedby со всем <fieldset> и с каждым полем сразу.
const STYLES = `
:where([data-vibeui-block="label-013"]){
--vibeui-label-013-surface:transparent;
--vibeui-label-013-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.33 0.012 265));
--vibeui-label-013-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.005 265));
--vibeui-label-013-muted:light-dark(oklch(0.54 0.014 265),oklch(0.7 0.012 265));
--vibeui-label-013-field-border:light-dark(oklch(0.85 0.01 265),oklch(0.4 0.014 265));
--vibeui-label-013-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-label-013-error:light-dark(oklch(0.55 0.2 25),oklch(0.76 0.15 25));
--vibeui-label-013-error-soft:light-dark(oklch(0.96 0.03 25),oklch(0.31 0.055 25));
--vibeui-label-013-radius:0.625rem;
--vibeui-label-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Подложки по умолчанию нет: палитра идёт от color-scheme окружения, и блок
   ложится на фон страницы. Плашка появляется только пропом background. */
[data-vibeui-block="label-013"]{
box-sizing:border-box;width:100%;max-width:24rem;
margin:0;padding:1rem;
background:var(--vibeui-label-013-surface);
border:1px solid var(--vibeui-label-013-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-label-013-font);color:var(--vibeui-label-013-fg);
}
[data-vibeui-block="label-013"] legend{
float:left;width:100%;padding:0;margin:0;
font-size:0.875rem;font-weight:600;line-height:1.3;
}
[data-vibeui-block="label-013"] [data-part="error"]{
clear:both;display:flex;align-items:flex-start;gap:0.375rem;
margin:0.5rem 0 0;padding:0.375rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-label-013-error-soft);
font-size:0.8125rem;line-height:1.4;color:var(--vibeui-label-013-error);
}
[data-vibeui-block="label-013"] [data-part="sign"]{
flex:none;margin-top:0.0625rem;
width:0.875rem;height:0.875rem;border-radius:50%;
border:1px solid currentColor;
display:inline-flex;align-items:center;justify-content:center;
font-size:0.625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="label-013"] [data-part="fields"]{
clear:both;display:flex;flex-direction:column;gap:0.625rem;margin-top:0.75rem;
}
[data-vibeui-block="label-013"] [data-part="field"]{
display:flex;flex-direction:column;gap:0.3125rem;
}
[data-vibeui-block="label-013"] [data-part="field"] label{
font-size:0.8125rem;font-weight:500;line-height:1.3;
color:var(--vibeui-label-013-muted);cursor:pointer;
}
[data-vibeui-block="label-013"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;
color:var(--vibeui-label-013-fg);background:var(--vibeui-label-013-surface);
border:1px solid var(--vibeui-label-013-field-border);
border-radius:var(--vibeui-label-013-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-013"] input[aria-invalid="true"]{
border-color:var(--vibeui-label-013-error);
}
[data-vibeui-block="label-013"] input:focus-visible{
outline:none;border-color:var(--vibeui-label-013-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-013-accent) 22%,transparent);
}
[data-vibeui-block="label-013"] input[aria-invalid="true"]:focus-visible{
border-color:var(--vibeui-label-013-error);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-013-error) 22%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-013"] *{animation:none!important;transition:none!important}}
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
 * Подпись группы полей: заголовок в <legend> и одна общая ошибка под ним
 * для обоих полей группы, без дублирования на каждое. Один файл, ноль
 * зависимостей.
 */
export function Label013({
  legend = "Новый пароль",
  error = "Пароли не совпадают: проверьте оба поля.",
  firstLabel = "Пароль",
  secondLabel = "Повторите пароль",
  background = "",
  accent,
  className,
  style,
  ...props
}: Label013Props) {
  const id = useId()
  const errorId = `${id}-error`
  const firstId = `${id}-first`
  const secondId = `${id}-second`
  const palette = {
    ...(accent ? { "--vibeui-label-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-label-013-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-013" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="label-013"
        className={className}
        style={palette}
        aria-describedby={errorId}
      >
        <legend>{legend}</legend>
        <p data-part="error" id={errorId}>
          <span data-part="sign" aria-hidden="true">
            !
          </span>
          {error}
        </p>
        <div data-part="fields">
          <div data-part="field">
            <label htmlFor={firstId}>{firstLabel}</label>
            <input
              id={firstId}
              type="password"
              name="password"
              autoComplete="new-password"
              aria-invalid="true"
              aria-describedby={errorId}
            />
          </div>
          <div data-part="field">
            <label htmlFor={secondId}>{secondLabel}</label>
            <input
              id={secondId}
              type="password"
              name="password-confirm"
              autoComplete="new-password"
              aria-invalid="true"
              aria-describedby={errorId}
            />
          </div>
        </div>
      </fieldset>
    </>
  )
}

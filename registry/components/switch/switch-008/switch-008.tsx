import type { ComponentProps, CSSProperties } from "react"

export type Switch008Props = Omit<
  ComponentProps<"input">,
  "type" | "size" | "disabled"
> & {
  label?: string
  /** Почему настройку нельзя включить: без этой строки блокировка — грубость. */
  reason?: string
  actionText?: string
  actionHref?: string
  /** Пусто — подложки нет, карточка держится рамкой на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выключенная настройка, которая объясняет себя. Серый
// тумблер без текста читается как поломка; здесь рядом стоит замок,
// причина написана словами, а ссылка ведёт туда, где ограничение снимается.
// Ссылка не заблокирована — иначе выход из тупика тоже был бы недоступен.
const STYLES = `
:where([data-vibeui-block="switch-008"]){
--vibeui-switch-008-bg:transparent;
--vibeui-switch-008-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-switch-008-muted:color-mix(in oklab,var(--vibeui-switch-008-fg) 68%,transparent);
--vibeui-switch-008-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-switch-008-track:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-switch-008-thumb:light-dark(oklch(0.97 0 265),oklch(0.56 0 265));
--vibeui-switch-008-accent:light-dark(oklch(0.55 0.19 39.8),oklch(0.75 0.16 39.8));
--vibeui-switch-008-lock:light-dark(oklch(0.66 0.13 75),oklch(0.79 0.13 75));
--vibeui-switch-008-lock-tint:light-dark(oklch(0.66 0.13 75 / 12%),oklch(0.79 0.13 75 / 16%));
--vibeui-switch-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="switch-008"]{color-scheme:dark}
[data-vibeui-block="switch-008"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-switch-008-bg);
border:1px solid var(--vibeui-switch-008-border);border-radius:0.875rem;
font-family:var(--vibeui-switch-008-font);color:var(--vibeui-switch-008-fg);
}
[data-vibeui-block="switch-008"] [data-part="row"]{
display:flex;align-items:center;gap:0.875rem;cursor:not-allowed;
}
[data-vibeui-block="switch-008"] [data-part="label"]{
display:flex;align-items:center;gap:0.375rem;flex:1 1 auto;min-width:0;
font-size:0.875rem;font-weight:600;color:var(--vibeui-switch-008-muted);
}
/* Замок нарисован дужкой на псевдоэлементе поверх корпуса: значок
   блокировки без иконочного пакета. */
[data-vibeui-block="switch-008"] [data-part="lock"]{
position:relative;flex:none;width:0.75rem;height:0.625rem;margin-top:0.1875rem;
border-radius:0.125rem;background:var(--vibeui-switch-008-lock);
}
[data-vibeui-block="switch-008"] [data-part="lock"]::before{
content:"";position:absolute;left:50%;bottom:0.5rem;
width:0.5rem;height:0.4375rem;margin-left:-0.25rem;
border:1.5px solid var(--vibeui-switch-008-lock);border-bottom:0;
border-radius:0.25rem 0.25rem 0 0;
}
[data-vibeui-block="switch-008"] [data-part="track"]{position:relative;display:flex;flex:none;opacity:.6}
[data-vibeui-block="switch-008"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:2.75rem;height:1.5rem;border-radius:9999px;
background:var(--vibeui-switch-008-track);cursor:not-allowed;
border:1px dashed color-mix(in oklab,var(--vibeui-switch-008-muted) 40%,transparent);
box-sizing:border-box;
}
[data-vibeui-block="switch-008"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
width:1.125rem;height:1.125rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-008-thumb);
box-shadow:0 1px 2px oklch(0.2 0 265 / 18%);
}
[data-vibeui-block="switch-008"] [data-part="reason"]{
display:flex;gap:0.5rem;margin:0;padding:0.5rem 0.625rem;
border-radius:0.5rem;background:var(--vibeui-switch-008-lock-tint);
font-size:0.75rem;line-height:1.45;color:var(--vibeui-switch-008-muted);
}
/* Ссылка остаётся живой и получает свой фокус: она — единственный выход
   из заблокированного состояния. */
[data-vibeui-block="switch-008"] a{
color:var(--vibeui-switch-008-accent);font-weight:600;
text-decoration:underline;text-underline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="switch-008"] a:focus-visible{outline:2px solid var(--vibeui-switch-008-accent);outline-offset:2px}
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
 * Заблокированный переключатель: причина словами и ссылка на выход.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch008({
  label = "Экспорт в облако",
  reason = "Доступно на тарифе «Команда»: на текущем плане выгрузка идёт только вручную.",
  actionText = "Сменить тариф",
  actionHref = "#pricing",
  background = "",
  accent,
  className,
  style,
  ...props
}: Switch008Props) {
  const palette = {
    ...(accent ? { "--vibeui-switch-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-switch-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-008" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="switch"
        data-vibeui-block="switch-008"
        className={className}
        style={palette}
      >
        <label data-part="row">
          <span data-part="label">
            <span data-part="lock" aria-hidden="true" />
            {label}
          </span>
          <span data-part="track">
            <input {...props} type="checkbox" role="switch" disabled />
            <span data-part="thumb" aria-hidden="true" />
          </span>
        </label>
        <p data-part="reason">
          <span>
            {reason} <a href={actionHref}>{actionText}</a>
          </span>
        </p>
      </div>
    </>
  )
}

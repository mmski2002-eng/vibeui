import type { ComponentProps, CSSProperties } from "react"

export type Toast006Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  /** Готово в процентах: определённый прогресс, а не бесконечная крутилка. */
  value?: number
  /** Что именно считается: «7 из 24 файлов». */
  countLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  /** Цвет заполнения полосы и процента. */
  tone?: string
  /** Пусто — подложка берётся из темы окружения. */
  background?: string
}

// Идея компонента: уведомление длинной операции с честным прогрессом. Процент
// живёт в CSS-переменной, поэтому полосу двигает одно число, а не пересборка
// разметки; рядом — счётчик и отмена, потому что ждать вслепую никто не готов.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница карточки светлее её подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="toast-006"]){
--vibeui-toast-006-bg:light-dark(oklch(0.99 0 265),oklch(0.22 0 265));
--vibeui-toast-006-fg:light-dark(oklch(0.22 0 265),oklch(0.97 0 265));
--vibeui-toast-006-muted:color-mix(in oklab,var(--vibeui-toast-006-fg) 68%,transparent);
--vibeui-toast-006-line:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-toast-006-track:light-dark(oklch(0.2 0 265 / 10%),oklch(1 0 0 / 14%));
--vibeui-toast-006-hover:light-dark(oklch(0.2 0 265 / 8%),oklch(1 0 0 / 10%));
--vibeui-toast-006-shadow:light-dark(oklch(0.55 0 265 / 20%),oklch(0.15 0 265 / 65%));
--vibeui-toast-006-tone:light-dark(oklch(0.52 0.13 39.8),oklch(0.7 0.16 39.8));
--vibeui-toast-006-tone-end:light-dark(oklch(0.7 0.14 39.8),oklch(0.85 0.13 39.8));
--vibeui-toast-006-value:0;
--vibeui-toast-006-radius:0.875rem;
--vibeui-toast-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-006"]{color-scheme:dark}
[data-vibeui-block="toast-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.875rem 0.9375rem;
border-radius:var(--vibeui-toast-006-radius);
background:var(--vibeui-toast-006-bg);color:var(--vibeui-toast-006-fg);
font-family:var(--vibeui-toast-006-font);
box-shadow:0 0 0 1px var(--vibeui-toast-006-line),0 20px 44px -24px var(--vibeui-toast-006-shadow);
}
[data-vibeui-block="toast-006"] [data-part="head"]{display:flex;align-items:baseline;gap:0.75rem}
[data-vibeui-block="toast-006"] [data-part="title"]{
margin:0;flex:1 1 auto;min-width:0;
font-size:0.875rem;font-weight:640;line-height:1.35;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="toast-006"] [data-part="percent"]{
flex:none;font-size:0.875rem;font-weight:700;
font-variant-numeric:tabular-nums;color:var(--vibeui-toast-006-tone);
}
/* Полоса на переменной: прогресс двигает одно число, разметка не меняется. */
[data-vibeui-block="toast-006"] [data-part="track"]{
position:relative;height:0.375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-toast-006-track);
}
[data-vibeui-block="toast-006"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;border-radius:inherit;
width:calc(var(--vibeui-toast-006-value) * 1%);
background:linear-gradient(90deg,var(--vibeui-toast-006-tone),color-mix(in oklab,var(--vibeui-toast-006-tone) 55%,var(--vibeui-toast-006-tone-end)));
transition:width .3s ease;
}
[data-vibeui-block="toast-006"] [data-part="foot"]{display:flex;align-items:center;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="toast-006"] [data-part="count"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-toast-006-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="toast-006"] [data-part="cancel"]{
appearance:none;cursor:pointer;border:0;background:transparent;
padding:0.25rem 0.375rem;margin:-0.25rem -0.375rem;border-radius:0.375rem;
font:inherit;font-size:0.75rem;font-weight:600;
color:var(--vibeui-toast-006-muted);
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="toast-006"] [data-part="cancel"]:hover{color:var(--vibeui-toast-006-fg);background:var(--vibeui-toast-006-hover)}
[data-vibeui-block="toast-006"] [data-part="cancel"]:focus-visible{outline:2px solid var(--vibeui-toast-006-tone);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-006"] *{animation:none!important;transition:none!important}}
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
 * Уведомление длинной операции: полоса прогресса, счётчик и отмена.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast006({
  title = "Загружаем фотографии",
  value = 62,
  countLabel = "15 из 24 файлов",
  cancelLabel = "Отменить",
  onCancel,
  tone,
  background = "",
  className,
  style,
  ...props
}: Toast006Props) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)))
  const palette = {
    "--vibeui-toast-006-value": clamped,
    ...(tone ? { "--vibeui-toast-006-tone": tone } : null),
    ...(background
      ? {
          "--vibeui-toast-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-006"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <p data-part="title">{title}</p>
          <span data-part="percent">{clamped}%</span>
        </div>
        <div
          data-part="track"
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={title}
        >
          <span data-part="fill" />
        </div>
        <div data-part="foot">
          <span data-part="count">{countLabel}</span>
          {cancelLabel ? (
            <button data-part="cancel" type="button" onClick={onCancel}>
              {cancelLabel}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}

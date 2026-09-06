import type { ComponentProps, CSSProperties } from "react"

export type Toast001Tone = "neutral" | "success" | "danger"

export type Toast001Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  tone?: Toast001Tone
  /** Что скринридер читает вместо цветной точки тона. */
  toneLabels?: Record<Toast001Tone, string>
  title?: string
  description?: string
  /** Подпись действия отмены. Пустая строка убирает кнопку. */
  undoLabel?: string
  /** Подпись крестика для скринридера. */
  closeLabel?: string
  /** Сколько секунд живёт полоса времени. 0 — полосы нет. */
  duration?: number
  /** Пусто — подложка берётся из темы окружения. */
  background?: string
  onUndo?: () => void
  onClose?: () => void
}

// Идея компонента: уведомление показывает, сколько ему осталось. Полоса
// внизу убывает ровно за отведённое время, поэтому исчезновение не выглядит
// внезапным, а действие «Отменить» видно, пока оно ещё возможно.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница светлее подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="toast-001"]){
--vibeui-toast-001-fg:light-dark(oklch(0.24 0 265),oklch(0.97 0 265));
--vibeui-toast-001-muted:color-mix(in oklab,var(--vibeui-toast-001-fg) 68%,transparent);
--vibeui-toast-001-bg:light-dark(oklch(0.99 0 265),oklch(0.24 0 265));
--vibeui-toast-001-line:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-toast-001-hover:light-dark(oklch(0.2 0 265 / 8%),oklch(1 0 0 / 10%));
--vibeui-toast-001-shadow:light-dark(oklch(0.55 0 265 / 22%),oklch(0.15 0 265 / 60%));
--vibeui-toast-001-tone:light-dark(oklch(0.53 0.14 39.8),oklch(0.72 0.15 39.8));
--vibeui-toast-001-radius:0.75rem;
--vibeui-toast-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-001"]{color-scheme:dark}
[data-vibeui-block="toast-001"]{
position:relative;display:flex;align-items:flex-start;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;overflow:hidden;
padding:0.8125rem 0.875rem;
border-radius:var(--vibeui-toast-001-radius);
background:var(--vibeui-toast-001-bg);color:var(--vibeui-toast-001-fg);
font-family:var(--vibeui-toast-001-font);
box-shadow:0 0 0 1px var(--vibeui-toast-001-line),0 18px 40px -20px var(--vibeui-toast-001-shadow);
}
[data-vibeui-block="toast-001"] [data-part="dot"]{
width:0.5rem;height:0.5rem;flex:none;margin-top:0.3125rem;border-radius:9999px;
background:var(--vibeui-toast-001-tone);
}
/* Тон различается только цветом точки, а она aria-hidden: без этой подписи
   успех и ошибка звучат одинаково. */
[data-vibeui-block="toast-001"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="toast-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="toast-001"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.35}
[data-vibeui-block="toast-001"] [data-part="description"]{font-size:0.8125rem;line-height:1.45;color:var(--vibeui-toast-001-muted)}
[data-vibeui-block="toast-001"] [data-part="undo"],
[data-vibeui-block="toast-001"] [data-part="close"]{
appearance:none;border:0;background:transparent;cursor:pointer;
font:inherit;color:var(--vibeui-toast-001-fg);flex:none;
border-radius:0.375rem;transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="toast-001"] [data-part="undo"]{
font-size:0.8125rem;font-weight:600;padding:0.25rem 0.5rem;
color:var(--vibeui-toast-001-tone);
}
[data-vibeui-block="toast-001"] [data-part="undo"]:hover{background:var(--vibeui-toast-001-hover)}
[data-vibeui-block="toast-001"] [data-part="close"]{
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;font-size:1rem;line-height:1;
color:var(--vibeui-toast-001-muted);
}
[data-vibeui-block="toast-001"] [data-part="close"]:hover{background:var(--vibeui-toast-001-hover);color:var(--vibeui-toast-001-fg)}
[data-vibeui-block="toast-001"] [data-part="undo"]:focus-visible,
[data-vibeui-block="toast-001"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-001-tone);outline-offset:2px}
/* Полоса времени: видно, сколько уведомлению осталось. */
[data-vibeui-block="toast-001"] [data-part="timer"]{
position:absolute;left:0;bottom:0;height:2px;width:100%;
background:var(--vibeui-toast-001-tone);opacity:.55;
transform-origin:left center;
animation:vibeui-toast-001-drain linear forwards;
animation-duration:calc(var(--vibeui-toast-001-duration,5) * 1s);
}
@keyframes vibeui-toast-001-drain{from{transform:scaleX(1)}to{transform:scaleX(0)}}
[data-vibeui-block="toast-001"][data-tone="danger"]{--vibeui-toast-001-tone:light-dark(oklch(0.55 0.19 25),oklch(0.68 0.19 25))}
[data-vibeui-block="toast-001"][data-tone="neutral"]{--vibeui-toast-001-tone:light-dark(oklch(0.5 0 265),oklch(0.8 0 265))}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="toast-001"] *{animation:none!important;transition:none!important}
[data-vibeui-block="toast-001"] [data-part="timer"]{display:none}
}
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
 * Уведомление с полосой оставшегося времени и действием отмены.
 * Один файл, ноль зависимостей, собственная палитра.
 */
const TONE_LABELS: Record<Toast001Tone, string> = {
  neutral: "Сообщение",
  success: "Успешно",
  danger: "Ошибка",
}

export function Toast001({
  tone = "success",
  toneLabels = TONE_LABELS,
  title = "Страница опубликована",
  description = "Изменения уже видны по адресу проекта.",
  undoLabel = "Отменить",
  closeLabel = "Закрыть уведомление",
  duration = 5,
  background = "",
  onUndo,
  onClose,
  className,
  style,
  ...props
}: Toast001Props) {
  const palette = {
    "--vibeui-toast-001-duration": duration,
    ...(background
      ? {
          "--vibeui-toast-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-001"
        data-tone={tone}
        role={tone === "danger" ? "alert" : "status"}
        className={className}
        style={palette}
      >
        <span data-part="dot" aria-hidden="true" />
        <span data-part="sr">{toneLabels[tone]}</span>
        <span data-part="text">
          <span data-part="title">{title}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
        {undoLabel ? (
          <button data-part="undo" type="button" onClick={onUndo}>
            {undoLabel}
          </button>
        ) : null}
        <button
          data-part="close"
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
        >
          ×
        </button>
        {duration > 0 ? <span data-part="timer" aria-hidden="true" /> : null}
      </div>
    </>
  )
}

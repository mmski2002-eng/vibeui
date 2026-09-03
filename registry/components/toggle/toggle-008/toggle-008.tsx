"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toggle008Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  onHint?: string
  offHint?: string
  /** Пояснение под кнопкой. */
  note?: string
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: toggle с подсказкой о текущем состоянии. Подсказка живёт
// в разметке всегда и привязана через aria-describedby, поэтому её слышит
// скринридер, а не только видит курсор. Всплывает она и по наведению, и по
// фокусу: подсказка, доступная одной мыши, — это подсказка для половины людей.
const STYLES = `
:where([data-vibeui-block="toggle-008"]){
--vibeui-toggle-008-bg:transparent;
--vibeui-toggle-008-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-toggle-008-muted:color-mix(in oklab,var(--vibeui-toggle-008-fg) 68%,transparent);
--vibeui-toggle-008-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-toggle-008-accent:light-dark(oklch(0.55 0.16 25),oklch(0.72 0.15 25));
--vibeui-toggle-008-on:light-dark(oklch(0.99 0 0),oklch(0.18 0.014 265));
--vibeui-toggle-008-tip:light-dark(oklch(0.24 0.02 265),oklch(0.9 0.008 265));
--vibeui-toggle-008-tip-fg:light-dark(oklch(0.98 0 0),oklch(0.2 0.014 265));
--vibeui-toggle-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toggle-008"]{color-scheme:dark}
[data-vibeui-block="toggle-008"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;align-items:flex-start;
width:100%;max-width:20rem;padding:2.75rem 0.875rem 0.875rem;
border:1px solid var(--vibeui-toggle-008-border);border-radius:0.875rem;
background:var(--vibeui-toggle-008-bg);color:var(--vibeui-toggle-008-fg);
font-family:var(--vibeui-toggle-008-font);
}
[data-vibeui-block="toggle-008"] *{box-sizing:border-box}
[data-vibeui-block="toggle-008"] [data-part="anchor"]{position:relative;display:inline-flex}
[data-vibeui-block="toggle-008"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-toggle-008-border);border-radius:0.625rem;
background:var(--vibeui-toggle-008-bg);color:var(--vibeui-toggle-008-fg);
font-size:0.875rem;font-weight:600;line-height:1;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="toggle-008"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-008-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-008"] button[aria-pressed="true"]{
background:var(--vibeui-toggle-008-accent);border-color:var(--vibeui-toggle-008-accent);
color:var(--vibeui-toggle-008-on);
}
[data-vibeui-block="toggle-008"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:50%;flex:none;
background:var(--vibeui-toggle-008-muted);
}
[data-vibeui-block="toggle-008"] button[aria-pressed="true"] [data-part="dot"]{background:var(--vibeui-toggle-008-on)}
/* Подсказка лежит в потоке разметки и просто прячется: вынести её в title
   значило бы отдать текст браузеру — с клавиатуры он не показывается. */
[data-vibeui-block="toggle-008"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5rem);left:0;
max-width:15rem;padding:0.375rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-toggle-008-tip);color:var(--vibeui-toggle-008-tip-fg);
font-size:0.75rem;line-height:1.35;white-space:normal;
opacity:0;visibility:hidden;transform:translateY(0.25rem);
transition:opacity .14s ease,transform .14s ease,visibility .14s;
}
[data-vibeui-block="toggle-008"] [data-part="tip"]::after{
content:"";position:absolute;top:100%;left:0.875rem;
border:0.3125rem solid transparent;border-top-color:var(--vibeui-toggle-008-tip);
}
[data-vibeui-block="toggle-008"] button:hover + [data-part="tip"],
[data-vibeui-block="toggle-008"] button:focus-visible + [data-part="tip"]{
opacity:1;visibility:visible;transform:translateY(0);
}
[data-vibeui-block="toggle-008"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-toggle-008-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-008"] *{animation:none!important;transition:none!important}}
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
 * Toggle с подсказкой о текущем состоянии: она привязана через
 * aria-describedby и всплывает по наведению и по фокусу. Один файл.
 */
export function Toggle008({
  label = "Не беспокоить",
  onHint = "Сейчас уведомления скрыты до утра",
  offHint = "Сейчас уведомления приходят как обычно",
  note = "Подсказка объясняет состояние, а подпись кнопки не меняется.",
  defaultPressed = true,
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Toggle008Props) {
  const [pressed, setPressed] = useState(defaultPressed)
  const tipId = useId()

  const palette = {
    ...(accent ? { "--vibeui-toggle-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toggle-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toggle"
        data-vibeui-block="toggle-008"
        className={className}
        style={palette}
      >
        <span data-part="anchor">
          <button
            type="button"
            aria-pressed={pressed}
            aria-describedby={tipId}
            onClick={() => {
              setPressed(!pressed)
              onChange?.(!pressed)
            }}
          >
            <span data-part="dot" aria-hidden="true" />
            {label}
          </button>
          <span data-part="tip" id={tipId} role="tooltip">
            {pressed ? onHint : offHint}
          </span>
        </span>
        <p data-part="note">{note}</p>
      </div>
    </>
  )
}

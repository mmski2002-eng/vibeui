"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Switch013Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  description?: string
  /** Сколько миллисекунд «сохраняем» — столько же ждёт настоящий запрос. */
  delay?: number
  /** Подписи фаз записи: компонент несёт русские, проект подставляет свои. */
  statusText?: Record<string, string>
  /** Пусто — подложки нет, карточка держится рамкой на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: тот же честный цикл записи, что и у обычного
// переключателя с сохранением, но статус — не строка внутри карточки, а
// всплывающий значок-бейдж под тумблером. Пока идёт запись, бейдж со
// спиннером и словом «Сохраняем…» подрастает снизу; после ответа он на
// секунду превращается в зелёную галочку с «Сохранено» и растворяется сам.
const STYLES = `
:where([data-vibeui-block="switch-013"]){
--vibeui-switch-013-bg:transparent;
--vibeui-switch-013-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-switch-013-muted:color-mix(in oklab,var(--vibeui-switch-013-fg) 68%,transparent);
--vibeui-switch-013-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-switch-013-track:light-dark(oklch(0.88 0 265),oklch(0.43 0 265));
--vibeui-switch-013-thumb:light-dark(oklch(1 0 0),oklch(0.93 0 265));
--vibeui-switch-013-accent:light-dark(oklch(0.55 0.19 39.8),oklch(0.73 0.16 39.8));
--vibeui-switch-013-ok:light-dark(oklch(0.55 0.15 155),oklch(0.78 0.15 155));
--vibeui-switch-013-ok-tint:light-dark(oklch(0.55 0.15 155 / 12%),oklch(0.78 0.15 155 / 18%));
--vibeui-switch-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="switch-013"]{color-scheme:dark}
[data-vibeui-block="switch-013"]{
box-sizing:border-box;width:100%;max-width:21rem;padding:0.875rem;
background:var(--vibeui-switch-013-bg);
border:1px solid var(--vibeui-switch-013-border);border-radius:0.875rem;
font-family:var(--vibeui-switch-013-font);color:var(--vibeui-switch-013-fg);
}
[data-vibeui-block="switch-013"] [data-part="row"]{display:flex;align-items:center;gap:1rem;cursor:pointer}
[data-vibeui-block="switch-013"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="switch-013"] [data-part="label"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="switch-013"] [data-part="description"]{font-size:0.8125rem;line-height:1.4;color:var(--vibeui-switch-013-muted)}
[data-vibeui-block="switch-013"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-013"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:2.75rem;height:1.5rem;border-radius:9999px;
background:var(--vibeui-switch-013-track);cursor:inherit;
transition:background-color .18s ease;
}
[data-vibeui-block="switch-013"] input:checked{background:var(--vibeui-switch-013-accent)}
[data-vibeui-block="switch-013"] input:focus-visible{outline:2px solid var(--vibeui-switch-013-accent);outline-offset:2px}
[data-vibeui-block="switch-013"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
width:1.125rem;height:1.125rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-013-thumb);
box-shadow:0 1px 2px oklch(0.2 0 265 / 28%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-013"] input:checked + [data-part="thumb"]{transform:translateX(1.25rem)}
/* Бейдж-подсказка: не резервирует место в потоке — появляется отдельной
   строкой ниже и уезжает вместе с исчезновением, поэтому карточка временно
   растёт на время записи, а не держит пустую полосу постоянно. */
[data-vibeui-block="switch-013"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.375rem;
margin-top:0.625rem;padding:0.3125rem 0.625rem;border-radius:9999px;
font-size:0.75rem;font-weight:600;
background:color-mix(in oklab,var(--vibeui-switch-013-accent) 12%,transparent);
color:var(--vibeui-switch-013-accent);
animation:vibeui-switch-013-pop .18s ease-out;
}
[data-vibeui-block="switch-013"][data-state="saved"] [data-part="badge"]{
background:var(--vibeui-switch-013-ok-tint);color:var(--vibeui-switch-013-ok);
}
@keyframes vibeui-switch-013-pop{from{opacity:0;transform:translateY(-0.25rem)}to{opacity:1;transform:none}}
[data-vibeui-block="switch-013"] [data-part="spinner"]{
flex:none;width:0.75rem;height:0.75rem;border-radius:9999px;
border:1.5px solid color-mix(in oklab,var(--vibeui-switch-013-accent) 30%,transparent);
border-top-color:var(--vibeui-switch-013-accent);
animation:vibeui-switch-013-spin .7s linear infinite;
}
@keyframes vibeui-switch-013-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="switch-013"] [data-part="tick"]{
flex:none;width:0.375rem;height:0.6875rem;
border-right:1.5px solid var(--vibeui-switch-013-ok);
border-bottom:1.5px solid var(--vibeui-switch-013-ok);
transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATUS_TEXT: Record<string, string> = {
  saving: "Сохраняем…",
  saved: "Сохранено",
}

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
 * Переключатель со всплывающим бейджем сохранения: «Сохраняем…» → «Сохранено».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch013({
  label = "Автоматический бэкап",
  description = "Копия базы каждую ночь в 03:00.",
  delay = 900,
  statusText = DEFAULT_STATUS_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Switch013Props) {
  const id = useId()
  const [checked, setChecked] = useState(true)
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Таймеры снимаются при размонтировании: иначе setState зовут у
  // компонента, которого уже нет на странице.
  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-switch-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-switch-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="switch"
        data-vibeui-block="switch-013"
        data-state={state}
        className={className}
        style={palette}
      >
        <label data-part="row" htmlFor={id}>
          <span data-part="text">
            <span data-part="label">{label}</span>
            <span data-part="description">{description}</span>
          </span>
          <span data-part="track">
            <input
              id={id}
              type="checkbox"
              role="switch"
              checked={checked}
              onChange={(event) => {
                timers.current.forEach(clearTimeout)
                timers.current = []
                setChecked(event.target.checked)
                setState("saving")
                timers.current.push(
                  setTimeout(() => setState("saved"), delay),
                  setTimeout(() => setState("idle"), delay + 1600),
                )
              }}
            />
            <span data-part="thumb" aria-hidden="true" />
          </span>
        </label>
        {state !== "idle" ? (
          <span data-part="badge" role="status">
            {state === "saving" ? (
              <>
                <span data-part="spinner" aria-hidden="true" />
                {statusText.saving ?? DEFAULT_STATUS_TEXT.saving}
              </>
            ) : (
              <>
                <span data-part="tick" aria-hidden="true" />
                {statusText.saved ?? DEFAULT_STATUS_TEXT.saved}
              </>
            )}
          </span>
        ) : null}
      </div>
    </>
  )
}

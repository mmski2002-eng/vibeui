"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Banner011Entry = {
  id: string
  message: string
  /** Насколько срочно: от этого зависит порядок и цвет метки. */
  tone?: "critical" | "warning" | "info"
  actionLabel?: string
  actionHref?: string
}

export type Banner011Props = Omit<ComponentProps<"div">, "children"> & {
  entries?: Banner011Entry[]
  /** Сколько полос показывать сразу. Остальные ждут за счётчиком. */
  visible?: number
  /** Подпись счётчика. {count} — сколько скрыто. */
  moreTemplate?: string
  collapseLabel?: string
  accent?: string
  /** Пусто — подложки нет, стопка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: несколько полос одновременно. Поодиночке баннер решает
// задачу, а вчетвером — создаёт новую: шапка уезжает вниз, и человек листает
// объявления вместо работы. Здесь видна только самая срочная, остальные
// свёрнуты в счётчик и раскрываются по требованию. Порядок задаёт срочность,
// а не очередь появления: «нет сети» обязана быть выше «вышла новая версия».
// Свёрнутые полосы остаются в разметке — счётчик «ещё 2» не рассказывает, что
// именно скрыто, а скринридер должен получить весь список.
const STYLES = `
:where([data-vibeui-block="banner-011"]){
--vibeui-banner-011-bg:transparent;
--vibeui-banner-011-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-banner-011-muted:color-mix(in oklab,var(--vibeui-banner-011-fg) 68%,transparent);
--vibeui-banner-011-surface:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-banner-011-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-banner-011-accent:light-dark(oklch(0.28 0 0),oklch(0.91 0 0));
--vibeui-banner-011-critical:light-dark(oklch(0.55 0.19 25),oklch(0.76 0.16 25));
--vibeui-banner-011-warning:light-dark(oklch(0.62 0.14 75),oklch(0.82 0.13 75));
--vibeui-banner-011-info:var(--vibeui-banner-011-accent);
--vibeui-banner-011-radius:0.75rem;
--vibeui-banner-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="banner-011"]{color-scheme:dark}
[data-vibeui-block="banner-011"]{
display:flex;flex-direction:column;gap:0.375rem;
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
color:var(--vibeui-banner-011-fg);
font-family:var(--vibeui-banner-011-font);
}
[data-vibeui-block="banner-011"] *{box-sizing:border-box}
[data-vibeui-block="banner-011"] [data-part="row"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;
padding:0.6875rem 0.875rem;
background:var(--vibeui-banner-011-surface);
border:1px solid var(--vibeui-banner-011-border);
border-radius:var(--vibeui-banner-011-radius);
}
/* Срочность — полоской слева, а не заливкой всей строки: четыре цветных
   прямоугольника подряд перестают читаться как разные сообщения. */
[data-vibeui-block="banner-011"] [data-part="mark"]{
flex:none;width:0.1875rem;align-self:stretch;min-height:1.5rem;
border-radius:9999px;background:var(--vibeui-banner-011-info);
}
[data-vibeui-block="banner-011"] [data-tone="critical"] [data-part="mark"]{background:var(--vibeui-banner-011-critical)}
[data-vibeui-block="banner-011"] [data-tone="warning"] [data-part="mark"]{background:var(--vibeui-banner-011-warning)}
[data-vibeui-block="banner-011"] [data-part="message"]{
flex:1;min-width:0;font-size:0.875rem;line-height:1.35;
}
[data-vibeui-block="banner-011"] [data-part="action"]{
flex:none;color:var(--vibeui-banner-011-accent);
font-size:0.8125rem;font-weight:650;text-decoration:none;
}
[data-vibeui-block="banner-011"] [data-part="action"]:hover{text-decoration:underline}
[data-vibeui-block="banner-011"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-banner-011-accent);outline-offset:2px;border-radius:0.25rem;
}
/* Счётчик — кнопка на всю ширину: он продолжает стопку, а не висит сбоку
   отдельным элементом управления. */
[data-vibeui-block="banner-011"] [data-part="toggle"]{
appearance:none;cursor:pointer;width:100%;
padding:0.4375rem 0.875rem;
border:1px dashed var(--vibeui-banner-011-border);
border-radius:var(--vibeui-banner-011-radius);
background:transparent;color:var(--vibeui-banner-011-muted);
font:inherit;font-size:0.8125rem;font-weight:600;text-align:left;
}
[data-vibeui-block="banner-011"] [data-part="toggle"]:hover{color:var(--vibeui-banner-011-fg)}
[data-vibeui-block="banner-011"] [data-part="toggle"]:focus-visible{
outline:2px solid var(--vibeui-banner-011-accent);outline-offset:2px;
}
/* Свёрнутое остаётся в разметке: «ещё 2» не говорит, что именно скрыто. */
[data-vibeui-block="banner-011"] [data-part="row"][hidden]{
display:none;
}
@container (max-width: 26rem){
[data-vibeui-block="banner-011"] [data-part="action"]{width:calc(100% - 0.9375rem);margin-left:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Banner011Entry[] = [
  {
    id: "offline",
    message: "Нет связи с сервером — правки сохраняются в браузере.",
    tone: "critical",
    actionLabel: "Проверить сеть",
  },
  {
    id: "quota",
    message: "Осталось 8% дискового места: загрузка файлов скоро остановится.",
    tone: "warning",
    actionLabel: "Освободить место",
  },
  {
    id: "release",
    message: "Вышла версия 2.8 — обновите вкладку, когда будет удобно.",
    tone: "info",
    actionLabel: "Что нового",
  },
  {
    id: "survey",
    message: "Опрос о новом редакторе: три вопроса, две минуты.",
    tone: "info",
    actionLabel: "Ответить",
  },
]

// Срочность задаёт порядок, а не очередь появления: «нет сети» обязана стоять
// выше «вышла новая версия», даже если пришла позже.
const WEIGHT: Record<string, number> = { critical: 0, warning: 1, info: 2 }

/**
 * Стопка баннеров: видна самая срочная, остальные ждут за счётчиком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner011({
  entries = DEFAULT_ENTRIES,
  visible = 1,
  moreTemplate = "Ещё {count} сообщения",
  collapseLabel = "Свернуть",
  accent,
  background = "",
  className,
  style,
  ...props
}: Banner011Props) {
  const [open, setOpen] = useState(false)

  const ordered = [...entries].sort(
    (first, second) =>
      (WEIGHT[first.tone ?? "info"] ?? 2) -
      (WEIGHT[second.tone ?? "info"] ?? 2),
  )
  const shown = Math.max(1, visible)
  const hidden = Math.max(0, ordered.length - shown)

  const palette = {
    ...(accent ? { "--vibeui-banner-011-accent": accent } : null),
    ...(background ? { "--vibeui-banner-011-surface": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-banner-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="banner"
        data-vibeui-block="banner-011"
        role="region"
        aria-label={ordered[0]?.message}
        className={className}
        style={palette}
      >
        {ordered.map((entry, index) => (
          <div
            key={entry.id}
            data-part="row"
            data-tone={entry.tone ?? "info"}
            // Скрытые строки остаются в разметке: счётчик не рассказывает,
            // что именно свёрнуто, а скринридер должен получить весь список.
            hidden={!open && index >= shown}
          >
            <span data-part="mark" aria-hidden="true" />
            <span data-part="message">{entry.message}</span>
            {entry.actionLabel ? (
              <a data-part="action" href={entry.actionHref ?? "#"}>
                {entry.actionLabel}
              </a>
            ) : null}
          </div>
        ))}

        {hidden > 0 ? (
          <button
            type="button"
            data-part="toggle"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open
              ? collapseLabel
              : moreTemplate.replace("{count}", String(hidden))}
          </button>
        ) : null}
      </div>
    </>
  )
}

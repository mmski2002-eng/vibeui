"use client"

import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Hovercard007Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Показать карточку раскрытой прямо в потоке: витрина, скриншот, отладка.
   * Ссылка остаётся на месте, задержка в этом режиме не отсчитывается.
   */
  open?: boolean
  label?: string
  title?: string
  text?: string
  /** Задержка перед раскрытием в секундах: уход курсора отменяет её. */
  delay?: number
  /** Текст строки до ссылки. */
  leadText?: string
  /** Текст строки после ссылки. */
  tailText?: string
  /** Подпись внизу карточки: на месте {delay} встаёт время ожидания. */
  hintText?: string
  /** Сокращение единицы времени рядом с задержкой. */
  delayUnit?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: карточка с намерением. Пока курсор стоит на ссылке, снизу
// растёт тонкая полоска ожидания, и только потом раскрывается карточка. Уход
// курсора обнуляет и полоску, и задержку — пролёт мышью ничего не открывает.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// тёмной темы у компонента нет, он следует за страницей.
const STYLES = `
:where([data-vibeui-block="hovercard-007"]){
--vibeui-hovercard-007-bg:transparent;
--vibeui-hovercard-007-card:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-hovercard-007-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-hovercard-007-muted:color-mix(in oklab,var(--vibeui-hovercard-007-fg) 68%,transparent);
--vibeui-hovercard-007-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-hovercard-007-accent:light-dark(oklch(0.287 0 0),oklch(0.906 0 0));
--vibeui-hovercard-007-delay:0.45s;
--vibeui-hovercard-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hovercard-007"]{color-scheme:dark}
[data-vibeui-block="hovercard-007"]{
width:100%;max-width:28rem;box-sizing:border-box;
padding:1rem 1.125rem;
border:1px solid var(--vibeui-hovercard-007-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-007-bg);
font-family:var(--vibeui-hovercard-007-font);color:var(--vibeui-hovercard-007-fg);
}
[data-vibeui-block="hovercard-007"] [data-part="line"]{margin:0;font-size:0.875rem;line-height:1.7}
/* Ожидание и карточка привязаны к ссылке в строке, а не ко всему абзацу. */
[data-vibeui-block="hovercard-007"] [data-part="host"]{position:relative;display:inline-block;anchor-name:--vibeui-hovercard-007-anchor}
[data-vibeui-block="hovercard-007"] [data-part="link"]{
position:relative;display:inline-block;
color:var(--vibeui-hovercard-007-accent);font-weight:640;text-decoration:none;
border-bottom:1px solid color-mix(in oklab,var(--vibeui-hovercard-007-accent) 40%,transparent);
}
[data-vibeui-block="hovercard-007"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-hovercard-007-accent);outline-offset:2px;border-radius:0.25rem}
/* Полоска ожидания: растёт ровно столько, сколько длится задержка. */
[data-vibeui-block="hovercard-007"] [data-part="link"]::after{
content:"";position:absolute;left:0;bottom:-1px;height:2px;width:100%;
transform-origin:left center;transform:scaleX(0);
background:var(--vibeui-hovercard-007-accent);
transition:transform var(--vibeui-hovercard-007-delay) linear;color:oklch(from var(--vibeui-hovercard-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="hovercard-007"] [data-part="host"]:hover [data-part="link"]::after,
[data-vibeui-block="hovercard-007"] [data-part="host"]:focus-within [data-part="link"]::after{transform:scaleX(1)}
[data-vibeui-block="hovercard-007"] [data-part="card"]{
/* fixed с привязкой к якорю: absolute режет рамка карточки каталога,
   а фиксированный слой её не замечает. */
position:fixed;inset:auto;position-anchor:--vibeui-hovercard-007-anchor;
top:anchor(bottom);left:anchor(left);margin-top:0.5rem;z-index:20;
display:flex;flex-direction:column;gap:0.375rem;
width:17rem;box-sizing:border-box;padding:0.8125rem 0.875rem;
border:1px solid var(--vibeui-hovercard-007-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-007-card);
box-shadow:0 22px 46px -28px oklch(0.2 0 265 / 55%);
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .14s ease 0s,translate .14s ease 0s,visibility .14s 0s;
}
@supports not (anchor-name: --a){
[data-vibeui-block="hovercard-007"] [data-part="card"]{position:absolute;inset:auto;left:0;top:calc(100% + 0.5rem);margin-top:0}
}
/* Задержка стоит только в открытом состоянии: уход курсора отменяет её. */
[data-vibeui-block="hovercard-007"] [data-part="host"]:hover [data-part="card"],
[data-vibeui-block="hovercard-007"] [data-part="host"]:focus-within [data-part="card"]{
opacity:1;visibility:visible;translate:0 0;
transition-delay:var(--vibeui-hovercard-007-delay);
}
/* На узком экране якорь — не узкая ссылка в строке, а весь блок: иначе
   карточка шириной 17rem вылезает за правый край страницы. */
@media (max-width:32rem){
[data-vibeui-block="hovercard-007"]{position:relative}
[data-vibeui-block="hovercard-007"] [data-part="host"]{position:static}
[data-vibeui-block="hovercard-007"] [data-part="card"]{left:0;right:0;width:auto}
}
[data-vibeui-block="hovercard-007"] [data-part="title"]{font-size:0.875rem;font-weight:660;line-height:1.3}
[data-vibeui-block="hovercard-007"] [data-part="text"]{display:block;margin:0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-hovercard-007-muted)}
[data-vibeui-block="hovercard-007"] [data-part="hint"]{
padding-top:0.375rem;border-top:1px solid var(--vibeui-hovercard-007-border);
font-size:0.6875rem;color:var(--vibeui-hovercard-007-muted);
}
[data-vibeui-block="hovercard-007"] [data-part="hint"] b{color:var(--vibeui-hovercard-007-fg);font-weight:650;font-variant-numeric:tabular-nums}
/* Витринный режим: карточка стоит в потоке под ссылкой, а не поверх текста —
   иначе на миниатюре каталога от компонента видна одна строка. Полоска
   ожидания залита сразу: отсчитывать нечего, карточка уже раскрыта. */
[data-vibeui-block="hovercard-007"][data-open="true"] [data-part="host"]{display:block}
[data-vibeui-block="hovercard-007"][data-open="true"] [data-part="link"]::after{transform:scaleX(1)}
[data-vibeui-block="hovercard-007"][data-open="true"] [data-part="card"]{
position:static;opacity:1;visibility:visible;translate:0;
margin-top:0.5rem;max-width:100%;transition-delay:0s;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hovercard-007"] *{animation:none!important;transition:none!important}}
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
 * Escape убирает фокус с триггера. Карточка держится на :focus-within,
 * поэтому снятого фокуса достаточно, чтобы закрыть её с клавиатуры.
 */
function closeOnEscape(event: KeyboardEvent<HTMLElement>) {
  if (event.key === "Escape") {
    ;(event.target as HTMLElement).blur()
  }
}

/**
 * Карточка с задержкой раскрытия: полоска ожидания и отмена при уходе курсора.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Hovercard007({
  open = false,
  label = "тарифы на хранение",
  title = "Хранение файлов",
  text = "Первые 50 ГБ входят в любой тариф. Дальше считаем по 4 ₽ за гигабайт в месяц, округляя вниз до целого.",
  delay = 0.45,
  leadText = "Подробности смотрите в разделе ",
  tailText = " — проведите курсором мимо, карточка не откроется.",
  hintText = "карточка раскроется через {delay} наведения",
  delayUnit = "с",
  accent,
  background = "",
  className,
  style,
  ...props
}: Hovercard007Props) {
  const palette = {
    "--vibeui-hovercard-007-delay": `${delay}s`,
    ...(accent ? { "--vibeui-hovercard-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hovercard-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const [hintBefore, hintAfter = ""] = hintText.split("{delay}")

  return (
    <>
      <style href="vibeui-hovercard-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="hover-card"
        onKeyDown={closeOnEscape}
        data-vibeui-block="hovercard-007"
        data-open={open || undefined}
        className={className}
        style={palette}
      >
        <p data-part="line">
          {leadText}
          <span data-part="host">
            <a
              data-part="link"
              href="#pricing"
              aria-describedby="vibeui-hovercard-007-card"
            >
              {label}
            </a>
            <span
              data-part="card"
              id="vibeui-hovercard-007-card"
              role="tooltip"
            >
              <span data-part="title">{title}</span>
              <span data-part="text">{text}</span>
              <span data-part="hint">
                {hintBefore}
                <b>
                  {delay}&nbsp;{delayUnit}
                </b>
                {hintAfter}
              </span>
            </span>
          </span>
          {tailText}
        </p>
      </div>
    </>
  )
}

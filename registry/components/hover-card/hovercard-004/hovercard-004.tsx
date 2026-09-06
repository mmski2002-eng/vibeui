"use client"

import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Hovercard004Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Показать карточку раскрытой прямо в потоке: витрина, скриншот, отладка.
   * Ссылка владелец/имя остаётся на месте, карточка встаёт под ней.
   */
  open?: boolean
  owner?: string
  repo?: string
  about?: string
  language?: string
  /** Цвет точки языка: у каждого языка он свой и узнаваемый. */
  languageColor?: string
  stars?: string
  forks?: string
  /** Текст строки до ссылки. */
  leadText?: string
  /** Текст строки после ссылки. */
  tailText?: string
  /** Подпись у счётчика звёзд. */
  starsLabel?: string
  /** Подпись у счётчика форков. */
  forksLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: карточка репозитория у ссылки вида владелец/имя. Владелец
// набран тонко, имя — жирно: так пара читается одним взглядом. Язык помечен
// точкой и словом, потому что цветная точка без подписи ничего не говорит.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// тёмной темы у компонента нет, он следует за страницей.
const STYLES = `
:where([data-vibeui-block="hovercard-004"]){
--vibeui-hovercard-004-bg:transparent;
--vibeui-hovercard-004-card:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-hovercard-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-hovercard-004-muted:color-mix(in oklab,var(--vibeui-hovercard-004-fg) 68%,transparent);
--vibeui-hovercard-004-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-hovercard-004-accent:light-dark(oklch(0.5 0.16 260),oklch(0.76 0.13 260));
--vibeui-hovercard-004-lang:oklch(0.72 0.15 85);
--vibeui-hovercard-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hovercard-004-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hovercard-004"]{color-scheme:dark}
[data-vibeui-block="hovercard-004"]{
width:100%;max-width:28rem;box-sizing:border-box;
padding:1rem 1.125rem;
border:1px solid var(--vibeui-hovercard-004-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-004-bg);
font-family:var(--vibeui-hovercard-004-font);color:var(--vibeui-hovercard-004-fg);
}
[data-vibeui-block="hovercard-004"] [data-part="line"]{margin:0;font-size:0.875rem;line-height:1.7}
/* Карточка цепляется к паре владелец/имя, а не ко всему абзацу. */
[data-vibeui-block="hovercard-004"] [data-part="host"]{position:relative;display:inline-block;anchor-name:--vibeui-hovercard-004-anchor}
[data-vibeui-block="hovercard-004"] [data-part="link"]{
font-family:var(--vibeui-hovercard-004-mono);font-size:0.9375em;
color:var(--vibeui-hovercard-004-accent);text-decoration:none;
border-bottom:1px solid color-mix(in oklab,var(--vibeui-hovercard-004-accent) 35%,transparent);
border-radius:0.125rem;
}
[data-vibeui-block="hovercard-004"] [data-part="link"]:hover{border-bottom-color:var(--vibeui-hovercard-004-accent)}
[data-vibeui-block="hovercard-004"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-hovercard-004-accent);outline-offset:2px}
/* Карточка центрирована по ссылке, а не прижата к её левому краю: сама
   ссылка может стоять где угодно в строке, и левый край карточки на узкой
   странице легко уводит её за правый край. */
[data-vibeui-block="hovercard-004"] [data-part="card"]{
/* fixed с привязкой к якорю: absolute режет рамка карточки каталога,
   а фиксированный слой её не замечает. */
position:fixed;inset:auto;position-anchor:--vibeui-hovercard-004-anchor;
top:anchor(bottom);left:anchor(center);margin-top:0.5rem;z-index:20;
display:flex;flex-direction:column;gap:0.4375rem;
width:18rem;max-width:calc(100vw - 2rem);box-sizing:border-box;padding:0.875rem;
border:1px solid var(--vibeui-hovercard-004-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-004-card);
box-shadow:0 22px 46px -28px oklch(0.2 0 265 / 55%);
opacity:0;visibility:hidden;translate:-50% -0.25rem;
transition:opacity .15s ease,translate .15s ease,visibility .15s;
}
@supports not (anchor-name: --a){
[data-vibeui-block="hovercard-004"] [data-part="card"]{position:absolute;inset:auto;left:50%;top:calc(100% + 0.5rem);margin-top:0}
}
[data-vibeui-block="hovercard-004"] [data-part="host"]:hover [data-part="card"],
[data-vibeui-block="hovercard-004"] [data-part="host"]:focus-within [data-part="card"]{opacity:1;visibility:visible;translate:-50% 0}
/* Владелец тонкий, имя жирное: пара читается как одно целое. */
[data-vibeui-block="hovercard-004"] [data-part="path"]{font-size:0.9375rem;line-height:1.25;letter-spacing:-0.01em}
[data-vibeui-block="hovercard-004"] [data-part="owner"]{color:var(--vibeui-hovercard-004-muted);font-weight:450}
[data-vibeui-block="hovercard-004"] [data-part="repo"]{font-weight:700}
[data-vibeui-block="hovercard-004"] [data-part="about"]{display:block;margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-hovercard-004-muted)}
[data-vibeui-block="hovercard-004"] [data-part="meta"]{
display:flex;align-items:center;gap:0.875rem;flex-wrap:wrap;
font-size:0.75rem;color:var(--vibeui-hovercard-004-muted);
}
[data-vibeui-block="hovercard-004"] [data-part="lang"]{display:inline-flex;align-items:center;gap:0.3125rem}
[data-vibeui-block="hovercard-004"] [data-part="bullet"]{
width:0.625rem;height:0.625rem;border-radius:9999px;flex:none;
background:var(--vibeui-hovercard-004-lang);
box-shadow:inset 0 0 0 1px oklch(0 0 0 / 10%);
}
[data-vibeui-block="hovercard-004"] [data-part="stat"]{display:inline-flex;align-items:center;gap:0.25rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="hovercard-004"] [data-part="stat"] b{color:var(--vibeui-hovercard-004-fg);font-weight:650}
/* Витринный режим: карточка стоит в потоке под ссылкой, а не поверх текста —
   иначе на миниатюре каталога от компонента видна одна строка. Обёртка
   становится блоком, чтобы карточка не разрывала строку по вертикали. */
[data-vibeui-block="hovercard-004"][data-open="true"] [data-part="host"]{display:block}
[data-vibeui-block="hovercard-004"][data-open="true"] [data-part="card"]{
position:static;opacity:1;visibility:visible;translate:0;
margin-top:0.5rem;max-width:100%;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hovercard-004"] *{animation:none!important;transition:none!important}}
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
 * Карточка репозитория у ссылки владелец/имя: описание, язык и счётчики.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Hovercard004({
  open = false,
  owner = "vibeui",
  repo = "registry",
  about = "Каталог самодостаточных React-компонентов: один файл, своя палитра, ноль зависимостей.",
  language = "TypeScript",
  languageColor = "oklch(0.62 0.14 250)",
  stars = "3.1k",
  forks = "214",
  leadText = "Исходники лежат в ",
  tailText = " — наведите, чтобы не открывать вкладку ради описания.",
  starsLabel = "звёзд",
  forksLabel = "форков",
  accent,
  background = "",
  className,
  style,
  ...props
}: Hovercard004Props) {
  const palette = {
    "--vibeui-hovercard-004-lang": languageColor,
    ...(accent ? { "--vibeui-hovercard-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hovercard-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hovercard-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="hover-card"
        onKeyDown={closeOnEscape}
        data-vibeui-block="hovercard-004"
        data-open={open || undefined}
        className={className}
        style={palette}
      >
        <p data-part="line">
          {leadText}
          <span data-part="host">
            <a
              data-part="link"
              href="#repo"
              aria-describedby="vibeui-hovercard-004-card"
            >
              {owner}/{repo}
            </a>
            <span
              data-part="card"
              id="vibeui-hovercard-004-card"
              role="tooltip"
            >
              <span data-part="path">
                <span data-part="owner">{owner}/</span>
                <span data-part="repo">{repo}</span>
              </span>
              <span data-part="about">{about}</span>
              <span data-part="meta">
                <span data-part="lang">
                  <span data-part="bullet" aria-hidden="true" />
                  {language}
                </span>
                <span data-part="stat">
                  <span aria-hidden="true">★</span> <b>{stars}</b> {starsLabel}
                </span>
                <span data-part="stat">
                  <span aria-hidden="true">⑂</span> <b>{forks}</b> {forksLabel}
                </span>
              </span>
            </span>
          </span>
          {tailText}
        </p>
      </div>
    </>
  )
}

import type { CSSProperties } from "react"
import { Card077 } from "@/registry/components/card/card-077/card-077"

export type Bento011Kind = "geocode" | "reverse" | "route" | "suggest" | "matrix" | "batch"

export type Bento011Item = {
  method?: "GET" | "POST"
  path: string
  title: string
  text: string
  /** Подпись справа внизу: «p50 · 42 ms». */
  meta?: string
  /** Какое микродемо рисовать в плитке. */
  kind: Bento011Kind
  /** Плитка на две колонки от 60rem контейнера. */
  wide?: boolean
}

export type Bento011Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Bento011Item[]
  /** Тексты на макетах: адрес, расстояние, ввод подсказки и три подсказки. */
  demoAddress?: string
  demoDistance?: string
  demoQuery?: string
  demoSuggestions?: readonly [string, string, string]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Эндпоинты bento-плитками: у каждой чип метода, путь моноширинным и
// своё микродемо на чистом CSS — булавка падает на сетку (geocode),
// прицел и строки адреса (reverse), полилиния рисуется штрихом (route),
// подсказки печатаются под полем (suggest), тепловая сетка дышит
// (matrix), полосы пакетной загрузки заполняются (batch). Плитки разного
// размера, широкая занимает две колонки. Без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="bento-011"]){
--vibeui-bento-011-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bento-011-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-011-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-011-on-accent:oklch(from var(--vibeui-bento-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-bento-011-muted:color-mix(in oklab,var(--vibeui-bento-011-fg) 60%,var(--vibeui-bento-011-bg));
--vibeui-bento-011-line:color-mix(in oklab,var(--vibeui-bento-011-fg) 12%,transparent);
--vibeui-bento-011-panel:color-mix(in oklab,var(--vibeui-bento-011-fg) 4%,var(--vibeui-bento-011-bg));
--vibeui-bento-011-dots:radial-gradient(color-mix(in oklab,var(--vibeui-bento-011-fg) 16%,transparent) 1px,transparent 1.5px);
--vibeui-bento-011-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-011-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-011"]{color-scheme:dark}
:where([data-vibeui-block="bento-011"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bento-011"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bento-011"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-bento-011-bg);color:var(--vibeui-bento-011-fg);font-family:var(--vibeui-bento-011-display);font-size:1rem;line-height:1.5}
[data-vibeui-block="bento-011"] *{box-sizing:border-box}
[data-vibeui-block="bento-011"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bento-011"] [data-part="head"]{max-width:42rem;margin:0 0 2.2rem}
[data-vibeui-block="bento-011"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-bento-011-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-bento-011-accent)}
[data-vibeui-block="bento-011"] [data-part="eyebrow"]::before{content:"// "}
[data-vibeui-block="bento-011"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em}
[data-vibeui-block="bento-011"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-bento-011-muted)}
[data-vibeui-block="bento-011"] [data-part="grid"]{display:grid;gap:.9rem;margin:0;padding:0;list-style:none}
@keyframes vibeui-bento-011-drop{0%,8%{transform:translateY(-2.4rem) scale(.6);opacity:0}22%,80%{transform:none;opacity:1}100%{transform:none;opacity:0}}
@keyframes vibeui-bento-011-ring{0%,22%{transform:scale(.4);opacity:0}30%{opacity:1}70%,100%{transform:scale(1.6);opacity:0}}
@keyframes vibeui-bento-011-fade{0%,28%{opacity:0;transform:translateY(4px)}38%,85%{opacity:1;transform:none}100%{opacity:0}}
@keyframes vibeui-bento-011-pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.15);opacity:1}}
@keyframes vibeui-bento-011-grow{0%{transform:scaleX(0)}35%,80%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes vibeui-bento-011-draw{0%{stroke-dashoffset:400}50%,80%{stroke-dashoffset:0}100%{stroke-dashoffset:-400}}
@keyframes vibeui-bento-011-type{0%,10%{width:0}60%,100%{width:6ch}}
@keyframes vibeui-bento-011-blink{to{visibility:hidden}}
@keyframes vibeui-bento-011-item{0%,45%{opacity:0;transform:translateY(-4px)}55%,90%{opacity:1;transform:none}100%{opacity:0}}
@keyframes vibeui-bento-011-cell{0%,100%{opacity:.1}50%{opacity:.85}}
@keyframes vibeui-bento-011-fill{0%{transform:scaleX(0)}55%,85%{transform:scaleX(1)}100%{transform:scaleX(1);opacity:0}}
@container (min-width: 40rem){[data-vibeui-block="bento-011"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 60rem){[data-vibeui-block="bento-011"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-011"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ITEMS: Bento011Item[] = [
  { method: "GET", path: "/v2/geocode", title: "Прямое геокодирование", text: "Строка адреса в любом виде — с опечатками, сокращениями, без индекса — превращается в координаты дома и нормализованный адрес.", meta: "p50 · 42 ms", kind: "geocode", wide: true },
  { method: "GET", path: "/v2/reverse", title: "Обратное геокодирование", text: "Координаты → ближайший адрес, район, почтовый индекс и тип объекта.", meta: "p50 · 39 ms", kind: "reverse" },
  { method: "POST", path: "/v2/route", title: "Маршруты", text: "Авто, пешком, велосипед: геометрия, расстояние, время с пробками.", meta: "p50 · 110 ms", kind: "route" },
  { method: "GET", path: "/v2/suggest", title: "Подсказки адресов", text: "Автодополнение по первым буквам для форм доставки и регистрации.", meta: "p50 · 24 ms", kind: "suggest" },
  { method: "POST", path: "/v2/matrix", title: "Матрица расстояний", text: "До 100 × 100 точек за один запрос — для логистики и выбора ближайшего склада.", meta: "p50 · 180 ms", kind: "matrix" },
  { method: "POST", path: "/v2/batch", title: "Пакетная обработка", text: "Загрузите файл на миллион адресов — вернём геокодированный CSV.", meta: "≈ 12 мин на 1 000 000", kind: "batch" },
]


/** Эндпоинты API bento-плитками с CSS-микродемо. */
export function Bento011({
  eyebrow = "Эндпоинты",
  title = "Шесть методов, один ключ",
  lede = "Всё, что нужно доставке, картам и логистике. Один формат ответа, одна авторизация, одинаковая документация.",
  items = DEFAULT_ITEMS,
  demoAddress = "«Тверская 7, мск»",
  demoDistance = "7,4 км · 18 мин",
  demoQuery = "Тверск",
  demoSuggestions = ["Тверская улица, Москва", "Тверская-Ямская 1-я улица", "Тверской бульвар"],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bento011Props) {
  const palette = {
    ...(accent ? { "--vibeui-bento-011-accent": accent } : null),
    ...(ink ? { "--vibeui-bento-011-fg": ink } : null),
    ...(background ? { "--vibeui-bento-011-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bento-011" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="bento-011" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="grid">
            {items.map((item) => (
              <Card077 key={item.path} data-part="tile" path={item.path} wide={item.wide} method={item.method} kind={item.kind} title={item.title} text={item.text} meta={item.meta} demoAddress={demoAddress} demoDistance={demoDistance} demoQuery={demoQuery} demoSuggestions={demoSuggestions} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

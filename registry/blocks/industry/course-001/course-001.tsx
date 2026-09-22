"use client"

import { useState, type CSSProperties } from "react"
import type { ComponentProps } from "react"

export type Course001Persona = {
  /** Короткая подпись плитки: «Начинаю с нуля». */
  label: string
  /** Гигантский знак на плитке: «0», «→», «PM». */
  glyph?: string
  title: string
  text: string
  outcomes: readonly string[]
  note?: string
}

export type Course001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  personas?: readonly Course001Persona[]
  outcomesLabel?: string
  /** aria плиток персон. */
  tilesLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Для кого»: три плитки в ряд с гигантским знаком на фоне. Выбранная
// раздвигается (flex-grow 3) и показывает описание и список результатов,
// остальные сжимаются до подписи — горизонтальный аккордеон. Переключение
// по клику и по наведению, на клавиатуре — кнопки role=tab. На узком
// экране плитки встают в колонку, раскрытая растёт по высоте.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="course-001"]){
--vibeui-course-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-course-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-course-001-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-course-001-card:light-dark(#f8fafc,#242424);
--vibeui-course-001-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-course-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-course-001-on-accent:oklch(from var(--vibeui-course-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-course-001-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-course-001-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-course-001-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="course-001"]{color-scheme:dark}
:where([data-vibeui-block="course-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="course-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="course-001"]{box-sizing:border-box;display:block;background:var(--vibeui-course-001-bg);color:var(--vibeui-course-001-fg);font-family:var(--vibeui-course-001-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="course-001"] *{box-sizing:border-box}
[data-vibeui-block="course-001"] [data-part="tile"]{flex:1 1 0}
[data-vibeui-block="course-001"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="course-001"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem 3rem;margin-bottom:2rem}
[data-vibeui-block="course-001"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-course-001-accent);font-weight:700}
[data-vibeui-block="course-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-course-001-display);font-weight:700;font-size:clamp(1.8rem,3.6cqi,2.75rem);line-height:1.1;letter-spacing:-.02em;max-width:22ch}
[data-vibeui-block="course-001"] [data-part="lede"]{margin:0;max-width:26rem;color:var(--vibeui-course-001-muted)}
[data-vibeui-block="course-001"] [data-part="tiles"]{display:flex;flex-direction:column;gap:.75rem;margin:0;padding:0;list-style:none}
@keyframes vibeui-course-001-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@container (min-width: 56rem){
[data-vibeui-block="course-001"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="course-001"] [data-part="tiles"]{flex-direction:row;height:26rem;gap:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="course-001"] *{animation:none!important;transition:none!important}}
@keyframes vibeui-course-001-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
[data-vibeui-block="course-001"] [data-part="tile"]{position:relative;flex:1 1 0;min-height:5.5rem;overflow:hidden;border-radius:1.25rem;border:1px solid var(--vibeui-course-001-line);background:var(--vibeui-course-001-card);transition:flex-grow .6s cubic-bezier(.2,.8,.2,1),background .4s,border-color .4s,min-height .6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="course-001"] [data-part="tile"][data-open="true"]{flex-grow:3;min-height:22rem;background:var(--vibeui-course-001-fg);color:var(--vibeui-course-001-bg);border-color:var(--vibeui-course-001-fg)}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="glyph"]{position:absolute;right:-.1em;bottom:-.25em;font-family:var(--vibeui-course-001-display);font-size:clamp(6rem,18cqi,12rem);font-weight:700;line-height:1;letter-spacing:-.05em;color:var(--vibeui-course-001-accent);opacity:.12;pointer-events:none;transition:opacity .4s,transform .6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="course-001"] [data-part="tile"][data-open="true"] [data-part="glyph"]{opacity:.22;transform:translate(-4%,0) scale(1.1)}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="tab"]{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:flex-end;width:100%;height:100%;min-height:inherit;padding:1.25rem;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-course-001-accent);outline-offset:-4px;border-radius:1.25rem}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="label"]{display:flex;align-items:center;gap:.6rem;font-family:var(--vibeui-course-001-display);font-size:1rem;font-weight:600;line-height:1.2}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="label"]::before{content:"";width:.6rem;height:.6rem;border-radius:50%;border:2px solid var(--vibeui-course-001-accent);transition:background .3s}
[data-vibeui-block="course-001"] [data-part="tile"][data-open="true"] [data-part="label"]::before{background:var(--vibeui-course-001-accent)}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="body"]{position:relative;z-index:1;display:grid;gap:.9rem;padding:0 1.25rem 1.25rem;animation:vibeui-course-001-in .5s .15s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="note"]{display:inline-block;justify-self:start;padding:.3rem .65rem;border-radius:.5rem;background:var(--vibeui-course-001-marker);color:#1a2e05;font-family:var(--vibeui-course-001-display);font-size:.72rem;font-weight:600}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="card-title"]{margin:0;font-family:var(--vibeui-course-001-display);font-size:1.25rem;font-weight:600;line-height:1.2}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="text"]{margin:0;opacity:.75;max-width:34rem}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="outcomes-label"]{margin:.25rem 0 0;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;opacity:.6;font-weight:700}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="outcomes"]{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="outcomes"] li{display:flex;gap:.65rem;align-items:flex-start;animation:vibeui-course-001-in .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(.25s + var(--vibeui-course-001-n) * 70ms)}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="outcomes"] li::before{content:"";flex:none;width:1.2rem;height:1.2rem;margin-top:.1rem;border-radius:50%;background:var(--vibeui-course-001-accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 10.5l3 3 6-6' fill='none' stroke='%23fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/100% no-repeat}
@container (min-width: 56rem){
[data-vibeui-block="course-001"] [data-part="tile"][data-open="true"]{min-height:0}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="tab"]{padding:1.5rem}
[data-vibeui-block="course-001"] [data-part="tile"][data-open="true"] [data-part="tab"]{height:auto;min-height:0;padding-bottom:.5rem}
[data-vibeui-block="course-001"] [data-part="tile"] [data-part="body"]{padding:0 1.5rem 1.5rem}
[data-vibeui-block="course-001"] [data-part="tile"]:not([data-open="true"]) [data-part="label"]{writing-mode:vertical-rl;transform:rotate(180deg);align-self:flex-start}
[data-vibeui-block="course-001"] [data-part="tile"]:not([data-open="true"]) [data-part="label"]::before{transform:rotate(180deg)}
}
`

const DEFAULT_PERSONAS: Course001Persona[] = [
  { label: "Начинаю с нуля", glyph: "0", title: "Вы никогда не открывали Figma", text: "Хотите в дизайн интерфейсов, но не знаете, с чего начать. Начнём с сетки и компонентов и за шесть недель дойдём до прототипа, который не стыдно показать.", outcomes: ["Три экрана мобильного приложения по гайдлайнам", "Компоненты и автолейаут без страха", "Первый проект в портфолио с разбором куратора"], note: "с нуля до первого проекта" },
  { label: "Из графического дизайна", glyph: "→", title: "Умеете рисовать, но не интерфейсы", text: "Знаете композицию и типографику, а в продуктовой команде теряетесь: состояния, потоки, дизайн-системы. Переведём навык в продукт.", outcomes: ["Дизайн-система с токенами и вариантами", "Прототип с логикой и состояниями ошибок", "Портфолио под вакансии продуктового дизайнера"], note: "переход за 6 недель" },
  { label: "Продакт без рук", glyph: "PM", title: "Ставите задачи дизайнерам", text: "Хотите сами собирать прототипы для гипотез и говорить с командой на одном языке, не дожидаясь очереди в дизайн.", outcomes: ["Кликабельный прототип гипотезы за вечер", "Понимаете ограничения и сроки дизайна", "Читаете макеты и даёте точную обратную связь"], note: "прототип за вечер" },
]

type TileProps = Omit<ComponentProps<"li">, "title" | "children"> & {
  label?: string
  glyph?: string
  note?: string
  title?: string
  text?: string
  outcomes?: readonly string[]
  outcomesLabel?: string
  open?: boolean
  setActive?: (index: number) => void
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function Tile({
  label = "Начинаю с нуля",
  glyph,
  note,
  title = "Вы никогда не открывали Figma",
  text = "Хотите в дизайн интерфейсов, но не знаете, с чего начать. Начнём с сетки и компонентов и за шесть недель дойдём до прототипа, который не стыдно показать.",
  outcomes = ["Три экрана мобильного приложения по гайдлайнам", "Компоненты и автолейаут без страха", "Первый проект в портфолио с разбором куратора"],
  outcomesLabel = "Что получите",
  open,
  setActive,
  index = 0,
  accent,
  className,
  style,
  ...props
}: TileProps) {
  const palette = {
    ...(accent ? { "--vibeui-course-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <li
        {...props} data-open={open}
        className={className}
        style={palette}
      >
        <span data-part="glyph" aria-hidden="true">
          {glyph ?? String(index + 1)}
        </span>
        <button type="button" role="tab" data-part="tab" aria-selected={open} onClick={() => setActive?.(index)} onFocus={() => setActive?.(index)}>
          <span data-part="label">{label}</span>
        </button>
        {open ? (
          <div data-part="body" role="tabpanel">
            {note ? <span data-part="note">{note}</span> : null}
            <h3 data-part="card-title">{title}</h3>
            <p data-part="text">{text}</p>
            {outcomesLabel ? <p data-part="outcomes-label">{outcomesLabel}</p> : null}
            <ul data-part="outcomes">
              {outcomes.map((outcome, n) => (
                <li key={outcome} style={{ ["--vibeui-course-001-n" as string]: n }}>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </li>
  )
}

/** «Для кого»: плитки-персоны, выбранная раздвигается и показывает результаты. */
export function Course001({
  eyebrow = "Для кого",
  title = "Курс подстраивается под то, откуда вы приходите",
  lede = "Три типичных старта — три разных набора практики. Раскройте свой.",
  personas = DEFAULT_PERSONAS,
  outcomesLabel = "Что получите",
  tilesLabel = "Кто вы сейчас",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Course001Props) {
  const [active, setActive] = useState(0)
  const palette = {
    ...(accent ? { "--vibeui-course-001-accent": accent } : null),
    ...(ink ? { "--vibeui-course-001-fg": ink } : null),
    ...(background ? { "--vibeui-course-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-course-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="course-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
            </div>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="tiles" role="tablist" aria-label={tilesLabel}>
            {personas.map((item, index) => {
              const open = index === active
              return (
                <Tile key={item.label} data-part="tile" label={item.label} glyph={item.glyph} note={item.note} title={item.title} text={item.text} outcomes={item.outcomes} outcomesLabel={outcomesLabel} open={open} setActive={setActive} index={index} onMouseEnter={() => setActive(index)} accent={accent} />
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}

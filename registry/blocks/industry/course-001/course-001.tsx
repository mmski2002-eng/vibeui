"use client"

import { useState, type CSSProperties } from "react"
import { Card089 } from "@/registry/components/card/card-089/card-089"

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
@media (prefers-reduced-motion:reduce){[data-vibeui-block="course-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_PERSONAS: Course001Persona[] = [
  { label: "Начинаю с нуля", glyph: "0", title: "Вы никогда не открывали Figma", text: "Хотите в дизайн интерфейсов, но не знаете, с чего начать. Начнём с сетки и компонентов и за шесть недель дойдём до прототипа, который не стыдно показать.", outcomes: ["Три экрана мобильного приложения по гайдлайнам", "Компоненты и автолейаут без страха", "Первый проект в портфолио с разбором куратора"], note: "с нуля до первого проекта" },
  { label: "Из графического дизайна", glyph: "→", title: "Умеете рисовать, но не интерфейсы", text: "Знаете композицию и типографику, а в продуктовой команде теряетесь: состояния, потоки, дизайн-системы. Переведём навык в продукт.", outcomes: ["Дизайн-система с токенами и вариантами", "Прототип с логикой и состояниями ошибок", "Портфолио под вакансии продуктового дизайнера"], note: "переход за 6 недель" },
  { label: "Продакт без рук", glyph: "PM", title: "Ставите задачи дизайнерам", text: "Хотите сами собирать прототипы для гипотез и говорить с командой на одном языке, не дожидаясь очереди в дизайн.", outcomes: ["Кликабельный прототип гипотезы за вечер", "Понимаете ограничения и сроки дизайна", "Читаете макеты и даёте точную обратную связь"], note: "прототип за вечер" },
]

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
                <Card089 key={item.label} data-part="tile" label={item.label} glyph={item.glyph} note={item.note} title={item.title} text={item.text} outcomes={item.outcomes} outcomesLabel={outcomesLabel} open={open} setActive={setActive} index={index} onMouseEnter={() => setActive(index)} accent={accent} />
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}

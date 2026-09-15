"use client"

import { useState, type CSSProperties } from "react"

export type Course001Persona = {
  /** Короткая подпись на переключателе: «Начинаю с нуля». */
  label: string
  title: string
  text: string
  /** Что получит именно этот человек. */
  outcomes: readonly string[]
  /** Число или факт для карточки: «с 0 до junior за 6 недель». */
  note?: string
}

export type Course001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  personas?: readonly Course001Persona[]
  outcomesLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Для кого»: три персоны переключателем, под ним карточка — кто вы сейчас,
// что получите, список результатов. Смена персоны перерисовывает карточку с
// новым key: текст въезжает, галочки появляются каскадом. Переключатель —
// role=tablist с плашкой под активным.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="course-001"]){
--vibeui-course-001-bg:light-dark(#ffffff,#0f1117);
--vibeui-course-001-fg:light-dark(#111827,#f3f4f6);
--vibeui-course-001-muted:light-dark(#6b7280,#9ca3af);
--vibeui-course-001-card:light-dark(#f8fafc,#161a23);
--vibeui-course-001-line:light-dark(#e5e7eb,#262b36);
--vibeui-course-001-accent:#4f46e5;
--vibeui-course-001-on-accent:#ffffff;
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
[data-vibeui-block="course-001"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2rem}
[data-vibeui-block="course-001"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-course-001-accent);font-weight:700}
[data-vibeui-block="course-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-course-001-display);font-weight:700;font-size:clamp(1.8rem,3.6cqi,2.75rem);line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="course-001"] [data-part="lede"]{margin:.75rem 0 0;max-width:30rem;color:var(--vibeui-course-001-muted)}
[data-vibeui-block="course-001"] [data-part="tabs"]{display:grid;gap:.5rem;margin:1.5rem 0 0;padding:0;list-style:none}
[data-vibeui-block="course-001"] [data-part="tab"]{display:flex;align-items:center;gap:.9rem;width:100%;padding:.9rem 1.1rem;border:1px solid var(--vibeui-course-001-line);border-radius:1rem;background:transparent;color:inherit;font:inherit;font-weight:600;text-align:left;cursor:pointer;transition:border-color .25s,background .25s,transform .25s}
[data-vibeui-block="course-001"] [data-part="tab"]::before{content:"";flex:none;width:.9rem;height:.9rem;border-radius:50%;border:2px solid var(--vibeui-course-001-line);transition:border-color .25s,background .25s,box-shadow .25s}
[data-vibeui-block="course-001"] [data-part="tab"]:hover{border-color:var(--vibeui-course-001-accent);transform:translateX(2px)}
[data-vibeui-block="course-001"] [data-part="tab"][aria-selected="true"]{border-color:var(--vibeui-course-001-accent);background:color-mix(in oklab,var(--vibeui-course-001-accent) 8%,var(--vibeui-course-001-bg))}
[data-vibeui-block="course-001"] [data-part="tab"][aria-selected="true"]::before{border-color:var(--vibeui-course-001-accent);background:var(--vibeui-course-001-accent);box-shadow:inset 0 0 0 3px var(--vibeui-course-001-bg)}
[data-vibeui-block="course-001"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-course-001-accent);outline-offset:2px}
[data-vibeui-block="course-001"] [data-part="card"]{display:grid;gap:1.25rem;padding:1.75rem;border-radius:1.25rem;background:var(--vibeui-course-001-card);border:1px solid var(--vibeui-course-001-line);animation:vibeui-course-001-in .5s cubic-bezier(.2,.8,.2,1) both}
@keyframes vibeui-course-001-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
[data-vibeui-block="course-001"] [data-part="note"]{display:inline-block;justify-self:start;padding:.35rem .7rem;border-radius:.5rem;background:var(--vibeui-course-001-marker);color:#1a2e05;font-family:var(--vibeui-course-001-display);font-size:.78rem;font-weight:600}
[data-vibeui-block="course-001"] [data-part="card-title"]{margin:0;font-family:var(--vibeui-course-001-display);font-size:1.35rem;font-weight:600;line-height:1.2}
[data-vibeui-block="course-001"] [data-part="text"]{margin:0;color:var(--vibeui-course-001-muted)}
[data-vibeui-block="course-001"] [data-part="label"]{margin:.25rem 0 0;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-course-001-muted);font-weight:700}
[data-vibeui-block="course-001"] [data-part="outcomes"]{margin:0;padding:0;list-style:none;display:grid;gap:.6rem}
[data-vibeui-block="course-001"] [data-part="outcomes"] li{display:flex;gap:.7rem;align-items:flex-start;animation:vibeui-course-001-in .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(.1s + var(--vibeui-course-001-n) * 70ms)}
[data-vibeui-block="course-001"] [data-part="outcomes"] li::before{content:"";flex:none;width:1.25rem;height:1.25rem;margin-top:.1rem;border-radius:50%;background:var(--vibeui-course-001-accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 10.5l3 3 6-6' fill='none' stroke='%23fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/100% no-repeat}
@container (min-width: 56rem){
[data-vibeui-block="course-001"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:4rem;padding:5.5rem 2rem;align-items:start}
[data-vibeui-block="course-001"] [data-part="card"]{padding:2.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="course-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_PERSONAS: Course001Persona[] = [
  {
    label: "Начинаю с нуля",
    title: "Вы никогда не открывали Figma",
    text: "Хотите в дизайн интерфейсов, но не знаете, с чего начать. Мы начнём с сетки и компонентов и за шесть недель дойдём до прототипа, который не стыдно показать.",
    outcomes: ["Собираете три экрана мобильного приложения по гайдлайнам", "Понимаете, как устроены компоненты и автолейаут", "Первый проект в портфолио и разбор от куратора"],
    note: "с нуля до первого проекта",
  },
  {
    label: "Из графического дизайна",
    title: "Умеете рисовать, но не интерфейсы",
    text: "Знаете композицию и типографику, а в продуктовой команде теряетесь: состояния, потоки, дизайн-системы. Переведём навык в продукт.",
    outcomes: ["Дизайн-система с токенами и вариантами", "Прототип с логикой и состояниями ошибок", "Портфолио под вакансии продуктового дизайнера"],
    note: "переход за 6 недель",
  },
  {
    label: "Продакт без рук",
    title: "Ставите задачи дизайнерам",
    text: "Хотите сами собирать прототипы для гипотез и говорить с командой на одном языке, не дожидаясь очереди в дизайн.",
    outcomes: ["Кликабельный прототип гипотезы за вечер", "Понимаете ограничения и сроки дизайна", "Читаете макеты и даёте точную обратную связь"],
    note: "прототип за вечер",
  },
]

/** «Для кого»: персоны переключателем и карточка результатов под каждую. */
export function Course001({
  eyebrow = "Для кого",
  title = "Курс подстраивается под то, откуда вы приходите",
  lede = "Три типичных старта — три разных набора практики. Выберите свой, чтобы увидеть, что получите на выходе.",
  personas = DEFAULT_PERSONAS,
  outcomesLabel = "Что получите",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Course001Props) {
  const [active, setActive] = useState(0)
  const persona = personas[Math.min(active, personas.length - 1)]
  const palette = {
    ...(accent ? { "--vibeui-course-001-accent": accent } : null),
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
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <ul data-part="tabs" role="tablist" aria-label="Кто вы сейчас">
              {personas.map((item, index) => (
                <li key={item.label} role="presentation">
                  <button type="button" role="tab" data-part="tab" aria-selected={index === active} onClick={() => setActive(index)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {persona ? (
            <div data-part="card" key={persona.label} role="tabpanel">
              {persona.note ? <span data-part="note">{persona.note}</span> : null}
              <h3 data-part="card-title">{persona.title}</h3>
              <p data-part="text">{persona.text}</p>
              {outcomesLabel ? <p data-part="label">{outcomesLabel}</p> : null}
              <ul data-part="outcomes">
                {persona.outcomes.map((outcome, index) => (
                  <li key={outcome} style={{ ["--vibeui-course-001-n" as string]: index }}>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

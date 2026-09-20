"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Course002Lesson = {
  title: string
  /** «40 мин», «лайв 1,5 ч». */
  length?: string
  /** Тип урока — иконка: запись, лайв, ревью, текст. */
  kind?: "video" | "live" | "review" | "text"
}

export type Course002Week = {
  /** «Неделя 1». */
  label: string
  title: string
  text?: string
  lessons: readonly Course002Lesson[]
  /** Домашка недели. */
  homework?: string
}

export type Course002Summary = {
  value: string
  label: string
}

export type Course002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  weeks?: readonly Course002Week[]
  /** На узком экране открыта первая неделя. */
  openFirst?: boolean
  /** Липкая сводка: уроки, часы, проекты. */
  summary?: readonly Course002Summary[]
  summaryTitle?: string
  /** Итоговый проект под сводкой. */
  finalTitle?: string
  finalText?: string
  homeworkLabel?: string
  /** Единицы длительности, aria недель, подписи итога. */
  hoursUnit?: string
  minutesUnit?: string
  weeksLabel?: string
  finalLabel?: string
  totalLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Программа как закреплённая сцена: слева липкая колонка недель с линией
// прогресса и сводкой, справа недели раскрыты подряд. При скролле
// IntersectionObserver подсвечивает текущую неделю в колонке и саму карточку,
// клик по неделе плавно скроллит к ней. На узком экране — обычный аккордеон
// по состоянию (grid-template-rows 0fr→1fr). У уроков иконка типа и сумма
// минут недели.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="course-002"]){
--vibeui-course-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-course-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-course-002-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-course-002-card:light-dark(#f8fafc,#242424);
--vibeui-course-002-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-course-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-course-002-on-accent:oklch(from var(--vibeui-course-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-course-002-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-course-002-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-course-002-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="course-002"]{color-scheme:dark}
:where([data-vibeui-block="course-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="course-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="course-002"]{box-sizing:border-box;display:block;background:var(--vibeui-course-002-bg);color:var(--vibeui-course-002-fg);font-family:var(--vibeui-course-002-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="course-002"] *{box-sizing:border-box}
[data-vibeui-block="course-002"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="course-002"] [data-part="head"]{max-width:40rem;margin-bottom:2.5rem}
[data-vibeui-block="course-002"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-course-002-accent);font-weight:700}
[data-vibeui-block="course-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-course-002-display);font-weight:700;font-size:clamp(1.8rem,3.6cqi,2.75rem);line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="course-002"] [data-part="lede"]{margin:.75rem 0 0;color:var(--vibeui-course-002-muted)}
[data-vibeui-block="course-002"] [data-part="grid"]{display:grid;gap:2rem}
[data-vibeui-block="course-002"] [data-part="rail"]{display:grid;gap:1rem;align-content:start}
[data-vibeui-block="course-002"] [data-part="nav"]{display:none;position:relative;margin:0;padding:0 0 0 1.5rem;list-style:none}
[data-vibeui-block="course-002"] [data-part="nav"]::before{content:"";position:absolute;left:.45rem;top:.75rem;bottom:.75rem;width:2px;background:var(--vibeui-course-002-line)}
[data-vibeui-block="course-002"] [data-part="progress"]{position:absolute;left:.45rem;top:.75rem;bottom:.75rem;width:2px;background:var(--vibeui-course-002-accent);transform-origin:top;transform:scaleY(var(--vibeui-course-002-p,0));transition:transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="course-002"] [data-part="nav-item"]{position:relative}
[data-vibeui-block="course-002"] [data-part="nav-item"]::before{content:"";position:absolute;left:-1.5rem;top:.75rem;width:1rem;height:1rem;border-radius:50%;background:var(--vibeui-course-002-bg);border:2px solid var(--vibeui-course-002-line);transition:border-color .3s,background .3s,transform .3s}
[data-vibeui-block="course-002"] [data-part="nav-item"][data-done="true"]::before{border-color:var(--vibeui-course-002-accent)}
[data-vibeui-block="course-002"] [data-part="nav-item"][data-active="true"]::before{background:var(--vibeui-course-002-accent);border-color:var(--vibeui-course-002-accent);transform:scale(1.2);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-course-002-accent) 20%,transparent)}
[data-vibeui-block="course-002"] [data-part="nav-btn"]{display:grid;gap:.1rem;width:100%;padding:.5rem .75rem;border:0;border-radius:.6rem;background:transparent;color:var(--vibeui-course-002-muted);font:inherit;text-align:left;cursor:pointer;transition:color .3s,background .3s}
[data-vibeui-block="course-002"] [data-part="nav-btn"]:hover{background:var(--vibeui-course-002-card)}
[data-vibeui-block="course-002"] [data-part="nav-btn"]:focus-visible{outline:2px solid var(--vibeui-course-002-accent);outline-offset:-2px}
[data-vibeui-block="course-002"] [data-part="nav-item"][data-active="true"] [data-part="nav-btn"]{color:var(--vibeui-course-002-fg)}
[data-vibeui-block="course-002"] [data-part="nav-num"]{font-family:var(--vibeui-course-002-display);font-size:.62rem;letter-spacing:.1em;text-transform:uppercase}
[data-vibeui-block="course-002"] [data-part="nav-title"]{font-size:.85rem;font-weight:600;line-height:1.25}
[data-vibeui-block="course-002"] [data-part="nav-min"]{font-size:.72rem;font-variant-numeric:tabular-nums;opacity:.7}
[data-vibeui-block="course-002"] [data-part="summary"]{padding:1.5rem;border-radius:1.1rem;background:var(--vibeui-course-002-fg);color:var(--vibeui-course-002-bg)}
[data-vibeui-block="course-002"] [data-part="summary-title"]{margin:0 0 1rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;opacity:.7;font-weight:700}
[data-vibeui-block="course-002"] [data-part="stats"]{display:grid;grid-template-columns:repeat(auto-fit,minmax(6rem,1fr));gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="course-002"] [data-part="stats"] b{display:block;font-family:var(--vibeui-course-002-display);font-size:1.6rem;font-weight:700;line-height:1;letter-spacing:-.02em}
[data-vibeui-block="course-002"] [data-part="stats"] span{display:block;margin-top:.3rem;font-size:.75rem;opacity:.7}
[data-vibeui-block="course-002"] [data-part="final"]{padding:1.5rem;border-radius:1.1rem;border:1px dashed var(--vibeui-course-002-accent);background:color-mix(in oklab,var(--vibeui-course-002-accent) 6%,var(--vibeui-course-002-bg))}
[data-vibeui-block="course-002"] [data-part="final-label"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-course-002-accent);font-weight:700}
[data-vibeui-block="course-002"] [data-part="final-title"]{margin:0;font-family:var(--vibeui-course-002-display);font-size:1.05rem;font-weight:600;line-height:1.25}
[data-vibeui-block="course-002"] [data-part="final-text"]{margin:.5rem 0 0;font-size:.85rem;color:var(--vibeui-course-002-muted)}
[data-vibeui-block="course-002"] [data-part="weeks"]{display:grid;gap:.75rem}
[data-vibeui-block="course-002"] [data-part="week"]{scroll-margin-top:6rem;border:1px solid var(--vibeui-course-002-line);border-radius:1.1rem;background:var(--vibeui-course-002-card);overflow:hidden;transition:border-color .35s,box-shadow .35s,opacity .35s,transform .35s}
[data-vibeui-block="course-002"] [data-part="week"][data-open="true"]{border-color:var(--vibeui-course-002-accent);box-shadow:0 20px 40px -30px color-mix(in oklab,var(--vibeui-course-002-accent) 60%,transparent)}
[data-vibeui-block="course-002"] [data-part="week-head"]{display:grid;grid-template-columns:auto minmax(0,1fr) 1.5rem;align-items:center;gap:1rem;width:100%;padding:1.1rem 1.25rem;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
[data-vibeui-block="course-002"] [data-part="week-head"]:focus-visible{outline:2px solid var(--vibeui-course-002-accent);outline-offset:-2px;border-radius:1.1rem}
[data-vibeui-block="course-002"] [data-part="num"]{font-family:var(--vibeui-course-002-display);font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-course-002-accent);padding:.35rem .6rem;border-radius:.5rem;background:color-mix(in oklab,var(--vibeui-course-002-accent) 10%,transparent);white-space:nowrap}
[data-vibeui-block="course-002"] [data-part="week-title"]{font-weight:600;font-size:1.05rem}
[data-vibeui-block="course-002"] [data-part="chevron"]{width:1.5rem;height:1.5rem;border-radius:50%;border:1px solid var(--vibeui-course-002-line);display:grid;place-items:center;transition:transform .35s cubic-bezier(.2,.8,.2,1),background .25s,border-color .25s}
[data-vibeui-block="course-002"] [data-part="chevron"]::before{content:"";width:.4rem;height:.4rem;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg) translate(-.05rem,-.05rem)}
[data-vibeui-block="course-002"] [data-part="week"][data-open="true"] [data-part="chevron"]{transform:rotate(180deg);background:var(--vibeui-course-002-accent);border-color:var(--vibeui-course-002-accent);color:var(--vibeui-course-002-on-accent)}
[data-vibeui-block="course-002"] [data-part="panel"]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="course-002"] [data-part="week"][data-open="true"] [data-part="panel"]{grid-template-rows:1fr}
[data-vibeui-block="course-002"] [data-part="panel"]>div{min-height:0;overflow:hidden}
[data-vibeui-block="course-002"] [data-part="body"]{padding:0 1.25rem 1.25rem}
[data-vibeui-block="course-002"] [data-part="text"]{margin:0 0 1rem;color:var(--vibeui-course-002-muted)}
[data-vibeui-block="course-002"] [data-part="lessons"]{margin:0;padding:0;list-style:none;display:grid;gap:.4rem}
[data-vibeui-block="course-002"] [data-part="lesson"]{display:flex;align-items:center;gap:.75rem;padding:.55rem .75rem;border-radius:.6rem;background:var(--vibeui-course-002-bg);transition:transform .25s}
[data-vibeui-block="course-002"] [data-part="lesson"]:hover{transform:translateX(3px)}
[data-vibeui-block="course-002"] [data-part="icon"]{flex:none;width:1.6rem;height:1.6rem;border-radius:.45rem;display:grid;place-items:center;background:color-mix(in oklab,var(--vibeui-course-002-accent) 12%,transparent);color:var(--vibeui-course-002-accent)}
[data-vibeui-block="course-002"] [data-part="lesson"][data-kind="live"] [data-part="icon"]{background:var(--vibeui-course-002-marker);color:#1a2e05}
[data-vibeui-block="course-002"] [data-part="icon"] svg{width:.9rem;height:.9rem}
[data-vibeui-block="course-002"] [data-part="lesson"]>span:nth-child(2){flex:1}
[data-vibeui-block="course-002"] [data-part="length"]{font-size:.78rem;color:var(--vibeui-course-002-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="course-002"] [data-part="foot"]{display:flex;flex-wrap:wrap;gap:.6rem 1rem;align-items:center;margin:1rem 0 0}
[data-vibeui-block="course-002"] [data-part="homework"]{display:flex;gap:.6rem;align-items:flex-start;flex:1 1 16rem;margin:0;padding:.75rem .9rem;border-radius:.6rem;background:var(--vibeui-course-002-marker);color:#1a2e05;font-size:.85rem}
[data-vibeui-block="course-002"] [data-part="homework"] b{font-weight:700;white-space:nowrap}
[data-vibeui-block="course-002"] [data-part="total"]{font-size:.78rem;color:var(--vibeui-course-002-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
@container (min-width: 60rem){
[data-vibeui-block="course-002"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="course-002"] [data-part="grid"]{grid-template-columns:17rem minmax(0,1fr);gap:3rem;align-items:start}
[data-vibeui-block="course-002"] [data-part="rail"]{position:sticky;top:5.5rem}
[data-vibeui-block="course-002"] [data-part="nav"]{display:grid;gap:.15rem}
[data-vibeui-block="course-002"] [data-part="weeks"]{gap:1.25rem}
[data-vibeui-block="course-002"] [data-part="week"]{opacity:.55;transform:scale(.985)}
[data-vibeui-block="course-002"] [data-part="week"][data-active="true"]{opacity:1;transform:none;border-color:var(--vibeui-course-002-accent);box-shadow:0 20px 40px -30px color-mix(in oklab,var(--vibeui-course-002-accent) 60%,transparent)}
[data-vibeui-block="course-002"] [data-part="week"]:not([data-active="true"]){box-shadow:none;border-color:var(--vibeui-course-002-line)}
[data-vibeui-block="course-002"] [data-part="week-head"]{padding:1.25rem 1.5rem;cursor:default}
[data-vibeui-block="course-002"] [data-part="chevron"]{display:none}
[data-vibeui-block="course-002"] [data-part="panel"]{grid-template-rows:1fr}
[data-vibeui-block="course-002"] [data-part="body"]{padding:0 1.5rem 1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="course-002"] *{animation:none!important;transition:none!important}}`

const ICONS: Record<NonNullable<Course002Lesson["kind"]>, string> = {
  video: "M8 6.5v11l9-5.5z",
  live: "M12 12m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7",
  review: "M5 12.5l4 4 10-10",
  text: "M6 7h12M6 12h12M6 17h8",
}

function minutes(length?: string) {
  if (!length) return 0
  const match = length.replace(",", ".").match(/(\d+(?:\.\d+)?)\s*(мин|ч|min|h)/i)
  if (!match) return 0
  const value = Number(match[1])
  return /ч|h/i.test(match[2]) ? Math.round(value * 60) : Math.round(value)
}

function duration(total: number, hoursUnit: string, minutesUnit: string) {
  const h = Math.floor(total / 60)
  const m = total % 60
  return [h ? `${h} ${hoursUnit}` : "", m ? `${m} ${minutesUnit}` : ""].filter(Boolean).join(" ")
}

const DEFAULT_WEEKS: Course002Week[] = [
  { label: "Неделя 1", title: "Сетка, типографика и первый экран", text: "Разбираем, из чего собран интерфейс, и делаем первый экран по гайдлайнам платформы.", lessons: [{ title: "Как устроена Figma: файлы, страницы, фреймы", length: "35 мин" }, { title: "Сетки и отступы: 8-пиксельная система", length: "40 мин" }, { title: "Типографика интерфейса", length: "45 мин" }, { title: "Разбор домашек потока", length: "1 ч", kind: "live" }], homework: "Экран онбординга по референсу" },
  { label: "Неделя 2", title: "Компоненты и автолейаут", text: "Собираем кнопки, поля и карточки так, чтобы они не ломались при любом тексте.", lessons: [{ title: "Автолейаут от простого к вложенному", length: "50 мин" }, { title: "Компоненты и варианты", length: "45 мин" }, { title: "Состояния: hover, focus, ошибка", length: "35 мин" }, { title: "Чек-лист компонентов", kind: "text" }], homework: "Набор из 12 компонентов" },
  { label: "Неделя 3", title: "Дизайн-система и токены", lessons: [{ title: "Цвет и тема: светлая и тёмная", length: "40 мин" }, { title: "Токены, стили, переменные", length: "45 мин" }, { title: "Документация системы", length: "30 мин" }, { title: "Ревью систем с куратором", length: "1 ч", kind: "review" }], homework: "Мини-система на 2 темы" },
  { label: "Неделя 4", title: "Потоки и прототипирование", lessons: [{ title: "Пользовательский путь и экраны", length: "40 мин" }, { title: "Прототип с переходами и оверлеями", length: "50 мин" }, { title: "Анимации Smart Animate", length: "35 мин" }], homework: "Кликабельный прототип 6 экранов" },
  { label: "Неделя 5", title: "Работа с разработкой", lessons: [{ title: "Dev Mode и передача макетов", length: "40 мин" }, { title: "Адаптивы и ограничения", length: "45 мин" }, { title: "Ревью с разработчиком", length: "1,5 ч", kind: "live" }], homework: "Макеты под три брейкпоинта" },
  { label: "Неделя 6", title: "Кейс и защита", lessons: [{ title: "Как оформить кейс в портфолио", length: "40 мин" }, { title: "Презентация решения", length: "35 мин" }, { title: "Защита перед арт-директором", length: "2 ч", kind: "live" }], homework: "Итоговый кейс" },
]

/** Программа курса закреплённой сценой: липкая колонка недель с прогрессом, подсветка по скроллу, аккордеон на мобиле. */
export function Course002({
  eyebrow = "Программа",
  title = "Шесть недель — три проекта в портфолио",
  lede = "Каждая неделя: три записанных урока, лайв с разбором и домашка с проверкой куратором.",
  weeks = DEFAULT_WEEKS,
  openFirst = true,
  summary = [
    { value: "18", label: "уроков" },
    { value: "24 ч", label: "видео и лайвов" },
    { value: "6", label: "домашек с ревью" },
    { value: "3", label: "проекта" },
  ],
  summaryTitle = "В цифрах",
  finalTitle = "Итоговый проект: мобильное приложение с нуля до прототипа",
  finalText = "Защита перед арт-директором из партнёрской компании. Лучшие кейсы попадают в базу рекомендаций.",
  homeworkLabel = "Домашка:",
  hoursUnit = "ч",
  minutesUnit = "мин",
  weeksLabel = "Недели курса",
  finalLabel = "Итоговый проект",
  totalLabel = "Итого",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Course002Props) {
  const [open, setOpen] = useState(openFirst ? 0 : -1)
  const [active, setActive] = useState(0)
  const items = useRef<(HTMLElement | null)[]>([])
  const palette = {
    ...(accent ? { "--vibeui-course-002-accent": accent } : null),
    ...(ink ? { "--vibeui-course-002-fg": ink } : null),
    ...(background ? { "--vibeui-course-002-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return
    const nodes = items.current.filter((node): node is HTMLElement => node !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        })
      },
      { rootMargin: "-35% 0px -55% 0px" },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [weeks])

  const jump = (index: number) => {
    setActive(index)
    items.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-course-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="course-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="grid">
            <aside data-part="rail">
              <ol data-part="nav" aria-label={weeksLabel} style={{ ["--vibeui-course-002-p" as string]: weeks.length ? (active + 1) / weeks.length : 0 }}>
                <span data-part="progress" aria-hidden="true" />
                {weeks.map((week, index) => {
                  const total = week.lessons.reduce((sum, lesson) => sum + minutes(lesson.length), 0)
                  return (
                    <li key={week.label} data-part="nav-item" data-active={index === active} data-done={index < active}>
                      <button type="button" data-part="nav-btn" onClick={() => jump(index)} aria-current={index === active ? "true" : undefined}>
                        <span data-part="nav-num">{week.label}</span>
                        <span data-part="nav-title">{week.title}</span>
                        {total ? <span data-part="nav-min">{duration(total, hoursUnit, minutesUnit)}</span> : null}
                      </button>
                    </li>
                  )
                })}
              </ol>
              {summary.length > 0 ? (
                <div data-part="summary">
                  {summaryTitle ? <p data-part="summary-title">{summaryTitle}</p> : null}
                  <ul data-part="stats">
                    {summary.map((item) => (
                      <li key={item.label}>
                        <b>{item.value}</b>
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {finalTitle ? (
                <div data-part="final">
                  <p data-part="final-label">{finalLabel}</p>
                  <p data-part="final-title">{finalTitle}</p>
                  {finalText ? <p data-part="final-text">{finalText}</p> : null}
                </div>
              ) : null}
            </aside>
            <div data-part="weeks">
              {weeks.map((week, index) => {
                const total = week.lessons.reduce((sum, lesson) => sum + minutes(lesson.length), 0)
                const isOpen = index === open
                return (
                  <article
                    key={week.label}
                    data-part="week"
                    data-index={index}
                    data-open={isOpen}
                    data-active={index === active}
                    ref={(node) => {
                      items.current[index] = node
                    }}
                  >
                    <button type="button" data-part="week-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : index)}>
                      <span data-part="num">{week.label}</span>
                      <span data-part="week-title">{week.title}</span>
                      <span data-part="chevron" aria-hidden="true" />
                    </button>
                    <div data-part="panel">
                      <div>
                        <div data-part="body">
                          {week.text ? <p data-part="text">{week.text}</p> : null}
                          <ul data-part="lessons">
                            {week.lessons.map((lesson) => {
                              const kind = lesson.kind ?? "video"
                              return (
                                <li key={lesson.title} data-part="lesson" data-kind={kind}>
                                  <span data-part="icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill={kind === "video" ? "currentColor" : "none"} stroke={kind === "video" ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d={ICONS[kind]} />
                                    </svg>
                                  </span>
                                  <span>{lesson.title}</span>
                                  {lesson.length ? <span data-part="length">{lesson.length}</span> : null}
                                </li>
                              )
                            })}
                          </ul>
                          <div data-part="foot">
                            {week.homework ? (
                              <p data-part="homework">
                                <b>{homeworkLabel}</b>
                                <span>{week.homework}</span>
                              </p>
                            ) : null}
                            {total ? <span data-part="total">{totalLabel} {duration(total, hoursUnit, minutesUnit)}</span> : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

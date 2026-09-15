import { useId, type CSSProperties } from "react"

export type Course002Lesson = {
  title: string
  /** «40 мин», «лайв 1,5 ч». */
  length?: string
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
  /** Открыта первая неделя. */
  openFirst?: boolean
  /** Липкая сводка справа: уроки, часы, проекты. */
  summary?: readonly Course002Summary[]
  summaryTitle?: string
  /** Итоговый проект под сводкой. */
  finalTitle?: string
  finalText?: string
  homeworkLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Программа курса: недели аккордеоном на <details> с общим name — открыта
// одна, номер недели крупно, внутри уроки с длительностью и домашка.
// Справа липкая сводка «18 уроков · 24 часа» и итоговый проект. Плавное
// раскрытие — через grid-template-rows 0fr→1fr на обёртке содержимого.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="course-002"]){
--vibeui-course-002-bg:light-dark(#ffffff,#0f1117);
--vibeui-course-002-fg:light-dark(#111827,#f3f4f6);
--vibeui-course-002-muted:light-dark(#6b7280,#9ca3af);
--vibeui-course-002-card:light-dark(#f8fafc,#161a23);
--vibeui-course-002-line:light-dark(#e5e7eb,#262b36);
--vibeui-course-002-accent:#4f46e5;
--vibeui-course-002-on-accent:#ffffff;
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
[data-vibeui-block="course-002"] [data-part="list"]{display:grid;gap:.75rem}
[data-vibeui-block="course-002"] details{border:1px solid var(--vibeui-course-002-line);border-radius:1.1rem;background:var(--vibeui-course-002-card);overflow:hidden;transition:border-color .25s,box-shadow .3s}
[data-vibeui-block="course-002"] details[open]{border-color:var(--vibeui-course-002-accent);box-shadow:0 20px 40px -30px color-mix(in oklab,var(--vibeui-course-002-accent) 60%,transparent)}
[data-vibeui-block="course-002"] summary{display:grid;grid-template-columns:auto minmax(0,1fr) 1.5rem;align-items:center;gap:1rem;padding:1.1rem 1.25rem;cursor:pointer;list-style:none}
[data-vibeui-block="course-002"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="course-002"] summary:focus-visible{outline:2px solid var(--vibeui-course-002-accent);outline-offset:-2px;border-radius:1.1rem}
[data-vibeui-block="course-002"] [data-part="num"]{font-family:var(--vibeui-course-002-display);font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-course-002-accent);padding:.35rem .6rem;border-radius:.5rem;background:color-mix(in oklab,var(--vibeui-course-002-accent) 10%,transparent);white-space:nowrap}
[data-vibeui-block="course-002"] [data-part="week-title"]{font-weight:600;font-size:1.05rem}
[data-vibeui-block="course-002"] [data-part="chevron"]{width:1.5rem;height:1.5rem;border-radius:50%;border:1px solid var(--vibeui-course-002-line);display:grid;place-items:center;transition:transform .35s cubic-bezier(.2,.8,.2,1),background .25s,border-color .25s}
[data-vibeui-block="course-002"] [data-part="chevron"]::before{content:"";width:.4rem;height:.4rem;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg) translate(-.05rem,-.05rem)}
[data-vibeui-block="course-002"] details[open] [data-part="chevron"]{transform:rotate(180deg);background:var(--vibeui-course-002-accent);border-color:var(--vibeui-course-002-accent);color:var(--vibeui-course-002-on-accent)}
[data-vibeui-block="course-002"] [data-part="body"]{padding:0 1.25rem 1.25rem}
[data-vibeui-block="course-002"] [data-part="text"]{margin:0 0 1rem;color:var(--vibeui-course-002-muted)}
[data-vibeui-block="course-002"] [data-part="lessons"]{margin:0;padding:0;list-style:none;display:grid;gap:.4rem}
[data-vibeui-block="course-002"] [data-part="lesson"]{display:flex;align-items:baseline;gap:.75rem;padding:.55rem .75rem;border-radius:.6rem;background:var(--vibeui-course-002-bg);animation:vibeui-course-002-in .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-course-002-n) * 50ms)}
@keyframes vibeui-course-002-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
[data-vibeui-block="course-002"] [data-part="lesson"]::before{content:"";flex:none;width:1rem;height:1rem;border-radius:50%;background:var(--vibeui-course-002-accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 6.5v11l9-5.5z' fill='%23fff'/%3E%3C/svg%3E") center/.75rem no-repeat;transform:translateY(.15rem)}
[data-vibeui-block="course-002"] [data-part="lesson"] span:first-of-type{flex:1}
[data-vibeui-block="course-002"] [data-part="length"]{font-size:.78rem;color:var(--vibeui-course-002-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="course-002"] [data-part="homework"]{display:flex;gap:.6rem;align-items:flex-start;margin:1rem 0 0;padding:.75rem .9rem;border-radius:.6rem;background:var(--vibeui-course-002-marker);color:#1a2e05;font-size:.85rem}
[data-vibeui-block="course-002"] [data-part="homework"] b{font-weight:700;white-space:nowrap}
[data-vibeui-block="course-002"] [data-part="aside"]{display:grid;gap:1rem;align-content:start}
[data-vibeui-block="course-002"] [data-part="summary"]{padding:1.5rem;border-radius:1.1rem;background:var(--vibeui-course-002-fg);color:var(--vibeui-course-002-bg)}
[data-vibeui-block="course-002"] [data-part="summary-title"]{margin:0 0 1rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;opacity:.7;font-weight:700}
[data-vibeui-block="course-002"] [data-part="stats"]{display:grid;grid-template-columns:repeat(auto-fit,minmax(6rem,1fr));gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="course-002"] [data-part="stats"] b{display:block;font-family:var(--vibeui-course-002-display);font-size:1.75rem;font-weight:700;line-height:1;letter-spacing:-.02em}
[data-vibeui-block="course-002"] [data-part="stats"] span{display:block;margin-top:.3rem;font-size:.78rem;opacity:.7}
[data-vibeui-block="course-002"] [data-part="final"]{padding:1.5rem;border-radius:1.1rem;border:1px dashed var(--vibeui-course-002-accent);background:color-mix(in oklab,var(--vibeui-course-002-accent) 6%,var(--vibeui-course-002-bg))}
[data-vibeui-block="course-002"] [data-part="final-label"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-course-002-accent);font-weight:700}
[data-vibeui-block="course-002"] [data-part="final-title"]{margin:0;font-family:var(--vibeui-course-002-display);font-size:1.1rem;font-weight:600;line-height:1.25}
[data-vibeui-block="course-002"] [data-part="final-text"]{margin:.5rem 0 0;font-size:.875rem;color:var(--vibeui-course-002-muted)}
@container (min-width: 60rem){
[data-vibeui-block="course-002"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="course-002"] [data-part="grid"]{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:3rem;align-items:start}
[data-vibeui-block="course-002"] [data-part="aside"]{position:sticky;top:6rem}
[data-vibeui-block="course-002"] summary{padding:1.25rem 1.5rem}
[data-vibeui-block="course-002"] [data-part="body"]{padding:0 1.5rem 1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="course-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_WEEKS: Course002Week[] = [
  { label: "Неделя 1", title: "Сетка, типографика и первый экран", text: "Разбираем, из чего собран интерфейс, и делаем первый экран по гайдлайнам платформы.", lessons: [{ title: "Как устроена Figma: файлы, страницы, фреймы", length: "35 мин" }, { title: "Сетки и отступы: 8-пиксельная система", length: "40 мин" }, { title: "Типографика интерфейса", length: "45 мин" }], homework: "Экран онбординга по референсу" },
  { label: "Неделя 2", title: "Компоненты и автолейаут", text: "Собираем кнопки, поля и карточки так, чтобы они не ломались при любом тексте.", lessons: [{ title: "Автолейаут от простого к вложенному", length: "50 мин" }, { title: "Компоненты и варианты", length: "45 мин" }, { title: "Состояния: hover, focus, ошибка", length: "35 мин" }], homework: "Набор из 12 компонентов" },
  { label: "Неделя 3", title: "Дизайн-система и токены", lessons: [{ title: "Цвет и тема: светлая и тёмная", length: "40 мин" }, { title: "Токены, стили, переменные", length: "45 мин" }, { title: "Документация системы", length: "30 мин" }], homework: "Мини-система на 2 темы" },
  { label: "Неделя 4", title: "Потоки и прототипирование", lessons: [{ title: "Пользовательский путь и экраны", length: "40 мин" }, { title: "Прототип с переходами и оверлеями", length: "50 мин" }, { title: "Анимации Smart Animate", length: "35 мин" }], homework: "Кликабельный прототип 6 экранов" },
  { label: "Неделя 5", title: "Работа с разработкой", lessons: [{ title: "Dev Mode и передача макетов", length: "40 мин" }, { title: "Адаптивы и ограничения", length: "45 мин" }, { title: "Ревью с разработчиком: лайв", length: "1,5 ч" }], homework: "Макеты под три брейкпоинта" },
  { label: "Неделя 6", title: "Кейс и защита", lessons: [{ title: "Как оформить кейс в портфолио", length: "40 мин" }, { title: "Презентация решения", length: "35 мин" }, { title: "Защита перед арт-директором: лайв", length: "2 ч" }], homework: "Итоговый кейс" },
]

/** Программа курса: недели аккордеоном с уроками и домашкой, липкая сводка и итоговый проект. */
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
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Course002Props) {
  const group = useId()
  const palette = {
    ...(accent ? { "--vibeui-course-002-accent": accent } : null),
    ...(background ? { "--vibeui-course-002-bg": background } : null),
    ...style,
  } as CSSProperties

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
            <div data-part="list">
              {weeks.map((week, index) => (
                <details key={week.label} name={group} open={openFirst && index === 0 ? true : undefined}>
                  <summary>
                    <span data-part="num">{week.label}</span>
                    <span data-part="week-title">{week.title}</span>
                    <span data-part="chevron" aria-hidden="true" />
                  </summary>
                  <div data-part="body">
                    {week.text ? <p data-part="text">{week.text}</p> : null}
                    <ul data-part="lessons">
                      {week.lessons.map((lesson, lessonIndex) => (
                        <li key={lesson.title} data-part="lesson" style={{ ["--vibeui-course-002-n" as string]: lessonIndex }}>
                          <span>{lesson.title}</span>
                          {lesson.length ? <span data-part="length">{lesson.length}</span> : null}
                        </li>
                      ))}
                    </ul>
                    {week.homework ? (
                      <p data-part="homework">
                        <b>{homeworkLabel}</b>
                        <span>{week.homework}</span>
                      </p>
                    ) : null}
                  </div>
                </details>
              ))}
            </div>
            <aside data-part="aside">
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
                  <p data-part="final-label">Итоговый проект</p>
                  <p data-part="final-title">{finalTitle}</p>
                  {finalText ? <p data-part="final-text">{finalText}</p> : null}
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

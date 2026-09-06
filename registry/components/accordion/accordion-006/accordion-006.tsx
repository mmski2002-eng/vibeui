import type { ComponentProps, CSSProperties } from "react"

export type Accordion006Step = {
  title: string
  body: string
  /** Шаг выполнен: номер заменяется галочкой, подпись гасится. */
  done?: boolean
  /** Подпись справа: сколько займёт, что понадобится. */
  hint?: string
}

/** Что показывать в шапке над списком шагов. */
export type Accordion006Progress = "bar" | "count" | "none"

export type Accordion006Props = Omit<ComponentProps<"div">, "children"> & {
  title?: string
  steps?: Accordion006Step[]
  /** Слово «выполнено» для скринридера: галочка в плитке ему не видна. */
  doneLabel?: string
  /**
   * Счётчик шагов. Шаблон, а не склеенная строка: порядок слов и предлог
   * в разных языках свои, и переводится он целиком.
   */
  countText?: string
  /** Номер раскрытого шага. По умолчанию — первый невыполненный. */
  defaultOpen?: number
  progress?: Accordion006Progress
  /** Пусто — заливки нет, чеклист лежит на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: аккордеон-чеклист для онбординга. Слева нумерованные
// плитки, выполненные помечены галочкой, сверху — счётчик и полоса прогресса,
// которая считается из самих шагов, а не задаётся отдельно. Раскрыт по
// умолчанию первый невыполненный шаг: пользователь попадает туда, где остановился.
//
// Заливки у чеклиста нет: он лежит на фоне страницы и держится рамкой. Тема
// берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="accordion-006"]){
--vibeui-accordion-006-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-accordion-006-muted:color-mix(in oklab,var(--vibeui-accordion-006-fg) 68%,transparent);
--vibeui-accordion-006-bg:transparent;
--vibeui-accordion-006-border:light-dark(oklch(0.91 0 265),oklch(0.31 0 265));
--vibeui-accordion-006-track:light-dark(oklch(0.93 0 265),oklch(0.28 0 265));
--vibeui-accordion-006-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.75 0.16 39.8));
--vibeui-accordion-006-accent-fg:light-dark(oklch(1 0 0),oklch(0.17 0 265));
--vibeui-accordion-006-done:light-dark(oklch(0.58 0.15 152),oklch(0.75 0.15 155));
--vibeui-accordion-006-radius:1rem;
--vibeui-accordion-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-006"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:40rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-accordion-006-border);
border-radius:var(--vibeui-accordion-006-radius);
background:var(--vibeui-accordion-006-bg);
color:var(--vibeui-accordion-006-fg);font-family:var(--vibeui-accordion-006-font);
}
[data-vibeui-block="accordion-006"] [data-part="head"]{
display:flex;flex-direction:column;gap:0.625rem;
padding:1.0625rem 1.0625rem;border-bottom:1px solid var(--vibeui-accordion-006-border);
}
[data-vibeui-block="accordion-006"] [data-part="head-row"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;
}
[data-vibeui-block="accordion-006"] [data-part="title"]{margin:0;font-size:1rem;font-weight:620}
[data-vibeui-block="accordion-006"] [data-part="count"]{
font-size:0.8125rem;color:var(--vibeui-accordion-006-muted);font-variant-numeric:tabular-nums;
}
/* Прогресс считается из шагов: разойтись со списком он не может. Полосу и
   счётчик можно убрать по отдельности — шапка сама схлопывается. */
[data-vibeui-block="accordion-006"][data-progress="none"] [data-part="head"]{display:none}
[data-vibeui-block="accordion-006"][data-progress="count"] [data-part="track"]{display:none}
[data-vibeui-block="accordion-006"] [data-part="track"]{
height:0.25rem;border-radius:9999px;background:var(--vibeui-accordion-006-track);overflow:hidden;
}
[data-vibeui-block="accordion-006"] [data-part="bar"]{
height:100%;border-radius:inherit;background:var(--vibeui-accordion-006-done);
width:calc(var(--vibeui-accordion-006-progress,0) * 1%);
transition:width .3s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="accordion-006"] details + details{border-top:1px solid var(--vibeui-accordion-006-border)}
[data-vibeui-block="accordion-006"] summary{
display:flex;align-items:flex-start;gap:0.75rem;
padding:0.9375rem 1.0625rem;cursor:pointer;list-style:none;
font-size:0.9375rem;line-height:1.4;
}
[data-vibeui-block="accordion-006"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-006"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-006-accent);outline-offset:-2px}
/* Плитка шага: номер, а у выполненного — галочка на зелёной заливке. */
[data-vibeui-block="accordion-006"] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.5rem;height:1.5rem;border-radius:0.5rem;
border:1px solid var(--vibeui-accordion-006-border);
font-size:0.75rem;font-weight:650;line-height:1;
color:var(--vibeui-accordion-006-muted);
}
[data-vibeui-block="accordion-006"] details[data-done="true"] [data-part="mark"]{
background:var(--vibeui-accordion-006-done);border-color:var(--vibeui-accordion-006-done);
color:var(--vibeui-accordion-006-accent-fg);
}
[data-vibeui-block="accordion-006"] [data-part="text"]{flex:1 1 auto;min-width:0;font-weight:550}
[data-vibeui-block="accordion-006"] details[data-done="true"] [data-part="text"]{color:var(--vibeui-accordion-006-muted);font-weight:500}
[data-vibeui-block="accordion-006"] [data-part="hint"]{
flex:none;font-size:0.75rem;color:var(--vibeui-accordion-006-muted);white-space:nowrap;
}
/* Состояние шага названо словом: плитка с галочкой скрыта от скринридера,
   и без этой подписи сделанный шаг звучит так же, как несделанный. */
[data-vibeui-block="accordion-006"] [data-part="said"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="accordion-006"] [data-part="body"]{
margin:0;padding:0 1.0625rem 1.0625rem 3.3125rem;
font-size:0.875rem;line-height:1.6;color:var(--vibeui-accordion-006-muted);max-width:58ch;
}
/* Общая шкала категории: на широкой раскладке строка и текст подрастают
   на один шаг, тот же, что у соседних аккордеонов. */
@container (min-width: 32rem){
[data-vibeui-block="accordion-006"] [data-part="head"]{padding:1.125rem 1.375rem}
[data-vibeui-block="accordion-006"] summary{padding:1.0625rem 1.375rem;font-size:1rem}
[data-vibeui-block="accordion-006"] [data-part="body"]{padding:0 1.375rem 1.125rem 3.625rem;font-size:0.9375rem}
}
@container (max-width: 26rem){
[data-vibeui-block="accordion-006"] [data-part="hint"]{display:none}
[data-vibeui-block="accordion-006"] [data-part="body"]{padding-left:1.25rem}
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-006"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Accordion006Step[] = [
  {
    title: "Создать проект",
    hint: "2 минуты",
    done: true,
    body: "Название и адрес можно поменять позже: адрес проекта не влияет на публичный домен.",
  },
  {
    title: "Выбрать блоки",
    hint: "10 минут",
    done: true,
    body: "Соберите страницу из готовых блоков каталога. Порядок меняется перетаскиванием, лишнее удаляется.",
  },
  {
    title: "Подключить домен",
    hint: "5 минут",
    body: "Добавьте A-запись на наш адрес у регистратора. Сертификат выпускается автоматически, обычно за пару минут.",
  },
  {
    title: "Пригласить команду",
    hint: "по желанию",
    body: "Участники приглашаются по почте и получают роль редактора или читателя. Количество не ограничено тарифом.",
  },
]

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
 * Аккордеон-чеклист онбординга: шаги, галочки и общий прогресс.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion006({
  title = "Настройка проекта",
  steps = DEFAULT_STEPS,
  doneLabel = "выполнено",
  countText = "{done} из {total}",
  defaultOpen,
  progress = "bar",
  background = "",
  accent,
  className,
  style,
  ...props
}: Accordion006Props) {
  const done = steps.filter((step) => step.done).length
  const percent = steps.length ? (done / steps.length) * 100 : 0
  const firstOpen = steps.findIndex((step) => !step.done)
  const openIndex = defaultOpen ?? (firstOpen === -1 ? 0 : firstOpen)

  const palette = {
    "--vibeui-accordion-006-progress": percent,
    ...(accent ? { "--vibeui-accordion-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-accordion-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-006"
        data-progress={progress}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <div data-part="head-row">
            <p data-part="title">{title}</p>
            <span data-part="count">
              {countText
                .replace("{done}", String(done))
                .replace("{total}", String(steps.length))}
            </span>
          </div>
          <div
            data-part="track"
            role="progressbar"
            aria-label={title}
            aria-valuemin={0}
            aria-valuemax={steps.length}
            aria-valuenow={done}
          >
            <div data-part="bar" />
          </div>
        </div>
        {steps.map((step, index) => (
          <details
            key={step.title}
            open={index === openIndex}
            data-done={step.done || undefined}
          >
            <summary>
              <span data-part="mark" aria-hidden="true">
                {step.done ? "✓" : index + 1}
              </span>
              <span data-part="text">{step.title}</span>
              {step.done ? <span data-part="said">{doneLabel}</span> : null}
              {step.hint ? <span data-part="hint">{step.hint}</span> : null}
            </summary>
            <p data-part="body">{step.body}</p>
          </details>
        ))}
      </div>
    </>
  )
}

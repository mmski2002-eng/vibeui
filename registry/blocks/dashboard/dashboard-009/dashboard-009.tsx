import type { CSSProperties } from "react"

export type Dashboard009Step = {
  title: string
  text: string
  done?: boolean
}

export type Dashboard009Props = {
  title?: string
  lead?: string
  steps?: Dashboard009Step[]
  cta?: string
  secondary?: string
  docsLabel?: string
  /** Счётчик готовности: {done} — сделано, {total} — всего шагов. */
  progressText?: string
  /** Пусто — подложки нет, экран ложится на фон страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: пустой экран, который объясняет следующий шаг. Пустое состояние
// без действия — тупик: человек видит, что данных нет, и не знает, откуда они
// возьмутся. Поэтому здесь список из трёх шагов с отметкой уже сделанного и
// одна главная кнопка. Прогресс считается из массива, а не задаётся числом,
// иначе после правки шагов он начинает врать. Иллюстрация нарисована рамками
// и не тянет чужие файлы, а от скринридера скрыта: смысл несёт текст.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// подложки у экрана нет, от него остаётся пунктирная рамка.
const STYLES = `
:where([data-vibeui-block="dashboard-009"]){
--vibeui-dashboard-009-bg:transparent;
--vibeui-dashboard-009-panel:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-dashboard-009-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-dashboard-009-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-dashboard-009-border:light-dark(oklch(0.91 0 265),oklch(0.38 0 265));
--vibeui-dashboard-009-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-dashboard-009-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-dashboard-009-art:light-dark(oklch(0.55 0.2 262 / 18%),oklch(0.74 0.16 262 / 26%));
--vibeui-dashboard-009-art-tall:light-dark(oklch(0.55 0.2 262 / 32%),oklch(0.74 0.16 262 / 45%));
--vibeui-dashboard-009-done:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-dashboard-009-on-done:light-dark(oklch(1 0 0),oklch(0.2 0.04 152));
--vibeui-dashboard-009-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-009"]{color-scheme:dark}
[data-vibeui-block="dashboard-009"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1.5rem 1.25rem;
background:var(--vibeui-dashboard-009-bg);
border:1px dashed var(--vibeui-dashboard-009-border);border-radius:1rem;
font-family:var(--vibeui-dashboard-009-sans);color:var(--vibeui-dashboard-009-fg);
text-align:center;
}
[data-vibeui-block="dashboard-009"] *{box-sizing:border-box}
/* Картинка из рамок: блок не тянет чужие файлы и не зависит от набора иконок. */
[data-vibeui-block="dashboard-009"] [data-part="art"]{
display:flex;align-items:flex-end;justify-content:center;gap:0.375rem;
height:3.25rem;margin:0 auto 0.875rem;
}
[data-vibeui-block="dashboard-009"] [data-part="bar"]{
width:0.875rem;border-radius:0.25rem 0.25rem 0 0;
background:var(--vibeui-dashboard-009-art);
}
[data-vibeui-block="dashboard-009"] [data-part="bar"]:nth-child(1){height:40%}
[data-vibeui-block="dashboard-009"] [data-part="bar"]:nth-child(2){height:72%;background:var(--vibeui-dashboard-009-art-tall)}
[data-vibeui-block="dashboard-009"] [data-part="bar"]:nth-child(3){height:56%}
[data-vibeui-block="dashboard-009"] h2{margin:0 0 0.375rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-009"] [data-part="lead"]{
margin:0 auto 1rem;max-width:26rem;
font-size:0.8125rem;line-height:1.55;color:var(--vibeui-dashboard-009-muted);
}
[data-vibeui-block="dashboard-009"] ol{
list-style:none;margin:0 auto 1rem;padding:0;max-width:30rem;text-align:left;
display:grid;grid-template-columns:1fr;gap:0.5rem;
}
@container (min-width: 34rem){[data-vibeui-block="dashboard-009"] ol{grid-template-columns:repeat(3,1fr)}}
[data-vibeui-block="dashboard-009"] li{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-dashboard-009-panel);
border:1px solid var(--vibeui-dashboard-009-border);
}
[data-vibeui-block="dashboard-009"] [data-part="step"]{
display:flex;align-items:center;gap:0.375rem;margin:0 0 0.1875rem;
font-size:0.8125rem;font-weight:650;
}
/* Сделанный шаг отмечен галочкой, а не только цветом текста. */
[data-vibeui-block="dashboard-009"] [data-part="mark"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.125rem;height:1.125rem;border-radius:9999px;
box-shadow:inset 0 0 0 1.5px var(--vibeui-dashboard-009-border);
font-size:0.625rem;line-height:1;
}
[data-vibeui-block="dashboard-009"] [data-done="true"] [data-part="mark"]{
background:var(--vibeui-dashboard-009-done);color:var(--vibeui-dashboard-009-on-done);box-shadow:none;
}
[data-vibeui-block="dashboard-009"] [data-part="text"]{margin:0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-dashboard-009-muted)}
[data-vibeui-block="dashboard-009"] [data-part="progress"]{
margin:0 0 0.875rem;font-size:0.6875rem;color:var(--vibeui-dashboard-009-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-009"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center}
[data-vibeui-block="dashboard-009"] button{
appearance:none;cursor:pointer;height:2.375rem;padding:0 1rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="dashboard-009"] [data-part="primary"]{border:0;background:var(--vibeui-dashboard-009-accent);color:var(--vibeui-dashboard-009-on-accent)}
[data-vibeui-block="dashboard-009"] [data-part="secondary"]{
border:1px solid var(--vibeui-dashboard-009-border);background:none;color:inherit;
}
[data-vibeui-block="dashboard-009"] button:focus-visible{outline:2px solid var(--vibeui-dashboard-009-accent);outline-offset:2px}
[data-vibeui-block="dashboard-009"] [data-part="docs"]{
display:inline-block;margin-top:0.625rem;
color:var(--vibeui-dashboard-009-accent);font-size:0.75rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Dashboard009Step[] = [
  {
    title: "Подключите проект",
    text: "Один ключ доступа — и каталог начнёт получать установки.",
    done: true,
  },
  {
    title: "Поставьте первый блок",
    text: "Команда установки лежит на странице любого компонента.",
  },
  {
    title: "Позовите команду",
    text: "Участники увидят те же блоки и историю установок.",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Пустой экран, который объясняет следующий шаг, а не просто сообщает пустоту.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard009({
  title = "Данных пока нет",
  lead = "Панель заполнится, как только проект начнёт ставить компоненты. Три шага ниже занимают пару минут.",
  steps = DEFAULT_STEPS,
  cta = "Подключить проект",
  secondary = "Посмотреть пример",
  docsLabel = "Как это работает",
  progressText = "Готово {done} из {total}",
  background = "",
  accent,
  className,
  style,
}: Dashboard009Props) {
  // Прогресс считается из массива: заданное отдельно число врёт после правки.
  const done = steps.filter((step) => step.done).length

  const palette = {
    ...(accent ? { "--vibeui-dashboard-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-009"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="art" aria-hidden="true">
          <span data-part="bar" />
          <span data-part="bar" />
          <span data-part="bar" />
        </div>
        <h2>{title}</h2>
        <p data-part="lead">{lead}</p>
        <p data-part="progress">
          {progressText
            .replace("{done}", String(done))
            .replace("{total}", String(steps.length))}
        </p>
        <ol>
          {steps.map((step) => (
            <li key={step.title} data-done={step.done ? "true" : "false"}>
              <p data-part="step">
                <span data-part="mark" aria-hidden="true">
                  {step.done ? "✓" : null}
                </span>
                {step.title}
              </p>
              <p data-part="text">{step.text}</p>
            </li>
          ))}
        </ol>
        <div data-part="actions">
          <button type="button" data-part="primary">
            {cta}
          </button>
          <button type="button" data-part="secondary">
            {secondary}
          </button>
        </div>
        <a data-part="docs" href="#">
          {docsLabel}
        </a>
      </section>
    </>
  )
}

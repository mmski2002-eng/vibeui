import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card019Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  title?: string
  /** Почему тут пусто и что изменится после действия. Одно предложение. */
  description?: string
  /** Ровно одно действие: выбор из двух кнопок в пустоте некуда девать. */
  actionLabel?: string
  /** Тихая подсказка под кнопкой: справка, импорт, пример. Не вторая кнопка. */
  hint?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пустое состояние с ровно одним выходом. Рисунок собран
// из трёх «листов» на псевдоэлементах: пустой экран без картинки читается
// как ошибка загрузки. Подсказка внизу — текст, а не вторая кнопка:
// две равные кнопки в пустоте превращают выбор в вопрос.
const STYLES = `
:where([data-vibeui-block="card-019"]){
--vibeui-card-019-bg:transparent;
--vibeui-card-019-surface:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-card-019-sheet:light-dark(oklch(0.985 0.003 265),oklch(0.3 0.01 265));
--vibeui-card-019-ink:light-dark(oklch(0.18 0.02 265),oklch(0.98 0.005 265));
--vibeui-card-019-on-accent:light-dark(oklch(0.99 0 0),oklch(0.17 0.015 262));
--vibeui-card-019-fg:light-dark(oklch(0.22 0.015 265),oklch(0.94 0.006 265));
--vibeui-card-019-muted:light-dark(oklch(0.55 0.013 265),oklch(0.71 0.012 265));
--vibeui-card-019-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-card-019-accent:light-dark(oklch(0.55 0.18 262),oklch(0.72 0.15 262));
--vibeui-card-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="card-019"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:2rem 1.5rem 1.75rem;
background:var(--vibeui-card-019-bg);color:var(--vibeui-card-019-fg);
border:1px solid var(--vibeui-card-019-border);border-radius:1rem;
font-family:var(--vibeui-card-019-font);text-align:center;
}
/* Три листа на псевдоэлементах: рисунок без файла и без иконочного шрифта. */
[data-vibeui-block="card-019"] [data-part="art"]{
position:relative;flex:none;width:4.5rem;height:3.5rem;margin-bottom:0.5rem;
}
[data-vibeui-block="card-019"] [data-part="art"] span{
position:absolute;inset-inline-start:50%;inset-block-end:0;
width:2.5rem;height:3rem;border-radius:0.375rem;
border:1px solid var(--vibeui-card-019-border);
background:var(--vibeui-card-019-sheet);
}
[data-vibeui-block="card-019"] [data-part="art"] span:nth-child(1){
transform:translateX(-50%) translateX(-1.15rem) rotate(-11deg);
}
[data-vibeui-block="card-019"] [data-part="art"] span:nth-child(2){
transform:translateX(-50%) translateX(1.15rem) rotate(11deg);
}
[data-vibeui-block="card-019"] [data-part="art"] span:nth-child(3){
transform:translateX(-50%);
border-color:color-mix(in oklab,var(--vibeui-card-019-accent) 35%,var(--vibeui-card-019-border));
background:color-mix(in oklab,var(--vibeui-card-019-accent) 8%,var(--vibeui-card-019-surface));
}
[data-vibeui-block="card-019"] [data-part="title"]{
margin:0;font-size:1.0625rem;font-weight:660;line-height:1.3;letter-spacing:-0.01em;
}
[data-vibeui-block="card-019"] [data-part="description"]{
margin:0;max-width:24rem;font-size:0.875rem;line-height:1.5;
color:var(--vibeui-card-019-muted);text-wrap:pretty;
}
[data-vibeui-block="card-019"] [data-part="action"]{
appearance:none;cursor:pointer;margin-top:0.625rem;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.375rem;padding:0 1.125rem;border-radius:0.625rem;border:0;
background:var(--vibeui-card-019-accent);color:var(--vibeui-card-019-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
transition:background-color .16s ease;
}
[data-vibeui-block="card-019"] [data-part="action"]:hover{
background:color-mix(in oklab,var(--vibeui-card-019-accent) 86%,var(--vibeui-card-019-ink));
}
[data-vibeui-block="card-019"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-card-019-accent);outline-offset:2px;
}
[data-vibeui-block="card-019"] [data-part="action"] svg{flex:none;width:0.875rem;height:0.875rem}
/* Подсказка — текст, а не вторая кнопка: у пустого состояния один выход. */
[data-vibeui-block="card-019"] [data-part="hint"]{
margin:0.375rem 0 0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-card-019-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-019"] *{animation:none!important;transition:none!important}}
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
 * Пустое состояние с одним действием: рисунок, объяснение, кнопка
 * и тихая подсказка. Один файл, ноль зависимостей.
 */
export function Card019({
  title = "Здесь пока нет проектов",
  description = "Проект хранит страницы, блоки и общую тему. Создайте первый — остальное появится внутри него.",
  actionLabel = "Создать проект",
  hint = "Или перенесите существующий: импорт из папки занимает минуту.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Card019Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-019-bg": background,
          "--vibeui-card-019-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-019" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="card-019"
        className={className}
        style={palette}
      >
        <div data-part="art" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <h3 data-part="title">{title}</h3>
        {description ? <p data-part="description">{description}</p> : null}
        <button data-part="action" type="button">
          <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 2.5v9M2.5 7h9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          {actionLabel}
        </button>
        {hint ? <p data-part="hint">{hint}</p> : null}
      </section>
    </>
  )
}

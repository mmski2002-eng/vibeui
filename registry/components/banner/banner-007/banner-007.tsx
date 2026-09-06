import type { ComponentProps, CSSProperties } from "react"

export type Banner007Props = Omit<ComponentProps<"div">, "children"> & {
  title?: string
  /** Дата в человеческом виде: «14 сентября». */
  date?: string
  from?: string
  to?: string
  /** Машиночитаемое значение для <time datetime>. */
  datetime?: string
  note?: string
  /** Шаблон доступного имени: «{title}», «{date}», «{from}», «{to}». */
  labelTemplate?: string
  accent?: string
  /** Подложка полосы. Пусто — остаётся собственная. */
  background?: string
}

// Идея компонента: полоса плановых работ, у которой время — главный герой.
// Слева отдельным блоком стоит окно недоступности, справа объяснение; время
// размечено тегом <time>, поэтому его понимает не только человек.
//
// Тема берётся из color-scheme окружения через light-dark(): тёмная ветка не
// инверсия светлой, блок времени в ней светлее подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="banner-007"]){
--vibeui-banner-007-bg:light-dark(oklch(0.98 0 285),oklch(0.26 0 285));
--vibeui-banner-007-fg:light-dark(oklch(0.26 0.04 39.8),oklch(0.93 0 285));
--vibeui-banner-007-muted:color-mix(in oklab,var(--vibeui-banner-007-fg) 68%,transparent);
--vibeui-banner-007-border:light-dark(oklch(0.88 0 285),oklch(0.4 0 285));
--vibeui-banner-007-slot:light-dark(oklch(0.94 0.04 39.8),oklch(0.34 0.035 39.8));
--vibeui-banner-007-accent:light-dark(oklch(0.5 0.14 39.8),oklch(0.79 0.13 39.8));
/* Акцентом набрана дата на светлой панели: светлота ограничивается сверху,
   иначе светлый акцент проекта растворяется в подложке. */
--vibeui-banner-007-accent-ink:oklch(from var(--vibeui-banner-007-accent) min(l,0.62) c h);
--vibeui-banner-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="banner-007"]{color-scheme:dark}
[data-vibeui-block="banner-007"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
font-family:var(--vibeui-banner-007-font);color:var(--vibeui-banner-007-fg);
}
[data-vibeui-block="banner-007"] [data-part="shell"]{
display:flex;align-items:stretch;gap:0.9375rem;
box-sizing:border-box;padding:0.9375rem 1rem;
border:1px solid var(--vibeui-banner-007-border);border-radius:1rem;
background:var(--vibeui-banner-007-bg);
}
/* Окно недоступности вынесено в отдельный блок: это главная величина. */
[data-vibeui-block="banner-007"] [data-part="slot"]{
flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;
min-width:5.5rem;padding:0.5rem 0.75rem;box-sizing:border-box;
border-radius:0.75rem;background:var(--vibeui-banner-007-slot);
text-align:center;
}
[data-vibeui-block="banner-007"] [data-part="date"]{font-size:0.75rem;color:var(--vibeui-banner-007-muted)}
[data-vibeui-block="banner-007"] [data-part="range"]{
font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="banner-007"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;justify-content:center;min-width:0}
[data-vibeui-block="banner-007"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.35}
[data-vibeui-block="banner-007"] [data-part="note"]{margin:0;font-size:0.875rem;line-height:1.45;color:var(--vibeui-banner-007-muted)}
[data-vibeui-block="banner-007"] [data-part="note"] b{color:var(--vibeui-banner-007-accent-ink);font-weight:650}
@container (max-width: 26rem){
[data-vibeui-block="banner-007"] [data-part="shell"]{flex-direction:column;gap:0.75rem}
[data-vibeui-block="banner-007"] [data-part="slot"]{align-items:flex-start;text-align:left;width:100%}
}
@container (min-width: 32rem){
[data-vibeui-block="banner-007"] [data-part="shell"]{padding:1.0625rem 1rem}
[data-vibeui-block="banner-007"] [data-part="title"]{font-size:1rem}
[data-vibeui-block="banner-007"] [data-part="range"]{font-size:1rem}
[data-vibeui-block="banner-007"] [data-part="note"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-007"] *{animation:none!important;transition:none!important}}
`

function fill(template: string, values: Record<string, string>): string {
  return template.replace(
    /\{(\w+)\}/g,
    (placeholder, key: string) => values[key] ?? placeholder,
  )
}

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
 * Полоса плановых работ с окном недоступности, размеченным тегом time.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner007({
  title = "Плановые работы с базой данных",
  date = "14 сентября",
  from = "02:00",
  to = "04:30",
  datetime = "2026-09-14T02:00",
  note = "Каталог останется доступен только на чтение. Публикация и загрузка файлов не сработают.",
  labelTemplate = "{title}: {date}, с {from} до {to}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Banner007Props) {
  const palette = {
    ...(accent ? { "--vibeui-banner-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-banner-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-banner-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="banner"
        data-vibeui-block="banner-007"
        role="region"
        aria-label={fill(labelTemplate, { title, date, from, to })}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <time data-part="slot" dateTime={datetime}>
            <span data-part="date">{date}</span>
            <span data-part="range">
              {from}–{to}
            </span>
          </time>
          <div data-part="text">
            <p data-part="title">{title}</p>
            <p data-part="note">{note}</p>
          </div>
        </div>
      </div>
    </>
  )
}

import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type Comparison001Row = {
  feature: string
  us: boolean
  them: boolean
}

export type Comparison001Props = {
  eyebrow?: string
  title?: string
  usLabel?: string
  themLabel?: string
  rows?: Comparison001Row[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Сравнительная таблица «мы против них»: строки возможностей и две колонки
// с галочками. Наша колонка выделена брендовым фоном шапки, галочки — CSS
// без иконочного шрифта, минусы — приглушённое тире. Формат «почему мы»
// для страницы сравнения с конкурентом.
const STYLES = `[data-vibeui-block="comparison-001"] [data-part="heading"]{margin-bottom:2rem}

:where([data-vibeui-block="comparison-001"]){
--vibeui-comparison-001-bg:transparent;
--vibeui-comparison-001-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-comparison-001-muted:light-dark(oklch(0.55 0 0),oklch(0.65 0 0));
--vibeui-comparison-001-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-comparison-001-head:light-dark(oklch(0.97 0 0),oklch(0.22 0 0));
--vibeui-comparison-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-comparison-001-on-accent:oklch(from var(--vibeui-comparison-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-comparison-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="comparison-001"]{color-scheme:dark}
[data-vibeui-block="comparison-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-comparison-001-bg);color:var(--vibeui-comparison-001-ink);
font-family:var(--vibeui-comparison-001-font);
}
[data-vibeui-block="comparison-001"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="comparison-001"] [data-part="table"]{width:100%;border-collapse:collapse;font-size:0.9375rem}
[data-vibeui-block="comparison-001"] [data-part="th"]{
padding:0.875rem 1rem;text-align:center;font-weight:700;font-size:0.875rem;
border-bottom:1px solid var(--vibeui-comparison-001-border);
}
[data-vibeui-block="comparison-001"] [data-part="th"]:first-child{text-align:left}
[data-vibeui-block="comparison-001"] [data-part="th"][data-us="true"]{
background:var(--vibeui-comparison-001-accent);color:oklch(from var(--vibeui-comparison-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
border-top-left-radius:0.625rem;border-top-right-radius:0.625rem;
}
[data-vibeui-block="comparison-001"] [data-part="td"]{padding:0.75rem 1rem;text-align:center;border-bottom:1px solid var(--vibeui-comparison-001-border)}
[data-vibeui-block="comparison-001"] [data-part="td"]:first-child{text-align:left;font-weight:500}
[data-vibeui-block="comparison-001"] [data-part="td"][data-us="true"]{background:color-mix(in oklab,var(--vibeui-comparison-001-accent) 8%,transparent)}
[data-vibeui-block="comparison-001"] [data-part="yes"]{
display:inline-block;width:1.25rem;height:1.25rem;position:relative;
}
[data-vibeui-block="comparison-001"] [data-part="yes"]::before{
content:"";position:absolute;left:0.375rem;top:0.1875rem;width:0.375rem;height:0.6875rem;
border:solid var(--vibeui-comparison-001-accent);border-width:0 2px 2px 0;transform:rotate(45deg);
}
[data-vibeui-block="comparison-001"] [data-part="no"]{color:var(--vibeui-comparison-001-muted);font-size:1.125rem;line-height:1}
@container (min-width: 40rem){[data-vibeui-block="comparison-001"] [data-part="shell"]{padding:4rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="comparison-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Comparison001Row[] = [
  { feature: "Ноль зависимостей у компонента", us: true, them: false },
  { feature: "Копирование файла в проект", us: true, them: true },
  { feature: "Инструкция для ИИ-агента", us: true, them: false },
  { feature: "Собственная палитра без токенов темы", us: true, them: false },
  { feature: "Работает без сборки", us: true, them: true },
  { feature: "Привязка к своей библиотеке", us: false, them: true },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Сравнительная таблица «мы против них»: строки возможностей, две колонки галочек. */
export function Comparison001({
  eyebrow = "Сравнение",
  title = "Почему VibeUI, а не обычная библиотека",
  usLabel = "VibeUI",
  themLabel = "Обычная библиотека",
  rows = DEFAULT_ROWS,
  background = "",
  accent,
  className,
  style,
}: Comparison001Props) {
  const palette = {
    ...(accent ? { "--vibeui-comparison-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-comparison-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-comparison-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="comparison-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            align="center"
            accent={accent}
          />
          <table data-part="table">
            <thead>
              <tr>
                <th data-part="th" scope="col">
                  Возможность
                </th>
                <th data-part="th" data-us="true" scope="col">
                  {usLabel}
                </th>
                <th data-part="th" scope="col">
                  {themLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature}>
                  <td data-part="td">{row.feature}</td>
                  <td data-part="td" data-us="true">
                    {row.us ? (
                      <span data-part="yes" aria-label="Есть" />
                    ) : (
                      <span data-part="no" aria-label="Нет">
                        —
                      </span>
                    )}
                  </td>
                  <td data-part="td">
                    {row.them ? (
                      <span data-part="yes" aria-label="Есть" />
                    ) : (
                      <span data-part="no" aria-label="Нет">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

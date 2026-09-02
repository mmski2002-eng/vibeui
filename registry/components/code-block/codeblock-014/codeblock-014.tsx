import type { CSSProperties } from "react"

export type Codeblock014Props = {
  rows?: number
  label?: string
  /** Пусто — подложки нет, скелетон лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: скелетон именно кода, а не абзаца. Ширины и отступы строк
// повторяют форму листинга — вложенность, пустая строка, короткая закрывающая
// скобка, — поэтому подмена на настоящий код не дёргает раскладку.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, полосы проступают на фоне страницы и темнеют вместе с ней.
const STYLES = `
:where([data-vibeui-block="codeblock-014"]){
--vibeui-codeblock-014-bg:transparent;
--vibeui-codeblock-014-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-014-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 12%));
--vibeui-codeblock-014-bar:light-dark(oklch(0 0 0 / 9%),oklch(1 0 0 / 11%));
--vibeui-codeblock-014-shine:light-dark(oklch(1 0 0 / 62%),oklch(1 0 0 / 22%));
--vibeui-codeblock-014-row:1.375rem;
}
[data-vibeui-block="codeblock-014"]{
display:block;width:100%;max-width:30rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-codeblock-014-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-014-bg);
}
[data-vibeui-block="codeblock-014"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.5625rem 0.875rem;
background:var(--vibeui-codeblock-014-head);
border-bottom:1px solid var(--vibeui-codeblock-014-border);
}
[data-vibeui-block="codeblock-014"] [data-part="body"]{
padding:0.75rem 0.875rem;
}
[data-vibeui-block="codeblock-014"] [data-part="row"]{
display:flex;align-items:center;height:var(--vibeui-codeblock-014-row);
}
[data-vibeui-block="codeblock-014"] [data-part="bar"]{
display:block;height:0.5rem;border-radius:999px;
background:var(--vibeui-codeblock-014-bar);
background-image:linear-gradient(90deg,transparent 0%,var(--vibeui-codeblock-014-shine) 50%,transparent 100%);
background-size:220% 100%;background-repeat:no-repeat;
animation:vibeui-codeblock-014-sweep 1.5s ease-in-out infinite;
}
[data-vibeui-block="codeblock-014"] [data-part="head"] [data-part="bar"]{height:0.625rem}
[data-vibeui-block="codeblock-014"] [data-part="gap"]{display:block;height:0.5rem;width:0}
[data-vibeui-block="codeblock-014"] [data-part="label"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
border:0;clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
@keyframes vibeui-codeblock-014-sweep{
from{background-position:120% 0}
to{background-position:-120% 0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-014"] *{animation:none!important;transition:none!important}}
`

// Форма листинга: отступ вложенности и доля ширины строки. Значения заданы
// таблицей, а не случайным числом: случайное разъезжается между сервером и
// клиентом и портит гидратацию.
const SHAPE = [
  { indent: 0, width: 62 },
  { indent: 1, width: 78 },
  { indent: 1, width: 45 },
  { indent: 2, width: 70 },
  { indent: 1, width: 0 },
  { indent: 1, width: 54 },
  { indent: 0, width: 18 },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы полосам
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

/** Скелетон загрузки блока кода: шапка и строки формы листинга. */
export function Codeblock014({
  rows = 6,
  label = "Загрузка кода",
  background = "",
  className,
  style,
}: Codeblock014Props) {
  const count = Math.max(1, Math.round(rows))
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-014" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="codeblock-014"
        className={className}
        style={palette}
        role="status"
        aria-busy="true"
      >
        <span data-part="label">{label}</span>
        <div data-part="head" aria-hidden="true">
          <span data-part="bar" style={{ width: "35%" }} />
          <span data-part="bar" style={{ width: "12%" }} />
        </div>
        <div data-part="body" aria-hidden="true">
          {Array.from({ length: count }, (_, index) => {
            const shape = SHAPE[index % SHAPE.length]

            return (
              <div data-part="row" key={index}>
                {shape.width === 0 ? (
                  <span data-part="gap" />
                ) : (
                  <span
                    data-part="bar"
                    style={{
                      marginInlineStart: `${shape.indent * 1.25}rem`,
                      width: `${shape.width}%`,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

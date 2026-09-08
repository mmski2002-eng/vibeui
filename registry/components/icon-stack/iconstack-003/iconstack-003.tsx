import type { ComponentProps, CSSProperties } from "react"

export type Iconstack003Props = Omit<ComponentProps<"details">, "children"> & {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  avatarImage?: string
  names?: string[]
  max?: number
  label?: string
  /** Пусто — подложки нет, стопка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: «+N» не тупик, а вход в полный список. Стопка лежит
// внутри summary, поэтому раскрытие работает на details без строчки
// клиентского кода и без состояния. Кому нужны остальные — раскрывает и
// читает имена; кому нет — видит компактную строку. Счётчик стоит слева от
// стопки, потому что справа он читается как ещё один участник.
const STYLES = `
:where([data-vibeui-block="iconstack-003"]){
--vibeui-iconstack-003-size:1.875rem;
--vibeui-iconstack-003-overlap:0.5625rem;
--vibeui-iconstack-003-surface:transparent;
--vibeui-iconstack-003-ring:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-iconstack-003-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-iconstack-003-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-iconstack-003-muted:color-mix(in oklab,var(--vibeui-iconstack-003-fg) 68%,transparent);
--vibeui-iconstack-003-more-bg:light-dark(oklch(0.28 0 265),oklch(0.86 0 265));
--vibeui-iconstack-003-more-fg:light-dark(oklch(0.99 0 0),oklch(0.2 0 265));
--vibeui-iconstack-003-focus:light-dark(oklch(0.55 0.17 39.8 / 60%),oklch(0.76 0.15 39.8 / 70%));
--vibeui-iconstack-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="iconstack-003"]{color-scheme:dark}
/* Подложки по умолчанию нет: карточка лежит на фоне страницы. */
[data-vibeui-block="iconstack-003"]{
display:inline-block;box-sizing:border-box;
min-width:14rem;padding:0.5rem 0.75rem;
background:var(--vibeui-iconstack-003-surface);
border:1px solid var(--vibeui-iconstack-003-border);border-radius:0.875rem;
font-family:var(--vibeui-iconstack-003-font);color:var(--vibeui-iconstack-003-fg);
}
[data-vibeui-block="iconstack-003"] summary{
display:flex;align-items:center;gap:0.625rem;cursor:pointer;list-style:none;
padding:0.25rem;margin:-0.25rem;border-radius:0.625rem;
}
[data-vibeui-block="iconstack-003"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="iconstack-003"] summary:focus-visible{outline:2px solid var(--vibeui-iconstack-003-focus);outline-offset:2px}
[data-vibeui-block="iconstack-003"] [data-part="stack"]{
display:inline-flex;flex-direction:row-reverse;justify-content:flex-end;flex:none;
}
[data-vibeui-block="iconstack-003"] [data-part="stack"] > *{
margin-right:calc(var(--vibeui-iconstack-003-overlap) * -1);
}
[data-vibeui-block="iconstack-003"] [data-part="stack"] > *:first-child{margin-right:0}
[data-vibeui-block="iconstack-003"] [data-part="face"],
[data-vibeui-block="iconstack-003"] [data-part="more"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;box-sizing:border-box;
width:var(--vibeui-iconstack-003-size);height:var(--vibeui-iconstack-003-size);
border-radius:9999px;border:2px solid var(--vibeui-iconstack-003-ring);
font-size:0.625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="iconstack-003"] [data-part="face"]{
position:relative;color:light-dark(oklch(0.36 0.12 var(--vibeui-iconstack-003-hue,265)),oklch(0.88 0.08 var(--vibeui-iconstack-003-hue,265)));overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="iconstack-003"] [data-part="face"][data-empty="true"]{background:light-dark(oklch(0.9 0.06 var(--vibeui-iconstack-003-hue,265)),oklch(0.36 0.07 var(--vibeui-iconstack-003-hue,265)));}
[data-vibeui-block="iconstack-003"] [data-part="face"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
/* Счётчик слева от стопки: справа он читается как ещё один участник. */
[data-vibeui-block="iconstack-003"] [data-part="more"]{
background:var(--vibeui-iconstack-003-more-bg);color:var(--vibeui-iconstack-003-more-fg);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="iconstack-003"] [data-part="summary-text"]{
font-size:0.8125rem;color:var(--vibeui-iconstack-003-muted);
}
[data-vibeui-block="iconstack-003"] [data-part="chevron"]{
margin-left:auto;flex:none;font-size:0.6875rem;color:var(--vibeui-iconstack-003-muted);
transition:transform .16s ease;
}
[data-vibeui-block="iconstack-003"][open] [data-part="chevron"]{transform:rotate(180deg)}
[data-vibeui-block="iconstack-003"] ul{
list-style:none;margin:0.625rem 0 0;padding:0.625rem 0 0;
border-top:1px solid var(--vibeui-iconstack-003-border);
display:flex;flex-direction:column;gap:0.375rem;
font-size:0.8125rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="iconstack-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAMES = [
  "Анна Реброва",
  "Илья Мохов",
  "Ким Сон",
  "Пётр Гай",
  "Мария Лоза",
  "Олег Дин",
  "Ната Кир",
]

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
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
 * Стопка со счётчиком «+N», раскрывающая полный список на details.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Iconstack003({
  names = DEFAULT_NAMES,
  max = 4,
  label = "участников",
  avatarImage = "",
  background = "",
  className,
  style,
  ...props
}: Iconstack003Props) {
  const shown = names.slice(0, max)
  const rest = names.length - shown.length
  // Обводка кружка равна подложке: заданный фон красит и её, иначе стопка
  // останется в контуре прежнего фона.
  const palette = {
    ...(background
      ? {
          "--vibeui-iconstack-003-surface": background,
          "--vibeui-iconstack-003-ring": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-iconstack-003" precedence="medium">
        {STYLES}
      </style>
      <details
        {...props}
        data-slot="icon-stack"
        data-vibeui-block="iconstack-003"
        className={className}
        style={palette}
      >
        <summary>
          <span data-part="stack" aria-hidden="true">
            {[...shown].reverse().map((name) => (
              <span
                key={name}
                data-part="face"
                data-empty={avatarImage ? undefined : "true"}
                style={
                  { "--vibeui-iconstack-003-hue": hue(name) } as CSSProperties
                }
              >
                {avatarImage ? (
                  <img
                    src={avatarImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                {initials(name)}
              </span>
            ))}
            {rest > 0 ? <span data-part="more">+{rest}</span> : null}
          </span>
          <span data-part="summary-text">
            {names.length} {label}
          </span>
          <span data-part="chevron" aria-hidden="true">
            ▾
          </span>
        </summary>
        <ul>
          {names.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </details>
    </>
  )
}

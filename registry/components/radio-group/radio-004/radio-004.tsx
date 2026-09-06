import type { ComponentProps, CSSProperties } from "react"

export type Radio004Option = {
  value: string
  label: string
  description: string
  meta?: string
}

export type Radio004Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  options?: Radio004Option[]
  name?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: варианты с последствиями. Когда выбор меняет поведение
// системы, одной подписи мало — под каждым пунктом стоит объяснение, а
// справа короткая метка вроде «по умолчанию». Карточек нет: список разделён
// линиями, выбранная строка помечена цветной полосой слева.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-004"]){
--vibeui-radio-004-bg:transparent;
--vibeui-radio-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-radio-004-muted:color-mix(in oklab,var(--vibeui-radio-004-fg) 68%,transparent);
--vibeui-radio-004-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-radio-004-ring:light-dark(oklch(0.74 0 265),oklch(0.53 0 265));
--vibeui-radio-004-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-radio-004-tint:light-dark(oklch(0.24 0.015 265 / 6%),oklch(0.93 0.006 265 / 12%));
--vibeui-radio-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-004"]{color-scheme:dark}
[data-vibeui-block="radio-004"]{
display:flex;flex-direction:column;
width:100%;max-width:23rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.5rem;
background:var(--vibeui-radio-004-bg);
border:1px solid var(--vibeui-radio-004-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-004-font);color:var(--vibeui-radio-004-fg);
}
[data-vibeui-block="radio-004"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.25rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-radio-004-muted);
}
[data-vibeui-block="radio-004"] [data-part="list"]{clear:both;display:flex;flex-direction:column}
[data-vibeui-block="radio-004"] [data-part="option"]{
position:relative;display:flex;align-items:flex-start;gap:0.625rem;
padding:0.75rem 0.5rem 0.75rem 0.75rem;margin:0 -0.5rem 0 -0.375rem;
border-radius:0.5rem;cursor:pointer;
transition:background-color .16s ease;
}
[data-vibeui-block="radio-004"] [data-part="option"] + [data-part="option"]{
box-shadow:inset 0 1px 0 var(--vibeui-radio-004-border);
}
/* Полоса слева вместо рамки вокруг: список остаётся сплошным, а выбранный
   пункт всё равно виден периферийным зрением. */
[data-vibeui-block="radio-004"] [data-part="option"]::before{
content:"";position:absolute;left:0;top:0.625rem;bottom:0.625rem;
width:0.1875rem;border-radius:9999px;background:transparent;
}
[data-vibeui-block="radio-004"] [data-part="option"]:has(input:checked){background:var(--vibeui-radio-004-tint)}
[data-vibeui-block="radio-004"] [data-part="option"]:has(input:checked)::before{background:var(--vibeui-radio-004-accent)}
[data-vibeui-block="radio-004"] input{
appearance:none;-webkit-appearance:none;flex:none;margin:0.125rem 0 0;cursor:pointer;
width:1.125rem;height:1.125rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-004-ring);
background:transparent;
}
/* Точка нарисована фоном самого кружка: внутренней тенью зазор пришлось бы
   закрашивать цветом подложки, а подложки у компонента по умолчанию нет. */
[data-vibeui-block="radio-004"] input:checked{
border-color:var(--vibeui-radio-004-accent);
background:radial-gradient(circle at 50% 50%,var(--vibeui-radio-004-accent) 0 0.25rem,transparent 0.25rem);
}
[data-vibeui-block="radio-004"] input:focus-visible{outline:2px solid var(--vibeui-radio-004-accent);outline-offset:2px}
[data-vibeui-block="radio-004"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;flex:1 1 auto;min-width:0}
/* Пометка переносится на свою строку, а не отжимает название: в узкой
   колонке «Только я» иначе рвалось по слову. */
[data-vibeui-block="radio-004"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.25rem 0.5rem;font-size:0.875rem;font-weight:600;line-height:1.3;
}
[data-vibeui-block="radio-004"] [data-part="meta"]{
flex:none;white-space:nowrap;
font-size:0.625rem;font-weight:600;letter-spacing:0.03em;
text-transform:uppercase;color:var(--vibeui-radio-004-muted);
}
[data-vibeui-block="radio-004"] [data-part="description"]{
font-size:0.75rem;line-height:1.45;color:var(--vibeui-radio-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Radio004Option[] = [
  {
    value: "private",
    label: "Только я",
    description:
      "Проект не виден никому, ссылка не работает даже по прямому адресу.",
    meta: "по умолчанию",
  },
  {
    value: "link",
    label: "По ссылке",
    description:
      "Открывается у всех, кто получил ссылку, но не индексируется поиском.",
  },
  {
    value: "public",
    label: "Публичный",
    description: "Попадает в общую галерею и может быть найден поисковиками.",
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
 * Радиогруппа с объяснением под каждым вариантом и полосой у выбранного.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio004({
  legend = "Доступ к проекту",
  options = DEFAULT_OPTIONS,
  name = "vibeui-radio-004",
  defaultValue = "link",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio004Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-004" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="radio-group"
        data-vibeui-block="radio-004"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <form data-part="list">
          {options.map((option) => (
            <label key={option.value} data-part="option">
              <input
                type="radio"
                name={name}
                value={option.value}
                defaultChecked={option.value === defaultValue}
              />
              <span data-part="text">
                <span data-part="head">
                  {option.label}
                  {option.meta ? (
                    <span data-part="meta">{option.meta}</span>
                  ) : null}
                </span>
                <span data-part="description">{option.description}</span>
              </span>
            </label>
          ))}
        </form>
      </fieldset>
    </>
  )
}

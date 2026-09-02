import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup006Action = {
  id: string
  label: string
}

export type Buttongroup006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  actions?: Buttongroup006Action[]
  label?: string
  shape?: "square" | "round"
  /** Пусто — подложки нет, кнопки лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: группа из одних значков, у которой имя есть у каждой
// кнопки. Подпись лежит внутри кнопки текстом и спрятана clip-path — так её
// читает скринридер и находит поиск по странице. Видимая подсказка над
// значком — отдельный aria-hidden узел, чтобы имя не прочиталось дважды.
// Показывается она и по наведению, и по :focus-visible: с клавиатуры набор
// безымянных значков иначе неразличим.
const STYLES = `
:where([data-vibeui-block="buttongroup-006"]){
--vibeui-buttongroup-006-surface:transparent;
--vibeui-buttongroup-006-fg:light-dark(oklch(0.27 0.016 265),oklch(0.94 0.006 265));
--vibeui-buttongroup-006-muted:light-dark(oklch(0.53 0.014 265),oklch(0.7 0.012 265));
--vibeui-buttongroup-006-border:light-dark(oklch(0.88 0.008 265),oklch(0.37 0.012 265));
--vibeui-buttongroup-006-hover:light-dark(oklch(0.96 0.004 265),oklch(0.3 0.012 265));
--vibeui-buttongroup-006-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-buttongroup-006-tip:light-dark(oklch(0.24 0.016 265),oklch(0.86 0.01 265));
--vibeui-buttongroup-006-tip-fg:light-dark(oklch(0.99 0 0),oklch(0.2 0.014 265));
--vibeui-buttongroup-006-radius:0.625rem;
--vibeui-buttongroup-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-006"]{
box-sizing:border-box;display:inline-flex;isolation:isolate;
font-family:var(--vibeui-buttongroup-006-font);
}
[data-vibeui-block="buttongroup-006"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-006"][data-shape="round"]{--vibeui-buttongroup-006-radius:9999px}
[data-vibeui-block="buttongroup-006"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-006-border);
background:var(--vibeui-buttongroup-006-surface);
color:var(--vibeui-buttongroup-006-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-006"] button:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-006-radius);
border-end-start-radius:var(--vibeui-buttongroup-006-radius);
}
[data-vibeui-block="buttongroup-006"] button:last-child{
border-start-end-radius:var(--vibeui-buttongroup-006-radius);
border-end-end-radius:var(--vibeui-buttongroup-006-radius);
}
[data-vibeui-block="buttongroup-006"] button:hover{
z-index:1;
background:var(--vibeui-buttongroup-006-hover);
color:var(--vibeui-buttongroup-006-fg);
}
/* Обводка поднята над соседями: границы схлопнуты, и без z-index её левый
   край уходит под следующую кнопку. */
[data-vibeui-block="buttongroup-006"] button:focus-visible{
z-index:2;
outline:2px solid var(--vibeui-buttongroup-006-accent);outline-offset:1px;
color:var(--vibeui-buttongroup-006-fg);
}
[data-vibeui-block="buttongroup-006"] svg{width:1.0625rem;height:1.0625rem}
/* Имя кнопки: остаётся текстом в доступном дереве, но не занимает места. */
[data-vibeui-block="buttongroup-006"] [data-part="name"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-006"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.4375rem);left:50%;translate:-50% 0;
padding:0.1875rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-buttongroup-006-tip);color:var(--vibeui-buttongroup-006-tip-fg);
font-size:0.6875rem;font-weight:600;line-height:1.3;white-space:nowrap;
opacity:0;pointer-events:none;
transition:opacity .14s ease;
}
[data-vibeui-block="buttongroup-006"] button:hover [data-part="tip"],
[data-vibeui-block="buttongroup-006"] button:focus-visible [data-part="tip"]{opacity:1}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS: Buttongroup006Action[] = [
  { id: "undo", label: "Отменить" },
  { id: "redo", label: "Повторить" },
  { id: "copy", label: "Скопировать" },
  { id: "share", label: "Поделиться" },
]

const ICONS: Record<string, string> = {
  undo: "M7 5 3.5 8.5 7 12M3.5 8.5h7.5a4 4 0 0 1 0 8H8",
  redo: "M12 5l3.5 3.5L12 12m3.5-3.5H8a4 4 0 0 0 0 8h3",
  copy: "M6.5 6.5V4.2c0-.4.3-.7.7-.7h7.6c.4 0 .7.3.7.7v7.6c0 .4-.3.7-.7.7h-2.3M3.5 7.9c0-.4.3-.7.7-.7h7.6c.4 0 .7.3.7.7v7.6c0 .4-.3.7-.7.7H4.2a.7.7 0 0 1-.7-.7z",
  share:
    "M9.5 12.5v-9m0 0L6.3 6.7M9.5 3.5l3.2 3.2M4 11v4.3c0 .4.3.7.7.7h9.6c.4 0 .7-.3.7-.7V11",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Группа значков без подписей, но с именем у каждой кнопки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup006({
  actions = DEFAULT_ACTIONS,
  label = "Быстрые действия",
  shape = "square",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup006Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="buttongroup-006"
        data-shape={shape}
        role="group"
        aria-label={label}
        className={className}
        style={palette}
      >
        {actions.map((action) => (
          <button key={action.id} type="button">
            <svg viewBox="0 0 19 19" fill="none" aria-hidden="true">
              <path
                d={ICONS[action.id] ?? ICONS.copy}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span data-part="name">{action.label}</span>
            <span data-part="tip" aria-hidden="true">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

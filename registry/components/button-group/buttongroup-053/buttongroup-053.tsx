import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup053Action = {
  id: string
  label: string
}

export type Buttongroup053Props = Omit<ComponentProps<"div">, "children"> & {
  actions?: Buttongroup053Action[]
  label?: string
  /** Пусто — заливки нет, панель ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: панель действий во всю ширину экрана телефона. Кнопки
// делят ширину поровну через flex:1 1 0 — именно нулевая основа, иначе
// «Поделиться» заберёт себе больше «Чат». Значок стоит над подписью, потому
// что в строку они на 90 пикселях не помещаются; подпись обрезается
// ellipsis, а не переносится, чтобы высота панели была одинаковой у всех
// кнопок. Высота цели 3.25rem плюс env(safe-area-inset-bottom): панель
// обычно липнет к нижнему краю, где проходит системный жест.
const STYLES = `
:where([data-vibeui-block="buttongroup-053"]){
--vibeui-buttongroup-053-surface:transparent;
--vibeui-buttongroup-053-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-053-muted:color-mix(in oklab,var(--vibeui-buttongroup-053-fg) 68%,transparent);
--vibeui-buttongroup-053-border:light-dark(oklch(0.9 0 265),oklch(0.4 0 265));
--vibeui-buttongroup-053-hover:light-dark(oklch(0.975 0 265),oklch(0.32 0 265));
--vibeui-buttongroup-053-press:light-dark(oklch(0.95 0 265),oklch(0.37 0 265));
--vibeui-buttongroup-053-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-buttongroup-053-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-053"]{color-scheme:dark}
[data-vibeui-block="buttongroup-053"]{
box-sizing:border-box;display:flex;width:100%;max-width:26rem;
padding-bottom:env(safe-area-inset-bottom,0px);
border-top:1px solid var(--vibeui-buttongroup-053-border);
background:var(--vibeui-buttongroup-053-surface);
font-family:var(--vibeui-buttongroup-053-font);
}
[data-vibeui-block="buttongroup-053"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-053"] button{
appearance:none;cursor:pointer;font:inherit;
flex:1 1 0;min-width:0;
display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:0.25rem;
height:3.25rem;padding:0 0.25rem;
border:0;background:transparent;
color:var(--vibeui-buttongroup-053-muted);
font-size:0.6875rem;font-weight:650;line-height:1.1;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="buttongroup-053"] button + button{
border-inline-start:1px solid var(--vibeui-buttongroup-053-border);
}
[data-vibeui-block="buttongroup-053"] svg{
width:1.25rem;height:1.25rem;flex:none;
stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;
}
/* Подпись обрезается, а не переносится: высота панели остаётся одной. */
[data-vibeui-block="buttongroup-053"] [data-part="text"]{
max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="buttongroup-053"] button:hover{
color:var(--vibeui-buttongroup-053-fg);background:var(--vibeui-buttongroup-053-hover);
}
[data-vibeui-block="buttongroup-053"] button:active{background:var(--vibeui-buttongroup-053-press)}
[data-vibeui-block="buttongroup-053"] button:focus-visible{
outline:2px solid var(--vibeui-buttongroup-053-accent);outline-offset:-3px;
color:var(--vibeui-buttongroup-053-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-053"] *{animation:none!important;transition:none!important}}
`

const ICONS: Record<string, string> = {
  call: "M6 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2",
  chat: "M4 5h16v10H8l-4 4z",
  route:
    "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11M12 8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5",
  share: "M12 15V4M8 8l4-4 4 4M5 15v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4",
}

const DEFAULT_ACTIONS: Buttongroup053Action[] = [
  { id: "call", label: "Позвонить" },
  { id: "chat", label: "Написать" },
  { id: "route", label: "Маршрут" },
  { id: "share", label: "Поделиться" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
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
 * Панель действий во всю ширину: равные доли, значок над подписью, safe-area.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup053({
  actions = DEFAULT_ACTIONS,
  label = "Действия с контактом",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup053Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-053-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-053-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-053" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-053"
        className={className}
        style={palette}
        role="group"
        aria-label={label}
      >
        {actions.map((action) => (
          <button key={action.id} type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={ICONS[action.id] ?? ICONS.chat} />
            </svg>
            <span data-part="text">{action.label}</span>
          </button>
        ))}
      </div>
    </>
  )
}

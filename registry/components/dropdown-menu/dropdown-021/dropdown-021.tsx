"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Dropdown021Status = {
  value: string
  label: string
  /** Строка под подписью: что статус означает для коллег. */
  hint?: string
  /** Оттенок точки в градусах OKLCH: 145 — зелёный, 85 — жёлтый, 25 — красный. */
  hue?: number
}

export type Dropdown021Props = Omit<ComponentProps<"div">, "children"> & {
  id?: string
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  /** Имя рядом с аватаром — оно же даёт инициалы. */
  name?: string
  /** Выбранный статус: значение из statuses. */
  onSelect?: (value: string) => void
  /** Заголовок над списком статусов. */
  title?: string
  statuses?: Dropdown021Status[]
  /** value выбранного статуса. */
  status?: string
  /** Строка внизу меню: до какого времени держится «не беспокоить». */
  until?: string
  accent?: string
  /** Подложка компонента. Пусто — фон страницы просвечивает. */
  background?: string
}

// Идея компонента: меню присутствия. Точка на аватаре повторяет выбранный
// статус, поэтому состояние видно и с закрытым меню — иначе выбор пропадает
// сразу после закрытия и его приходится проверять заново.
//
// Список — радиогруппа, а не команды: статус выбирают, и выбранный остаётся
// отмеченным. Группа лежит в собственной <form>, потому что радиокнопки
// объединяются по владельцу формы и имени: два таких меню на странице без
// формы слились бы в одну группу и гасили друг друга.
const STYLES = `
:where([data-vibeui-block="dropdown-021"]){
--vibeui-dropdown-021-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-dropdown-021-muted:color-mix(in oklab,var(--vibeui-dropdown-021-fg) 60%,transparent);
--vibeui-dropdown-021-bg:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-dropdown-021-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-dropdown-021-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.86 0 265 / 12%));
--vibeui-dropdown-021-accent:light-dark(oklch(0.52 0.19 262),oklch(0.72 0.16 262));
--vibeui-dropdown-021-radius:0.75rem;
--vibeui-dropdown-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-021"]{color-scheme:dark}
[data-vibeui-block="dropdown-021"]{
display:inline-flex;font-family:var(--vibeui-dropdown-021-font);
}
[data-vibeui-block="dropdown-021"] *{box-sizing:border-box}
[data-vibeui-block="dropdown-021"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
min-height:2.25rem;padding:0.25rem 0.75rem 0.25rem 0.3125rem;
border:1px solid var(--vibeui-dropdown-021-border);border-radius:999px;
background:var(--vibeui-dropdown-021-bg);color:var(--vibeui-dropdown-021-fg);
font:inherit;font-size:0.8125rem;font-weight:550;line-height:1.3;
anchor-name:--vibeui-dropdown-021-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-021"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-021-hover)}
[data-vibeui-block="dropdown-021"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-021-accent);outline-offset:2px}
/* Аватар и точка: точка сидит в вырезе, поэтому остаётся видна на любом фоне. */
[data-vibeui-block="dropdown-021"] [data-part="face"]{
position:relative;flex:none;
display:grid;place-items:center;
inline-size:1.625rem;block-size:1.625rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-dropdown-021-accent) 18%,transparent);
color:var(--vibeui-dropdown-021-fg);
font-size:0.6875rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="dropdown-021"] [data-part="dot"]{
position:absolute;inset-block-end:-0.0625rem;inset-inline-end:-0.0625rem;
inline-size:0.6875rem;block-size:0.6875rem;border-radius:999px;
background:oklch(0.68 0.17 var(--vibeui-dropdown-021-hue,145));
box-shadow:0 0 0 2px var(--vibeui-dropdown-021-bg);
}
[data-vibeui-block="dropdown-021"] [data-part="chevron"]{
inline-size:0.375rem;block-size:0.375rem;
border-right:1.5px solid var(--vibeui-dropdown-021-muted);
border-bottom:1.5px solid var(--vibeui-dropdown-021-muted);
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
}
[data-vibeui-dropdown-021-menu]{
position:fixed;margin:0;padding:0.375rem;
min-inline-size:16rem;box-sizing:border-box;
border:1px solid var(--vibeui-dropdown-021-border,light-dark(oklch(0.9 0 265),oklch(0.37 0 265)));
border-radius:var(--vibeui-dropdown-021-radius,0.75rem);
background:var(--vibeui-dropdown-021-bg,light-dark(oklch(1 0 0),oklch(0.25 0 265)));
color:var(--vibeui-dropdown-021-fg,light-dark(oklch(0.24 0 265),oklch(0.94 0 265)));
font-family:var(--vibeui-dropdown-021-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 18px 40px -20px oklch(0.2 0 265 / 48%);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .16s ease,transform .16s ease,display .16s allow-discrete,overlay .16s allow-discrete;
}
[data-vibeui-dropdown-021-menu]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dropdown-021-menu]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-dropdown-021-menu]{
position-anchor:--vibeui-dropdown-021-anchor;
position-area:bottom span-right;
margin-block-start:0.375rem;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-dropdown-021-menu] [data-part="title"]{
margin:0.125rem 0 0.375rem;padding-inline:0.4375rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-dropdown-021-muted,color-mix(in oklab,currentColor 60%,transparent));
}
[data-vibeui-dropdown-021-menu] [data-part="group"]{border:0;margin:0;padding:0;min-inline-size:0}
/* Заголовок группы для диктора: на экране его роль играет [data-part="title"],
   а класса из проекта у компонента быть не может. */
[data-vibeui-dropdown-021-menu] [data-part="reader"]{
position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-dropdown-021-menu] [data-part="option"]{
position:relative;display:flex;align-items:flex-start;gap:0.5625rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;cursor:pointer;
font-size:0.8125rem;line-height:1.3;
transition:background-color .14s ease;
}
[data-vibeui-dropdown-021-menu] [data-part="option"]:hover{
background:var(--vibeui-dropdown-021-hover,light-dark(oklch(0.55 0 265 / 8%),oklch(0.86 0 265 / 12%)));
}
/* Радиокнопка спрятана, но остаётся в потоке фокуса: обводку рисует подпись. */
[data-vibeui-dropdown-021-menu] [data-part="option"] input{
position:absolute;inline-size:1px;block-size:1px;opacity:0;pointer-events:none;
}
[data-vibeui-dropdown-021-menu] [data-part="option"]:has(input:focus-visible){
outline:2px solid var(--vibeui-dropdown-021-accent,light-dark(oklch(0.52 0.19 262),oklch(0.72 0.16 262)));
outline-offset:-2px;
}
[data-vibeui-dropdown-021-menu] [data-part="mark"]{
flex:none;margin-block-start:0.1875rem;
inline-size:0.625rem;block-size:0.625rem;border-radius:999px;
background:oklch(0.68 0.17 var(--vibeui-dropdown-021-option-hue,145));
}
[data-vibeui-dropdown-021-menu] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-inline-size:0}
[data-vibeui-dropdown-021-menu] [data-part="hint"]{
color:var(--vibeui-dropdown-021-muted,color-mix(in oklab,currentColor 60%,transparent));
font-size:0.75rem;line-height:1.35;
}
/* Галочка выбранного статуса: она и есть единственный след выбора в списке. */
[data-vibeui-dropdown-021-menu] [data-part="tick"]{
margin-inline-start:auto;align-self:center;flex:none;
inline-size:0.4375rem;block-size:0.75rem;
border-right:2px solid var(--vibeui-dropdown-021-accent,light-dark(oklch(0.52 0.19 262),oklch(0.72 0.16 262)));
border-bottom:2px solid var(--vibeui-dropdown-021-accent,light-dark(oklch(0.52 0.19 262),oklch(0.72 0.16 262)));
transform:rotate(45deg);
opacity:0;
}
[data-vibeui-dropdown-021-menu] [data-part="option"]:has(input:checked) [data-part="tick"]{opacity:1}
[data-vibeui-dropdown-021-menu] [data-part="foot"]{
display:flex;align-items:center;gap:0.5rem;
margin-block-start:0.375rem;padding:0.5rem 0.5rem 0.3125rem;
border-block-start:1px solid var(--vibeui-dropdown-021-border,light-dark(oklch(0.9 0 265),oklch(0.37 0 265)));
color:var(--vibeui-dropdown-021-muted,color-mix(in oklab,currentColor 60%,transparent));
font-size:0.75rem;line-height:1.35;
}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-021"]:has([data-open="true"]){flex-direction:column;align-items:flex-start}
[data-vibeui-dropdown-021-menu][data-open="true"]{
position:static;opacity:1;transform:none;margin-block-start:0.375rem;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dropdown-021"] *{animation:none!important;transition:none!important}
[data-vibeui-dropdown-021-menu]{transition:none!important;opacity:1;transform:none}
}
`

const DEFAULT_STATUSES: Dropdown021Status[] = [
  { value: "online", label: "На связи", hint: "Отвечаю сразу", hue: 145 },
  { value: "busy", label: "Занят", hint: "Пишите, отвечу позже", hue: 85 },
  {
    value: "dnd",
    label: "Не беспокоить",
    hint: "Уведомления выключены",
    hue: 25,
  },
  { value: "away", label: "Отошёл", hint: "Вернусь через полчаса", hue: 250 },
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

/** Инициалы: первые буквы двух первых слов имени. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
}

/**
 * Меню присутствия: точка на аватаре повторяет выбранный статус.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown021({
  id = "vibeui-dropdown-021",
  open = false,
  name = "Женя Осипов",
  title = "Статус",
  statuses = DEFAULT_STATUSES,
  status = "busy",
  onSelect,
  until = "«Не беспокоить» снимется в 18:00",
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown021Props) {
  // Имя группы своё на каждый экземпляр: радиокнопки объединяются по владельцу
  // формы и имени, иначе два меню на странице стали бы одной группой.
  const group = `${id}-status`
  const menu = useRef<HTMLDivElement>(null)
  // Выбранный статус живёт в состоянии: без него кнопка не менялась бы, а
  // меню оставалось бы открытым — нажатие выглядело бы как отказ.
  const [chosen, setChosen] = useState(status)
  const current =
    statuses.find((entry) => entry.value === chosen) ?? statuses[0]

  const pick = (value: string) => {
    setChosen(value)
    onSelect?.(value)

    if (menu.current?.matches(":popover-open")) {
      menu.current.hidePopover()
    }
  }

  const palette = {
    "--vibeui-dropdown-021-hue": String(current?.hue ?? 145),
    ...(accent ? { "--vibeui-dropdown-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-021-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-021" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-021"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          <span data-part="face" aria-hidden="true">
            {initials(name)}
            <span data-part="dot" />
          </span>
          {current?.label ?? name}
          <span data-part="chevron" aria-hidden="true" />
        </button>
        <div
          ref={menu}
          id={id}
          popover={open ? undefined : "auto"}
          data-vibeui-dropdown-021-menu=""
          data-open={open || undefined}
          style={palette}
        >
          <p data-part="title">{title}</p>
          <form>
            <fieldset data-part="group">
              <legend data-part="reader">{title}</legend>
              {statuses.map((entry) => (
                <label
                  key={entry.value}
                  data-part="option"
                  style={
                    {
                      "--vibeui-dropdown-021-option-hue": String(
                        entry.hue ?? 145,
                      ),
                    } as CSSProperties
                  }
                >
                  <input
                    type="radio"
                    name={group}
                    value={entry.value}
                    checked={entry.value === current?.value}
                    onChange={() => pick(entry.value)}
                  />
                  <span data-part="mark" aria-hidden="true" />
                  <span data-part="text">
                    {entry.label}
                    {entry.hint ? (
                      <span data-part="hint">{entry.hint}</span>
                    ) : null}
                  </span>
                  <span data-part="tick" aria-hidden="true" />
                </label>
              ))}
            </fieldset>
          </form>
          {until ? <p data-part="foot">{until}</p> : null}
        </div>
      </div>
    </>
  )
}

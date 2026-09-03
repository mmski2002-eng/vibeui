import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup036Method = {
  id: string
  label: string
  hint: string
}

export type Buttongroup036Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  methods?: Buttongroup036Method[]
  defaultValue?: string
  label?: string
  name?: string
  /** Пусто — заливки нет, карточки ложатся на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: способ оплаты — решение о деньгах, поэтому кружок radio
// здесь не прячется, а рисуется. Пользователь должен видеть привычный
// элемент выбора, а не догадываться о нём по заливке: сомнение «выбрал ли я»
// на этом шаге стоит дороже красоты. Сам input лежит поверх карточки
// прозрачным слоем, а видимый кружок собран из span с внутренней точкой на
// box-shadow. Карточки — grid с auto-fit: на узкой ширине они переносятся,
// а не сжимаются до нечитаемого.
const STYLES = `
:where([data-vibeui-block="buttongroup-036"]){
--vibeui-buttongroup-036-surface:transparent;
--vibeui-buttongroup-036-fg:light-dark(oklch(0.24 0.016 265),oklch(0.95 0.005 265));
--vibeui-buttongroup-036-muted:color-mix(in oklab,var(--vibeui-buttongroup-036-fg) 68%,transparent);
--vibeui-buttongroup-036-border:light-dark(oklch(0.89 0.008 265),oklch(0.39 0.012 265));
--vibeui-buttongroup-036-dot:light-dark(oklch(0.78 0.01 265),oklch(0.52 0.012 265));
--vibeui-buttongroup-036-on:light-dark(oklch(0.975 0.02 155),oklch(0.3 0.05 155));
--vibeui-buttongroup-036-accent:light-dark(oklch(0.48 0.13 155),oklch(0.75 0.13 155));
--vibeui-buttongroup-036-radius:0.75rem;
--vibeui-buttongroup-036-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-036"]{color-scheme:dark}
[data-vibeui-block="buttongroup-036"]{
box-sizing:border-box;display:block;width:100%;max-width:28rem;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-036-font);
}
[data-vibeui-block="buttongroup-036"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-036"] legend{
padding:0;margin:0 0 0.5rem;float:left;width:100%;clear:both;
color:var(--vibeui-buttongroup-036-fg);
font-size:0.8125rem;font-weight:650;line-height:1.35;
}
[data-vibeui-block="buttongroup-036"] [data-part="track"]{
display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:0.5rem;clear:both;
}
[data-vibeui-block="buttongroup-036"] [data-part="card"]{
position:relative;
display:flex;align-items:center;gap:0.5625rem;
padding:0.625rem 0.75rem;
border:1px solid var(--vibeui-buttongroup-036-border);
border-radius:var(--vibeui-buttongroup-036-radius);
background:var(--vibeui-buttongroup-036-surface);
cursor:pointer;
transition:border-color .16s ease,background-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="buttongroup-036"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
/* Видимый кружок выбора: на этом шаге он важнее заливки. */
[data-vibeui-block="buttongroup-036"] [data-part="dot"]{
flex:none;width:1.125rem;height:1.125rem;border-radius:9999px;
border:1.5px solid var(--vibeui-buttongroup-036-dot);
background:var(--vibeui-buttongroup-036-surface);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="buttongroup-036"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.0625rem;min-width:0;
}
[data-vibeui-block="buttongroup-036"] [data-part="name"]{
color:var(--vibeui-buttongroup-036-fg);
font-size:0.8125rem;font-weight:650;line-height:1.25;
}
[data-vibeui-block="buttongroup-036"] [data-part="hint"]{
color:var(--vibeui-buttongroup-036-muted);
font-size:0.6875rem;line-height:1.3;
}
[data-vibeui-block="buttongroup-036"] [data-part="card"]:hover{border-color:var(--vibeui-buttongroup-036-dot)}
[data-vibeui-block="buttongroup-036"] [data-part="card"]:has(input:checked){
background:var(--vibeui-buttongroup-036-on);
border-color:var(--vibeui-buttongroup-036-accent);
box-shadow:0 0 0 1px var(--vibeui-buttongroup-036-accent);
}
[data-vibeui-block="buttongroup-036"] [data-part="card"]:has(input:checked) [data-part="dot"]{
border-color:var(--vibeui-buttongroup-036-accent);
box-shadow:inset 0 0 0 4px var(--vibeui-buttongroup-036-accent);
}
[data-vibeui-block="buttongroup-036"] [data-part="card"]:has(input:focus-visible){
outline:2px solid var(--vibeui-buttongroup-036-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-036"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_METHODS: Buttongroup036Method[] = [
  { id: "card", label: "Картой", hint: "Visa, Mastercard, МИР" },
  { id: "sbp", label: "Через СБП", hint: "по QR-коду, без комиссии" },
  { id: "invoice", label: "По счёту", hint: "для юридических лиц" },
  { id: "later", label: "Частями", hint: "4 платежа раз в две недели" },
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
 * Выбор способа оплаты карточками с настоящим видимым кружком radio.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup036({
  methods = DEFAULT_METHODS,
  defaultValue = "sbp",
  label = "Способ оплаты",
  name = "buttongroup-036",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup036Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-036-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-036-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-036" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-036"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="track">
          {methods.map((method) => (
            <label key={method.id} data-part="card">
              <input
                type="radio"
                name={name}
                value={method.id}
                defaultChecked={method.id === defaultValue}
              />
              <span data-part="dot" aria-hidden="true" />
              <span data-part="text">
                <span data-part="name">{method.label}</span>
                <span data-part="hint">{method.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}

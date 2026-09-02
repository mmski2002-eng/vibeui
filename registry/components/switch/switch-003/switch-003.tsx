import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Switch003Item = {
  id: string
  label: string
  hint?: string
  defaultChecked?: boolean
}

export type Switch003Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children"
> & {
  legend?: string
  items?: Switch003Item[]
  /** Статус включённой строки. Рисуется через CSS content, поэтому едет переменной. */
  onText?: string
  offText?: string
  /** Пусто — подложки нет, раздел держится рамкой на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: не один переключатель, а раздел настроек. Строки идут
// сплошным списком с тонкими разделителями, поэтому глаз читает их как
// таблицу, а не как набор карточек; статус «Вкл/Выкл» подписан текстом,
// потому что цвет бегунка сам по себе не говорит, что сейчас включено.
const STYLES = `
:where([data-vibeui-block="switch-003"]){
--vibeui-switch-003-bg:transparent;
--vibeui-switch-003-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-switch-003-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-switch-003-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-switch-003-track:light-dark(oklch(0.88 0.008 265),oklch(0.43 0.014 265));
--vibeui-switch-003-thumb:light-dark(oklch(1 0 0),oklch(0.93 0.004 265));
--vibeui-switch-003-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.16 262));
--vibeui-switch-003-hover:light-dark(oklch(0.55 0.02 265 / 6%),oklch(0.88 0.02 265 / 10%));
--vibeui-switch-003-on-text:"Вкл";
--vibeui-switch-003-off-text:"Выкл";
--vibeui-switch-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="switch-003"]{
width:100%;max-width:23rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-switch-003-bg);
border:1px solid var(--vibeui-switch-003-border);border-radius:0.875rem;
font-family:var(--vibeui-switch-003-font);color:var(--vibeui-switch-003-fg);
}
/* float + clear: без него легенда садится на рамку fieldset, а следующие
   строки начинают обтекать её вместо нормального потока. */
[data-vibeui-block="switch-003"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.5rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-switch-003-muted);
}
[data-vibeui-block="switch-003"] [data-part="list"]{clear:both;display:flex;flex-direction:column}
[data-vibeui-block="switch-003"] [data-part="row"]{
display:flex;align-items:center;gap:0.875rem;
padding:0.625rem 0.5rem;margin:0 -0.5rem;border-radius:0.5rem;cursor:pointer;
transition:background-color .16s ease;
}
[data-vibeui-block="switch-003"] [data-part="row"] + [data-part="row"]{
box-shadow:inset 0 1px 0 var(--vibeui-switch-003-border);
}
[data-vibeui-block="switch-003"] [data-part="row"]:hover{background:var(--vibeui-switch-003-hover)}
[data-vibeui-block="switch-003"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="switch-003"] [data-part="label"]{font-size:0.875rem;line-height:1.3}
[data-vibeui-block="switch-003"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-switch-003-muted)}
[data-vibeui-block="switch-003"] [data-part="state"]{
flex:none;min-width:2.25rem;text-align:right;
font-size:0.6875rem;font-weight:600;color:var(--vibeui-switch-003-muted);
}
/* Текстовый статус переключается на CSS: :has() смотрит на состояние
   input'а в той же строке. Сами слова живут в переменных, поэтому их
   переопределяет проп, а не правка стилей. */
[data-vibeui-block="switch-003"] [data-part="state"]::after{content:var(--vibeui-switch-003-off-text)}
[data-vibeui-block="switch-003"] [data-part="row"]:has(input:checked) [data-part="state"]{color:var(--vibeui-switch-003-accent)}
[data-vibeui-block="switch-003"] [data-part="row"]:has(input:checked) [data-part="state"]::after{content:var(--vibeui-switch-003-on-text)}
[data-vibeui-block="switch-003"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-003"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:2.375rem;height:1.375rem;border-radius:9999px;
background:var(--vibeui-switch-003-track);cursor:inherit;
transition:background-color .18s ease;
}
[data-vibeui-block="switch-003"] input:checked{background:var(--vibeui-switch-003-accent)}
[data-vibeui-block="switch-003"] input:focus-visible{outline:2px solid var(--vibeui-switch-003-accent);outline-offset:2px}
[data-vibeui-block="switch-003"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
width:1rem;height:1rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-003-thumb);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 28%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-003"] input:checked + [data-part="thumb"]{transform:translateX(1rem)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Switch003Item[] = [
  {
    id: "digest",
    label: "Еженедельный дайджест",
    hint: "Письмо по понедельникам утром.",
    defaultChecked: true,
  },
  {
    id: "mentions",
    label: "Упоминания в комментариях",
    hint: "Уведомление, когда вас позвали в обсуждение.",
    defaultChecked: true,
  },
  {
    id: "marketing",
    label: "Новости продукта",
    hint: "Релизы и большие обновления, не чаще раза в месяц.",
  },
  {
    id: "sms",
    label: "SMS о списаниях",
    hint: "Платные — по тарифу оператора.",
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
 * Раздел настроек: список строк с переключателями и текстовым статусом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch003({
  legend = "Уведомления",
  items = DEFAULT_ITEMS,
  onText = "Вкл",
  offText = "Выкл",
  background = "",
  accent,
  className,
  style,
  ...props
}: Switch003Props) {
  const palette = {
    ...(accent ? { "--vibeui-switch-003-accent": accent } : null),
    // content принимает строку в кавычках, поэтому проп доезжает
    // до CSS уже закавыченным.
    "--vibeui-switch-003-on-text": `"${onText}"`,
    "--vibeui-switch-003-off-text": `"${offText}"`,
    ...(background
      ? {
          "--vibeui-switch-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-003" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="switch-003"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="list">
          {items.map((item) => (
            <label key={item.id} data-part="row">
              <span data-part="text">
                <span data-part="label">{item.label}</span>
                {item.hint ? <span data-part="hint">{item.hint}</span> : null}
              </span>
              <span data-part="state" aria-hidden="true" />
              <span data-part="track">
                <input
                  type="checkbox"
                  role="switch"
                  name={item.id}
                  defaultChecked={item.defaultChecked}
                />
                <span data-part="thumb" aria-hidden="true" />
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}

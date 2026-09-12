import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup037Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  /** Доступное имя группы: читается скринридером, визуально скрыто. */
  label?: string
  fileLabel?: string
  linkLabel?: string
  filePrompt?: string
  linkPrompt?: string
  linkPlaceholder?: string
  defaultValue?: "file" | "link"
  name?: string
  /** Пусто — заливки нет, карточка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сцепка из двух сегментов управляет тем, что лежит под
// ней. Обе панели присутствуют в разметке, но неактивная скрыта правилом
// display:none по состоянию radio — так переключение стоит ноль JS, а
// скрытая панель вместе со своими полями честно уходит из доступного дерева
// и из обхода Tab. Панель и сцепка склеены в одну карточку: у сцепки скруглены
// только верхние углы, у панели — только нижние, и общая рамка не разрывается.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-037"]){
--vibeui-buttongroup-037-surface:transparent;
--vibeui-buttongroup-037-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-037-muted:color-mix(in oklab,var(--vibeui-buttongroup-037-fg) 68%,transparent);
--vibeui-buttongroup-037-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-buttongroup-037-track:light-dark(oklch(0.975 0 265),oklch(0.29 0 265));
--vibeui-buttongroup-037-dash:light-dark(oklch(0.84 0 265),oklch(0.47 0 265));
--vibeui-buttongroup-037-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-buttongroup-037-radius:0.75rem;
--vibeui-buttongroup-037-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-037"]{color-scheme:dark}
[data-vibeui-block="buttongroup-037"]{
box-sizing:border-box;display:block;width:100%;max-width:24rem;
margin:0;padding:0;
border:1px solid var(--vibeui-buttongroup-037-border);
border-radius:var(--vibeui-buttongroup-037-radius);
background:var(--vibeui-buttongroup-037-surface);
overflow:hidden;
font-family:var(--vibeui-buttongroup-037-font);
}
[data-vibeui-block="buttongroup-037"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-037"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-037"] [data-part="track"]{
display:grid;grid-template-columns:1fr 1fr;
border-bottom:1px solid var(--vibeui-buttongroup-037-border);
}
/* Тон лежит на самом сегменте, а не на треке: активная вкладка обязана
   показывать подложку карточки, а при прозрачной подложке — фон страницы. */
[data-vibeui-block="buttongroup-037"] [data-part="segment"]{
position:relative;
display:inline-flex;align-items:center;justify-content:center;gap:0.4375rem;
height:2.5rem;
background:var(--vibeui-buttongroup-037-track);
color:var(--vibeui-buttongroup-037-muted);
font-size:0.8125rem;font-weight:650;line-height:1;cursor:pointer;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-037"] [data-part="segment"] + [data-part="segment"]{
border-inline-start:1px solid var(--vibeui-buttongroup-037-border);
}
[data-vibeui-block="buttongroup-037"] input[type="radio"]{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-037"] svg{
width:1rem;height:1rem;
stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="buttongroup-037"] [data-part="segment"]:hover{color:var(--vibeui-buttongroup-037-fg)}
[data-vibeui-block="buttongroup-037"] [data-part="segment"]:has(input:checked){
background:var(--vibeui-buttongroup-037-surface);
color:var(--vibeui-buttongroup-037-accent);
box-shadow:inset 0 -2px 0 var(--vibeui-buttongroup-037-accent);
}
[data-vibeui-block="buttongroup-037"] [data-part="segment"]:has(input:focus-visible){
outline:2px solid var(--vibeui-buttongroup-037-accent);outline-offset:-2px;
}
/* Неактивная панель уходит и из потока, и из обхода Tab. */
[data-vibeui-block="buttongroup-037"] [data-part="panel"]{display:none;padding:0.875rem}
[data-vibeui-block="buttongroup-037"]:has([data-mode="file"] input:checked) [data-panel="file"]{display:block}
[data-vibeui-block="buttongroup-037"]:has([data-mode="link"] input:checked) [data-panel="link"]{display:block}
[data-vibeui-block="buttongroup-037"] [data-part="drop"]{
display:flex;flex-direction:column;align-items:center;gap:0.375rem;
padding:1.125rem 0.75rem;
border:1.5px dashed var(--vibeui-buttongroup-037-dash);border-radius:0.625rem;
color:var(--vibeui-buttongroup-037-muted);
font-size:0.75rem;line-height:1.4;text-align:center;cursor:pointer;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-037"] [data-part="drop"]:hover{
border-color:var(--vibeui-buttongroup-037-accent);color:var(--vibeui-buttongroup-037-fg);
}
[data-vibeui-block="buttongroup-037"] [data-part="drop"] input{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="buttongroup-037"] [data-part="url"]{
display:flex;flex-direction:column;gap:0.375rem;
color:var(--vibeui-buttongroup-037-muted);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="buttongroup-037"] [data-part="url"] input{
width:100%;height:2.375rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-buttongroup-037-border);border-radius:0.5rem;
background:var(--vibeui-buttongroup-037-surface);
color:var(--vibeui-buttongroup-037-fg);
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="buttongroup-037"] [data-part="url"] input:focus-visible{
outline:2px solid var(--vibeui-buttongroup-037-accent);outline-offset:1px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-037"] *{animation:none!important;transition:none!important}}
`

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
 * Переключатель источника: сцепка из двух сегментов меняет панель под собой.
 * Один файл, ноль зависимостей, серверный компонент без JS.
 */
export function Buttongroup037({
  label = "Источник вложения",
  fileLabel = "Загрузить файл",
  linkLabel = "Дать ссылку",
  filePrompt = "Перетащите файл или нажмите, чтобы выбрать. PDF, PNG, до 10 МБ.",
  linkPrompt = "Ссылка на файл в вашем хранилище",
  linkPlaceholder = "https://disk.example.com/act.pdf",
  defaultValue = "file",
  name = "buttongroup-037",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup037Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-037-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-037-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-037" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-037"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <form data-part="track">
          <label data-part="segment" data-mode="file">
            <input
              type="radio"
              name={name}
              value="file"
              defaultChecked={defaultValue === "file"}
            />
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 16V4M8 8l4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
            </svg>
            {fileLabel}
          </label>
          <label data-part="segment" data-mode="link">
            <input
              type="radio"
              name={name}
              value="link"
              defaultChecked={defaultValue === "link"}
            />
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
            </svg>
            {linkLabel}
          </label>
        </form>
        <div data-part="panel" data-panel="file">
          <label data-part="drop">
            <input type="file" name={`${name}-file`} />
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 16V4M8 8l4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
            </svg>
            <span>{filePrompt}</span>
          </label>
        </div>
        <div data-part="panel" data-panel="link">
          <label data-part="url">
            <span>{linkPrompt}</span>
            <input
              type="url"
              name={`${name}-url`}
              placeholder={linkPlaceholder}
            />
          </label>
        </div>
      </fieldset>
    </>
  )
}

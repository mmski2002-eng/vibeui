import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type File009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  title?: string
  fileTab?: string
  linkTab?: string
  name?: string
  accent?: string
}

// Идея компонента: два источника одного вложения. Картинка чаще лежит не на
// диске, а по ссылке — и заставлять человека сначала скачать файл, чтобы
// потом его загрузить, бессмысленно. Переключатель источников собран на двух
// радиокнопках внутри подписей: панель показывается селектором :has, поэтому
// вкладки работают без состояния и компонент остаётся серверным.
const STYLES = `
:where([data-vibeui-block="file-009"]){
--vibeui-file-009-surface:oklch(1 0 0);
--vibeui-file-009-tile:oklch(0.965 0.005 265);
--vibeui-file-009-fg:oklch(0.23 0.014 265);
--vibeui-file-009-muted:oklch(0.55 0.014 265);
--vibeui-file-009-border:oklch(0.88 0.008 265);
--vibeui-file-009-shell:oklch(0.91 0.006 265);
--vibeui-file-009-accent:oklch(0.52 0.17 255);
--vibeui-file-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: блок показывают поверх любого фона. */
[data-vibeui-block="file-009"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-file-009-surface);
border:1px solid var(--vibeui-file-009-shell);border-radius:0.875rem;
font-family:var(--vibeui-file-009-font);color:var(--vibeui-file-009-fg);
}
[data-vibeui-block="file-009"] *{box-sizing:border-box}
[data-vibeui-block="file-009"] [data-part="title"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="file-009"] [data-part="tabs"]{
display:flex;gap:0.25rem;padding:0.1875rem;border-radius:0.625rem;
background:var(--vibeui-file-009-tile);
}
/* Радиокнопка внутри подписи: переключение без состояния и без id в CSS. */
[data-vibeui-block="file-009"] [data-part="tab"]{
position:relative;flex:1;text-align:center;cursor:pointer;
padding:0.375rem 0.5rem;border-radius:0.4375rem;
font-size:0.75rem;font-weight:650;color:var(--vibeui-file-009-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="file-009"] [data-part="tab"] input{
position:absolute;width:1px;height:1px;margin:0;opacity:0;pointer-events:none;
}
[data-vibeui-block="file-009"] [data-part="tab"]:has(input:checked){
background:var(--vibeui-file-009-surface);color:var(--vibeui-file-009-fg);
box-shadow:0 1px 2px oklch(0 0 0 / 8%);
}
[data-vibeui-block="file-009"] [data-part="tab"]:has(input:focus-visible){
outline:2px solid var(--vibeui-file-009-accent);outline-offset:2px;
}
/* Показ панели решает :has на корне — ни одного идентификатора в стилях. */
[data-vibeui-block="file-009"]:has([data-choice="link"]:checked) [data-panel="file"],
[data-vibeui-block="file-009"]:has([data-choice="file"]:checked) [data-panel="link"]{display:none}
[data-vibeui-block="file-009"] [data-panel]{display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="file-009"] [data-part="drop"]{
display:flex;flex-direction:column;align-items:center;gap:0.25rem;
padding:1rem 0.75rem;text-align:center;cursor:pointer;
border:1.5px dashed var(--vibeui-file-009-border);border-radius:0.75rem;
transition:border-color .16s ease;
}
[data-vibeui-block="file-009"] [data-part="drop"]:hover{border-color:var(--vibeui-file-009-accent)}
[data-vibeui-block="file-009"] [data-part="drop"]:has(input:focus-visible){outline:2px solid var(--vibeui-file-009-accent);outline-offset:2px}
[data-vibeui-block="file-009"] [data-part="drop"] input{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);border:0;
}
[data-vibeui-block="file-009"] [data-part="plate"]{
position:relative;width:1.625rem;height:1.375rem;
border:1.5px solid var(--vibeui-file-009-muted);border-radius:0.25rem;
}
[data-vibeui-block="file-009"] [data-part="plate"]::after{
content:"";position:absolute;left:50%;top:50%;width:0.5rem;height:0.5rem;
margin:-0.375rem 0 0 -0.25rem;transform:rotate(45deg);
border-left:1.5px solid var(--vibeui-file-009-muted);
border-top:1.5px solid var(--vibeui-file-009-muted);
}
[data-vibeui-block="file-009"] [data-part="strong"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="file-009"] input[type="url"]{
width:100%;height:2.375rem;padding:0 0.75rem;
background:var(--vibeui-file-009-surface);color:inherit;
border:1px solid var(--vibeui-file-009-border);border-radius:0.625rem;
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="file-009"] input[type="url"]:focus-visible{
outline:2px solid var(--vibeui-file-009-accent);outline-offset:1px;
border-color:var(--vibeui-file-009-accent);
}
[data-vibeui-block="file-009"] input[type="url"]::placeholder{color:var(--vibeui-file-009-muted)}
[data-vibeui-block="file-009"] [data-part="note"]{
margin:0;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-file-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="file-009"] *{animation:none!important;transition:none!important}}
`

/**
 * Вложение из двух источников: файл с диска или ссылка, переключение на :has.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File009({
  title = "Изображение товара",
  fileTab = "С компьютера",
  linkTab = "По ссылке",
  name = "source",
  accent,
  className,
  style,
  ...props
}: File009Props) {
  const palette = {
    ...(accent ? { "--vibeui-file-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-file-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="file-009"
        className={className}
        style={palette}
      >
        <span data-part="title">{title}</span>

        <div data-part="tabs" role="radiogroup" aria-label="Откуда взять файл">
          <label data-part="tab">
            <input type="radio" name={name} data-choice="file" defaultChecked />
            {fileTab}
          </label>
          <label data-part="tab">
            <input type="radio" name={name} data-choice="link" />
            {linkTab}
          </label>
        </div>

        <div data-panel="file">
          <label data-part="drop">
            <span data-part="plate" aria-hidden="true" />
            <span data-part="strong">Выбрать файл</span>
            <span data-part="note">PNG или JPG до 10 МБ</span>
            <input type="file" name={`${name}-file`} accept="image/*" />
          </label>
        </div>

        <div data-panel="link">
          <input
            type="url"
            name={`${name}-url`}
            placeholder="https://example.com/photo.jpg"
            aria-label="Ссылка на изображение"
          />
          <p data-part="note">
            Скачаем картинку к себе один раз — если ссылка потом умрёт, товар не
            потеряет фото.
          </p>
        </div>
      </div>
    </>
  )
}

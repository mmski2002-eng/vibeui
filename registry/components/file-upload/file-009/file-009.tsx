import type { ComponentProps, CSSProperties } from "react"

export type File009Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  title?: string
  fileTab?: string
  linkTab?: string
  name?: string
  /** Доступное имя ряда вкладок. */
  groupLabel?: string
  /** Подпись в зоне выбора файла. */
  pickText?: string
  /** Требования под подписью выбора. */
  fileNote?: string
  /** Доступное имя поля адреса. */
  linkLabel?: string
  /** Placeholder поля адреса. */
  linkPlaceholder?: string
  /** Пояснение под полем адреса. */
  linkNote?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: два источника одного вложения. Картинка чаще лежит не на
// диске, а по ссылке — и заставлять человека сначала скачать файл, чтобы
// потом его загрузить, бессмысленно. Переключатель источников собран на двух
// радиокнопках внутри подписей: панель показывается селектором :has, поэтому
// вкладки работают без состояния и компонент остаётся серверным.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
// Активная вкладка и поле адреса красятся отдельным токеном raise, поэтому
// прозрачная подложка не съедает «поднятую» плитку.
//
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="file-009"]){
--vibeui-file-009-surface:transparent;
--vibeui-file-009-raise:light-dark(oklch(1 0 0),oklch(0.34 0.014 265));
--vibeui-file-009-tile:light-dark(oklch(0.965 0.005 265),oklch(0.26 0.012 265));
--vibeui-file-009-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-file-009-muted:color-mix(in oklab,var(--vibeui-file-009-fg) 68%,transparent);
--vibeui-file-009-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-file-009-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-file-009-accent:light-dark(oklch(0.52 0.17 255),oklch(0.74 0.16 255));
--vibeui-file-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="file-009"]{color-scheme:dark}
/* Панель без собственной заливки: рамка очерчивает блок на любом фоне. */
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
background:var(--vibeui-file-009-raise);color:var(--vibeui-file-009-fg);
box-shadow:0 1px 2px light-dark(oklch(0 0 0 / 8%),oklch(0 0 0 / 35%));
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
background:var(--vibeui-file-009-raise);color:inherit;
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
 * Вложение из двух источников: файл с диска или ссылка, переключение на :has.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File009({
  title = "Изображение товара",
  fileTab = "С компьютера",
  linkTab = "По ссылке",
  name = "source",
  groupLabel = "Откуда взять файл",
  pickText = "Выбрать файл",
  fileNote = "PNG или JPG до 10 МБ",
  linkLabel = "Ссылка на изображение",
  linkPlaceholder = "https://example.com/photo.jpg",
  linkNote = "Скачаем картинку к себе один раз — если ссылка потом умрёт, товар не потеряет фото.",
  background = "",
  accent,
  className,
  style,
  ...props
}: File009Props) {
  const palette = {
    ...(accent ? { "--vibeui-file-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-file-009-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-file-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="file-upload"
        data-vibeui-block="file-009"
        className={className}
        style={palette}
      >
        <span data-part="title">{title}</span>

        <form data-part="tabs" role="radiogroup" aria-label={groupLabel}>
          <label data-part="tab">
            <input type="radio" name={name} data-choice="file" defaultChecked />
            {fileTab}
          </label>
          <label data-part="tab">
            <input type="radio" name={name} data-choice="link" />
            {linkTab}
          </label>
        </form>

        <div data-panel="file">
          <label data-part="drop">
            <span data-part="plate" aria-hidden="true" />
            <span data-part="strong">{pickText}</span>
            <span data-part="note">{fileNote}</span>
            <input type="file" name={`${name}-file`} accept="image/*" />
          </label>
        </div>

        <div data-panel="link">
          <input
            type="url"
            name={`${name}-url`}
            placeholder={linkPlaceholder}
            aria-label={linkLabel}
          />
          <p data-part="note">{linkNote}</p>
        </div>
      </div>
    </>
  )
}

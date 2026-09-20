"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type File006Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  formats?: string[]
  maxSizeMb?: number
  /**
   * Подписи поля: {formats} подставляет список расширений, {max} — предел
   * в мегабайтах. Компонент несёт русские, проект подставляет свои.
   */
  text?: Record<string, string>
  onChange?: (name: string | null) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: правила видны до выбора, а не после отказа. Атрибут accept
// только фильтрует диалог: файл можно перетащить мимо него, а размер он не
// проверяет вовсе. Поэтому условия выписаны списком заранее, а сообщение об
// отказе говорит, что именно не подошло и каким был предел, — «неверный файл»
// не помогает выбрать правильный со второй попытки.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у поля
// по умолчанию нет, оно лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="file-006"]){
--vibeui-file-006-surface:transparent;
--vibeui-file-006-tile:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-file-006-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-file-006-muted:color-mix(in oklab,var(--vibeui-file-006-fg) 68%,transparent);
--vibeui-file-006-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-file-006-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-file-006-accent:light-dark(oklch(0.28 0 0),oklch(0.906 0 0));
--vibeui-file-006-danger:light-dark(oklch(0.55 0.19 25),oklch(0.72 0.17 25));
--vibeui-file-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="file-006"]{color-scheme:dark}
/* Панель без собственной заливки: рамка очерчивает поле на любом фоне. */
[data-vibeui-block="file-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-file-006-surface);
border:1px solid var(--vibeui-file-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-file-006-font);color:var(--vibeui-file-006-fg);
}
[data-vibeui-block="file-006"] *{box-sizing:border-box}
[data-vibeui-block="file-006"] [data-part="title"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="file-006"] label{
display:flex;align-items:center;gap:0.625rem;cursor:pointer;
padding:0.625rem 0.75rem;
background:var(--vibeui-file-006-tile);
border:1px solid var(--vibeui-file-006-border);border-radius:0.75rem;
transition:border-color .16s ease;
}
[data-vibeui-block="file-006"] label:hover{border-color:var(--vibeui-file-006-accent)}
[data-vibeui-block="file-006"] label:has(input:focus-visible){outline:2px solid var(--vibeui-file-006-accent);outline-offset:2px}
[data-vibeui-block="file-006"][data-rejected="true"] label{border-color:var(--vibeui-file-006-danger)}
[data-vibeui-block="file-006"] input{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);border:0;
}
[data-vibeui-block="file-006"] [data-part="badge"]{
flex:none;display:grid;place-items:center;
width:2rem;height:2rem;border-radius:0.5rem;
background:var(--vibeui-file-006-surface);
border:1px solid var(--vibeui-file-006-border);
font-size:0.625rem;font-weight:700;color:var(--vibeui-file-006-muted);
}
[data-vibeui-block="file-006"] [data-part="pick"]{
display:flex;flex-direction:column;gap:0.0625rem;min-width:0;
}
[data-vibeui-block="file-006"] [data-part="pick"] b{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="file-006"] [data-part="pick"] span{
font-size:0.6875rem;color:var(--vibeui-file-006-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Правила выписаны заранее: accept фильтрует диалог, но ничего не гарантирует. */
[data-vibeui-block="file-006"] ul{
display:flex;flex-direction:column;gap:0.25rem;margin:0;padding:0;list-style:none;
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-file-006-muted);
}
[data-vibeui-block="file-006"] li{display:flex;align-items:flex-start;gap:0.375rem}
[data-vibeui-block="file-006"] li::before{
content:"";flex:none;width:0.3125rem;height:0.3125rem;margin-top:0.375rem;
border-radius:9999px;background:var(--vibeui-file-006-border);
}
[data-vibeui-block="file-006"] li[data-broken="true"]{color:var(--vibeui-file-006-danger);font-weight:600}
[data-vibeui-block="file-006"] li[data-broken="true"]::before{background:var(--vibeui-file-006-danger)}
/* Отказ называет и правило, и факт: «неверный файл» не помогает со второй попытки. */
[data-vibeui-block="file-006"] [data-part="reject"]{
display:flex;align-items:flex-start;gap:0.375rem;margin:0;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-file-006-danger) 12%,transparent);
color:var(--vibeui-file-006-danger);
font-size:0.75rem;line-height:1.4;font-weight:600;
}
[data-vibeui-block="file-006"] [data-part="mark"]{
flex:none;display:grid;place-items:center;
width:0.875rem;height:0.875rem;margin-top:0.0625rem;border-radius:9999px;
background:var(--vibeui-file-006-danger);color:light-dark(oklch(1 0 0),oklch(0.18 0.02 25));
font-size:0.625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="file-006"] [data-part="ok"]{
margin:0;font-size:0.75rem;font-weight:600;color:var(--vibeui-file-006-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="file-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FORMATS = ["pdf", "docx", "rtf"]

const TEXT: Record<string, string> = {
  badge: "ФАЙЛ",
  pick: "Выбрать файл",
  replace: "Заменить файл",
  summary: "{formats} · до {max} МБ",
  formatRule: "Формат: {formats}",
  sizeRule: "Размер: не больше {max} МБ",
  formatReject:
    "Такой формат не принимаем. Подойдут {formats} — пересохраните и попробуйте снова.",
  sizeReject: "Файл тяжелее {max} МБ. Сожмите его или выберите версию полегче.",
  accepted: "Файл принят — правила соблюдены.",
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
 * Загрузка с проверкой типа и размера и понятным текстом отказа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File006({
  label = "Резюме",
  formats = DEFAULT_FORMATS,
  maxSizeMb = 5,
  text = TEXT,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: File006Props) {
  const id = useId()
  const [accepted, setAccepted] = useState<string | null>(null)
  const [reject, setReject] = useState<"" | "format" | "size">("")

  const palette = {
    ...(accent ? { "--vibeui-file-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-file-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const take = (file: File | undefined) => {
    if (!file) return

    const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
    const megabytes = file.size / 1024 / 1024

    if (!formats.includes(extension)) {
      setReject("format")
      setAccepted(null)
      onChange?.(null)
      return
    }

    if (megabytes > maxSizeMb) {
      setReject("size")
      setAccepted(null)
      onChange?.(null)
      return
    }

    setReject("")
    setAccepted(file.name)
    onChange?.(file.name)
  }

  const list = formats.join(", ")
  const say = (key: string) =>
    (text[key] ?? TEXT[key])
      .replace("{formats}", list)
      .replace("{max}", String(maxSizeMb))

  return (
    <>
      <style href="vibeui-file-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="file-upload"
        data-vibeui-block="file-006"
        data-rejected={reject ? "true" : undefined}
        className={className}
        style={palette}
      >
        <span data-part="title">{label}</span>
        <label htmlFor={id}>
          <span data-part="badge" aria-hidden="true">
            {formats[0]?.toUpperCase() ?? say("badge")}
          </span>
          <span data-part="pick">
            <b>{accepted ? say("replace") : say("pick")}</b>
            <span>{accepted ?? say("summary")}</span>
          </span>
          <input
            id={id}
            type="file"
            accept={formats.map((format) => `.${format}`).join(",")}
            onChange={(event) => take(event.target.files?.[0])}
          />
        </label>

        <ul>
          <li data-broken={reject === "format" ? "true" : undefined}>
            {say("formatRule")}
          </li>
          <li data-broken={reject === "size" ? "true" : undefined}>
            {say("sizeRule")}
          </li>
        </ul>

        {reject ? (
          <p data-part="reject" role="alert">
            <span data-part="mark" aria-hidden="true">
              !
            </span>
            {reject === "format" ? say("formatReject") : say("sizeReject")}
          </p>
        ) : accepted ? (
          <p data-part="ok" role="status">
            {say("accepted")}
          </p>
        ) : null}
      </div>
    </>
  )
}

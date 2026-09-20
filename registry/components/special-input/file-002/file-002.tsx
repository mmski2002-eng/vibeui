"use client"

import { useRef, useState } from "react"
import type {
  ClipboardEvent,
  ComponentProps,
  CSSProperties,
  DragEvent,
  KeyboardEvent,
} from "react"

export type File002Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  accept?: string
  /** Доступное имя зоны для скринридера. */
  zoneLabel?: string
  /** Перечень способов в зоне: drag, pick, paste. */
  wayText?: Record<string, string>
  /** Пометка, как файл попал в список: drop, pick, paste. */
  viaText?: Record<string, string>
  /** Имя для файла из буфера: у него его часто нет. */
  clipboardName?: string
  onChange?: (names: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: три равноправных пути внутрь одной зоны. Перетаскивание
// есть только у мыши, поэтому зона получает фокус и открывает диалог по Enter
// и пробелу, а ещё принимает вставку из буфера — скриншот в буфере после
// PrtScn кладётся сюда одним Ctrl+V, без промежуточного файла на диске.
// Все три способа перечислены в самой зоне: невидимая возможность не существует.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у панели
// по умолчанию нет, она лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="file-002"]){
--vibeui-file-002-bg:transparent;
--vibeui-file-002-surface:transparent;
--vibeui-file-002-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-file-002-muted:color-mix(in oklab,var(--vibeui-file-002-fg) 68%,transparent);
--vibeui-file-002-border:light-dark(oklch(0.87 0 265),oklch(0.42 0 265));
--vibeui-file-002-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-file-002-key:light-dark(oklch(0.965 0 265),oklch(0.3 0 265));
--vibeui-file-002-accent:light-dark(oklch(0.282 0 0),oklch(0.903 0 0));
--vibeui-file-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="file-002"]{color-scheme:dark}
/* Панель без собственной заливки: рамка очерчивает её на любом фоне. */
[data-vibeui-block="file-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-file-002-surface);
border:1px solid var(--vibeui-file-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-file-002-font);color:var(--vibeui-file-002-fg);
}
[data-vibeui-block="file-002"] *{box-sizing:border-box}
/* Зона получает фокус: перетаскивание есть только у мыши. */
[data-vibeui-block="file-002"] [data-part="zone"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
padding:1.125rem 1rem;text-align:center;cursor:pointer;
background:var(--vibeui-file-002-bg);
border:1.5px dashed var(--vibeui-file-002-border);border-radius:0.875rem;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="file-002"] [data-part="zone"]:hover{border-color:var(--vibeui-file-002-accent)}
[data-vibeui-block="file-002"] [data-part="zone"]:focus-visible{
outline:2px solid var(--vibeui-file-002-accent);outline-offset:2px;
border-color:var(--vibeui-file-002-accent);
}
[data-vibeui-block="file-002"][data-over="true"] [data-part="zone"]{
border-color:var(--vibeui-file-002-accent);border-style:solid;
background:color-mix(in oklab,var(--vibeui-file-002-accent) 10%,transparent);
}
[data-vibeui-block="file-002"] input[type="file"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);border:0;
}
[data-vibeui-block="file-002"] [data-part="title"]{font-size:0.8125rem;font-weight:650}
/* Три способа перечислены в зоне: невидимая возможность не существует. */
[data-vibeui-block="file-002"] [data-part="ways"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.375rem;
margin:0;padding:0;list-style:none;
font-size:0.75rem;color:var(--vibeui-file-002-muted);
}
[data-vibeui-block="file-002"] [data-part="ways"] li{
display:inline-flex;align-items:center;gap:0.25rem;
}
[data-vibeui-block="file-002"] kbd{
padding:0.0625rem 0.3125rem;border-radius:0.3125rem;
border:1px solid var(--vibeui-file-002-border);
background:var(--vibeui-file-002-key);
font-family:inherit;font-size:0.6875rem;font-weight:650;
color:var(--vibeui-file-002-fg);
}
[data-vibeui-block="file-002"] [data-part="plate"]{
position:relative;width:1.75rem;height:1.5rem;
border:1.5px solid var(--vibeui-file-002-muted);border-radius:0.25rem;
}
[data-vibeui-block="file-002"] [data-part="plate"]::after{
content:"";position:absolute;left:50%;top:50%;
width:0.625rem;height:0.625rem;margin:-0.4375rem 0 0 -0.3125rem;
border-left:1.5px solid var(--vibeui-file-002-muted);
border-top:1.5px solid var(--vibeui-file-002-muted);
transform:rotate(45deg);
}
[data-vibeui-block="file-002"] ul[data-part="taken"]{
display:flex;flex-direction:column;gap:0.25rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="file-002"] ul[data-part="taken"] li{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.4375rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-file-002-border);font-size:0.8125rem;
}
[data-vibeui-block="file-002"] [data-part="via"]{
flex:none;font-size:0.6875rem;color:var(--vibeui-file-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="file-002"] *{animation:none!important;transition:none!important}}
`

type Taken = { name: string; via: string }

const WAY_TEXT: Record<string, string> = {
  drag: "перетащить",
  pick: "выбрать",
  paste: "вставить",
}

const VIA_TEXT: Record<string, string> = {
  drop: "перетащен",
  pick: "выбран",
  paste: "из буфера",
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
 * Зона загрузки с тремя путями: перетаскивание, клавиатура и вставка из буфера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File002({
  label = "Перетащите файлы или вставьте из буфера",
  accept = "image/*,application/pdf",
  zoneLabel = "Добавить файлы: перетащите, нажмите Enter или вставьте из буфера",
  wayText = WAY_TEXT,
  viaText = VIA_TEXT,
  clipboardName = "Из буфера обмена",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: File002Props) {
  const picker = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const [taken, setTaken] = useState<Taken[]>([])

  const palette = {
    ...(accent ? { "--vibeui-file-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-file-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const collect = (list: FileList | null, via: string) => {
    if (!list || list.length === 0) return
    const next = Array.from(list).map((file) => ({
      name: file.name || clipboardName,
      via: viaText[via] ?? VIA_TEXT[via],
    }))
    setTaken(next)
    onChange?.(next.map((entry) => entry.name))
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setOver(false)
    collect(event.dataTransfer.files, "drop")
  }

  // Enter и пробел открывают тот же системный диалог, что и клик.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    picker.current?.click()
  }

  const onPaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (!event.clipboardData.files.length) return
    event.preventDefault()
    collect(event.clipboardData.files, "paste")
  }

  return (
    <>
      <style href="vibeui-file-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="file-upload"
        data-vibeui-block="file-002"
        data-over={over}
        className={className}
        style={palette}
      >
        <div
          data-part="zone"
          role="button"
          tabIndex={0}
          aria-label={zoneLabel}
          onClick={() => picker.current?.click()}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onDragOver={(event) => {
            event.preventDefault()
            setOver(true)
          }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
        >
          <span data-part="plate" aria-hidden="true" />
          <span data-part="title">{label}</span>
          <ul data-part="ways">
            <li>{wayText.drag ?? WAY_TEXT.drag}</li>
            <li>
              <kbd>Enter</kbd> {wayText.pick ?? WAY_TEXT.pick}
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>V</kbd> {wayText.paste ?? WAY_TEXT.paste}
            </li>
          </ul>
          <input
            ref={picker}
            type="file"
            multiple
            accept={accept}
            tabIndex={-1}
            onChange={(event) => collect(event.target.files, "pick")}
          />
        </div>
        {taken.length ? (
          <ul data-part="taken">
            {taken.map((entry) => (
              <li key={entry.name}>
                <span>{entry.name}</span>
                <span data-part="via">{entry.via}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  )
}

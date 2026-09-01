"use client"

import { useRef, useState } from "react"
import type {
  ClipboardEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
  DragEvent,
  KeyboardEvent,
} from "react"

export type File002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  accept?: string
  onChange?: (names: string[]) => void
  accent?: string
}

// Идея компонента: три равноправных пути внутрь одной зоны. Перетаскивание
// есть только у мыши, поэтому зона получает фокус и открывает диалог по Enter
// и пробелу, а ещё принимает вставку из буфера — скриншот в буфере после
// PrtScn кладётся сюда одним Ctrl+V, без промежуточного файла на диске.
// Все три способа перечислены в самой зоне: невидимая возможность не существует.
const STYLES = `
:where([data-vibeui-block="file-002"]){
--vibeui-file-002-bg:oklch(1 0 0);
--vibeui-file-002-surface:oklch(1 0 0);
--vibeui-file-002-fg:oklch(0.23 0.014 265);
--vibeui-file-002-muted:oklch(0.55 0.014 265);
--vibeui-file-002-border:oklch(0.87 0.008 265);
--vibeui-file-002-shell:oklch(0.91 0.006 265);
--vibeui-file-002-key:oklch(0.965 0.004 265);
--vibeui-file-002-accent:oklch(0.53 0.18 290);
--vibeui-file-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: зону показывают поверх любого фона. */
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
background:color-mix(in oklab,var(--vibeui-file-002-accent) 8%,oklch(1 0 0));
}
[data-vibeui-block="file-002"] input[type="file"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);border:0;
}
[data-vibeui-block="file-002"] [data-part="title"]{font-size:0.875rem;font-weight:650}
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

/**
 * Зона загрузки с тремя путями: перетаскивание, клавиатура и вставка из буфера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File002({
  label = "Перетащите файлы или вставьте из буфера",
  accept = "image/*,application/pdf",
  onChange,
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
    ...style,
  } as CSSProperties

  const collect = (list: FileList | null, via: string) => {
    if (!list || list.length === 0) return
    const next = Array.from(list).map((file) => ({
      name: file.name || "Из буфера обмена",
      via,
    }))
    setTaken(next)
    onChange?.(next.map((entry) => entry.name))
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setOver(false)
    collect(event.dataTransfer.files, "перетащен")
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
    collect(event.clipboardData.files, "из буфера")
  }

  return (
    <>
      <style href="vibeui-file-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="file-002"
        data-over={over}
        className={className}
        style={palette}
      >
        <div
          data-part="zone"
          role="button"
          tabIndex={0}
          aria-label="Добавить файлы: перетащите, нажмите Enter или вставьте из буфера"
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
            <li>перетащить</li>
            <li>
              <kbd>Enter</kbd> выбрать
            </li>
            <li>
              <kbd>Ctrl</kbd> + <kbd>V</kbd> вставить
            </li>
          </ul>
          <input
            ref={picker}
            type="file"
            multiple
            accept={accept}
            tabIndex={-1}
            onChange={(event) => collect(event.target.files, "выбран")}
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

"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable009Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  defaultFolders?: number
  defaultList?: number
  minFolders?: number
  maxFolders?: number
  minList?: number
  maxList?: number
  step?: number
  onChange?: (sizes: [number, number]) => void
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  foldersTitle?: string
  foldersItems?: string[]
  listTitle?: string
  listItems?: string[]
  readerTitle?: string
  readerText?: string
  /** Строка состояния; {folders} и {list} заменяются на ширины колонок. */
  statusText?: string
  /** aria-valuetext разделителей; {size} заменяется на ширину колонки. */
  valueText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: три колонки почтового клиента и два независимых
// разделителя в пикселях. В отличие от связанной модели с общими границами,
// здесь у каждой полосы свой размер и свои пределы — ширина папок не тянет за
// собой ширину списка писем. Третья колонка размер не хранит и забирает
// остаток, поэтому сумма всегда сходится.
const STYLES = `
:where([data-vibeui-block="resizable-009"]){
--vibeui-resizable-009-bg:transparent;
--vibeui-resizable-009-pane:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-resizable-009-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-resizable-009-muted:color-mix(in oklab,var(--vibeui-resizable-009-fg) 68%,transparent);
--vibeui-resizable-009-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-resizable-009-surface:light-dark(oklch(0.975 0 265),oklch(0.31 0 265));
--vibeui-resizable-009-accent:light-dark(oklch(0.55 0.13 165),oklch(0.77 0.13 165));
--vibeui-resizable-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="resizable-009"]{color-scheme:dark}
[data-vibeui-block="resizable-009"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:40rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-009-border);border-radius:0.875rem;
background:var(--vibeui-resizable-009-bg);color:var(--vibeui-resizable-009-fg);
font-family:var(--vibeui-resizable-009-font);
}
[data-vibeui-block="resizable-009"] *{box-sizing:border-box}
[data-vibeui-block="resizable-009"] [data-part="frame"]{
display:flex;align-items:stretch;height:11rem;
border:1px solid var(--vibeui-resizable-009-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-009"] [data-part="pane"]{min-width:0;padding:0.625rem;overflow:auto;background:var(--vibeui-resizable-009-pane)}
[data-vibeui-block="resizable-009"] [data-part="pane"][data-role="fixed"]{flex:none}
[data-vibeui-block="resizable-009"] [data-part="pane"][data-role="fixed"]:first-child{background:var(--vibeui-resizable-009-surface)}
[data-vibeui-block="resizable-009"] [data-part="pane"][data-role="rest"]{flex:1;background:var(--vibeui-resizable-009-pane)}
[data-vibeui-block="resizable-009"] h3{
margin:0 0 0.3125rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-resizable-009-muted);
}
[data-vibeui-block="resizable-009"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.25rem}
[data-vibeui-block="resizable-009"] li{
font-size:0.75rem;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="resizable-009"] p{margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-resizable-009-muted)}
[data-vibeui-block="resizable-009"] [data-part="split"]{
flex:none;width:0.6875rem;position:relative;
background:var(--vibeui-resizable-009-surface);cursor:col-resize;touch-action:none;
}
[data-vibeui-block="resizable-009"] [data-part="split"]::before{
content:"";position:absolute;inset:0 calc(50% - 0.5px);background:var(--vibeui-resizable-009-border);
transition:background-color .15s ease;
}
[data-vibeui-block="resizable-009"] [data-part="split"]:hover::before,
[data-vibeui-block="resizable-009"] [data-part="split"][data-dragging="true"]::before{
inset:0 calc(50% - 1.5px);background:var(--vibeui-resizable-009-accent);
}
[data-vibeui-block="resizable-009"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-009-accent);outline-offset:-2px;
}
[data-vibeui-block="resizable-009"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-009-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-009"] *{animation:none!important;transition:none!important}}
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
 * Три колонки почтового клиента и два независимых разделителя в пикселях,
 * у каждого свои пределы. Один файл, ноль зависимостей.
 */
export function Resizable009({
  label = "Колонка",
  defaultFolders = 168,
  defaultList = 224,
  minFolders = 120,
  maxFolders = 220,
  minList = 170,
  maxList = 300,
  step = 12,
  onChange,
  foldersTitle = "Папки",
  foldersItems = ["Входящие", "Отправленные", "Черновики", "Спам"],
  listTitle = "Письма",
  listItems = [
    "Анна · Правки макета",
    "Игорь · Счёт № 118",
    "Отдел кадров · Отпуск",
    "Марина · Договор",
  ],
  readerTitle = "Письмо",
  readerText = "Правая колонка размер не хранит и забирает остаток ширины рамки — сумма трёх колонок не может разойтись.",
  statusText = "Папки — {folders} px · Письма — {list} px · остаток — чтение.",
  valueText = "{size} пикселей",
  background = "",
  accent,
  className,
  style,
  ...props
}: Resizable009Props) {
  const [folders, setFolders] = useState(defaultFolders)
  const [list, setList] = useState(defaultList)
  const [dragging, setDragging] = useState(-1)
  const frame = useRef<HTMLDivElement>(null)

  const foldersId = useId()
  const listId = useId()

  const palette = {
    ...(accent ? { "--vibeui-resizable-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-resizable-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const applyFolders = (next: number) => {
    const clamped = Math.round(Math.min(maxFolders, Math.max(minFolders, next)))

    setFolders(clamped)
    onChange?.([clamped, list])
  }

  const applyList = (next: number) => {
    const clamped = Math.round(Math.min(maxList, Math.max(minList, next)))

    setList(clamped)
    onChange?.([folders, clamped])
  }

  const onKeyDownFolders = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      applyFolders(folders - step)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      applyFolders(folders + step)
    } else if (event.key === "Home") {
      event.preventDefault()
      applyFolders(minFolders)
    } else if (event.key === "End") {
      event.preventDefault()
      applyFolders(maxFolders)
    }
  }

  const onKeyDownList = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      applyList(list - step)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      applyList(list + step)
    } else if (event.key === "Home") {
      event.preventDefault()
      applyList(minList)
    } else if (event.key === "End") {
      event.preventDefault()
      applyList(maxList)
    }
  }

  return (
    <>
      <style href="vibeui-resizable-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="resizable"
        data-vibeui-block="resizable-009"
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <section
            data-part="pane"
            data-role="fixed"
            id={foldersId}
            style={{ width: `${folders}px` }}
            aria-label={foldersTitle}
          >
            <h3>{foldersTitle}</h3>
            <ul>
              {foldersItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label={`${label} «${foldersTitle}»`}
            aria-controls={foldersId}
            aria-valuenow={folders}
            aria-valuemin={minFolders}
            aria-valuemax={maxFolders}
            aria-valuetext={valueText.replace("{size}", String(folders))}
            data-dragging={dragging === 0}
            onKeyDown={onKeyDownFolders}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              setDragging(0)
            }}
            onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
              if (dragging !== 0) {
                return
              }

              const box = frame.current?.getBoundingClientRect()

              if (!box) {
                return
              }

              applyFolders(event.clientX - box.left)
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId)
              setDragging(-1)
            }}
            onPointerCancel={() => setDragging(-1)}
          />
          <section
            data-part="pane"
            data-role="fixed"
            id={listId}
            style={{ width: `${list}px` }}
            aria-label={listTitle}
          >
            <h3>{listTitle}</h3>
            <ul>
              {listItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label={`${label} «${listTitle}»`}
            aria-controls={listId}
            aria-valuenow={list}
            aria-valuemin={minList}
            aria-valuemax={maxList}
            aria-valuetext={valueText.replace("{size}", String(list))}
            data-dragging={dragging === 1}
            onKeyDown={onKeyDownList}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              setDragging(1)
            }}
            onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
              if (dragging !== 1) {
                return
              }

              const box = frame.current?.getBoundingClientRect()

              if (!box) {
                return
              }

              applyList(event.clientX - box.left - folders)
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId)
              setDragging(-1)
            }}
            onPointerCancel={() => setDragging(-1)}
          />
          <section data-part="pane" data-role="rest" aria-label={readerTitle}>
            <h3>{readerTitle}</h3>
            <p>{readerText}</p>
          </section>
        </div>
        <p data-part="status" role="status">
          {statusText
            .replace("{folders}", String(folders))
            .replace("{list}", String(list))}
        </p>
      </div>
    </>
  )
}

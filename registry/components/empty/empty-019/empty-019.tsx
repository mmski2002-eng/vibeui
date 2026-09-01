"use client"

import { useState, type DragEvent } from "react"
import type { CSSProperties } from "react"

export type Empty019Props = {
  title?: string
  text?: string
  actionLabel?: string
  formats?: string
  onAction?: () => void
  onDropFiles?: (files: FileList) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: пустой проект — это ещё не папка на диске, а рабочая
// область, которая ждёт первых файлов. Рамка реагирует на перетаскивание
// прямо здесь: подсветка меняется в момент, когда файл заносят над зоной,
// а не только по факту сброса, — так видно, что цель поймана верно.
const STYLES = `
:where([data-vibeui-block="empty-019"]){
--vibeui-empty-019-bg:oklch(1 0 0);
--vibeui-empty-019-fg:oklch(0.21 0.014 265);
--vibeui-empty-019-muted:oklch(0.55 0.014 265);
--vibeui-empty-019-border:oklch(0.88 0.008 265);
--vibeui-empty-019-accent:oklch(0.55 0.17 265);
--vibeui-empty-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="empty-019"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:2rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-019-bg);
border:1.5px dashed var(--vibeui-empty-019-border);border-radius:1rem;
font-family:var(--vibeui-empty-019-font);color:var(--vibeui-empty-019-fg);
transition:border-color .15s ease,background-color .15s ease;
}
[data-vibeui-block="empty-019"][data-dragging="true"]{
border-color:var(--vibeui-empty-019-accent);
background:color-mix(in oklab,var(--vibeui-empty-019-accent) 6%,var(--vibeui-empty-019-bg));
}
[data-vibeui-block="empty-019"] [data-part="mark"]{
width:2.75rem;height:2.75rem;margin-bottom:0.25rem;color:var(--vibeui-empty-019-accent);
}
[data-vibeui-block="empty-019"] [data-part="title"]{margin:0;font-size:1.0625rem;font-weight:700;line-height:1.3}
[data-vibeui-block="empty-019"] [data-part="text"]{
margin:0;max-width:32ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-019-muted);
}
[data-vibeui-block="empty-019"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;margin-top:0.5rem;
height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-019-accent);color:oklch(0.99 0.01 265);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-019"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-empty-019-accent);outline-offset:2px;
}
[data-vibeui-block="empty-019"] [data-part="formats"]{
margin:0.375rem 0 0;font-size:0.6875rem;color:var(--vibeui-empty-019-muted);
}
@container (max-width: 20rem){
[data-vibeui-block="empty-019"] [data-part="mark"]{width:2.5rem;height:2.5rem}
[data-vibeui-block="empty-019"] [data-part="title"]{font-size:1rem}
[data-vibeui-block="empty-019"] [data-part="text"]{font-size:0.8125rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-019"] *{animation:none!important;transition:none!important}}
`

/**
 * Пустой проект как зона загрузки: рамка подсвечивается при перетаскивании
 * файлов над блоком, кнопка открывает выбор с диска. Один файл, клиентский
 * компонент на useState, без внешних зависимостей.
 */
export function Empty019({
  title = "В проекте пока пусто",
  text = "Перетащите файлы в эту область — они добавятся в проект. Или выберите их на диске.",
  actionLabel = "Выбрать файлы",
  formats = "Любые файлы проекта — до 100 МБ каждый",
  onAction,
  onDropFiles,
  accent,
  className,
  style,
}: Empty019Props) {
  const [isDragging, setIsDragging] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-empty-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (event.dataTransfer.files.length > 0) {
      onDropFiles?.(event.dataTransfer.files)
    }
  }

  return (
    <>
      <style href="vibeui-empty-019" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="empty-019"
        data-dragging={isDragging}
        className={className}
        style={palette}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <svg
          data-part="mark"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M3 8.5 5 4h6l1.5 2.5H21V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5Z" />
          <path d="M12 11v6" />
          <path d="m9.5 13.5 2.5-2.5 2.5 2.5" />
        </svg>
        <h3 data-part="title">{title}</h3>
        <p data-part="text">{text}</p>
        <button type="button" data-part="action" onClick={onAction}>
          {actionLabel}
        </button>
        <p data-part="formats">{formats}</p>
      </div>
    </>
  )
}

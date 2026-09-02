"use client"

import { useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Avatar036Props = Omit<ComponentProps<"div">, "children"> & {
  /** Текущее фото профиля. Выбор файла заменяет его. */
  src?: string
  label?: string
  hint?: string
  saveLabel?: string
  resetLabel?: string
  /** Подпись пустого кадра: компонент несёт русскую, проект подставляет свою. */
  emptyText?: string
  /** Цвет текста. Пусто — берётся из темы окружения, приглушённый выводится из него. */
  textColor?: string
  /** Готовый квадратный кадр. Размер стороны задаётся пропом output. */
  onCrop?: (blob: Blob) => void
  output?: number
}

// Идея компонента: обрезка на месте, без диалога и без библиотеки. Загруженная
// фотография почти никогда не квадратная, и «умное» кадрирование по центру
// режет людям головы — поэтому кадр выбирает человек: тянет портрет мышью или
// пальцем, масштабирует ползунком. Кадр круглый только на вид: маска рисуется
// подложкой с дыркой, а вырезает по-настоящему canvas, потому что круглый
// PNG в аватарке всё равно ляжет на чужой фон.
const STYLES = `
:where([data-vibeui-block="avatar-036"]){
--vibeui-avatar-036-frame:11rem;
--vibeui-avatar-036-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-avatar-036-surface:light-dark(oklch(1 0 0),oklch(0.21 0.012 265));
--vibeui-avatar-036-border:light-dark(oklch(0.9 0.008 265),oklch(0.31 0.012 265));
--vibeui-avatar-036-fg:light-dark(oklch(0.22 0.015 265),oklch(0.96 0.005 265));
--vibeui-avatar-036-muted:color-mix(in oklab,var(--vibeui-avatar-036-fg) 68%,transparent);
--vibeui-avatar-036-shade:light-dark(oklch(0.98 0.004 265),oklch(0.26 0.014 265));
--vibeui-avatar-036-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-036"]{
display:flex;flex-direction:column;align-items:center;gap:0.875rem;
padding:1.25rem;border-radius:1rem;
border:1px solid var(--vibeui-avatar-036-border);
background:var(--vibeui-avatar-036-surface);color:var(--vibeui-avatar-036-fg);
font-family:var(--vibeui-avatar-036-font);
}
[data-vibeui-block="avatar-036"] [data-part="frame"]{
position:relative;flex:none;overflow:hidden;
width:var(--vibeui-avatar-036-frame);height:var(--vibeui-avatar-036-frame);
border-radius:9999px;background:var(--vibeui-avatar-036-shade);
touch-action:none;cursor:grab;
}
[data-vibeui-block="avatar-036"][data-dragging="true"] [data-part="frame"]{cursor:grabbing}
[data-vibeui-block="avatar-036"] [data-part="frame"] img{
position:absolute;left:50%;top:50%;
transform-origin:center;
transform:translate(-50%,-50%) translate(var(--vibeui-avatar-036-x,0px),var(--vibeui-avatar-036-y,0px)) scale(var(--vibeui-avatar-036-zoom,1));
max-width:none;user-select:none;-webkit-user-drag:none;
}
[data-vibeui-block="avatar-036"] [data-part="empty"]{
display:flex;align-items:center;justify-content:center;
width:100%;height:100%;
color:var(--vibeui-avatar-036-muted);font-size:0.8125rem;text-align:center;padding:0 1.5rem;
}
[data-vibeui-block="avatar-036"] [data-part="zoom"]{
width:100%;max-width:var(--vibeui-avatar-036-frame);accent-color:var(--vibeui-avatar-036-accent);
}
[data-vibeui-block="avatar-036"] [data-part="zoom"]:disabled{opacity:.4}
[data-vibeui-block="avatar-036"] [data-part="hint"]{
margin:0;color:var(--vibeui-avatar-036-muted);font-size:0.75rem;text-align:center;line-height:1.35;
}
[data-vibeui-block="avatar-036"] [data-part="actions"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;
}
[data-vibeui-block="avatar-036"] [data-part="pick"],
[data-vibeui-block="avatar-036"] [data-part="save"],
[data-vibeui-block="avatar-036"] [data-part="reset"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
font-family:inherit;font-size:0.875rem;font-weight:600;line-height:1;
}
[data-vibeui-block="avatar-036"] [data-part="pick"]{
border:0;background:var(--vibeui-avatar-036-accent);color:oklch(0.99 0.003 265);
}
[data-vibeui-block="avatar-036"] [data-part="save"],
[data-vibeui-block="avatar-036"] [data-part="reset"]{
border:1px solid var(--vibeui-avatar-036-border);
background:transparent;color:inherit;
}
[data-vibeui-block="avatar-036"] [data-part="save"]:disabled,
[data-vibeui-block="avatar-036"] [data-part="reset"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="avatar-036"] :focus-visible{
outline:2px solid var(--vibeui-avatar-036-accent);outline-offset:2px;
}
/* Поле файла остаётся настоящим: клик по кнопке открывает его через label. */
[data-vibeui-block="avatar-036"] input[type="file"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-036"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-036"] *{animation:none!important;transition:none!important}}
`

const FRAME = 176

/**
 * Аватар с обрезкой: человек сам выбирает кадр, а не доверяет его середине
 * картинки. Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar036({
  src,
  label = "Выбрать фото",
  hint = "Перетащите фотографию в кружке и подберите масштаб",
  saveLabel = "Сохранить",
  resetLabel = "Сбросить",
  emptyText = "Фотография не выбрана",
  onCrop,
  output = 512,
  textColor,
  className,
  style,
  ...props
}: Avatar036Props) {
  const imageRef = useRef<HTMLImageElement>(null)
  const dragRef = useRef<{ x: number; y: number } | null>(null)
  // Объектные URL создаёт только выбор файла, поэтому освобождать нужно их, а
  // не пришедший пропом адрес.
  const objectUrlRef = useRef<string | null>(null)
  const [source, setSource] = useState<string | null>(src ?? null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  function pick(files: FileList | null) {
    const file = files?.[0]

    if (!file) {
      return
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }

    objectUrlRef.current = URL.createObjectURL(file)
    setSource(objectUrlRef.current)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!source) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      x: event.clientX - offset.x,
      y: event.clientY - offset.y,
    }
    setDragging(true)
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const start = dragRef.current

    if (!start) {
      return
    }

    setOffset({ x: event.clientX - start.x, y: event.clientY - start.y })
  }

  function endDrag() {
    dragRef.current = null
    setDragging(false)
  }

  /** Мыши здесь мало: кадр двигается и стрелками, шагом в восемь пикселей. */
  function nudge(event: KeyboardEvent<HTMLDivElement>) {
    const step = {
      ArrowLeft: [-8, 0],
      ArrowRight: [8, 0],
      ArrowUp: [0, -8],
      ArrowDown: [0, 8],
    }[event.key]

    if (!step || !source) {
      return
    }

    event.preventDefault()
    setOffset((current) => ({ x: current.x + step[0], y: current.y + step[1] }))
  }

  /**
   * Вырезание: то же преобразование, что и на экране, только в масштабе
   * выходного кадра. Кружок в результат не запекается — прозрачные углы
   * на чужом фоне выглядят обрезанными.
   */
  function crop() {
    const image = imageRef.current

    if (!image || !onCrop) {
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = output
    canvas.height = output

    const context = canvas.getContext("2d")

    if (!context) {
      return
    }

    const ratio = output / FRAME
    const width = image.width * zoom * ratio
    const height = image.height * zoom * ratio
    const x = output / 2 + offset.x * ratio - width / 2
    const y = output / 2 + offset.y * ratio - height / 2

    context.drawImage(image, x, y, width, height)
    canvas.toBlob((blob) => {
      if (blob) {
        onCrop(blob)
      }
    }, "image/webp")
  }

  const palette = {
    "--vibeui-avatar-036-x": `${offset.x}px`,
    "--vibeui-avatar-036-y": `${offset.y}px`,
    "--vibeui-avatar-036-zoom": zoom,
    ...(textColor ? { "--vibeui-avatar-036-fg": textColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-036" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-036"
        data-dragging={dragging}
        className={className}
        style={palette}
      >
        <div
          data-part="frame"
          role="group"
          aria-label="Кадр фотографии: стрелки сдвигают снимок"
          tabIndex={source ? 0 : -1}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={nudge}
        >
          {source ? (
            // Размер задаётся по меньшей стороне: кадр всегда заполнен целиком.
            <img
              ref={imageRef}
              src={source}
              alt=""
              width={FRAME}
              height={FRAME}
              style={{
                width: "auto",
                height: "auto",
                minWidth: FRAME,
                minHeight: FRAME,
              }}
              draggable={false}
            />
          ) : (
            <span data-part="empty">{emptyText}</span>
          )}
        </div>

        <input
          type="range"
          data-part="zoom"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          disabled={!source}
          aria-label="Масштаб"
          onChange={(event) => setZoom(Number(event.target.value))}
        />

        <div data-part="actions">
          <label data-part="pick">
            {label}
            <input
              type="file"
              accept="image/*"
              onChange={(event) => pick(event.target.files)}
            />
          </label>
          <button
            type="button"
            data-part="save"
            disabled={!source}
            onClick={crop}
          >
            {saveLabel}
          </button>
          <button
            type="button"
            data-part="reset"
            disabled={!source}
            onClick={() => {
              setZoom(1)
              setOffset({ x: 0, y: 0 })
            }}
          >
            {resetLabel}
          </button>
        </div>

        <p data-part="hint">{hint}</p>
      </div>
    </>
  )
}

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
--vibeui-avatar-036-ink:light-dark(oklch(0.24 0 265),oklch(0.96 0 265));
--vibeui-avatar-036-on-ink:light-dark(oklch(0.99 0 265),oklch(0.18 0 265));
--vibeui-avatar-036-surface:light-dark(oklch(0.995 0 265),oklch(0.2 0 265));
--vibeui-avatar-036-border:light-dark(oklch(0.91 0 265),oklch(0.3 0 265));
--vibeui-avatar-036-fg:light-dark(oklch(0.22 0 265),oklch(0.96 0 265));
--vibeui-avatar-036-muted:color-mix(in oklab,var(--vibeui-avatar-036-fg) 62%,transparent);
--vibeui-avatar-036-stage:light-dark(oklch(0.96 0 265),oklch(0.24 0 265));
--vibeui-avatar-036-track:light-dark(oklch(0.9 0 265),oklch(0.32 0 265));
--vibeui-avatar-036-shadow:light-dark(oklch(0.2 0 265 / 12%),oklch(0 0 0 / 45%));
--vibeui-avatar-036-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-036"]{
display:flex;flex-direction:column;align-items:center;gap:1rem;
padding:1.5rem 1.5rem 1.25rem;border-radius:1.375rem;
border:1px solid var(--vibeui-avatar-036-border);
background:
 radial-gradient(120% 90% at 50% -10%,color-mix(in oklab,var(--vibeui-avatar-036-stage) 70%,transparent) 0%,transparent 62%),
 var(--vibeui-avatar-036-surface);
color:var(--vibeui-avatar-036-fg);
font-family:var(--vibeui-avatar-036-font);
box-shadow:0 1px 2px var(--vibeui-avatar-036-shadow),0 20px 44px -28px var(--vibeui-avatar-036-shadow);
}
[data-vibeui-block="avatar-036"] *{box-sizing:border-box}
/* Подложка кадра: круг лежит на мягкой плашке, а не на голой карточке. */
[data-vibeui-block="avatar-036"] [data-part="stage"]{
display:grid;place-items:center;
padding:0.875rem;border-radius:1.125rem;
background:
 radial-gradient(70% 70% at 50% 25%,color-mix(in oklab,var(--vibeui-avatar-036-surface) 85%,transparent) 0%,transparent 70%),
 var(--vibeui-avatar-036-stage);
box-shadow:inset 0 1px 0 light-dark(oklch(1 0 0 / 70%),oklch(1 0 0 / 6%));
}
[data-vibeui-block="avatar-036"] [data-part="frame"]{
position:relative;flex:none;overflow:hidden;
width:var(--vibeui-avatar-036-frame);height:var(--vibeui-avatar-036-frame);
border-radius:9999px;background:var(--vibeui-avatar-036-stage);
box-shadow:
 0 0 0 1px light-dark(oklch(0.2 0 265 / 10%),oklch(1 0 0 / 12%)),
 0 0 0 0.4375rem var(--vibeui-avatar-036-surface),
 0 0 0 0.5rem light-dark(oklch(0.2 0 265 / 7%),oklch(1 0 0 / 8%)),
 0 14px 30px -18px var(--vibeui-avatar-036-shadow);
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
/* Ползунок: собственный трек и ручка, иначе браузер рисует системный синий. */
[data-vibeui-block="avatar-036"] [data-part="scale"]{
display:flex;align-items:center;gap:0.625rem;
width:100%;max-width:calc(var(--vibeui-avatar-036-frame) + 3rem);
color:var(--vibeui-avatar-036-muted);
}
[data-vibeui-block="avatar-036"] [data-part="scale"] svg{flex:none;width:0.875rem;height:0.875rem}
[data-vibeui-block="avatar-036"] [data-part="scale"] [data-icon="big"]{width:1.125rem;height:1.125rem}
[data-vibeui-block="avatar-036"] [data-part="zoom"]{
flex:1;min-width:0;height:1.25rem;margin:0;padding:0;
appearance:none;-webkit-appearance:none;background:transparent;cursor:pointer;
}
[data-vibeui-block="avatar-036"] [data-part="zoom"]::-webkit-slider-runnable-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,
 var(--vibeui-avatar-036-ink) var(--vibeui-avatar-036-fill,0%),
 var(--vibeui-avatar-036-track) var(--vibeui-avatar-036-fill,0%));
}
[data-vibeui-block="avatar-036"] [data-part="zoom"]::-moz-range-track{
height:0.375rem;border-radius:9999px;background:var(--vibeui-avatar-036-track);
}
[data-vibeui-block="avatar-036"] [data-part="zoom"]::-moz-range-progress{
height:0.375rem;border-radius:9999px;background:var(--vibeui-avatar-036-ink);
}
[data-vibeui-block="avatar-036"] [data-part="zoom"]::-webkit-slider-thumb{
-webkit-appearance:none;appearance:none;
width:1.125rem;height:1.125rem;margin-top:-0.375rem;border-radius:9999px;
border:1px solid light-dark(oklch(0.2 0 265 / 14%),oklch(1 0 0 / 18%));
background:var(--vibeui-avatar-036-surface);
box-shadow:0 1px 2px var(--vibeui-avatar-036-shadow),0 4px 10px -4px var(--vibeui-avatar-036-shadow);
}
[data-vibeui-block="avatar-036"] [data-part="zoom"]::-moz-range-thumb{
width:1.125rem;height:1.125rem;border-radius:9999px;
border:1px solid light-dark(oklch(0.2 0 265 / 14%),oklch(1 0 0 / 18%));
background:var(--vibeui-avatar-036-surface);
box-shadow:0 1px 2px var(--vibeui-avatar-036-shadow),0 4px 10px -4px var(--vibeui-avatar-036-shadow);
}
[data-vibeui-block="avatar-036"] [data-part="zoom"]:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="avatar-036"] [data-part="hint"]{
margin:0;color:var(--vibeui-avatar-036-muted);font-size:0.75rem;text-align:center;line-height:1.4;
}
[data-vibeui-block="avatar-036"] [data-part="actions"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;
}
[data-vibeui-block="avatar-036"] [data-part="pick"],
[data-vibeui-block="avatar-036"] [data-part="save"],
[data-vibeui-block="avatar-036"] [data-part="reset"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.375rem;
min-height:2.375rem;padding:0.375rem 1rem;border-radius:9999px;
font-family:inherit;font-size:0.8125rem;font-weight:600;letter-spacing:-0.01em;line-height:1;
transition:transform .16s ease,box-shadow .16s ease,background-color .16s ease;
}
[data-vibeui-block="avatar-036"] [data-part="pick"]{
border:0;background:var(--vibeui-avatar-036-ink);color:var(--vibeui-avatar-036-on-ink);
box-shadow:0 1px 2px var(--vibeui-avatar-036-shadow),0 8px 18px -10px var(--vibeui-avatar-036-shadow);
}
[data-vibeui-block="avatar-036"] [data-part="save"],
[data-vibeui-block="avatar-036"] [data-part="reset"]{
border:1px solid var(--vibeui-avatar-036-border);
background:var(--vibeui-avatar-036-surface);color:inherit;
box-shadow:0 1px 2px color-mix(in oklab,var(--vibeui-avatar-036-shadow) 60%,transparent);
}
[data-vibeui-block="avatar-036"] [data-part="pick"]:hover,
[data-vibeui-block="avatar-036"] [data-part="save"]:not(:disabled):hover,
[data-vibeui-block="avatar-036"] [data-part="reset"]:not(:disabled):hover{
transform:translateY(-1px);
box-shadow:0 2px 4px var(--vibeui-avatar-036-shadow),0 12px 22px -12px var(--vibeui-avatar-036-shadow);
}
[data-vibeui-block="avatar-036"] [data-part="pick"]:active,
[data-vibeui-block="avatar-036"] [data-part="save"]:not(:disabled):active,
[data-vibeui-block="avatar-036"] [data-part="reset"]:not(:disabled):active{transform:translateY(0)}
[data-vibeui-block="avatar-036"] [data-part="save"]:disabled,
[data-vibeui-block="avatar-036"] [data-part="reset"]:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}
[data-vibeui-block="avatar-036"] :focus-visible{
outline:2px solid var(--vibeui-avatar-036-ink);outline-offset:2px;
}
/* Поле файла остаётся настоящим: клик по кнопке открывает его через label. */
[data-vibeui-block="avatar-036"] input[type="file"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-036"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-036"] *{animation:none!important;transition:none!important}}
`

const FRAME = 176
const MAX_ZOOM = 3

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
  // Размер снимка на экране считается после загрузки: снимок 512 px в кадре
  // 176 px иначе показал бы одни ноздри.
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  )
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  /** Меньшая сторона снимка равна кадру: при масштабе 1 в круг влезает всё. */
  function fit(image: HTMLImageElement) {
    const scale = FRAME / Math.min(image.naturalWidth, image.naturalHeight)
    const width = Math.round(image.naturalWidth * scale)
    const height = Math.round(image.naturalHeight * scale)

    // Тот же размер возвращается прежним объектом: ref-функция пересоздаётся
    // на каждом рендере, и новый объект закрутил бы бесконечный цикл.
    setSize((current) =>
      current && current.width === width && current.height === height
        ? current
        : { width, height },
    )
  }

  /**
   * Снимок из кэша успевает загрузиться до гидратации, и onLoad для него уже
   * не сработает — размер приходится снимать прямо при появлении элемента.
   */
  function measure(image: HTMLImageElement | null) {
    imageRef.current = image

    if (image?.complete && image.naturalWidth > 0) {
      fit(image)
    }
  }

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
    setSize(null)
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
    "--vibeui-avatar-036-fill": `${((zoom - 1) / (MAX_ZOOM - 1)) * 100}%`,
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
        <div data-part="stage">
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
              <img
                ref={measure}
                src={source}
                alt=""
                width={size?.width ?? FRAME}
                height={size?.height ?? FRAME}
                style={{
                  width: `${size?.width ?? FRAME}px`,
                  height: `${size?.height ?? FRAME}px`,
                }}
                draggable={false}
                onLoad={(event) => fit(event.currentTarget)}
              />
            ) : (
              <span data-part="empty">{emptyText}</span>
            )}
          </div>
        </div>

        <div data-part="scale">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <circle cx="12" cy="12" r="6" />
          </svg>
          <input
            type="range"
            data-part="zoom"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            disabled={!source}
            aria-label="Масштаб"
            onChange={(event) => setZoom(Number(event.target.value))}
          />
          <svg
            viewBox="0 0 24 24"
            data-icon="big"
            aria-hidden="true"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>

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

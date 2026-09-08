"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Carousel017Shot = {
  title: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  /** Тон кадра в градусах: снимок рисуется градиентом, а не картинкой. */
  hue: number
}

export type Carousel017Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  shots?: Carousel017Shot[]
  /**
   * Открыть лайтбокс сразу и без модального режима: он остаётся внутри блока.
   * Режим для витрины и скриншотов — Escape и клик мимо в нём не работают.
   */
  defaultOpen?: boolean
  /** Шаблон счётчика: {n} — номер кадра, {total} — сколько всего. */
  counter?: string
  ratio?: "4:3" | "16:9" | "1:1"
  prevLabel?: string
  nextLabel?: string
  closeLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: галерея, где лента отвечает за обзор, а лайтбокс — за
// разглядывание. Крупный кадр открывается нативным <dialog>: ловушка фокуса,
// Escape и затемнение достаются от браузера, а не пишутся заново. Внутри
// лайтбокса — стрелки и счётчик «3 из 12»: без счётчика человек не знает,
// сколько ещё смотреть, и закрывает галерею на середине.
const STYLES = `
:where([data-vibeui-block="carousel-017"]){
--vibeui-carousel-017-bg:transparent;
--vibeui-carousel-017-surface:light-dark(oklch(1 0 0),oklch(0.23 0 265));
--vibeui-carousel-017-fg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-carousel-017-muted:color-mix(in oklab,var(--vibeui-carousel-017-fg) 68%,transparent);
--vibeui-carousel-017-border:light-dark(oklch(0.89 0 265),oklch(0.37 0 265));
--vibeui-carousel-017-accent:light-dark(oklch(0.53 0.17 39.8),oklch(0.77 0.13 39.8));
--vibeui-carousel-017-shadow:light-dark(oklch(0.2 0 265 / 42%),oklch(0 0 0 / 70%));
--vibeui-carousel-017-radius:0.75rem;
--vibeui-carousel-017-hue:268;
--vibeui-carousel-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-017"]{color-scheme:dark}
[data-vibeui-block="carousel-017"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:34rem;box-sizing:border-box;
background:var(--vibeui-carousel-017-bg);color:var(--vibeui-carousel-017-fg);
font-family:var(--vibeui-carousel-017-font);
}
[data-vibeui-block="carousel-017"] *{box-sizing:border-box}
[data-vibeui-block="carousel-017"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="carousel-017"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3;
color:var(--vibeui-carousel-017-fg);
}
[data-vibeui-block="carousel-017"] [data-part="total"]{
font-size:0.75rem;color:var(--vibeui-carousel-017-muted);font-variant-numeric:tabular-nums;
}
/* Лента: прокрутка живёт внутри блока и не тянет страницу вбок. */
[data-vibeui-block="carousel-017"] [data-part="strip"]{
display:flex;gap:0.5rem;margin:0;padding:0.125rem;list-style:none;
overflow-x:auto;scroll-snap-type:x mandatory;overscroll-behavior-x:contain;
}
[data-vibeui-block="carousel-017"] [data-part="item"]{flex:none;scroll-snap-align:start}
[data-vibeui-block="carousel-017"] [data-part="thumb"]{
position:relative;display:block;width:5.5rem;aspect-ratio:4/3;padding:0;
appearance:none;cursor:pointer;border:1px solid var(--vibeui-carousel-017-border);
border-radius:0.5rem;overflow:hidden;
transition:transform .16s ease,box-shadow .16s ease;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="carousel-017"] [data-part="thumb"][data-empty="true"]{background:linear-gradient(146deg,oklch(0.74 0.15 var(--vibeui-carousel-017-hue)),oklch(0.4 0.13 calc(var(--vibeui-carousel-017-hue) + 42)));}
[data-vibeui-block="carousel-017"] [data-part="thumb"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="carousel-017"] [data-part="thumb"]:hover{transform:translateY(-2px);box-shadow:0 8px 18px -10px var(--vibeui-carousel-017-shadow)}
[data-vibeui-block="carousel-017"] [data-part="thumb"]:focus-visible{outline:2px solid var(--vibeui-carousel-017-accent);outline-offset:2px}
[data-vibeui-block="carousel-017"] [data-part="thumb"][aria-current="true"]{box-shadow:0 0 0 2px var(--vibeui-carousel-017-accent)}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="carousel-017"] dialog{
margin:auto;width:min(34rem,calc(100vw - 2rem));padding:0.75rem;
border:1px solid var(--vibeui-carousel-017-border);
border-radius:var(--vibeui-carousel-017-radius);
background:var(--vibeui-carousel-017-surface);color:var(--vibeui-carousel-017-fg);
box-shadow:0 26px 64px -26px var(--vibeui-carousel-017-shadow);
font-family:var(--vibeui-carousel-017-font);
}
[data-vibeui-block="carousel-017"] dialog::backdrop{background:light-dark(oklch(0.2 0 265 / 55%),oklch(0.06 0 265 / 72%))}
[data-vibeui-block="carousel-017"] [data-part="stage"]{
position:relative;display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.5rem;border-radius:0.625rem;aspect-ratio:4/3;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="carousel-017"] [data-part="stage"][data-empty="true"]{background:linear-gradient(146deg,oklch(0.74 0.15 var(--vibeui-carousel-017-hue)),oklch(0.4 0.13 calc(var(--vibeui-carousel-017-hue) + 42)));}
[data-vibeui-block="carousel-017"] [data-part="stage"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="carousel-017"] [data-part="stage"][data-ratio="16:9"]{aspect-ratio:16/9}
[data-vibeui-block="carousel-017"] [data-part="stage"][data-ratio="1:1"]{aspect-ratio:1/1}
[data-vibeui-block="carousel-017"] [data-part="prev"],
[data-vibeui-block="carousel-017"] [data-part="next"],
[data-vibeui-block="carousel-017"] [data-part="close"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:2rem;height:2rem;padding:0;
appearance:none;cursor:pointer;border:0;border-radius:999px;
background:oklch(0.18 0 265 / 55%);color:oklch(0.98 0 0);
font:inherit;font-size:0.875rem;line-height:1;
}
[data-vibeui-block="carousel-017"] [data-part="close"]{position:absolute;top:0.5rem;right:0.5rem}
[data-vibeui-block="carousel-017"] [data-part="prev"]:hover,
[data-vibeui-block="carousel-017"] [data-part="next"]:hover,
[data-vibeui-block="carousel-017"] [data-part="close"]:hover{background:oklch(0.18 0 265 / 78%)}
[data-vibeui-block="carousel-017"] dialog button:focus-visible{outline:2px solid oklch(0.98 0 0);outline-offset:2px}
[data-vibeui-block="carousel-017"] [data-part="caption"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
margin:0.5rem 0 0;font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-carousel-017-fg);
}
[data-vibeui-block="carousel-017"] [data-part="count"]{
flex:none;font-variant-numeric:tabular-nums;color:var(--vibeui-carousel-017-muted);
}
/* showModal() делает фон inert, но не запрещает прокрутку страницы. */
html:has([data-vibeui-block="carousel-017"] dialog[open]:modal){overflow:hidden}
/* Витринный режим: лайтбокс стоит в потоке под лентой, а не в верхнем слое. */
[data-vibeui-block="carousel-017"] dialog:not(:modal){
position:static;width:100%;max-width:100%;margin:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SHOTS: Carousel017Shot[] = [
  { title: "Рассвет над фьордом", hue: 250 },
  { title: "Терраса у воды", hue: 196 },
  { title: "Сосны в тумане", hue: 156 },
  { title: "Поле в июле", hue: 104 },
  { title: "Песчаный склон", hue: 64 },
  { title: "Закат на трассе", hue: 32 },
  { title: "Ночной квартал", hue: 300 },
  { title: "Витрина в дождь", hue: 274 },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона.
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
 * Галерея с лайтбоксом: лента миниатюр и крупный кадр в нативном dialog со
 * стрелками и счётчиком. Один файл, ноль зависимостей, кадры на градиентах.
 */
export function Carousel017({
  label = "Съёмка маршрута",
  shots = DEFAULT_SHOTS,
  defaultOpen = false,
  counter = "{n} из {total}",
  ratio = "4:3",
  prevLabel = "Предыдущий кадр",
  nextLabel = "Следующий кадр",
  closeLabel = "Закрыть",
  background = "",
  accent,
  className,
  style,
  ...props
}: Carousel017Props) {
  const uid = useId()
  const box = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(0)
  const total = shots.length
  const shot = shots[index] ?? shots[0]

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальный лайтбокс живёт внутри своего
    // блока и не уводит страницу в верхний слой. Витрине нужен именно такой.
    box.current?.show()

    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])

  function step(delta: number) {
    setIndex((previous) => (previous + delta + total) % total)
  }

  function onDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      step(-1)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      step(1)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-carousel-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-carousel-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const countText = counter
    .replace("{n}", String(index + 1))
    .replace("{total}", String(total))

  return (
    <>
      <style href="vibeui-carousel-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="carousel"
        data-vibeui-block="carousel-017"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title" id={`${uid}-title`}>
            {label}
          </h3>
          <span data-part="total">{countText}</span>
        </div>

        <ul data-part="strip">
          {shots.map((entry, position) => (
            <li key={entry.title} data-part="item">
              <button
                type="button"
                data-part="thumb"
                data-empty={shot.image ? undefined : "true"}
                aria-label={entry.title}
                aria-current={position === index || undefined}
                style={
                  {
                    "--vibeui-carousel-017-hue": String(entry.hue),
                  } as CSSProperties
                }
                onClick={() => {
                  setIndex(position)
                  box.current?.showModal()
                }}
              >
                {shot.image ? (
                  <img
                    src={shot.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </button>
            </li>
          ))}
        </ul>

        <dialog
          ref={box}
          aria-labelledby={`${uid}-title`}
          onKeyDown={onDialogKeyDown}
        >
          <div
            data-part="stage"
            data-empty={shot.image ? undefined : "true"}
            data-ratio={ratio}
            style={
              {
                "--vibeui-carousel-017-hue": String(shot?.hue ?? 268),
              } as CSSProperties
            }
          >
            {shot.image ? (
              <img src={shot.image} alt="" loading="lazy" decoding="async" />
            ) : null}
            <button
              type="button"
              data-part="prev"
              aria-label={prevLabel}
              onClick={() => step(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              data-part="close"
              aria-label={closeLabel}
              onClick={() => box.current?.close()}
            >
              ✕
            </button>
            <button
              type="button"
              data-part="next"
              aria-label={nextLabel}
              onClick={() => step(1)}
            >
              ›
            </button>
          </div>
          <p data-part="caption">
            <span>{shot?.title}</span>
            <span data-part="count" aria-live="polite">
              {countText}
            </span>
          </p>
        </dialog>
      </div>
    </>
  )
}

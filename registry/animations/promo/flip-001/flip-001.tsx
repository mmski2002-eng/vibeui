"use client"

import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react"

export type Flip001Props = {
  /** Лицевая сторона. Пусто — картинка с подписью из image/title. */
  front?: ReactNode
  /** Обратная сторона. Пусто — описание с ссылкой из text/linkLabel. */
  back?: ReactNode
  image?: string
  imageAlt?: string
  eyebrow?: string
  title?: string
  text?: string
  linkLabel?: string
  linkHref?: string
  /** Что переворачивает: клик и клавиатура или наведение. */
  trigger?: "click" | "hover"
  /** Ось переворота. */
  axis?: "y" | "x"
  /** Пропорции карточки: «4 / 5», «3 / 2», «1». */
  aspect?: string
  /** Ширина карточки: «22rem», «100%». */
  width?: string
  /** Начальное состояние. */
  flipped?: boolean
  /** Подсказка в углу лицевой стороны. Пусто — без подсказки. */
  hint?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Переворачивающаяся карточка: две стороны в одном 3D-кадре. Кадр держит
// perspective, внутренний слой — preserve-3d и rotateY/rotateX; у сторон
// backface-visibility:hidden, обратная заранее повёрнута на 180°. Перекрытие
// через translateZ(1px) убирает мерцание граней на полпути. Скрытая сторона
// получает inert, чтобы Tab не уходил на невидимую ссылку.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="flip-001"]){
--vibeui-flip-001-bg:transparent;
--vibeui-flip-001-card:light-dark(#ffffff,#171a1f);
--vibeui-flip-001-back:light-dark(#111318,#f4f2ee);
--vibeui-flip-001-fg:light-dark(#111318,#f4f2ee);
--vibeui-flip-001-on-back:light-dark(#f4f2ee,#111318);
--vibeui-flip-001-muted:light-dark(color-mix(in oklab,#111318 60%,#ffffff),color-mix(in oklab,#f4f2ee 60%,#171a1f));
--vibeui-flip-001-line:light-dark(color-mix(in oklab,#111318 12%,#ffffff),color-mix(in oklab,#f4f2ee 14%,#171a1f));
--vibeui-flip-001-accent:#c2410c;
--vibeui-flip-001-radius:1.5rem;
--vibeui-flip-001-duration:.8s;
--vibeui-flip-001-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-flip-001-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="flip-001"]{color-scheme:dark}
:where([data-vibeui-block="flip-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="flip-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="flip-001"]{box-sizing:border-box;display:block;background:var(--vibeui-flip-001-bg);color:var(--vibeui-flip-001-fg);font-family:var(--vibeui-flip-001-font);font-size:.9375rem;line-height:1.5;perspective:1400px;width:var(--vibeui-flip-001-width,22rem);max-width:100%}
[data-vibeui-block="flip-001"] *{box-sizing:border-box}
[data-vibeui-block="flip-001"] [data-part="card"]{position:relative;display:block;width:100%;aspect-ratio:var(--vibeui-flip-001-aspect,4/5);margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;transform-style:preserve-3d;transition:transform var(--vibeui-flip-001-duration) var(--vibeui-flip-001-ease);-webkit-tap-highlight-color:transparent}
[data-vibeui-block="flip-001"] [data-part="card"]:focus-visible{outline:none}
[data-vibeui-block="flip-001"] [data-part="card"]:focus-visible > [data-part="side"]{outline:2px solid var(--vibeui-flip-001-accent);outline-offset:3px}
[data-vibeui-block="flip-001"][data-axis="y"] [data-part="card"][data-flipped="true"]{transform:rotateY(180deg)}
[data-vibeui-block="flip-001"][data-axis="x"] [data-part="card"][data-flipped="true"]{transform:rotateX(-180deg)}
[data-vibeui-block="flip-001"][data-trigger="hover"][data-axis="y"] [data-part="card"]:hover{transform:rotateY(180deg)}
[data-vibeui-block="flip-001"][data-trigger="hover"][data-axis="x"] [data-part="card"]:hover{transform:rotateX(-180deg)}
[data-vibeui-block="flip-001"] [data-part="side"]{position:absolute;inset:0;display:flex;flex-direction:column;overflow:hidden;border-radius:var(--vibeui-flip-001-radius);border:1px solid var(--vibeui-flip-001-line);backface-visibility:hidden;-webkit-backface-visibility:hidden;transform:translateZ(1px)}
[data-vibeui-block="flip-001"] [data-part="side"][data-side="front"]{background:var(--vibeui-flip-001-card)}
[data-vibeui-block="flip-001"] [data-part="side"][data-side="back"]{background:var(--vibeui-flip-001-back);color:var(--vibeui-flip-001-on-back);padding:1.5rem;justify-content:flex-end;gap:.75rem}
[data-vibeui-block="flip-001"][data-axis="y"] [data-part="side"][data-side="back"]{transform:rotateY(180deg) translateZ(1px)}
[data-vibeui-block="flip-001"][data-axis="x"] [data-part="side"][data-side="back"]{transform:rotateX(180deg) translateZ(1px)}
[data-vibeui-block="flip-001"] [data-part="picture"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1.4s var(--vibeui-flip-001-ease)}
[data-vibeui-block="flip-001"] [data-part="card"]:hover [data-part="picture"]{transform:scale(1.04)}
[data-vibeui-block="flip-001"] [data-part="shade"]{position:absolute;inset:0;background:linear-gradient(to top,rgb(0 0 0 / .6),rgb(0 0 0 / 0) 55%)}
[data-vibeui-block="flip-001"] [data-part="caption"]{position:relative;margin-top:auto;padding:1.5rem;color:#fff;display:grid;gap:.25rem}
[data-vibeui-block="flip-001"] [data-part="eyebrow"]{margin:0;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;opacity:.8}
[data-vibeui-block="flip-001"] [data-part="title"]{margin:0;font-size:clamp(1.25rem,6cqi,1.75rem);font-weight:700;line-height:1.1;letter-spacing:-.01em}
[data-vibeui-block="flip-001"] [data-part="hint"]{position:absolute;top:1rem;right:1rem;display:inline-flex;align-items:center;gap:.4rem;padding:.35rem .7rem;border-radius:999px;background:rgb(255 255 255 / .85);color:#111318;font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;backdrop-filter:blur(6px)}
[data-vibeui-block="flip-001"] [data-part="hint"]::before{content:"";width:.7rem;height:.7rem;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;transform:rotate(-30deg)}
[data-vibeui-block="flip-001"] [data-part="back-title"]{margin:0;font-size:1.35rem;font-weight:700;line-height:1.15}
[data-vibeui-block="flip-001"] [data-part="text"]{margin:0;opacity:.8}
[data-vibeui-block="flip-001"] [data-part="link"]{display:inline-flex;align-items:center;gap:.5rem;align-self:flex-start;margin-top:.5rem;padding:.6rem 1rem;border-radius:999px;background:var(--vibeui-flip-001-accent);color:#fff;font-weight:600;font-size:.85rem;text-decoration:none;transition:transform .2s}
[data-vibeui-block="flip-001"] [data-part="link"]:hover{transform:translateY(-1px)}
[data-vibeui-block="flip-001"] [data-part="link"]:focus-visible{outline:2px solid currentColor;outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="flip-001"] [data-part="card"],[data-vibeui-block="flip-001"] [data-part="picture"]{transition:none!important}}`

/** Переворачивающаяся 3D-карточка: лицевая с фото, обратная с описанием и ссылкой. */
export function Flip001({
  front,
  back,
  image = "",
  imageAlt = "",
  eyebrow = "Проект",
  title = "Дом у воды",
  text = "Частный дом на берегу залива: дерево, стекло и терраса с видом на закат. Проект 2025 года.",
  linkLabel = "Смотреть проект",
  linkHref = "#",
  trigger = "click",
  axis = "y",
  aspect = "4 / 5",
  width = "22rem",
  flipped: initial = false,
  hint = "перевернуть",
  tone = "auto",
  accent,
  className,
  style,
}: Flip001Props) {
  const [flipped, setFlipped] = useState(initial)
  const palette = {
    ...(accent ? { "--vibeui-flip-001-accent": accent } : null),
    "--vibeui-flip-001-aspect": aspect,
    "--vibeui-flip-001-width": width,
    ...style,
  } as CSSProperties
  const clickable = trigger === "click"

  const toggle = () => setFlipped((value) => !value)
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      toggle()
    }
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-flip-001" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="flip-001"
        data-tone={tone === "auto" ? undefined : tone}
        data-axis={axis}
        data-trigger={trigger}
        className={className}
        style={palette}
      >
        <div
          data-part="card"
          data-flipped={clickable ? flipped : undefined}
          role={clickable ? "button" : undefined}
          tabIndex={clickable ? 0 : undefined}
          aria-pressed={clickable ? flipped : undefined}
          onClick={clickable ? toggle : undefined}
          onKeyDown={clickable ? onKey : undefined}
        >
          <div data-part="side" data-side="front" inert={clickable && flipped ? true : undefined}>
            {front ?? (
              <>
                {image ? <img data-part="picture" src={image} alt={imageAlt} loading="lazy" /> : null}
                <span data-part="shade" />
                {hint ? <span data-part="hint">{hint}</span> : null}
                <span data-part="caption">
                  {eyebrow ? <span data-part="eyebrow">{eyebrow}</span> : null}
                  <span data-part="title">{title}</span>
                </span>
              </>
            )}
          </div>
          <div data-part="side" data-side="back" inert={clickable && !flipped ? true : undefined}>
            {back ?? (
              <>
                <p data-part="back-title">{title}</p>
                <p data-part="text">{text}</p>
                {linkLabel ? (
                  <a data-part="link" href={linkHref} onClick={(event) => event.stopPropagation()}>
                    {linkLabel} →
                  </a>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

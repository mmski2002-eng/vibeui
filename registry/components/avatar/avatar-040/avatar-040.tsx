"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties, PointerEvent } from "react"

export type Avatar040Props = Omit<ComponentProps<"div">, "children"> & {
  name?: string
  role?: string
  /** Фото профиля. Пусто — в кадре инициалы имени на цветной подложке. */
  src?: string
  /** Метка в углу снимка. */
  badge?: string
  /** Подпись у нижней кромки: короткий факт о человеке. */
  caption?: string
  accent?: string
  /** Цвет текста. Пусто — берётся из темы окружения, приглушённый выводится из него. */
  textColor?: string
}

// Идея компонента: портрет живёт в объёме, а не на плоскости. Курсор наклоняет
// карточку к себе, а слои — снимок, подпись, метка — разнесены по глубине
// через translateZ, поэтому при наклоне они разъезжаются параллаксом, а не
// едут монолитом. Наклон считается от положения курсора внутри карточки, тем
// же и водится блик: диагональный отблеск идёт за указателем. На тач всё то
// же по удержанию пальца — pointer-события накрывают и мышь, и касание.
// Наклон отдан CSS-переменным, а не инлайновому transform: при
// prefers-reduced-motion одно правило гасит его целиком, и карточка остаётся
// плоской.
const STYLES = `
:where([data-vibeui-block="avatar-040"]){
--vibeui-avatar-040-fg:light-dark(oklch(0.24 0 265),oklch(0.96 0 265));
--vibeui-avatar-040-muted:color-mix(in oklab,var(--vibeui-avatar-040-fg) 62%,transparent);
--vibeui-avatar-040-surface:light-dark(oklch(0.995 0 265),oklch(0.205 0 265));
--vibeui-avatar-040-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 14%));
--vibeui-avatar-040-accent:light-dark(oklch(0.55 0.2 274),oklch(0.72 0.15 274));
--vibeui-avatar-040-photo:light-dark(oklch(0.9 0.05 274),oklch(0.34 0.07 274));
--vibeui-avatar-040-on-photo:light-dark(oklch(0.4 0.13 274),oklch(0.9 0.06 274));
--vibeui-avatar-040-shadow:light-dark(oklch(0.2 0.02 274 / 22%),oklch(0 0 0 / 55%));
--vibeui-avatar-040-tilt:10deg;
--vibeui-avatar-040-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-040"]{color-scheme:dark}
[data-vibeui-block="avatar-040"]{
display:block;width:100%;max-width:20rem;
perspective:52rem;
color:var(--vibeui-avatar-040-fg);font-family:var(--vibeui-avatar-040-font);
}
[data-vibeui-block="avatar-040"] *{box-sizing:border-box}
/* Слой наклона: rx/ry приходят переменными, released — плавный возврат с
   перелётом, во время движения короткий transition держит карточку у курсора. */
[data-vibeui-block="avatar-040"] [data-part="card"]{
position:relative;overflow:hidden;
display:block;width:100%;aspect-ratio:4 / 5;
border-radius:1.375rem;border:1px solid var(--vibeui-avatar-040-border);
background:var(--vibeui-avatar-040-surface);
transform-style:preserve-3d;
transform:rotateX(var(--vibeui-avatar-040-rx,0deg)) rotateY(var(--vibeui-avatar-040-ry,0deg));
transition:transform .5s cubic-bezier(.22,1.2,.36,1),box-shadow .5s ease;
box-shadow:0 1px 2px var(--vibeui-avatar-040-shadow),0 18px 40px -26px var(--vibeui-avatar-040-shadow);
}
[data-vibeui-block="avatar-040"] [data-part="card"][data-active]{
transition:transform .12s ease,box-shadow .12s ease;
box-shadow:0 2px 6px var(--vibeui-avatar-040-shadow),0 34px 60px -30px var(--vibeui-avatar-040-shadow);
}
[data-vibeui-block="avatar-040"] [data-part="card"]:focus-visible{
outline:2px solid var(--vibeui-avatar-040-accent);outline-offset:3px;
}
/* Снимок — самый глубокий слой: на наклоне уходит назад сильнее подписи. */
[data-vibeui-block="avatar-040"] [data-part="photo"]{
position:absolute;inset:0;transform:translateZ(0.1px);
background:var(--vibeui-avatar-040-photo);
}
[data-vibeui-block="avatar-040"] [data-part="photo"] img{
width:100%;height:100%;object-fit:cover;display:block;user-select:none;-webkit-user-drag:none;
}
[data-vibeui-block="avatar-040"] [data-part="initials"]{
display:flex;align-items:center;justify-content:center;width:100%;height:100%;
color:var(--vibeui-avatar-040-on-photo);font-size:4rem;font-weight:680;letter-spacing:-0.02em;
}
/* Тень к нижней кромке: имя читается поверх любого снимка. */
[data-vibeui-block="avatar-040"] [data-part="veil"]{
position:absolute;inset:0;transform:translateZ(1px);pointer-events:none;
background:linear-gradient(180deg,transparent 42%,oklch(0.12 0.02 274 / 30%) 70%,oklch(0.1 0.02 274 / 78%) 100%);
}
/* Блик за курсором: gx/gy — доля указателя внутри карточки, active гасит его
   при уходе. Слой самый передний, поэтому отблеск лежит поверх снимка. */
[data-vibeui-block="avatar-040"] [data-part="glare"]{
position:absolute;inset:0;transform:translateZ(24px);pointer-events:none;mix-blend-mode:soft-light;
opacity:var(--vibeui-avatar-040-active,0);transition:opacity .3s ease;
background:radial-gradient(22rem 22rem at var(--vibeui-avatar-040-gx,50%) var(--vibeui-avatar-040-gy,50%),oklch(1 0 0 / 65%) 0%,oklch(1 0 0 / 12%) 26%,transparent 52%);
}
[data-vibeui-block="avatar-040"] [data-part="body"]{
position:absolute;inset:auto 0 0 0;transform:translateZ(40px);
display:flex;flex-direction:column;gap:0.375rem;
padding:1.25rem 1.375rem 1.375rem;
}
[data-vibeui-block="avatar-040"] [data-part="badge"]{
position:absolute;top:1rem;left:1rem;transform:translateZ(56px);
display:inline-flex;align-items:center;
padding:0.3125rem 0.625rem;border-radius:9999px;
background:oklch(0.12 0.02 274 / 42%);color:oklch(0.98 0 0);
font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
box-shadow:inset 0 0 0 1px oklch(1 0 0 / 16%);
}
[data-vibeui-block="avatar-040"] [data-part="name"]{
margin:0;font-size:1.3125rem;font-weight:670;letter-spacing:-0.02em;line-height:1.15;color:oklch(0.99 0 0);
text-shadow:0 1px 12px oklch(0.1 0.02 274 / 55%);
}
[data-vibeui-block="avatar-040"] [data-part="role"]{
margin:0;font-size:0.8125rem;line-height:1.35;color:oklch(0.99 0 0 / 82%);
text-shadow:0 1px 10px oklch(0.1 0.02 274 / 55%);
}
[data-vibeui-block="avatar-040"] [data-part="caption"]{
margin:0.5rem 0 0;display:inline-flex;align-items:center;gap:0.4375rem;
font-size:0.75rem;font-weight:600;color:oklch(0.99 0 0 / 88%);
}
[data-vibeui-block="avatar-040"] [data-part="caption"]::before{
content:"";width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-avatar-040-accent);box-shadow:0 0 10px var(--vibeui-avatar-040-accent);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="avatar-040"] [data-part="card"]{transform:none!important}
[data-vibeui-block="avatar-040"] *{transition:none!important}
}
`

/** Инициалы имени: одна буква для одного слова, две — для двух и более. */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) {
    return "?"
  }

  const letters =
    words.length === 1
      ? words[0].slice(0, 1)
      : words[0].slice(0, 1) + words[words.length - 1].slice(0, 1)

  return letters.toUpperCase()
}

/**
 * Аватар-карточка с наклоном: курсор или палец разворачивают портрет в объёме,
 * слои разъезжаются параллаксом, за указателем идёт блик. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Avatar040({
  name = "Мария Гурова",
  role = "Продуктовый дизайнер",
  src = "",
  badge = "3D",
  caption = "Наведите или удерживайте",
  accent,
  textColor,
  className,
  style,
  ...props
}: Avatar040Props) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: 0 })
  const frameRef = useRef<number | null>(null)

  function track(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height

    // rAF гасит поток pointermove: за кадр применяется последнее положение,
    // а не десяток промежуточных — наклон остаётся гладким.
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
    }

    frameRef.current = requestAnimationFrame(() => {
      setTilt({
        // Курсор справа кренит карточку вправо, снизу — вниз: знаки подобраны
        // так, чтобы портрет наклонялся навстречу указателю.
        ry: (px - 0.5) * 2 * 10,
        rx: -(py - 0.5) * 2 * 10,
        gx: px * 100,
        gy: py * 100,
        active: 1,
      })
    })
  }

  function reset() {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: 0 })
  }

  const palette = {
    "--vibeui-avatar-040-rx": `${tilt.rx}deg`,
    "--vibeui-avatar-040-ry": `${tilt.ry}deg`,
    "--vibeui-avatar-040-gx": `${tilt.gx}%`,
    "--vibeui-avatar-040-gy": `${tilt.gy}%`,
    "--vibeui-avatar-040-active": tilt.active,
    ...(accent ? { "--vibeui-avatar-040-accent": accent } : null),
    ...(textColor ? { "--vibeui-avatar-040-fg": textColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-040" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-040"
        className={className}
        style={palette}
      >
        <div
          data-part="card"
          data-active={tilt.active ? "" : undefined}
          tabIndex={0}
          role="img"
          aria-label={`${name}, ${role}`}
          onPointerMove={track}
          onPointerLeave={reset}
          onPointerUp={reset}
          onPointerCancel={reset}
        >
          <div data-part="photo">
            {src ? (
              <img src={src} alt="" draggable={false} />
            ) : (
              <span data-part="initials" aria-hidden="true">
                {initialsOf(name)}
              </span>
            )}
          </div>
          <div data-part="veil" aria-hidden="true" />
          <div data-part="glare" aria-hidden="true" />
          {badge ? (
            <span data-part="badge" aria-hidden="true">
              {badge}
            </span>
          ) : null}
          <div data-part="body">
            <p data-part="name">{name}</p>
            <p data-part="role">{role}</p>
            {caption ? <p data-part="caption">{caption}</p> : null}
          </div>
        </div>
      </div>
    </>
  )
}

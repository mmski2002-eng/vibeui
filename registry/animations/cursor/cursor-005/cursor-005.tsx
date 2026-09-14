"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Cursor005Props = Omit<ComponentProps<"div">, "children"> & {
  /** Картинки шлейфа; идут по кругу в порядке массива. */
  images?: string[]
  /** Подпись в центре поля, пока курсор его не тронул. */
  caption?: string
  /** Сколько пикселей нужно пройти курсором, чтобы появилась следующая картинка. */
  threshold?: number
  /** Сторона картинки в пикселях. */
  size?: number
  /** Сколько живёт одна картинка, мс: всплытие, пауза и растворение. */
  lifetime?: number
  /** Разброс поворота, градусы: каждая картинка ложится под случайным углом ±rotate. */
  rotate?: number
  /** Сколько картинок может висеть одновременно: старше — вытесняются. */
  max?: number
  /** Цвет подписи. Пусто — из палитры. */
  accent?: string
  /** Пусто — подложки нет, поле ложится на фон страницы. */
  background?: string
}

const DEFAULT_IMAGES = [
  "/demo/cards/square-01.webp",
  "/demo/posters/poster-01.webp",
  "/demo/cards/square-02.webp",
  "/demo/posters/poster-04.webp",
  "/demo/cards/square-03.webp",
  "/demo/posters/poster-02.webp",
  "/demo/cards/square-04.webp",
  "/demo/posters/poster-05.webp",
  "/demo/cards/square-05.webp",
  "/demo/posters/poster-06.webp",
]

// Идея компонента: за курсором остаётся шлейф картинок. На каждые threshold
// пикселей пути в точке курсора всплывает следующая картинка набора, ложится
// под случайным углом, секунду держится и растворяется — призраком, как
// след на сетчатке. Свежая всегда сверху.
//
// Картинки не создаются на каждое движение: пул из max <img> заранее в
// разметке и переиспользуется по кругу. Ход одной картинки — CSS-анимация,
// JS только ставит точку, угол и перезапускает её. Так ничего не
// аллоцируется в pointermove, и шлейф не роняет кадры на слабой машине.
const STYLES = `
:where([data-vibeui-block="cursor-005"]){
--vibeui-cursor-005-bg:transparent;
--vibeui-cursor-005-fg:light-dark(oklch(0.22 0.012 265),oklch(0.95 0.005 265));
--vibeui-cursor-005-caption:color-mix(in oklab,var(--vibeui-cursor-005-fg) 55%,transparent);
--vibeui-cursor-005-border:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 12%));
--vibeui-cursor-005-size:160px;
--vibeui-cursor-005-life:1200ms;
--vibeui-cursor-005-radius:0.75rem;
--vibeui-cursor-005-out:cubic-bezier(0.16,1,0.3,1);
--vibeui-cursor-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cursor-005"]{color-scheme:dark}
[data-vibeui-block="cursor-005"]{
position:relative;box-sizing:border-box;width:100%;aspect-ratio:16/9;min-height:14rem;
overflow:hidden;border-radius:1rem;border:1px solid var(--vibeui-cursor-005-border);
background:var(--vibeui-cursor-005-bg);color:var(--vibeui-cursor-005-fg);
font-family:var(--vibeui-cursor-005-font);
cursor:crosshair;user-select:none;
/* Свой контекст наложения: z-index призраков растёт с каждым появлением и
   без isolation вылезал бы поверх соседей блока — текста над полем. */
isolation:isolate;
/* Вертикальный жест остаётся за страницей: поле в ленте каталога не должно
   ловить прокрутку; горизонтальный ведёт шлейф. */
touch-action:pan-y;
}
[data-vibeui-block="cursor-005"] *{box-sizing:border-box}
[data-vibeui-block="cursor-005"] [data-part="caption"]{
position:absolute;inset:0;display:grid;place-items:center;text-align:center;
padding:1rem;margin:0;pointer-events:none;
font-size:clamp(0.875rem,1.6cqi,1rem);font-weight:520;letter-spacing:0.01em;
color:var(--vibeui-cursor-005-caption);
transition:opacity 340ms ease;
}
[data-vibeui-block="cursor-005"][data-touched="true"] [data-part="caption"]{opacity:0}
[data-vibeui-block="cursor-005"] [data-part="ghost"]{
position:absolute;top:0;left:0;
width:var(--vibeui-cursor-005-size);height:var(--vibeui-cursor-005-size);
object-fit:cover;border-radius:var(--vibeui-cursor-005-radius);
pointer-events:none;opacity:0;will-change:transform,opacity;
/* Точка — центр картинки: translate(-50%) уводит её на половину себя. */
transform:translate(calc(var(--vibeui-cursor-005-x) - 50%),calc(var(--vibeui-cursor-005-y) - 50%)) rotate(var(--vibeui-cursor-005-r)) scale(0.6);
}
[data-vibeui-block="cursor-005"] [data-part="ghost"][data-live="true"]{
animation:vibeui-cursor-005-ghost var(--vibeui-cursor-005-life) var(--vibeui-cursor-005-out) both;
}
/* Всплывает быстро и с перелётом, потом висит и уходит вверх, растворяясь. */
@keyframes vibeui-cursor-005-ghost{
0%{opacity:0;transform:translate(calc(var(--vibeui-cursor-005-x) - 50%),calc(var(--vibeui-cursor-005-y) - 50%)) rotate(var(--vibeui-cursor-005-r)) scale(0.55)}
14%{opacity:1;transform:translate(calc(var(--vibeui-cursor-005-x) - 50%),calc(var(--vibeui-cursor-005-y) - 50%)) rotate(var(--vibeui-cursor-005-r)) scale(1.04)}
26%{transform:translate(calc(var(--vibeui-cursor-005-x) - 50%),calc(var(--vibeui-cursor-005-y) - 50%)) rotate(var(--vibeui-cursor-005-r)) scale(1)}
62%{opacity:1;transform:translate(calc(var(--vibeui-cursor-005-x) - 50%),calc(var(--vibeui-cursor-005-y) - 50%)) rotate(var(--vibeui-cursor-005-r)) scale(1)}
100%{opacity:0;transform:translate(calc(var(--vibeui-cursor-005-x) - 50%),calc(var(--vibeui-cursor-005-y) - 50% - 24px)) rotate(var(--vibeui-cursor-005-r)) scale(0.82)}
}
/* Без движения картинка просто ставится и остаётся, пока её не сменит
   следующая по кругу: шлейф превращается в раскладку. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cursor-005"] [data-part="ghost"][data-live="true"]{animation:none;opacity:1;transform:translate(calc(var(--vibeui-cursor-005-x) - 50%),calc(var(--vibeui-cursor-005-y) - 50%)) rotate(var(--vibeui-cursor-005-r))}
[data-vibeui-block="cursor-005"] [data-part="caption"]{transition:none}
}
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
 * Шлейф картинок за курсором: на каждые threshold px пути всплывает следующая
 * картинка, держится и растворяется. Один файл, ноль зависимостей.
 */
export function Cursor005({
  images = DEFAULT_IMAGES,
  caption = "Проведите курсором",
  threshold = 80,
  size = 160,
  lifetime = 1200,
  rotate = 12,
  max = 12,
  accent = "",
  background = "",
  className,
  style,
  ...props
}: Cursor005Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const settings = useRef({ threshold, rotate, images })
  const pool = Math.max(1, Math.min(max, 32))

  useEffect(() => {
    settings.current = { threshold, rotate, images }
  }, [threshold, rotate, images])

  useEffect(() => {
    const host = hostRef.current

    if (!host) {
      return
    }

    const ghosts = Array.from(
      host.querySelectorAll<HTMLImageElement>('[data-part="ghost"]'),
    )
    let lastX = Number.NaN
    let lastY = Number.NaN
    let next = 0
    let layer = 0

    const spawn = (x: number, y: number) => {
      const ghost = ghosts[next % ghosts.length]
      const { images: set, rotate: spread } = settings.current
      const angle = (Math.random() * 2 - 1) * spread
      const source = set[next % set.length]

      next += 1
      layer += 1
      // Набор идёт по кругу независимо от размера пула: картинок может быть
      // больше, чем одновременно висящих призраков.
      if (ghost.getAttribute("src") !== source) {
        ghost.src = source
      }
      ghost.style.setProperty("--vibeui-cursor-005-x", `${x}px`)
      ghost.style.setProperty("--vibeui-cursor-005-y", `${y}px`)
      ghost.style.setProperty("--vibeui-cursor-005-r", `${angle.toFixed(1)}deg`)
      ghost.style.zIndex = String(layer)
      // Снять и вернуть атрибут за один кадр — анимация не перезапустится:
      // браузер не заметит смены. Принудительный reflow между ними заставляет.
      ghost.removeAttribute("data-live")
      void ghost.offsetWidth
      ghost.setAttribute("data-live", "true")
    }

    const move = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      if (Number.isNaN(lastX)) {
        lastX = x
        lastY = y
        host.setAttribute("data-touched", "true")
        spawn(x, y)
        return
      }

      if (Math.hypot(x - lastX, y - lastY) < settings.current.threshold) {
        return
      }

      lastX = x
      lastY = y
      spawn(x, y)
    }

    const leave = () => {
      lastX = Number.NaN
      lastY = Number.NaN
    }

    host.addEventListener("pointermove", move)
    host.addEventListener("pointerdown", move)
    host.addEventListener("pointerleave", leave)

    return () => {
      host.removeEventListener("pointermove", move)
      host.removeEventListener("pointerdown", move)
      host.removeEventListener("pointerleave", leave)
    }
    // Пул перерисовывается со сменой max — слушатели переподписываются на
    // новые <img>.
  }, [pool])

  const palette = {
    "--vibeui-cursor-005-size": `${size}px`,
    "--vibeui-cursor-005-life": `${lifetime}ms`,
    ...(accent ? { "--vibeui-cursor-005-caption": accent } : null),
    ...(background
      ? {
          "--vibeui-cursor-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cursor-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={hostRef}
        data-vibeui-block="cursor-005"
        className={className}
        style={palette}
      >
        {caption ? <p data-part="caption">{caption}</p> : null}
        {Array.from({ length: pool }, (_, index) => (
          <img
            key={index}
            data-part="ghost"
            src={images[index % images.length]}
            alt=""
            draggable={false}
            aria-hidden="true"
          />
        ))}
      </div>
    </>
  )
}

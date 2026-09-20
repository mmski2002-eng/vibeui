"use client"

import { useRef, useState } from "react"
import type { CSSProperties, PointerEvent, ReactNode } from "react"

export type ButtonAnim002Item = {
  id: string
  label: string
  /** Любой узел: <img>, svg или встроенная градиентная плитка Tile. */
  icon: ReactNode
}

export type ButtonAnim002Props = {
  items?: ButtonAnim002Item[]
  /** id инструментов с точкой запущенного приложения. */
  activeIds?: string[]
  /** Подпись слота команд в конце дока. */
  commandLabel?: string
  /** Пункты меню ⌘K: подпись и горячая клавиша. */
  commands?: [string, string][]
  onSelect?: (item: ButtonAnim002Item) => void
  onCommand?: () => void
  accent?: string
  /** Цвет текста. Пусто — берётся из темы окружения, приглушённый выводится из него. */
  textColor?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: док с увеличением из macOS. Курсор ведёт лупу — каждая
// иконка растёт тем сильнее, чем ближе к ней указатель, соседи плавно входят и
// выходят из пика. Размер считается raised-cosine колоколом (не линейным
// шатром) и пишется прямо в DOM-переменную --s каждой иконки, а не через
// состояние React: pointermove идёт десятками событий в секунду, и рендер на
// каждое — кадры впустую (тот же приём, что у магнитной кнопки). CSS-переход
// сглаживает шаги в пружину. Клик подбрасывает иконку, под доком лежит её
// отражение, у запущенного приложения — точка, а слот ⌘K открывает мини-меню.
// Увеличение — украшение для мыши: на тач-вводе точка касания и есть цель.
const REST = 44
const PEAK = 56
const RADIUS = 110

const STYLES = `
:where([data-vibeui-block="button-anim-002"]){
--vibeui-button-anim-002-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-button-anim-002-muted:color-mix(in oklab,var(--vibeui-button-anim-002-fg) 60%,transparent);
--vibeui-button-anim-002-tray:light-dark(oklch(0.96 0 265 / 82%),oklch(0.24 0 265 / 76%));
--vibeui-button-anim-002-raised:light-dark(oklch(0.99 0 265 / 70%),oklch(0.32 0 265 / 60%));
--vibeui-button-anim-002-border:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 12%));
--vibeui-button-anim-002-hair:light-dark(oklch(0 0 0 / 40%),oklch(1 0 0 / 35%));
--vibeui-button-anim-002-accent:light-dark(oklch(0.55 0.2 274),oklch(0.72 0.15 274));
--vibeui-button-anim-002-shadow:light-dark(oklch(0.2 0.02 274 / 30%),oklch(0 0 0 / 50%));
--vibeui-button-anim-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-anim-002"]{color-scheme:dark}
[data-vibeui-block="button-anim-002"]{
display:flex;justify-content:center;width:100%;box-sizing:border-box;
color:var(--vibeui-button-anim-002-fg);font-family:var(--vibeui-button-anim-002-font);
}
[data-vibeui-block="button-anim-002"] *{box-sizing:border-box}
/* Поднос: полупрозрачное стекло с внутренним кантом и мягкой тенью. */
[data-vibeui-block="button-anim-002"] [data-part="dock"]{
position:relative;display:flex;align-items:flex-end;gap:0.5rem;
padding:0.75rem;border-radius:1.125rem;
background:linear-gradient(to bottom,var(--vibeui-button-anim-002-raised),var(--vibeui-button-anim-002-tray));
-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
box-shadow:
 inset 0 0 0 1px var(--vibeui-button-anim-002-border),
 inset 0 1px 0 light-dark(oklch(1 0 0 / 60%),oklch(1 0 0 / 10%)),
 0 12px 32px -8px var(--vibeui-button-anim-002-shadow);
}
/* Зеркальный блик по верхней кромке подноса. */
[data-vibeui-block="button-anim-002"] [data-part="lip"]{
position:absolute;inset-inline:1rem;top:1px;height:1px;border-radius:9999px;pointer-events:none;
background:linear-gradient(90deg,transparent,light-dark(oklch(1 0 0 / 80%),oklch(1 0 0 / 45%)),transparent);
}
[data-vibeui-block="button-anim-002"] [data-part="app"]{
position:relative;flex:none;
display:flex;flex-direction:column;align-items:center;
appearance:none;border:0;padding:0;background:none;cursor:pointer;outline:none;
--vibeui-button-anim-002-s:${REST}px;
}
/* Плитка иконки: размер --s приходит из обработчика, переход сглаживает лупу.
   Тень трассирует альфу рисунка — прозрачные поля иконки дают верный силуэт. */
[data-vibeui-block="button-anim-002"] [data-part="icon"]{
position:relative;z-index:1;display:block;
width:var(--vibeui-button-anim-002-s);height:var(--vibeui-button-anim-002-s);
filter:drop-shadow(0 5px 9px var(--vibeui-button-anim-002-shadow)) drop-shadow(0 2px 3px var(--vibeui-button-anim-002-shadow));
transition:width .18s ease,height .18s ease;
}
[data-vibeui-block="button-anim-002"] [data-part="app"]:active [data-part="icon"]{translate:0 1px}
/* Подпрыгивание по клику: иконка отрывается от подноса и садится назад. */
[data-vibeui-block="button-anim-002"] [data-part="app"][data-bounce] [data-part="icon"]{
animation:vibeui-button-anim-002-hop .42s cubic-bezier(.16,1,.3,1);
}
@keyframes vibeui-button-anim-002-hop{
0%{translate:0 0}40%{translate:0 -12px}100%{translate:0 0}
}
/* Отражение на полу: та же иконка, отражённая и погашенная под кромкой. */
[data-vibeui-block="button-anim-002"] [data-part="reflection"]{
position:absolute;top:100%;left:50%;margin-top:3px;pointer-events:none;
width:var(--vibeui-button-anim-002-s);height:var(--vibeui-button-anim-002-s);
transform:translateX(-50%) scaleY(-1);opacity:.22;
transition:width .18s ease,height .18s ease;
-webkit-mask-image:linear-gradient(to bottom,oklch(0 0 0 / 0.5),transparent 62%);
mask-image:linear-gradient(to bottom,oklch(0 0 0 / 0.5),transparent 62%);
}
/* Точка запущенного приложения под иконкой. */
[data-vibeui-block="button-anim-002"] [data-part="dot"]{
position:absolute;bottom:-3px;left:50%;z-index:2;
width:3px;height:3px;border-radius:9999px;transform:translateX(-50%);
background:var(--vibeui-button-anim-002-fg);opacity:0;
}
[data-vibeui-block="button-anim-002"] [data-part="app"][data-active] [data-part="dot"]{opacity:.8}
/* Тултип: тонкий чип над иконкой по наведению или фокусу. */
[data-vibeui-block="button-anim-002"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5rem);left:50%;z-index:20;
padding:0.25rem 0.5rem;border-radius:0.375rem;white-space:nowrap;
border:1px solid var(--vibeui-button-anim-002-border);
background:var(--vibeui-button-anim-002-raised);color:var(--vibeui-button-anim-002-muted);
-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
box-shadow:0 8px 24px -6px var(--vibeui-button-anim-002-shadow);
font-size:0.625rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
opacity:0;transform:translate(-50%,6px);transform-origin:bottom center;pointer-events:none;
transition:opacity .2s ease,transform .2s ease;
}
[data-vibeui-block="button-anim-002"] [data-part="tip"]::after{
content:"";position:absolute;top:100%;left:50%;
width:0.5rem;height:0.5rem;margin-top:-0.28rem;
transform:translateX(-50%) rotate(45deg);
border-right:1px solid var(--vibeui-button-anim-002-border);border-bottom:1px solid var(--vibeui-button-anim-002-border);
background:var(--vibeui-button-anim-002-raised);
}
[data-vibeui-block="button-anim-002"] [data-part="app"]:hover [data-part="tip"],
[data-vibeui-block="button-anim-002"] [data-part="app"]:focus-visible [data-part="tip"]{
opacity:1;transform:translate(-50%,0);
}
[data-vibeui-block="button-anim-002"] [data-part="app"]:focus-visible [data-part="icon"]{
outline:2px solid var(--vibeui-button-anim-002-accent);outline-offset:3px;border-radius:22%;
}
/* Разделитель перед слотом команд. */
[data-vibeui-block="button-anim-002"] [data-part="split"]{
align-self:center;width:1px;height:2rem;margin-inline:0.25rem;
background:var(--vibeui-button-anim-002-border);
}
/* Слот ⌘K на той же сетке, что и плитки. */
[data-vibeui-block="button-anim-002"] [data-part="slot"]{
display:flex;align-items:center;justify-content:center;width:100%;height:100%;
border-radius:22%;border:1px solid var(--vibeui-button-anim-002-border);
background:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 6%));
color:var(--vibeui-button-anim-002-muted);font-size:0.75rem;font-weight:600;
}
/* Меню команд: тихий лист над правым краем дока. */
[data-vibeui-block="button-anim-002"] [data-part="menu"]{
position:absolute;bottom:calc(100% + 0.75rem);right:0;z-index:30;
width:12rem;padding:0.25rem;border-radius:0.75rem;
border:1px solid var(--vibeui-button-anim-002-border);
background:var(--vibeui-button-anim-002-raised);
-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
box-shadow:0 16px 40px -8px var(--vibeui-button-anim-002-shadow);
transform-origin:bottom right;
animation:vibeui-button-anim-002-sheet .22s cubic-bezier(.16,1,.3,1);
}
@keyframes vibeui-button-anim-002-sheet{
from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}
}
[data-vibeui-block="button-anim-002"] [data-part="cmd"]{
appearance:none;border:0;cursor:pointer;
display:flex;width:100%;align-items:center;justify-content:space-between;
padding:0.375rem 0.625rem;border-radius:0.5rem;background:none;
color:var(--vibeui-button-anim-002-muted);font:inherit;font-size:0.6875rem;text-align:left;
transition:background-color .15s ease,color .15s ease;
}
[data-vibeui-block="button-anim-002"] [data-part="cmd"]:hover,
[data-vibeui-block="button-anim-002"] [data-part="cmd"]:focus-visible{
background:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 6%));color:var(--vibeui-button-anim-002-fg);outline:none;
}
[data-vibeui-block="button-anim-002"] [data-part="cmd"] kbd{
padding-inline:0.25rem;border-radius:0.25rem;border:1px solid var(--vibeui-button-anim-002-border);
font:inherit;font-size:0.5625rem;color:var(--vibeui-button-anim-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-anim-002"] *{animation:none!important;transition:none!important}}
`

/** Градиентная плитка: подсвечена сверху-слева, к низу уходит в цвет бренда. */
function Tile({ c, children }: { c: [number, number, number]; children: ReactNode }) {
  const up = c.map((v) => Math.min(255, v + 38)).join(",")
  const dn = c.map((v) => Math.max(0, v - 46)).join(",")

  return (
    <span
      aria-hidden
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "22%",
        background: `linear-gradient(145deg, rgb(${up}) 0%, rgb(${c.join(",")}) 55%, rgb(${dn}) 100%)`,
      }}
    >
      {children}
    </span>
  )
}

const glyph = {
  fill: "none",
  stroke: "white",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

const DEFAULT_ITEMS: ButtonAnim002Item[] = [
  {
    id: "spark",
    label: "Spark",
    icon: (
      <Tile c={[223, 119, 87]}>
        <svg width={18} height={18} viewBox="0 0 22 22" {...glyph}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4
            return (
              <line
                key={i}
                x1={11 + Math.cos(a) * 3.2}
                y1={11 + Math.sin(a) * 3.2}
                x2={11 + Math.cos(a) * 8}
                y2={11 + Math.sin(a) * 8}
              />
            )
          })}
        </svg>
      </Tile>
    ),
  },
  {
    id: "signal",
    label: "Signal",
    icon: (
      <Tile c={[99, 168, 255]}>
        <svg width={18} height={18} viewBox="0 0 22 22" {...glyph}>
          <path d="M3 17 C 8 17, 8.5 5, 11 5 S 14 17, 19 17" />
        </svg>
      </Tile>
    ),
  },
  {
    id: "frame",
    label: "Frame",
    icon: (
      <Tile c={[40, 120, 250]}>
        <svg width={18} height={18} viewBox="0 0 22 22" {...glyph}>
          <rect x={5} y={5} width={12} height={12} rx={3} />
          <circle cx={11} cy={11} r={2.4} />
        </svg>
      </Tile>
    ),
  },
  {
    id: "palette",
    label: "Palette",
    icon: (
      <Tile c={[165, 89, 255]}>
        <svg width={18} height={18} viewBox="0 0 22 22" {...glyph}>
          <circle cx={7.5} cy={7.5} r={2.6} />
          <circle cx={14.5} cy={7.5} r={2.6} />
          <circle cx={7.5} cy={14.5} r={2.6} />
          <circle cx={14.5} cy={14.5} r={2.6} />
        </svg>
      </Tile>
    ),
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: (
      <Tile c={[112, 110, 244]}>
        <svg width={18} height={18} viewBox="0 0 22 22" {...glyph}>
          <path d="M6 7 L 10.5 11 L 6 15" />
          <line x1={12.5} y1={15.5} x2={16.5} y2={15.5} />
        </svg>
      </Tile>
    ),
  },
]

const DEFAULT_COMMANDS: [string, string][] = [
  ["Search tools", "/"],
  ["New canvas", "N"],
  ["Toggle theme", "T"],
  ["Copy share link", "C"],
]

/**
 * Док с увеличением в стиле macOS: пружины иконок за курсором, подпрыгивание по
 * клику, отражение на полу, точки запущенных приложений и меню ⌘K. Один файл,
 * ноль зависимостей, собственная палитра.
 */
export function ButtonAnim002({
  items = DEFAULT_ITEMS,
  activeIds = ["signal"],
  commandLabel = "⌘K",
  commands = DEFAULT_COMMANDS,
  onSelect,
  onCommand,
  accent,
  textColor,
  className,
  style,
}: ButtonAnim002Props) {
  const dockRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const magnify = (event: PointerEvent<HTMLDivElement>) => {
    const dock = dockRef.current

    // Лупа — для мыши: на тач-вводе точка касания и есть цель, а при
    // отключённой анимации иконки обязаны стоять на месте.
    if (
      !dock ||
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion:reduce)").matches
    ) {
      return
    }

    for (const app of dock.querySelectorAll<HTMLElement>('[data-part="app"]')) {
      const box = app.getBoundingClientRect()
      const distance = Math.abs(event.clientX - (box.left + box.width / 2))
      const t = Math.min(1, distance / RADIUS)
      // raised-cosine колокол: соседи входят и выходят из пика мягко, не шатром.
      const size = REST + (PEAK - REST) * ((1 + Math.cos(Math.PI * t)) / 2)
      app.style.setProperty("--vibeui-button-anim-002-s", `${size.toFixed(2)}px`)
    }
  }

  const rest = () => {
    const dock = dockRef.current

    if (!dock) {
      return
    }

    for (const app of dock.querySelectorAll<HTMLElement>('[data-part="app"]')) {
      app.style.setProperty("--vibeui-button-anim-002-s", `${REST}px`)
    }
  }

  const hop = (event: PointerEvent<HTMLButtonElement>) => {
    const app = event.currentTarget

    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
      return
    }

    // Снимаем метку по концу анимации, иначе следующий клик её не перезапустит.
    app.dataset.bounce = ""
  }

  const palette = {
    ...(accent ? { "--vibeui-button-anim-002-accent": accent } : null),
    ...(textColor ? { "--vibeui-button-anim-002-fg": textColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-anim-002" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="button"
        data-vibeui-block="button-anim-002"
        className={className}
        style={palette}
      >
        <div
          ref={dockRef}
          data-part="dock"
          onPointerMove={magnify}
          onPointerLeave={rest}
        >
          <span data-part="lip" aria-hidden="true" />

          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              data-part="app"
              data-active={activeIds.includes(item.id) ? "" : undefined}
              aria-label={item.label}
              onPointerDown={hop}
              onAnimationEnd={(event) => {
                delete event.currentTarget.dataset.bounce
              }}
              onClick={() => onSelect?.(item)}
            >
              <span data-part="icon">{item.icon}</span>
              <span data-part="reflection" aria-hidden="true">
                {item.icon}
              </span>
              <span data-part="dot" aria-hidden="true" />
              <span data-part="tip">{item.label}</span>
            </button>
          ))}

          <span data-part="split" aria-hidden="true" />

          <button
            type="button"
            data-part="app"
            aria-label="Command menu"
            aria-expanded={menuOpen}
            onPointerDown={hop}
            onAnimationEnd={(event) => {
              delete event.currentTarget.dataset.bounce
            }}
            onClick={() => {
              setMenuOpen((open) => !open)
              onCommand?.()
            }}
          >
            <span data-part="icon">
              <span data-part="slot">{commandLabel}</span>
            </span>
            <span data-part="reflection" aria-hidden="true">
              <span data-part="slot">{commandLabel}</span>
            </span>
            <span data-part="tip">Command menu</span>
          </button>

          {menuOpen ? (
            <div data-part="menu" role="menu" aria-label="Commands">
              {commands.map(([label, key]) => (
                <button
                  key={label}
                  type="button"
                  data-part="cmd"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                  <kbd>⌘{key}</kbd>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

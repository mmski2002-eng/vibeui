"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type ButtonAnim001Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Что переключает шнур. `document` — класс `dark` на `<html>` и запись в
   * localStorage, как у выключателя света на сайте. `self` — только сам
   * блок: так его показывают на витрине, где тема принадлежит странице.
   */
  target?: "document" | "self"
  /** Щелчок выключателя. Витрина его выключает: карточек в сетке десятки. */
  sound?: boolean
  darkLabel?: string
  lightLabel?: string
  /**
   * Цвет ручки при включённом свете. Пустая строка — заводской оранжевый:
   * ручка светится брендовым цветом, как лампа, которую она включает.
   */
  gripColor?: string
}

// Шнур-выключатель: тянешь ручку вниз, отпускаешь — свет переключается, а
// шнур отпружинивает и качается затухающим маятником.
//
// Физика перенесена один в один: пороги срабатывания (52px по вертикали,
// 50px по диагонали или скорость 180px/с), пружины возврата
// (жёсткость 440, затухание 11, масса 0.75 по вертикали и 280/8/0.85 по
// горизонтали), наклон как arctg смещения к длине шнура, лёгкое растяжение
// ручки на 12% в нижней точке. Считает всё requestAnimationFrame: блок
// обязан оставаться одним файлом без библиотек анимации.
const STYLES = `
:where([data-vibeui-block="button-anim-001"]){
--vibeui-button-anim-001-mount:light-dark(oklch(0.71 0 0),oklch(0.44 0 0));
--vibeui-button-anim-001-mount-tip:light-dark(oklch(0.64 0 0),oklch(0.55 0 0));
--vibeui-button-anim-001-cord:light-dark(oklch(0.37 0 0),oklch(0.87 0 0));
--vibeui-button-anim-001-grip:light-dark(oklch(0.16 0 0),oklch(0.16 0 0));
--vibeui-button-anim-001-grip-edge:light-dark(oklch(0.24 0 0),oklch(0.24 0 0));
--vibeui-button-anim-001-grip-line:light-dark(oklch(0.32 0 0),oklch(0.32 0 0));
--vibeui-button-anim-001-hint:light-dark(oklch(0.19 0 0),oklch(1 0 0));
--vibeui-button-anim-001-hint-fg:light-dark(oklch(1 0 0),oklch(0.15 0 0));
--vibeui-button-anim-001-hint-edge:light-dark(oklch(0.38 0 0),oklch(0.87 0 0));
--vibeui-button-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-anim-001"]{color-scheme:dark}
/* Блок сам умеет быть тёмным: этим он и переключается, когда target="self". */
[data-vibeui-block="button-anim-001"][data-dark="true"]{color-scheme:dark}
[data-vibeui-block="button-anim-001"]{
position:relative;box-sizing:border-box;
width:100%;min-width:12rem;min-height:15rem;height:100%;perspective:1000px;
user-select:none;font-family:var(--vibeui-button-anim-001-font);
}
/* Сцена прозрачная намеренно: свет включает окружение — тема документа
   или подложка, на которой шнур висит. Если красить фон самой сцены, в
   чужой вёрстке она читается как чужеродный прямоугольник. */
[data-vibeui-block="button-anim-001"] *{box-sizing:border-box}
/* Крепление: планка и юбка под ней. */
[data-vibeui-block="button-anim-001"] [data-part="mount"]{
position:absolute;top:0;left:50%;z-index:1;
display:flex;flex-direction:column;align-items:center;translate:-50% 0;
}
[data-vibeui-block="button-anim-001"] [data-part="plate"]{
width:1.25rem;height:0.375rem;border-radius:0 0 2px 2px;
background:var(--vibeui-button-anim-001-mount);
}
[data-vibeui-block="button-anim-001"] [data-part="tip"]{
width:0.5rem;height:0.25rem;margin-top:-0.03125rem;
border-radius:0 0 999px 999px;background:var(--vibeui-button-anim-001-mount-tip);
}
/* Шнур обрезается границами сцены. В исходнике холст висел в углу экрана
   и мог рисовать за краем, здесь же блок живёт в кадре каталога: при
   качании линия выходила за него и мелькала полосой поверх соседей. */
[data-vibeui-block="button-anim-001"] [data-part="cord"]{
position:absolute;inset:0;z-index:0;width:100%;height:100%;overflow:hidden;
color:var(--vibeui-button-anim-001-cord);pointer-events:none;
}
[data-vibeui-block="button-anim-001"]{overflow:hidden}
[data-vibeui-block="button-anim-001"] [data-part="grip"]{
position:absolute;top:5.5rem;left:50%;z-index:1;margin-left:-0.5rem;
display:flex;flex-direction:column;align-items:center;
transform-origin:top center;cursor:grab;touch-action:none;
}
[data-vibeui-block="button-anim-001"] [data-part="grip"]:active{cursor:grabbing}
[data-vibeui-block="button-anim-001"] [data-part="grip"]:focus-visible{outline:none}
[data-vibeui-block="button-anim-001"] [data-part="grip"]:focus-visible [data-part="body"]{
outline:2px solid var(--vibeui-button-anim-001-cord);outline-offset:3px;
}
[data-vibeui-block="button-anim-001"] [data-part="body"]{
position:relative;width:1rem;height:2.75rem;border-radius:999px;
background:var(--vibeui-button-anim-001-grip);
border:1px solid var(--vibeui-button-anim-001-grip-edge);
transition:background-color .3s cubic-bezier(.4,0,.2,1),border-color .3s cubic-bezier(.4,0,.2,1);
}
/* Свет выключен — ручка гаснет, но оттенок выбранного цвета в ней остаётся:
   так видно, что настройка применилась, даже когда лампа не горит. */
[data-vibeui-block="button-anim-001"][data-dark="true"] [data-part="body"]{
--vibeui-button-anim-001-grip:color-mix(in oklab,var(--vibeui-button-anim-001-grip-lit,oklch(0.6803 0.2144 39.8)) 80%,oklch(0.32 0 0));
--vibeui-button-anim-001-grip-edge:color-mix(in oklab,var(--vibeui-button-anim-001-grip) 55%,oklch(0.34 0 0));
--vibeui-button-anim-001-grip-line:color-mix(in oklab,var(--vibeui-button-anim-001-grip) 60%,oklch(0.4 0 0));
}
/* Свет включён — ручка горит. Оттенки кромки и насечек считаются от неё,
   поэтому свой цвет достаточно задать один раз, в --grip-lit. */
[data-vibeui-block="button-anim-001"][data-dark="false"] [data-part="body"]{
--vibeui-button-anim-001-grip:var(--vibeui-button-anim-001-grip-lit,oklch(0.6803 0.2144 39.8));
--vibeui-button-anim-001-grip-edge:color-mix(in oklab,var(--vibeui-button-anim-001-grip) 78%,oklch(0.3 0 0));
--vibeui-button-anim-001-grip-line:color-mix(in oklab,var(--vibeui-button-anim-001-grip) 55%,oklch(0.25 0 0));
}
[data-vibeui-block="button-anim-001"] [data-part="grooves"]{
position:absolute;left:0.25rem;right:0.25rem;top:0.75rem;bottom:0.75rem;
display:flex;flex-direction:column;justify-content:center;align-items:center;gap:3px;
}
[data-vibeui-block="button-anim-001"] [data-part="groove"]{
width:0.5rem;height:1px;border-radius:999px;
background:var(--vibeui-button-anim-001-grip-line);
}
[data-vibeui-block="button-anim-001"] [data-part="gloss"]{
position:absolute;top:0.25rem;left:0.125rem;bottom:0.25rem;width:1px;border-radius:999px;
background:oklch(1 0 0 / 15%);
}
[data-vibeui-block="button-anim-001"][data-dark="false"] [data-part="gloss"]{
background:oklch(1 0 0 / 80%);
}
[data-vibeui-block="button-anim-001"] [data-part="hint"]{
position:absolute;left:calc(100% + 0.75rem);top:0.5rem;
display:flex;align-items:center;gap:0.375rem;white-space:nowrap;pointer-events:none;
padding:0.125rem 0.5rem;border-radius:999px;
background:var(--vibeui-button-anim-001-hint);color:var(--vibeui-button-anim-001-hint-fg);
border:1px solid var(--vibeui-button-anim-001-hint-edge);
font-size:10px;font-weight:500;letter-spacing:0.02em;
opacity:0;translate:10px 0;scale:0.9;
transition:opacity .18s cubic-bezier(.25,1,.5,1),translate .18s cubic-bezier(.25,1,.5,1),scale .18s cubic-bezier(.25,1,.5,1);
}
[data-vibeui-block="button-anim-001"] [data-part="hint"][data-show="true"]{
opacity:1;translate:0 0;scale:1;
}
[data-vibeui-block="button-anim-001"] [data-part="arrow"]{opacity:.6;font-size:9px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-anim-001"] [data-part="body"],
[data-vibeui-block="button-anim-001"] [data-part="hint"]{transition:none}
}
`

/**
 * Геометрия шнура. В оригинале крепление стояло в углу экрана жёсткими
 * координатами (200, 6) при длине покоя 88. Здесь блок живёт в кадре
 * каталога, поэтому якорь считается от ширины сцены — шнур висит по
 * центру, а не у правого края, — а длина покоя берётся долей высоты,
 * той же, что и в оригинале: 88 из 280.
 */
const ANCHOR_Y = 6
const REST_RATIO = 88 / 280
const REST_MIN = 72

/** Пределы вытягивания. */
const LIMIT = { top: 0, bottom: 110, left: -140, right: 32 }

/** За пределами упора шнур ещё тянется, но вчетверо неохотнее. */
const ELASTIC = 0.35

/** Ниже этого — свет переключается. Либо по диагонали, либо по рывку. */
const PULL_Y = 40
const PULL_DISTANCE = 50
const PULL_VELOCITY = 180

/** Возврат после протяжки и после щелчка: жёсткость, затухание, масса. */
const SPRING_Y = { stiffness: 440, damping: 11, mass: 0.75 }
const SPRING_X = { stiffness: 280, damping: 8, mass: 0.85 }
const SPRING_CLICK = { stiffness: 420, damping: 10, mass: 0.7 }

function clampWithElastic(value: number, min: number, max: number): number {
  if (value < min) {
    return min + (value - min) * ELASTIC
  }

  if (value > max) {
    return max + (value - max) * ELASTIC
  }

  return value
}

/** Щелчок выключателя: два коротких тона, как у оригинала. */
function playClick(dark: boolean) {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext

    if (!Ctor) {
      return
    }

    const context = new Ctor()

    if (context.state === "suspended") {
      void context.resume()
    }

    const now = context.currentTime
    const snap = context.createOscillator()
    const snapGain = context.createGain()

    snap.type = "triangle"
    snap.frequency.setValueAtTime(dark ? 1600 : 1950, now)
    snap.frequency.exponentialRampToValueAtTime(140, now + 0.032)
    snapGain.gain.setValueAtTime(0.3, now)
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.032)
    snap.connect(snapGain)
    snapGain.connect(context.destination)
    snap.start(now)
    snap.stop(now + 0.035)

    const thud = context.createOscillator()
    const thudGain = context.createGain()

    thud.type = "sine"
    thud.frequency.setValueAtTime(dark ? 420 : 540, now + 0.008)
    thud.frequency.exponentialRampToValueAtTime(60, now + 0.065)
    thudGain.gain.setValueAtTime(0.2, now + 0.008)
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065)
    thud.connect(thudGain)
    thudGain.connect(context.destination)
    thud.start(now + 0.008)
    thud.stop(now + 0.07)
  } catch {
    // Звук — украшение: браузер вправе не дать его до первого жеста.
  }
}

/**
 * Шнур-выключатель света: тянешь ручку вниз и отпускаешь — тема
 * переключается, шнур отпружинивает и качается.
 */
export function ButtonAnim001({
  target = "document",
  sound = true,
  darkLabel = "Тёмная",
  lightLabel = "Светлая",
  gripColor = "",
  className,
  style,
  ...props
}: ButtonAnim001Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const gripRef = useRef<HTMLDivElement>(null)
  const cordRef = useRef<SVGLineElement>(null)
  const [dark, setDark] = useState(false)
  const [hover, setHover] = useState(false)
  const settings = useRef({ target, sound })

  useEffect(() => {
    settings.current = { target, sound }
  })

  // Начальное положение шнура — не догадка, а замер окружения. Иначе в
  // тёмной теме выключатель считает, что свет включён, и первый рывок
  // уходит впустую: человеку приходится дёргать дважды.
  useEffect(() => {
    const host = hostRef.current

    if (target !== "document") {
      if (host) {
        // Что вокруг: подложка кадра или страница объявляют color-scheme,
        // и по нему видно, темно сейчас или светло.
        setDark(getComputedStyle(host).colorScheme.includes("dark"))
      }

      return
    }

    const read = () =>
      setDark(document.documentElement.classList.contains("dark"))

    read()

    const observer = new MutationObserver(read)

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [target])

  useEffect(() => {
    const host = hostRef.current
    const grip = gripRef.current
    const cord = cordRef.current

    if (!host || !grip || !cord) {
      return
    }

    // Положение ручки и скорость пружины. Состояние держится здесь, а не в
    // React: кадр анимации не должен перерисовывать дерево.
    let x = 0
    let y = 0
    let velocityX = 0
    let velocityY = 0
    let spring = SPRING_Y
    let springX = SPRING_X
    let dragging = false
    let busy = false
    let frame = 0
    let pointerId: number | null = null
    let startX = 0
    let startY = 0
    let lastX = 0
    let lastY = 0
    let lastTime = 0
    let swing: { values: number[]; started: number; duration: number } | null =
      null

    const still = window.matchMedia("(prefers-reduced-motion: reduce)")

    function paint() {
      // Страховка от нечисловых значений: пружина, качание и жест считают
      // положение независимо друг от друга, и одно испорченное число
      // уводило бы шнур в NaN, а SVG — в ошибку разметки на каждом кадре.
      if (!Number.isFinite(x)) {
        x = 0
        velocityX = 0
      }

      if (!Number.isFinite(y)) {
        y = 0
        velocityY = 0
      }

      // Якорь считается от текущей ширины сцены: блок живёт и в узкой
      // карточке каталога, и на всю ширину страницы item'а.
      const half = host!.clientWidth / 2
      const rest = Math.max(REST_MIN, host!.clientHeight * REST_RATIO)

      grip!.style.top = `${rest}px`

      // Наклон — угол между шнуром и вертикалью, как arctg смещения к длине.
      const angle = (180 * Math.atan2(x, Math.max(rest + y, 10))) / Math.PI
      // Ручка тянется вслед за шнуром: внизу вытягивается, вверху сжимается.
      const stretch =
        1 + Math.max(-20, Math.min(110, y)) * (y > 0 ? 0.0011 : 0.004)
      const squeeze =
        1 - Math.max(-20, Math.min(110, y)) * (y > 0 ? 0.00055 : 0.003)

      grip!.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${squeeze}, ${stretch})`
      cord!.setAttribute("x1", String(half))
      cord!.setAttribute("x2", String(half + x))
      cord!.setAttribute("y2", String(rest + y + 2))
    }

    function step(now: number) {
      const dt = 1 / 60

      if (swing) {
        // Затухающее качание после щелчка: ключевые кадры оригинала.
        const progress = Math.min(1, (now - swing.started) / swing.duration)
        const scaled = progress * (swing.values.length - 1)
        const index = Math.min(swing.values.length - 2, Math.floor(scaled))
        const local = scaled - index

        x =
          swing.values[index] +
          (swing.values[index + 1] - swing.values[index]) * local

        if (progress >= 1) {
          swing = null
          x = 0
        }
      } else if (!dragging) {
        velocityX +=
          ((-springX.stiffness * x - springX.damping * velocityX) /
            springX.mass) *
          dt
        x += velocityX * dt
      }

      if (!dragging) {
        velocityY +=
          ((-spring.stiffness * y - spring.damping * velocityY) / spring.mass) *
          dt
        y += velocityY * dt

        if (
          Math.abs(y) < 0.05 &&
          Math.abs(velocityY) < 0.5 &&
          Math.abs(x) < 0.05 &&
          !swing
        ) {
          y = 0
          x = 0
          velocityY = 0
          velocityX = 0
          busy = false
          paint()
          frame = 0

          return
        }
      }

      paint()
      frame = requestAnimationFrame(step)
    }

    function run() {
      if (!frame) {
        frame = requestAnimationFrame(step)
      }
    }

    function toggle() {
      const next =
        settings.current.target === "document"
          ? !document.documentElement.classList.contains("dark")
          : !host!.dataset.dark || host!.dataset.dark === "false"

      if (settings.current.target === "document") {
        document.documentElement.classList.toggle("dark", next)

        try {
          window.localStorage.setItem("theme", next ? "dark" : "light")
        } catch {
          // Приватный режим — тема просто не переживёт перезагрузку.
        }
      }

      setDark(next)

      if (settings.current.sound) {
        playClick(next)
      }

      // Событие уходит дважды: на window — как в исходном выключателе, и
      // всплывающим от самого блока. Второе нужно окружению, которое хочет
      // переключить свет только вокруг шнура, не трогая весь документ.
      const payload = { detail: { isDark: next }, bubbles: true }

      host!.dispatchEvent(new CustomEvent("theme-change", payload))
      window.dispatchEvent(
        new CustomEvent("theme-change", { detail: { isDark: next } }),
      )
    }

    function pull() {
      if (busy || still.matches) {
        if (still.matches) {
          toggle()
        }

        return
      }

      busy = true
      // Щелчок мышью: шнур сам уходит вниз, переключает свет и качается.
      velocityY = 620
      spring = SPRING_CLICK
      swing = {
        values: [0, -12, 10, -7, 4, -2, 0],
        started: performance.now(),
        duration: 1200,
      }
      toggle()
      run()
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0 && event.pointerType === "mouse") {
        return
      }

      dragging = true
      pointerId = event.pointerId
      startX = event.clientX - x
      startY = event.clientY - y
      lastX = event.clientX
      lastY = event.clientY
      lastTime = performance.now()
      swing = null
      grip!.setPointerCapture(event.pointerId)
      run()
    }

    function onPointerMove(event: PointerEvent) {
      if (!dragging || event.pointerId !== pointerId) {
        return
      }

      x = clampWithElastic(event.clientX - startX, LIMIT.left, LIMIT.right)
      y = clampWithElastic(event.clientY - startY, LIMIT.top, LIMIT.bottom)

      const now = performance.now()
      const elapsed = Math.max(1, now - lastTime)

      velocityX = ((event.clientX - lastX) / elapsed) * 1000
      velocityY = ((event.clientY - lastY) / elapsed) * 1000
      lastX = event.clientX
      lastY = event.clientY
      lastTime = now
      paint()
    }

    function onPointerUp(event: PointerEvent) {
      if (!dragging || event.pointerId !== pointerId) {
        return
      }

      dragging = false
      pointerId = null

      const distance = Math.hypot(x, y)

      if (
        y >= PULL_Y ||
        distance >= PULL_DISTANCE ||
        velocityY > PULL_VELOCITY
      ) {
        toggle()
      }

      spring = SPRING_Y
      springX = SPRING_X
      busy = true
      run()
    }

    function onEnter() {
      setHover(true)

      if (busy || dragging || swing || still.matches) {
        return
      }

      // Лёгкое качание на подлёте: шнур замечает курсор.
      swing = {
        values: [0, 5, -4, 2.5, -1, 0],
        started: performance.now(),
        duration: 700,
      }
      run()
    }

    function onLeave() {
      setHover(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        pull()
      }
    }

    const observer = new ResizeObserver(() => paint())
    observer.observe(host)

    grip.addEventListener("pointerdown", onPointerDown)
    grip.addEventListener("pointermove", onPointerMove)
    grip.addEventListener("pointerup", onPointerUp)
    grip.addEventListener("pointercancel", onPointerUp)
    grip.addEventListener("click", pull)
    grip.addEventListener("mouseenter", onEnter)
    grip.addEventListener("mouseleave", onLeave)
    grip.addEventListener("keydown", onKeyDown)
    paint()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      grip.removeEventListener("pointerdown", onPointerDown)
      grip.removeEventListener("pointermove", onPointerMove)
      grip.removeEventListener("pointerup", onPointerUp)
      grip.removeEventListener("pointercancel", onPointerUp)
      grip.removeEventListener("click", pull)
      grip.removeEventListener("mouseenter", onEnter)
      grip.removeEventListener("mouseleave", onLeave)
      grip.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return (
    <>
      <style href="vibeui-button-anim-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={hostRef}
        data-vibeui-block="button-anim-001"
        data-slot="pull-cord-switch"
        data-dark={dark ? "true" : "false"}
        className={className}
        style={
          {
            ...(style as CSSProperties),
            ...(gripColor
              ? { "--vibeui-button-anim-001-grip-lit": gripColor }
              : null),
          } as CSSProperties
        }
      >
        <div data-part="mount" aria-hidden="true">
          <span data-part="plate" />
          <span data-part="tip" />
        </div>

        <svg data-part="cord" aria-hidden="true">
          <line
            ref={cordRef}
            x1="50%"
            y1={ANCHOR_Y}
            x2="50%"
            y2={REST_MIN + 2}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="1 3.4"
          />
        </svg>

        <div
          ref={gripRef}
          data-part="grip"
          role="button"
          tabIndex={0}
          aria-label={dark ? lightLabel : darkLabel}
          draggable={false}
        >
          <div data-part="body">
            <div data-part="grooves" aria-hidden="true">
              <span data-part="groove" />
              <span data-part="groove" />
              <span data-part="groove" />
            </div>
            <span data-part="gloss" aria-hidden="true" />
          </div>

          <span data-part="hint" data-show={hover ? "true" : undefined}>
            {dark ? lightLabel : darkLabel}
            <span data-part="arrow" aria-hidden="true">
              ↓
            </span>
          </span>
        </div>
      </div>
    </>
  )
}

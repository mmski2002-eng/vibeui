"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Background005Photo = {
  src?: string
  alt?: string
}

export type Background005Props = Omit<ComponentProps<"div">, "children"> & {
  /** Надпись над фразой. */
  eyebrow?: string
  /** Сама фраза: переносы строк задаются массивом. */
  title?: string[]
  /** Строка под фразой. */
  note?: string
  /** Кадры на орбите. Пусто — на их месте бумажные заготовки. */
  photos?: Background005Photo[]
  /** Сколько кадров держать на орбите. Кадры повторяются по кругу. */
  count?: number
  /** Ширина орбиты в долях кадра. */
  spread?: number
  /** Скорость оборота. Ноль останавливает хоровод. */
  speed?: number
  /** Цвет холста. Пусто — холст следует теме страницы. */
  background?: string
  /** Цвет текста и рамок. Пусто — цвет следует теме страницы. */
  ink?: string
  /** Содержимое центра целиком. Задано — вытесняет фразу. */
  children?: ReactNode
}

const DEFAULT_TITLE = ["Твоё место", "для вдохновения"]

// Тема берётся из color-scheme окружения через light-dark(): днём холст
// светлый, ночью — тёмный, а кадры и фраза меняются вместе с ним. Своей
// тёмной темы компонент не носит.
//
// Идея компонента: фраза стоит на месте, а вокруг неё идёт хоровод кадров.
// Орбита эллиптическая и наклонная, поэтому кадры то приближаются к зрителю,
// то уходят вглубь: ближние крупнее, резче и темнее тенью, дальние — мельче,
// бледнее и размыты. Глубина и есть вся анимация: без неё это карусель, а
// не пространство.
//
// Позиции считает rAF, а не CSS-анимация: одному кадру нужны сразу масштаб,
// прозрачность, размытие и порядок перекрытия, и держать их в keyframes
// пришлось бы четырьмя параллельными анимациями.
const STYLES = `
:where([data-vibeui-block="background-005"]){
--vibeui-background-005-bg:light-dark(#f4f3f1,#0e0e11);
--vibeui-background-005-ink:light-dark(#16151a,#f1efec);
--vibeui-background-005-paper:color-mix(in oklab,var(--vibeui-background-005-ink) 8%,transparent);
/* Свет в подложке холста: днём кадры лежат на белёсом листе, ночью — в
   тёмной комнате, поэтому подмешивается разный цвет. */
--vibeui-background-005-lift:light-dark(#ffffff,#26262c);
/* Тень кадра: на светлом холсте она чёрная, на тёмном — почти невидимая,
   и её место занимает светлая кромка. */
--vibeui-background-005-shadow:light-dark(rgb(0 0 0 / 28%),rgb(0 0 0 / 55%));
--vibeui-background-005-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="background-005"]{color-scheme:dark}
[data-vibeui-block="background-005"]{
position:relative;box-sizing:border-box;overflow:hidden;isolation:isolate;
width:100%;min-width:min(100%,16rem);min-height:28rem;height:100%;
background:
radial-gradient(80% 60% at 50% 45%,color-mix(in oklab,var(--vibeui-background-005-bg) 88%,var(--vibeui-background-005-lift)) 0,transparent 70%),
var(--vibeui-background-005-bg);
color:var(--vibeui-background-005-ink);
font-family:var(--vibeui-background-005-sans);
}
[data-vibeui-block="background-005"] *{box-sizing:border-box}
/* Точки и виньетка: чистый холст выглядит незаполненным слоем, а не
   пространством, в котором что-то происходит. */
[data-vibeui-block="background-005"] [data-part="grain"]{
position:absolute;inset:0;z-index:0;pointer-events:none;
background-image:radial-gradient(circle,color-mix(in oklab,var(--vibeui-background-005-ink) 16%,transparent) 0.0313rem,transparent 0.0313rem);
background-size:1.25rem 1.25rem;
mask-image:radial-gradient(70% 60% at 50% 50%,transparent 0,#000 85%);
opacity:0.5;
}
[data-vibeui-block="background-005"] [data-part="vignette"]{
position:absolute;inset:0;z-index:300;pointer-events:none;
background:radial-gradient(72% 62% at 50% 50%,transparent 40%,color-mix(in oklab,var(--vibeui-background-005-bg) 82%,#000000) 100%);
opacity:0.5;
}
/* Орбита: кадры лежат в одном слое, глубину им задаёт скрипт. */
[data-vibeui-block="background-005"] [data-part="orbit"]{
position:absolute;inset:0;z-index:1;pointer-events:none;
}
[data-vibeui-block="background-005"] [data-part="frame"]{
position:absolute;left:50%;top:50%;
width:var(--vibeui-background-005-frame,9rem);
aspect-ratio:var(--vibeui-background-005-ratio,3 / 4);
margin:calc(var(--vibeui-background-005-frame,9rem) * -0.5 * 1.333) 0 0 calc(var(--vibeui-background-005-frame,9rem) * -0.5);
border-radius:0.75rem;overflow:hidden;
background:var(--vibeui-background-005-paper);
box-shadow:0 1.5rem 2.5rem -1.25rem var(--vibeui-background-005-shadow),0 0 0 1px color-mix(in oklab,var(--vibeui-background-005-ink) 10%,transparent);
will-change:transform,opacity,filter;
}
[data-vibeui-block="background-005"] [data-part="frame"] img{
width:100%;height:100%;object-fit:cover;display:block;
}
/* Заготовка без фотографии: лист бумаги со сгибом света, чтобы пустой
   компонент не выглядел сломанным. */
[data-vibeui-block="background-005"] [data-part="frame"][data-empty="true"]{
background:
linear-gradient(160deg,color-mix(in oklab,var(--vibeui-background-005-ink) 5%,var(--vibeui-background-005-lift)) 0,color-mix(in oklab,var(--vibeui-background-005-ink) 14%,var(--vibeui-background-005-lift)) 100%);
}
/* Подложка под фразой: кадры проходят близко, и без мягкого ореола текст
   ложится прямо на фотографию. Ореол цвета холста, поэтому его не видно. */
[data-vibeui-block="background-005"] [data-part="halo"]{
position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
width:min(80%,44rem);height:min(70%,22rem);z-index:150;pointer-events:none;
background:radial-gradient(60% 55% at 50% 50%,var(--vibeui-background-005-bg) 0,color-mix(in oklab,var(--vibeui-background-005-bg) 70%,transparent) 55%,transparent 78%);
}
/* Фраза: она центр сцены, поэтому лежит выше кадров и не уезжает с ними. */
[data-vibeui-block="background-005"] [data-part="center"]{
position:absolute;inset:0;z-index:200;
display:flex;flex-direction:column;align-items:center;justify-content:center;
gap:0.75rem;padding:1.5rem;text-align:center;pointer-events:none;
}
[data-vibeui-block="background-005"] [data-part="eyebrow"]{
font-size:0.6875rem;font-weight:650;letter-spacing:0.22em;text-transform:uppercase;
color:color-mix(in oklab,var(--vibeui-background-005-ink) 60%,transparent);
}
[data-vibeui-block="background-005"] h2{
margin:0;font-size:clamp(1.75rem,6.4cqi,4.5rem);font-weight:600;
line-height:1.02;letter-spacing:-0.035em;
}
[data-vibeui-block="background-005"] h2 span{display:block}
[data-vibeui-block="background-005"] [data-part="note"]{
margin:0.25rem 0 0;font-size:0.875rem;line-height:1.5;
color:color-mix(in oklab,var(--vibeui-background-005-ink) 55%,transparent);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="background-005"] *{animation:none!important;transition:none!important}
}
`

/** Пропорции кадров: орбита живее, когда среди них есть и портрет, и пейзаж. */
const RATIOS = ["3 / 4", "4 / 5", "1 / 1", "4 / 3", "3 / 4", "5 / 4"]

/**
 * Хоровод кадров вокруг фразы: эллиптическая орбита, ближние кадры крупнее
 * и резче, дальние мельче и размыты. Один файл, ноль зависимостей.
 */
export function Background005({
  eyebrow = "Коллекция",
  title = DEFAULT_TITLE,
  note = "Соберите референсы в одном месте — остальное сделает подборка",
  photos = [],
  count = 12,
  spread = 1,
  speed = 1,
  background = "",
  ink = "",
  children,
  className,
  style,
  ...props
}: Background005Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLDivElement>(null)
  const settings = useRef({ spread, speed })

  useEffect(() => {
    settings.current = { spread, speed }
  })

  useEffect(() => {
    const host = hostRef.current
    const orbit = orbitRef.current

    if (!host || !orbit) return

    const frames = [...orbit.children] as HTMLElement[]

    if (frames.length === 0) return

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)")

    let raf = 0
    let visible = true
    let previous = 0
    let angle = 0

    const draw = (now: number) => {
      raf = 0

      if (document.hidden || !visible) return

      const current = settings.current

      if (previous && !calm.matches) {
        // Полный оборот за минуту при speed = 1: хоровод должен читаться
        // как движение, а не как вращение колеса.
        angle += ((now - previous) / 60000) * Math.PI * 2 * current.speed
      }

      previous = now

      const width = host.clientWidth
      const height = host.clientHeight
      const radiusX = width * 0.44 * current.spread
      // Орбита выше кадра: снизу и сверху карточки должны уходить за край,
      // а не проезжать сквозь фразу.
      const radiusY = height * 0.54 * current.spread

      for (let index = 0; index < frames.length; index += 1) {
        const frame = frames[index]
        const own = angle + (index / frames.length) * Math.PI * 2
        // Глубина: единица внизу орбиты, у самого зрителя, ноль наверху.
        const depth = (Math.sin(own) + 1) / 2
        const scale = 0.58 + depth * 0.62
        const drift = Math.sin(own * 2 + index) * 0.04

        frame.style.transform = `translate3d(${(Math.cos(own) * radiusX).toFixed(1)}px, ${(Math.sin(own) * radiusY + drift * radiusY).toFixed(1)}px, 0) scale(${scale.toFixed(3)}) rotate(${(Math.cos(own + index) * 7).toFixed(2)}deg)`
        frame.style.opacity = (0.3 + depth * 0.7).toFixed(3)
        // Дальние кадры теряют резкость: без этого орбита читается плоской.
        frame.style.filter = `blur(${((1 - depth) * 2.6).toFixed(2)}px)`
        frame.style.zIndex = String(Math.round(depth * 100))
      }

      if (calm.matches) return

      raf = requestAnimationFrame(draw)
    }

    const run = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    const stop = () => {
      previous = 0
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    // Хоровод за пределами экрана и во вкладке в фоне не считается: он там
    // никому не виден, а батарею тратит.
    const watcher = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting)

      if (visible) run()
      else stop()
    })

    watcher.observe(host)

    const onVisibility = () => {
      if (document.hidden) stop()
      else if (visible) run()
    }

    const sizes = new ResizeObserver(() => {
      if (!raf) run()
    })

    sizes.observe(host)
    document.addEventListener("visibilitychange", onVisibility)
    calm.addEventListener("change", run)
    run()

    return () => {
      stop()
      watcher.disconnect()
      sizes.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      calm.removeEventListener("change", run)
    }
  }, [count, photos.length])

  // Заданные цвета перебивают обе ветки темы: если проект просит свой холст,
  // он получает его и днём, и ночью.
  const palette = {
    ...(background ? { "--vibeui-background-005-bg": background } : null),
    ...(ink ? { "--vibeui-background-005-ink": ink } : null),
    ...style,
  } as CSSProperties

  const total = Math.max(3, Math.round(count))
  const frames = Array.from({ length: total }, (_, index) => {
    const photo = photos.length > 0 ? photos[index % photos.length] : undefined

    return { photo, ratio: RATIOS[index % RATIOS.length], index }
  })

  return (
    <>
      <style href="vibeui-background-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={hostRef}
        data-slot="background"
        data-vibeui-block="background-005"
        className={className}
        style={palette}
      >
        <div data-part="grain" />

        <div data-part="orbit" ref={orbitRef} aria-hidden="true">
          {frames.map(({ photo, ratio, index }) => (
            <div
              key={index}
              data-part="frame"
              data-empty={photo?.src ? undefined : "true"}
              style={
                {
                  "--vibeui-background-005-ratio": ratio,
                  // Размер гуляет от кадра к кадру: одинаковые прямоугольники
                  // читаются как сетка, а не как охапка карточек.
                  "--vibeui-background-005-frame": `${5.5 + (index % 4) * 1.3}rem`,
                } as CSSProperties
              }
            >
              {photo?.src ? (
                <img
                  src={photo.src}
                  alt={photo.alt ?? ""}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
            </div>
          ))}
        </div>

        <div data-part="halo" />

        <div data-part="center">
          {children ?? (
            <>
              {eyebrow ? <span data-part="eyebrow">{eyebrow}</span> : null}
              <h2>
                {title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              {note ? <p data-part="note">{note}</p> : null}
            </>
          )}
        </div>

        <div data-part="vignette" />
      </div>
    </>
  )
}

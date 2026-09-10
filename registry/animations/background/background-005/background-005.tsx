"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Background005Photo = {
  src?: string
  alt?: string
}

export type Background005Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
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
// то уходят вглубь: передний план идёт крупно и в полной резкости, дальний —
// мельче, бледнее и размыт. Глубина и есть вся анимация: без неё это
// карусель, а не пространство. Холст ровный: ни виньетки, ни ореола —
// градиентные круги на фоне выдавали себя раньше самих кадров.
//
// Позиции считает rAF, а не CSS-анимация: одному кадру нужны сразу масштаб,
// прозрачность, размытие и порядок перекрытия, и держать их в keyframes
// пришлось бы четырьмя параллельными анимациями.
const STYLES = `
:where([data-vibeui-block="background-005"]){
--vibeui-background-005-bg:light-dark(#f2f2f2,#1a1a1a);
--vibeui-background-005-ink:light-dark(#1a1a1a,#f2f2f2);
--vibeui-background-005-paper:color-mix(in oklab,var(--vibeui-background-005-ink) 8%,transparent);
/* Заливка холста отдельно от его цвета: страница со своей подложкой
   гасит её (--vibeui-background-005-canvas:transparent), а свечение под
   фразой продолжает считаться от цвета холста. */
--vibeui-background-005-canvas:var(--vibeui-background-005-bg);
/* Свет в пустой заготовке кадра: днём это белёсый лист, ночью — бумага в
   тёмной комнате, поэтому подмешивается разный цвет. */
--vibeui-background-005-lift:light-dark(#ffffff,#2a2a2a);
--vibeui-background-005-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="background-005"]{color-scheme:dark}
[data-vibeui-block="background-005"]{
position:relative;box-sizing:border-box;overflow:hidden;isolation:isolate;
width:100%;min-width:min(100%,16rem);min-height:28rem;height:100%;
background:var(--vibeui-background-005-canvas);
color:var(--vibeui-background-005-ink);
font-family:var(--vibeui-background-005-sans);
}
[data-vibeui-block="background-005"] *{box-sizing:border-box}
/* Орбита: кадры лежат в одном слое, глубину им задаёт скрипт.
   До первого расчёта слой скрыт: в разметке все кадры стоят в центре
   стопкой, и без этого зритель успевает увидеть кучу поверх фразы,
   которая только потом разлетается по орбите. Дальше проявлением
   занимается сам скрипт — кадр за кадром, из дымки. */
[data-vibeui-block="background-005"] [data-part="orbit"]{
position:absolute;inset:0;z-index:1;pointer-events:none;
opacity:0;
/* Порядок перекрытия задаёт третья координата, а не z-index. Он менялся
   каждый кадр, и чаще всего по бокам орбиты, где глубина бежит быстрее
   всего: каждая смена — перерисовка кадра и вздрагивание его рамки.
   Перспективы нет, поэтому сдвиг по Z ничего не масштабирует — он только
   расставляет кадры по глубине. */
transform-style:preserve-3d;
}
[data-vibeui-block="background-005"][data-ready="true"] [data-part="orbit"]{
opacity:1;
}
[data-vibeui-block="background-005"] [data-part="frame"]{
position:absolute;left:50%;top:50%;
width:var(--vibeui-background-005-frame,9rem);
aspect-ratio:var(--vibeui-background-005-ratio,3 / 4);
margin:calc(var(--vibeui-background-005-frame,9rem) * -0.5 * 1.333) 0 0 calc(var(--vibeui-background-005-frame,9rem) * -0.5);
border-radius:0.75rem;overflow:hidden;
background:var(--vibeui-background-005-paper);
/* Обводки у кадра нет. Волосяная линия в один пиксель на карточке, которую
   одновременно вращают, масштабируют и размывают, ложится на дробные
   пиксели и мерцает — сильнее всего по бокам орбиты, где кадр движется
   быстрее. Край фотографии держит форму и без неё. */
will-change:transform,opacity;
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
/* Фраза: она центр сцены, поэтому лежит выше кадров и не уезжает с ними. */
[data-vibeui-block="background-005"] [data-part="center"]{
position:absolute;inset:0;z-index:200;
display:flex;flex-direction:column;align-items:center;justify-content:center;
gap:0.75rem;padding:1.5rem;text-align:center;pointer-events:none;
/* Фразу можно поднять над центром, не трогая орбиту: кадры считаются от
   центра холста, а текст живёт своим слоем. Значение положительное и
   означает подъём. */
transform:translateY(calc(var(--vibeui-background-005-center-shift,0px) * -1));
/* Свечение цветом холста вместо подложки: кадр может пройти прямо под
   строкой, а рисовать под текстом круг — значит показывать зрителю круг. */
text-shadow:0 0 0.75rem var(--vibeui-background-005-bg),0 0 2rem var(--vibeui-background-005-bg);
}
/* Ссылки и кнопки в слоте центра снова кликаются: сам слой прозрачен для
   мыши, иначе кадры перехватывали бы наведение, но действие внутри фразы —
   это действие, а не украшение. */
[data-vibeui-block="background-005"] [data-part="center"] :where(a,button){
pointer-events:auto;
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

/** С какой глубины кадр считается передним планом и держит полную резкость. */
const FOCUS = 0.85

/** Полуоси орбиты в долях холста. */
const ORBIT_X = 0.4
const ORBIT_Y = 0.35
/** Насколько кадр гуляет по вертикали сверх орбиты. */
const DRIFT = 0.04
/** Самый крупный масштаб кадра и запас на его наклон. */
const MAX_SCALE = 1.2
const TILT = 1.08

/**
 * Первое появление: кадры проступают из тумана, а не включаются разом.
 * STEP разводит их по времени — иначе двенадцать одинаковых проявлений
 * читаются как один мигнувший слой. BLUR — та самая дымка, из которой
 * кадр выходит, DEPTH — насколько далеко он в этот момент стоит.
 */
const INTRO_MS = 1800
const INTRO_STEP = 120
const INTRO_BLUR = 32
const INTRO_DEPTH = 0.3

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
    let widest = 0
    let tallest = 0
    let bornAt = 0
    const previousBlur: number[] = []

    // Размер кадров читаем отдельно от кадра анимации: это единственное
    // место, где нужен layout, и в rAF он стоил бы пересчёта стилей.
    const measure = () => {
      widest = 0
      tallest = 0

      for (const frame of frames) {
        widest = Math.max(widest, frame.offsetWidth)
        tallest = Math.max(tallest, frame.offsetHeight)
      }
    }

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
      // Орбита широкая и пологая: по горизонтали кадры идут далеко, по
      // вертикали — заметно меньше, иначе они уезжают под край холста.
      const radiusX = width * ORBIT_X * current.spread
      const radiusY = height * ORBIT_Y * current.spread

      // Кадр целиком остаётся на холсте: от края до орбиты должно хватать
      // места на половину самого крупного кадра в его самом большом
      // масштабе. Не хватает — уменьшаем все кадры, а не режем их.
      const roomX = Math.max(0, width - radiusX * 2)
      const roomY = Math.max(0, height - radiusY * 2 * (1 + DRIFT))
      const fit =
        widest > 0 && tallest > 0
          ? Math.min(
              1,
              roomX / (widest * MAX_SCALE * TILT),
              roomY / (tallest * MAX_SCALE * TILT),
            )
          : 1

      if (!bornAt) bornAt = now

      for (let index = 0; index < frames.length; index += 1) {
        const frame = frames[index]
        const own = angle + (index / frames.length) * Math.PI * 2
        // Глубина: единица внизу орбиты, у самого зрителя, ноль наверху.
        const depth = (Math.sin(own) + 1) / 2
        const drift = Math.sin(own * 2 + index) * DRIFT

        // Проявление кадра: своя доля пути от тумана к сцене. При
        // выключенной анимации сцена сразу собрана — проявляться там
        // нечему, кадр и так стоит неподвижно.
        const step = calm.matches
          ? 1
          : Math.min(
              1,
              Math.max(0, (now - bornAt - index * INTRO_STEP) / INTRO_MS),
            )
        // Проявление идёт двумя разными скоростями. Плотность набирается
        // быстро: пока кадр прозрачен, никакого дыма не видно — видно
        // пустоту. Резкость возвращается медленно, и всё это время кадр
        // стоит на экране мутным пятном, из которого проступает картинка.
        const dense = 1 - (1 - Math.min(1, step * 2.6)) ** 2
        const shown = step * step * (3 - 2 * step)

        const scale = (0.58 + depth * 0.62) * fit * (1 - INTRO_DEPTH * (1 - shown))

        frame.style.transform = `translate3d(${(Math.cos(own) * radiusX).toFixed(1)}px, ${(Math.sin(own) * radiusY + drift * radiusY).toFixed(1)}px, ${(depth * 100).toFixed(1)}px) scale(${scale.toFixed(3)}) rotate(${(Math.cos(own + index) * 7).toFixed(2)}deg)`
        frame.style.opacity = ((0.34 + depth * 0.66) * dense).toFixed(3)
        // Резкость держится, пока кадр идёт передним планом: размывается он
        // только уходя вбок и дальше вглубь. Иначе орбита выглядит мутной
        // целиком, а не глубокой. Дымка первого появления добавляется сверху
        // и сходит на нет вместе с проявлением.
        const far = Math.max(0, (FOCUS - depth) / FOCUS)
        // Фильтр стоит всегда, даже нулевой. Переключение blur ↔ none
        // роняет кадр с отдельного слоя композитора обратно в общий и
        // обратно, и на каждом таком переходе мигает волосяная рамка.
        // Размытие ступеньками по половине пикселя. Плавно меняющийся
        // filter заставляет браузер перерисовывать слой кадра каждый кадр
        // анимации, и волосяная рамка при этом мерцает; со ступеньками
        // строка фильтра меняется редко, а глаз разницы не видит.
        const blur = far * far * 3.4 + (1 - shown) * INTRO_BLUR
        const stepped = Math.round(blur * 2) / 2

        if (stepped !== previousBlur[index]) {
          previousBlur[index] = stepped
          frame.style.filter = `blur(${stepped}px)`
        }


      }

      // Кадры расставлены — можно показывать слой.
      host.dataset.ready = "true"

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
      measure()
      if (!raf) run()
    })

    sizes.observe(host)
    measure()
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
      </div>
    </>
  )
}

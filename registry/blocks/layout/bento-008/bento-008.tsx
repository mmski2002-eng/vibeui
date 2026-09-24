import type { CSSProperties, ComponentProps } from "react"

export type Bento008Segment = {
  label: string
  /** Минут. */
  minutes: number
}

export type Bento008Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Фото урока для высокой плитки. Пусто — плитка с рукописной цитатой. */
  image?: string
  imageAlt?: string
  imageCaption?: string
  lessonTitle?: string
  lessonText?: string
  /** Части занятия по порядку — складываются в полосу времени. */
  segments?: readonly Bento008Segment[]
  groupTitle?: string
  groupText?: string
  /** Инициалы учеников в кружках; сколько — такая и группа. */
  group?: readonly string[]
  /** Доля времени, когда говорит ученик, в процентах. */
  speakShare?: number
  speakText?: string
  homeworkTitle?: string
  /** Рукописная домашка — каждая строка «пишется» сама по очереди. */
  homework?: readonly [string, string]
  /** Ярлык под домашкой: формат и длительность. */
  homeworkTag?: string
  nativeTitle?: string
  nativeText?: string
  natives?: readonly string[]
  recordTitle?: string
  records?: readonly string[]
  minutesUnit?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Как проходят занятия» — бенто из семи плиток разного размера. Большая:
// таймлайн урока из цветных отрезков, по которому плывёт светящаяся «игла»
// текущего момента — каждый отрезок вспыхивает точно в момент, когда игла
// до него доходит (задержка анимации считается из его доли минут). Высокая:
// фото с рукописной подписью-стикером. Маленькие: круг «70% говорите вы» на
// conic-gradient, шесть кружков-учеников, где один «поднимает руку»,
// тетрадный лист, на котором домашка пишется сама по себе, строка за
// строкой (clip-path, каждая строка — свой keyframe), чипы носителей и
// список «что остаётся после урока». Анимация на чистом CSS, доля минут для
// иглы считается на сервере.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=Marck+Script&display=swap"

const STYLES = `
:where([data-vibeui-block="bento-008"]){
--vibeui-bento-008-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bento-008-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-008-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-008-on-accent:oklch(from var(--vibeui-bento-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-bento-008-muted:color-mix(in oklab,var(--vibeui-bento-008-fg) 62%,var(--vibeui-bento-008-bg));
--vibeui-bento-008-line:color-mix(in oklab,var(--vibeui-bento-008-fg) 12%,transparent);
--vibeui-bento-008-rule:color-mix(in oklab,var(--vibeui-bento-008-fg) 8%,transparent);
--vibeui-bento-008-paper:color-mix(in oklab,var(--vibeui-bento-008-bg) 92%,#fff);
--vibeui-bento-008-soft:color-mix(in oklab,var(--vibeui-bento-008-accent) 10%,var(--vibeui-bento-008-bg));
--vibeui-bento-008-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-008-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-008-hand:"Marck Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-008"]{color-scheme:dark}
:where([data-vibeui-block="bento-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bento-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bento-008"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-bento-008-bg);color:var(--vibeui-bento-008-fg);font-family:var(--vibeui-bento-008-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="bento-008"] *{box-sizing:border-box}
[data-vibeui-block="bento-008"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bento-008"] [data-part="head"]{max-width:40rem;margin:0 0 2.5rem}
[data-vibeui-block="bento-008"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-bento-008-hand);font-size:1.4rem;color:var(--vibeui-bento-008-accent)}
[data-vibeui-block="bento-008"] [data-part="title"]{margin:0;font-family:var(--vibeui-bento-008-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.05;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="bento-008"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-bento-008-muted)}
[data-vibeui-block="bento-008"] [data-part="grid"]{display:grid;gap:1rem;grid-auto-rows:minmax(11rem,auto)}
[data-vibeui-block="bento-008"] [data-part="tile"]{position:relative;display:grid;align-content:start;gap:.5rem;padding:1.4rem;border-radius:1.4rem;background:var(--vibeui-bento-008-paper);border:1px solid var(--vibeui-bento-008-line);overflow:hidden;transition:transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s}
[data-vibeui-block="bento-008"] [data-part="tile"]:hover{transform:translateY(-3px);box-shadow:0 24px 40px -28px color-mix(in oklab,var(--vibeui-bento-008-fg) 50%,transparent)}
[data-vibeui-block="bento-008"] [data-part="tile"] h3{margin:0;font-family:var(--vibeui-bento-008-display);font-weight:700;font-size:1.15rem;letter-spacing:-.01em;line-height:1.25}
[data-vibeui-block="bento-008"] [data-part="tile"] p{margin:0;font-size:.92rem;color:var(--vibeui-bento-008-muted)}
[data-vibeui-block="bento-008"] [data-part="tile"][data-kind="lesson"]{background:var(--vibeui-bento-008-soft)}
[data-vibeui-block="bento-008"] [data-part="timeline"]{position:relative;display:flex;height:2.6rem;margin:1rem 0 0;border-radius:.8rem;overflow:hidden;background:var(--vibeui-bento-008-bg)}
[data-vibeui-block="bento-008"] [data-part="timeline"] > span{position:relative;display:grid;place-items:center;min-width:0;padding:0 .3rem;font-size:.7rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--vibeui-bento-008-fg);background:color-mix(in oklab,var(--vibeui-bento-008-accent) calc(var(--vibeui-bento-008-i) * 14% + 12%),var(--vibeui-bento-008-bg));border-right:1px solid var(--vibeui-bento-008-bg);animation:vibeui-bento-008-pass 14s ease-in-out infinite;animation-delay:calc(var(--vibeui-bento-008-at,0) * 14s)}
[data-vibeui-block="bento-008"] [data-part="timeline"] > span:last-child{border-right:0}
[data-vibeui-block="bento-008"] [data-part="needle"]{position:absolute;left:0;top:0;bottom:0;width:100%;pointer-events:none;animation:vibeui-bento-008-needle 14s linear infinite}
[data-vibeui-block="bento-008"] [data-part="needle"]::before{content:"";position:absolute;left:-1.15rem;top:0;bottom:0;width:1.15rem;background:linear-gradient(90deg,transparent,color-mix(in oklab,var(--vibeui-bento-008-accent) 45%,transparent))}
[data-vibeui-block="bento-008"] [data-part="needle"]::after{content:"";position:absolute;left:-.35rem;top:-.15rem;width:.7rem;height:.7rem;border-radius:50%;background:var(--vibeui-bento-008-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-bento-008-accent) 20%,transparent),0 0 10px color-mix(in oklab,var(--vibeui-bento-008-accent) 60%,transparent)}
[data-vibeui-block="bento-008"] [data-part="needle"] i{position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--vibeui-bento-008-accent);box-shadow:0 0 6px color-mix(in oklab,var(--vibeui-bento-008-accent) 70%,transparent)}
[data-vibeui-block="bento-008"] [data-part="legend"]{display:flex;flex-wrap:wrap;gap:.3rem 1rem;margin:.8rem 0 0;padding:0;list-style:none;font-size:.78rem;color:var(--vibeui-bento-008-muted)}
[data-vibeui-block="bento-008"] [data-part="legend"] b{font-family:var(--vibeui-bento-008-display);font-weight:700;color:var(--vibeui-bento-008-fg)}
[data-vibeui-block="bento-008"] [data-part="tile"][data-kind="photo"]{padding:0;min-height:18rem}
[data-vibeui-block="bento-008"] [data-part="tile"][data-kind="photo"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="bento-008"] [data-part="tile"][data-kind="photo"]:hover img{transform:scale(1.04)}
[data-vibeui-block="bento-008"] [data-part="caption"]{position:absolute;left:1rem;bottom:1rem;max-width:calc(100% - 2rem);padding:.6rem .9rem;border-radius:.3rem;background:var(--vibeui-bento-008-accent);color:var(--vibeui-bento-008-on-accent);font-family:var(--vibeui-bento-008-hand);font-size:1.15rem;line-height:1.2;transform:rotate(-3deg);transform-origin:left bottom}
[data-vibeui-block="bento-008"] [data-part="ring"]{position:relative;width:6.5rem;height:6.5rem;margin:.4rem 0 .2rem;border-radius:50%;background:conic-gradient(var(--vibeui-bento-008-accent) calc(var(--vibeui-bento-008-share) * 1%),var(--vibeui-bento-008-line) 0);display:grid;place-items:center}
[data-vibeui-block="bento-008"] [data-part="ring"]::before{content:"";position:absolute;inset:.7rem;border-radius:50%;background:var(--vibeui-bento-008-paper)}
[data-vibeui-block="bento-008"] [data-part="ring"] b{position:relative;font-family:var(--vibeui-bento-008-display);font-weight:800;font-size:1.5rem;letter-spacing:-.03em}
[data-vibeui-block="bento-008"] [data-part="faces"]{display:flex;margin:.4rem 0 .2rem;padding:0;list-style:none}
[data-vibeui-block="bento-008"] [data-part="tile"][data-kind="homework"]{background-image:repeating-linear-gradient(180deg,transparent 0 calc(1.6rem - 1px),var(--vibeui-bento-008-rule) calc(1.6rem - 1px) 1.6rem)}
[data-vibeui-block="bento-008"] p[data-part="ink"]{margin:.5rem 0 0;font-family:var(--vibeui-bento-008-hand);font-size:1.25rem;line-height:1.6rem;color:var(--vibeui-bento-008-accent);clip-path:inset(0 100% 0 0)}
[data-vibeui-block="bento-008"] p[data-part="ink"]:first-of-type{margin-top:.7rem;animation:vibeui-bento-008-write-1 8s cubic-bezier(.4,0,.6,1) infinite}
[data-vibeui-block="bento-008"] p[data-part="ink"]:nth-of-type(2){animation:vibeui-bento-008-write-2 8s cubic-bezier(.4,0,.6,1) infinite}
[data-vibeui-block="bento-008"] [data-part="tag"]{display:inline-flex;align-items:center;gap:.4rem;margin:1rem 0 0;padding:.4rem .8rem;border-radius:999px;background:var(--vibeui-bento-008-bg);border:1px solid var(--vibeui-bento-008-line);font-size:.78rem;font-weight:600;color:var(--vibeui-bento-008-muted)}
[data-vibeui-block="bento-008"] [data-part="tag"]::before{content:"";width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-bento-008-accent)}
[data-vibeui-block="bento-008"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:.6rem 0 0;padding:0;list-style:none}
[data-vibeui-block="bento-008"] [data-part="list"]{display:grid;gap:.4rem;margin:.6rem 0 0;padding:0;list-style:none;font-size:.9rem}
[data-vibeui-block="bento-008"] [data-part="list"] li{display:flex;gap:.5rem;align-items:baseline}
[data-vibeui-block="bento-008"] [data-part="list"] li::before{content:"✓";font-weight:700;color:var(--vibeui-bento-008-accent)}
@keyframes vibeui-bento-008-needle{from{transform:translateX(0)}to{transform:translateX(100%)}}
@keyframes vibeui-bento-008-pass{0%{filter:brightness(1.45)}12%{filter:brightness(1)}100%{filter:brightness(1)}}
@keyframes vibeui-bento-008-hand{0%,70%,100%{transform:translateY(0)}80%,90%{transform:translateY(-5px)}}
@keyframes vibeui-bento-008-wave{0%,70%,100%{transform:rotate(0);opacity:0}80%{opacity:1;transform:rotate(-15deg)}90%{opacity:1;transform:rotate(15deg)}}
@keyframes vibeui-bento-008-write-1{0%{clip-path:inset(0 100% 0 0);opacity:1}18%{clip-path:inset(0 0 0 0)}82%{clip-path:inset(0 0 0 0);opacity:1}94%{opacity:0}100%{opacity:0;clip-path:inset(0 100% 0 0)}}
@keyframes vibeui-bento-008-write-2{0%,20%{clip-path:inset(0 100% 0 0);opacity:1}40%{clip-path:inset(0 0 0 0)}82%{clip-path:inset(0 0 0 0);opacity:1}94%{opacity:0}100%{opacity:0;clip-path:inset(0 100% 0 0)}}
@container (min-width: 40rem){[data-vibeui-block="bento-008"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}[data-vibeui-block="bento-008"] [data-part="tile"][data-kind="lesson"],[data-vibeui-block="bento-008"] [data-part="tile"][data-kind="homework"]{grid-column:span 2}}
@container (min-width: 64rem){[data-vibeui-block="bento-008"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}[data-vibeui-block="bento-008"] [data-part="tile"][data-kind="lesson"]{grid-column:span 2;grid-row:span 2}[data-vibeui-block="bento-008"] [data-part="tile"][data-kind="photo"]{grid-row:span 2}[data-vibeui-block="bento-008"] [data-part="tile"][data-kind="homework"]{grid-column:span 2}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-008"] *{animation:none!important;transition:none!important}[data-vibeui-block="bento-008"] p[data-part="ink"]{clip-path:none}[data-vibeui-block="bento-008"] [data-part="needle"]{display:none}}
@keyframes vibeui-bento-008-wave{0%,70%,100%{transform:rotate(0);opacity:0}80%{opacity:1;transform:rotate(-15deg)}90%{opacity:1;transform:rotate(15deg)}}
@keyframes vibeui-bento-008-hand{0%,70%,100%{transform:translateY(0)}80%,90%{transform:translateY(-5px)}}
[data-vibeui-block="bento-008"] [data-part="face"]{position:relative;display:grid;place-items:center;width:2.6rem;height:2.6rem;margin-left:-.6rem;border-radius:50%;border:2px solid var(--vibeui-bento-008-paper);background:color-mix(in oklab,var(--vibeui-bento-008-accent) calc(var(--vibeui-bento-008-i) * 12% + 20%),var(--vibeui-bento-008-fg));color:#fff;font-family:var(--vibeui-bento-008-display);font-size:.72rem;font-weight:700}
[data-vibeui-block="bento-008"] [data-part="face"]:first-child{margin-left:0}
[data-vibeui-block="bento-008"] [data-part="face"][data-hand="true"]{animation:vibeui-bento-008-hand 3s ease-in-out infinite}
[data-vibeui-block="bento-008"] [data-part="face"][data-hand="true"]::after{content:"✋";position:absolute;right:-.5rem;top:-.6rem;font-size:.9rem;animation:vibeui-bento-008-wave 3s ease-in-out infinite}
[data-vibeui-block="bento-008"] [data-part="chip"]{display:inline-flex;align-items:center;gap:.4rem;padding:.35rem .7rem;border-radius:999px;border:1px solid var(--vibeui-bento-008-line);background:var(--vibeui-bento-008-bg);font-size:.8rem;font-weight:600;transform:rotate(calc(var(--vibeui-bento-008-r) * 1deg))}
[data-vibeui-block="bento-008"] [data-part="chip"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-bento-008-accent)}
`

const DEFAULT_SEGMENTS: Bento008Segment[] = [
  { label: "разогрев", minutes: 5 },
  { label: "домашка", minutes: 10 },
  { label: "новая тема", minutes: 15 },
  { label: "разговор", minutes: 25 },
  { label: "итоги", minutes: 5 },
]

type FaceProps = Omit<ComponentProps<"li">, "title" | "children"> & {
  initials?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Face({
  initials,
  accent,
  className,
  style,
  ...props
}: FaceProps) {
  const palette = {
    ...(accent ? { "--vibeui-bento-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <li
        {...props}
        className={className}
        style={palette}
      >
        {initials}
      </li>
  )
}

type ChipProps = Omit<ComponentProps<"li">, "title" | "children"> & {
  label?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Chip({
  label,
  accent,
  className,
  style,
  ...props
}: ChipProps) {
  const palette = {
    ...(accent ? { "--vibeui-bento-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <li
        {...props}
        className={className}
        style={palette}
      >
        {label}
      </li>
  )
}

/** Бенто «как проходят занятия»: таймлайн урока, фото, круг, ученики, домашка. */
export function Bento008({
  eyebrow = "как проходят занятия",
  title = "Час, после которого хочется говорить",
  lede = "Никаких лекций про Present Perfect на сорок минут. Занятие собрано так, чтобы вы говорили больше преподавателя — и уходили с домашкой, которую хочется сделать.",
  image = "",
  imageAlt = "Занятие в группе: преподаватель и ученики на экране",
  imageCaption = "группа B1, четверг, 19:30",
  lessonTitle = "Занятие — 60 минут в Zoom",
  lessonText = "Пять частей, и самая длинная — разговор. Преподаватель ведёт, но не солирует.",
  segments = DEFAULT_SEGMENTS,
  groupTitle = "До шести человек",
  groupText = "Каждый говорит каждое занятие. Пары меняются, чтобы вы слышали разные голоса.",
  group = ["МК", "АС", "ДП", "ОВ", "ИЛ", "ЕН"],
  speakShare = 70,
  speakText = "времени занятия говорите вы, а не слушаете",
  homeworkTitle = "Домашка в тетради",
  homework = ["Записать голосовое: три вещи, которые бесят по утрам.", "На английском, 40 секунд — и в чат группы."],
  homeworkTag = "🎤 голосовое · 40 сек",
  nativeTitle = "Носитель раз в неделю",
  nativeText = "Каждое четвёртое занятие ведёт носитель — привыкаете к скорости и акценту.",
  natives = ["Manchester", "Valencia", "Bologna"],
  recordTitle = "После урока остаётся",
  records = ["Запись занятия на неделю", "Конспект с новыми словами", "Голосовой разбор домашки"],
  minutesUnit = "мин",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bento008Props) {
  const palette = {
    ...(accent ? { "--vibeui-bento-008-accent": accent } : null),
    ...(ink ? { "--vibeui-bento-008-fg": ink } : null),
    ...(background ? { "--vibeui-bento-008-bg": background } : null),
    ...style,
  } as CSSProperties

  const totalMinutes = segments.reduce((sum, segment) => sum + segment.minutes, 0) || 1
  let elapsedMinutes = 0

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bento-008" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="bento-008" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="grid">
            <article data-part="tile" data-kind="lesson">
              <h3>{lessonTitle}</h3>
              <p>{lessonText}</p>
              <div data-part="timeline" aria-hidden="true">
                {segments.map((segment, index) => {
                  const at = elapsedMinutes / totalMinutes
                  elapsedMinutes += segment.minutes
                  return (
                    <span key={segment.label} style={{ flex: segment.minutes, ["--vibeui-bento-008-i" as string]: index, ["--vibeui-bento-008-at" as string]: at }}>
                      {segment.label}
                    </span>
                  )
                })}
                <i data-part="needle">
                  <i />
                </i>
              </div>
              <ul data-part="legend">
                {segments.map((segment) => (
                  <li key={segment.label}>
                    <b>{segment.minutes} {minutesUnit}</b> {segment.label}
                    <span aria-hidden="true"> · {Math.round((segment.minutes / totalMinutes) * 100)}%</span>
                  </li>
                ))}
              </ul>
            </article>
            <article data-part="tile" data-kind="photo">
              {image ? <img src={image} alt={imageAlt} loading="lazy" /> : null}
              {imageCaption ? <span data-part="caption">{imageCaption}</span> : null}
            </article>
            <article data-part="tile" data-kind="speak">
              <div data-part="ring" style={{ ["--vibeui-bento-008-share" as string]: speakShare }} aria-hidden="true">
                <b>{speakShare}%</b>
              </div>
              <p>
                <b>{speakShare}%</b> {speakText}
              </p>
            </article>
            <article data-part="tile" data-kind="group">
              <h3>{groupTitle}</h3>
              <ul data-part="faces" aria-hidden="true">
                {group.map((initials, index) => (
                  <Face key={`${initials}-${index}`} data-part="face" initials={initials} data-hand={index === group.length - 2 ? "true" : undefined} style={{ ["--vibeui-bento-008-i" as string]: index }} accent={accent} />
                ))}
              </ul>
              <p>{groupText}</p>
            </article>
            <article data-part="tile" data-kind="homework">
              <h3>{homeworkTitle}</h3>
              <p data-part="ink">{homework[0]}</p>
              <p data-part="ink">{homework[1]}</p>
              {homeworkTag ? <span data-part="tag">{homeworkTag}</span> : null}
            </article>
            <article data-part="tile" data-kind="native">
              <h3>{nativeTitle}</h3>
              <p>{nativeText}</p>
              <ul data-part="chips">
                {natives.map((native, index) => (
                  <Chip key={native} data-part="chip" label={native} style={{ ["--vibeui-bento-008-r" as string]: index % 2 === 0 ? -2 : 2 }} accent={accent} />
                ))}
              </ul>
            </article>
            <article data-part="tile" data-kind="record">
              <h3>{recordTitle}</h3>
              <ul data-part="list">
                {records.map((record) => (
                  <li key={record}>{record}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}

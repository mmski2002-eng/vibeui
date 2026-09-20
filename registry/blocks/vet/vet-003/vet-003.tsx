"use client"

import { useMemo, useState, type CSSProperties } from "react"

export type Vet003Symptom = {
  label: string
  /** К кому вести: «Терапевт», «Хирург». */
  doctor: string
  /** 1 — планово, 2 — в ближайшие сутки, 3 — срочно сейчас. */
  urgency: 1 | 2 | 3
}

export type Vet003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  symptoms?: readonly Vet003Symptom[]
  /** Подписи трёх уровней срочности. */
  levels?: readonly [string, string, string]
  phone?: string
  phoneHref?: string
  actionLabel?: string
  actionHref?: string
  disclaimer?: string
  emptyText?: string
  /** aria списка симптомов. */
  chipsLabel?: string
  /** Заголовок шкалы: ничего не выбрано, затем по уровню срочности 1–3. */
  scaleTitles?: readonly [string, string, string, string]
  scaleEmpty?: string
  scaleLine?: string
  scaleUnknown?: string
  scaleLabel?: string
  scaleTicks?: readonly [string, string, string]
  callLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Симптом-чекер: чипы симптомов, каждый знает своего врача и срочность.
// Отмеченные группируются по врачу в useMemo — карточка «к кому и как
// быстро» с полосой-шкалой (зелёный → янтарный → красный), сверху общий
// «градусник» с бегунком по максимальной срочности. Красный уровень
// показывает телефон, зелёный — запись. Не диагноз, а маршрут.
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="vet-003"]){
--vibeui-vet-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-vet-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-vet-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-vet-003-on-accent:oklch(from var(--vibeui-vet-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-vet-003-muted:color-mix(in oklab,var(--vibeui-vet-003-fg) 62%,var(--vibeui-vet-003-bg));
--vibeui-vet-003-line:color-mix(in oklab,var(--vibeui-vet-003-fg) 12%,transparent);
--vibeui-vet-003-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-vet-003-bg) 88%,#fff));
--vibeui-vet-003-ok:#4f8f45;
--vibeui-vet-003-warn:#d99a1e;
--vibeui-vet-003-bad:#d1432f;
--vibeui-vet-003-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-vet-003-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="vet-003"]{color-scheme:dark}
:where([data-vibeui-block="vet-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="vet-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="vet-003"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-vet-003-bg);color:var(--vibeui-vet-003-fg);font-family:var(--vibeui-vet-003-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="vet-003"] *{box-sizing:border-box}
[data-vibeui-block="vet-003"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="vet-003"] [data-part="head"]{max-width:40rem}
[data-vibeui-block="vet-003"] [data-part="eyebrow"]{margin:0 0 .7rem;font-weight:600;font-size:.85rem;letter-spacing:.02em;color:var(--vibeui-vet-003-accent)}
[data-vibeui-block="vet-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-vet-003-display);font-weight:900;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1;letter-spacing:-.03em}
[data-vibeui-block="vet-003"] [data-part="lede"]{margin:.9rem 0 0;color:var(--vibeui-vet-003-muted)}
[data-vibeui-block="vet-003"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="vet-003"] [data-part="chip"]{display:inline-flex;align-items:center;gap:.45rem;padding:.55rem .95rem;border:1px solid var(--vibeui-vet-003-line);border-radius:999px;background:var(--vibeui-vet-003-card);color:var(--vibeui-vet-003-fg);font:inherit;font-size:.92rem;font-weight:500;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .2s cubic-bezier(.34,1.56,.64,1)}
[data-vibeui-block="vet-003"] [data-part="chip"]::before{content:"";width:.55rem;height:.55rem;border-radius:50%;background:var(--vibeui-vet-003-dot);flex-shrink:0;transition:transform .2s}
[data-vibeui-block="vet-003"] [data-part="chip"][data-level="1"]{--vibeui-vet-003-dot:var(--vibeui-vet-003-ok)}
[data-vibeui-block="vet-003"] [data-part="chip"][data-level="2"]{--vibeui-vet-003-dot:var(--vibeui-vet-003-warn)}
[data-vibeui-block="vet-003"] [data-part="chip"][data-level="3"]{--vibeui-vet-003-dot:var(--vibeui-vet-003-bad)}
[data-vibeui-block="vet-003"] [data-part="chip"]:hover{border-color:var(--vibeui-vet-003-fg)}
[data-vibeui-block="vet-003"] [data-part="chip"][aria-pressed="true"]{background:var(--vibeui-vet-003-fg);color:var(--vibeui-vet-003-bg);border-color:transparent;transform:scale(1.04)}
[data-vibeui-block="vet-003"] [data-part="chip"][aria-pressed="true"]::before{transform:scale(1.3)}
[data-vibeui-block="vet-003"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-vet-003-accent);outline-offset:2px}
[data-vibeui-block="vet-003"] [data-part="result"]{display:grid;gap:1.2rem;margin:2rem 0 0;align-items:start}
[data-vibeui-block="vet-003"] [data-part="gauge"]{padding:1.4rem;border-radius:1.5rem;background:var(--vibeui-vet-003-card);border:1px solid var(--vibeui-vet-003-line)}
[data-vibeui-block="vet-003"] [data-part="gauge"] h3{margin:0;font-family:var(--vibeui-vet-003-display);font-weight:900;font-size:1.3rem;line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="vet-003"] [data-part="gauge"] p{margin:.4rem 0 0;font-size:.88rem;color:var(--vibeui-vet-003-muted)}
[data-vibeui-block="vet-003"] [data-part="scale"]{position:relative;height:.9rem;margin:1.2rem 0 .4rem;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-vet-003-ok),var(--vibeui-vet-003-warn) 50%,var(--vibeui-vet-003-bad))}
[data-vibeui-block="vet-003"] [data-part="scale"] i{position:absolute;top:50%;left:calc(var(--vibeui-vet-003-level) * 100%);width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-vet-003-card);border:3px solid var(--vibeui-vet-003-fg);transform:translate(-50%,-50%);box-shadow:0 4px 12px -2px rgb(0 0 0 / .3);transition:left .5s cubic-bezier(.34,1.4,.64,1)}
[data-vibeui-block="vet-003"] [data-part="ticks"]{display:flex;justify-content:space-between;margin:0;padding:0;list-style:none;font-size:.72rem;color:var(--vibeui-vet-003-muted)}
[data-vibeui-block="vet-003"] [data-part="verdict"]{display:flex;align-items:center;gap:.6rem;margin:1.2rem 0 0;padding:.8rem 1rem;border-radius:1rem;background:color-mix(in oklab,var(--vibeui-vet-003-tone) 14%,transparent);color:var(--vibeui-vet-003-fg);font-weight:600;font-size:.95rem}
[data-vibeui-block="vet-003"] [data-part="verdict"] i{width:.7rem;height:.7rem;border-radius:50%;background:var(--vibeui-vet-003-tone);flex-shrink:0}
[data-vibeui-block="vet-003"] [data-part="cta"]{display:inline-flex;align-items:center;gap:.5rem;margin:1rem 0 0;padding:.8rem 1.2rem;border-radius:999px;background:var(--vibeui-vet-003-accent);color:var(--vibeui-vet-003-on-accent);text-decoration:none;font-family:var(--vibeui-vet-003-display);font-weight:800;transition:transform .2s cubic-bezier(.34,1.56,.64,1)}
[data-vibeui-block="vet-003"] [data-part="cta"]:hover{transform:translateY(-2px)}
[data-vibeui-block="vet-003"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-vet-003-fg);outline-offset:2px}
[data-vibeui-block="vet-003"] [data-part="cta"][data-level="3"]{background:var(--vibeui-vet-003-bad);color:#fff}
[data-vibeui-block="vet-003"] [data-part="cards"]{display:grid;gap:.8rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="vet-003"] [data-part="empty"]{display:grid;place-items:center;min-height:10rem;padding:1.5rem;border-radius:1.5rem;border:2px dashed var(--vibeui-vet-003-line);color:var(--vibeui-vet-003-muted);text-align:center}
[data-vibeui-block="vet-003"] [data-part="doc"]{position:relative;display:grid;gap:.4rem;padding:1.1rem 1.2rem 1.1rem 1.5rem;border-radius:1.2rem;background:var(--vibeui-vet-003-card);border:1px solid var(--vibeui-vet-003-line);overflow:hidden;animation:vibeui-vet-003-rise .35s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="vet-003"] [data-part="doc"]::before{content:"";position:absolute;left:0;top:0;bottom:0;width:.45rem;background:var(--vibeui-vet-003-tone)}
[data-vibeui-block="vet-003"] [data-part="doc"][data-level="1"]{--vibeui-vet-003-tone:var(--vibeui-vet-003-ok)}
[data-vibeui-block="vet-003"] [data-part="doc"][data-level="2"]{--vibeui-vet-003-tone:var(--vibeui-vet-003-warn)}
[data-vibeui-block="vet-003"] [data-part="doc"][data-level="3"]{--vibeui-vet-003-tone:var(--vibeui-vet-003-bad)}
[data-vibeui-block="vet-003"] [data-part="doc"] h4{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;margin:0;font-family:var(--vibeui-vet-003-display);font-weight:900;font-size:1.15rem;letter-spacing:-.01em}
[data-vibeui-block="vet-003"] [data-part="doc"] h4 span{padding:.15rem .55rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-vet-003-tone) 16%,transparent);color:var(--vibeui-vet-003-tone);font-family:var(--vibeui-vet-003-font);font-weight:600;font-size:.72rem}
[data-vibeui-block="vet-003"] [data-part="doc"] p{margin:0;font-size:.88rem;color:var(--vibeui-vet-003-muted)}
[data-vibeui-block="vet-003"] [data-part="bar"]{height:.4rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-vet-003-fg) 8%,transparent);overflow:hidden}
[data-vibeui-block="vet-003"] [data-part="bar"] i{display:block;height:100%;width:calc(var(--vibeui-vet-003-level) * 100%);border-radius:inherit;background:var(--vibeui-vet-003-tone);transition:width .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="vet-003"] [data-part="disclaimer"]{margin:1.6rem 0 0;font-size:.8rem;color:var(--vibeui-vet-003-muted)}
@keyframes vibeui-vet-003-rise{from{opacity:0;transform:translateY(8px)}}
@container (min-width: 56rem){[data-vibeui-block="vet-003"] [data-part="result"]{grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:1.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="vet-003"] *{animation:none!important;transition:none!important}}`

const DEFAULT_SYMPTOMS: Vet003Symptom[] = [
  { label: "Не ест второй день", doctor: "Терапевт", urgency: 2 },
  { label: "Рвота больше двух раз", doctor: "Терапевт", urgency: 2 },
  { label: "Тяжело дышит, синий язык", doctor: "Дежурный врач", urgency: 3 },
  { label: "Не может пописать", doctor: "Дежурный врач", urgency: 3 },
  { label: "Съел что-то не то", doctor: "Дежурный врач", urgency: 3 },
  { label: "Хромает", doctor: "Ортопед", urgency: 1 },
  { label: "Чешется, лысеет", doctor: "Дерматолог", urgency: 1 },
  { label: "Запах изо рта", doctor: "Стоматолог", urgency: 1 },
  { label: "Трясёт головой", doctor: "Терапевт", urgency: 1 },
  { label: "Слезятся глаза", doctor: "Офтальмолог", urgency: 1 },
  { label: "Кровь в моче", doctor: "Терапевт", urgency: 2 },
  { label: "Вялый, прячется", doctor: "Терапевт", urgency: 2 },
  { label: "Судороги", doctor: "Дежурный врач", urgency: 3 },
  { label: "Пьёт очень много", doctor: "Терапевт", urgency: 2 },
  { label: "Шишка под кожей", doctor: "Хирург", urgency: 1 },
]

const DEFAULT_LEVELS: [string, string, string] = ["планово, на неделе", "в ближайшие сутки", "срочно, прямо сейчас"]

/** Симптом-чекер с маршрутом к врачу и шкалой срочности. */
export function Vet003({
  eyebrow = "Что-то не так?",
  title = "Отметьте, что заметили",
  lede = "Скажем, к какому врачу и насколько срочно. Это не диагноз — маршрут, чтобы не гадать в три часа ночи.",
  symptoms = DEFAULT_SYMPTOMS,
  levels = DEFAULT_LEVELS,
  phone = "+7 495 120-24-24",
  phoneHref = "tel:+74951202424",
  actionLabel = "Записаться",
  actionHref = "#contacts",
  disclaimer = "Если сомневаетесь — звоните. Дежурный врач ответит и скажет, ехать ли сейчас. Это бесплатно.",
  emptyText = "Пока ничего не отмечено. Нажмите на симптомы выше — карточки соберутся сами.",
  chipsLabel = "Симптомы",
  scaleTitles = ["Шкала срочности", "Можно записаться планово", "Сегодня, не откладывая", "Ехать сейчас"],
  scaleEmpty = "Отметьте симптомы — бегунок покажет, насколько всё серьёзно.",
  scaleLine = "Отмечено: {n}. Смотрим на самый тревожный симптом.",
  scaleUnknown = "Срочность не определена",
  scaleLabel = "Срочность: {level}",
  scaleTicks = ["планово", "сутки", "сейчас"],
  callLabel = "Позвонить {phone}",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Vet003Props) {
  const [picked, setPicked] = useState<readonly string[]>([])

  const toggle = (label: string) => {
    setPicked((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label]))
  }

  const groups = useMemo(() => {
    const map = new Map<string, { doctor: string; urgency: 1 | 2 | 3; items: string[] }>()
    for (const symptom of symptoms) {
      if (!picked.includes(symptom.label)) continue
      const entry = map.get(symptom.doctor) ?? { doctor: symptom.doctor, urgency: symptom.urgency, items: [] }
      entry.items.push(symptom.label)
      if (symptom.urgency > entry.urgency) entry.urgency = symptom.urgency
      map.set(symptom.doctor, entry)
    }
    return [...map.values()].sort((a, b) => b.urgency - a.urgency || b.items.length - a.items.length)
  }, [symptoms, picked])

  const top: 0 | 1 | 2 | 3 = groups.length > 0 ? groups[0].urgency : 0
  const gaugeLevel = top === 0 ? 0 : (top - 1) / 2
  const toneVar = top === 3 ? "var(--vibeui-vet-003-bad)" : top === 2 ? "var(--vibeui-vet-003-warn)" : "var(--vibeui-vet-003-ok)"

  const palette = {
    ...(accent ? { "--vibeui-vet-003-accent": accent } : null),
    ...(ink ? { "--vibeui-vet-003-fg": ink } : null),
    ...(background ? { "--vibeui-vet-003-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-vet-003" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="vet-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="chips" aria-label={chipsLabel}>
            {symptoms.map((symptom) => (
              <li key={symptom.label}>
                <button data-part="chip" type="button" data-level={symptom.urgency} aria-pressed={picked.includes(symptom.label)} onClick={() => toggle(symptom.label)}>
                  {symptom.label}
                </button>
              </li>
            ))}
          </ul>
          <div data-part="result">
            <div data-part="gauge" style={{ ["--vibeui-vet-003-level" as string]: gaugeLevel, ["--vibeui-vet-003-tone" as string]: toneVar }}>
              <h3>{scaleTitles[top]}</h3>
              <p>{picked.length === 0 ? scaleEmpty : scaleLine.replace("{n}", String(picked.length))}</p>
              <div data-part="scale" role="img" aria-label={top === 0 ? scaleUnknown : scaleLabel.replace("{level}", levels[top - 1])}>
                <i />
              </div>
              <ul data-part="ticks" aria-hidden="true">
                {scaleTicks.map((tick) => (
                  <li key={tick}>{tick}</li>
                ))}
              </ul>
              {top > 0 ? (
                <div data-part="verdict" aria-live="polite">
                  <i aria-hidden="true" />
                  {levels[top - 1]}
                </div>
              ) : null}
              {top === 3 ? (
                <a data-part="cta" data-level="3" href={phoneHref}>
                  {callLabel.replace("{phone}", phone)}
                </a>
              ) : top > 0 && actionLabel ? (
                <a data-part="cta" href={actionHref}>
                  {actionLabel}
                </a>
              ) : null}
            </div>
            {groups.length === 0 ? (
              <p data-part="empty">{emptyText}</p>
            ) : (
              <ul data-part="cards" aria-live="polite">
                {groups.map((group) => (
                  <li key={group.doctor} data-part="doc" data-level={group.urgency} style={{ ["--vibeui-vet-003-level" as string]: group.urgency / 3 }}>
                    <h4>
                      {group.doctor}
                      <span>{levels[group.urgency - 1]}</span>
                    </h4>
                    <p>{group.items.join(" · ")}</p>
                    <div data-part="bar" aria-hidden="true">
                      <i />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {disclaimer ? <p data-part="disclaimer">{disclaimer}</p> : null}
        </div>
      </section>
    </>
  )
}

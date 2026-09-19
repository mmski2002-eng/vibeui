"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Language001Question = {
  /** Текст вопроса; «___» — пропуск. */
  prompt: string
  options: readonly string[]
  /** Индекс верного варианта. */
  answer: number
}

export type Language001Level = {
  /** Код уровня на шкале: «A1». */
  code: string
  /** Подпись: «Beginner». */
  label: string
  /** Что человек может: «Заказать кофе и представиться». */
  can: string
  /** Какая группа подойдёт: «A1 · старт с нуля, вторник и четверг 19:30». */
  group: string
}

export type Language001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  questions?: readonly Language001Question[]
  /** Уровни по возрастанию; результат — число верных ответов, растянутое на шкалу. */
  levels?: readonly Language001Level[]
  resultTitle?: string
  actionLabel?: string
  actionHref?: string
  retryLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Тест уровня на тетрадном листе: пять вопросов с пропуском, варианты —
// чипы, сверху прогресс-полоска из пяти сегментов. Выбранный чип
// подсвечивается, через полсекунды лист «перелистывается» к следующему
// вопросу. В конце — шкала A1…C1: заливка растёт от левого края, маркер
// с уровнем плавно доезжает до своей отметки, ниже «вам подойдёт группа…».
// Результат отправляется событием vibeui-language:level — расписание
// может подхватить его и выставить фильтр по уровню.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=Marck+Script&display=swap"

const STYLES = `
:where([data-vibeui-block="language-001"]){
--vibeui-language-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-language-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-language-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-language-001-on-accent:oklch(from var(--vibeui-language-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-language-001-muted:color-mix(in oklab,var(--vibeui-language-001-fg) 62%,var(--vibeui-language-001-bg));
--vibeui-language-001-line:color-mix(in oklab,var(--vibeui-language-001-fg) 12%,transparent);
--vibeui-language-001-rule:color-mix(in oklab,var(--vibeui-language-001-fg) 7%,transparent);
--vibeui-language-001-paper:color-mix(in oklab,var(--vibeui-language-001-bg) 92%,#fff);
--vibeui-language-001-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-language-001-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-language-001-hand:"Marck Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="language-001"]{color-scheme:dark}
:where([data-vibeui-block="language-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="language-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="language-001"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-language-001-bg);color:var(--vibeui-language-001-fg);font-family:var(--vibeui-language-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="language-001"] *{box-sizing:border-box}
[data-vibeui-block="language-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="language-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-language-001-hand);font-size:1.4rem;color:var(--vibeui-language-001-accent)}
[data-vibeui-block="language-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-language-001-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.05;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="language-001"] [data-part="lede"]{margin:1rem 0 0;max-width:28rem;color:var(--vibeui-language-001-muted)}
[data-vibeui-block="language-001"] [data-part="scale-legend"]{display:grid;gap:.4rem;margin:1.6rem 0 0;padding:0;list-style:none;font-size:.88rem}
[data-vibeui-block="language-001"] [data-part="scale-legend"] li{display:grid;grid-template-columns:2.6rem 1fr;gap:.6rem;align-items:baseline;color:var(--vibeui-language-001-muted)}
[data-vibeui-block="language-001"] [data-part="scale-legend"] b{font-family:var(--vibeui-language-001-display);font-weight:700;color:var(--vibeui-language-001-fg)}
[data-vibeui-block="language-001"] [data-part="scale-legend"] li[data-hit="true"] b{color:var(--vibeui-language-001-accent)}
[data-vibeui-block="language-001"] [data-part="sheet"]{position:relative;width:min(100%,34rem);margin:0 auto;padding:1.6rem 1.6rem 1.8rem 3.2rem;border-radius:.4rem 1.2rem 1.2rem .4rem;background:var(--vibeui-language-001-paper);background-image:linear-gradient(90deg,transparent 2.2rem,color-mix(in oklab,var(--vibeui-language-001-accent) 45%,transparent) 2.2rem,color-mix(in oklab,var(--vibeui-language-001-accent) 45%,transparent) calc(2.2rem + 1px),transparent calc(2.2rem + 1px)),repeating-linear-gradient(180deg,transparent 0 calc(1.75rem - 1px),var(--vibeui-language-001-rule) calc(1.75rem - 1px) 1.75rem);box-shadow:0 1px 0 var(--vibeui-language-001-line),0 30px 60px -30px color-mix(in oklab,var(--vibeui-language-001-fg) 45%,transparent);transform:rotate(-.6deg);min-height:24rem;display:grid;align-content:start}
[data-vibeui-block="language-001"] [data-part="progress"]{display:grid;grid-auto-flow:column;gap:.3rem;height:.4rem;margin:0 0 1.4rem;padding:0;list-style:none}
[data-vibeui-block="language-001"] [data-part="progress"] li{border-radius:999px;background:var(--vibeui-language-001-line);overflow:hidden}
[data-vibeui-block="language-001"] [data-part="progress"] li::after{content:"";display:block;height:100%;background:var(--vibeui-language-001-accent);transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="language-001"] [data-part="progress"] li[data-done="true"]::after{transform:scaleX(1)}
[data-vibeui-block="language-001"] [data-part="counter"]{margin:0 0 .5rem;font-size:.78rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-language-001-muted)}
[data-vibeui-block="language-001"] [data-part="card"]{animation:vibeui-language-001-page .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="language-001"] [data-part="prompt"]{margin:0;font-family:var(--vibeui-language-001-display);font-weight:700;font-size:clamp(1.3rem,2.6cqi,1.7rem);line-height:1.3;letter-spacing:-.01em}
[data-vibeui-block="language-001"] [data-part="prompt"] u{text-decoration:none;display:inline-block;min-width:3.5em;border-bottom:2px solid var(--vibeui-language-001-accent);margin:0 .1em;vertical-align:baseline;font-family:var(--vibeui-language-001-hand);font-weight:400;color:var(--vibeui-language-001-accent);text-align:center}
[data-vibeui-block="language-001"] [data-part="options"]{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.4rem 0 0;padding:0;list-style:none}
[data-vibeui-block="language-001"] [data-part="chip"]{display:inline-flex;align-items:center;padding:.7rem 1.1rem;border-radius:.9rem;border:1.5px solid var(--vibeui-language-001-line);background:var(--vibeui-language-001-bg);color:var(--vibeui-language-001-fg);font:inherit;font-weight:600;cursor:pointer;transition:transform .18s,border-color .2s,background .2s,color .2s}
[data-vibeui-block="language-001"] [data-part="chip"]:hover{transform:translateY(-2px) rotate(-1deg);border-color:var(--vibeui-language-001-fg)}
[data-vibeui-block="language-001"] [data-part="chip"][data-picked="true"]{background:var(--vibeui-language-001-accent);color:var(--vibeui-language-001-on-accent);border-color:transparent;transform:scale(1.04)}
[data-vibeui-block="language-001"] [data-part="chip"]:disabled{cursor:default}
[data-vibeui-block="language-001"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-language-001-accent);outline-offset:2px}
[data-vibeui-block="language-001"] [data-part="hint"]{margin:1.2rem 0 0;font-family:var(--vibeui-language-001-hand);font-size:1.1rem;color:var(--vibeui-language-001-muted)}
[data-vibeui-block="language-001"] [data-part="result"]{animation:vibeui-language-001-page .6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="language-001"] [data-part="result-title"]{margin:0;font-size:.78rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-language-001-muted)}
[data-vibeui-block="language-001"] [data-part="level"]{display:flex;align-items:baseline;gap:.6rem;margin:.3rem 0 0;font-family:var(--vibeui-language-001-display);font-weight:800;font-size:clamp(2.6rem,6cqi,4rem);line-height:1;letter-spacing:-.04em;color:var(--vibeui-language-001-accent)}
[data-vibeui-block="language-001"] [data-part="level"] small{font-size:1.1rem;font-weight:600;letter-spacing:0;color:var(--vibeui-language-001-fg)}
[data-vibeui-block="language-001"] [data-part="track"]{position:relative;margin:1.6rem 0 0;padding-top:2.2rem}
[data-vibeui-block="language-001"] [data-part="bar"]{position:relative;height:.6rem;border-radius:999px;background:var(--vibeui-language-001-line);overflow:hidden}
[data-vibeui-block="language-001"] [data-part="bar"]::after{content:"";position:absolute;inset:0;border-radius:999px;background:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-language-001-accent) 55%,var(--vibeui-language-001-bg)),var(--vibeui-language-001-accent));transform:scaleX(var(--vibeui-language-001-fill,0));transform-origin:left;transition:transform 1.1s cubic-bezier(.2,.8,.2,1) .2s}
[data-vibeui-block="language-001"] [data-part="runner"]{position:absolute;left:0;top:0;width:100%;transform:translateX(calc(var(--vibeui-language-001-x,0) * 1%));transition:transform 1.1s cubic-bezier(.2,.8,.2,1) .2s}
[data-vibeui-block="language-001"] [data-part="marker"]{position:absolute;left:0;top:0;transform:translateX(-50%);display:grid;justify-items:center;gap:.2rem}
[data-vibeui-block="language-001"] [data-part="marker"] b{padding:.25rem .55rem;border-radius:.5rem;background:var(--vibeui-language-001-accent);color:var(--vibeui-language-001-on-accent);font-family:var(--vibeui-language-001-display);font-size:.8rem;font-weight:700}
[data-vibeui-block="language-001"] [data-part="marker"] i{width:2px;height:.9rem;background:var(--vibeui-language-001-accent)}
[data-vibeui-block="language-001"] [data-part="ticks"]{display:flex;justify-content:space-between;margin:.5rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-language-001-display);font-size:.75rem;font-weight:700;color:var(--vibeui-language-001-muted)}
[data-vibeui-block="language-001"] [data-part="ticks"] li[data-hit="true"]{color:var(--vibeui-language-001-accent)}
[data-vibeui-block="language-001"] [data-part="can"]{margin:1.4rem 0 0;font-size:1rem}
[data-vibeui-block="language-001"] [data-part="group"]{margin:.8rem 0 0;padding:.9rem 1rem;border-radius:.9rem;background:var(--vibeui-language-001-bg);border:1px dashed color-mix(in oklab,var(--vibeui-language-001-accent) 60%,transparent);font-size:.95rem}
[data-vibeui-block="language-001"] [data-part="group"] b{font-family:var(--vibeui-language-001-hand);font-weight:400;font-size:1.2rem;color:var(--vibeui-language-001-accent);margin-right:.3rem}
[data-vibeui-block="language-001"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.4rem 0 0}
[data-vibeui-block="language-001"] [data-part="action"]{display:inline-flex;align-items:center;padding:.8rem 1.2rem;border-radius:.9rem;background:var(--vibeui-language-001-accent);color:var(--vibeui-language-001-on-accent);font-weight:600;text-decoration:none;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="language-001"] [data-part="action"]:hover{transform:translateY(-2px);box-shadow:0 12px 26px -12px var(--vibeui-language-001-accent)}
[data-vibeui-block="language-001"] [data-part="retry"]{display:inline-flex;align-items:center;padding:.8rem 1.2rem;border-radius:.9rem;border:1.5px solid var(--vibeui-language-001-line);background:transparent;color:var(--vibeui-language-001-fg);font:inherit;font-weight:600;cursor:pointer;transition:border-color .2s}
[data-vibeui-block="language-001"] [data-part="retry"]:hover{border-color:var(--vibeui-language-001-fg)}
[data-vibeui-block="language-001"] [data-part="action"]:focus-visible,[data-vibeui-block="language-001"] [data-part="retry"]:focus-visible{outline:2px solid var(--vibeui-language-001-accent);outline-offset:2px}
@keyframes vibeui-language-001-page{from{opacity:0;transform:translateX(1.2rem) rotateY(-8deg)}to{opacity:1;transform:none}}
@container (min-width: 60rem){[data-vibeui-block="language-001"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:4rem}[data-vibeui-block="language-001"] [data-part="sheet"]{margin:0 0 0 auto}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="language-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_QUESTIONS: Language001Question[] = [
  { prompt: "I ___ from Saint Petersburg.", options: ["am", "is", "are"], answer: 0 },
  { prompt: "She ___ to the office every day.", options: ["go", "goes", "going"], answer: 1 },
  { prompt: "We have lived here ___ 2019.", options: ["for", "since", "from"], answer: 1 },
  { prompt: "If I ___ you, I would take the job.", options: ["was", "were", "am"], answer: 1 },
  { prompt: "By Friday the report ___ finished.", options: ["will have been", "will be have", "has been will"], answer: 0 },
]

const DEFAULT_LEVELS: Language001Level[] = [
  { code: "A1", label: "Beginner", can: "Представиться, заказать кофе и спросить дорогу — медленно, но вас поймут.", group: "A1 · «с нуля», вторник и четверг 19:30, старт 5 октября" },
  { code: "A2", label: "Elementary", can: "Рассказать о себе и работе, понять простой текст, договориться о встрече.", group: "A2 · «разговорный старт», понедельник и среда 20:00, старт 28 сентября" },
  { code: "B1", label: "Intermediate", can: "Поддержать разговор на любую бытовую тему, смотреть сериал с субтитрами.", group: "B1 · «уверенный разговор», вторник и четверг 20:30, старт 5 октября" },
  { code: "B2", label: "Upper-Intermediate", can: "Спорить, шутить, вести переговоры и читать книги в оригинале.", group: "B2 · «свободно», понедельник и среда 19:00, старт 12 октября" },
  { code: "C1", label: "Advanced", can: "Понимать акценты, тонкий юмор и писать так, что редактор не отличит от носителя.", group: "C1 · «как носитель», суббота 12:00, старт 10 октября" },
]

/** Тест уровня на тетрадном листе: чипы, прогресс, шкала A1–C1. */
export function Language001({
  eyebrow = "две минуты, честно",
  title = "Узнайте свой уровень до первого урока",
  lede = "Пять вопросов по грамматике — и мы покажем уровень на шкале и группу, в которой вам будет не скучно и не страшно.",
  questions = DEFAULT_QUESTIONS,
  levels = DEFAULT_LEVELS,
  resultTitle = "Ваш уровень",
  actionLabel = "Записаться в эту группу",
  actionHref = "#schedule",
  retryLabel = "Пройти ещё раз",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Language001Props) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [round, setRound] = useState(0)
  const [ready, setReady] = useState(false)

  const total = questions.length
  const levelIndex = total > 0 ? Math.min(levels.length - 1, Math.round((score / total) * (levels.length - 1))) : 0
  const level = levels[levelIndex]

  useEffect(() => {
    if (picked === null) return
    const question = questions[index]
    const correct = question && picked === question.answer
    const timer = setTimeout(() => {
      const nextScore = score + (correct ? 1 : 0)
      setScore(nextScore)
      setPicked(null)
      if (index + 1 < total) {
        setIndex(index + 1)
      } else {
        setDone(true)
      }
    }, 520)
    return () => clearTimeout(timer)
  }, [picked, index, score, total, questions])

  useEffect(() => {
    if (!done || !level) return
    window.dispatchEvent(new CustomEvent("vibeui-language:level", { detail: { level: level.code } }))
    // Маркер стартует с нуля и доезжает до уровня — иначе transition не сыграет.
    const timer = setTimeout(() => setReady(true), 60)
    return () => clearTimeout(timer)
  }, [done, level])

  const restart = () => {
    setIndex(0)
    setPicked(null)
    setScore(0)
    setDone(false)
    setReady(false)
    setRound((value) => value + 1)
  }

  const palette = {
    ...(accent ? { "--vibeui-language-001-accent": accent } : null),
    ...(ink ? { "--vibeui-language-001-fg": ink } : null),
    ...(background ? { "--vibeui-language-001-bg": background } : null),
    ...style,
  } as CSSProperties

  const question = questions[index]
  const promptParts = question ? question.prompt.split("___") : []
  const position = levels.length > 1 ? (levelIndex / (levels.length - 1)) * 100 : 0

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-language-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="language-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <ul data-part="scale-legend">
              {levels.map((item, itemIndex) => (
                <li key={item.code} data-hit={done && itemIndex === levelIndex ? "true" : undefined}>
                  <b>{item.code}</b>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-part="sheet" aria-live="polite">
            {!done && question ? (
              <div data-part="card" key={`${round}-${index}`}>
                <ul data-part="progress" aria-hidden="true">
                  {questions.map((item, itemIndex) => (
                    <li key={itemIndex} data-done={itemIndex < index || (itemIndex === index && picked !== null) ? "true" : undefined} />
                  ))}
                </ul>
                <p data-part="counter">
                  Вопрос {index + 1} из {total}
                </p>
                <p data-part="prompt">
                  {promptParts.map((part, partIndex) => (
                    <span key={partIndex}>
                      {part}
                      {partIndex < promptParts.length - 1 ? <u>{picked !== null ? question.options[picked] : " "}</u> : null}
                    </span>
                  ))}
                </p>
                <ul data-part="options">
                  {question.options.map((option, optionIndex) => (
                    <li key={option}>
                      <button data-part="chip" type="button" data-picked={picked === optionIndex ? "true" : undefined} disabled={picked !== null} onClick={() => setPicked(optionIndex)}>
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
                <p data-part="hint">не думайте долго — первая мысль обычно верная</p>
              </div>
            ) : level ? (
              <div data-part="result">
                <p data-part="result-title">{resultTitle}</p>
                <p data-part="level">
                  {level.code}
                  <small>{level.label}</small>
                </p>
                <div data-part="track" style={{ ["--vibeui-language-001-fill" as string]: ready ? position / 100 : 0, ["--vibeui-language-001-x" as string]: ready ? position : 0 }}>
                  <div data-part="runner" aria-hidden="true">
                    <div data-part="marker">
                      <b>{level.code}</b>
                      <i />
                    </div>
                  </div>
                  <div data-part="bar" />
                  <ul data-part="ticks" aria-hidden="true">
                    {levels.map((item, itemIndex) => (
                      <li key={item.code} data-hit={itemIndex <= levelIndex ? "true" : undefined}>
                        {item.code}
                      </li>
                    ))}
                  </ul>
                </div>
                <p data-part="can">{level.can}</p>
                <p data-part="group">
                  <b>вам подойдёт группа</b>
                  {level.group}
                </p>
                <div data-part="actions">
                  {actionLabel ? (
                    <a data-part="action" href={actionHref}>
                      {actionLabel}
                    </a>
                  ) : null}
                  <button data-part="retry" type="button" onClick={restart}>
                    {retryLabel}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}

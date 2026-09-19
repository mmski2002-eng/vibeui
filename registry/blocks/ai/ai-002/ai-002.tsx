"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"

export type Ai002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  inputLabel?: string
  /** Расшифровка по умолчанию в поле. */
  sample?: string
  runLabel?: string
  runningLabel?: string
  resetLabel?: string
  copyLabel?: string
  copiedLabel?: string
  outputLabel?: string
  placeholder?: string
  /** Что «сгенерируется»: строки с «# » — заголовки секций. */
  result?: readonly string[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Песочница AI-продукта: слева поле с расшифровкой (можно править), кнопка
// «Сделать сводку» переходит в состояние «думает» с бегущей полосой, потом
// справа ответ печатается по токенам с курсором — секции решений, задач и
// рисков. Внизу «скопировать» (Clipboard API) и «заново». Ответ — заданный
// пропсом текст: витрина поведения, подключить API — заменить один вызов.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="ai-002"]){
--vibeui-ai-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-ai-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-ai-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-ai-002-on-accent:oklch(from var(--vibeui-ai-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-ai-002-muted:color-mix(in oklab,var(--vibeui-ai-002-fg) 60%,var(--vibeui-ai-002-bg));
--vibeui-ai-002-line:color-mix(in oklab,var(--vibeui-ai-002-fg) 14%,transparent);
--vibeui-ai-002-glass:color-mix(in oklab,var(--vibeui-ai-002-fg) 6%,transparent);
--vibeui-ai-002-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-ai-002-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-ai-002-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-002"]{color-scheme:dark}
:where([data-vibeui-block="ai-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="ai-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="ai-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-ai-002-bg);color:var(--vibeui-ai-002-fg);font-family:var(--vibeui-ai-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="ai-002"] *{box-sizing:border-box}
[data-vibeui-block="ai-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="ai-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-ai-002-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-ai-002-accent)}
[data-vibeui-block="ai-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-ai-002-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="ai-002"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-ai-002-muted)}
[data-vibeui-block="ai-002"] [data-part="box"]{display:grid;gap:1rem;margin-top:2.5rem;padding:1rem;border-radius:1.4rem;background:var(--vibeui-ai-002-glass);border:1px solid var(--vibeui-ai-002-line);backdrop-filter:blur(12px);box-shadow:0 1px 0 rgb(255 255 255 / .1) inset}
[data-vibeui-block="ai-002"] [data-part="pane"]{display:grid;grid-template-rows:auto 1fr auto;gap:.7rem;border-radius:1rem;background:color-mix(in oklab,var(--vibeui-ai-002-bg) 70%,transparent);border:1px solid var(--vibeui-ai-002-line);padding:1rem;min-height:20rem}
[data-vibeui-block="ai-002"] [data-part="label"]{display:flex;align-items:center;gap:.5rem;font-family:var(--vibeui-ai-002-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-ai-002-muted)}
[data-vibeui-block="ai-002"] [data-part="label"] i{width:.4rem;height:.4rem;border-radius:50%;background:var(--vibeui-ai-002-accent)}
[data-vibeui-block="ai-002"] textarea{width:100%;min-height:13rem;resize:vertical;font:inherit;font-size:.9rem;line-height:1.5;color:inherit;background:transparent;border:0;outline:0;padding:0}
[data-vibeui-block="ai-002"] [data-part="row"]{display:flex;gap:.5rem;flex-wrap:wrap;align-items:center}
[data-vibeui-block="ai-002"] [data-part="run"]{position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.2rem;border:0;border-radius:.8rem;background:var(--vibeui-ai-002-accent);color:var(--vibeui-ai-002-on-accent);font:inherit;font-weight:600;cursor:pointer;transition:filter .2s,transform .18s}
[data-vibeui-block="ai-002"] [data-part="run"]:hover{filter:brightness(1.06);transform:translateY(-1px)}
[data-vibeui-block="ai-002"] [data-part="run"]:disabled{cursor:progress;transform:none}
[data-vibeui-block="ai-002"] [data-part="run"][data-busy="true"]::after{content:"";position:absolute;left:-40%;top:0;bottom:0;width:40%;background:linear-gradient(90deg,transparent,rgb(255 255 255 / .45),transparent);animation:vibeui-ai-002-sheen 1s linear infinite}
[data-vibeui-block="ai-002"] [data-part="ghost"]{display:inline-flex;align-items:center;padding:.7rem 1rem;border-radius:.8rem;border:1px solid var(--vibeui-ai-002-line);background:none;color:inherit;font:inherit;font-weight:500;font-size:.9rem;cursor:pointer;transition:background .2s}
[data-vibeui-block="ai-002"] [data-part="ghost"]:hover{background:var(--vibeui-ai-002-line)}
[data-vibeui-block="ai-002"] [data-part="ghost"][data-done="true"]{border-color:var(--vibeui-ai-002-accent);color:var(--vibeui-ai-002-accent)}
[data-vibeui-block="ai-002"] [data-part="out"]{margin:0;white-space:pre-wrap;word-break:break-word;font-size:.92rem;line-height:1.6;min-height:13rem}
[data-vibeui-block="ai-002"] [data-part="out"] b{display:block;margin-top:.7rem;font-family:var(--vibeui-ai-002-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-ai-002-accent)}
[data-vibeui-block="ai-002"] [data-part="out"] b:first-child{margin-top:0}
[data-vibeui-block="ai-002"] [data-part="out"] i{display:inline-block;width:.5em;height:1em;vertical-align:text-bottom;background:var(--vibeui-ai-002-accent);animation:vibeui-ai-002-cursor 1s steps(1) infinite}
[data-vibeui-block="ai-002"] [data-part="empty"]{margin:0;color:var(--vibeui-ai-002-muted);font-size:.9rem;align-self:center;text-align:center}
[data-vibeui-block="ai-002"] [data-part="stats"]{font-family:var(--vibeui-ai-002-mono);font-size:.7rem;color:var(--vibeui-ai-002-muted)}
[data-vibeui-block="ai-002"] button:focus-visible,[data-vibeui-block="ai-002"] textarea:focus-visible{outline:2px solid var(--vibeui-ai-002-accent);outline-offset:2px}
@keyframes vibeui-ai-002-sheen{to{left:100%}}
@keyframes vibeui-ai-002-cursor{50%{opacity:0}}
@container (min-width: 56rem){[data-vibeui-block="ai-002"] [data-part="box"]{grid-template-columns:1fr 1fr}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_SAMPLE = `Лена: Давайте релиз перенесём на четверг, тесты не успевают.
Марк: Ок, но тогда я беру на себя миграцию базы до среды.
Оля: Мне нужны от дизайна финальные иконки к вторнику, иначе всё сдвинется.
Лена: Риск — у платёжного провайдера окно обслуживания в среду ночью.
Марк: Тогда деплой в четверг утром, после окна.`

const DEFAULT_RESULT = ["# Решения", "Релиз переносится на четверг; деплой — четверг утром, после окна провайдера.", "# Задачи", "Марк — миграция базы до среды.", "Дизайн — финальные иконки Оле до вторника.", "# Риски", "Окно обслуживания платёжного провайдера в среду ночью — проверить статус в четверг в 9:00."]

/** Песочница: вставьте расшифровку — сводка печатается по токенам. */
export function Ai002({
  eyebrow = "Песочница",
  title = "Попробуйте на своём созвоне",
  lede = "Вставьте кусок расшифровки — любой. Ответ ниже сгенерирован заранее: это витрина поведения, а не модель.",
  inputLabel = "расшифровка",
  sample = DEFAULT_SAMPLE,
  runLabel = "Сделать сводку",
  runningLabel = "Думаю…",
  resetLabel = "Заново",
  copyLabel = "Скопировать",
  copiedLabel = "Скопировано",
  outputLabel = "сводка",
  placeholder = "Вставьте расшифровку встречи…",
  result = DEFAULT_RESULT,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Ai002Props) {
  const [text, setText] = useState(sample)
  const [phase, setPhase] = useState<"idle" | "busy" | "typing" | "done">("idle")
  const [count, setCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const tokens = result.flatMap((line) => (line.startsWith("# ") ? [line] : line.split(" ").map((word, index, all) => (index < all.length - 1 ? `${word} ` : `${word}\n`))))

  useEffect(() => {
    if (phase === "busy") {
      const timer = window.setTimeout(() => setPhase("typing"), 1400)
      return () => window.clearTimeout(timer)
    }
    if (phase !== "typing") return
    let i = 0
    let timer = 0
    const step = () => {
      i += 1
      setCount(i)
      if (i >= tokens.length) {
        setPhase("done")
        return
      }
      timer = window.setTimeout(step, tokens[i - 1].startsWith("# ") ? 380 : 40 + Math.random() * 60)
    }
    timer = window.setTimeout(step, 200)
    return () => window.clearTimeout(timer)
  }, [phase, tokens])

  const run = () => {
    setCount(0)
    setCopied(false)
    setPhase("busy")
  }
  const reset = () => {
    setCount(0)
    setCopied(false)
    setPhase("idle")
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.map((line) => line.replace(/^# /, "")).join("\n"))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* буфер недоступен */
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-ai-002-accent": accent } : null),
    ...(ink ? { "--vibeui-ai-002-fg": ink } : null),
    ...(background ? { "--vibeui-ai-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-ai-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="ai-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="box">
            <div data-part="pane">
              <p data-part="label">
                <i aria-hidden="true" />
                {inputLabel}
              </p>
              <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={placeholder} aria-label={inputLabel} />
              <div data-part="row">
                <button type="button" data-part="run" data-busy={phase === "busy"} disabled={phase === "busy" || phase === "typing"} onClick={run}>
                  {phase === "busy" || phase === "typing" ? runningLabel : runLabel}
                </button>
                <span data-part="stats">
                  {text.split(/\s+/).filter(Boolean).length} слов
                </span>
              </div>
            </div>
            <div data-part="pane">
              <p data-part="label">
                <i aria-hidden="true" />
                {outputLabel}
              </p>
              {phase === "idle" ? (
                <p data-part="empty">Нажмите «{runLabel}» — сводка появится здесь.</p>
              ) : (
                <pre data-part="out" aria-live="polite">
                  {tokens.slice(0, count).map((token, index) => (token.startsWith("# ") ? <b key={index}>{token.slice(2)}</b> : <span key={index}>{token}</span>))}
                  {phase !== "done" ? <i aria-hidden="true" /> : null}
                </pre>
              )}
              <div data-part="row">
                <button type="button" data-part="ghost" data-done={copied} disabled={phase !== "done"} onClick={copy}>
                  {copied ? copiedLabel : copyLabel}
                </button>
                {phase !== "idle" ? (
                  <button type="button" data-part="ghost" onClick={reset}>
                    {resetLabel}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

"use client"

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"
import { Button015 } from "@/registry/components/button/button-015/button-015"

export type Hero042Sample = {
  /** Подпись вкладки: «curl», «JS». */
  label: string
  /** Строки примера запроса. */
  code: readonly string[]
}

export type Hero042Stat = {
  value: string
  label: string
}

export type Hero042Props = {
  eyebrow?: string
  /** Слово в *звёздочках* подсвечивается акцентом. */
  title?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  stats?: readonly Hero042Stat[]
  /** Примеры запроса по языкам; переключаются вкладками и перепечатываются. */
  samples?: readonly Hero042Sample[]
  /** Строки JSON-ответа, приходят построчно после печати запроса. */
  response?: readonly string[]
  /** Подпись статуса ответа: «200 OK». */
  statusLabel?: string
  /** Задержка ответа в мс, бейдж рядом со статусом. */
  latency?: number
  /** aria вкладок, кнопка копирования, aria кода и ожидания. */
  tabsLabel?: string
  copyLabel?: string
  copiedLabel?: string
  codeLabel?: string
  waitLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро API-сервиса: слева заголовок, справа окно терминала. Запрос
// печатается по символам с подсветкой (строки, флаги, ключевые слова),
// когда допечатан — снизу построчно «приходит» JSON-ответ с подсветкой
// ключей и чисел и бейдж «200 OK · 42 ms». Вкладки curl / JS / Python / Go
// перепечатывают пример заново; кнопка копирует текущий код. Фон — сетка
// точек, растворяющаяся к краям.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-042"]){
--vibeui-hero-042-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-042-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-042-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-042-on-accent:oklch(from var(--vibeui-hero-042-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-042-muted:color-mix(in oklab,var(--vibeui-hero-042-fg) 60%,var(--vibeui-hero-042-bg));
--vibeui-hero-042-line:color-mix(in oklab,var(--vibeui-hero-042-fg) 12%,transparent);
--vibeui-hero-042-panel:color-mix(in oklab,var(--vibeui-hero-042-fg) 4%,var(--vibeui-hero-042-bg));
--vibeui-hero-042-string:color-mix(in oklab,var(--vibeui-hero-042-accent) 80%,var(--vibeui-hero-042-fg));
--vibeui-hero-042-key:color-mix(in oklab,var(--vibeui-hero-042-fg) 85%,var(--vibeui-hero-042-accent));
--vibeui-hero-042-number:color-mix(in oklab,var(--vibeui-hero-042-accent) 60%,#ffb454);
--vibeui-hero-042-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-042-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-042"]{color-scheme:dark}
:where([data-vibeui-block="hero-042"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-042"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-042"]{box-sizing:border-box;position:relative;overflow:hidden;background:var(--vibeui-hero-042-bg);color:var(--vibeui-hero-042-fg);font-family:var(--vibeui-hero-042-display);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-042"]::before{content:"";position:absolute;inset:0;background-image:radial-gradient(color-mix(in oklab,var(--vibeui-hero-042-fg) 16%,transparent) 1px,transparent 1.5px);background-size:24px 24px;mask-image:radial-gradient(ellipse 70% 80% at 60% 40%,#000 20%,transparent 75%);pointer-events:none}
[data-vibeui-block="hero-042"] *{box-sizing:border-box}
[data-vibeui-block="hero-042"] [data-part="code"]{margin:0}
[data-vibeui-block="hero-042"] [data-part="copy-button"]{margin-left:auto}
[data-vibeui-block="hero-042"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:4rem 1.25rem 4.5rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="hero-042"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;margin:0 0 1.2rem;padding:.35rem .7rem;border:1px solid var(--vibeui-hero-042-line);border-radius:999px;font-family:var(--vibeui-hero-042-mono);font-size:.72rem;letter-spacing:.04em;color:var(--vibeui-hero-042-muted)}
[data-vibeui-block="hero-042"] [data-part="eyebrow"]::before{content:"";width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-hero-042-accent);box-shadow:0 0 8px var(--vibeui-hero-042-accent)}
[data-vibeui-block="hero-042"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2.6rem,6.4cqi,5rem);line-height:.98;letter-spacing:-.045em;text-wrap:balance}
[data-vibeui-block="hero-042"] [data-part="title"] em{font-style:normal;color:var(--vibeui-hero-042-accent)}
[data-vibeui-block="hero-042"] [data-part="lede"]{margin:1.3rem 0 0;max-width:32rem;font-size:1.08rem;color:var(--vibeui-hero-042-muted)}
[data-vibeui-block="hero-042"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.7rem;margin:1.8rem 0 0}
[data-vibeui-block="hero-042"] button:focus-visible{outline:2px solid var(--vibeui-hero-042-accent);outline-offset:2px}
[data-vibeui-block="hero-042"] [data-part="stats"]{display:flex;flex-wrap:wrap;gap:.5rem 1.8rem;margin:2.2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="hero-042"] [data-part="stats"] li{display:grid;gap:.1rem}
[data-vibeui-block="hero-042"] [data-part="stats"] b{font-family:var(--vibeui-hero-042-mono);font-weight:600;font-size:1.05rem;letter-spacing:-.02em}
[data-vibeui-block="hero-042"] [data-part="stats"] span{font-size:.78rem;color:var(--vibeui-hero-042-muted)}
[data-vibeui-block="hero-042"] [data-part="terminal"]{position:relative;border:1px solid var(--vibeui-hero-042-line);border-radius:1rem;background:var(--vibeui-hero-042-panel);font-family:var(--vibeui-hero-042-mono);font-size:.8rem;line-height:1.6;box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-hero-042-accent) 8%,transparent),0 40px 80px -50px color-mix(in oklab,var(--vibeui-hero-042-accent) 35%,transparent)}
[data-vibeui-block="hero-042"] [data-part="bar"]{display:flex;align-items:center;gap:.5rem;padding:.6rem .8rem;border-bottom:1px solid var(--vibeui-hero-042-line)}
[data-vibeui-block="hero-042"] [data-part="dots"]{display:flex;gap:.35rem;margin-right:.3rem}
[data-vibeui-block="hero-042"] [data-part="dots"] i{width:.6rem;height:.6rem;border-radius:50%;background:var(--vibeui-hero-042-line)}
[data-vibeui-block="hero-042"] [data-part="tabs"]{display:flex;gap:.2rem;overflow-x:auto;scrollbar-width:none}
[data-vibeui-block="hero-042"] [data-part="tabs"] button{padding:.3rem .65rem;border:0;border-radius:.4rem;background:transparent;color:var(--vibeui-hero-042-muted);font:inherit;font-size:.74rem;cursor:pointer;white-space:nowrap;transition:background .2s,color .2s}
[data-vibeui-block="hero-042"] [data-part="tabs"] button:hover{color:var(--vibeui-hero-042-fg)}
[data-vibeui-block="hero-042"] [data-part="tabs"] button[aria-selected="true"]{background:color-mix(in oklab,var(--vibeui-hero-042-accent) 16%,transparent);color:var(--vibeui-hero-042-accent)}
[data-vibeui-block="hero-042"] [data-part="code"]{margin:0;padding:1rem 1.1rem;min-height:9.5rem;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--vibeui-hero-042-fg)}
[data-vibeui-block="hero-042"] [data-part="code"] [data-t="s"]{color:var(--vibeui-hero-042-string)}
[data-vibeui-block="hero-042"] [data-part="code"] [data-t="k"]{color:var(--vibeui-hero-042-accent);font-weight:600}
[data-vibeui-block="hero-042"] [data-part="code"] [data-t="f"]{color:var(--vibeui-hero-042-number)}
[data-vibeui-block="hero-042"] [data-part="code"] [data-t="c"]{color:var(--vibeui-hero-042-muted)}
[data-vibeui-block="hero-042"] [data-part="cursor"]{display:inline-block;width:.55em;height:1.1em;margin-left:1px;vertical-align:-.2em;background:var(--vibeui-hero-042-accent);animation:vibeui-hero-042-blink 1s steps(2,start) infinite}
[data-vibeui-block="hero-042"] [data-part="output"]{border-top:1px dashed var(--vibeui-hero-042-line);padding:.8rem 1.1rem 1rem;min-height:16rem}
[data-vibeui-block="hero-042"] [data-part="status"]{display:flex;align-items:center;gap:.6rem;margin:0 0 .5rem;font-size:.72rem;color:var(--vibeui-hero-042-muted);opacity:0;animation:vibeui-hero-042-in .4s ease-out forwards}
[data-vibeui-block="hero-042"] [data-part="status"] b{font-weight:600;color:var(--vibeui-hero-042-accent)}
[data-vibeui-block="hero-042"] [data-part="latency"]{padding:.1rem .45rem;border-radius:.3rem;background:color-mix(in oklab,var(--vibeui-hero-042-accent) 16%,transparent);color:var(--vibeui-hero-042-accent);font-weight:600}
[data-vibeui-block="hero-042"] [data-part="json"]{margin:0;white-space:pre;overflow-x:auto;color:var(--vibeui-hero-042-muted)}
[data-vibeui-block="hero-042"] [data-part="json"] [data-part="jline"]{display:block;opacity:0;transform:translateX(-6px);animation:vibeui-hero-042-line .35s ease-out forwards}
[data-vibeui-block="hero-042"] [data-part="json"] [data-t="k"]{color:var(--vibeui-hero-042-key)}
[data-vibeui-block="hero-042"] [data-part="json"] [data-t="s"]{color:var(--vibeui-hero-042-string)}
[data-vibeui-block="hero-042"] [data-part="json"] [data-t="n"]{color:var(--vibeui-hero-042-number)}
[data-vibeui-block="hero-042"] [data-part="json"] [data-t="b"]{color:var(--vibeui-hero-042-accent)}
[data-vibeui-block="hero-042"] [data-part="wait"]{display:flex;gap:.3rem;padding:.3rem 0;color:var(--vibeui-hero-042-muted);font-size:.72rem}
[data-vibeui-block="hero-042"] [data-part="wait"] i{width:.35rem;height:.35rem;border-radius:50%;background:currentColor;animation:vibeui-hero-042-dot 1s ease-in-out infinite}
[data-vibeui-block="hero-042"] [data-part="wait"] i:nth-child(2){animation-delay:.15s}
[data-vibeui-block="hero-042"] [data-part="wait"] i:nth-child(3){animation-delay:.3s}
@keyframes vibeui-hero-042-blink{to{visibility:hidden}}
@keyframes vibeui-hero-042-in{to{opacity:1}}
@keyframes vibeui-hero-042-line{to{opacity:1;transform:none}}
@keyframes vibeui-hero-042-dot{0%,100%{opacity:.3}50%{opacity:1}}
@container (min-width: 60rem){[data-vibeui-block="hero-042"] [data-part="shell"]{padding:5rem 1.25rem 6rem;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:3.5rem}[data-vibeui-block="hero-042"] [data-part="terminal"]{font-size:.84rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-042"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-042"] [data-part="json"] [data-part="jline"],[data-vibeui-block="hero-042"] [data-part="status"]{opacity:1;transform:none}}`

const DEFAULT_SAMPLES: Hero042Sample[] = [
  { label: "curl", code: ["curl https://api.geokod.ru/v2/geocode \\", "  -H \"Authorization: Bearer gk_live_7f3a…\" \\", "  -G --data-urlencode \"q=Москва, Тверская, 7\""] },
  { label: "JS", code: ["const res = await fetch(", "  \"https://api.geokod.ru/v2/geocode?q=Москва, Тверская, 7\",", "  { headers: { Authorization: \"Bearer gk_live_7f3a…\" } }", ")", "const { results } = await res.json()"] },
  { label: "Python", code: ["import requests", "", "r = requests.get(", "  \"https://api.geokod.ru/v2/geocode\",", "  params={\"q\": \"Москва, Тверская, 7\"},", "  headers={\"Authorization\": \"Bearer gk_live_7f3a…\"},", ")", "print(r.json()[\"results\"][0])"] },
  { label: "Go", code: ["req, _ := http.NewRequest(\"GET\",", "  \"https://api.geokod.ru/v2/geocode?q=Москва, Тверская, 7\", nil)", "req.Header.Set(\"Authorization\", \"Bearer gk_live_7f3a…\")", "res, err := http.DefaultClient.Do(req)"] },
]

const DEFAULT_RESPONSE = [
  "{",
  "  \"query\": \"Москва, Тверская, 7\",",
  "  \"results\": [{",
  "    \"lat\": 55.759853,",
  "    \"lon\": 37.610127,",
  "    \"precision\": \"house\",",
  "    \"address\": {",
  "      \"city\": \"Москва\",",
  "      \"street\": \"Тверская улица\",",
  "      \"house\": \"7\",",
  "      \"postal_code\": \"125009\"",
  "    }",
  "  }],",
  "  \"cached\": false,",
  "  \"took_ms\": 42",
  "}",
]

const CODE_TOKEN = /("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(#[^\n]*|\/\/[^\n]*)|(\b(?:const|await|import|from|fetch|def|return|package|var|print|nil|err|requests|http|json)\b)|(\s-{1,2}[a-zA-Z-]+|\bcurl\b)/g
const JSON_TOKEN = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|(\b(?:true|false|null)\b)/g

function highlightCode(line: string) {
  const parts: ReactNode[] = []
  let last = 0
  for (const match of line.matchAll(CODE_TOKEN)) {
    const index = match.index ?? 0
    if (index > last) parts.push(line.slice(last, index))
    const type = match[1] ? "s" : match[2] ? "c" : match[3] ? "k" : "f"
    parts.push(
      <span key={index} data-t={type}>
        {match[0]}
      </span>,
    )
    last = index + match[0].length
  }
  if (last < line.length) parts.push(line.slice(last))
  return parts
}

function highlightJson(line: string) {
  const parts: ReactNode[] = []
  let last = 0
  for (const match of line.matchAll(JSON_TOKEN)) {
    const index = match.index ?? 0
    if (index > last) parts.push(line.slice(last, index))
    if (match[1]) {
      parts.push(
        <span key={index} data-t={match[2] ? "k" : "s"}>
          {match[1]}
        </span>,
      )
      if (match[2]) parts.push(match[2])
    } else {
      parts.push(
        <span key={index} data-t={match[3] ? "n" : "b"}>
          {match[0]}
        </span>,
      )
    }
    last = index + match[0].length
  }
  if (last < line.length) parts.push(line.slice(last))
  return parts
}

function renderTitle(title: string) {
  return title.split(/(\*[^*]+\*)/).map((chunk, index) => (chunk.startsWith("*") && chunk.endsWith("*") ? <em key={index}>{chunk.slice(1, -1)}</em> : chunk))
}

/** Хиро API: запрос печатается, JSON-ответ приходит построчно. */
export function Hero042({
  eyebrow = "geocoding api · v2.4",
  title = "Адрес → координаты *за 42 ms*",
  lede = "Геокодирование, обратный геокодинг, маршруты и подсказки адресов по России и СНГ. Один ключ, один запрос, ответ — JSON. Бесплатно до 10 000 запросов в месяц.",
  primaryLabel = "Получить ключ",
  primaryHref = "#key",
  secondaryLabel = "Открыть docs",
  secondaryHref = "#docs",
  stats = [
    { value: "99,99 %", label: "аптайм за год" },
    { value: "42 ms", label: "медиана ответа" },
    { value: "0 ₽", label: "до 10 000 запросов" },
  ],
  samples = DEFAULT_SAMPLES,
  response = DEFAULT_RESPONSE,
  statusLabel = "200 OK",
  latency = 42,
  tabsLabel = "Язык примера",
  copyLabel = "копировать",
  copiedLabel = "скопировано",
  codeLabel = "Пример запроса, {lang}",
  waitLabel = "Ожидание ответа",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero042Props) {
  const [active, setActive] = useState(0)
  const [typed, setTyped] = useState(0)
  const sample = samples[Math.min(active, samples.length - 1)]
  const full = useMemo(() => (sample ? sample.code.join("\n") : ""), [sample])
  const done = typed >= full.length
  // Ответ показываем с паузой после последнего символа — «сеть думает».
  const [arrived, setArrived] = useState(false)

  useEffect(() => {
    if (typed >= full.length) return
    const char = full[typed]
    const timer = setTimeout(() => setTyped((value) => value + 1), char === "\n" ? 140 : /\s/.test(char) ? 40 : 18)
    return () => clearTimeout(timer)
  }, [typed, full])

  useEffect(() => {
    if (!done) return
    const timer = setTimeout(() => setArrived(true), 500)
    return () => clearTimeout(timer)
  }, [done])

  const select = (index: number) => {
    setActive(index)
    setTyped(0)
    setArrived(false)
  }

  const shown = full.slice(0, typed).split("\n")

  const palette = {
    ...(accent ? { "--vibeui-hero-042-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-042-fg": ink } : null),
    ...(background ? { "--vibeui-hero-042-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-042" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-042" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="copy-block">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1 data-part="title">{renderTitle(title)}</h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              {primaryLabel ? (
                <Button016
                  data-part="primary"
                  size="lg"
                  label={primaryLabel}
                  href={primaryHref}
                  external={false}
                  tone="accent"
                  accent={accent}
                />
              ) : null}
              {secondaryLabel ? (
                <Button016
                  data-part="secondary"
                  size="lg"
                  label={secondaryLabel}
                  href={secondaryHref}
                  external={false}
                  tone="neutral"
                  accent={accent}
                />
              ) : null}
            </div>
            {stats.length > 0 ? (
              <ul data-part="stats">
                {stats.map((stat) => (
                  <li key={stat.label}>
                    <b>{stat.value}</b>
                    <span>{stat.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div data-part="terminal">
            <div data-part="bar">
              <span data-part="dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <div data-part="tabs" role="tablist" aria-label={tabsLabel}>
                {samples.map((item, index) => (
                  <button key={item.label} type="button" role="tab" aria-selected={index === active} onClick={() => select(index)}>
                    {item.label}
                  </button>
                ))}
              </div>
              <Button015 data-part="copy-button" value={full} label={copyLabel} doneLabel={copiedLabel} />
            </div>
            <pre data-part="code" aria-label={codeLabel.replace("{lang}", sample?.label ?? "")}>
              {shown.map((line, index) => (
                <span key={index}>
                  {highlightCode(line)}
                  {index < shown.length - 1 ? "\n" : null}
                </span>
              ))}
              {!done ? <span data-part="cursor" aria-hidden="true" /> : null}
            </pre>
            <div data-part="output" aria-live="polite">
              {arrived ? (
                <>
                  <p data-part="status">
                    <span aria-hidden="true">→</span>
                    <b>{statusLabel}</b>
                    <span data-part="latency">{latency} ms</span>
                    <span>application/json</span>
                  </p>
                  <pre data-part="json">
                    {response.map((line, index) => (
                      <span data-part="jline" key={index} style={{ animationDelay: `${index * 45}ms` }}>
                        {highlightJson(line)}
                      </span>
                    ))}
                  </pre>
                </>
              ) : done ? (
                <p data-part="wait" aria-label={waitLabel}>
                  <i />
                  <i />
                  <i />
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

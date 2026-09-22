"use client"

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"
import { Button015 } from "@/registry/components/button/button-015/button-015"

import { Button077 } from "@/registry/components/button/button-077/button-077"

export type Cta035Props = {
  eyebrow?: string
  title?: string
  lede?: string
  placeholder?: string
  actionLabel?: string
  /** Подписи под полем: «без карты», «10 000 бесплатно». */
  fine?: readonly string[]
  /** Префикс ключа, остальное генерируется. */
  keyPrefix?: string
  doneTitle?: string
  doneText?: string
  docsLabel?: string
  docsHref?: string
  /** aria поля, кнопка копирования, строка времени. */
  emailLabel?: string
  copyLabel?: string
  doneLabel?: string
  elapsedLine?: string
  decimalSeparator?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Финальный призыв «ключ за 30 секунд»: одно поле почты и кнопка на панели
// с сеткой точек и свечением акцента. После отправки поле сменяется строкой
// ключа, которая печатается по символам моноширинным, рядом прорисовывается
// галочка в кружке и появляется «скопировать» и «готово за 1,2 с — обещали
// 30». Форма ничего не отправляет наружу — заглушка, ключ вымышленный.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-035"]){
--vibeui-cta-035-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-cta-035-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-035-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-035-on-accent:oklch(from var(--vibeui-cta-035-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-035-muted:color-mix(in oklab,var(--vibeui-cta-035-fg) 60%,var(--vibeui-cta-035-bg));
--vibeui-cta-035-line:color-mix(in oklab,var(--vibeui-cta-035-fg) 12%,transparent);
--vibeui-cta-035-panel:color-mix(in oklab,var(--vibeui-cta-035-fg) 4%,var(--vibeui-cta-035-bg));
--vibeui-cta-035-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-035-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-035"]{color-scheme:dark}
:where([data-vibeui-block="cta-035"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-035"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-035"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-cta-035-bg);color:var(--vibeui-cta-035-fg);font-family:var(--vibeui-cta-035-display);font-size:1rem;line-height:1.5}
[data-vibeui-block="cta-035"] *{box-sizing:border-box}
[data-vibeui-block="cta-035"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="cta-035"] [data-part="frame"]{position:relative;overflow:hidden;isolation:isolate;padding:clamp(2.5rem,7cqi,5rem) clamp(1.25rem,5cqi,4rem);border:1px solid var(--vibeui-cta-035-line);border-radius:1.5rem;background-color:var(--vibeui-cta-035-panel);background-image:radial-gradient(color-mix(in oklab,var(--vibeui-cta-035-fg) 16%,transparent) 1px,transparent 1.5px);background-size:24px 24px;text-align:center}
[data-vibeui-block="cta-035"] [data-part="glow"]{position:absolute;z-index:-1;left:50%;top:-40%;width:70%;aspect-ratio:1;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-cta-035-accent) 28%,transparent),transparent);filter:blur(40px);animation:vibeui-cta-035-breathe 7s ease-in-out infinite alternate;pointer-events:none}
[data-vibeui-block="cta-035"] [data-part="ghost"]{position:absolute;z-index:-1;left:50%;bottom:-.15em;transform:translateX(-50%);margin:0;font-family:var(--vibeui-cta-035-mono);font-weight:600;font-size:clamp(3rem,12cqi,9rem);line-height:1;letter-spacing:-.04em;white-space:nowrap;color:transparent;-webkit-text-stroke:1px color-mix(in oklab,var(--vibeui-cta-035-fg) 12%,transparent);pointer-events:none;user-select:none}
[data-vibeui-block="cta-035"] [data-part="card"]{position:relative;max-width:40rem;margin:0 auto}
[data-vibeui-block="cta-035"] [data-part="eyebrow"]{margin:0 0 1rem;font-family:var(--vibeui-cta-035-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-cta-035-accent)}
[data-vibeui-block="cta-035"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2.2rem,5.6cqi,4rem);line-height:1;letter-spacing:-.045em;text-wrap:balance}
[data-vibeui-block="cta-035"] [data-part="lede"]{margin:1rem auto 0;max-width:30rem;color:var(--vibeui-cta-035-muted)}
[data-vibeui-block="cta-035"] [data-part="form"]{display:grid;gap:.6rem;margin:1.8rem auto 0;max-width:32rem}
[data-vibeui-block="cta-035"] [data-part="form"] > [data-vibeui-block="input-001"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="cta-035"] [data-part="form"] > [data-vibeui-block="button-001"]{align-self:center}
[data-vibeui-block="cta-035"] [data-part="fine"]{display:flex;flex-wrap:wrap;justify-content:center;gap:.4rem 1.2rem;margin:1rem 0 0;padding:0;list-style:none;font-size:.78rem;color:var(--vibeui-cta-035-muted)}
[data-vibeui-block="cta-035"] [data-part="fine"] li::before{content:"✓ ";color:var(--vibeui-cta-035-accent)}
[data-vibeui-block="cta-035"] [data-part="done"]{display:grid;justify-items:center;gap:1rem;margin:1.8rem auto 0;max-width:34rem}
[data-vibeui-block="cta-035"] [data-part="check"]{width:3.4rem;height:3.4rem;color:var(--vibeui-cta-035-accent)}
[data-vibeui-block="cta-035"] [data-part="check"] circle{stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-cta-035-draw .8s ease-out forwards}
[data-vibeui-block="cta-035"] [data-part="check"] path{stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-cta-035-draw .5s ease-out .5s forwards}
[data-vibeui-block="cta-035"] [data-part="key"]{display:flex;align-items:center;gap:.6rem;width:100%;min-height:3.2rem;padding:.6rem .6rem .6rem 1rem;border:1px solid color-mix(in oklab,var(--vibeui-cta-035-accent) 50%,transparent);border-radius:.7rem;background:var(--vibeui-cta-035-bg);font-family:var(--vibeui-cta-035-mono);font-size:.85rem;text-align:left;box-shadow:0 0 30px -12px var(--vibeui-cta-035-accent)}
[data-vibeui-block="cta-035"] [data-part="key"] code{flex:1;min-width:0;overflow-wrap:anywhere;color:var(--vibeui-cta-035-fg)}
[data-vibeui-block="cta-035"] [data-part="key"] code b{font-weight:600;color:var(--vibeui-cta-035-accent)}
[data-vibeui-block="cta-035"] [data-part="cursor"]{display:inline-block;width:.55em;height:1.05em;margin-left:1px;vertical-align:-.15em;background:var(--vibeui-cta-035-accent);animation:vibeui-cta-035-blink 1s steps(2,start) infinite}
[data-vibeui-block="cta-035"] [data-part="done"] h3{margin:0;font-size:1.4rem;font-weight:700;letter-spacing:-.02em}
[data-vibeui-block="cta-035"] [data-part="done"] p{margin:0;color:var(--vibeui-cta-035-muted)}
[data-vibeui-block="cta-035"] [data-part="elapsed"]{font-family:var(--vibeui-cta-035-mono);font-size:.76rem;color:var(--vibeui-cta-035-accent)}
@keyframes vibeui-cta-035-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-cta-035-blink{to{visibility:hidden}}
@keyframes vibeui-cta-035-breathe{from{transform:translateX(-50%) scale(1);opacity:.8}to{transform:translateX(-50%) scale(1.2);opacity:1}}
@container (min-width: 36rem){[data-vibeui-block="cta-035"] [data-part="form"]{grid-template-columns:1fr auto}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-035"] *{animation:none!important;transition:none!important}[data-vibeui-block="cta-035"] [data-part="check"] circle,[data-vibeui-block="cta-035"] [data-part="check"] path{stroke-dashoffset:0}}`

const ALPHABET = "abcdef0123456789"

/** Призыв «ключ за 30 секунд»: поле почты, ключ печатается по символам. */
export function Cta035({
  eyebrow = "GET /v2/key",
  title = "Ключ за 30 секунд",
  lede = "Почта — и ключ уже в ответе. Без карты, без звонка менеджера, без «мы свяжемся с вами». Десять тысяч запросов в месяц бесплатно.",
  placeholder = "you@company.ru",
  actionLabel = "Получить ключ",
  fine = ["Без карты", "10 000 запросов бесплатно", "Отозвать в один клик"],
  keyPrefix = "gk_live_",
  doneTitle = "Ключ готов",
  doneText = "Продублировали на почту. Первый запрос можно делать прямо сейчас — лимит обновится первого числа.",
  docsLabel = "Первый запрос в docs",
  docsHref = "#docs",
  copyLabel = "копировать",
  doneLabel = "готово",
  elapsedLine = "готово за {s} с — обещали 30",
  decimalSeparator = ",",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Cta035Props) {
  const [secret, setSecret] = useState<string | null>(null)
  const [typed, setTyped] = useState(0)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const startedAt = useRef(0)
  const ready = secret !== null && typed >= secret.length

  useEffect(() => {
    if (secret === null || typed >= secret.length) return
    const timer = setTimeout(() => setTyped((value) => value + 1), 45)
    return () => clearTimeout(timer)
  }, [secret, typed])

  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => setElapsed((Date.now() - startedAt.current) / 1000), 0)
    return () => clearTimeout(timer)
  }, [ready])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    startedAt.current = Date.now()
    setSecret(Array.from({ length: 24 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join(""))
    setTyped(0)
  }


  const palette = {
    ...(accent ? { "--vibeui-cta-035-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-035-fg": ink } : null),
    ...(background ? { "--vibeui-cta-035-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-035" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-035" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="frame">
            <i data-part="glow" aria-hidden="true" />
            <p data-part="ghost" aria-hidden="true">
              {keyPrefix}
            </p>
            <div data-part="card" aria-live="polite">
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{secret === null ? title : doneTitle}</h2>
              <p data-part="lede">{secret === null ? lede : doneText}</p>
              {secret === null ? (
                <>
                  <form data-part="form" onSubmit={submit}>
                    <Input001 type="email" name="email" required label={placeholder} autoComplete="email" accent={accent} />
                    <Button001 type="submit" size="lg" accent={accent}>
                      {actionLabel}
                    </Button001>
                  </form>
                  {fine.length > 0 ? (
                    <ul data-part="fine">
                      {fine.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                <div data-part="done">
                  <div data-part="key">
                    <code>
                      <b>{keyPrefix}</b>
                      {secret.slice(0, typed)}
                      {!ready ? <span data-part="cursor" aria-hidden="true" /> : null}
                    </code>
                    <Button015
                      data-part="copy-button"
                      value={keyPrefix + secret}
                      label={copyLabel}
                      doneLabel={doneLabel}
                      hold={1500}
                      disabled={!ready}
                    />
                  </div>
                  {ready ? (
                    <>
                      <svg data-part="check" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="32" cy="32" r="25" />
                        <path d="M21 33l8 8 14-16" />
                      </svg>
                      {elapsed !== null ? (
                        <span data-part="elapsed">
                          {elapsedLine.replace("{s}", elapsed.toFixed(1).replace(".", decimalSeparator))}
                        </span>
                      ) : null}
                      {docsLabel ? (
                        <Button077
                          data-part="docs"
                          label={docsLabel}
                          href={docsHref}
                          accent={accent}
                        />
                      ) : null}
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

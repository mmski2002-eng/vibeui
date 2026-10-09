"use client"

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
} from "react"

type Phase = "input" | "scatter" | "verify" | "orb" | "done" | "error"

export type SpecialInput001Props = Omit<
  ComponentProps<"section">,
  "children"
> & {
  length?: number
  /** Проверка кода. Без неё подходит любой полный код — режим демонстрации. */
  verify?: (code: string) => boolean | Promise<boolean>
  onVerified?: (code: string) => void
  onResend?: () => void
  title?: string
  lead?: string
  verifyingTitle?: string
  verifyingLead?: string
  doneTitle?: string
  doneLead?: string
  badge?: string
  errorTitle?: string
  errorLead?: string
  resendText?: string
  resendLabel?: string
  digitLabel?: string
  accent?: string
  background?: string
}

// Идея: ввод одноразового кода как маленькое представление. Когда введена
// последняя цифра, ячейки разлетаются и кружатся, затем собираются в кольцо
// с процентами проверки, кольцо сжимается в зелёную сферу, а та — в галочку
// с плашкой «Проверено». Неверный код встряхивает карточку и возвращает
// пустые ячейки. Анимация не ждёт сервер вслепую: проценты доходят до 100,
// только когда verify уже ответил.
const STYLES = `
:where([data-vibeui-block="special-input-001"]){
--vibeui-special-input-001-bg:light-dark(oklch(1 0 0),oklch(0.2 0.004 60));
--vibeui-special-input-001-cell:light-dark(oklch(1 0 0),oklch(0.25 0.004 60));
--vibeui-special-input-001-fg:light-dark(oklch(0.24 0.01 60),oklch(0.96 0.003 60));
--vibeui-special-input-001-muted:light-dark(oklch(0.56 0.01 60),oklch(0.7 0.005 60));
--vibeui-special-input-001-line:light-dark(oklch(0.88 0.006 60),oklch(0.35 0.006 60));
--vibeui-special-input-001-accent:oklch(0.6803 0.2144 39.8);
--vibeui-special-input-001-ok:oklch(0.72 0.17 155);
--vibeui-special-input-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="special-input-001"]{color-scheme:dark}
[data-vibeui-block="special-input-001"]{
width:100%;max-width:22rem;min-width:min(100%,16rem);margin-inline:auto;box-sizing:border-box;
display:flex;flex-direction:column;align-items:center;text-align:center;
min-height:21rem;padding:2rem 1.5rem 1.5rem;border-radius:1.4rem;
border:1px solid var(--vibeui-special-input-001-line);
background:var(--vibeui-special-input-001-bg);color:var(--vibeui-special-input-001-fg);
font-family:var(--vibeui-special-input-001-font);
box-shadow:0 20px 50px light-dark(oklch(0.5 0.02 60 / 0.12),oklch(0 0 0 / 0.4));
transition:border-color .4s ease,box-shadow .4s ease;
}
[data-vibeui-block="special-input-001"] *{box-sizing:border-box}
[data-vibeui-block="special-input-001"][data-phase="done"]{
border-color:oklch(from var(--vibeui-special-input-001-ok) l c h / 0.5);
box-shadow:0 20px 50px oklch(from var(--vibeui-special-input-001-ok) l c h / 0.2);
}
[data-vibeui-block="special-input-001"][data-phase="error"]{animation:vibeui-special-input-001-shake .45s ease}
@keyframes vibeui-special-input-001-shake{20%,60%{translate:-8px 0}40%,80%{translate:8px 0}}
[data-vibeui-block="special-input-001"] h2{margin:0;font-size:1.3rem;font-weight:700}
[data-vibeui-block="special-input-001"] [data-part="lead"]{margin:.4rem 0 0;font-size:.8125rem;line-height:1.45;color:var(--vibeui-special-input-001-muted);min-height:2.4em}
[data-vibeui-block="special-input-001"] [data-part="stage"]{position:relative;display:grid;place-items:center;width:100%;height:9rem;margin:.75rem 0}
[data-vibeui-block="special-input-001"] [data-part="cells"]{display:flex;gap:.7rem}
[data-vibeui-block="special-input-001"] [data-part="cells"] input{
width:3.1rem;height:3.5rem;padding:0;text-align:center;border-radius:.8rem;
border:1.5px solid var(--vibeui-special-input-001-line);outline:0;
background:var(--vibeui-special-input-001-cell);color:inherit;font:inherit;font-size:1.35rem;font-weight:700;
caret-color:var(--vibeui-special-input-001-accent);
box-shadow:0 4px 12px light-dark(oklch(0.5 0.02 60 / 0.1),oklch(0 0 0 / 0.3));
transition:border-color .2s ease,box-shadow .2s ease,transform .2s ease;
}
[data-vibeui-block="special-input-001"] [data-part="cells"] input:focus{
border-color:var(--vibeui-special-input-001-accent);transform:translateY(-2px);
box-shadow:0 0 0 4px oklch(from var(--vibeui-special-input-001-accent) l c h / 0.18);
}
[data-vibeui-block="special-input-001"] [data-part="cells"] input:not(:placeholder-shown){border-color:oklch(from var(--vibeui-special-input-001-accent) l c h / 0.55)}
/* Разлёт: каждая ячейка летит в свою точку по --x/--y/--r и кружится. */
[data-vibeui-block="special-input-001"][data-phase="scatter"] [data-part="cells"] input{
animation:vibeui-special-input-001-scatter 1.1s cubic-bezier(.5,0,.3,1) forwards;pointer-events:none;
}
@keyframes vibeui-special-input-001-scatter{
45%{transform:translate(var(--x),var(--y)) rotate(var(--r))}
100%{transform:translate(0,0) rotate(calc(var(--r) * 2)) scale(.2);opacity:0}
}
[data-vibeui-block="special-input-001"] [data-part="ring"]{
--vibeui-special-input-001-p:0;width:5rem;height:5rem;display:grid;place-items:center;border-radius:50%;
background:conic-gradient(var(--vibeui-special-input-001-accent) calc(var(--vibeui-special-input-001-p) * 1%),var(--vibeui-special-input-001-line) 0);
animation:vibeui-special-input-001-in .3s ease;
}
[data-vibeui-block="special-input-001"] [data-part="ring"]::before{
content:"";grid-area:1/1;width:4.1rem;height:4.1rem;border-radius:50%;background:var(--vibeui-special-input-001-bg);
}
[data-vibeui-block="special-input-001"] [data-part="ring"] span{grid-area:1/1;position:relative;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;color:var(--vibeui-special-input-001-accent)}
@keyframes vibeui-special-input-001-in{from{scale:.4;opacity:0}}
[data-vibeui-block="special-input-001"] [data-part="orb"]{
width:4.5rem;height:4.5rem;border-radius:50%;
background:radial-gradient(circle at 35% 30%,oklch(from var(--vibeui-special-input-001-ok) calc(l + 0.12) c h),var(--vibeui-special-input-001-ok));
box-shadow:0 0 40px oklch(from var(--vibeui-special-input-001-ok) l c h / 0.6),0 0 90px oklch(from var(--vibeui-special-input-001-ok) l c h / 0.35);
animation:vibeui-special-input-001-orb .6s ease;
}
@keyframes vibeui-special-input-001-orb{from{scale:.3}60%{scale:1.15}}
[data-vibeui-block="special-input-001"] [data-part="done"]{display:flex;flex-direction:column;align-items:center;gap:.8rem;animation:vibeui-special-input-001-in .35s ease}
[data-vibeui-block="special-input-001"] [data-part="check"]{
width:3.6rem;height:3.6rem;display:grid;place-items:center;border-radius:50%;
background:var(--vibeui-special-input-001-ok);color:oklch(1 0 0);
box-shadow:0 8px 24px oklch(from var(--vibeui-special-input-001-ok) l c h / 0.45);
}
[data-vibeui-block="special-input-001"] [data-part="check"] svg{width:1.7rem;height:1.7rem}
[data-vibeui-block="special-input-001"] [data-part="badge"]{
padding:.2rem .7rem;border-radius:999px;font-size:.625rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
background:var(--vibeui-special-input-001-ok);color:oklch(1 0 0);
}
[data-vibeui-block="special-input-001"] [data-part="resend"]{margin:auto 0 0;font-size:.75rem;color:var(--vibeui-special-input-001-muted)}
[data-vibeui-block="special-input-001"] [data-part="resend"] button{
appearance:none;border:0;padding:0;background:none;cursor:pointer;font:inherit;font-weight:600;color:var(--vibeui-special-input-001-accent);
}
[data-vibeui-block="special-input-001"] [data-part="resend"] button:hover{text-decoration:underline}
[data-vibeui-block="special-input-001"] :is(button):focus-visible{outline:2px solid var(--vibeui-special-input-001-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="special-input-001"],[data-vibeui-block="special-input-001"] *{animation:none!important;transition:none!important}}
`

// Точки разлёта для ячеек: по кругу вокруг центра, чтобы при любой длине кода
// ячейки не налетали друг на друга.
const SCATTER = [
  { x: "-2.5rem", y: "-3rem", r: "-160deg" },
  { x: "2.8rem", y: "-2.4rem", r: "190deg" },
  { x: "3.4rem", y: "2.2rem", r: "-210deg" },
  { x: "-2.9rem", y: "2.6rem", r: "170deg" },
  { x: "0rem", y: "-3.6rem", r: "230deg" },
  { x: "0rem", y: "3.4rem", r: "-190deg" },
]

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

/**
 * Ввод одноразового кода с анимированной проверкой: ячейки разлетаются,
 * кольцо считает проценты, сфера превращается в галочку «Проверено».
 */
export function SpecialInput001({
  length = 4,
  verify,
  onVerified,
  onResend,
  title = "Введите код доступа",
  lead = "Мы отправили 4-значный код на ваше устройство.",
  verifyingTitle = "Проверяем…",
  verifyingLead = "Сверяем код, это займёт пару секунд.",
  doneTitle = "Доступ открыт",
  doneLead = "С возвращением! Перенаправляем в кабинет…",
  badge = "Проверено",
  errorTitle = "Код не подошёл",
  errorLead = "Проверьте цифры и введите код ещё раз.",
  resendText = "Не пришёл код?",
  resendLabel = "Отправить снова",
  digitLabel = "Цифра",
  accent,
  background,
  className,
  style,
  ...props
}: SpecialInput001Props) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""))
  const [phase, setPhase] = useState<Phase>("input")
  const [percent, setPercent] = useState(0)
  const cells = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (phase === "input") cells.current[0]?.focus({ preventScroll: true })
  }, [phase])

  async function run(code: string) {
    setPhase("scatter")
    const result = Promise.resolve(verify ? verify(code) : true).catch(
      () => false,
    )
    await wait(1100)

    setPhase("verify")
    // Проценты идут к 90 за 1,5 с и замирают, пока verify не ответил.
    let finished = false
    result.then(() => (finished = true))
    await new Promise<void>((resolve) => {
      let started: number | null = null
      const tick = (time: number) => {
        started ??= time
        const progress = Math.min(1, (time - started) / 1500)
        const value =
          finished && progress === 1
            ? 100
            : Math.round(progress * 90 + (finished ? progress * 10 : 0))
        setPercent(value)
        if (value >= 100) resolve()
        else requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })

    if (!(await result)) {
      setPhase("error")
      await wait(450)
      setDigits(Array(length).fill(""))
      setPercent(0)
      setPhase("input")
      return
    }

    setPhase("orb")
    await wait(700)
    setPhase("done")
    onVerified?.(code)
  }

  function fill(from: number, value: string) {
    const chars = value.replace(/\D/g, "").split("")
    if (!chars.length) return
    const next = [...digits]
    chars
      .slice(0, length - from)
      .forEach((char, offset) => (next[from + offset] = char))
    setDigits(next)
    const target = Math.min(from + chars.length, length - 1)
    cells.current[target]?.focus()
    if (next.every(Boolean)) void run(next.join(""))
  }

  function handleKey(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault()
      const next = [...digits]
      next[index - 1] = ""
      setDigits(next)
      cells.current[index - 1]?.focus()
    }
    if (event.key === "ArrowLeft" && index > 0)
      cells.current[index - 1]?.focus()
    if (event.key === "ArrowRight" && index < length - 1)
      cells.current[index + 1]?.focus()
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    fill(index, event.clipboardData.getData("text"))
  }

  const heading =
    phase === "done"
      ? doneTitle
      : phase === "error"
        ? errorTitle
        : phase === "input"
          ? title
          : verifyingTitle
  const text =
    phase === "done"
      ? doneLead
      : phase === "error"
        ? errorLead
        : phase === "input"
          ? lead
          : verifyingLead

  const palette = {
    ...(accent ? { "--vibeui-special-input-001-accent": accent } : null),
    ...(background ? { "--vibeui-special-input-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-special-input-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="special-input-001"
        data-slot="otp"
        data-phase={phase}
        aria-label={title}
        className={className}
        style={palette}
      >
        <h2 aria-live="polite">{heading}</h2>
        <p data-part="lead">{text}</p>

        <div data-part="stage">
          {phase === "input" || phase === "scatter" || phase === "error" ? (
            <div data-part="cells" role="group" aria-label={title}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    cells.current[index] = element
                  }}
                  value={digit}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={length}
                  placeholder=" "
                  aria-label={`${digitLabel} ${index + 1}`}
                  readOnly={phase !== "input"}
                  style={
                    {
                      "--x": SCATTER[index % SCATTER.length].x,
                      "--y": SCATTER[index % SCATTER.length].y,
                      "--r": SCATTER[index % SCATTER.length].r,
                    } as CSSProperties
                  }
                  onChange={(event) => {
                    const value = event.target.value
                    if (!value) {
                      const next = [...digits]
                      next[index] = ""
                      setDigits(next)
                      return
                    }
                    fill(index, value.slice(-1))
                  }}
                  onKeyDown={(event) => handleKey(index, event)}
                  onPaste={(event) => handlePaste(index, event)}
                  onFocus={(event) => event.currentTarget.select()}
                />
              ))}
            </div>
          ) : null}

          {phase === "verify" ? (
            <div
              data-part="ring"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              style={
                { "--vibeui-special-input-001-p": percent } as CSSProperties
              }
            >
              <span>{percent}</span>
            </div>
          ) : null}

          {phase === "orb" ? <div data-part="orb" aria-hidden="true" /> : null}

          {phase === "done" ? (
            <div data-part="done">
              <span data-part="check">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
              </span>
              <span data-part="badge">{badge}</span>
            </div>
          ) : null}
        </div>

        {phase === "input" || phase === "error" ? (
          <p data-part="resend">
            {resendText}{" "}
            <button type="button" onClick={onResend}>
              {resendLabel}
            </button>
          </p>
        ) : null}
      </section>
    </>
  )
}

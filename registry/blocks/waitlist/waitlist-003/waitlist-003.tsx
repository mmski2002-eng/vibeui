import type { CSSProperties } from "react"

export type Waitlist003Props = {
  eyebrow?: string
  title?: string
  position?: number
  total?: number
  aheadNote?: string
  referralNote?: string
  referralCode?: string
  shareLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Экран после записи в лист ожидания: позиция в очереди крупной цифрой,
// полоса прогресса до начала списка и блок реферального кода «двигайся вверх
// за приглашения». Прогресс считается от position/total и выражается шириной
// заливки. Формат подтверждения записи, мотивирующий делиться ссылкой.
const STYLES = `
:where([data-vibeui-block="waitlist-003"]){
--vibeui-waitlist-003-bg:transparent;
--vibeui-waitlist-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-waitlist-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-waitlist-003-border:light-dark(oklch(0.86 0 0),oklch(0.36 0 0));
--vibeui-waitlist-003-track:light-dark(oklch(0.92 0 0),oklch(0.28 0 0));
--vibeui-waitlist-003-code:light-dark(oklch(0.97 0 0),oklch(0.2 0 0));
--vibeui-waitlist-003-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-waitlist-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-waitlist-003-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="waitlist-003"]{color-scheme:dark}
[data-vibeui-block="waitlist-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-waitlist-003-bg);color:var(--vibeui-waitlist-003-ink);
font-family:var(--vibeui-waitlist-003-font);
}
[data-vibeui-block="waitlist-003"] [data-part="shell"]{max-width:34rem;margin:0 auto;padding:3.5rem 1.25rem;text-align:center}
[data-vibeui-block="waitlist-003"] [data-part="eyebrow"]{margin:0 0 0.625rem;color:var(--vibeui-waitlist-003-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="waitlist-003"] [data-part="title"]{margin:0 0 1.5rem;font-size:clamp(1.5rem,5cqi,2.25rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="waitlist-003"] [data-part="pos"]{font-family:var(--vibeui-waitlist-003-mono);font-size:clamp(3rem,12cqi,4.5rem);font-weight:750;line-height:1;color:var(--vibeui-waitlist-003-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="waitlist-003"] [data-part="ahead"]{margin:0.5rem 0 1.75rem;color:var(--vibeui-waitlist-003-muted);font-size:0.9375rem}
[data-vibeui-block="waitlist-003"] [data-part="track"]{height:0.625rem;border-radius:999px;background:var(--vibeui-waitlist-003-track);overflow:hidden;margin-bottom:2rem}
[data-vibeui-block="waitlist-003"] [data-part="fill"]{height:100%;border-radius:999px;background:var(--vibeui-waitlist-003-accent);color:oklch(from var(--vibeui-waitlist-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="waitlist-003"] [data-part="ref-note"]{margin:0 0 0.75rem;font-size:0.9375rem;line-height:1.5}
[data-vibeui-block="waitlist-003"] [data-part="code"]{
display:flex;align-items:center;gap:0.75rem;justify-content:space-between;
padding:0.75rem 1rem;border:1px dashed var(--vibeui-waitlist-003-border);border-radius:0.75rem;
background:var(--vibeui-waitlist-003-code);
}
[data-vibeui-block="waitlist-003"] [data-part="code-value"]{font-family:var(--vibeui-waitlist-003-mono);font-size:0.9375rem;font-weight:650;letter-spacing:0.02em}
[data-vibeui-block="waitlist-003"] [data-part="code-btn"]{
border:0;background:var(--vibeui-waitlist-003-accent);color:oklch(from var(--vibeui-waitlist-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
padding:0.375rem 0.875rem;border-radius:0.5rem;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:650;
}
@container (min-width: 36rem){[data-vibeui-block="waitlist-003"] [data-part="shell"]{padding:4.5rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="waitlist-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/** Экран позиции в очереди: место крупной цифрой, прогресс и реферальный код. */
export function Waitlist003({
  eyebrow = "Вы в списке",
  title = "Ваше место в очереди",
  position = 1284,
  total = 5000,
  aheadNote = "человек впереди вас",
  referralNote = "Двигайтесь вверх: за каждого друга по ссылке вы поднимаетесь на 20 мест.",
  referralCode = "VIBE-1284",
  shareLabel = "Копировать",
  background = "",
  accent,
  className,
  style,
}: Waitlist003Props) {
  const done = Math.max(0, Math.min(100, ((total - position) / total) * 100))
  const palette = {
    ...(accent ? { "--vibeui-waitlist-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-waitlist-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-waitlist-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="waitlist-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="pos">#{position.toLocaleString("ru-RU")}</div>
          <p data-part="ahead">
            {(position - 1).toLocaleString("ru-RU")} {aheadNote}
          </p>
          <div
            data-part="track"
            role="progressbar"
            aria-valuenow={Math.round(done)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Прогресс очереди"
          >
            <div data-part="fill" style={{ width: `${done}%` }} />
          </div>
          <p data-part="ref-note">{referralNote}</p>
          <div data-part="code">
            <span data-part="code-value">{referralCode}</span>
            <button data-part="code-btn" type="button">
              {shareLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Cta008Props = {
  eyebrow?: string
  title?: string
  description?: string
  days?: string
  hours?: string
  minutes?: string
  daysLabel?: string
  hoursLabel?: string
  minutesLabel?: string
  actionLabel?: string
  actionHref?: string
  note?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Призыв с отсчётом: три плитки «дни — часы — минуты» над одной кнопкой.
// Отсчёт намеренно статический: цифры приходят пропсами, тикание — забота
// проекта. Серверный компонент с setInterval невозможен, а класть JS в
// registry-блок ради секундной стрелки — плохой размен.
const STYLES = `[data-vibeui-block="cta-008"] [data-part="heading"]{margin-bottom:2rem}

:where([data-vibeui-block="cta-008"]){
--vibeui-cta-008-bg:transparent;
--vibeui-cta-008-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-cta-008-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-cta-008-border:light-dark(oklch(0.88 0 0),oklch(0.34 0 0));
--vibeui-cta-008-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-cta-008-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-cta-008-button:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-cta-008-button-ink:oklch(from var(--vibeui-cta-008-button) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cta-008-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-008"]{color-scheme:dark}
[data-vibeui-block="cta-008"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-cta-008-bg);color:var(--vibeui-cta-008-ink);
font-family:var(--vibeui-cta-008-font);
}
[data-vibeui-block="cta-008"] [data-part="shell"]{
max-width:46rem;margin:0 auto;padding:3rem 1.25rem;text-align:center;
}
[data-vibeui-block="cta-008"] [data-part="timer"]{
display:flex;justify-content:center;align-items:stretch;gap:0.5rem;margin:0 0 2rem;
}
[data-vibeui-block="cta-008"] [data-part="unit"]{
min-width:4.5rem;padding:0.875rem 0.75rem;
border:1px solid var(--vibeui-cta-008-border);border-radius:0.875rem;
background:var(--vibeui-cta-008-card);
display:grid;gap:0.25rem;
}
[data-vibeui-block="cta-008"] [data-part="value"]{
font-size:clamp(1.5rem,6cqi,2.25rem);line-height:1;font-weight:750;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;color:var(--vibeui-cta-008-accent);
}
[data-vibeui-block="cta-008"] [data-part="unit-label"]{
color:var(--vibeui-cta-008-muted);font-size:0.6875rem;font-weight:600;
letter-spacing:0.08em;text-transform:uppercase;
}
[data-vibeui-block="cta-008"] [data-part="colon"]{
align-self:center;color:var(--vibeui-cta-008-muted);
font-size:1.5rem;font-weight:700;line-height:1;
}
[data-vibeui-block="cta-008"] [data-part="note"]{
margin:1rem auto 0;max-width:44ch;
color:var(--vibeui-cta-008-muted);font-size:0.8125rem;line-height:1.5;
}
@container (min-width: 34rem){
[data-vibeui-block="cta-008"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="cta-008"] [data-part="timer"]{gap:0.75rem}
[data-vibeui-block="cta-008"] [data-part="unit"]{min-width:5.75rem;padding:1.125rem 1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-008"] *{animation:none!important;transition:none!important}}
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

/** Призыв с отсчётом до дедлайна: три плитки времени и одна кнопка. */
export function Cta008({
  eyebrow = "Запуск тарифов",
  title = "Цена вырастет после запуска",
  description = "Каталог открыт по стартовой цене, пока идёт набор первых команд. После дедлайна тариф станет обычным — без исключений и промокодов.",
  days = "02",
  hours = "14",
  minutes = "45",
  daysLabel = "дней",
  hoursLabel = "часов",
  minutesLabel = "минут",
  actionLabel = "Забрать по старой цене",
  actionHref = "#pricing",
  note = "Цена фиксируется на год с момента оплаты.",
  background = "",
  accent,
  className,
  style,
}: Cta008Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-cta-008-accent": accent,
          "--vibeui-cta-008-button": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-cta-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const units = [
    { value: days, label: daysLabel },
    { value: hours, label: hoursLabel },
    { value: minutes, label: minutesLabel },
  ]

  return (
    <>
      <style href="vibeui-cta-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            lede={description}
            align="center"
            ledeWidth={48}
            accent={accent}
          />
          <div data-part="timer">
            {units.map((unit, index) => [
              index > 0 ? (
                <span
                  key={`${unit.label}-colon`}
                  data-part="colon"
                  aria-hidden="true"
                >
                  :
                </span>
              ) : null,
              <span key={unit.label} data-part="unit">
                <span data-part="value">{unit.value}</span>
                <span data-part="unit-label">{unit.label}</span>
              </span>,
            ])}
          </div>
          <Button016
            data-part="action"
            label={actionLabel}
            href={actionHref}
            external={false}
            size="lg"
            tone="accent"
            accent={accent}
          />
          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}

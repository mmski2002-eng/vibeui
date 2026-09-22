"use client"

import { useState, type CSSProperties, type FormEvent } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"

export type Waitlist001Props = {
  eyebrow?: string
  title?: string
  summary?: string
  placeholder?: string
  ctaLabel?: string
  count?: number
  countNote?: string
  successNote?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Форма раннего доступа со счётчиком записавшихся. Отправка — заглушка без
// бэкенда: по submit поле сменяется сообщением об успехе. Счётчик под формой
// подтверждает, что список живой. Формат приглашения в лист ожидания для
// первого экрана продукта, которого ещё нет в общем доступе.
const STYLES = `[data-vibeui-block="waitlist-001"] [data-part="heading"]{margin-bottom:0.75rem}

:where([data-vibeui-block="waitlist-001"]){
--vibeui-waitlist-001-bg:transparent;
--vibeui-waitlist-001-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-waitlist-001-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-waitlist-001-border:light-dark(oklch(0.86 0 0),oklch(0.36 0 0));
--vibeui-waitlist-001-field:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-waitlist-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-waitlist-001-on-accent:oklch(from var(--vibeui-waitlist-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-waitlist-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-waitlist-001-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="waitlist-001"]{color-scheme:dark}
[data-vibeui-block="waitlist-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-waitlist-001-bg);color:var(--vibeui-waitlist-001-ink);
font-family:var(--vibeui-waitlist-001-font);
}
[data-vibeui-block="waitlist-001"] [data-part="shell"]{max-width:34rem;margin:0 auto;padding:3.5rem 1.25rem;text-align:center}
[data-vibeui-block="waitlist-001"] [data-part="form"]{display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center}
/* Поле input-001 растягивается на остаток строки, кнопка — button-001. */
[data-vibeui-block="waitlist-001"] [data-part="form"] > [data-vibeui-block="input-001"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="waitlist-001"] [data-part="form"] > [data-vibeui-block="button-001"]{align-self:center}
[data-vibeui-block="waitlist-001"] [data-part="success"]{
margin:0;padding:0.875rem 1rem;border-radius:0.75rem;
background:color-mix(in oklab,var(--vibeui-waitlist-001-accent) 12%,transparent);
color:var(--vibeui-waitlist-001-accent);font-size:0.9375rem;font-weight:600;
}
[data-vibeui-block="waitlist-001"] [data-part="count"]{margin:1.25rem 0 0;color:var(--vibeui-waitlist-001-muted);font-size:0.875rem}
[data-vibeui-block="waitlist-001"] [data-part="count-num"]{color:var(--vibeui-waitlist-001-accent);font-weight:700;font-variant-numeric:tabular-nums}
@container (min-width: 36rem){[data-vibeui-block="waitlist-001"] [data-part="shell"]{padding:4.5rem 2rem}[data-vibeui-block="waitlist-001"] [data-part="form"]{flex-wrap:nowrap}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="waitlist-001"] *{animation:none!important;transition:none!important}}
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

/** Форма раннего доступа со счётчиком; submit сменяет поле сообщением об успехе. */
export function Waitlist001({
  eyebrow = "Ранний доступ",
  title = "Соберите список ожидания",
  summary = "Оставьте почту — напишем, как только откроем доступ. Без спама, одно письмо на запуск.",
  placeholder = "you@example.com",
  ctaLabel = "В список",
  count = 2400,
  countNote = "уже в очереди",
  successNote = "Готово! Вы в списке — напишем на запуске.",
  background = "",
  accent,
  className,
  style,
}: Waitlist001Props) {
  const [sent, setSent] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-waitlist-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-waitlist-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <>
      <style href="vibeui-waitlist-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="waitlist-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            align="center"
            accent={accent}
            lede={summary}
          />
          {sent ? (
            <p data-part="success" role="status">
              {successNote}
            </p>
          ) : (
            <form data-part="form" onSubmit={handleSubmit}>
              <Input001
                type="email"
                name="email"
                required
                label={placeholder}
                autoComplete="email"
                accent={accent}
              />
              <Button001 type="submit" size="lg" accent={accent}>
                {ctaLabel}
              </Button001>
            </form>
          )}
          <p data-part="count">
            <span data-part="count-num">{count.toLocaleString("ru-RU")}</span>{" "}
            {countNote}
          </p>
        </div>
      </section>
    </>
  )
}
